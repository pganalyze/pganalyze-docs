import React from "react";

import { CheckDocs, CheckGuidanceProps, CheckTriggerProps } from "../../../util/checks";

const StatsTrigger: React.FunctionComponent<CheckTriggerProps> = ({}) => {
  return (
    <p>
      Detects when statistics collection is disabled in your database, and creates
      an issue with severity "warning". Resolves once statistics collection is
      enabled again.
    </p>
  );
};

const StatsGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { SettingLink },
}) => {
  return (
    <div>
      <h4>Impact</h4>
      <p>
        pganalyze cannot function correctly without statistics information about
        your database.
      </p>
      <h4>Solution</h4>
      <p>
        Turn on the Postgres settings <SettingLink setting="track_counts" /> and{" "}
        <SettingLink setting="track_activities" />.
      </p>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Alerts when statistics collection is disabled in your database. This means that pganalyze cannot function correctly until this problem is resolved.",
  Trigger: StatsTrigger,
  Guidance: StatsGuidance,
};

export default documentation;
