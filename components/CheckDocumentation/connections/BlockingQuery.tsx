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
        Detects queries currently blocking more than the specified threshold of{" "}
        <code>{config.settings["blocked_count"]}</code> queries. When the oldest
        blocked query is running for longer than the specified threshold of{" "}
        <code>{config.settings["warning_blocked_age_secs"]}</code> seconds,
        creates an issue with severity "warning". Escalates to "critical" if the
        oldest blocked query continues to run longer than{" "}
        <code>{config.settings["critical_blocked_age_secs"]}</code> seconds.
        Resolves automatically once these queries stop meeting the criteria.
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
  const showAutovacuum = issueDetails?.["has_autovacuum_to_prevent_wraparound"];
  return (
    <div>
      <h4>Impact</h4>
      <p>
        Queries that are blocking many other queries for certain amount of time
        likely holding some strong locks. These queries can block some trivial
        SELECT queries sometimes, which can cause the whole system down. They
        can also prevent VACUUM (including autovacuum) from cleaning up dead
        rows, leading to table or index bloat. They may also be consuming a lot
        of I/O or CPU resources, impacting overall performance.
      </p>
      <h4>Common Causes</h4>
      <ul>
        {showAutovacuum && (
          <li>
            <h5>Autovacuum (to prevent wraparound)</h5>
            <p>
              In general, autovacuum workers don't block other queries. Even if
              the other query tries to acquire a lock that conflicts with the
              running autovacuum, lock acquisition will interrupt the
              autovacuum. However, if the autovacuum is running to prevent
              transaction ID wraparound, the vacuum won't be interrupted and
              will block other queries trying to acquire conflicting locks.
            </p>
          </li>
        )}
        <li>
          <h5>Locks</h5>
          <p>
            The queries may be holding some strong locks. Check the{" "}
            <Link to={backendsUrl}>Connection Traces</Link> page for the queries
            these queries are blocking. You can check{" "}
            <strong>Wait Events</strong> page for the queries waiting for these
            blocking queries, and look for any wait events of type{" "}
            <strong>Lock</strong>. If you have{" "}
            <SettingLink setting="log_lock_waits" /> turned on, you can also see
            details about locking in the <strong>Logs</strong> page for these
            queries.
          </p>
          <p>
            <code>ACCESS EXCLUSIVE</code> lock xis the strongest lock that can
            even block a <code>SELECT</code> query. This lock is acquired by the
            commands like <code>VACUUM FULL</code>. One of the table-rewriting
            variants of <code>ALTER TABLE</code> also acquire a lock at this
            level.
          </p>
        </li>
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
      </ul>
      <h4>Solution</h4>
      <p>
        You can cancel these queries with{" "}
        <SQL inline sql={`SELECT pg_cancel_backend('<query_pid>');`} />. Note
        that this only treats the symptom: if the query runs again without any
        changes, it is likely to cause the blocking.
      </p>
      {showAutovacuum && (
        <p>
          If you're canceling the autovacuum, please note that the autovacuum to
          prevent wraparound is really important to run and it will most likely
          come back.
        </p>
      )}
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "<p><b>(Available on Early Access Only)</b> Alerts on queries currently blocking more than the specified threshold queries for longer than the specified threshold time. This check only triggers on queries that are currently meeting both criteria and auto-resolves once the queries stop meeting the criteria.</p><p>Ignores any blocking queries that contain the <code>/* pganalyze:no-alert */</code> or <code>/* pganalyze=no-alert */</code> magic comment.</p>",
  Trigger: BlockingQueryTrigger,
  Guidance: BlockingQueryGuidance,
};

export default documentation;
