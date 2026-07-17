import React from "react";

import type {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";

const AdvisorInsightTrigger: React.FunctionComponent<CheckTriggerProps> = () => {
  return (
    <p>
      Detects queries whose execution plans from the last seven days contain a
      supported Query Advisor insight and creates an issue with severity "info".
      Currently detected problems are inefficient nested loops, wrong
      indexes due to <code>ORDER BY</code>, inefficient index use, late join
      filters with <code>OR</code>, or disk spills due to low{" "}
      <code>work_mem</code>.
      Ignores plans without a supported insight, and resolves automatically once
      the query's recent plans no longer show one.
    </p>
  );
};

const AdvisorInsightGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  issue,
}) => {
  if (issue) {
    // Advisor Insights has dynamic guidance, so this component is not used when
    // `issue` is present
    return null;
  }
  return (
    <div>
      <h4>Impact</h4>
      <p>
        A tuning opportunity means the query is running less efficiently than it
        could, using more CPU and I/O and taking longer than necessary. Each
        insight comes with a concrete suggestion (such as a query rewrite or
        a configuration change) that you can validate in a Workbook before
        applying it.
      </p>
      <p>
        You can learn about Query Advisor and the supported insight types in{" "}
        <a href="https://pganalyze.com/docs/query-advisor/insights">
          the Query Advisor documentation
        </a>
        .
      </p>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    'Reviews query execution plans collected over the last seven days and creates an issue with severity "info" when Query Advisor finds a tuning opportunity, such as an inefficient nested loop join or a sort that spills to disk. Requires the Query Advisor feature.',
  Trigger: AdvisorInsightTrigger,
  Guidance: AdvisorInsightGuidance,
};

export default documentation;
