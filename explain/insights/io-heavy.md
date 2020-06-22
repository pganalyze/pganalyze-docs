---
explain_insight: 'i/o-heavy'
title: 'EXPLAIN - Insights: I/O Heavy'
backlink_href: /docs/explain/insights
backlink_title: 'Documentation: EXPLAIN - Insights'
---

**Description:**

Postgres will often spend most of its I/O time on a query in a small set of plan nodes. This insight identifies the most expensive nodes (according to time spent doing I/O) to guide optimization. Since I/O is usually the bottleneck in many database queries, focusing on nodes performing
the bulk of plan I/O is a good rule of thumb.

This insight requires `track_io_timing` to be enabled on the database.

**Recommended Action:**

If possible, reduce the amount of I/O performed in this node. There are many possible causes of excessive I/O, but several are identified by  other insights, like [Inefficient Index](/docs/explain/insights/inefficient-index) or [Large Offset](/docs/explain/insights/large-offset).
