import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";
import { formatBytes } from "../../../util/format";

const UnnecessaryTableGrowthTrigger: React.FunctionComponent<
  CheckTriggerProps
> = ({ config }) => {
  return (
    <p>
      Detects when a table has experienced unnecessary growth due to
      insufficient VACUUM. It analyzes the table statistic from the past seven
      days and calculates the amount of growth that could have been avoided if
      VACUUM had been performed more frequently. Creates an issue when the
      unnecessary growth exceeds{" "}
      <code>{formatBytes(Number(config.settings["notify_bytes"]))}</code>, as
      well as <code>{config.settings["notify_pct"]}%</code> of the current size.
      Resolves once the unnecessary growth decreases.
    </p>
  );
};

const UnnecessaryTableGrowthGuidance: React.FunctionComponent<
  CheckGuidanceProps
> = () => {
  // UnnecessaryTableGrowth uses a similar pattern as MissingIndex.
  return null;
};

const documentation: CheckDocs = {
  description:
    "Detects when a table has experienced unnecessary growth due to insufficient VACUUM.",
  Trigger: UnnecessaryTableGrowthTrigger,
  Guidance: UnnecessaryTableGrowthGuidance,
};

export default documentation;
