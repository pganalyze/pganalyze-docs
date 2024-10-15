import React from "react";

import { useCodeBlock } from "./CodeBlock";
import { useGeneratedPassword } from "./WithGeneratedPassword";

type Props = {
  adminUsername?: string;
  noPgMonitor?: boolean;
};

const MonitoringUserSetupInstructions: React.FunctionComponent<Props> = ({
  adminUsername,
  noPgMonitor
}) => {
  const password = useGeneratedPassword();
  return (
    <>
      <MonitoringUserBase password={password} noPgMonitor={noPgMonitor} />
      <MonitoringUserPerDatabaseHelpers username="pganalyze" adminUsername={adminUsername} />
    </>
  );
};

export const MonitoringUserPerDatabaseHelpers: React.FunctionComponent<{ username: string, adminUsername: string }> = ({
  username,
  adminUsername
}) => {
  const adminUserStr = !!adminUsername ? <strong>{adminUsername}</strong> : 'a superuser (or equivalent)'
  const CodeBlock = useCodeBlock();
  return (
    <>
      <p>
        Then, connect to each database that you plan to monitor on this server as {adminUserStr} and
        run the following to enable the collection of additional column statistics and extended statistics:
      </p>
      <CodeBlock>
        {`CREATE SCHEMA IF NOT EXISTS pganalyze;
GRANT USAGE ON SCHEMA pganalyze TO ${username};

DROP FUNCTION IF EXISTS pganalyze.get_column_stats;
CREATE FUNCTION pganalyze.get_column_stats() RETURNS TABLE(
  schemaname name, tablename name, attname name, inherited bool, null_frac real, avg_width int, n_distinct real, correlation real
) AS $$
  /* pganalyze-collector */
  SELECT schemaname, tablename, attname, inherited, null_frac, avg_width, n_distinct, correlation
  FROM pg_catalog.pg_stats
  WHERE schemaname NOT IN ('pg_catalog', 'information_schema') AND tablename <> 'pg_subscription';
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;

DROP FUNCTION IF EXISTS pganalyze.get_relation_stats_ext;
CREATE FUNCTION pganalyze.get_relation_stats_ext() RETURNS TABLE(
  statistics_schemaname text, statistics_name text,
  inherited boolean, n_distinct pg_ndistinct, dependencies pg_dependencies,
  most_common_val_nulls boolean[], most_common_freqs float8[], most_common_base_freqs float8[]
) AS
$$
  /* pganalyze-collector */ SELECT statistics_schemaname::text, statistics_name::text,
  (row_to_json(se.*)::jsonb ->> 'inherited')::boolean AS inherited, n_distinct, dependencies,
  most_common_val_nulls, most_common_freqs, most_common_base_freqs
  FROM pg_catalog.pg_stats_ext se
  WHERE schemaname NOT IN ('pg_catalog', 'information_schema') AND tablename <> 'pg_subscription';
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}
      </CodeBlock>
      <p>
        <strong>Note:</strong> We never collect actual table data through this method (see the <code>NULL</code> values
        in the <code>get_column_stats</code> function and omitted fields like <code>most_common_vals</code> in
        the <code>get_relation_stats_ext</code> function), but we do collect statistics about the distribution of
        values in your tables. You can skip creating the <code>get_column_stats</code> and <code>get_relation_stats_ext</code> helper
        functions if the database contains highly sensitive information and statistics about it should not be collected.
        This will impact the accuracy of Index Advisor recommendations.
      </p>
    </>
  );
};

export const MonitoringUserColumnStats: React.FunctionComponent<{ username: string, adminUsername: string }> = ({
  username,
  adminUsername
}) => {
  const adminUserStr = !!adminUsername ? <strong>{adminUsername}</strong> : 'a superuser (or equivalent)'
  const CodeBlock = useCodeBlock();
  return (
    <>
      <p>
        Then, connect to each database that you plan to monitor on this server as {adminUserStr} and
        run the following to enable the collection of additional column statistics:
      </p>
      <CodeBlock>
        {`CREATE SCHEMA IF NOT EXISTS pganalyze;
GRANT USAGE ON SCHEMA pganalyze TO ${username};
DROP FUNCTION IF EXISTS pganalyze.get_column_stats;
CREATE FUNCTION pganalyze.get_column_stats() RETURNS TABLE(
  schemaname name, tablename name, attname name, inherited bool, null_frac real, avg_width int, n_distinct real, correlation real
) AS $$
  /* pganalyze-collector */
  SELECT schemaname, tablename, attname, inherited, null_frac, avg_width, n_distinct, correlation
  FROM pg_catalog.pg_stats
  WHERE schemaname NOT IN ('pg_catalog', 'information_schema') AND tablename <> 'pg_subscription';
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}
      </CodeBlock>
      <p>
        <strong>Note:</strong> We never collect actual table data through this method (see the <code>NULL</code> values in the function), but we do collect statistics about the distribution of values in your tables.
        You can skip creating the <code>get_column_stats</code> helper function if the database
        contains highly sensitive information and statistics about it should not be collected.
        This will impact the accuracy of Index Advisor recommendations.
      </p>
    </>
  );
};

