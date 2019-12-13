---
plan_node: Result
short_description: If no outer plan, evaluate a variable-free targetlist. If outer plan, return tuples from outer plan (after a level of projection as shown by targetlist). If resconstantqual isn't NULL, it represents a one-time qualification test (i.e., one that doesn't depend on any variables from the outer plan, so needs to be evaluated only once).
important_fields:
title: EXPLAIN - Result
backlink_href: /docs/explain/other-nodes
backlink_title: 'Documentation: EXPLAIN - Other Nodes'
---

**Description:**

If no outer plan, evaluate a variable-free targetlist. If outer plan, return tuples from outer plan (after a level of projection as shown by targetlist). If resconstantqual isn't NULL, it represents a one-time qualification test (i.e., one that doesn't depend on any variables from the outer plan, so needs to be evaluated only once).