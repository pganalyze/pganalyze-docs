---
plan_node: Hash Join
short_description: Scans through the outer table, looking for matches in a hash table built from the inner table data and keyed by join key.
important_fields: Filter, Hash Cond, Inner Unique, Join Filter, Join Type, Rows Removed by Filter, Rows Removed by Join Filter
title: EXPLAIN - Hash Join
backlink_href: /docs/explain/join-nodes
backlink_title: 'Documentation: EXPLAIN - Join Nodes'
---

**Description:**

Build a hash table from the inner table, keyed by the join key. Then scan the outer table, checking if a corresponding value is present. If the hash table would exceed work\_mem, this process needs to happen in several batches writing temporary files to disk, which becomes dramatically slower.

**Important Fields:**

- Filter
- Hash Cond
- Inner Unique
- Join Filter
- Join Type
- Rows Removed by Filter
- Rows Removed by Join Filter