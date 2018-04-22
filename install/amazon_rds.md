---
title: 'Installation Guide (Amazon RDS for PostgreSQL)'
backlink_href: /docs/install
backlink_title: 'Installation Guide'
---

This guide details setting up pganalyze for monitoring a Postgres instance running
on Amazon's [Relational Database Service (RDS) for PostgreSQL](https://aws.amazon.com/rds/postgresql/).

If you're looking to monitor a PostgreSQL database running on your own EC2 instances, or anywhere else, use the normal [Installation Guide](/docs/install).

---

1. [Configure your RDS instance](/docs/install/amazon_rds/01_configure_rds_instance)
2. [Create the Monitoring User](/docs/install/amazon_rds/02_create_monitoring_user)
3. [Setup IAM policy](/docs/install/amazon_rds/03_setup_iam_policy)
4. [Install the Collector on an EC2 Instance](/docs/install/amazon_rds/04_install_collector)

---

By following this guide you get this additional functionality for Amazon RDS databases:

### CloudWatch Monitoring

Pulls down system metrics into pganalyze, including Enhanced Monitoring data.

### Log File Monitoring (coming soon)

Watches your PostgreSQL log files continuously and makes them easily accessible to you.

### Automatic EXPLAINs (coming soon)

Use `log_min_duration_statement` to set a threshold for statement runtime (e.g. slower than 1s),<br>
the pganalyze collector will then automatically run [EXPLAIN](http://www.postgresql.org/docs/9.5/static/sql-explain.html) as needed to get query plan<br>
information, and make it available in the pganalyze dashboard.

---

This integration is currently in public beta testing - if you run into issues please let us know!
