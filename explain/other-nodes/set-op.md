---
plan_node: SetOp
short_description: Combines data from children for set operations like UNION, INTERSECT, and EXCEPT.
important_fields: Command, Strategy
title: EXPLAIN - SetOp
backlink_href: /docs/explain/other-nodes
backlink_title: 'Documentation: EXPLAIN - Other Nodes'
---

**Description:**

Combines two datasets for [set operations](https://www.postgresql.org/docs/current/queries-union.html) like UNION, INTERSECT, and EXCEPT. Note that the query structure for SetOps is different than you may expect: rather than being the direct parent of the sets on which it operates, a SetOp node only has a single Append child, which has a Subquery Scan for each node to combine.

**Important Fields:**

- Command
- Strategy