import React from "react";

import { CheckDocs, CheckGuidanceProps, CheckTriggerProps } from "../../../util/checks";

import PGDocsLink from "../../PGDocsLink";

const EnableFeaturesTrigger: React.FunctionComponent<CheckTriggerProps> = ({}) => {
  return (
    <p>
      Detects when Postgres parameters that control query planning features are
      disabled for the entire server, and creates an issue with severity "info".
      Resolves once all planner features are enabled globally.
    </p>
  );
};

const EnableFeaturesGuidance: React.FunctionComponent<CheckGuidanceProps> = () => {
  return (
    <div>
      <h4>Impact</h4>
      <p>
        Postgres supports a number of ways to execute most queries, and has
        settings that can control which mechanisms are enabled. If a certain
        mechanism is being chosen but is not effective, it may be tempting to
        turn it off, but doing so will likely have unexpected impact on other
        (current or future) queries by preventing efficient plans.
      </p>
      <h4>Solution</h4>
      <p>
        Re-enable the setting and find another way to address the performance
        issues that led to the setting override in the first place. Consider
        these approaches:
      </p>
      <ul>
        <li>
          <h5>Rewrite queries</h5>
          <p>
            Rewriting your query more efficiently may naturally lead to a better
            plan. If the query has modest performance impact on your system and
            you have integrated Automated EXPLAIN, you can investigate a rewrite
            by opening an interactive session to your database, re-enabling the
            setting for the session with{" "}
            <PGDocsLink path="/sql-set.html">SET</PGDocsLink>, running the
            query, and reviewing the plan in pganalyze once it is available
            after a few minutes.
          </p>
        </li>
        <li>
          <h5>Ensure up-to-date stats</h5>
          <p>
            If the query is referencing tables for which ANALYZE has not run
            recently, it may lead to a bad plan. Check whether the queried
            tables have correct statistics, and possible tune your autovacuum
            ANALYZE settings or adjust statistics targets.
          </p>
        </li>
        <li>
          <h5>Optimize the schema</h5>
          <p>
            You may need to add indexes or use{" "}
            <PGDocsLink path="/sql-createstatistics.html">
              CREATE STATISTICS
            </PGDocsLink>{" "}
            to give Postgres more information about your data. You can run the
            query with the setting re-enabled, as above, and investigate index
            check recommendations.
          </p>
        </li>
        <li>
          <h5>Use session-local overrides</h5>
          <p>
            If the other approaches do not solve the problem, you can use
            session-local <PGDocsLink path="/sql-set.html">SET</PGDocsLink>{" "}
            commands instead to affect specific queries only. This gives you the
            same benefits without impacting other queries. Make sure you use{" "}
            <code>SET LOCAL</code> (if within a transaction) or use{" "}
            <code>RESET</code> after the query completes.
          </p>
        </li>
      </ul>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Alerts when Postgres planning features are disabled globally. This is typically not recommended, as it may cause bad plans and slow queries. Use session-local SET commands instead to affect specific queries only.",
  Trigger: EnableFeaturesTrigger,
  Guidance: EnableFeaturesGuidance,
};

export default documentation;
