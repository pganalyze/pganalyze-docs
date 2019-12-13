---
explain_insight: 'slow scan'
title: 'EXPLAIN - Insights: Slow Scan'
backlink_href: /docs/explain/insights
backlink_title: 'Documentation: EXPLAIN - Insights'
---

**Description:**

A sequential scan is a simple way to fetch data from a table, but unless you need a large fraction of the table data, it’s rarely the most efficient. When a sequential scan in an EXPLAIN plan shows a large Rows Removed by Filter, this suggests it may be more efficient to fetch this data using an index.

**Recommended Action:**

Create an index (possibly a [partial index](https://www.postgresql.org/docs/current/indexes-partial.html), an [expression index](https://www.postgresql.org/docs/current/indexes-expressional.html), or using a specific [index type](https://www.postgresql.org/docs/current/indexes-types.html)) so a more efficient scan can be used instead. If indexes exist but are not being used, they may not be suitable for this query.