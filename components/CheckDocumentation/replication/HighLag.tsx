import React from "react";

import { CheckDocs, CheckGuidanceProps, CheckTriggerProps } from "../../../util/checks";

import { useSmartAnchor } from "../../SmartAnchor";

const HighLagTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config,
}) => {
  return (
    <>
      <p>
        Detects when the replication lag on a follower, averaged over the last
        hour, exceeds <code>{config.settings["warning_threshold_mb"]}MB</code>{" "}
        and creates an issue with severity "warning". Escalates to "critical"
        once replication lag exceeds{" "}
        <code>{config.settings["critical_threshold_mb"]}MB</code>. Resolves once
        the lag falls below{" "}
        <code>{config.settings["warning_threshold_mb"]}MB</code>.
      </p>
      <p>Configure this on the primary server in your replication setup.</p>
    </>
  );
};

const HighLagGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { backendsUrl, serverLogInsightsUrl, SettingLink },
}) => {
  const Link = useSmartAnchor();
  return (
    <div>
      <h4>Impact</h4>
      <p>
        Depending on your settings, this may cause disk space issues on the
        primary, or may eventually cause the replica to permanently fail
        replication (unless WAL archiving is also in use and the necessary WAL
        files are available on the replica).
      </p>
      <h4>Common Causes</h4>
      <ul>
        <li>
          <h5>Long-running transactions</h5>
          <p>
            If the Postgres setting{" "}
            <SettingLink setting="hot_standby_feedback" /> is turned on,
            long-running transactions on the standby may prevent replication
            progress. Check for any long-running transactions on the standby on
            the <Link to={backendsUrl}>Connections</Link> page. You can also
            tune <SettingLink setting="max_standby_streaming_delay" /> to limit
            long-running transactions that can run on the standby.
          </p>
        </li>
        <li>
          <h5>Underpowered standby</h5>
          <p>
            If the standby is running on a less powerful hardware configuration
            than the primary (especially in terms of I/O capabilities), it may
            not be able to keep up with replaying the replicated activity. You
            may need to upgrade the hardware on the standby.
          </p>
        </li>
        <li>
          <h5>Limited network bandwidth</h5>
          <p>
            If the primary is generating writes at a rate greater than the
            bandwidth of the streaming replication connection, the replica may
            not be able to keep up due to network limitations. You may need to
            increase the network bandwidth. Most cloud providers limit network
            bandwidth based on instance size (bigger instances have more network
            bandwidth).
          </p>
        </li>
        <li>
          <h5>Logical replication issues</h5>
          If this is a logical replication slot you may want to check{" "}
          <Link to={serverLogInsightsUrl}>Log Insights</Link> on both the
          publisher and the subscriber for any error messages regarding logical
          replication, such as schema differences or too low
          wal_sender_timeout/wal_receiver_timeout settings, causing the workers
          to quit after a while without making progress.
        </li>
      </ul>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Alerts when the replication lag on a follower exceeds the specified value in megabytes, averaged over the last hour. Configure this on the primary server in your replication setup.",
  Trigger: HighLagTrigger,
  Guidance: HighLagGuidance,
};

export default documentation;
