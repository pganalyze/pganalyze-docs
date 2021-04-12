import React from "react";

import { CheckDocs, CheckGuidanceProps, CheckTriggerProps } from "../../../util/checks";
import { formatBytes } from "../../../util/format";

import PGDocsLink from "../../PGDocsLink";
import { useSmartAnchor } from "../../SmartAnchor";

const WorkMemTrigger: React.FunctionComponent<CheckTriggerProps> = ({}) => {
  return (
    <p>
      Detects when the Postgres <code>work_mem</code> setting seems too low for
      the amount of RAM in your machine and the number of connections you have
      configured. Resolves once the setting has been adjusted to within 50% of
      the recommended range.
    </p>
  );
};

const WorkMemGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { serverLogInsightsUrl, SettingLink },
  issue,
}) => {
  const Link = useSmartAnchor();
  const issueDetails = issue && JSON.parse(issue.detailsJson);
  const currSharedBuffers =
    typeof issueDetails?.["shared_buffers"] === "number"
      ? formatBytes(issueDetails["shared_buffers"])
      : undefined;
  const currMaxConns = issueDetails?.["max_connections"];
  return (
    <div>
      <h4>Impact</h4>
      <p>
        The Postgres <SettingLink setting="work_mem" /> setting controls how
        much memory individual sort and hash operations can consume. These are
        used while executing queries to evaluate sorts, joins, and other query
        features. If set too low, can cause queries to create temporary files on
        disk more often, which will affect performance.
      </p>
      <p>
        If you have <SettingLink setting="log_temp_files" /> set to an
        appropriate value (or 0 to log all temporary files) you can see the
        temporary files created, split by query, in{" "}
        <Link to={`${serverLogInsightsUrl}/S7`}>Log Insights</Link>. Increasing
        work_mem would likely improve performance for these queries.
      </p>
      <h4>Solution</h4>
      <p>
        The ideal <SettingLink setting="work_mem" /> setting depends heavily on
        your workload, but pganalyze uses the following rule of thumb:
      </p>
      <ul>
        <li>
          start with dividing <SettingLink setting="shared_buffers" />{" "}
          {currSharedBuffers && <> ({currSharedBuffers}) </>}by{" "}
          <SettingLink setting="max_connections" />{" "}
          {currMaxConns && <> ({currMaxConns})</>}
        </li>
        <li>use no less than 1MB</li>
        <li>use no more than 256MB</li>
      </ul>
      <p>
        Update the setting to the recommended value by using{" "}
        <PGDocsLink path="/sql-altersystem.html">ALTER SYSTEM</PGDocsLink> or
        modifying the parameters in your cloud provider portal.
      </p>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Alerts when the work_mem setting seems too low for the amount of RAM, and the amount of connections you have configured. Having too low work_mem can cause queries to create temporary files on disk more often, which will slow down queries.",
  Trigger: WorkMemTrigger,
  Guidance: WorkMemGuidance,
};

export default documentation;
