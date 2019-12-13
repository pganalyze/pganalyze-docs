---
title: 'EXPLAIN - Overview'
backlink_href: /docs
backlink_title: 'Documentation'
---

The Postgres query execution mechanism is fairly intricate, but important to understand well in order to get the most out of your database. SQL queries are mostly declarative: you describe what data you would like to retrieve, and Postgres figures out a plan for how to get it for you, then executes that plan. The EXPLAIN mechanism allows you to inspect that plan, and possibly optimize the query.

The basics of query execution are actually fairly straightforward: a query plan is a tree of nodes. Each node has a certain type, and may have one or more child nodes (which child nodes depends on the node type). Different node types behave differently, but the overall mechanism is the same: a parent node pulls data from its children row by row. The children either produce data directly (e.g., by reading it from tables) or pull from their children. The query executor itself pulls rows from the root node and returns them as the query result. There are several different categories of nodes that perform essentially the same function but have different trade-offs (e.g., different types of scan nodes or join nodes).

Planning is determining the best arrangement of plan nodes for executing your query and depends on several factors. First—and obviously most important—are the semantics of your query: the plan needs to return exactly the rows your query requested (though if there are different results that fulfill those semantics, you may get different rows every time: that’s why you cannot depend on a `SELECT * FROM my_table LIMIT 1` without an ORDER BY). Second are the indexes available: indexes can allow Postgres to fetch data much more efficiently, and maintaining the right indexes for your schema and query workload requires understanding query execution. Third are the current configuration settings: both planner cost constants and resource consumption settings like work_mem (note that many of these can be set dynamically per database, per user, per session, or even per query). And finally are statistics Postgres has gathered about your data (either via running the ANALYZE command manually or as part of manual or automatic vacuum).

To come up with a plan, Postgres inspects your query and evaluates one or more alternatives given the above. It estimates a cost for each leaf node, and propagates those costs up the tree to calculate costs for internal nodes and eventually the root. It considers several plans and picks the cheapest based on cost settings, available indexes, and the heuristics based on collected database statistics.

* **[Insights](/docs/explain/insights)**
    * [Disk Sorts](/docs/explain/insights/disk-sorts)
    * [Expensive](/docs/explain/insights/expensive)
    * [Hash Batches](/docs/explain/insights/hash-batches)
    * [Inefficient Index](/docs/explain/insights/inefficient-index)
    * [Large Offset](/docs/explain/insights/large-offset)
    * [Lossy Bitmaps](/docs/explain/insights/lossy-bitmaps)
    * [Mis-Estimate](/docs/explain/insights/mis-estimate)
    * [Slow Scan](/docs/explain/insights/slow-scan)
    * [Stale Stats](/docs/explain/insights/stale-stats)
* **[Scan nodes](/docs/explain/scan-nodes)**
    * [Sequential Scan](/docs/explain/scan-nodes/sequential-scan)
    * [Index Scan](/docs/explain/scan-nodes/index-scan)
    * [Index-Only Scan](/docs/explain/scan-nodes/index-only-scan)
    * [Bitmap Heap Scan](/docs/explain/scan-nodes/bitmap-heap-scan)
    * [Bitmap Index Scan](/docs/explain/scan-nodes/bitmap-index-scan)
    * [CTE Scan](/docs/explain/scan-nodes/cte-scan)
    * [Custom Scan](/docs/explain/scan-nodes/custom-scan)
    * [Foreign Scan](/docs/explain/scan-nodes/foreign-scan)
    * [Function Scan](/docs/explain/scan-nodes/function-scan)
    * [Subquery Scan](/docs/explain/scan-nodes/subquery-scan)
    * [Table Sample Scan](/docs/explain/scan-nodes/table-sample-scan)
    * [Tid Scan](/docs/explain/scan-nodes/tid-scan)
    * [Values Scan](/docs/explain/scan-nodes/values-scan)
    * [Work Table Scan](/docs/explain/scan-nodes/work-table-scan)
* **[Join nodes](/docs/explain/join-nodes)**
    * [Hash Join](/docs/explain/join-nodes/hash-join)
    * [Merge Join](/docs/explain/join-nodes/hash-join)
    * [Nested Loop](/docs/explain/join-nodes/nested-loop)
* **[Other nodes](/docs/explain/other-nodes)**
    * [Aggregate](/docs/explain/other-nodes/aggregate)
    * [Append](/docs/explain/other-nodes/append)
    * [Bitmap And](/docs/explain/other-nodes/bitmap-and)
    * [Bitmap Or](/docs/explain/other-nodes/bitmap-or)
    * [Gather Merge](/docs/explain/other-nodes/gather-merge)
    * [Gather](/docs/explain/other-nodes/gather)
    * [Group](/docs/explain/other-nodes/group)
    * [Hash](/docs/explain/other-nodes/hash)
    * [Limit](/docs/explain/other-nodes/limit)
    * [Lock Rows](/docs/explain/other-nodes/lock-rows)
    * [Materialize](/docs/explain/other-nodes/materialize)
    * [Merge Append](/docs/explain/other-nodes/merge-append)
    * [Modify Table](/docs/explain/other-nodes/modify-table)
    * [Project Set](/docs/explain/other-nodes/project-set)
    * [Recursive Union](/docs/explain/other-nodes/recursive-union)
    * [Result](/docs/explain/other-nodes/result)
    * [SetOp](/docs/explain/other-nodes/set-op)
    * [Sort](/docs/explain/other-nodes/sort)
    * [Unique](/docs/explain/other-nodes/unique)
    * [Window Aggregate](/docs/explain/other-nodes/window-aggregate)