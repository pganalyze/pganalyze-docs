---
plan_node: Index Only Scan
short_description: "This is very similar to an Index Scan, but the data comes directly from the index and the visibility check is handled specially, so it can avoid looking at the table data entirely. An index-only scan is faster, but it’s not always available as an alternative to a regular index scan. It has two restrictions: the index type must support Index-Only Scans (the common btree index type always does) and (somewhat obviously) the query must only project columns included in the index. If you have a SELECT * query but don’t actually need all columns, you may be able to use an index-only scan just by changing the column list."
important_fields: Filter, Rows Removed by Filter
title: EXPLAIN - Index Only Scan
backlink_href: /docs/explain/scan-nodes
backlink_title: 'Documentation: EXPLAIN - Scan Nodes'
---

**Description:**

This is very similar to an Index Scan, but the data comes directly from the index and the visibility check is handled specially, so it can avoid looking at the table data entirely. An index-only scan is faster, but it’s not always available as an alternative to a regular index scan. It has two restrictions: the index type must support Index-Only Scans (the common btree index type always does) and (somewhat obviously) the query must only project columns included in the index. If you have a SELECT * query but don’t actually need all columns, you may be able to use an index-only scan just by changing the column list.

**Important Fields:**

- Filter
- Rows Removed by Filter