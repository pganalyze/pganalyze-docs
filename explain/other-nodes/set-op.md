---
plan_node: SetOp
short_description: "Combines two datasets for set operations like UNION, INTERSECT, and EXCEPT. Note that the query structure for SetOps is different than you may expect: rather than being the direct parent of the sets on which it operates, a SetOp node only has a single Append child, which has a Subquery Scan for each node to combine."
important_fields: Strategy, Command
title: EXPLAIN - SetOp
backlink_href: /docs/explain/other-nodes
backlink_title: 'Documentation: EXPLAIN - Other Nodes'
---

**Description:**

Combines two datasets for set operations like UNION, INTERSECT, and EXCEPT. Note that the query structure for SetOps is different than you may expect: rather than being the direct parent of the sets on which it operates, a SetOp node only has a single Append child, which has a Subquery Scan for each node to combine.

**Important Fields:**

- Strategy
- Command
