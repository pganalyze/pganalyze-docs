export const CHECK_TITLES = {
  queries: {
    slowness: "New Slow Queries",
  },
  connections: {
    active_query: "Active Queries",
    idle_transaction: "Idle Transactions",
    blocking_query: "Blocking Queries",
  },
  index_advisor: {
    missing_index: "Missing Index",
  },
  schema: {
    index_invalid: "Invalid Indexes",
    index_unused: "Unused Indexes",
  },
  settings: {
    enable_features: "Config - Disabled features",
    fsync: "Config - Disabled fsync",
    shared_buffers: "Config - Too small shared_buffers",
    stats: "Config - Disabled stats collection",
    work_mem: "Config - Too small work_mem",
  },
  system: {
    storage_space: "Out Of Disk Space",
  },
  replication: {
    high_lag: "Replication - High Lag",
    follower_missing: "Replication - Missing HA Follower",
  },
};

export const CHECK_SEVERITIES = {
  queries: {
    slowness: ['info'],
  },
  connections: {
    active_query: ['warning', 'critical'],
    idle_transaction: ['warning', 'critical'],
    blocking_query: ['warning', 'critical'],
  },
  index_advisor: {
    missing_index: ['info'],
  },
  schema: {
    index_invalid: ['info'],
    index_unused: ['info'],
  },
  settings: {
    enable_features: ['info'],
    fsync: ['critical'],
    shared_buffers: ['warning'],
    stats: ['warning'],
    work_mem: ['warning'],
  },
  system: {
    storage_space: ['warning', 'critical'],
  },
  replication: {
    high_lag: ['warning', 'critical'],
    follower_missing: ['critical'],
  },
}

export function checkMaxSeverity(checkGroup: string, checkName: string): string | undefined {
  const severities = CHECK_SEVERITIES[checkGroup]?.[checkName];
  if (!severities) {
    return undefined;
  }
  if (severities.includes('critical')) {
    return 'critical';
  } else if (severities.includes('warning')) {
    return 'warning';
  } else if (severities.includes('info')) {
    return 'info';
  } else {
    return undefined;
  }
}


export function checkTitle(checkGroup: string, checkName: string): string {
  return CHECK_TITLES[checkGroup]?.[checkName] ?? "Unknown check";
}

export const CHECK_FREQUENCY_30MIN = "Every 30 minutes";
export const CHECK_FREQUENCY_REALTIME = "Near Realtime (every 10 seconds)";
export const CHECK_FREQUENCY_DAILY = "Daily";
export const CHECK_FREQUENCY = {
  queries: {
    slowness: CHECK_FREQUENCY_DAILY,
  },
  connections: {
    active_query: CHECK_FREQUENCY_REALTIME,
    idle_transaction: CHECK_FREQUENCY_REALTIME,
    blocking_query: CHECK_FREQUENCY_REALTIME,
  },
  index_advisor: {
    missing_index: CHECK_FREQUENCY_DAILY,
  },
  schema: {
    index_invalid: CHECK_FREQUENCY_30MIN,
    index_unused: CHECK_FREQUENCY_DAILY,
  },
  settings: {
    enable_features: CHECK_FREQUENCY_30MIN,
    fsync: CHECK_FREQUENCY_30MIN,
    shared_buffers: CHECK_FREQUENCY_30MIN,
    stats: CHECK_FREQUENCY_30MIN,
    work_mem: CHECK_FREQUENCY_30MIN,
  },
  system: {
    storage_space: CHECK_FREQUENCY_30MIN,
  },
  replication: {
    high_lag: CHECK_FREQUENCY_30MIN,
    follower_missing: CHECK_FREQUENCY_30MIN,
  },
};

