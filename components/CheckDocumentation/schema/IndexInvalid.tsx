import SQL from "../../SQL";
import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
  IssueReferenceIndex,
} from "../../../util/checks";
import { formatSqlObjectName } from "../../../util/format";
import { useCodeBlock } from "../../CodeBlock";

const IndexInvalidTrigger: React.FunctionComponent<CheckTriggerProps> = ({}) => {
  return (
    <p>
      Detects indexes that are not recognized as valid in Postgres and creates
      an issue with severity "info", one for each table (or table hierarchy in
      case of inheritance or partitioning). These indexes typically are left over when
      using <SQL inline sql="CREATE INDEX CONCURRENTLY" /> and the command fails
      or is aborted by the user. Resolves once all invalid indexes on a table have been dropped.
    </p>
  );
};

const IndexInvalidGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  issue,
}) => {
  const CodeBlock = useCodeBlock();
  const indexes = issue?.references?.map((ref) => {
    const schemaIdx = ref.referent as IssueReferenceIndex;
    return formatSqlObjectName(schemaIdx.schemaName, schemaIdx.name);
  })
  return (
    <div>
      <h4>Impact</h4>
      <p>Invalid indexes take up disk space but are not usable by queries.</p>
      <h4>Solution</h4>
      <p>
        You can safely drop these invalid indexes.
      </p>
      {indexes && (
        <>
          <h4>Commands</h4>
          <p>
            You can drop these indexes by running the following commands:
          </p>
          <CodeBlock>
            {indexes.map((qualifiedIdx) => (
              <React.Fragment key={qualifiedIdx} >
                <SQL inline sql={`DROP INDEX CONCURRENTLY ${qualifiedIdx};`} />{"\n"}
              </React.Fragment>
            ))}
          </CodeBlock>
        </>
      )}
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
