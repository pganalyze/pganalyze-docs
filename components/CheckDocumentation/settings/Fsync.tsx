import React from "react";

import { CheckDocs, CheckGuidanceProps, CheckTriggerProps } from "../../../util/checks";

const FsyncTrigger: React.FunctionComponent<CheckTriggerProps> = () => {
  return (
    <p>
      Detects when the Postgres setting fsync is turned off and creates an issue
      with severity "critical". Resolves once fsync is enabled again.
    </p>
  );
};

const FsyncGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { SettingLink },
}) => {
  return (
    <div>
      <h4>Impact</h4>
      <p>
        When fsync is turned off, an unpredictable shutdown (e.g., a power
        failure) can leave your entire server unusable.
      </p>
      <h4>Solution</h4>
      <p>
        If you need a performance boost but you are okay with losing some
        commits, consider setting <SettingLink setting="synchronous_commit" />{" "}
        to <code>off</code> instead, which has most of the same performance
        benefits, but will leave the database server in a stable state even
        after a crash.
      </p>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Alerts when fsync is disabled on your database. It should almost never be disabled, as it can cause unpredictable data loss at power failure. If you are okay with loosing a few commits in the case of power failures, consider using synchronous_commit=off instead, which will still leave the database in a stable state.",
  Trigger: FsyncTrigger,
  Guidance: FsyncGuidance,
};

export default documentation;
