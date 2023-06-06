import SQL from "../../SQL";
import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";
import { useCodeBlock } from "../../CodeBlock";

const XminHorizonTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config,
}) => {
  const threshold = config.settings["behind_days"] as number;
  const dayPluralized = threshold === 1 ? "day" : "days";
  return (
    <p>
      Detects when the xmin horizon on the server has not progressed for the
      last <code>{threshold}</code> {dayPluralized} and creates an issue with
      severity "info". The issue will be created even if no VACUUM is currently
      blocked by this, as this will potentially block any future VACUUMs.
      Resolves once the xmin horizon makes some progress.
    </p>
  );
};

const XminHorizonGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  issue,
}) => {
  const CodeBlock = useCodeBlock();
  const issueDetails = issue && JSON.parse(issue.detailsJson);
  const heldBackBy = issueDetails && issueDetails["held_back_by"];
  let byBackend = null;
  let byReplicationSlot = null;
  let byReplicationSlotCatalog = null;
  let byStandby = null;
  let byPreparedXact = null;
  if (heldBackBy) {
    byBackend = heldBackBy.find((v) => v["type"] === "backend");
    byReplicationSlot = heldBackBy.find(
      (v) => v["type"] === "replication_slot"
    );
    byReplicationSlotCatalog = heldBackBy.find(
      (v) => v["type"] === "replication_slot_catalog"
    );
    byStandby = heldBackBy.find((v) => v["type"] === "standby");
    byPreparedXact = heldBackBy.find((v) => v["type"] === "prepared_xact");
  }
  return (
    <div>
      <h4>Impact</h4>
      <p>VACUUM is potentially blocked by the xmin horizon.</p>
      <p>
        The xmin horizon tells you up to which point the vacuum process can
        clean up dead rows. When this value is behind and not advancing, VACUUMs
        will be blocked and will not be able to clean up dead rows.
      </p>
      <p>
        When VACUUM is blocked and dead rows can't be cleaned, it can result to
        the unnecessary table bloat or slow queries.
      </p>
      <h4>Common Causes</h4>
      <ul>
        <li>
          <h5>Long-running transactions</h5>
          <p>
            Long-running transactions may still need to access rows that could
            otherwise be considered dead, so they can block cleanup.
          </p>
        </li>
        <li>
          <h5>Lagging or stale replication slots</h5>
          <p>
            When replication is lagging or a replica server is stale (e.g. down,
            gone), the oldest transaction that the replication slot needs the
            database to retain can be "stuck", holding back the xmin horizon.
            This can also happen to the system catalogs.
          </p>
        </li>
        <li>
          <h5>Long-running transactions on standbys</h5>
          <p>
            When <code>hot_standby_feedback</code> is on, queries on standbys
            will hold back the xmin horizon just as if they were running on the
            primary.
          </p>
        </li>
        <li>
          <h5>Abandoned prepared transactions</h5>
          <p>
            A transaction prepared for a two-phase commit will prevent cleanup
            until it is either committed or rolled back.
          </p>
        </li>
      </ul>
      {heldBackBy && (
        <>
          <h4>Solution</h4>
          {byBackend && (
            <>
              <p>
                A long running transaction is holding back the xmin horizon at{" "}
                <code>{byBackend["xmin"]}</code>. You can find this transaction
                and its connection's pid by running the following command:
              </p>
              <CodeBlock>
                <SQL
                  sql={`SELECT pid, datname, usename, state, backend_xmin, backend_xid
                  FROM pg_stat_activity
                  WHERE backend_xmin IS NOT NULL OR backend_xid IS NOT NULL
                  ORDER BY greatest(age(backend_xmin), age(backend_xid)) DESC;`}
                />
              </CodeBlock>
              <p>
                You can cancel it with{" "}
                <SQL inline sql={`SELECT pg_cancel_backend('<query_pid>');`} />{" "}
                or{" "}
                <SQL
                  inline
                  sql={`SELECT pg_terminate_backend('<query_pid>');`}
                />
                .
              </p>
            </>
          )}
          {byReplicationSlot && (
            <p>
              A replication slot is holding back the xmin horizon at{" "}
              <code>{byReplicationSlot["xmin"]}</code>. This indicates that some
              physical (streaming) replication slot is likely either lagging or
              stale (e.g. down, gone). If the replication slot is no longer
              used, remove it with{" "}
              <SQL
                inline
                sql={`SELECT pg_drop_replication_slot('<slot_name>');`}
              />
              .
            </p>
          )}
          {byReplicationSlotCatalog && (
            <p>
              The replication slot is holding back the xmin horizon at{" "}
              <code>{byReplicationSlotCatalog["xmin"]}</code>, specifically with
              system catalogs. This indicates that the replication slot is
              either lagging, stale (e.g. down, gone), or having trouble
              replicating due to schema mismatch. If the replication slot is no
              longer used, remove it with{" "}
              <SQL
                inline
                sql={`SELECT pg_drop_replication_slot('<slot_name>');`}
              />
              .
            </p>
          )}
          {byStandby && (
            <>
              <p>
                A long running transaction on a standby is holding back the xmin
                horizon at <code>{byStandby["xmin"]}</code>. You can find the{" "}
                <code>xmin</code> of all standby servers by running the
                following command:
              </p>
              <CodeBlock>
                <SQL
                  sql={`SELECT application_name, client_addr, backend_xmin
                  FROM pg_stat_replication
                  ORDER BY age(backend_xmin) DESC;`}
                />
              </CodeBlock>
            </>
          )}
          {byPreparedXact && (
            <>
              <p>
                A prepared transaction is holding back the xmin horizon at{" "}
                <code>{byPreparedXact["xmin"]}</code>. You can find this
                prepared transaction by running the following command:
              </p>
              <CodeBlock>
                <SQL
                  sql={`SELECT gid, prepared, owner, database, transaction AS xmin
                  FROM pg_prepared_xacts
                  ORDER BY age(transaction) DESC;`}
                />
              </CodeBlock>
              <p>
                Once identified, you can either commit or cancel the transaction
                with <SQL inline sql={`COMMIT PREPARED <gid_from_above>`} /> or
                <SQL inline sql={`ROLLBACK PREPARED <gid_from_above>`} />.
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Monitors the xmin horizon of the server and creates an info issue if the xmin horizon is not making any progress.",
  Trigger: XminHorizonTrigger,
  Guidance: XminHorizonGuidance,
};

export default documentation;
