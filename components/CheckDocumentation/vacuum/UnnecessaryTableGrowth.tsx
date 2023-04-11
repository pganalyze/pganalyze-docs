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
> = ({ urls: { tableVacuumsUrl } }) => {
  const Link = useSmartAnchor();

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
      <h4>Solution</h4>
      <p>
        You can adjust the timing of autovacuum by changing the config variables
        related to autovacuum. Lowering <code>autovacuum_vacuum_threshold</code>{" "}
        or <code>autovacuum_vacuum_scale_factor</code> will increase the
        frequency of autovacuum in general.
      </p>
      <p>
        It is important to pay attention to the following points after making a
        change to these values and adjust further if needed:
      </p>
      <ul>
        <li>
          <h5>VACUUM frequency</h5>
          <p>
            Changing the settings will likely increase the frequency of
            autovacuum. Frequent VACUUM can impact on the performance and
            stability of your database, if such VACUUM is expensive. You can
            check out recent autovacuums in{" "}
            <Link to={tableVacuumsUrl}>VACUUM/ANALYZE Activity</Link> page.
          </p>
        </li>
        <li>
          <h5>Bloat change</h5>
          <p>
            Typically, adjusting these settings won't eliminate existing bloat.
            Even with optimal settings, bloat that has already been accumulated
            cannot be eliminated unless the space occupied by dead rows becomes
            reusable via VACUUM, and there are more INSERTs than DELETEs to
            reuse that space.
          </p>
          <p>
            To confirm the impact of changes, it is also recommended to{" "}
            <Link to="https://pganalyze.com/blog/5mins-postgres-pg-repack-VACUUM-FULL">
              run pg_repack
            </Link>{" "}
            to reclaim disk space. You can check out estimated bloat over time
            graph in <Link to={tableVacuumsUrl}>VACUUM/ANALYZE Activity</Link>{" "}
            page.
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
