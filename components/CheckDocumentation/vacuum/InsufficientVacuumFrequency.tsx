import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";

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
      as well as <code>{config.settings["notify_mb"]}MB</code> accumulated.
      Resolves once such growth decreases.
    </p>
  );
};

const InsufficientVacuumFrequencyGuidance: React.FunctionComponent<
  CheckGuidanceProps
> = ({ issue }) => {
  if (issue) {
    // The InsufficientVacuumFrequency check has dynamic guidance
    // so this component is not used in-app (aka when `issue` is present)
    return null;
  }
  return (
    <p>
      You can learn about VACUUM Advisor and insufficient VACUUM frequency
      insights in{" "}
      <a href="https://pganalyze.com/docs/vacuum-advisor/bloat">
        the VACUUM Advisor documentation
      </a>
      . You can also learn more about bloat in general in a{" "}
      <a href="https://pganalyze.com/docs/vacuum-advisor/bloat-in-postgres">
        Bloat in Postgres
      </a>
      .
    </p>
  );
};

const documentation: CheckDocs = {
  description:
    "Detects when insufficient VACUUM frequency leads to avoidable growth in a table.",
  Trigger: InsufficientVacuumFrequencyTrigger,
  Guidance: InsufficientVacuumFrequencyGuidance,
};

export default documentation;
