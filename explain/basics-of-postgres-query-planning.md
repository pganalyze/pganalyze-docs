---
title: 'The Basics of Postgres Query Planning'
backlink_href: /docs/explain
backlink_title: 'Documentation: EXPLAIN - Overview'
---

The PostgreSQL query execution mechanism is fairly intricate, but important to understand well in order to get the most out of your database. SQL queries are mostly declarative: you describe what data you would like to retrieve, Postgres figures out a plan for how to get it for you, then executes that plan. This planning process is similar to how you might plan a trip: what sights do you want to see? When are they open? What flights, trains and rental cars are available and how much do they cost? Query planning is the same thing, but for your data.

Query execution is actually fairly straightforward. Let’s look in detail at nodes, query executors, planning, and more.

## Plan structure

First, a query plan is a tree of nodes. Each node has a certain type, and may have one or more child nodes (which child nodes depends on the node type). Different node types behave differently, but the overall mechanism is the same: a parent node pulls data from its children row by row. The children either produce data directly (e.g., by reading it from tables) or pull from _their_ children.

The query executor itself pulls rows from the root node and returns them as the query result. There are several different categories of nodes that perform essentially the same function but have different trade-offs (e.g., different types of scan nodes or join nodes).

## Query planning

Planning is determining the best arrangement of plan nodes for executing your query and depends on several factors.

First—and obviously most important—are the semantics of your query: the plan needs to return exactly the rows your query requested (though if there are different results that fulfill those semantics, you may get different rows every time: that’s why you cannot depend on a `SELECT * FROM my_table LIMIT 1` without an `ORDER BY`).

Second are the indexes available: indexes can allow Postgres to fetch data much more efficiently, and maintaining the right indexes for your schema and query workload requires understanding query execution.

Third are the current configuration settings: both [planner cost constants](https://www.postgresql.org/docs/current/runtime-config-query.html#RUNTIME-CONFIG-QUERY-CONSTANTS) and [resource consumption settings](https://www.postgresql.org/docs/current/runtime-config-resource.html) like work\_mem (note that many of these can be set dynamically per database, per user, per session, or even per query).

And finally are [statistics](https://www.postgresql.org/docs/current/view-pg-stats.html) Postgres has gathered about your data (either via running the ANALYZE command manually or as part of manual or automatic vacuum).

To come up with a plan, Postgres inspects your query and evaluates one or more alternatives given the above. It estimates a cost for each leaf node, and propagates those costs up the tree to calculate costs for internal nodes and eventually the root. It considers several plans and picks the cheapest based on cost settings, available indexes, and the heuristics based on collected database statistics.

## Using EXPLAIN to get a query plan

Postgres offers an essential tool for everyone tuning performance: The [EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) command allows you to inspect the plan Postgres decided on, to understand why it picked that plan among possible alternatives, and possibly optimize the query.

As a quick example, lets utilize the EXPLAIN command to understand a simple query:

```sql
EXPLAIN SELECT * FROM databases WHERE id = 1;
```
```
                                    QUERY PLAN                                    
----------------------------------------------------------------------------------
 Index Scan using databases_pkey on databases  (cost=0.28..8.30 rows=1 width=126)
   Index Cond: (id = 1)
(2 rows)
```

This indicates that Postgres will perform an **[Index Scan](/docs/explain/scan-nodes/index-scan)** in order to retrieve the requested data. Postgres expects that this will return a single row. Note that this only represents the query plan, and doesn't tell us anything about the actual query execution.

Its often useful to utilize additional options for `EXPLAIN`, in particular the `ANALYZE` option, which shows you details about the actual query execution, and the `BUFFERS` option, showing you details on how much data is being loaded from disk and the Postgres shared buffer cache:

```sql
EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM databases WHERE id = 1;
```
```
                                                         QUERY PLAN                                                         
----------------------------------------------------------------------------------------------------------------------------
 Index Scan using databases_pkey on databases  (cost=0.28..8.30 rows=1 width=126) (actual time=0.021..0.034 rows=1 loops=1)
   Index Cond: (id = 1)
   Buffers: shared read=3
 Planning Time: 0.068 ms
 Execution Time: 0.105 ms
(5 rows)
```

Here we can see that the query did in fact return a single row, and it took us 0.1ms to retrieve the data. The database had to load 24 KiB from disk (3 blocks * 8 KiB block size).

## Learn more

Obviously EXPLAIN plans can be a lot more complex. We've compiled a repository of the different [scan nodes](/docs/explain/scan-nodes), [join nodes](/docs/explain/join-nodes), and [other nodes](/docs/explain/other-nodes) in the documentation to help you when reading a plan.

To make collection and interpretation of plans easier, you can utilize **[auto_explain](/docs/log-insights/setup/auto_explain)** and **[pganalyze EXPLAIN Insights](/docs/explain/insights)** to get automated insights into what can be optimized about a query plan.