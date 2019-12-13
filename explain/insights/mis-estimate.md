---
explain_insight: mis-estimate
title: 'EXPLAIN - Insights: Mis-Estimate'
backlink_href: /docs/explain/insights
backlink_title: 'Documentation: EXPLAIN - Insights'
---

**Description:**

Postgres relies on a number of estimates about how different query plans will execute in order to choose the optimal plan. One of the most important is the number of rows produced by each node. For scan nodes, this is usually driven by the underlying table statistics, so estimates may be off if [statistics are stale](/docs/explain/insights/stale-stats). For other nodes, estimates are usually based on the type of node and the estimates of children (one notable example is LIMIT, which obviously may return fewer rows than its child).

Note that the mis-estimate analysis does *not* consider execution time, because there’s no well-defined way to compare cost estimates (which are in arbitrary cost units) to actual execution time. Furthermore, execution time may not even be available (e.g., if you run EXPLAIN (ANALYZE, TIMING OFF) to avoid the potentially-expensive timing instrumentation).

**Recommended Action:**

If the node is also flagged as having stale statistics, resolve that problem first and that may fix the mis-estimate. If one or more descendent nodes have stale statistics, the same advice applies: a mis-estimate can spread upwards through a plan, since child estimates usually affect parent estimates. If statistics are up to date, standard statistics may not be sufficient to capture enough metadata about your schema to guide effective query planning. In that case, you can try changing statistics targets (either database-wide via [default_statistics_target](https://www.postgresql.org/docs/current/runtime-config-query.html#GUC-DEFAULT-STATISTICS-TARGET) or per-column via ALTER TABLE … SET STATISTICS) or configure [extended statistics](https://www.postgresql.org/docs/current/planner-stats.html#PLANNER-STATS-EXTENDED).