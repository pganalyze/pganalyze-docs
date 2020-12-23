---
title: 'Step 2: Create Monitoring User'
backlink_href: /docs/install/amazon_rds
backlink_title: 'Installation Guide (Amazon RDS)'
---

We recommend creating a separate monitoring user on your PostgreSQL database for pganalyze.

Run the following whilst connected as an RDS superuser, replacing `mypassword` with one of your choosing:

```
CREATE SCHEMA pganalyze;

CREATE EXTENSION IF NOT EXISTS pg_stat_statements WITH SCHEMA public;

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

CREATE USER pganalyze WITH PASSWORD 'mypassword' CONNECTION LIMIT 5;
REVOKE ALL ON SCHEMA public FROM pganalyze;
GRANT USAGE ON SCHEMA pganalyze TO pganalyze;
```

Note that it is important you run these as RDS superuser in order to pass down the full access to statistics tables.

Write down the username and password of the monitoring user, we will use it in the last step of this tutorial.

---

Next we continue by setting up the IAM policy:

[Proceed to Step 3: Setup IAM Policy](/docs/install/amazon_rds/03_setup_iam_policy)
