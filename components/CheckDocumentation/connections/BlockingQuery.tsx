import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";

import SQL from "../../SQL";

import { useSmartAnchor } from "../../SmartAnchor";

const BlockingQueryTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config,
}) => {
  return (
    <>
      <p>
        Detects queries currently blocking at least{" "}
        <code>{config.settings["blocked_count"]}</code> other queries. When any
        blocked query is running for longer than{" "}
        <code>{config.settings["warning_blocked_age_secs"]}</code> seconds,
        creates an issue with severity "warning". Escalates to "critical" if any
        blocked query continues to run longer than{" "}
        <code>{config.settings["critical_blocked_age_secs"]}</code> seconds.
        Resolves automatically once these queries complete or abort and release
        their locks.
      </p>
      <p>
        Ignores any blocking queries that contain the{" "}
        <code>/* pganalyze:no-alert */</code> or{" "}
        <code>/* pganalyze=no-alert */</code> magic comment.
      </p>
    </>
  );
};

const BlockingQueryGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { backendsUrl, SettingLink },
  issue,
}) => {
  const Link = useSmartAnchor();
  const issueDetails = issue && JSON.parse(issue.detailsJson);
  const showAutovacuum =
    !issueDetails || issueDetails["autovacuum_wraparound"];
  return (
    <div>
      <h4>Impact</h4>
      <p>
        Queries that hold contended locks for a significant period of time may
        end up preventing other queries from making progress. This can even
        block simple SELECT queries, and in some cases, it can affect overall
        system performance or it can cause the system to run out of connections.
      </p>
      <h4>Common Causes</h4>
      <ul>
        {showAutovacuum && (
          <li>
            <h5>Autovacuum (to prevent wraparound)</h5>
            <p>
              In general, autovacuum won't block other queries. If a query tries
              to acquire a lock that conflicts with a running autovacuum,
              autovacuum will be interrupted so that the query can proceed.
              However, if autovacuum is running to prevent transaction ID
              wraparound, it will not yield like this and will block other
              queries trying to acquire conflicting locks.
            </p>
          </li>
        )}
        <li>
          <h5>Long-running migration</h5>
          <p>
            If some of these queries are DDL that is part of a database
            migration, they may need to rewrite a table (e.g., changing the type
            of a column) or scan a whole table (e.g., <code>CREATE INDEX</code>{" "}
            without <code>CONCURRENTLY</code>), which can take much longer in
            production than in a staging or development environment. If your
            migration is transactional, consider canceling it and refactor it to
            avoid table rewrites.
          </p>
        </li>
        <li>
          <h5>Other long-running queries</h5>
          <p>
            A long running query could block other queries if it holds locks
            that they require to make progress. Navigate to the{" "}
            <Link to={backendsUrl}>Connection Traces</Link> page to check the
            overview of which query is blocking which queries to understand the
            impact. It is useful to know what kind of locks the blocking query
            is holding and what kind of locks the blocked queries are waiting
            for. You can check the wait event of these locks in the{" "}
            <strong>Wait Events</strong> page, with any wait events of type{" "}
            <strong>Lock</strong>. If you have{" "}
            <SettingLink setting="log_lock_waits" /> turned on, you can also see
            details about locking in the <strong>Logs</strong> page for these
            queries.
          </p>
          <p>
            You can run the queries like{" "}
            <SQL
              inline
              sql={`SELECT * FROM pg_locks WHERE pid = '<blocking_pid>';`}
            />{" "}
            to obtain more detailed lock information of the blocking query to
            see which locks the blocking query is holding. You can also run this
            query with the blocked query like{" "}
            <SQL
              inline
              sql={`SELECT * FROM pg_locks WHERE pid = '<blocked_pid>' WHERE NOT granted;`}
            />{" "}
            to see which locks it's waiting for. This information can be used to
            investigate why this has happened and how to change the query to
            prevent this from happening again in the future.
          </p>
        </li>
      </ul>
      <h4>Solution</h4>
      <p>
        You can cancel these queries with{" "}
        <SQL inline sql={`SELECT pg_cancel_backend('<query_pid>');`} />. Note
        that this only treats the symptom: if the query runs again without any
        changes, it is likely to acquire the same locks and block other queries
        again.
      </p>
      {showAutovacuum && (
        <p>
          If you're canceling an autovacuum to prevent wraparound, note that it
          does critical work. It will restart and need to be completed
          eventually, acquiring the same locks. Consider tuning your vacuum
          settings to be more aggressive to avoid the need for explicit vacuums
          to prevent wraparound.
        </p>
      )}
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "<p><b>(Available on Early Access Only)</b> Alerts on queries currently blocking at least the specified threshold queries, for longer than the specified threshold time. Auto-resolves once these queries complete or abort and release their locks.</p><p>Ignores any blocking queries that contain the <code>/* pganalyze:no-alert */</code> or <code>/* pganalyze=no-alert */</code> magic comment.</p>",
  Trigger: BlockingQueryTrigger,
  Guidance: BlockingQueryGuidance,
};

export default documentation;
