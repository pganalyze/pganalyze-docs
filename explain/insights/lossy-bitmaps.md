---
explain_insight: 'lossy bitmaps'
title: 'EXPLAIN - Insights: Lossy Bitmaps'
backlink_href: /docs/explain/insights
backlink_title: 'Documentation: EXPLAIN - Insights'
---

**Description:**

A bitmap heap scan can use bitmap blocks that either directly point to the rows needed (Exact Heap Blocks), or, roughly speaking, point in the general direction of the rows (Lossy Heap Blocks). The exact mechanism is more efficient overall, but requires more memory. When work_mem limits do not permit using exact bitmaps, Postgres may switch to the less efficient lossy ones instead. Lossy bitmaps require a recheck step for each row. If possible, though, increasing work_mem until the scan uses mostly Exact Heap Blocks should improve performance.

**Recommended Action:**

Increase work_mem for this query.