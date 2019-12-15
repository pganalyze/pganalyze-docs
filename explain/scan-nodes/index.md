---
title: EXPLAIN - Scan Nodes
backlink_href: /docs/explain
backlink_title: 'Documentation: EXPLAIN - Overview'
---

This section lists the different scan nodes in Postgres. Note that some nodes are general and several alternatives may be available in a particular query, with the actual node determined by the planning algorithm outlined above (e.g., an Index Scan and a Sequential Scan), and some are only suitable to specific situations and have no alternatives (e.g., a Foreign Scan).

For scan nodes that access table data, it’s useful to understand roughly how data is organized on disk: each table consists of one or more pages, and each page contains a small header and then chunks of data corresponding to the table rows. Because of the [multi-version concurrency control](https://www.postgresql.org/docs/current/mvcc-intro.html) mechanism in Postgres, a page may actually contain multiple versions of each row, with only one version “visible” to each transaction. Which rows are visible where is stored along with the table data.

Indexes are separate structures that point to a specific page and then a value within that page. Different types of indexes support different index scan features: hash indexes can only look up specific values, but other index types like btree maintain values in a specific order, and support scanning the data in that order (or even backwards!). This gives index scans some interesting properties: for inequality predicates (e.g., `WHERE value > 10` or `WHERE value < 100`), they can start or end the scan at the right spot, ignoring any non-matching values. They can also be used to satisfy aggregates like max and min by looking at the beginning or end of the index (and ignoring any NULL values), and can produce data in index order (sometimes useful for `ORDER BY` or Merge nodes).

* [Sequential Scan](/docs/explain/scan-nodes/sequential-scan)
* [Index Scan](/docs/explain/scan-nodes/index-scan)
* [Index-Only Scan](/docs/explain/scan-nodes/index-only-scan)
* [Bitmap Heap Scan](/docs/explain/scan-nodes/bitmap-heap-scan)
* [Bitmap Index Scan](/docs/explain/scan-nodes/bitmap-index-scan)
* [CTE Scan](/docs/explain/scan-nodes/cte-scan)
* [Custom Scan](/docs/explain/scan-nodes/custom-scan)
* [Foreign Scan](/docs/explain/scan-nodes/foreign-scan)
* [Function Scan](/docs/explain/scan-nodes/function-scan)
* [Subquery Scan](/docs/explain/scan-nodes/subquery-scan)
* [Table Sample Scan](/docs/explain/scan-nodes/table-sample-scan)
* [Tid Scan](/docs/explain/scan-nodes/tid-scan)
* [Values Scan](/docs/explain/scan-nodes/values-scan)
* [Work Table Scan](/docs/explain/scan-nodes/work-table-scan)