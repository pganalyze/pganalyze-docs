---
plan_node: Nested Loop
short_description: Loops through rows in the outer table, and for each, loops through rows in the inner table looking for matches.
important_fields: Filter, Inner Unique, Join Filter, Join Type, Rows Removed by Filter, Rows Removed by Join Filter
title: EXPLAIN - Nested Loop Join
backlink_href: /docs/explain/join-nodes
backlink_title: 'Documentation: EXPLAIN - Join Nodes'
---

**Description:**

For each row in the outer table, iterate through all the rows in the inner table and see if they match the join condition. If the inner relation can be scanned with an index, that can improve the performance of a Nested Loop Join. This is generally an inefficient way to process joins but is always available and sometimes may be the only option.

**Important Fields:**

- Filter
- Inner Unique
- Join Filter
- Join Type
- Rows Removed by Filter
- Rows Removed by Join Filter