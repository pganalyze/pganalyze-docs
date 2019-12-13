---
plan_node: Subquery Scan
short_description: SubqueryScan is for scanning the output of a sub-query in the range table. We often need an extra plan node above the sub-query's plan to perform expression evaluations (which we can't push into the sub-query without risking changing its semantics).
important_fields:
title: EXPLAIN - Subquery Scan
backlink_href: /docs/explain/scan-nodes
backlink_title: 'Documentation: EXPLAIN - Scan Nodes'
---

**Description**:

SubqueryScan is for scanning the output of a sub-query in the range table. We often need an extra plan node above the sub-query's plan to perform expression evaluations (which we can't push into the sub-query without risking changing its semantics).