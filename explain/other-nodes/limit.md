---
plan_node: Limit
short_description: Return only some of the rows produced by a child. Note that because a limit does not run a child node to completion, the Limit’s own cost may be lower than a child’s cost.
important_fields:
title: EXPLAIN - Limit
backlink_href: /docs/explain/other-nodes
backlink_title: 'Documentation: EXPLAIN - Other Nodes'
---

**Description:**

Return only some of the rows produced by a child. Note that because a limit does not run a child node to completion, the Limit’s own cost may be lower than a child’s cost.