---
title: 'pganalyze Collector'
backlink_href: /docs
backlink_title: 'Documentation'
---

The pganalyze collector periodically queries your database and sends metrics and metadata (as "snapshots") to
the pganalyze app. This is the only component that talks directly to your database. For details on setting up
the collector, see the [collector installation guide](/docs/install/02_installing_the_collector). The collector
is open-source and the code is available [on GitHub](github.com/pganalyze/collector).


# Configuration Settings

The collector can be configured either through a `INI` config file (in a normal install) or environment variables
(typically for running via its Docker image). Most settings can be configured through either mechanism (if both
are present, the config file takes precedence). Note that a single collector instance can monitor more than one
database server (though this is not supported when configuring through environment variables). The `[pganalyze]`
section describes settings that apply to all servers, and the other sections are named after the database server
they correspond to, and define settings for just that server. When using environment variables, the setting applies
to all monitored servers.

After you make changes, the config file can be reloaded while the collector is running with the command
`pganalyze-collector --reload`. This minimizes monitoring interruptions and simplifies config file updates.

The tables below list configuration settings, their defaults if not set, and their descriptions. If a setting is
configurable through environment variables, the environment variable name follows the setting in parentheses.
Environment variables for boolean settings expect `1` for true and `0` for false.


## General settings

Common settings for configuring monitoring regardless of platform.

<table>
  <thead>
    <tr>
      <th>setting</th>
      <th>default</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>api_key (PGA_API_KEY)</td>
      <td>n/a - required</td>
      <td>
        API key to authenticate the collector to the pganalyze app. We will show this
        when adding a server in the app, and you can review it in your organization's
        API keys page.
      </td>
    </tr>
    <tr>
      <td>api_base_url (PGA_API_BASEURL)</td>
      <td>https://api.pganalyze.com</td>
      <td>URL to contact the pganalyze app. You typically will not need to change this.</td>
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
    <tr>
      <td>enable_reports (PGA_ENABLE_REPORTS)</td>
      <td>false</td>
      <td></td>
    </tr>
    <tr>
      <td>disable_logs (PGA_DISABLE_LOGS)</td>
      <td>false</td>
      <td>Disable log collection and processing</td>
    </tr>
    <tr>
      <td>disable_activity (PGA_DISABLE_ACTIVITY)</td>
      <td>false</td>
      <td>Disable activity snapshots and processing (current vacuums, queries, etc.)</td>
    </tr>
    <tr>
      <td>enable_log_explain (PGA_ENABLE_LOG_EXPLAIN)</td>
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
      <th>setting</th>
      <th>default</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>db_url (DB_URL)</td>
      <td>n/a - either this or individual db_* settings are required</td>
      <td>URL of the database server to monitor</td>
    </tr>
    <tr>
      <td>db_name (DB_NAME)</td>
      <td>n/a - either this or db_url is required</td>
      <td>name of database to monitor; or, comma-separated list of all databases to monitor,
      starting with primary (last entry can be <code>*</code> to monitor all databases on server)</td>
    </tr>
    <tr>
      <td>db_username (DB_USERNAME)</td>
      <td>n/a - either this or db_url is required</td>
      <td>user to connect as</td>
    </tr>
    <tr>
      <td>db_password (DB_PASSWORD)</td>
      <td>n/a - either this or db_url is required</td>
      <td>password to connect with</td>
    </tr>
    <tr>
      <td>db_host (DB_HOST)</td>
      <td>n/a - either this or db_url is required</td>
      <td>host to connect to</td>
    </tr>
    <tr>
      <td>db_port (DB_PORT)</td>
      <td>n/a - either this or db_url is required</td>
      <td></td>
    </tr>
    <tr>
      <td>db_sslmode (DB_SSLMODE)</td>
      <td>prefer</td>
      <td>sslmode to connect with (see <a target="_blank" href="https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNECT-SSLMODE">Postgres documentation</a> for more details)</td>
    </tr>
    <tr>
      <td>db_sslrootcert (DB_SSLROOTCERT)</td>
      <td>system certificate store (?)</td>
      <td>path to SSL certificate authority (CA) certificate(s) to use to verify the server's certificate, or one of <code>rds-ca-2015-root</code> or <code>rds-ca-2019-root</code> to use the built-in AWS RDS certificates</td>
    </tr>
    <tr>
      <td>db_sslrootcert_contents (DB_SSLROOTCERT_CONTENTS)</td>
      <td>n/a, see above</td>
      <td>as above, but actual contents of the certificate(s)</td>
    </tr>
    <tr>
      <td>db_sslcert (DB_SSLCERT)</td>
      <td>[none]</td>
      <td>file name of the client SSL certificate</td>
    </tr>
    <tr>
      <td>db_sslcert_contents (DB_SSLCERT_CONTENTS)</td>
      <td>[none]</td>
      <td>as above, but actual contents of the certificate</td>
    </tr>
    <tr>
      <td>db_sslkey (DB_SSLKEY)</td>
      <td>[none]</td>
      <td>location for the secret key used for the client certificate</td>
    </tr>
    <tr>
      <td>db_sslkey_contents (DB_SSLKEY_CONTENTS)</td>
      <td>[none]</td>
      <td>as above, but actual contents of the key</td>
    </tr>
  </tbody>