export const MonitoringUserExtStats: React.FunctionComponent<{ username: string, adminUsername: string }> = ({
  username,
  adminUsername
}) => {
  const adminUserStr = !!adminUsername ? <strong>{adminUsername}</strong> : 'a superuser (or equivalent)'
  const CodeBlock = useCodeBlock();
  return (
    <>
      <p>
        Then, connect to each database that you plan to monitor on this server as {adminUserStr} and
        run the following to enable the collection of additional extended statistics:
      </p>
      <CodeBlock>
        {`CREATE SCHEMA IF NOT EXISTS pganalyze;
GRANT USAGE ON SCHEMA pganalyze TO ${username};
DROP FUNCTION IF EXISTS pganalyze.get_relation_stats_ext;
CREATE FUNCTION pganalyze.get_relation_stats_ext() RETURNS TABLE(
  statistics_schemaname text, statistics_name text,
  inherited boolean, n_distinct pg_ndistinct, dependencies pg_dependencies,
  most_common_val_nulls boolean[], most_common_freqs float8[], most_common_base_freqs float8[]
) AS
$$
  /* pganalyze-collector */ SELECT statistics_schemaname::text, statistics_name::text,
  (row_to_json(se.*)::jsonb ->> 'inherited')::boolean AS inherited, n_distinct, dependencies,
  most_common_val_nulls, most_common_freqs, most_common_base_freqs
  FROM pg_catalog.pg_stats_ext se
  WHERE schemaname NOT IN ('pg_catalog', 'information_schema') AND tablename <> 'pg_subscription';
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}
      </CodeBlock>
      <p>
        <strong>Note:</strong> We never collect actual table data through this method (we omit fetching fields like <code>most_common_vals</code> from the <code>pg_stats_ext</code> view, as you can see in the function definition), but we do collect statistics about the distribution of values in your tables.
        You can skip creating the <code>get_relation_stats_ext</code> helper function if the database
        contains highly sensitive information and statistics about it should not be collected.
        This will impact the accuracy of Index Advisor recommendations.
      </p>
    </>
  );
};

export const MonitoringUserExplain: React.FunctionComponent<{ username: string }> = ({username}) => {
  const CodeBlock = useCodeBlock();
  return (
    <>
      <CodeBlock>
        {`CREATE SCHEMA IF NOT EXISTS pganalyze;
GRANT USAGE ON SCHEMA pganalyze TO ${username};
CREATE OR REPLACE FUNCTION pganalyze.explain(query text, params text[]) RETURNS text AS
$$
DECLARE
  prepared_query text;
  prepared_params text;
  result text;
BEGIN
  SELECT regexp_replace(query, ';+\\s*\\Z', '') INTO prepared_query;
  IF prepared_query LIKE '%;%' THEN
    RAISE EXCEPTION 'cannot run EXPLAIN when query contains semicolon';
  END IF;

  IF array_length(params, 1) > 0 THEN
    SELECT string_agg(quote_literal(param) || '::unknown', ',') FROM unnest(params) p(param) INTO prepared_params;

    EXECUTE 'PREPARE pganalyze_explain AS ' || prepared_query;
    BEGIN
      EXECUTE 'EXPLAIN (VERBOSE, FORMAT JSON) EXECUTE pganalyze_explain(' || prepared_params || ')' INTO STRICT result;
    EXCEPTION WHEN OTHERS THEN
      DEALLOCATE pganalyze_explain;
      RAISE;
    END;
    DEALLOCATE pganalyze_explain;
  ELSE
    EXECUTE 'EXPLAIN (VERBOSE, FORMAT JSON) ' || prepared_query INTO STRICT result;
  END IF;

  RETURN result;
END
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;`}
      </CodeBlock>
      <p>
        Note that this function contains a check for semicolons in the query text. This is to minimize collector access to your
        data: it ensures that the collector cannot piggyback other queries that could exfiltrate data.
      </p>
      <p>
        Because EXPLAIN needs to run in the same database where the query ran, you will need to create this function <strong>in each
        database you want to monitor</strong>. You should create the function as a Postgres superuser to ensure EXPLAIN
        access to all queries.
      </p>
    </>
  );
};

export const MonitoringUserLogRead: React.FunctionComponent<{ username: string }> = ({username}) => {
  const CodeBlock = useCodeBlock();
  return (
    <>
      <CodeBlock>
        {`CREATE SCHEMA IF NOT EXISTS pganalyze;
GRANT USAGE ON SCHEMA pganalyze TO ${username};
CREATE OR REPLACE FUNCTION pganalyze.read_log_file(log_filename text, read_offset bigint, read_length bigint) RETURNS text AS
$$
DECLARE
  result text;
BEGIN
  IF log_filename !~ '\\A[\\w\\.-]+\\Z' THEN
    RAISE EXCEPTION 'invalid log filename';
  END IF;

  SELECT pg_catalog.pg_read_file(
    pg_catalog.current_setting('data_directory') || '/' || pg_catalog.current_setting('log_directory') || '/' || log_filename,
    read_offset,
    read_length
  ) INTO result;

  RETURN result;
END
$$ LANGUAGE plpgsql VOLATILE SECURITY DEFINER;`}
      </CodeBlock>
    </>
  );
}

const MonitoringUserBase: React.FunctionComponent<{
  password: string;
  noPgMonitor?: boolean;
}> = ({password, noPgMonitor}) => {
  const CodeBlock = useCodeBlock();
  return (
    <>
      <CodeBlock>
        {`CREATE USER pganalyze WITH PASSWORD '${password}' CONNECTION LIMIT 5;
${noPgMonitor ? '' : 'GRANT pg_monitor TO pganalyze;\n'}
CREATE SCHEMA pganalyze;
GRANT USAGE ON SCHEMA pganalyze TO pganalyze;
GRANT USAGE ON SCHEMA public TO pganalyze;
${noPgMonitor ? `
CREATE OR REPLACE FUNCTION pganalyze.get_stat_replication() RETURNS SETOF pg_stat_replication AS
$$
  /* pganalyze-collector */ SELECT * FROM pg_catalog.pg_stat_replication;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;` : ''}`}
      </CodeBlock>
      <p>
        If you enable the optional reset mode (usually not required), you will also need this helper method:
      </p>
      <CodeBlock>
      {`CREATE OR REPLACE FUNCTION pganalyze.reset_stat_statements() RETURNS SETOF void AS
$$
  /* pganalyze-collector */ SELECT * FROM public.pg_stat_statements_reset();
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}
      </CodeBlock>
    </>
  )
}

