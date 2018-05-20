---
title: 'Installation Guide (Amazon RDS and Amazon Aurora for PostgreSQL)'
backlink_href: /docs/install
backlink_title: 'Installation Guide'
---

This guide details setting up pganalyze for monitoring a Postgres instance running
on Amazon's [Relational Database Service (RDS) for PostgreSQL](https://aws.amazon.com/rds/postgresql/)
as well as Amazon Aurora for PostgreSQL.

If you're looking to monitor a PostgreSQL database running on your own EC2 instances, or anywhere else, use the self-hosted [Installation Guide](/docs/install).

---

1. [Configure your RDS instance](/docs/install/amazon_rds/01_configure_rds_instance)
2. [Create the Monitoring User](/docs/install/amazon_rds/02_create_monitoring_user)
3. [Setup IAM policy](/docs/install/amazon_rds/03_setup_iam_policy)
4. [Install the Collector on an EC2 Instance](/docs/install/amazon_rds/04_install_collector)

---

Also note the following functionality that is fully supported for Amazon RDS and Amazon Aurora databases:

### CloudWatch Monitoring

Pulls down system metrics into pganalyze, including Enhanced Monitoring data.

### Log File Monitoring

See [Log Insights](/docs/log-insights).

### Automatic EXPLAINs

See [Log Insights: Tuning Log Config Settings](/docs/log-insights) to automatically
retrieve EXPLAIN plans using `auto_explain`.
