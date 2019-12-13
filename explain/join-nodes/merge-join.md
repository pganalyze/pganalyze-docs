---
plan_node: Merge Join
short_description: Join two children already sorted by their shared join key. This only needs to scan each relation once, but both inputs need to be sorted by the join key first (or scanned in a way that produces already-sorted output, like an index scan matching the required sort order).
important_fields:
title: EXPLAIN - Merge Join
backlink_href: /docs/explain/join-nodes
backlink_title: 'Documentation: EXPLAIN - Join Nodes'
---

**Description:** Join two children already sorted by their shared join key. This only needs to scan each relation once, but both inputs need to be sorted by the join key first (or scanned in a way that produces already-sorted output, like an index scan matching the required sort order).