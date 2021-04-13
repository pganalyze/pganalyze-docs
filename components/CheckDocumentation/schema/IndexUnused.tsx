import React from "react";

import {
  CheckDocs,
  CheckGuidanceProps,
  CheckTriggerProps,
  IssueReferenceIndex,
} from "../../../util/checks";
import { formatSqlObjectName } from "../../../util/format";

import SQL from "../../SQL";
import { useSmartAnchor } from "../../SmartAnchor";

const IndexUnusedTrigger: React.FunctionComponent<CheckTriggerProps> = ({}) => {
  return (
    <>
      <p>
        Detects indexes that are not in use by any queries within the last 14
        days and creates an issue with severity "info". Resolves once the index
        is dropped or starts being used. Note that if you have gaps in your
        collector reporting, this check may miss usage during un-reported
        periods.
      </p>
      <p>
        Ignores small indexes (less than 32kB), as well as primary keys, unique
        indexes, and expression indexes since they are necessary to enforce
        constraints or useful as query planning hints.
      </p>
    </>
  );
};

const IndexUnusedGuidance: React.FunctionComponent<CheckGuidanceProps> = ({
  urls: { databaseTableUrl },
  issue,
}) => {
  const Link = useSmartAnchor();

  const idx = issue?.referenceDetail as IssueReferenceIndex;
  const qualifiedIdx = idx?.name
    ? formatSqlObjectName(idx.schemaName, idx.name)
    : '"<index_name>"';
  return (
    <div>
      <h4>Impact</h4>
      <p>
        Postgres has to keep maintaining unused indexes for inserts, updates,
        and deletes to the table, slowing down writes. They also take up memory,
        competing with actively used indexes and table data. Larger unused
        indexes can also cause unnecessary disk space usage.
      </p>
      <h4>Solution</h4>
      <p>
        First, make sure this index is not in use in another database. You may
        need to check other environments that share the same schema, or verify
        that the index is not used on a read replica. If this server is a
        staging, QA or dev environment you may want to turn off the index unused
        check and only run it on production. You can also check usage of the
        associated table on the{" "}
        <Link to={databaseTableUrl}>Schema Statistics page for the table</Link>.
        Once you have confirmed the index is safe to drop, you can clean up this
        unused index by running{" "}
        <SQL inline sql={`DROP INDEX CONCURRENTLY ${qualifiedIdx};`} />.
      </p>
    </div>
  );
};

const documentation: CheckDocs = {
  description:
    "Alerts on indexes that are not being used by any queries. These indexes can likely be removed, assuming no other database with the same schema requires them. Every index slows down writes a bit, so it's good to only keep the indexes you are actually using.",
  Trigger: IndexUnusedTrigger,
  Guidance: IndexUnusedGuidance,
};

export default documentation;
