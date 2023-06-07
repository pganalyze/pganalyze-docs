import SQL from "../../SQL";
import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";
import { useCodeBlock } from "../../CodeBlock";
import { useSmartAnchor } from "../../SmartAnchor";

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
  urls: { serverReplicationUrl },
  issue,
}) => {
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
  const inApp = heldBackBy === null;
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
      <h4>Common Causes and Solutions</h4>
      <GuidanceByBackend inApp={inApp} xmin={byBackend && byBackend["xmin"]} />
      <GuidanceByReplicationSlot
        inApp={inApp}
        xmin={byReplicationSlot && byReplicationSlot["xmin"]}
        serverReplicationUrl={serverReplicationUrl}
      />
      <GuidanceByReplicationSlotCatalog
        inApp={inApp}
        xmin={byReplicationSlotCatalog && byReplicationSlotCatalog["xmin"]}
        serverReplicationUrl={serverReplicationUrl}
      />
      <GuidanceByStandby inApp={inApp} xmin={byStandby && byStandby["xmin"]} />
      <GuidanceByPreparedXact
        inApp={inApp}
        xmin={byPreparedXact && byPreparedXact["xmin"]}
      />
    </div>
  );
};

const GuidanceByBackend: React.FunctionComponent<{
  inApp: boolean;
  xmin: number;
}> = ({ inApp, xmin }) => {
  if (!inApp && xmin === null) {
    return null;
  }

  const CodeBlock = useCodeBlock();
  return (
    <>
      <h5>Long-running transactions</h5>
      <p>
        Long-running transactions may still need to access rows that could
        otherwise be considered dead, so they can block cleanup.
      </p>
      <h6>Solution</h6>
      <p>
        {xmin &&
          `A long running transaction is holding back the xmin horizon at ${(
            <code>{xmin}</code>
          )}.`}
        You can find the transaction holding back the xmin horizon and its
        connection's pid by running the following command:
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
        <SQL inline sql={`SELECT pg_terminate_backend('<query_pid>');`} />.
      </p>
    </>
  );
};

const GuidanceByReplicationSlot: React.FunctionComponent<{
  inApp: boolean;
  xmin: number;
  serverReplicationUrl: string;
}> = ({ inApp, xmin, serverReplicationUrl }) => {
  if (!inApp && xmin === null) {
    return null;
  }

  const Link = useSmartAnchor();
  return (
    <>
      <h5>Lagging or stale physical replication slots</h5>
      <p>
        With physical streaming replication with{" "}
        <code>hot_standby_feedback</code> is on, when replication is lagging or
        a replica server is stale (e.g. down, gone), the oldest transaction that
        the replication slot needs the database to retain can be "stuck",
        holding back the xmin horizon.
      </p>
      <h6>Solution</h6>
      <p>
        {xmin &&
          `A replication slot is holding back the xmin horizon at ${(
            <code>{xmin}</code>
          )}.`}
        You can check the replication status on the{" "}
        <Link to={serverReplicationUrl}>Replication</Link> page.
      </p>
      <p>
        If the replication slot is no longer used, remove it with{" "}
        <SQL inline sql={`SELECT pg_drop_replication_slot('<slot_name>');`} />.
      </p>
    </>
  );
};

const GuidanceByReplicationSlotCatalog: React.FunctionComponent<{
  inApp: boolean;
  xmin: number;
  serverReplicationUrl: string;
}> = ({ inApp, xmin, serverReplicationUrl }) => {
  if (!inApp && xmin === null) {
    return null;
  }

  const Link = useSmartAnchor();
  return (
    <>
      <h5>Lagging or stale logical replication slots</h5>
      <p>
        With logical replication slots, replication can also get stale when DDL
        changes (database migrations) don't get applied to a replica server
        (subscriber). When the subscriber was unable to replicate data due to a
        schema mismatch, replication will error and get stale. This causes the
        system catalogs xmin of the primary (publisher) to be held back until
        replication resumes.
      </p>
      <h6>Solution</h6>
      <p>
        {xmin &&
          `A replication slot is holding back the xmin horizon at ${(
            <code>{xmin}</code>
          )}, specifically with system catalogs.`}
        You can check the replication status on the{" "}
        <Link to={serverReplicationUrl}>Replication</Link> page. You may also
        want to check logs on both the publisher and the subscriber for any
        error messages regarding logical replication, such as schema
        differences.
      </p>
      <p>
        If the replication slot is no longer used, remove it with{" "}
        <SQL inline sql={`SELECT pg_drop_replication_slot('<slot_name>');`} />.
      </p>
    </>
  );
};

const GuidanceByStandby: React.FunctionComponent<{
  inApp: boolean;
  xmin: number;
}> = ({ inApp, xmin }) => {
  if (!inApp && xmin === null) {
    return null;
  }

  const CodeBlock = useCodeBlock();
  return (
    <>
      <h5>Long-running queries on standbys</h5>
      <p>
        When <code>hot_standby_feedback</code> is on with physical streaming
        replication, queries on standbys will hold back the xmin horizon just as
        if they were running on the primary.
      </p>
      <h6>Solution</h6>
      <p>
        {xmin ??
          `A long running query on a standby is holding back the xmin
          horizon at
                ${(<code>{xmin}</code>)}.`}
        You can find the <code>xmin</code> of all standby servers by running the
        following command:
      </p>
      <CodeBlock>
        <SQL
          sql={`SELECT application_name, client_addr, backend_xmin
                  FROM pg_stat_replication
                  ORDER BY age(backend_xmin) DESC;`}
        />
      </CodeBlock>
      <p>
        Once the standby is identified, you can find the query holding back the
        xmin horizon and its connection's pid in that standby by running the
        following command:
      </p>
      <CodeBlock>
        <SQL
          sql={`SELECT pid, datname, usename, state, backend_xmin, backend_xid
                  FROM pg_stat_activity
                  WHERE backend_xmin IS NOT NULL OR backend_xid IS NOT NULL
                  ORDER BY greatest(age(backend_xmin), age(backend_xid)) DESC;`}
        />
      </CodeBlock>
    </>
  );
};

const GuidanceByPreparedXact: React.FunctionComponent<{
  inApp: boolean;
  xmin: number;
}> = ({ inApp, xmin }) => {
  if (!inApp && xmin === null) {
    return null;
  }

  const CodeBlock = useCodeBlock();
  return (
    <>
      <h5>Abandoned prepared transactions</h5>
      <p>
        A transaction prepared for a two-phase commit will prevent cleanup until
        it is either committed or rolled back.
      </p>
      <h6>Solution</h6>
      <p>
        {xmin &&
          `A prepared transaction is holding back the xmin horizon at ${(
            <code>{xmin}</code>
          )}.`}
        You can find the prepared transaction by running the following command:
      </p>
      <CodeBlock>
        <SQL
          sql={`SELECT gid, prepared, owner, database, transaction AS xmin
                  FROM pg_prepared_xacts
                  ORDER BY age(transaction) DESC;`}
        />
      </CodeBlock>
      <p>
        Once identified, you can either commit or cancel the transaction with{" "}
        <SQL inline sql={`COMMIT PREPARED <gid_from_above>`} /> or
        <SQL inline sql={`ROLLBACK PREPARED <gid_from_above>`} />.
      </p>
    </>
  );
};

const documentation: CheckDocs = {
  description:
    "Monitors the xmin horizon of the server and creates an info issue if the xmin horizon is not making any progress.",
  Trigger: XminHorizonTrigger,
  Guidance: XminHorizonGuidance,
};

export default documentation;
