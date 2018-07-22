---
title: 'Documentation'
---

* **[Installation Guide](/docs/install)**
  1. [Enabling pg\_stat\_statements](/docs/install/01_enabling_pg_stat_statements)
  2. [Installing the Collector](/docs/install/02_installing_the_collector)
  3. [Configuring the Collector](/docs/install/03_configuring_the_collector)

* **[Installation Guide (Amazon RDS)](/docs/install/amazon_rds)**
  1. [Configure your RDS instance](/docs/install/amazon_rds/01_configure_rds_instance)
  2. [Create the Monitoring User](/docs/install/amazon_rds/02_create_monitoring_user)
  3. [Setup IAM policy](/docs/install/amazon_rds/03_setup_iam_policy)
  4. [Install the Collector on an EC2 Instance](/docs/install/amazon_rds/04_install_collector)

* **[Installation Guide (Heroku Postgres)](/docs/install/heroku_postgres)**

<hr />

* **[Log Insights](/docs/log-insights)**
  - [Setup](/docs/log-insights/setup)
      * [Install on Amazon RDS & Amazon Aurora](/docs/log-insights/setup/amazon-rds)
      * [Install on Heroku Postgres](/docs/log-insights/setup/heroku-postgres)
      * [Install on Self-Hosted Server](/docs/log-insights/setup/self-hosted)
      * [Tuning Log Config Settings](/docs/log-insights/setup/tuning-log-config-settings)
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

* **[Enterprise Edition](/docs/enterprise)**
  - [Initial Setup](/docs/enterprise/setup)
  - [Release Changelog](/docs/enterprise/releases)
  - [Log Insights Setup](/docs/enterprise/log-insights)
  - [Google Auth Setup](/docs/enterprise/google-auth)

* **[Guides](/docs/guides)**
  - [Tuning checkpoint intervals to reduce I/O spikes](/docs/guides/tuning-checkpoint-intervals)
  - [Adjusting work_mem based on temporary file creation](/docs/guides/adjusting-work-mem)
  - [Exporting query statistics using the pganalyze API](/docs/guides/exporting-query-statistics)
  - [Monitoring Postgres locks using Log Insights](/docs/guides/monitoring-postgres-locks-using-log-insights)

---

* [Permissions and Roles](/docs/permissions)
* [Open-Source Components](/docs/open_source_components)
