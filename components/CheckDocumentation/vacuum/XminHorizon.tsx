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
  const threshold = config.settings["behind_hours"] as number;
  const hourPluralized = threshold === 1 ? "hour" : "hours";
  return (
    <p>
      Detects when the xmin horizon on the server was assigned more than{" "}
      <code>{threshold}</code> {hourPluralized} ago and creates an issue with
      severity "warning". The issue will be created even if no VACUUM is
      currently blocked by this, as this will potentially block any future
      VACUUMs. Resolves once the assignment age of the xmin horizon is under the
      threshold.
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
    byBackend = heldBackBy.find((v: any) => v["type"] === "backend");
    byReplicationSlot = heldBackBy.find(
      (v: any) => v["type"] === "replication_slot"
    );
    byReplicationSlotCatalog = heldBackBy.find(
      (v: any) => v["type"] === "replication_slot_catalog"
    );
    byStandby = heldBackBy.find((v: any) => v["type"] === "standby");
    byPreparedXact = heldBackBy.find((v: any) => v["type"] === "prepared_xact");
  }
  const inApp = issue != null;
  const causeTitle = inApp
    ? heldBackBy.length > 1
      ? "Identified Causes and Solutions"
      : "Identified Cause and Solution"
    : "Common Causes and Solutions";
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
        When VACUUM is blocked and dead rows can't be cleaned, it can result in
        table bloat and slow queries.
      </p>
      <p>
        This xmin horizon is the oldest xmin of the server. While the xmin
        horizon could block dead rows to be cleaned, it's not necessary that all
        tables of the server will be impacted. Postgres can still clean up dead
        rows of tables that are unrelated to the xmin horizon. For example, if
        the xmin horizon is held back by the long running transaction of
        database1, Postgres can still clean up dead rows of tables in database2,
        as the transaction of database1 will never be able to see database2.
      </p>
      <h4>{causeTitle}</h4>
      <ul>
        <GuidanceByBackend inApp={inApp} heldBackInfo={byBackend} />
        <GuidanceByReplicationSlot
          inApp={inApp}
          heldBackInfo={byReplicationSlot}
          serverReplicationUrl={serverReplicationUrl}
        />
        <GuidanceByReplicationSlotCatalog
          inApp={inApp}
          heldBackInfo={byReplicationSlotCatalog}
          serverReplicationUrl={serverReplicationUrl}
        />
        <GuidanceByStandby inApp={inApp} heldBackInfo={byStandby} />
        <GuidanceByPreparedXact inApp={inApp} heldBackInfo={byPreparedXact} />
      </ul>
    </div>
  );
};

const GuidanceByBackend: React.FunctionComponent<{
  inApp: boolean;
  heldBackInfo: number | null;
}> = ({ inApp, heldBackInfo }) => {
  if (inApp && !heldBackInfo) {
    return null;
  }

  const CodeBlock = useCodeBlock();
  return (
    <li>
      <h5>Long-running transactions</h5>
      <p>
        Long-running transactions may still need to access rows that could
        otherwise be considered dead, so they can block cleanup.
      </p>
      <h6>
        <b>Solution</b>
      </h6>
      {heldBackInfo && (
        <p>
          A long running transaction is holding back the xmin horizon at{" "}
          <code>{heldBackInfo["xmin"]}</code>.
        </p>
      )}
      <p>
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
      <p>You can cancel it by running either of commands:</p>
      <CodeBlock>
        <SQL sql={`SELECT pg_cancel_backend('<query_pid>');`} />
      </CodeBlock>
    </li>
  );
};

const GuidanceByReplicationSlot: React.FunctionComponent<{
  inApp: boolean;
  heldBackInfo: number | null;
  serverReplicationUrl: string;
}> = ({ inApp, heldBackInfo, serverReplicationUrl }) => {
  if (inApp && !heldBackInfo) {
    return null;
  }

  const Link = useSmartAnchor();
  const CodeBlock = useCodeBlock();
  return (
    <li>
      <h5>Lagging or stale physical replication slots</h5>
      <p>
        With physical streaming replication with{" "}
        <code>hot_standby_feedback</code> is on, when replication is lagging or
        a replica server is stale (e.g. down), the oldest transaction that the
        replication slot needs the database to retain can be "stuck", holding
        back the xmin horizon.
      </p>
      <h6>
        <b>Solution</b>
      </h6>
      {heldBackInfo && (
        <p>
          A replication slot is holding back the xmin horizon at{" "}
          <code>{heldBackInfo["xmin"]}</code>.
        </p>
      )}
      <p>
        You can check the replication status on the{" "}
        <Link to={serverReplicationUrl}>Replication</Link> page.
      </p>
      <p>
        If the replication slot is no longer used, you can remove it by running
        the following command:
      </p>
      <CodeBlock>
        <SQL sql={`SELECT pg_drop_replication_slot('<slot_name>');`} />
      </CodeBlock>
    </li>
  );
};

