---
title: 'Installation Guide'
backlink_href: /docs
backlink_title: 'Documentation'
---

In order to use our service you need to install the [pganalyze collector](https://github.com/pganalyze/collector) on
your Postgres database server.

The collector sends normalized query data and other statistics to our service
every 10 minutes.

The minimum supported PostgreSQL version is 9.2.

---

On your own database server, follow these steps:

1. [Enable pg\_stat\_statements](/docs/install/01_enabling_pg_stat_statements)
2. [Install the collector](/docs/install/02_installing_the_collector)
3. [Configure the collector](/docs/install/03_configuring_the_collector)

---

Alternative installation options:

* [Amazon Web Services](/docs/install/amazon_rds) (including [Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/))
* [Heroku Postgres](/docs/install/heroku_postgres)
* [Enterprise (On-Premise)](/docs/enterprise)

---

If you run into issues, take a look at the [Troubleshooting section](/docs/install/troubleshooting).
