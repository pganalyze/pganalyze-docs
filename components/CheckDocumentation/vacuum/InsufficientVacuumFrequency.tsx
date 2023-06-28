import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";
import { formatBytes } from "../../../util/format";

const InsufficientVacuumFrequencyTrigger: React.FunctionComponent<
  CheckTriggerProps
> = ({ config }) => {
  return (
    <p>
      Detects when insufficient VACUUM frequency leads to avoidable growth in a
      table. It analyzes the table statistic from the past seven days and
      calculates the amount of rows that could have been avoided to grow if
      VACUUM had been performed more frequently. Creates an issue when such rows
      exceeds <code>{config.settings["notify_pct"]}%</code> of total new rows,
      as well as{" "}
      <code>{formatBytes(Number(config.settings["notify_bytes"]))}</code>{" "}
      accumulated. Resolves once such growth decreases.
    </p>
  );
};

const InsufficientVacuumFrequencyGuidance: React.FunctionComponent<
  CheckGuidanceProps
> = () => {
  // InsufficientVacuumFrequency uses a similar pattern as MissingIndex.
  return null;
};

const documentation: CheckDocs = {
  description:
    "Detects when insufficient VACUUM frequency leads to avoidable growth in a table.",
  Trigger: InsufficientVacuumFrequencyTrigger,
  Guidance: InsufficientVacuumFrequencyGuidance,
};

export default documentation;
