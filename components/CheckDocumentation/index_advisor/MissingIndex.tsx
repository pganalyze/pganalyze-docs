import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";

const MissingIndexTrigger: React.FunctionComponent<CheckTriggerProps> = () => {
  return (
    <p>
      Detects when a table might be missing an index based on the query workload
      over the last seven days and creates an issue with severity "info".
      Resolves once the recommended index has been created, or the workload has
      changed such that the index is no longer relevant.
    </p>
  );
};

const MissingIndexGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  issue,
}) => {
  if (issue) {
    // The Missing Index check has dynamic guidance, so this component is not used in-app (aka when `issue` is present)
    return null;
  }
  return (
    <p>
      You can learn about Index Advisor and missing index opportunities in{" "}
      <a href="https://pganalyze.com/docs/index-advisor/reason-about-opportunities">
        Index Advisor documentation
      </a>
      .
    </p>
  );
};

const documentation: CheckDocs = {
  description:
    "Detects when a table might be missing an index based on the query workload.",
  Trigger: MissingIndexTrigger,
  Guidance: MissingIndexGuidance,
};

export default documentation;
