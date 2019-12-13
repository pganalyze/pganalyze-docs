---
explain_insight: 'disk sort'
title: 'EXPLAIN - Insights: Disk Sorts'
backlink_href: /docs/explain/insights
backlink_title: 'Documentation: EXPLAIN - Insights'
---

**Description:**

A Sort node consumes all rows from its child node and produces sorted output. To stay within bounds of work_mem, it may need to “spill” the sort operation to disk. This ensures it can continue, but, writing to disk during query execution can slow things down dramatically.

**Recommended Action:**

Increase work_mem until the sort can be performed in memory.