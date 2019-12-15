---
plan_node: CTE Scan
short_description: Scans the result of a common table expression (WITH clause).
important_fields: CTE Name, Filter, Rows Removed by Filter
title: EXPLAIN - CTE Scan
backlink_href: /docs/explain/scan-nodes
backlink_title: 'Documentation: EXPLAIN - Scan Nodes'
---

**Description:**

Scan the result of a [common table expression](https://www.postgresql.org/docs/current/queries-with.html). Note that until Postgres 12, common table expressions are an optimization fence; the CTE result is materialized, and is essentially treated as a temporary table and not optimized as part of the query. If you depend on this behavior, be aware performance of your queries may change when you upgrade.

**Important Fields:**

- CTE Name
- Filter
- Rows Removed by Filter