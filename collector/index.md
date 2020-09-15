---
title: 'pganalyze Collector'
backlink_href: /docs
backlink_title: 'Documentation'
---

```toc
```

The pganalyze collector periodically queries your database and sends metrics and metadata (as "snapshots") to
the pganalyze app. For details on setting up the collector, see the [collector installation guide](/docs/install/02_installing_the_collector).
The collector is open-source and the code is available [on GitHub](https://github.com/pganalyze/collector).

# Security

Keeping your data safe is very important to us. We take a number of precautions to minimize the data
we have access to, and to limit our level of access to that data. The collector is the only pganalyze
component that talks directly to your database. In our recommended configuration, the collector uses
a database role with limited access, and can only read system statistics and metadata&mdash;it cannot actually
query your data.

The collector connects to your database on the port you specify (default 5432) using the standard Postgres
protocol, to Amazon S3 also over https (port 443) to upload monitoring data, and to the pganalyze API also
over https. The collector only makes outbound connections&mdash;it does not listen on any ports.


# Configuration Settings

The collector can be configured either through an `INI` config file (in a package-based install) or environment
variables (typically for running via its Docker image). Most settings can be configured through either mechanism.
If both are present, the config file takes precedence. Note that a single collector instance can monitor more than
one database server, though this is not supported when configuring through environment variables.

The `[pganalyze]` section describes settings that apply to all servers. Other sections describe the servers to
monitor, how to connect to them, and server-specific configuration settings. You should name the other sections after
the servers they correspond to, though note these are not the names that will appear in the app. In-app names are
based on hostname settings as determined during monitoring. When using environment variables, the setting applies
to all monitored servers.

After you make changes, you can run `pganalyze-collector --test --reload` to verify the new configuration and load
the new configuration in the collector service if they work correctly. This minimizes monitoring interruptions and
simplifies config file updates.

The tables below list configuration settings, their defaults if not set, and their descriptions. If a setting is
configurable through environment variables, the environment variable name follows the setting in parentheses.
Environment variables for boolean settings expect `1` for true and `0` for false.


## General settings

Common settings for configuring monitoring regardless of platform.

<table>
  <thead>
    <tr>
      <th>Setting</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>api_key (<code>PGA_API_KEY</code>)</td>
      <td>n/a, required</td>
      <td>
        API key to authenticate the collector to the pganalyze app. We will show this
        when adding a server in the app, and you can review it in your organization's
        API keys page.
      </td>
    </tr>
    <tr>
      <td>api_base_url (<code>PGA_API_BASEURL</code>)</td>
      <td>https://api.pganalyze.com</td>
      <td>
        Base URL for contacting the pganalyze API. You typically do not need to change this, unless you are
        running <a href="https://github.com/docs/enterprise">pganalyze Enterprise Edition</a>.
      </td>
    </tr>
    <!--
      omit this for now
      <tr>
        <td>enable_reports (<code>PGA_ENABLE_REPORTS</code>)</td>
        <td>false</td>
        <td></td>
      </tr>
    -->
    <tr>
      <td>ignore_schema_regexp (<code>IGNORE_SCHEMA_REGEXP</code>)</td>
      <td>[none]</td>
      <td>do not monitor matching tables, schemas, or functions; match is checked against schema-qualified object names (e.g.
      to ignore table "foo" only in the public schema, set to <code>^public\.foo$</code>)
      </td>
    </tr>
    <tr>
      <td>enable_log_explain (<code>PGA_ENABLE_LOG_EXPLAIN</code>)</td>
      <td>false</td>
      <td>Enable log-based EXPLAIN. See <a href="/docs/explain/setup/log_explain">setup instructions</a>, but note 
      we recommend using <a href="/docs/explain/setup/auto_explain">autoexplain</a> instead if possible
      </td>
    </tr>
  </tbody>
</table>

## Server connection settings

How to connect to the server(s) pganalyze will be monitoring. Note that when monitoring multiple
databases on the same server, one is considered the primary. This is where helper functions
are expected to be defined, and the one we connect to for server-wide metrics.

<table>
  <thead>
    <tr>
      <th>Setting</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>db_url (<code>DB_URL</code>)</td>
      <td>n/a, either this or individual db_* settings are required</td>
      <td>URL of the database server to monitor</td>
    </tr>
    <tr>
      <td>db_name (<code>DB_NAME</code>)</td>
      <td>n/a, either this or db_url is required</td>
      <td>Name of database to monitor; or, comma-separated list of all databases to monitor,
      starting with primary (last entry can be <code>*</code> to monitor all databases on server)</td>
    </tr>
    <tr>
      <td>db_username (<code>DB_USERNAME</code>)</td>
      <td>n/a, either this or db_url is required</td>
      <td>User to connect as</td>
    </tr>
    <tr>
      <td>db_password (<code>DB_PASSWORD</code>)</td>
      <td>n/a, either this or db_url is required</td>
      <td>Password to connect with</td>
    </tr>
    <tr>
      <td>db_host (<code>DB_HOST</code>)</td>
      <td>n/a, either this or db_url is required</td>
      <td>Host to connect to</td>
    </tr>
    <tr>
      <td>db_port (<code>DB_PORT</code>)</td>
      <td>n/a, either this or db_url is required</td>
      <td>Port to connect on</td>
    </tr>
    <tr>
      <td>db_sslmode (<code>DB_SSLMODE</code>)</td>
      <td>prefer</td>
      <td>The <code>sslmode</code> setting to connect with (see <a target="_blank" href="https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNECT-SSLMODE">Postgres documentation</a> for more details)</td>
    </tr>
    <tr>
      <td>db_sslrootcert (<code>DB_SSLROOTCERT</code>)</td>
      <td>system certificate store (?)</td>
      <td>Path to SSL certificate authority (CA) certificate(s) to use to verify the server's certificate, or one of <code>rds-ca-2015-root</code> or <code>rds-ca-2019-root</code> to use the built-in AWS RDS certificates</td>
    </tr>
    <tr>
      <td>db_sslrootcert_contents (<code>DB_SSLROOTCERT_CONTENTS</code>)</td>
      <td>n/a, see above</td>
      <td>Alternative to above, using actual contents of the certificate(s) instead</td>
    </tr>
    <tr>
      <td>db_sslcert (<code>DB_SSLCERT</code>)</td>
      <td>[none]</td>
      <td>Path to the client SSL certificate</td>
    </tr>
    <tr>
      <td>db_sslcert_contents (<code>DB_SSLCERT_CONTENTS</code>)</td>
      <td>[none]</td>
      <td>Alternative to above, using actual contents of the certificate instead</td>
    </tr>
    <tr>
      <td>db_sslkey (<code>DB_SSLKEY</code>)</td>
      <td>[none]</td>
      <td>Path to the secret key used for the client certificate</td>
    </tr>
    <tr>
      <td>db_sslkey_contents (<code>DB_SSLKEY_CONTENTS</code>)</td>
      <td>[none]</td>
      <td>Alternative to above, using actual contents of the key</td>
    </tr>
  </tbody>
</table>

## PII Filtering settings

We take the responsibility of access to your database very seriously. As discussed above, we already
limit the direct access we have to your data, but some personally-identifiable information or other
sensitive values can still come up in query text or logs. To address this, the collector has several
settings to filter these before we collect them.

<table>
  <thead>
    <tr>
      <th>Setting</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>filter_log_secret (<code>FILTER_LOG_SECRET</code>)</td>
      <td>none</td>
      <td>none/all/credential/parsing_error/statement_text/statement_parameter/table_data/ops/unidentified (comma separated)</td>
    </tr>
    <tr>
      <td>filter_query_sample (<code>FILTER_QUERY_SAMPLE</code>)</td>
      <td>none</td>
      <td>none/all</td>
    </tr>
    <tr>
      <td>filter_query_text (<code>FILTER_QUERY_TEXT</code>)</td>
      <td>unparsable</td>
      <td>none/unparsable</td>
    </tr>
  </tbody>
</table>


## AWS settings

Only relevant if you are running your database in AWS RDS. Note that the `aws_endpoint_*`
settings are only relevant if you are using custom AWS endpoints. See
[the AWS documentation](https://docs.aws.amazon.com/sdk-for-go/api/aws/endpoints/) for details.

<table>
  <thead>
    <tr>
      <th>Setting</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>aws_region (<code>AWS_REGION</code>)</td>
      <td>auto-detected from hostname</td>
      <td>Region your AWS server is running in</td>
    </tr>
    <tr>
      <td>aws_db_instance_id (<code>AWS_INSTANCE_ID</code>)</td>
      <td>auto-detected from hostname</td>
      <td>Instance id of your AWS server; may need to be set manually when using IP addresses or custom DNS records</td>
    </tr>
    <tr>
      <td>aws_access_key_id (<code>AWS_ACCESS_KEY_ID</code>)</td>
      <td>required unless using instance roles for an EC2 instance</td>
      <td>Access key id of IAM role with permissions to?</td>
    </tr>
    <tr>
      <td>aws_secret_access_key (<code>AWS_SECRET_ACCESS_KEY</code>)</td>
      <td>n/a, required?</td>
      <td>Secret access key of IAM role with permissions to?</td>
    </tr>
    <tr>
      <td>aws_endpoint_signing_region (<code>AWS_ENDPOINT_SIGNING_REGION</code>)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>aws_endpoint_rds_url (<code>AWS_ENDPOINT_RDS_URL</code>)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>aws_endpoint_ec2_url (AWS_ENDPOINT_EC2_URL)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>aws_endpoint_cloudwatch_url (<code>AWS_ENDPOINT_CLOUDWATCH_URL</code>)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>aws_endpoint_cloudwatch_logs_url (<code>AWS_ENDPOINT_CLOUDWATCH_LOGS_URL</code>)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
  </tbody>
</table>

## Azure settings

Only relevant if you are running your database in Azure.

<table>
  <thead>
    <tr>
      <th>Setting</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>azure_db_server_name (<code>AZURE_DB_SERVER_NAME</code>)</td>
      <td>auto-detected from hostname</td>
      <td>Name of your server; may need to be set manually when using IP addresses or custom DNS records</td>
    </tr>
    <tr>
      <td>azure_eventhub_namespace (<code>AZURE_EVENTHUB_NAMESPACE</code>)</td>
      <td>n/a, required for Log Insights</td>
      <td>See <a href="https://pganalyze.com/docs/log-insights/setup/azure-database#step-2-setup-azure-event-hub">Azure setup instructions</a> for details</td>
    </tr>
    <tr>
      <td>azure_eventhub_name (<code>AZURE_EVENTHUB_NAME</code>)</td>
      <td>n/a, required?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>azure_ad_tenant_id (<code>AZURE_AD_TENANT_ID</code>)</td>
      <td>n/a, required?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>azure_ad_client_id (<code>AZURE_AD_CLIENT_ID</code>)</td>
      <td>n/a, required?</td>
      <td></td>
    </tr>
    <tr>
      <td>azure_ad_client_secret (<code>AZURE_AD_CLIENT_SECRET</code>)</td>
      <td>n/a, required?</td>
      <td></td>
    </tr>
    <tr>
      <td>azure_ad_certificate_path (<code>AZURE_AD_CERTIFICATE_PATH</code>)</td>
      <td>n/a, required?</td>
      <td></td>
    </tr>
    <tr>
      <td>azure_ad_certificate_password (<code>AZURE_AD_CERTIFICATE_PASSWORD</code>)</td>
      <td>n/a, required?</td>
      <td></td>
    </tr>
  </tbody>
</table>

## Google Cloud Platform

Only relevant if you are running your database in GCP.

<table>
  <thead>
    <tr>
      <th>Setting</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>gcp_cloudsql_instance_id (<code>GCP_CLOUDSQL_INSTANCE_ID</code>)</td>
      <td>n/a, required?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>gcp_pubsub_subscription (<code>GCP_PUBSUB_SUBSCRIPTION</code>)</td>
      <td>n/a, required for Log Insights</td>
      <td>
        See <a href="https://pganalyze.com/docs/log-insights/setup/google-cloud-sql#step-1-create-new-pubsub-topic-and-subscriber">
        GCP setup instructions</a> for details</td>
    </tr>
    <tr>
      <td>gcp_credentials_file (<code>GCP_CREDENTIALS_FILE</code>)</td>
      <td>n/a, required?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>gcp_project_id (<code>GCP_PROJECT_ID</code>)</td>
      <td>n/a, required?</td>
      <td>?</td>
    </tr>
  </tbody>
</table>

## Self-managed servers

If running on your own infrastructure or a platform other than the cloud providers listed above,
the configuration settings here may be useful.

<table>
  <thead>
    <tr>
      <th>Setting</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>db_log_location (<code>LOG_LOCATION</code>)</td>
      <td>n/a, required for Log Insights</td>
      <td>database log file or directory location (must be readable by pganalyze system user)</td>
    </tr>
  </tbody>
</table>

## Additional settings

Like the general settings above, but less commonly used.

<table>
  <thead>
    <tr>
      <th>Setting</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>api_system_id (<code>PGA_API_SYSTEM_ID</code>)</td>
      <td>?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>api_system_type (<code>PGA_API_SYSTEM_TYPE</code>)</td>
      <td>?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>api_system_scope (<code>PGA_API_SYSTEM_SCOPE</code>)</td>
      <td>?</td>
      <td>?</td>
    </tr>
    <!--
      only really useful for development
      <tr>
        <td>db_log_docker_tail</td>
        <td>[none]</td>
        <td>experimental: name of docker container to collect logs from using <code>docker logs -t</code></td>
      </tr>
    -->
    <tr>
      <td>query_stats_interval (<code>QUERY_STATS_INTERVAL</code>)</td>
      <td>60</td>
      <td>how often to collect query statistics, in seconds; supported values are `60` (once a minute) and `600` (once every ten minutes)</td>
    </tr>
    <tr>
      <td>max_collector_connections (<code>MAX_COLLECTOR_CONNECTION</code>)</td>
      <td>10</td>
      <td>
        maximum connections allowed to the database with the collector application_name, in order to protect
        against accidental connection leaks in the collector
      </td>
    </tr>
    <tr>
      <td>http_proxy (<code>HTTP_PROXY</code>)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>https_proxy (<code>HTTPS_PROXY</code>)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>no_proxy (<code>NO_PROXY</code>)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>disable_logs (<code>PGA_DISABLE_LOGS</code>)</td>
      <td>false</td>
      <td>Disable log collection and processing</td>
    </tr>
    <tr>
      <td>disable_activity (<code>PGA_DISABLE_ACTIVITY</code>)</td>
      <td>false</td>
      <td>Disable activity snapshots and processing (current vacuums, queries, etc.)</td>
    </tr>
    <tr>
      <td>error_callback</td>
      <td>[none]</td>
      <td>
        Script to call if snapshot fails (learn more <a target="_blank" href="https://github.com/pganalyze/collector/#successerror-callbacks">in the collector README</a>)
      </td>
    </tr>
    <tr>
      <td>success_callback</td>
      <td>[none]</td>
      <td>
        Script to call if snapshot succeeds (learn more <a target="_blank" href="https://github.com/pganalyze/collector/#successerror-callbacks">in the collector README</a>)
      </td>
    </tr>
  </tbody>
</table>
