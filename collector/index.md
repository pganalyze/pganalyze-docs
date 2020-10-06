---
title: 'pganalyze Collector'
backlink_href: /docs
backlink_title: 'Documentation'
---

The pganalyze collector periodically queries your database and sends metrics and metadata (as "snapshots") to
the pganalyze app. For details on setting up the collector, see the [collector installation guide](/docs/install).
The collector is open-source and the code is available [on GitHub](https://github.com/pganalyze/collector).

For an overview of the collector configuration settings, see the **[Collector Settings](/docs/collector/settings)** page.

# Security

Keeping your data safe is very important to us. We take a number of precautions to minimize the data
we have access to, and to limit our level of access to that data. The collector is the only pganalyze
component that talks directly to your database. In our recommended configuration, the collector uses
a database role with limited access, and can only read system statistics and metadata&mdash;it cannot actually
query your data, or modify your database.

For retrieving database statistics, the collector connects to your database on the port you specify (default 5432)
using the standard Postgres protocol. When using a managed database service, such as Amazon RDS, the collector
will also connect to your provider's API using secure HTTPS connections.

For sending statistics data to the hosted pganalyze service, the collector connects to the pganalyze API at
api.pganalyze.com on port 443, as well as to Amazon S3 at s3.amazonaws.com on port 443.

The collector makes only outbound connections, it does not listen on any ports. The only exception to this is the
Heroku-based setup, where the collector listens on the dyno's PORT for Heroku to consider the application running,
as well as to receive database logs by serving as a Heroku log drain.

