---
plan_node: Hash Join
short_description: Build a hash table from the inner table, keyed by the join key. Then scan the outer table, checking if a corresponding value is  present. If the hash table would exceed work_mem, this process needs to happen in several batches writing temporary files to disk, which becomes dramatically slower.
important_fields:
title: EXPLAIN - Hash Join
backlink_href: /docs/explain/join-nodes
backlink_title: 'Documentation: EXPLAIN - Join Nodes'
---

**Description:** Build a hash table from the inner table, keyed by the join key. Then scan the outer table, checking if a corresponding value is  present. If the hash table would exceed work_mem, this process needs to happen in several batches writing temporary files to disk, which becomes dramatically slower.