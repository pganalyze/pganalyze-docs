import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";
import { formatBytes } from "../../../util/format";

const OptimizeTableBloatTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config
}) => {
  return (
    <p>
      Detects when a table could use autovacuum setting optimization to reduce
      bloat. It checks a table statistic over the last seven days and calculate
      the row count that could have been avoided the bloat if VACUUM had been
      happening. Creates an issue when such row count is above{" "}
      <code>{config.settings["notify_pct"]}%</code> of the current rows, or such
      row count in bytes estimation is above{" "}
      <code>{formatBytes(config.settings["notify_bytes"])}</code>. Resolves once
      such row count decreases because of the autovacuum setting change or the
      change of table usage.
    </p>
  );
};

const OptimizeTableBloatGuidance: React.FunctionComponent<
  CheckGuidanceProps
> = () => {
  <div>
    <h4>Impact</h4>
    <p>
      Table bloat refers to the phenomenon where a table's physical size on disk
      is larger than its actual data size. In Postgres, any DELETEs or UPDATEs
      will create dead rows.
      <code>VACUUM</code> command and autovacuum removes dead rows and make such
      space reusable for future INSERTs and UPDATEs. However, if VACUUM is not
      happening in the right timing, dead rows will be kept as table bloat and
      table bloat can keep growing. Table bloat is problematic for several
      reasons:
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
          Table bloat can cause the disk space usage to increase unnecessarily,
          which can lead to disk space shortages and degraded performance.
        </p>
      </li>
    </ul>
    <h4>Solution</h4>
    <p>
      You can adjust the timing of autovacuum by changing the config variables
      related to autovacuum. Use VACUUM simulator to adjust the config variable
      to find a good spot for the table and the server.
    </p>
  </div>;
};

const documentation: CheckDocs = {
  description:
    "Detects when a table could use VACUUM setting optimization to reduce bloat.",
  Trigger: OptimizeTableBloatTrigger,
  Guidance: OptimizeTableBloatGuidance,
};

export default documentation;
