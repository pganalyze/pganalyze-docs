---
plan_node: Table Sample Scan
short_description: Scan a table when the TABLESAMPLE feature is used. Note that this clause does change the semantics of your query, but if you’re looking to gather some statistics about data in a large table, it can be a lot more efficient than a full sequential scan.
important_fields:
title: EXPLAIN - Table Sample Scan
backlink_href: /docs/explain/scan-nodes
backlink_title: 'Documentation: EXPLAIN - Scan Nodes'
---

**Description:**

Scan a table when the [TABLESAMPLE](https://www.2ndquadrant.com/en/blog/tablesample-in-postgresql-9-5-2/) feature is used. Note that this clause does change the semantics of your query, but if you’re looking to gather some statistics about data in a large table, it can be a lot more efficient than a full sequential scan.