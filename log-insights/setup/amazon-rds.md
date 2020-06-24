---
title: 'Log Insights: Install on Amazon RDS & Amazon Aurora'
backlink_href: /docs/log-insights/setup
backlink_title: 'Log Insights: Setup'
---

In order to configure Log Insights for Amazon RDS and Amazon Aurora, please first
make sure that you have setup the [IAM policy](/docs/install/amazon_rds/03_setup_iam_policy) as described in the RDS installation guide.

Note that you will also need to be on the **Scale** plan, or be in your 14-day trial period.
## Installation steps

### 1. Ensure your collector can access the AWS APIs

The collector will only collect log data when you have an Amazon RDS host name specified (the instance name is auto-detected),
or you manually specify the `aws_db_instance_id` and `aws_region` settings.

In addition, you need to ensure that AWS APIs can be accessed either by using the EC2 metadata service, or by manually specifying
the `aws_access_key_id` and `aws_secret_access_key` settings. A complete configuration with all settings looks like this:

```
[pganalyze]
api_key: your_api_key

[server1]
db_name: mydb
db_username: myusername
db_password: mypassword
db_host: mydb.abc123.us-west-1.rds.amazonaws.com
db_port: 5432
aws_db_instance_id: your_rds_instance
aws_region: us-west-2
aws_access_key_id: mykey
aws_secret_access_key: mysecret
```

### 2. Test log download

Now you can test whether the collector can actually access your RDS logs correctly,
by running the following:

```
pganalyze-collector --test
```

If this works correctly you will see output like this:

```
I [server1] Testing statistics collection...
I [server1]   Test submission successful (106 KB received, server abc123)
I [server1] Testing activity snapshots...
I [server1]   Test submission successful (2.12 KB received, server abc123)
I [server1] Testing log collection (Amazon RDS)...
I [server1]   Test submission successful (86 Bytes received, server abc123)
I [server1]   Log test successful
```

If you are getting an error, it sometimes helps to run the test with the `-v` flag to show all details:

```
pganalyze-collector --test -v
```

In case you get permission errors, make sure your IAM user has the [appropriate policy associated](/docs/install/amazon_rds/03_setup_iam_policy).

### 3. Reload the collector

In order to make this change permanent, reload the collector:

```
pganalyze-collector --reload
```

You will then see Log Insights data on your database within a few minutes:

![](log_insights_screenshot.png)

We recommend that you also
[tune a few configuration parameters](/docs/log-insights/setup/tuning-log-config-settings)
to get useful log output from Postgres.
