---
title: 'Enterprise Edition: Log Insights Setup'
backlink_href: /docs/enterprise
backlink_title: 'pganalyze Enterprise Edition'
---

## Setting up a storage backend

Using pganalyze Enterprise Edition with Log Insights requires some additional
configuration, which is described in this document.

First of all, you need to decide where to store the log files. Please make a choice
and follow one of these two guides:

1. [Local storage using the Minio storage server](/docs/enterprise/log-insights-local)

2. [Cloud storage using Amazon S3](/docs/enterprise/log-insights-s3)

Once you have successfully completed this, you can change the collector setup
to run on the database servers themselves, in order to have log access:

## Setup collector on self-hosted database servers

In order to collect log information from your database server you will need to install the collector on
the server itself, and configure it.

Note that this is different from the standard Enterprise setup, which runs the collector inside the central pganalyze Docker container.

For this approach, you do not need to add the server into pganalyze itself, as it will auto-register based on an API key, and send all statistics from the database server (instead of pulling them).

Before we get started, retrieve the collector API key from the "API Keys" organization tab in pganalyze (it should already be listed there). If you don't see it in the navigation make sure to click on your organization in the organization dropdown first.

You will also need the hostname of your pganalyze Docker container, which needs to be reachable from your database server.

Now install and enable the pganalyze collector on a server, following the [instructions for pganalyze.com](/docs/install/02_installing_the_collector).

Note that you should be able to follow these instructions as written, with one difference. The [pganalyze] section of the config file needs to look like this:

```
[pganalyze]
api_key: your_pga_organization_api_key
api_base_url: http://your-docker-container.internal
```

Once this works successfully, you can enable [Log Insights for self-hosted servers](/docs/log-insights/setup/self-hosted).

You should then see data flow into the dashboard correctly.