const GuidanceByReplicationSlotCatalog: React.FunctionComponent<{
  inApp: boolean;
  heldBackInfo: number | null;
  serverReplicationUrl: string;
}> = ({ inApp, heldBackInfo, serverReplicationUrl }) => {
  if (inApp && !heldBackInfo) {
    return null;
  }

  const CodeBlock = useCodeBlock();
  const Link = useSmartAnchor();
  return (
    <li>
      <h5>Lagging or stale logical replication slots</h5>
      <p>
        With logical replication slots, replication can also get stale when DDL
        changes (database migrations) don't get applied to a replica server
        (subscriber). When the subscriber was unable to replicate data due to a
        schema mismatch, replication will error and get stale. This causes the
        xmin of the system catalogs of the primary (publisher) to be held back
        until replication resumes.
      </p>
      <h6>
        <b>Solution</b>
      </h6>
      {heldBackInfo && (
        <p>
          A replication slot is holding back the xmin horizon at{" "}
          <code>{heldBackInfo["xmin"]}</code>, specifically with system
          catalogs.
        </p>
      )}
      <p>
        You can check the replication status on the{" "}
        <Link to={serverReplicationUrl}>Replication</Link> page. You may also
        want to check logs on both the publisher and the subscriber for any
        error messages regarding logical replication, such as schema
        differences.
      </p>
      <p>
        If the replication slot is no longer used, remove it it by running the
        following command:
      </p>
      <CodeBlock>
        <SQL sql={`SELECT pg_drop_replication_slot('<slot_name>');`} />
      </CodeBlock>
    </li>
  );
};

const GuidanceByStandby: React.FunctionComponent<{
  inApp: boolean;
  heldBackInfo: number | null;
}> = ({ inApp, heldBackInfo }) => {
  if (inApp && !heldBackInfo) {
    return null;
  }

  const CodeBlock = useCodeBlock();
  return (
    <li>
      <h5>Long-running queries on standbys</h5>
      <p>
        When <code>hot_standby_feedback</code> is on with physical streaming
        replication, queries on standbys will hold back the xmin horizon just as
        if they were running on the primary.
      </p>
      <h6>
        <b>Solution</b>
      </h6>
      {heldBackInfo && (
        <p>
          A long running query on a standby is holding back the xmin horizon at{" "}
          <code>{heldBackInfo["xmin"]}</code>.
        </p>
      )}
      <p>
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
    </li>
  );
};

const GuidanceByPreparedXact: React.FunctionComponent<{
  inApp: boolean;
  heldBackInfo: number | null;
}> = ({ inApp, heldBackInfo }) => {
  if (inApp && !heldBackInfo) {
    return null;
  }

  const CodeBlock = useCodeBlock();
  return (
    <li>
      <h5>Abandoned prepared transactions</h5>
      <p>
        <a
          href="https://www.postgresql.org/docs/current/sql-prepare-transaction.html"
          target="_blank"
        >
          A transaction prepared for a two-phase commit
        </a>{" "}
        will prevent cleanup until it is either committed or rolled back.
      </p>
      <h6>
        <b>Solution</b>
      </h6>
      {heldBackInfo && (
        <p>
          A prepared transaction is holding back the xmin horizon at{" "}
          <code>{heldBackInfo["xmin"]}</code>.
        </p>
      )}
      <p>
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
        Once identified, you can either commit or cancel the transaction by
        running either of commands:
      </p>
      <CodeBlock>
        <SQL
          sql={`COMMIT PREPARED <gid_from_above>;
                ROLLBACK PREPARED <gid_from_above>;`}
        />
      </CodeBlock>
    </li>
  );
};

const documentation: CheckDocs = {
  description:
    "Monitors the xmin horizon of the server and creates a warning issue if the xmin horizon is behind.",
  Trigger: XminHorizonTrigger,
  Guidance: XminHorizonGuidance,
};

export default documentation;
