---
plan_node: Seq Scan
short_description: "This is the simplest way of fetching data from a table: it scans through every page of data sequentially. Like most other scans, this can apply a filter while reading data, but it needs to read the data first and then discard it. A sequential scan has no way to zero in on just the data you want: it always reads everything in the table. This is generally inefficient unless you need a large proportion of the table to answer your query, but is always available and sometimes may be the only option."
important_fields: Filter, Rows Removed by Filter
title: EXPLAIN - Sequential Scan
backlink_href: /docs/explain/scan-nodes
backlink_title: 'Documentation: EXPLAIN - Scan Nodes'
---

**Description:**

This is the simplest way of fetching data from a table: it scans through every page of data sequentially. Like most other scans, this can apply a filter while reading data, but it needs to read the data first and then discard it. A sequential scan has no way to zero in on just the data you want: it always reads everything in the table. This is generally inefficient unless you need a large proportion of the table to answer your query, but is always available and sometimes may be the only option.

**Important Fields:**

- Filter
- Rows Removed by Filter