</table>

## AWS settings

Only relevant if you are running your database in AWS RDS. Note that the <code>aws_endpoint_*</code>
settings are only relevant if you are using custom AWS endpoints. See
[the AWS documentation](https://docs.aws.amazon.com/sdk-for-go/api/aws/endpoints/) for details.

<table>
  <thead>
    <tr>
      <th>setting</th>
      <th>default</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>aws_region (AWS_REGION)</td>
      <td>n/a, required if aws</td>
      <td>region your AWS server is running in</td>
    </tr>
    <tr>
      <td>aws_db_instance_id (AWS_INSTANCE_ID)</td>
      <td>n/a, required if aws</td>
      <td>the instance id of your AWS server</td>
    </tr>
    <tr>
      <td>aws_access_key_id (AWS_ACCESS_KEY_ID)</td>
      <td>n/a, required if aws and using logs?</td>
      <td>access key id of IAM role with permissions to?</td>
    </tr>
    <tr>
      <td>aws_secret_access_key (AWS_SECRET_ACCESS_KEY)</td>
      <td>n/a, required if aws and using logs?</td>
      <td>secret access key of IAM role with permissions to?</td>
    </tr>
    <tr>
      <td>aws_endpoint_signing_region (AWS_ENDPOINT_SIGNING_REGION)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>aws_endpoint_rds_url (AWS_ENDPOINT_RDS_URL)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>aws_endpoint_ec2_url (AWS_ENDPOINT_EC2_URL)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>aws_endpoint_cloudwatch_url (AWS_ENDPOINT_CLOUDWATCH_URL)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>aws_endpoint_cloudwatch_logs_url (AWS_ENDPOINT_CLOUDWATCH_LOGS_URL)</td>
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
      <th>setting</th>
      <th>default</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>azure_db_server_name (AZURE_DB_SERVER_NAME)</td>
      <td>n/a, required if azure?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>azure_eventhub_namespace (AZURE_EVENTHUB_NAMESPACE)</td>
      <td>n/a, required if azure?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>azure_eventhub_name (AZURE_EVENTHUB_NAME)</td>
      <td>n/a, required if azure?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>azure_ad_tenant_id (AZURE_AD_TENANT_ID)</td>
      <td>n/a, required if azure?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>azure_ad_client_id (AZURE_AD_CLIENT_ID)</td>
      <td>n/a, required if azure?</td>
      <td></td>
    </tr>
    <tr>
      <td>azure_ad_client_secret (AZURE_AD_CLIENT_SECRET)</td>
      <td>n/a, required if azure?</td>
      <td></td>
    </tr>
    <tr>
      <td>azure_ad_certificate_path (AZURE_AD_CERTIFICATE_PATH)</td>
      <td>n/a, required if azure?</td>
      <td></td>
    </tr>
    <tr>
      <td>azure_ad_certificate_password (AZURE_AD_CERTIFICATE_PASSWORD)</td>
      <td>n/a, required if azure?</td>
      <td></td>
    </tr>
  </tbody>
</table>

## Google Cloud Platform

Only relevant if you are running your database in GCP.

<table>
  <thead>
    <tr>
      <th>setting</th>
      <th>default</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>gcp_cloudsql_instance_id (GCP_CLOUDSQL_INSTANCE_ID)</td>
      <td>n/a, required if gcp?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>gcp_pubsub_subscription (GCP_PUBSUB_SUBSCRIPTION)</td>
      <td>n/a, required if gcp?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>gcp_credentials_file (GCP_CREDENTIALS_FILE)</td>
      <td>n/a, required if gcp?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>gcp_project_id (GCP_PROJECT_ID)</td>
      <td>n/a, required if gcp?</td>
      <td>?</td>
    </tr>
  </tbody>
</table>

## Additional settings

Like the general settings above, but less commonly used.

<table>
  <thead>
    <tr>
      <th>setting</th>
      <th>default</th>
      <th>description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>api_system_id (PGA_API_SYSTEM_ID)</td>
      <td>?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>api_system_type (PGA_API_SYSTEM_TYPE)</td>
      <td>?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>api_system_scope (PGA_API_SYSTEM_SCOPE)</td>
      <td>?</td>
      <td>?</td>
    </tr>
    <tr>
      <td>db_log_location (LOG_LOCATION)</td>
      <td>?</td>
      <td>database log file or directory location (must be readable by pganalyze system user)</td>
    </tr>
    <tr>
      <td>db_log_docker_tail</td>
      <td>[none]</td>
      <td>experimental: name of docker container to collect logs from using <code>docker logs -t</code></td>
    </tr>
    <tr>
      <td>ignore_schema_regexp (IGNORE_SCHEMA_REGEXP)</td>
      <td>[none]</td>
      <td>do not monitor matching tables, schemas, or functions; match is checked against schema-qualified object names (e.g.
      to ignore table "foo" only in the public schema, set to <code>^public\.foo$</code>)
      </td>
    </tr>
    <tr>
      <td>query_stats_interval (QUERY_STATS_INTERVAL)</td>
      <td>60</td>
      <td>how often to collect query statistics, in seconds; supported values are `60` (once a minute) and `600` (once every ten minutes)</td>
    </tr>
    <tr>
      <td>max_collector_connections (MAX_COLLECTOR_CONNECTION)</td>
      <td>10</td>
      <td>
        maximum connections allowed to the database with the collector  application_name, in order to protect
        against accidental connection leaks in the collector
      </td>
    </tr>
    <tr>
      <td>filter_log_secret (FILTER_LOG_SECRET)</td>
      <td>none</td>
      <td>none/all/credential/parsing_error/statement_text/statement_parameter/table_data/ops/unidentified (comma separated)</td>
    </tr>
    <tr>
      <td>filter_query_sample (FILTER_QUERY_SAMPLE)</td>
      <td>none</td>
      <td>none/all</td>
    </tr>
    <tr>
      <td>filter_query_text (FILTER_QUERY_TEXT)</td>
      <td>unparsable</td>
      <td>none/unparsable</td>
    </tr>
    <tr>
      <td>http_proxy (HTTP_PROXY)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>https_proxy (HTTPS_PROXY)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
    <tr>
      <td>no_proxy (NO_PROXY)</td>
      <td>[none]</td>
      <td>?</td>
    </tr>
  </tbody>
</table>
