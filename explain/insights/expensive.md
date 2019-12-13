---
explain_insight: expensive
title: 'EXPLAIN - Insights: Expensive'
backlink_href: /docs/explain/insights
backlink_title: 'Documentation: EXPLAIN - Insights'
---

**Description:**

Postgres will often spend most of its time on a query in a small set of plan nodes. A slow plan  This insight identifies the most expensive nodes to guide optimization. Even if other insights point to different nodes, you should probably focus on the most expensive ones first: there is little to be gained by optimizing an inefficiency unless it is also a bottleneck.

**Recommended Action:**

A node flagged as expensive should have other insights as well: prioritize addressing those over other issues in nodes that are not flagged as expensive.