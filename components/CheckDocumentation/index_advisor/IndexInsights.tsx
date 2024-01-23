import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";

const IndexInsightsTrigger: React.FunctionComponent<CheckTriggerProps> = () => {
  return (
    <p>
      Detects when a table might be missing indexes based on the query workload
      over the last seven days and creates an issue with severity "info".
      Resolves once the recommended indexes have been created, or the workload has
      changed such that the indexes are no longer relevant.
    </p>
  );
};

const IndexInsightsGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  issue,
}) => {
  if (issue) {
    // The Index Insights check has dynamic guidance, so this component is not used in-app (aka when `issue` is present)
    return null;
  }
  return (
    <p>
      You can learn about Index Advisor and index insights in{" "}
      <a href="https://pganalyze.com/docs/index-advisor/reason-about-insights">
        the Index Advisor documentation
      </a>
      .
    </p>
  );
};

const documentation: CheckDocs = {
  description:
    "Detects when a table might be missing indexes based on the query workload.",
  Trigger: IndexInsightsTrigger,
  Guidance: IndexInsightsGuidance,
};

export default documentation;
