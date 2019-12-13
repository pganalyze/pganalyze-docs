---
plan_node: Bitmap Index Scan
short_description: "You can think of a bitmap index scan as a middle ground between a sequential scan and an index scan. Like an index scan, it scans an index to determine exactly what data it needs to fetch, but like a sequential scan, it takes advantage of data being easier to read in bulk.

The bitmap index scan actually operates in tandem with a Bitmap Heap Scan: it does not fetch the data itself. Instead of producing the rows directly, the bitmap index scan constructs a bitmap of potential row locations. It feeds this data to a parent Bitmap Heap Scan, which can decode the bitmap to fetch the underlying data, grabbing data page by page.

A Bitmap Heap Scan is the most common parent node of a Bitmap Index Scan, but a plan may also combine several different Bitmap Index Scans with BitmapAnd or BitmapOr nodes before actually fetching the underlying data. This allows Postgres to use two different indexes at once to execute a query."
important_fields: Filter, Rows Removed by Filter
title: EXPLAIN - Bitmap Index Scan
backlink_href: /docs/explain/scan-nodes
backlink_title: 'Documentation: EXPLAIN - Scan Nodes'
---

**Description:**

You can think of a bitmap index scan as a middle ground between a sequential scan and an index scan. Like an index scan, it scans an index to determine exactly what data it needs to fetch, but like a sequential scan, it takes advantage of data being easier to read in bulk.

The bitmap index scan actually operates in tandem with a Bitmap Heap Scan: it does not fetch the data itself. Instead of producing the rows directly, the bitmap index scan constructs a bitmap of potential row locations. It feeds this data to a parent Bitmap Heap Scan, which can decode the bitmap to fetch the underlying data, grabbing data page by page.

A Bitmap Heap Scan is the most common parent node of a Bitmap Index Scan, but a plan may also combine several different Bitmap Index Scans with BitmapAnd or BitmapOr nodes before actually fetching the underlying data. This allows Postgres to use two different indexes at once to execute a query.

**Important Fields:**

- Filter
- Rows Removed by Filter