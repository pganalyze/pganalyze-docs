import React from "react";

import { CheckDocs, CheckGuidanceProps, CheckTriggerProps } from "../../../util/checks";
import PGDocsLink from "../../PGDocsLink";

const InefficientIndexPhaseTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config,
}) => {
  const threshold = config.settings["threshold_count"] as number;
  const runPluralized = threshold === 1 ? 'run' : 'runs';
  return (
    <>
      <p>
        Detects when autovacuum runs in this server are forced to perform inefficient
        multiple index scan phases due to limited configured memory, and creates an
        issue with severity "warning". Triggers when at least <code>{threshold}</code>{" "}
        autovacuum {runPluralized} in the last 24h have had multiple index scan phases.
        {/*
          Special-casing "fewer than 1 run" as "no runs" or similar could sound more
          natural, but it's important to repeat the threshold number here for clarity.
        */}{" "}
        Resolves automatically once fewer than <code>{threshold}</code> autovacuum {runPluralized}
        {" "}in the last 24h have had multiple index scan phases.
      </p>
      <p>
        Ignores situations where configured autovacuum mmemory is already set to the
        maximum possible value of <code>1GB</code>.
      </p>
    </>
  );
};

const InefficientIndexPhaseGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { SettingLink },
}) => {
  return (
    <div>
      <h4>Impact</h4>
      <p>
        Autovacuum on affected tables may take significantly longer. VACUUM processes tables
        and their indexes in phases. To avoid impacting your primary workload, autovacuum
        is limited to using a certain amount of memory. If this is not enough to process
        all dead rows, the index scan phase will need to be repeated (possibly several times).
        This is inefficient in terms of CPU and I/O.
      </p>
      <h4>Common Causes</h4>
      <ul>
        <li>
          <h5><code>autovacuum_work_mem</code> set too low</h5>
          <p>
            The setting <SettingLink setting="autovacuum_work_mem" /> controls how much memory
            vacuum can use (if set to <code>-1</code>, it falls back to the value of <SettingLink setting="maintenance_work_mem" />).
            If this is set too low, multiple index scan phases may be required.
          </p>
        </li>
        <li>
          <h5>VACUUM occurring too infrequently</h5>
          <p>
            If VACUUM is not occurring often enough, many dead rows can accumulate between
            runs, and will require more memory to clean up.
          </p>
        </li>
      </ul>
      <h4>Solution</h4>
      <p>
        Increasing <SettingLink setting="autovacuum_work_mem" /> can allow autovacuum
        to proceed more efficiently. It's hard to predict how much memory may be needed,
        but doubling the value (up to the maximum of <code>1GB</code>) and monitoring the
        impact is a reasonable approach. If <code>autovacuum_work_mem</code> is set to{" "}
        <code>-1</code>, it will fall back to the current value of <SettingLink setting="maintenance_work_mem" />.
        It is generally preferable to set it separately. Update the setting to the recommended
        value by using <PGDocsLink path="/sql-altersystem.html">ALTER SYSTEM</PGDocsLink> or
        modifying the parameters in your cloud provider portal.
      </p>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Monitors VACUUM progress on all tables in the server and creates a warning issue if some VACUUM runs are forced to perform inefficient multiple index scan phases due to limited configured memory.",
  Trigger: InefficientIndexPhaseTrigger,
  Guidance: InefficientIndexPhaseGuidance,
};

export default documentation;