export const NoPgMonitorPgStatStatementsHelpers: React.FunctionComponent<{
  adminUsername: string;
  systemType: string;
}> = ({adminUsername, systemType}) => {
  const adminUserStr = <strong>{adminUsername}</strong>;
  const pgProvider = getProviderName(systemType);
  const CodeBlock = useCodeBlock();
  return (
    <>
      <p>
        Because {pgProvider} does not give access to the <code>pg_monitor</code> role
        that can read all queries from <code>pg_stat_statements</code>, you'll need to
        create a set of SECURITY DEFINER helper functions to collect full query stats.
      </p>
      <p>
        For each user whose queries you would like to monitor, you'll need to log in to your
        database and create a function like the following (replace <code>&lt;username&gt;</code> with
        the actual user name):
      </p>
      <CodeBlock>
        {`CREATE OR REPLACE FUNCTION pganalyze.get_stat_statements_<username>(showtext boolean = true)
RETURNS SETOF pg_stat_statements AS
$$
  SELECT * FROM public.pg_stat_statements(showtext) WHERE userid = '<username>'::regrole;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}
      </CodeBlock>
      <p>
        For example, if you have two users, <code>app</code> and <code>analytics</code>, you'll
        need to log in as <code>app</code> and run:
      </p>
      <CodeBlock>
        {`CREATE OR REPLACE FUNCTION pganalyze.get_stat_statements_app(showtext boolean = true)
RETURNS SETOF pg_stat_statements AS
$$
  SELECT * FROM public.pg_stat_statements(showtext) WHERE userid = 'app'::regrole;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}
      </CodeBlock>
      <p>
        Then, log in as <code>analytics</code> and run:
      </p>
      <CodeBlock>
        {`CREATE OR REPLACE FUNCTION pganalyze.get_stat_statements_analytics(showtext boolean = true)
RETURNS SETOF pg_stat_statements AS
$$
  SELECT * FROM public.pg_stat_statements(showtext) WHERE userid = 'analytics'::regrole;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}
      </CodeBlock>
      <p>
        Make sure to also log in as {adminUserStr} and create a function for that user:
      </p>
      <CodeBlock>
        {`CREATE OR REPLACE FUNCTION pganalyze.get_stat_statements_${adminUsername}(showtext boolean = true)
RETURNS SETOF pg_stat_statements AS
$$
  SELECT * FROM public.pg_stat_statements(showtext) WHERE userid = '${adminUsername}'::regrole;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}
      </CodeBlock>
      <p>
        Then, still logged in as {adminUserStr}, create a helper function to combine these. For example,
        for the case of the three users above, the final helper function will look like this:
      </p>
      <CodeBlock>
        {`CREATE OR REPLACE FUNCTION pganalyze.get_stat_statements(showtext boolean = true)
RETURNS SETOF pg_stat_statements AS
$$
  SELECT * FROM pganalyze.get_stat_statements_app(showtext)
    UNION ALL
  SELECT * FROM pganalyze.get_stat_statements_analytics(showtext)
    UNION ALL
  SELECT * FROM pganalyze.get_stat_statements_${adminUsername}(showtext)
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}
      </CodeBlock>
      <p>
        You will need to update these function definitions as new dataabse users are added and removed,
        but it will allow you to have access to all users' queries without the <code>pg_monitor</code> role.
      </p>
    </>
  )
}

function getProviderName(systemType: string): string {
  switch (systemType) {
    case 'self_managed':
      return 'your Postgres install';
    case 'amazon_rds':
      return 'Amazon RDS and Amazon Aurora';
    case 'heroku':
      return 'Heroku Postgres';
    case 'google_cloudsql':
      return 'Google Cloud SQL and AlloyDB';
    case 'azure_database':
      return 'Azure Database for PostgreSQL';
    case 'crunchy_bridge':
      return 'Crunchy Bridge';
    case 'aiven':
      return 'Aiven for PostgreSQL';
    default:
      return 'your Postgres provider';
  }
}

export default MonitoringUserSetupInstructions;
