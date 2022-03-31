import React from "react";

import { CheckDocs, CheckGuidanceProps, CheckTriggerProps } from "../../../util/checks";

const MissingIndexTrigger: React.FunctionComponent<CheckTriggerProps> = () => {
  return (
    <p>
      Detects when a table might be missing an index based on the query workload over the last
      seven days and creates an issue with severity "info". Resolves once the recommended index
      has been created, or the workload has changed such that the index is no longer relevant.
    </p>
  );
};

const MissingIndexGuidance: React.FunctionComponent<CheckGuidanceProps> = () => {
  // TODO: the Missing Index check has dynamic guidance, so this component is not used in-app,
  // but we still need something for the public documentation (possibly linking to other Index
  // Advisor docs).
  return null;
};

const documentation: CheckDocs = {
  description: "Detects when a table might be missing an index based on the query workload.",
  Trigger: MissingIndexTrigger,
  Guidance: MissingIndexGuidance,
};

export default documentation;
