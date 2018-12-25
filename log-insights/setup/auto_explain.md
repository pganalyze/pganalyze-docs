---
title: 'Log Insights: Collect Postgres EXPLAIN plans using auto_explain'
backlink_href: /docs/log-insights/setup
backlink_title: 'Log Insights: Setup'
---

We also support extraction of EXPLAIN plans from `auto_explain` output. Please
review the [auto_explain documentation](https://www.postgresql.org/docs/current/static/auto-explain.html)
carefully to see what makes sense for your system.

We've had good experience with a configuration like this, which will log the
EXPLAIN output for every query slower than 1s:

```
auto_explain.log_analyze = 1
auto_explain.log_buffers = 1
auto_explain.log_timing = 0
auto_explain.log_triggers = 1
auto_explain.log_verbose = 1
auto_explain.log_format = json
auto_explain.log_min_duration = 1000
auto_explain.log_nested_statements = 1
auto_explain.sample_rate = 1
```

The important detail here is that `log_timing` is disabled, as this will have a
negative performance impact on query execution. You may also want to disable
`log_analyze` if you see increased CPU utilization after enabling `auto_explain`.

Note that you will also need to add `auto_explain` to your `shared_preload_libraries`
if you haven't done so already.

EXPLAIN plans will be classified as [T84: EXPLAIN plan for slow query](/docs/log-insights/statements/T84)
and can also be accessed on the associated query detail page:

![](query_details_explain_plan.png)
