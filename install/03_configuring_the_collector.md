---
title: 'Step 3: Configuring the Collector'
backlink_href: /docs/install
backlink_title: 'Installation Guide'
---

After you've installed the packages, the collector should already be running on
your server under the "pganalyze" user.

## Configuring the collector

You can find the default configuration file in /etc/pganalyze-collector.conf, and
information on all the settings in the [Collector](/docs/collector) documentation.

You'll need to insert the API key you can find in the pganalyze dashboard,
as well as access credentials to your database.

Note that you'll either need to use PostgreSQL superuser credentials, or setup a [restricted monitoring user](https://github.com/pganalyze/collector#setting-up-a-restricted-monitoring-user) on your database server.

## Testing the new configuration

Before reloading the collector daemon, you can run the following to make sure the configuration works:

```
pganalyze-collector --test
```

If this is successful, all you should see is:

```
1999/01/01 08:04:32 I [default] Test submission successful (1010 KB received) - proceed running the collector as a daemon
```

If you run into an error you can add "-v" to the commandline for additional debug output.

## Reload the collector

You'll now need to reload the running pganalyze collector process, so it picks up the new configuration.

On systemd-based systems (Ubuntu 16.04 LTS, RHEL 7, Fedora 24, Debian Jessie) you can run the following:

```
systemctl reload pganalyze-collector
```

On upstart-based systems (Ubuntu 14.04 LTS) you can run the following:

```
reload pganalyze-collector
```

On sysvinit-based systems (RHEL 6, Amazon Linux) you can run the following:

```
service pganalyze-collector reload
```

You should see a notice in your syslog that the collector has reloaded. The collector will now send data to the pganalyze servers in 10 minute intervals, and your dashboard should start showing data.

---

Congratulations - you're done!

Note that pganalyze is most useful once you've collected a few days worth of data,
but queries will start showing up as soon as you completed these steps and waited for about 20 minutes.
