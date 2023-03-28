import React from "react";

import { CheckDocs, CheckGuidanceProps, CheckTriggerProps } from "../../util/checks";

import QuerySlowness from "./queries/Slowness";
import ActiveQuery from "./connections/ActiveQuery";
import IdleTransaction from "./connections/IdleTransaction";
import BlockingQuery from "./connections/BlockingQuery";
import MissingIndex from "./index_advisor/MissingIndex";
import IndexInvalid from "./schema/IndexInvalid";
import IndexUnused from "./schema/IndexUnused";
import EnableFeatures from "./settings/EnableFeatures";
import Fsync from "./settings/Fsync";
import SharedBuffers from "./settings/SharedBuffers";
import Stats from "./settings/Stats";
import WorkMem from "./settings/WorkMem";
import StorageSpace from "./system/StorageSpace";
import HighLag from "./replication/HighLag";
import FollowerMissing from "./replication/FollowerMissing";
import VacuumInefficientIndexPhase from "./vacuum/InefficientIndexPhase";
import OptimizeTableBloat from "./vacuum/OptimizeTableBloat";

const Docs: {
  [category: string]: { [check: string]: CheckDocs };
} = {
  queries: {
    slowness: QuerySlowness,
  },
  connections: {
    active_query: ActiveQuery,
    idle_transaction: IdleTransaction,
    blocking_query: BlockingQuery,
  },
  index_advisor: {
    missing_index: MissingIndex,
  },
  schema: {
    index_invalid: IndexInvalid,
    index_unused: IndexUnused,
  },
  settings: {
    enable_features: EnableFeatures,
    fsync: Fsync,
    shared_buffers: SharedBuffers,
    stats: Stats,
    work_mem: WorkMem,
  },
  system: {
    storage_space: StorageSpace,
  },
  replication: {
    high_lag: HighLag,
    follower_missing: FollowerMissing,
  },
  vacuum: {
    inefficient_index_phase: VacuumInefficientIndexPhase,
    optimize_table_bloat: OptimizeTableBloat,
  },
};

export function getCheckDescription(
  checkGroup: string,
  checkName: string
): string | undefined {
  return Docs[checkGroup]?.[checkName]?.description;
}

type CheckProps = {
  checkGroup: string;
  checkName: string;
};

export const CheckTrigger: React.FunctionComponent<
  CheckProps & CheckTriggerProps
> = ({ checkGroup, checkName, config }) => {
  const TriggerComponent = Docs[checkGroup]?.[checkName]?.Trigger;
  if (!TriggerComponent) {
    return null;
  }
  return <TriggerComponent config={config} />;
};

export const CheckGuidance: React.FunctionComponent<
  CheckProps & CheckGuidanceProps
> = ({ checkGroup, checkName, urls, issue }) => {
  const GuidanceComponent = Docs[checkGroup]?.[checkName]?.Guidance;
  if (!GuidanceComponent) {
    return null;
  }
  return <GuidanceComponent urls={urls} issue={issue} />;
};
