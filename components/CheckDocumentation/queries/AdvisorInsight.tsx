import React from "react";

import { CheckDocs, CheckGuidanceProps } from "../../../util/checks";

const AdvisorInsightGuidance: React.FunctionComponent<CheckGuidanceProps> = () => {
  return (
    <div>
      <p>
        Some common patterns that lead to suboptimal performance are found for
        this query. You can check out the exact pattern (insight) in the
        insights section of "Query Summary" panel. Tweaking this query may
        improve the performance of this query.
      </p>
      <h4>Next Steps</h4>
      <p>
        You can test a Query Advisor insight using Workbooks.
        <ul>
          <li>
            <h5>Create a new workbook and record the baseline</h5>
            <p>
              For each insight, there is a "Create Workbook" button to create a
              new workbook using this query. Create a new workbook using this
              button, then follow the steps to record the baseline. This step
              re-confirms that the insight still can be reproduced in the
              baseline too. If the query has multiple query plans, it's
              important to select the parameter set that matches to the query
              plan fingerprint of this insight.
            </p>
          </li>
          <li>
            <h5>Create a new variant</h5>
            <p>
              Once a new workbook is created and baseline is recorded, it's time
              to create a new variant. Each insight usually contains some
              remediation suggestion, usually by a query rewrite. You can apply
              this rewrite to the baseline query (current query), then record
              EXPLAIN plans of it. With this, you can check whether the rewrite
              improved performance and/or removed the existing insight.
            </p>
          </li>
        </ul>
      </p>
      <h4>Common Patterns</h4>
      <ul>
        <li>
          <h5>Inefficient Nested Loops</h5>
          <p>
            When the query planner chooses nested loops for joins where other
            strategies might be more efficient, Workbooks can help identify and
            resolve the issue.
          </p>
        </li>
        <li>
          <h5>ORDER BY + LIMIT causing wrong Index Selection</h5>
          <p>
            This pattern involves cases where ORDER BY combined with LIMIT leads
            to suboptimal index usage.
          </p>
        </li>
        <li>
          <h5>GROUP BY causing wrong Index Selection</h5>
          <p>
            This pattern occurs when GROUP BY operations lead to suboptimal
            index choices.
          </p>
        </li>
      </ul>
      For more details of each pattern, see
      <a href="https://pganalyze.com/docs/workbooks/query-optimization-examples">
        the Query Optimization Examples documentation
      </a>
      .
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Checks EXPLAIN Plans captured by Automated EXPLAIN and creates Query Advisor insights for tuning opportunities.",
  Trigger: null,
  Guidance: AdvisorInsightGuidance,
};

export default documentation;
