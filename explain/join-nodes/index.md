---
title: EXPLAIN - Join Nodes
backlink_href: /docs/explain
backlink_title: 'Documentation: EXPLAIN - Overview'
---

This section describes the three types of join mechanisms in Postgres.

Joins are performed on two tables at a time; if more tables are joined together, the output of one join is treated as input to a subsequent join. When joining a large number of tables, the genetic query optimizer settings may affect what combinations of joins are considered.

* [Hash Join](/docs/explain/join-nodes/hash-join)
* [Merge Join](/docs/explain/join-nodes/hash-join)
* [Nested Loop Join](/docs/explain/join-nodes/nested-loop)