---
title: EXPLAIN - Insights
backlink_href: /docs/explain
backlink_title: 'Documentation: EXPLAIN - Overview'
---

* **[Disk Sort](/docs/explain/insights/disk-sort)**<br />When a Sort operation spills to disk due to low work_mem settings
* **[Expensive Nodes](/docs/explain/insights/expensive)**<br />When particular nodes are more expensive than others in a plan
* **[Hash Batches](/docs/explain/insights/hash-batches)**<br />When a Hash operation spilles to disk due to low work_mem settings
* **[Inefficient Index](/docs/explain/insights/inefficient-index)**<br />When an index is inefficient because it's loading too much data and then filters rows without an index
* **[I/O Heavy Nodes](/docs/explain/insights/io-heavy)**<br />When most plan I/O happens in just a few plan nodes
* **[Large Offset](/docs/explain/insights/large-offset)**<br />When OFFSET is used for pagination, instead of an efficient method such as keyset-based pagination
* **[Lossy Bitmaps](/docs/explain/insights/lossy-bitmaps)**<br />Bitmap Heap Scan that utilizes a lossy bitmap due to low work_mem 
* **[Mis-Estimate](/docs/explain/insights/mis-estimate)**<br />The Postgres planner mis-estimated the number of rows a particular plan node returns
* **[Slow Scan](/docs/explain/insights/slow-scan)**<br />Sequential Scan that removed a significant number of rows (an index would have helped to avoid this)
* **[Stale Stats](/docs/explain/insights/stale-stats)**<br />The table referenced has not had an `ANALYZE` run recently (potentially leading to inefficient plans)