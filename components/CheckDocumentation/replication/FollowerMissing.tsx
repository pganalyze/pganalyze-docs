import React from "react";

import { CheckDocs, CheckGuidanceProps, CheckTriggerProps } from "../../../util/checks";

const FollowerMissingTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config,
}) => {
  return (
    <>
      <p>
        Detects when the actual number of followers registered with the primary
        is lower than the expected number (
        <code>{config.settings["expected_count"]}</code>), and creates an issue
        with severity "critical".
      </p>
      <p>Configure this on the primary server in your replication setup.</p>
    </>
  );
};

const FollowerMissingGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { SettingLink },
}) => {
  return (
    <div>
      <h4>Impact</h4>
      <p>
        If replication fails, this may lead to stale results from queries on the
        affected follower, and may jeopardize high availability if the primary
        crashes.
      </p>
      <h4>Common Causes</h4>
      <ul>
        <li>
          <h5>Network connectivity</h5>
          <p>
            If there are network connectivity issues between the follower and
            primary, the follower may have problems maintaining a replication
            connection. Also, make sure your{" "}
            <SettingLink setting="wal_retrieve_retry_interval" /> value is not
            set too high, to ensure prompt reconnection in case of transient
            failures.
          </p>
        </li>
        <li>
          <h5>Follower crash</h5>
          <p>
            If the follower crashes, and is not configured to (or is unable to)
            restart automatically, it obviously won't be able to maintain
            replication. Check to make sure the follower is up and running, and
            review its logs for potential causes of a crash.
          </p>
        </li>
      </ul>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Alerts when the actual number of followers registered with the primary is lower than the expected number. Configure this on the primary server in your replication setup.",
  Trigger: FollowerMissingTrigger,
  Guidance: FollowerMissingGuidance,
};

export default documentation;
