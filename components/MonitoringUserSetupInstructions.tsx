import React from "react";

import { useCodeBlock } from "./CodeBlock";
import TabPanel, { TabItem } from './TabPanel'

type Props = {
  minPostgres: number;
  password: string;
};

const MonitoringUserSetupInstructions: React.FunctionComponent<Props> = ({
  minPostgres = 90200,
  password = 'mypassword'
}) => {
  type SetupOpt = [ id: string, version: number, label: string, instructions: React.ComponentType<{password: string}> ];
  const opts: SetupOpt[] = [
    [ 'monitoring_user_10', 100000, 'PostgreSQL 10+', MonitoringUser10 ],
    [ 'monitoring_user_96', 90600, 'PostgreSQL 9.6', MonitoringUser96 ],
    [ 'monitoring_user_94', 90500, 'PostgreSQL 9.4 and 9.5', MonitoringUser94 ],
  ].filter(([_id, version, _label ]) => minPostgres <= version) as SetupOpt[];

  const tabs = opts.map<TabItem>(opt => [opt[0], opt[2]])
  return (
    <>
      <TabPanel items={tabs}>
        {(idx: number) => {
          const ActiveTab = opts[idx][3];
          return <ActiveTab password={password} />
        }}
      </TabPanel>
      <MonitoringUserColumnStats username="pganalyze" />
    </>
  );
};

export const MonitoringUserColumnStats: React.FunctionComponent<{ username: string }> = ({username}) => {
  const CodeBlock = useCodeBlock();
  return (
    <>
      <p>
        Then, connect to each database that you plan to monitor on this server as a superuser (or equivalent) and
        run the following to enable the collection of additional column statistics:
      </p>
      <CodeBlock>
        {`CREATE SCHEMA IF NOT EXISTS pganalyze;
GRANT USAGE ON SCHEMA pganalyze TO ${username};
CREATE OR REPLACE FUNCTION pganalyze.get_column_stats() RETURNS SETOF pg_stats AS
$$
  /* pganalyze-collector */ SELECT schemaname, tablename, attname, inherited, null_frac, avg_width,
    n_distinct, NULL::anyarray, most_common_freqs, NULL::anyarray, correlation, NULL::anyarray,
    most_common_elem_freqs, elem_count_histogram
  FROM pg_catalog.pg_stats;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}
      </CodeBlock>
      <p>
        <strong>Note:</strong> We never collect actual table data through this method (see the <code>NULL</code> values in the function), but we do collect statistics about the distribution of values in your tables. You can skip creating the <code>get_column_stats</code> helper function if the database
        contains highly sensitive information.
      </p>
    </>
  );
};

const MonitoringUser10: React.FunctionComponent<{password: string}> = ({password}) => {
  const CodeBlock = useCodeBlock();
  return (
    <CodeBlock>
      {`CREATE USER pganalyze WITH PASSWORD '${password}' CONNECTION LIMIT 5;
GRANT pg_monitor TO pganalyze;

CREATE SCHEMA pganalyze;
GRANT USAGE ON SCHEMA pganalyze TO pganalyze;
GRANT USAGE ON SCHEMA public TO pganalyze;

CREATE OR REPLACE FUNCTION pganalyze.get_stat_replication() RETURNS SETOF pg_stat_replication AS
$$
  /* pganalyze-collector */ SELECT * FROM pg_catalog.pg_stat_replication;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}
    </CodeBlock>
  )
}

const MonitoringUser96: React.FunctionComponent<{password: string}> = ({password}) => {
  const CodeBlock = useCodeBlock();
  return (
    <>
      <CodeBlock>
        {`CREATE USER pganalyze WITH PASSWORD '${password}' CONNECTION LIMIT 5;

CREATE SCHEMA pganalyze;
GRANT USAGE ON SCHEMA pganalyze TO pganalyze;
GRANT USAGE ON SCHEMA public TO pganalyze;

CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

CREATE OR REPLACE FUNCTION pganalyze.get_stat_statements(showtext boolean = true) RETURNS SETOF pg_stat_statements AS
$$
  /* pganalyze-collector */ SELECT * FROM public.pg_stat_statements(showtext);
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION pganalyze.get_stat_activity() RETURNS SETOF pg_stat_activity AS
$$
  /* pganalyze-collector */ SELECT * FROM pg_catalog.pg_stat_activity;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION pganalyze.get_column_stats() RETURNS SETOF pg_stats AS
$$
  /* pganalyze-collector */ SELECT schemaname, tablename, attname, inherited, null_frac, avg_width,
  n_distinct, NULL::anyarray, most_common_freqs, NULL::anyarray, correlation, NULL::anyarray,
  most_common_elem_freqs, elem_count_histogram
  FROM pg_catalog.pg_stats;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION pganalyze.get_stat_replication() RETURNS SETOF pg_stat_replication AS
$$
  /* pganalyze-collector */ SELECT * FROM pg_catalog.pg_stat_replication;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION pganalyze.get_stat_progress_vacuum() RETURNS SETOF pg_stat_progress_vacuum AS
$$
  /* pganalyze-collector */ SELECT * FROM pg_catalog.pg_stat_progress_vacuum;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}</CodeBlock>
      <p>
        If you enabled the optional reset mode (usually not required), you will also need this helper method:
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

const MonitoringUser94: React.FunctionComponent<{password: string}> = ({password}) => {
  const CodeBlock = useCodeBlock();
  return (
    <>
      <CodeBlock>
        {`CREATE USER pganalyze WITH PASSWORD '${password}' CONNECTION LIMIT 5;

CREATE SCHEMA pganalyze;
GRANT USAGE ON SCHEMA pganalyze TO pganalyze;
GRANT USAGE ON SCHEMA public TO pganalyze;

CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

CREATE OR REPLACE FUNCTION pganalyze.get_stat_statements(showtext boolean = true) RETURNS SETOF pg_stat_statements AS
$$
  /* pganalyze-collector */ SELECT * FROM public.pg_stat_statements(showtext);
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION pganalyze.get_stat_activity() RETURNS SETOF pg_stat_activity AS
$$
  /* pganalyze-collector */ SELECT * FROM pg_catalog.pg_stat_activity;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION pganalyze.get_column_stats() RETURNS SETOF pg_stats AS
$$
  /* pganalyze-collector */ SELECT schemaname, tablename, attname, inherited, null_frac, avg_width,
  n_distinct, NULL::anyarray, most_common_freqs, NULL::anyarray, correlation, NULL::anyarray,
  most_common_elem_freqs, elem_count_histogram
  FROM pg_catalog.pg_stats;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION pganalyze.get_stat_replication() RETURNS SETOF pg_stat_replication AS
$$
  /* pganalyze-collector */ SELECT * FROM pg_catalog.pg_stat_replication;
$$ LANGUAGE sql VOLATILE SECURITY DEFINER;`}</CodeBlock>
      <p>
        If you enabled the optional reset mode (usually not required), you will also need this helper method:
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


export default MonitoringUserSetupInstructions;
