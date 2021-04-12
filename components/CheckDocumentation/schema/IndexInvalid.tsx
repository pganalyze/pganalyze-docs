import SQL from "../../SQL";
import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
  IssueReferenceIndex,
} from "../../../util/checks";
import { formatSqlObjectName } from "../../../util/format";

const IndexInvalidTrigger: React.FunctionComponent<CheckTriggerProps> = ({}) => {
  return (
    <p>
      Detects indexes that are not recognized as valid in Postgres and creates
      an issue with severity "info". These indexes typically are left over when
      using <SQL inline sql="CREATE INDEX CONCURRENTLY" /> and the command fails
      or is aborted by the user. Resolves once the index has been dropped.
    </p>
  );
};

const IndexInvalidGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  issue,
}) => {
  const idx = issue.referenceDetail as IssueReferenceIndex;
  const qualifiedIdx = idx?.name
    ? formatSqlObjectName(idx.schemaName, idx.name)
    : "<index name>";
  return (
    <div>
      <h4>Impact</h4>
      <p>Invalid indexes take up disk space but are not usable by queries.</p>
      <h4>Solution</h4>
      <p>
        You can clean up this ununsed index by running{" "}
        <SQL inline sql={`DROP INDEX CONCURRENTLY ${qualifiedIdx};`} />.
      </p>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Alerts on indexes that are not VALID. These indexes typically are left over when using CREATE INDEX CONCURRENTLY and the command fails, or is aborted by the user. You can clean them up by using DROP INDEX CONCURRENTLY.",
  Trigger: IndexInvalidTrigger,
  Guidance: IndexInvalidGuidance,
};

export default documentation;
