---
explain_insight: 'hash batches'
title: 'EXPLAIN - Insights: Hash Batches'
backlink_href: /docs/explain/insights
backlink_title: 'Documentation: EXPLAIN - Insights'
---

**Description:**

When a Hash node builds a hash table, it may need to store a lot of table data in memory. If this runs up against work_mem limits, the algorithm can “spill” to disk and process data in batches. This ensures it can continue, but, as always, writing to disk during query execution can slow things down dramatically.

**Recommended Action:**

Increase work_mem until the hashing can be performed in a single batch.