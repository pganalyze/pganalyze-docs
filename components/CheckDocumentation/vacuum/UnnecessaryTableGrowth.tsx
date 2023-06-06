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
  // The docs doesn't have the solution section as it's in dynamic guidance generated in app side.
  return (
    <div>
      <h4>Impact</h4>
      <p>
        In Postgres, any DELETEs or UPDATEs create dead rows in the tables they
        modify. VACUUM allows Postgres to reclaim these rows and reuse that
        space for future INSERTs or UPDATEs. Autovacuum is designed to perform
        VACUUM regularly in order to efficiently reuse space. This helps ensure
        that INSERTs and UPDATEs can use existing space instead of claiming new
        space. In this way, the table can avoid unnecessary growth.
      </p>
      <p>
        However, if VACUUM is not performed with the appropriate frequency or at
        the right time, dead rows may not be reclaimed. This can cause
        unnecessary table growth and results in table bloat, where the physical
        size of the table on disk is larger than its actual data size. Table
        bloat is problematic for several reasons:
      </p>
      <ul>
        <li>
          <h5>Slower queries</h5>
          <p>
            Since bloated tables take more physical space for the same amount of
            actual data, they take longer to read from disk, and take up more
            room when cached in memory. This makes queries on these tables less
            efficient, because they have to do more work to scan the same amount
            of data.
          </p>
        </li>
        <li>
          <h5>Increased disk space and I/O</h5>
          <p>
            Table bloat causes disk space usage to increase unnecessarily. It
            also leads to more I/O to read and write the same amount of actual
            data.
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
