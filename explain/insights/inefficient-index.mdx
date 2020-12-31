---
explain_insight: 'inefficient index'
title: 'EXPLAIN - Insights: Inefficient Index'
backlink_href: /docs/explain/insights
backlink_title: 'Documentation: EXPLAIN - Insights'
---

**Description:**

This is similar to the Slow Scan warning, but for index scans (regular index scans, index-only scans, and bitmap index scans). Just because a query uses an index does not mean that the index optimally supports the query, and another index may be more suitable. If a plan shows a large Rows Removed by Filter on an Index Scan, it may be more efficient to create an index that more closely matches the query conditions.

For example, if you have a table users(id, age, score) and an index on score, a query like `SELECT * FROM users WHERE score > 100` is ideally suited to this: it can scan the index from score 100 until the end and return all matching users. However, for a query like `SELECT * FROM users WHERE score > 100 AND age > 100`, scanning the same index may still be preferable to a sequential scan, but it may still discard a lot of rows where the age condition does not match. A more optimal index for this specific query would be a multi-column index on (score, age).

Whether to actually add this second index will depend on how inefficient this scan is, your query workload (is this a frequent query?), memory available (remember that additional indexes take up additional memory), and your write workload (remember that indexes must be updated on write).

**Recommended Action:**

Create an index (possibly a partial index, an expression index, or using a specific index type) so a more efficient scan can be used instead.