import SQL from "../../SQL";
import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";
import { useCodeBlock } from "../../CodeBlock";

const XminHorizonBehindTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config,
}) => {
  const threshold = config.settings["behind_days"] as number;
  const dayPluralized = threshold === 1 ? "day" : "days";
  return (
    <p>
      Detects when the xmin horizon on the server has not progressed for the
      last <code>{threshold}</code> {dayPluralized} and creates an issue with
      severity "info". Resolves once the xmin horizon makes some progress.
    </p>
  );
};

const XminHorizonBehindGuidance: React.FunctionComponent<
  CheckGuidanceProps
> = ({ issue }) => {
  const CodeBlock = useCodeBlock();
  const issueDetails = issue && JSON.parse(issue.detailsJson);
  const heldBackBy = issueDetails && issueDetails["held_back_by"];
  return (
    <div>
      <h4>Impact</h4>
      <p>
        The xmin horizon tells you until which point the vacuum process can
        clean up dead rows. When this value is behind and not making progress,
        it's very likely that VACUUM can't clean up dead rows, or process
        freezing.
      </p>
      <p>
        When dead rows can't be cleaned, it can result to the unnecessary table
        bloat or slow queries. If freezing is not happening in timely manner, it
        can result to the transaction wraparound, in the worst case scenario.
      </p>
      <h4>Common Causes</h4>
      <ul>
        <li>
          <h5>Long-running transactions</h5>
          <p>
            When there is a long running transaction, you can't clean up rows
            that the transaction can see, even if it already became a dead row.
          </p>
        </li>
        <li>
          <h5>Unfinished prepared transactions</h5>
          <p>
            If the transaction prepared for a two-phase commit is unfinished and
            kept around, it can become the oldest xmin.
          </p>
        </li>
        <li>
          <h5>Delayed/bad replication slots</h5>
          <p>
            When the replication is delayed or the standby server is down, the
            oldest transaction that the replication slot needs the database to
            retain can be "stuck" hence hold back of the xmin horizon can
            happen. This can also happen to the system catalogs.
          </p>
        </li>
        <li>
          <h5>Long-running transactions on standbys</h5>
          <p>
            When <code>hot_standby_feedback</code> is on, queries on standbys
            will act the same as primary regarding the xmin horizon, and causes
            the xmin horizon to be behind.
          </p>
        </li>
      </ul>
      <h4>Solution</h4>
      {heldBackBy["backend"] && (
        <>
          <p>
            The long running transaction is holding back the xmin horizon at{" "}
            <code>{heldBackBy["backend"]}</code>. You can find such transaction
            and its pid by running the following command:
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
            <SQL inline sql={`SELECT pg_cancel_backend('<query_pid>');`} /> or{" "}
            <SQL inline sql={`SELECT pg_terminate_backend('<query_pid>');`} />
          </p>
        </>
      )}
      {heldBackBy["replication_slot"] && (
        <p>
          The replication slot is holding back the xmin horizon at{" "}
          <code>{heldBackBy["replication_slot"]}</code>. This indicates that
          some physical (streaming) replication slot is likely either delayed or
          down. If the replication slot is no longer used, remove it with{" "}
          <SQL inline sql={`SELECT pg_drop_replication_slot('<slot_name>');`} />
        </p>
      )}
      {heldBackBy["replication_slot_catalog"] && (
        <p>
          The replication slot is holding back the xmin horizon at{" "}
          <code>{heldBackBy["replication_slot_catalog"]}</code>, specifically
          with the system catalogs. This indicates that the replication slot is
          either delayed, down, or having trouble replicating due to schema
          mismatch. If the replication slot is no longer used, remove it with{" "}
          <SQL inline sql={`SELECT pg_drop_replication_slot('<slot_name>');`} />
        </p>
      )}
      {heldBackBy["standby"] && (
        <>
          <p>
            The long running transaction on the standby is holding back the xmin
            horizon at <code>{heldBackBy["standby"]}</code>. You can find the{" "}
            <code>xmin</code> of all standby servers by running the following
            command:
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
      {heldBackBy["prepared_xact"] && (
        <>
          <p>
            The orphaned prepared transaction is holding back the xmin horizon
            at <code>{heldBackBy["prepared_xact"]}</code>. You can find such
            prepared transactions by running the following command:
          </p>
          <CodeBlock>
            <SQL
              sql={`SELECT gid, prepared, owner, database, transaction AS xmin
                  FROM pg_prepared_xacts
                  ORDER BY age(transaction) DESC;`}
            />
          </CodeBlock>
          <p>
            Once identified, you can cancel the transaction with{" "}
            <SQL inline sql={`ROLLBACK PREPARED <gid_from_above>`} />.
          </p>
        </>
      )}
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Monitors the xmin horizon of the server and creates an info issue if the xmin horizon is not making any progress.",
  Trigger: XminHorizonBehindTrigger,
  Guidance: XminHorizonBehindGuidance,
};

export default documentation;
