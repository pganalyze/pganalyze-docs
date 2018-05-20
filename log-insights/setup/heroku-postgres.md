---
title: 'Log Insights: Install on Heroku Postgres'
backlink_href: /docs/log-insights/setup
backlink_title: 'Log Insights: Setup'
---

Assuming you have already followed the [installation guide for Heroku Postgres](/docs/install/heroku_postgres)
this describes how you can get Log Insights data into pganalyze for your Heroku Postgres database.

Note that this also assumes you are on the **Scale** plan, or are in your initial
14-day trial period.

## 1. Add log drain to your source application

Log output for Heroku Postgres databases is sent to the application that the
database is attached to, so we need to add a log drain to that application that
forwards log lines to the pganalyze collector app running in your account.

The collector receives log drains at the following URL:

```
https://testapp-pganalyze-collector.herokuapp.com/logs/[ALIAS]
```

For the [ALIAS] value we recommend you use the add-on attachment name you've chosen
in the initial setup, which you can determine by viewing the current Heroku
configuration of your collector app (e.g. `testapp-pganalyze-collector`):

```
$ heroku config -a testapp-pganalyze-collector
=== testapp-pganalyze-collector Config Vars
TESTAPP_URL: postgres://...:...@...:.../...
PGA_API_KEY: ...
```

So in this case we would use `TESTAPP_URL` as our alias, and then we would add the log drain
like this:

```
$ heroku drains:add https://testapp-pganalyze-collector.herokuapp.com/logs/TESTAPP_URL -a testapp
```

## 2. Enable log sending in the collector

To enable the sending of logs in the collector, add `PGA_ENABLE_LOGS=1` to the collector app like this:

```
$ heroku config:add PGA_ENABLE_LOGS=1 -a testapp-pganalyze-collector
```

## 3. Verify that pganalyze is receiving logs

First you can verify whether the log drain data is coming by looking at the router
logs like this:

```
2018-05-20T21:20:40.993026+00:00 heroku[router]: at=info method=POST path="/logs/TESTAPP_URL" host=testapp-pganalyze-collector.herokuapp.com request_id=564088b7-05a9-4def-8aa0-3861b25f9334 fwd="55.22.33.44" dyno=web.1 connect=0ms service=0ms status=200 bytes=135 protocol=https
```

If the collector was able to match the log data to the correct database, you will see a log line like this:

```
2018-05-20T21:22:19.854980+00:00 app[web.1]: I [TESTAPP_URL] Submitted compact logs snapshot successfully
```

And then when you check the pganalyze interface, you will see Log Insights data:

![](log_insights_screenshot.png)

Note that on Heroku Postgres you have [limited configuration options](https://devcenter.heroku.com/articles/heroku-postgres-settings),
but you may want to review the defaults of:

```
log_min_duration_statement = 2000
log_lock_waits = on
log_statement = ddl
```

You can see details on what these settings do in our [tuning guide](/docs/log-insights/setup/tuning-log-config-settings).
