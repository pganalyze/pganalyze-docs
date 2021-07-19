import React from "react";

import { CheckDocs, CheckGuidanceProps, CheckTriggerProps } from "../../../util/checks";

import PGDocsLink from "../../PGDocsLink";
import { useSmartAnchor } from "../../SmartAnchor";

const SlownessTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config,
}) => {
  return (
    <>
      <p>
        Detects queries whose average execution time in the last 24 hours is
        over the specified threshold of{" "}
        <code>{config.settings["threshold_ms"]}ms</code> and creates an issue
        with severity "info".
      </p>
      <p>
        Ignores queries that are still running or that have executed fewer than{" "}
        <code>{config.settings["minimum_calls"]}</code> times.
      </p>
    </>
  );
};

const SlownessGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: {
    firstReferenceUrl,
    queriesUrl,
    serverSystemUrl,
    serverVacuumsUrl,
    databaseWaitEventsUrl,
    featureUrl,
  },
}) => {
  const Link = useSmartAnchor();
  return (
    <div>
      <h4>Impact</h4>
      <p>
        Slow queries usually consume more CPU or I/O resources; can hold locks,
        blocking other queries; and lead to bad user experience due to poor
        responsiveness in your application. They may also be symptoms of other
        issues like table bloat or hardware problems.
      </p>
      <h4>Common Causes</h4>
      <ul>
        <li>
          <h5>Slow system</h5>
          <p>
            If overall system performance is slow, due to either higher
            workload, operational issues, or hardware problems, this slow query
            may be just a symptom, and not a problem to fix directly. Check the
            current workload on the{" "}
            <Link to={queriesUrl}>Query Performance overview</Link>, check any
            wait events on the{" "}
            <Link to={databaseWaitEventsUrl}>Wait Events page</Link>, or check{" "}
            <Link to={serverSystemUrl}>System</Link> metrics for overall
            activity.
          </p>
        </li>
        <li>
          <h5>Missing index</h5>
          <p>
            If a query lacks the necessary indexes to execute efficiently, it
            may take longer and use more I/O than necessary, causing a negative
            impact on the whole system. Check the{" "}
            <Link to={featureUrl(firstReferenceUrl, 'indexcheck')}>query page</Link> to review
            indexing recommendations.
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
            ), the query may start performing poorly. You may need to change
            indexes, change the default or per-column{" "}
            <PGDocsLink path="/runtime-config-query.html#GUC-DEFAULT-STATISTICS-TARGET">
              statistics targets
            </PGDocsLink>
            , or{" "}
            <PGDocsLink path="/sql-createstatistics.html">
              create auxiliary statistics
            </PGDocsLink>{" "}
            to give Postgres more information about the distribution of the
            underlying data. You should also check{" "}
            <Link to={serverVacuumsUrl}>vacuum activity</Link> on the tables
            involved to make sure bloat is under control and that the tables
            have been analyzed recently.
          </p>
        </li>
        <li>
          <h5>Inefficient plan</h5>
          <p>
            The query may be executing slowly due to an inefficient plan for
            other reasons. Review the{" "}
            <Link to={featureUrl(firstReferenceUrl, 'explains')}>query execution plans</Link>{" "}
            and Explain Insights listed for the query.
          </p>
        </li>
      </ul>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    'Reviews query statistics data from the last 24 hours and creates an issue with severity "info" for new queries that are above the specified threshold on average. This check only takes queries into account that have finished executing.',
  Trigger: SlownessTrigger,
  Guidance: SlownessGuidance,
};

export default documentation;
