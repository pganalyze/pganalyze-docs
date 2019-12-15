---
plan_node: Unique
short_description: Processes sorted input and eliminates adjacent duplicates.
important_fields:
title: EXPLAIN - Unique
backlink_href: /docs/explain/other-nodes
backlink_title: 'Documentation: EXPLAIN - Other Nodes'
---

**Description:**

Like the UNIX command uniq, takes sorted input and eliminates adjacent duplicates. Useful for DISTINCT clauses if the input is already sorted (e.g., the query also includes an ORDER BY).