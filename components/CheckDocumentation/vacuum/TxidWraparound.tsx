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
      <p>
        The transaction ID usage is high. Postgres usually runs anti-wraparound
        autovacuums to keep the usage low by freezing old rows. However, if such
        VACUUMs are either not running or are running but unable to freeze rows
        for some reasons, the transaction usage keeps growing.
      </p>
      <p>
        The anti-wraparound VACUUM needs to happen at some point and this is not
        avoidable. If VACUUM is somehow not run in timely manner, the upcoming
        VACUUM becomes more and more expensive, potentially causes the overall
        performance degradation or simply takes really long time to finish. The
        anti-wraparound VACUUM holds <code>SHARE UPDATE EXCLUSIVE</code> lock,
        which can block DDL statements.
      </p>
      <p>
        When the transaction ID usage reaches to 99.85% (3M transactions left),
        the system will shut down and refuse to start any new transactions. This
        is to prevent any data corruption from happening by running out
        transaction ID.
      </p>
      <p>
        With Postgres 14+, there is a special type of failsafe VACUUM which
        takes extraordinary measures to avoid the shutdown. While this is very
        useful, you still want to avoid even this from happening, to avoid any
        impact by this VACUUM.
      </p>
      <h4>Common Cases</h4>
      <ul>
        <li>
          <h5>Ineffectual autovacuum settings</h5>
          <p>
            Autovacuums, especially anti-wraparound autovacuums, are meant to
            prevent transaction ID wraparound by freezing old rows and keeping
            transaction ID usage low. When <code>vacuum_freeze_min_age</code> is
            set too high, anti-wraparound autovacuum will not be triggered in
            timely manner and cause the usage growth. Revisit the setting to
            ensure that anti-wraparound autovacuums will run periodically.
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
            well. Check for any long-running transactions or its lock state on
            the <Link to={backendsUrl}>Connections</Link> page.
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
