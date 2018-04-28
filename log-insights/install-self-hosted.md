---
work_in_progress: true
title: 'Log Insights: Install on Self-Hosted System'
backlink_href: /docs/log-insights
backlink_title: 'Log Insights'
---

This guide helps you set up the pganalyze Log Insights feature for a self-hosted system, i.e. one that is managed and configured by yourself, instead of one that is provided as a service by a cloud provider.

Note that your account needs to be on the **Scale** plan or higher to be able to use Log Insights.

## 1. Update pganalyze collector (if needed)

Make sure you are running an up-to-date pganalyze-collector version, by running `yum update pganalyze-collector` or `apt-get upgrade pganalyze-collector`.

## 2. Test log file parsing

Verify that pganalyze is able to read your logfiles by doing the following:

```
pganalyze-collector --analyze-logfile=/path/to/a/postgres-logfile.log
```

The `--analyze-logfile` flag is for debugging and only used for setup purposes. It will return a result like this:

```
log lines: 89, query samples: 0
12 x CHECKPOINT_COMPLETE
12 x CHECKPOINT_STARTING
2 x NOT_NULL_CONSTRAINT_VIOLATION
31 x AUTOANALYZE_COMPLETED
10 x AUTOVACUUM_COMPLETED
6 x CONNECTION_RECEIVED
6 x CONNECTION_AUTHORIZED
6 x CONNECTION_DISCONNECTED
```

In case it returns "log lines: 0" or says log lines can't be classified, please reach out to support.

## 3. Verify file permissions

Make sure that the "pganalyze" user has rights to access the log files:

```
su - pganalyze -c "pganalyze-collector --analyze-logfile=/path/to/a/postgres-logfile.log"
```

This should return the same result as in the previous step.

In case it returns an error you must ensure that the pganalyze user can access the file. See the end of this guide for details on setting up permissions for the built-in Postgres logger.

## 4. Adjust collector configuration

Add the `db_log_location` setting to your pganalyze-collector.conf, so it looks like this:

```
[server1]
db_name: postgres
db_username: postgres
db_host: 127.0.0.1
db_port: 5432
db_log_location: /path/to/a/postgres-logfile.log
```

Note that you can also specify a directory to be watched, instead of a single file. In particular, it makes sense to set `db_log_location` to a directory (instead of a specific file) if you use Postgres built-in `stderr` logging instead of syslog.

## 5. Reload your collector

```
pganalyze-collector --reload
```

After this you should see data showing up in the "Log Insights" tab in pganalyze within less than a minute:

<%= image_tag('/images-old/docs/log_insights_screenshot.png', width: 970) %>


---

## Supported log_line_prefix settings

Currently we support the following log_line_prefix settings when using Postgres built-in `stderr` logging:

* `log_line_prefix = '%t:%r:%u@%d:[%p]:'`
* `log_line_prefix = '%m [%p][%v] : [%l-1] %q[app=%a] '`
* `log_line_prefix = '%t [%p-%l] %q%u@%d '`

We also support the parsing of `rsyslogd` log lines that look like the following default template, with an empty log\_line\_prefix:

```
Feb  2 09:04:39 ip-172-31-14-41 postgres[7395]: [3-1] LOG:  database system is ready to accept connections
```

If you have a log\_line\_prefix config thats not covered, please reach out to us, as it is easy for us to add additional parsing support.

## Allowing access when using Postgres built-in logging

In the case of built-in Postgres logging you will likely run into the issue that
log files are by default written in a way that prevents users other than the
postgres user from accessing them.

We need to grant the pganalyze user access to them, by doing the following:

First choose a location for log files thats outside of the Postgres data directory,
and then set it up like this:

```
mkdir /my/log/directory
chown postgres:postgres /my/log/directory
```

Also make sure that the pganalyze user can access this directory, by making it a member of the postgres group:

```
usermod -a -G postgres pganalyze
```

Adjust the Postgres configuration to log everything to this new directory by doing the following:

```
log_directory = '/my/log/directory'
log_file_mode = 0640
```

Reload Postgres afterwards and then re-run the permission test as described in Step 3.

## Allowing access when using rsyslogd built-in logging

For rsyslogd and other syslog daemons, the issue can often be that new log files
are created with permissions that don't allow the pganalyze user access.

Assuming that your the log files are owned by the Postgres user, you first
need to add the pganalyze user to the postgres group:

```
usermod -a -G postgres pganalyze
```

And then make sure that new files are written with chmod 640, in your `/etc/rsyslog.conf`:

```
# Place this at the beginning of the rsyslog.conf file:
$umask 0000
$FileCreateMode 0600

# Place this where the postgres log is being output
$FileCreateMode 0640
local0.* /var/log/postgres/postgres.log
$FileCreateMode 0600
```

As well as making sure the current log file has the correct permissions:

```
chmod 640 /var/log/postgres/postgres.log
```

Then reload rsyslog and go back to Step 3.
