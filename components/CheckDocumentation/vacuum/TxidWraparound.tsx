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
      Detects when the transaction ID utilization on the server is more than{" "}
      <code>{warning}%</code> and creates an issue with severity "warning".
      Escalates to "critical" once the utilization exceeds{" "}
      <code>{critical}%</code>. Resolves once the utilization falls below the
      threshold.
    </p>
  );
};

const TxidWraparoundGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { backendsUrl },
}) => {
  const Link = useSmartAnchor();
  return (
    <div>
      <h4>Impact</h4>
      <p>The transaction ID is close to wraparound.</p>
      <p>
        When the transaction ID wraparound happens, Postgres is unable to start
        a new transaction and essentially makes the database down. Postgres
        usually runs anti-wraparound autovacuums to prevent this from happening,
        but if such VACUUMs are either not running or are running but unable to
        freeze rows for some reasons, the transaction age (and the utilization)
        keeps growing and eventually hit the point of wraparound. With Postgres
        14+, there is a special type of failsafe VACUUM which takes
        extraordinary measures to avoid system-wide transaction ID wraparound
        failure. It is recommended to take any actions to prevent the
        wraparound, or even failsafe from happening.
      </p>
      <h4>Common Cases</h4>
      <ul>
        <li>
          <h5>Ineffectual autovacuum settings</h5>
          <p>
            Autovacuums, especially anti-wraparound autovacuums are meant to
            prevent the wraparound from happening. When autovacuum is turned
            off, or the setup of anti-wraparound autovacuum is not fitting well
            for the database usage, it is possible that autovacuum is not
            working as intended and causing the utilization growth. Make sure
            that autovacuum is turned on, and revisit the setting to ensure that
            anti-wraparound autovacuums will run periodically.
          </p>
        </li>
        <li>
          <h5>Blocked autovacuums</h5>
          <p>
            Even though autovacuum settings are adequate, it is possible that
            autovacuums themselves are blocked by something hence freezing (to
            reduce the transaction ID utilization) is not happening. The typical
            blocker is a long running transaction, or a transaction holding some
            locks that could cancel autovacuums. It is important to make sure
            that there is no such transactions so that VACUUMs can freeze rows
            well. Check for any long-running transactions on the{" "}
            <Link to={backendsUrl}>Connections</Link> page.
          </p>
        </li>
      </ul>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Alerts when the transaction ID utilization on the server exceeds the specified percentage.",
  Trigger: TxidWraparoundTrigger,
  Guidance: TxidWraparoundGuidance,
};

export default documentation;
