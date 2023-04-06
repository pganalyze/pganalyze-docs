import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
  IssueReferenceIndex,
  IssueReferenceTable,
} from "../../../util/checks";
import { formatBytes, formatSqlObjectName } from "../../../util/format";
import { useCodeBlock } from "../../CodeBlock";
import { useSmartAnchor } from "../../SmartAnchor";
import SQL from "../../SQL";

const OptimizeTableBloatTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config,
}) => {
  return (
    <p>
      Detects when a table would benefit from autovacuum setting optimization to
      reduce table bloat. It analyzes the table statistic from the past seven
      days and calculates the amount of growth that could have been avoided if
      VACUUM had been performed more frequently. Creates an issue when this
      growth exceeds <code>{formatBytes(config.settings["notify_bytes"])}</code>
      , as well as <code>{config.settings["notify_pct"]}%</code> of the current
      size. Resolves once the growth decreases due to changes in autovacuum
      settings or table usage.
    </p>
  );
};

const OptimizeTableBloatGuidance: React.FunctionComponent<
  CheckGuidanceProps
> = ({ urls: { tableVacuumsUrl }, issue }) => {
  const Link = useSmartAnchor();
  const CodeBlock = useCodeBlock();
  const issueDetails = issue && JSON.parse(issue.detailsJson);
  const current = issueDetails["current"];
  const recommendation = issueDetails["recommendation"];
  const ref = issue?.references?.[0];
  const schemaTable = ref.referent as IssueReferenceTable;
  const tableName = formatSqlObjectName(
    schemaTable.schemaName,
    schemaTable.tableName
  );
  const sql =
    current["autovacuum_vacuum_threshold"] !=
    recommendation["autovacuum_vacuum_threshold"] ? (
      <SQL
        inline
        sql={`ALTER TABLE ${tableName} SET (autovacuum_vacuum_threshold = ${recommendation["autovacuum_vacuum_threshold"]});`}
      />
    ) : (
      <SQL
        inline
        sql={`ALTER TABLE ${tableName} SET (autovacuum_vacuum_scale_factor = ${recommendation["autovacuum_vacuum_scale_factor"]});`}
      />
    );

  return (
    <div>
      <h4>Impact</h4>
      <p>
        Table bloat refers to the phenomenon where a table's physical size on
        disk is larger than its actual data size. In Postgres, any DELETEs or
        UPDATEs will create dead rows.
        <code>VACUUM</code> command and autovacuum removes dead rows and make
        such space reusable for future INSERTs and UPDATEs. However, if VACUUM
        is not happening in the right timing, dead rows will be kept as table
        bloat and table bloat can keep growing. Table bloat is problematic for
        several reasons:
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
        Here is some recommendation for a new value. You can run this command to
        change the settings for the table:
      </p>
      <CodeBlock>{sql}</CodeBlock>
      <p>
        It is important to pay attention to the following points after making a
        change and adjust further if needed:
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
    "Detects when a table could use VACUUM setting optimization to reduce table bloat.",
  Trigger: OptimizeTableBloatTrigger,
  Guidance: OptimizeTableBloatGuidance,
};

export default documentation;
