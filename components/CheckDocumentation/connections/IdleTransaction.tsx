import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
  IssueReferenceBackend,
} from "../../../util/checks";

import SQL from "../../SQL";

const IdleTransactionTrigger: React.FunctionComponent<CheckTriggerProps> = ({
  config,
}) => {
  return (
    <p>
      Detects transactions that have been open with no activity (the{" "}
      <code>idle in transaction</code> state) for longer than the specified
      threshold of{" "}
      <code>{config.settings["warning_max_idle_tx_age_secs"]}</code> seconds and
      creates an issue with severity "warning". Escalates to "critical" if the
      transaction is still idle after{" "}
      <code>{config.settings["critical_max_idle_tx_age_secs"]}</code> seconds.
      Resolves automatically once the transaction is committed, rolled back, or
      shows activity again.
    </p>
  );
};
const IdleTransactionGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { SettingLink },
  issue,
}) => {
  return (
    <div>
      <h4>Impact</h4>
      <p>
        Transactions left open can hold locks, blocking other queries, and can
        prevent VACUUM (including autovacuum) from cleaning up dead rows,
        leading to index or table bloat.
      </p>
      <h4>Common Causes</h4>
      <ul>
        <li>
          <h5>Application bugs</h5>
          <p>
            If there is an error (either in the application or in the database)
            while processing a query, the application must handle that correctly
            and roll back the transaction (and possibly close the connection).
            If it fails to do that, the idle transaction may be left open as
            long as the application keeps running.
          </p>
          <p>
            If your application sets <SettingLink setting="application_name" />{" "}
            on its connections or uses a distinct role, you can find more
            details by querying pg_stat_activity. Review the code path that
            triggered the idle transaction (you can also check the last query on
            the connection in pg_stat_activity), and make sure that any errors
            are handled appropriately (e.g., with <code>rescue</code> or{" "}
            <code>catch</code>) and roll back the transaction.
          </p>
        </li>
        <li>
          <h5>Interactive sessions</h5>
          <p>
            If someone is accessing the database directly in an interactive
            session and they manually open a transaction with{" "}
            <SQL inline sql="BEGIN" /> or <SQL inline sql="START TRANSACTION" />
            , they must close it with <SQL inline sql="COMMIT" /> or{" "}
            <SQL inline sql="ROLLBACK" />, or disconnect entirely (which will
            roll back the transaction).
          </p>
        </li>
      </ul>
      <h4>Solution</h4>
      <p>
        For an immediate solution, you can kill a connection with an idle
        transaction with{" "}
        <SQL
          inline
          sql={`SELECT pg_terminate_backend(${
            (issue.referenceDetail as IssueReferenceBackend)?.pid ??
            "<session pid>"
          });`}
        />
        . Note that this only treats the symptom: unless this is due to a
        one-off manual session, you may run into this problem again.
      </p>
      <p>
        You can also change the{" "}
        <SettingLink setting="idle_in_transaction_session_timeout" /> setting to
        automatically roll back idle transactions older than a specified
        threshold.
      </p>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "<p>Alerts on transactions that have been in the <code>idle in transaction</code> state for longer than the specified threshold. Idle transactions hold back autovacuum operations and other cleanup tasks, and may cause performance issues if left open for longer than necessary.</p><p>The thresholds should be set based on your application behaviour, but we recommend alerting on idle transactions somewhere in the 1 to 24 hours time range. Default for critical alerts is 1 hour.</p>",
  Trigger: IdleTransactionTrigger,
  Guidance: IdleTransactionGuidance,
};

export default documentation;
