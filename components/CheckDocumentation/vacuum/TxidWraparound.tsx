import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
} from "../../../util/checks";
import { useSmartAnchor } from "../../SmartAnchor";

const TxidWraparoundTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config,
}) => {
  const warning = config.settings["warning_threshold_pct"] as number;
  const critical = config.settings["critical_threshold_pct"] as number;
  return (
    <p>
      Detects when transaction ID space utilization on the server is more than{" "}
      <code>{warning}%</code> and creates an issue with severity "warning".
      Escalates to "critical" once utilization exceeds <code>{critical}%</code>.
      Resolves once utilization falls below the threshold.
    </p>
  );
};

const TxidWraparoundGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { backendsUrl, serverVacuumFreezingUrl },
}) => {
  const Link = useSmartAnchor();
  return (
    <div>
      <h4>Impact</h4>
      <p>
        Transaction ID space utilization is high and approaching wraparound.
      </p>
      <p>
        Postgres runs autovacuums regularly and this helps keeping transaction
        ID space utilization low by freezing old transaction IDs. There is also
        the anti-wraparound autovacuum specific for freezing, when the regular
        autovacuums are either not freezing aggressively enough or simply not
        running. This anti-wraparound autovacuum will be triggered when
        utilization (age) exceeds the threshold, specified in{" "}
        <code>autovacuum_freeze_max_age</code>.
      </p>
      <p>
        In order to avoid wraparound failure, old transaction IDs must be frozen
        by VACUUMs. The more old transaction IDs need to be frozen, the more
        expensive VACUUM becomes. It can take a really long time to finish and
        potentially causes overall performance degradation. The anti-wraparound
        autovacuum holds a<code>SHARE UPDATE EXCLUSIVE</code> lock, which can
        block DDL statements.
      </p>
      <p>
        If transaction ID space utilization reaches to 99.85% (3M transaction
        IDs left), the system will shut down. This is to prevent any data
        corruption from happening by running out transaction IDs. Resolving this
        requires manual intervention.
      </p>
      <p>
        With Postgres 14+, there is a special type of failsafe VACUUM which
        takes extraordinary measures to avoid the shutdown. While this is very
        useful, you still want to avoid this as a failsafe autovacuum ignores
        resource utilization constraints and can have significant performance
        impact.
      </p>
      <h4>Common Causes</h4>
      <ul>
        <li>
          <h5>Ineffectual autovacuum settings</h5>
          <p>
            Autovacuums, especially anti-wraparound autovacuums, are meant to
            freeze old transaction IDs and keep sufficient transaction IDs
            available in order to prevent wraparound from happening. When
            autovacuum is turned off, or autovacuum settings are not well suited
            to actual database usage, it is possible that autovacuum is not able
            to keep up with freezing old transaction IDs. Make sure that
            autovacuum is turned on, and revisit the configuration settings to
            ensure that autovacuum will keep transaction ID space utilization
            under control. You can check out the configuration settings related
            to freezing in <Link to={serverVacuumFreezingUrl}>Freezing</Link>{" "}
            page in VACUUM Advisor.
          </p>
        </li>
        <li>
          <h5>Blocked autovacuums</h5>
          <p>
            Even if autovacuum settings are adequate, it is possible that
            autovacuums themselves are blocked by something, hence freezing (to
            reduce transaction ID space utilization) is not able to keep up. The
            typical blocker is a long running transaction, or a transaction
            holding some locks that could cancel autovacuums. It is important to
            make sure that there is no such transactions so that VACUUMs can
            make freezing progress. Check for any long-running transactions and
            their lock state on the <Link to={backendsUrl}>Connections</Link>{" "}
            page.
          </p>
        </li>
      </ul>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Alerts when transaction ID space utilization on the server exceeds the specified percentage.",
  Trigger: TxidWraparoundTrigger,
  Guidance: TxidWraparoundGuidance,
};

export default documentation;
