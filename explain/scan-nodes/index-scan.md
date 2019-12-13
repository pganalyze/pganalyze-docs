---
plan_node: Index Scan
short_description: "An index scan uses an index to find either a specific row, or all rows matching a predicate. An index scan will either look up a single row at a time (for a query like WHERE id = 1234, or as the inner table in a nested loop, looking up the row matching the current outer row), or scan through a section of the table in order. An index scan must first look up each row in the index, and then check the actual table data for that index entry. The table data must be checked to ensure that the row it found is actually visible to the current transaction, and also to fetch any columns included in the query that are not present in the index. Because of this, an index scan actually has higher per-row overhead than a sequential scan: its real advantage is that it allows you to read only some of the rows in a table. If your query predicate is not very selective (that is, if few rows are filtered out), a sequential scan may still be more efficient than an index scan.

If your query predicate matches the index exactly, the scan will retrieve just the matching rows. If you have an additional predicate in your query, the index scan can filter rows as it’s reading them, just like a sequential scan."
important_fields: Filter, Rows Removed by Filter
title: EXPLAIN - Index Scan
backlink_href: /docs/explain/scan-nodes
backlink_title: 'Documentation: EXPLAIN - Scan Nodes'
---

**Description:**

An index scan uses an index to find either a specific row, or all rows matching a predicate. An index scan will either look up a single row at a time (for a query like WHERE id = 1234, or as the inner table in a nested loop, looking up the row matching the current outer row), or scan through a section of the table in order. An index scan must first look up each row in the index, and then check the actual table data for that index entry. The table data must be checked to ensure that the row it found is actually visible to the current transaction, and also to fetch any columns included in the query that are not present in the index. Because of this, an index scan actually has higher per-row overhead than a sequential scan: its real advantage is that it allows you to read only some of the rows in a table. If your query predicate is not very selective (that is, if few rows are filtered out), a sequential scan may still be more efficient than an index scan.

If your query predicate matches the index exactly, the scan will retrieve just the matching rows. If you have an additional predicate in your query, the index scan can filter rows as it’s reading them, just like a sequential scan.

**Important Fields:**

- Filter
- Rows Removed by Filter