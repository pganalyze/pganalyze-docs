import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";
import { formatBytes } from "../../../util/format";
import { useSmartAnchor } from "../../SmartAnchor";

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
      <code>{formatBytes(config.settings["notify_bytes"])}</code>, as well as{" "}
      <code>{config.settings["notify_pct"]}%</code> of the current size.
      Resolves once the unnecessary growth decreases due to changes in
      autovacuum settings or table usage.
    </p>
  );
};

const UnnecessaryTableGrowthGuidance: React.FunctionComponent<
  CheckGuidanceProps
> = () => {
  // UnnecessaryTableGrowth uses a similar pattern as MissingIndex.
  // The docs doesn't have the solution section as it's in dynamic guidance generated in app side.
  return (
    <div>
      <h4>Impact</h4>
      <p>
        In Postgres, any DELETEs or UPDATEs create dead rows that can be
        VACUUMed to become reusable space for future INSERTs or UPDATEs.
        Autovacuum is designed to automatically perform VACUUM regularly to
        efficiently reclaim reusable space created by removing dead rows. This
        helps ensure that INSERTs and UPDATEs can use existing space instead of
        claiming new space. In this way, the table can avoid unnecessary growth.
      </p>
      <p>
        However, if autovacuum is not performed with the appropriate frequency
        or at the right time, dead rows may not be reclaimed. This can cause
        unnecessary table growth, which could have been avoided if dead rows
        were reclaimed. This typically result in table bloat where the physical
        size of the table on disk is larger than its actual data size. Table
        bloat is problematic for several reasons:
      </p>
      <ul>
        <li>
          <h5>Slower queries</h5>
          <p>
            When a table is bloated, it takes more time to read and write data
            from the disk, which can slow down queries that access the table.
          </p>
        </li>
        <li>
          <h5>Increased disk usage</h5>
          <p>
            Table bloat can cause the disk space usage to increase
            unnecessarily, which can lead to disk space shortages and degraded
            performance.
          </p>
        </li>
      </ul>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Detects when a table has experienced unnecessary growth due to insufficient VACUUM.",
  Trigger: UnnecessaryTableGrowthTrigger,
  Guidance: UnnecessaryTableGrowthGuidance,
};

export default documentation;
