import React from "react";

import { CheckDocs, CheckGuidanceProps, CheckTriggerProps } from "../../../util/checks";

const SharedBuffersTrigger: React.FunctionComponent<CheckTriggerProps> = ({}) => {
  return (
    <p>
      Detects when the shared_buffers Postgres setting seems too low for the
      amount of RAM in your machine. Resolves once the setting has been adjusted
      to within the recommended range.
    </p>
  );
};

const SharedBuffersGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { SettingLink },
}) => {
  return (
    <div>
      <h4>Impact</h4>
      <p>
        If the memory allocated to Postgres is too small, it will need to
        perform more reads and writes from disk, decreasing performance.
      </p>
      <h4>Solution</h4>
      <p>
        The ideal <SettingLink setting="shared_buffers" /> setting depends on
        your workload, but pganalyze uses the following rule of thumb:
      </p>
      <ul>
        <li>20% of RAM for systems with less than 2GB</li>
        <li>25% of RAM for systems with less than 32GB</li>
        <li>8GB for systems with 32GB or more</li>
      </ul>
      <p>
        Postgres also relies on the operating system page cache, so giving it
        additional memory beyond the recommended values is not helpful and may
        be detrimental. For large servers or busy systems we recommend
        benchmarking to get to the best <SettingLink setting="shared_buffers" />{" "}
        configuration for your specific workload.
      </p>
      <p>Update the setting to the recommende value.</p>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Alerts when the shared_buffers setting seems too low for the amount of RAM in your machine.",
  Trigger: SharedBuffersTrigger,
  Guidance: SharedBuffersGuidance,
};

export default documentation;
