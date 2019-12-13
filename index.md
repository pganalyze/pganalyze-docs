---
title: 'Documentation'
---

* **[Installation Guide](/docs/install)**
  - [Troubleshooting](/docs/install/troubleshooting)

<hr />

* **[Log Insights](/docs/log-insights)**
  - [Setup](/docs/log-insights/setup)
      * [Tuning Log Config Settings](/docs/log-insights/setup/tuning-log-config-settings)
      * [Collect Postgres EXPLAIN plans using auto_explain](/docs/log-insights/setup/auto_explain)
  - [Classifications](/docs/log-insights)
      * [Server](/docs/log-insights/server)
      * [Connections](/docs/log-insights/connections)
      * [WAL & Checkpoints](/docs/log-insights/wal-checkpoints)
      * [Autovacuum](/docs/log-insights/autovacuum)
      * [Locks](/docs/log-insights/locks)
      * [Statements](/docs/log-insights/statements)
      * [Standby Servers](/docs/log-insights/standby)
      * [Constraint Violations](/docs/log-insights/constraint-violations)
      * [Application / User Errors](/docs/log-insights/app-errors)

* **[EXPLAIN](/docs/explain)**
  - [Insights](/docs/explain/insights)
      * [Disk Sorts](/docs/explain/insights/disk-sorts)
      * [Expensive](/docs/explain/insights/expensive)
      * [Hash Batches](/docs/explain/insights/hash-batches)
      * [Inefficient Index](/docs/explain/insights/inefficient-index)
      * [Large Offset](/docs/explain/insights/large-offset)
      * [Lossy Bitmaps](/docs/explain/insights/lossy-bitmaps)
      * [Mis-Estimate](/docs/explain/insights/mis-estimate)
      * [Slow Scan](/docs/explain/insights/slow-scan)
      * [Stale Stats](/docs/explain/insights/stale-stats)
  - [Scan nodes](/docs/explain/scan-nodes)
  - [Join nodes](/docs/explain/join-nodes)
  - [Other nodes](/docs/explain/other-nodes)

* **[Enterprise Edition](/docs/enterprise)**
  - [Initial Setup](/docs/enterprise/setup)
  - [Release Changelog](/docs/enterprise/releases)
  - [Log Insights Setup](/docs/enterprise/log-insights)
  - [Google Auth Setup](/docs/enterprise/google-auth)
  - [Upgrading to new releases](/docs/enterprise/upgrade)

* **[pganalyze GraphQL API](/docs/api)**
  - [Creating an API key](/docs/api/create-api-key)
  - [Queries](/docs/api/queries)
      * [getIssues - Get check-up issues and alerts](/docs/api/queries/getIssues)
      * [getQueryStats - Export query statistics](/docs/api/queries/getQueryStats)
  - [Mutations](/docs/api/mutations)
      * [addServer - Add a server to pganalyze Enterprise Edition](/docs/api/mutations/addServer)

<!--* **[Guides](/docs/guides)**
  - [Tuning checkpoint intervals to reduce I/O spikes](/docs/guides/tuning-checkpoint-intervals)
  - [Adjusting work_mem based on temporary file creation](/docs/guides/adjusting-work-mem)
  - [Exporting query statistics using the pganalyze API](/docs/guides/exporting-query-statistics)
  - [Monitoring Postgres locks using Log Insights](/docs/guides/monitoring-postgres-locks-using-log-insights)
-->

---

* [Permissions and Roles](/docs/permissions)
* [Open-Source Components](/docs/open_source_components)
