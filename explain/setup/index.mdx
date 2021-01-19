---
title: 'Set up automatic EXPLAIN plan collection'
backlink_href: /docs/explain
backlink_title: 'Documentation: EXPLAIN - Overview'
---

### Pre-requisites

* Automatic explain plan collection requires [Log Insights](/docs/log-insights) to be set up successfully

### Choose integration method

pganalyze integrates with two mechanisms for collecting EXPLAIN plans automatically:

* **[auto_explain](/docs/explain/setup/auto_explain)**<br />Postgres collects EXPLAIN (or EXPLAIN ANALYZE) data as part of query processing, based on `auto_explain.log_min_duration`, reflecting the actual plan that was used
* **[Log-based EXPLAIN](/docs/explain/setup/log_explain)**<br />pganalyze collector runs EXPLAIN (without ANALYZE) on all queries logged based on `log_min_duration_statement`, after the query has completed

Generally we recommend utilizing **auto_explain** where available, as it provides higher data quality.

Log-based EXPLAIN is not guaranteed to show the same plan that was executed, and cannot show execution metrics like I/O timing or buffer usage.

### Supported platforms

Platform         | Log-based EXPLAIN |    auto_explain   |
-----------------|-------------------|-------------------|
Amazon RDS       | Yes               | Yes (Recommended) |
Azure Database   | Yes               | No                |
Google Cloud SQL | Yes               | No                |
Heroku Postgres  | Yes               | No                |
Self-managed VM  | Yes               | Yes (Recommended) |
Kubernetes       | No                | No                |
Other PaaS       | No                | No                |

We are constantly evaluating new platform to support - please [reach out](/contact) if you're missing an integration, to help us prioritize.
