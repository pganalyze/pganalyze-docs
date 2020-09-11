---
title: 'Using pganalyze on Heroku Postgres'
backlink_href: /docs/install
backlink_title: 'Installation Guide'
---

In order to monitor a Heroku Postgres database you need to run the pganalyze
collector as an app inside your Heroku account.

Through Heroku's add-on attachment system you then attach all databases that
should be monitored to the collector with an alias of your choosing.

Please be aware you will need a Hobby dyno running continuously, which is an
additional charge you have to pay to Heroku in addition to any pganalyze charges.

## 1. Deploy the collector

Deploy the [collector](https://github.com/pganalyze/collector) to your own Heroku account:

<a href="https://heroku.com/deploy?template=https://github.com/pganalyze/collector">
  <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy" />
</a><br /><br />

On the configuration screen, insert your pganalyze <strong>Organization API key</strong>,
found in your API keys page when logged in. Make sure to use the key with access type <strong>collector</strong> - e.g. `ABCDEF123456789` in the screenshot:

![](./amazon_rds/api_keys_overview.png)

Remember the name of the collector app - we will assume you called it `testapp-pganalyze-collector` for the next step.

## 2. Attach databases you want to monitor

First, find out the add-on name of the Heroku Postgres database - this is not the same as your application name on Heroku:

```
$ heroku addons
Owning App                Add-on                        Plan                          Price        State  
────────────────────────  ────────────────────────────  ────────────────────────────  ───────────  ───────
testapp                   postgresql-objective-11111    heroku-postgresql:hobby-dev   free         created
```

Then, use that add-on name (`postgresql-objective-11111` in the example) to attach the Heroku Postgres database to the collector, in addition to your own application:

```
$ heroku addons:attach postgresql-objective-11111 -a testapp-pganalyze-collector --as TESTAPP
Attaching postgresql-objective-11111 as TESTAPP to ⬢ testapp-pganalyze-collector... done
Setting TESTAPP config vars and restarting ⬢ testapp-pganalyze-collector... done, v9
```

## 3. Verify configuration

You can verify that your database has been attached by checking the `heroku config` of the collector application:

```
$ heroku config -a testapp-pganalyze-collector
=== testapp-pganalyze-collector Config Vars
TESTAPP_URL: postgres://...:...@...:.../...
PGA_API_KEY: ...
```

In case you run into issues, make sure to check `heroku logs` of the collector app, it should look like this:

```
2016-12-29T11:30:05.227035+00:00 app[web.1]: I [TESTAPP_URL] Submitted snapshot successfully
```

---

**Congratulations - you're done!**

Note that it will take up to 30 minutes for the first statistics to be shown in pganalyze.

As a next step we recommend reviewing our **[setup instructions for the Log Insights](/docs/log-insights/setup/heroku-postgres)** feature.
