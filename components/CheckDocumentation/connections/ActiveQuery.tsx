import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
  IssueReferenceBackend,
} from "../../../util/checks";

import PGDocsLink from "../../PGDocsLink";
import SQL from "../../SQL";
import { useSmartAnchor } from "../../SmartAnchor";

const ActiveQueryTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config,
}) => {
  return (
    <>
      <p>
        Detects queries currently running for longer than the specified
        threshold of{" "}
        <code>{config.settings["warning_max_query_age_secs"]}</code> seconds and
        creates an issue with severity "warning". Escalates to "critical" if the
        query is still running after{" "}
        <code>{config.settings["critical_max_query_age_secs"]}</code> seconds.
        Resolves automatically once the query stops running.
      </p>
      <p>
        Ignores queries from backup programs (<code>pg_dump</code>,{" "}
        <code>Heroku Postgres Backups</code>), as well as any queries that
        contain the <code>/* pganalyze:no-alert */</code> or{" "}
        <code>/* pganalyze=no-alert */</code> magic comment.
      </p>
    </>
  );
};

const ActiveQueryGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { referenceUrl, serverVacuumsUrl, SettingLink, featureUrl, },
  issue,
}) => {
  const Link = useSmartAnchor();
  return (
    <div>
      <h4>Impact</h4>
      <p>
        Long-running queries can hold locks, blocking other queries. They can
        prevent VACUUM (including autovacuum) from cleaning up dead rows,
        leading to table or index bloat. They may also be consuming a lot of I/O
        or CPU resources, impacting overall performance.
      </p>
      <h4>Common Causes</h4>
      <ul>
        <li>
          <h5>Locks</h5>
          <p>
            The query may be waiting for a lock. Check the{" "}
            <Link to={featureUrl(referenceUrl, 'wait_events')}>Wait Events</Link> page for
            the associated backend for any wait events of type Lock. If you have{" "}
            <SettingLink setting="log_lock_waits" /> turned on, you can also see
            details about locking in the{" "}
            <Link to={featureUrl(referenceUrl, 'logs')}>logs page</Link> for the backend.
          </p>
        </li>
        <li>
          <h5>Long-running migration</h5>
          <p>
            If this query is DDL that is part of a database migration, it may
            need to rewrite a table (e.g., changing the type of a column) or
            scan the whole table (e.g., <code>CREATE INDEX</code> without{" "}
            <code>CONCURRENTLY</code>), which can take much longer in production
            than in a staging or development environment. If your migration is
            transactional, consider canceling it and refactor it to avoid table
            rewrites.
          </p>
        </li>
        {/*
         N.B.: the two items below are mostly copied from queries/slowness check guidance, though we
         need to treat the links differently because here the reference is the backend, not the query
      */}
        <li>
          <h5>Missing index</h5>
          <p>
            If a query lacks the necessary indexes to execute efficiently, it
            may take longer and use more I/O than necessary, causing a negative
            impact on the whole system. Check the the Index Check tab for the{" "}
            <Link to={featureUrl(referenceUrl, 'queries')}>query</Link> to review indexing
            recommendations.
          </p>
        </li>
        <li>
          <h5>Data changes</h5>
          <p>
            If the the data accessed by a query changes dramatically (either
            grows in size or changes in terms of{" "}
            <PGDocsLink path="/planner-stats.html">
              statistics relevant to query planning
            </PGDocsLink>
            ), the query may start performing poorly. You may need to review the
            EXPLAIN plans for{" "}
            <Link to={featureUrl(referenceUrl, 'queries')}>the query</Link>, change
            indexes, or create auxiliary statistics to give Postgres more
            information about the distribution of the underlying data. You
            should also check <Link to={serverVacuumsUrl}>vacuum activity</Link>{" "}
            on the tables involved to make sure bloat is under control and that
            the tables have been analyzed recently.
          </p>
        </li>
      </ul>
      <h4>Solution</h4>
      <p>
        If you've confirmed the query is causing problems, you can cancel it
        with{" "}
        <SQL
          inline
          sql={`SELECT pg_cancel_backend(${
            (issue?.reference?.object as IssueReferenceBackend)?.pid ??
            '"<query_pid>"'
          });`}
        />
        . Note that this only treats the symptom: if the query runs again
        without any changes, it is likely to run slowly again.
      </p>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "<p>Alerts on connections currently in the <code>active</code> state, that have had a query running longer than the specified threshold. This check only triggers on queries that are currently running and auto-resolves once the queries stop running.</p><p>Queries from backup programs (<code>pg_dump</code>, <code>Heroku Postgres Backups</code>) are ignored, as well as any queries that contain the <code>/* pganalyze:no-alert */</code> or <code>/* pganalyze=no-alert */</code> magic comment.</p>",
  Trigger: ActiveQueryTrigger,
  Guidance: ActiveQueryGuidance,
};

export default documentation;
