import React from "react";

import { CheckDocs, CheckGuidanceProps, CheckTriggerProps } from "../../../util/checks";
import { useSmartAnchor } from "../../SmartAnchor";

import SQL from "../../SQL";

const StorageSpaceTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config,
}) => {
  return (
    <>
      <p>
        Detects when disk usage on the partition of your data directory reaches{" "}
        <code>{config.settings["warning_pct"]}%</code> and creates an issue with
        severity "warning". Escalates to "critical" if when disk usage reaches{" "}
        <code>{config.settings["critical_pct"]}%</code>. Resolves once usage
        drops below
        <code>{config.settings["warning_pct"]}%</code> again.
      </p>
      <p>
        Ignores situations where more than{" "}
        <code>{config.settings["base_threshold_gigabytes"]}GB</code> is
        available, regardless of the percent utilization.
      </p>
    </>
  );
};

const StorageSpaceGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { serverSchemaUrl, SettingLink },
}) => {
  const Link = useSmartAnchor();
  return (
    <div>
      <h4>Impact</h4>
      <p>The database may soon be unable to accept new writes.</p>
      <h4>Common Causes</h4>
      <ul>
        <li>
          <h5>Increase in table/index disk space usage</h5>
          <p>
            Some tables or indexes may be growing faster than expected. You can
            check the{" "}
            <Link to={serverSchemaUrl}>
              server-wide Schema statistics overview
            </Link>{" "}
            to see which databses are using the most disk space, and then check
            database-specific schema statistics to see which tables or indexes
            are taking the most space within that database.
          </p>
        </li>
        <li>
          <h5>Temporary files</h5>
          <p>
            If the Postgres <SettingLink setting="temp_tablespaces" /> setting
            is empty or set to a directory on the same partition as the data
            directory, you may have a long-running query using a lot of
            temporary files and consuming disk space. Canceling the query with
            <code>pg_cancel_backend</code> will release any temporary files and
            may reclaim some space.
            {/* TODO: is there a simple way to evaluate current temp space usage? */}
          </p>
        </li>
      </ul>
      <h4>Solution</h4>
      <p>
        Expanding storage and deleting data can both resolve this issue, though
        note that due to the MVCC mechanism Postgres uses, deleting data is
        unlikely to reclaim much space until you can run{" "}
        <SQL inline sql="VACUUM FULL" /> (which{" "}
        <strong>takes a full table lock (blocking all other queries)</strong>{" "}
        and has considerable disk space overhead while executing) or{" "}
        <strong>use pg_repack to reclaim disk space</strong>. Running{" "}
        <SQL inline sql="TRUNCATE" /> to purge all data from some tables may
        help.
      </p>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Monitors disk space on the partition your data directory is on and creates a warning/critical issue according to the thresholds defined below. In addition this check may create a warning if disk space is projected to run out in the future (currently not configurable).",
  Trigger: StorageSpaceTrigger,
  Guidance: StorageSpaceGuidance,
};

export default documentation;
