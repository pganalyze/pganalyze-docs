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
      days and calculates the amount of rows that could have been avoided to
      grow if VACUUM had been performed more frequently. Creates an issue when
      such rows exceeds <code>{config.settings["notify_pct"]}%</code> of total
      new rows, as well as{" "}
      <code>{formatBytes(Number(config.settings["notify_bytes"]))}</code>{" "}
      accumulated. Resolves once the unnecessary growth decreases.
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