export const DEFAULT_CHECK_CONFIGS = {
  queries: {
    slowness: {
      enabled: true,
      settings: {
        threshold_ms: 50,
        minimum_calls: 50
      }
    },
  },
  connections: {
    active_query: {
      enabled: true,
      settings: {
        warning_max_query_age_secs: 1800,
        critical_max_query_age_secs: 3600
      }
    },
    idle_transaction: {
      enabled: true,
      settings: {
        warning_max_idle_tx_age_secs: 1800,
        critical_max_idle_tx_age_secs: 3600
      }
    },
    blocking_query: {
      enabled: true,
      settings: {
        warning_blocked_age_secs: 300,
        critical_blocked_age_secs: 600,
        blocked_count: 3
      }
    }
  },
  index_advisor: {
    missing_index: {
      enabled: true
    }
  },
  schema: {
    index_invalid: {
      enabled: true
    },
    index_unused: {
      enabled: true
    },
  },
  settings: {
    enable_features: {
      enabled: true
    },
    fsync: {
      enabled: true
    },
    shared_buffers: {
      enabled: true
    },
    stats: {
      enabled: true
    },
    work_mem: {
      enabled: true
    },
  },
  system: {
    // N.B.: server defaults uses system/disk_space
    storage_space: {
      enabled: true,
      settings: {
        critical_pct: 98,
        warning_pct: 90,
        base_threshold_gigabytes: 50
      }
    },
  },
  replication: {
    high_lag: {
      enabled: true,
      settings: {
        warning_threshold_mb: 100,
        critical_threshold_mb: 1024
      }
    },
    follower_missing: {
      enabled: true,
      settings: {
        expected_count: 0
      }
    }
  },
}

export function checkDefaultConfig(
  checkGroup: string,
  checkName: string
): string {
  return DEFAULT_CHECK_CONFIGS[checkGroup]?.[checkName];
}

export function checkFrequency(
  checkGroup: string,
  checkName: string
): string | undefined {
  return CHECK_FREQUENCY[checkGroup]?.[checkName];
}

// This type describes the documentation format to use for checks, and a rough style
// guide for documenting them. The intent is to have these feel natural and consistent
// in the UI. Note that the documentation has access to the check and issue for concrete
// resolution guidance.

export type CheckConfig = {
  enabled: boolean;
  settings: { [key: string]: string | number | boolean };
};

export type CheckTriggerProps = {
  config: CheckConfig;
};

export type IssueGuidanceUrls = {
  firstReferenceUrl: string;
  SettingLink: React.ComponentType<{ setting: string }>;
  queriesUrl: string;
  indexRecommendationUrl: string;
  serverSystemUrl: string;
  serverVacuumsUrl: string;
  backendsUrl: string;
  databaseWaitEventsUrl: string;
  databaseTableUrl: string;
  serverLogInsightsUrl: string;
  serverSchemaUrl: string;
  featureUrl: (mainUrl: string | undefined, section: string) => string | undefined;
};

export function featureUrl (mainUrl: string | undefined, section: string): string | undefined {
  if (mainUrl == undefined) {
    return undefined;
  }
  return `${mainUrl}/${section}`;
}

export type IssueReferenceBackend = {
  pid: string;
};

export type IssueReferenceIndex = {
  tableId: string;
  schemaName: string;
  name: string;
};

export type IssueType = {
  references?: {
    referent: IssueReferenceBackend | IssueReferenceIndex | unknown;
  }[],
  detailsJson: string;
};

export type CheckGuidanceProps = {
  urls: IssueGuidanceUrls;
  issue: IssueType;
};

export type CheckDocs = {
  description: string;
  // Used in CheckUpDetail to describe the check at a high level. We may want to consolidate this
  // with trigger below, but note that this is in the context of the check itself, whereas
  // the trigger docs are displayed in the context of a specific issue raised by the check.

  Trigger: React.ComponentType<CheckTriggerProps>;
  // wording:
  //  - starts with "Detects ..."
  //  - "creates an issue with severity ..." -- a little verbose, open to better ideas especially here
  //  - "Escalates to ..." to describe when an issue escalates to a higher severity
  //  - does not mention severity downgrades (do we do these?)
  //  - "Resolves automatically ..." to describe when an issue resolves
  //  - "Ignores ..." for any exceptions to the check (whether configurable or not)
  //
  // note this may reference check settings defined in DEFAULT_CHECK_CONFIGS in app/services/checks.rb

  Guidance: React.ComponentType<CheckGuidanceProps>;
  // wording:
  // - Impact: why is this a problem?
  // - (optional) Common causes: why did this happen?
  //   - omit this if there's always a clear cause (like an incorrect setting value)
  //   - each cause should have guidance as to how to investigate it (to determine if it's indeed the cause in this case)
  //     and how to address the cause if relevant
  // - (optional) Solution: what can i do about it?
  //   - only include this if there's a clear action to take regardless of cause (or if there's only one cause like an incorrect setting)
  //   - if both this and Common Causes are included, avoid duplicating information across the two
};
