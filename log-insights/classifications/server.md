---
title: 'Server'
backlink_href: /docs/log_insights/classifications
backlink_title: 'Log Insights: Classifications'
---

## <a name="S1"></a> S1: Server Crashed

**SQLSTATE Error Code:** 57P02 (Class 57 — Operator Intervention: `crash_shutdown`)<br />
**Example Output:**

```
TODO
```

---

## <a name="S2"></a> S2: Server Start

**SQLSTATE Error Code:** n/a<br />
**Example Output:**

```
TODO
```

---

## <a name="S3"></a> S3: Server Start (Recovering)

**SQLSTATE Error Code:** n/a<br />
**Example Output:**

```
LOG: database system was interrupted; last known up at 2017-05-07 22:33:02 UTC
LOG: database system was not properly shut down; automatic recovery in progress
```

---

## <a name="S4"></a> S4: Server Shutdown

**SQLSTATE Error Code:** 57P01 (Class 57 — Operator Intervention: `admin_shutdown`)<br />
**Example Output:**

```
TODO
```

---

## <a name="S5"></a> S5: Out of Memory

**SQLSTATE Error Code:** 53200 (Class 53 — Insufficient Resources: `out_of_memory`)<br />
**Example Output:**

```
ERROR: out of memory
DETAIL: Failed on request of size 324589128.
STATEMENT: SELECT 1
```

```
LOG: server process (PID 123) was terminated by signal 9: Killed
```

---

## <a name="S6"></a> S6: Invalid Checksum

**SQLSTATE Error Code:** n/a<br />
**Example Output:**

```
TODO
```

---

## <a name="S7"></a> S7: Temporary File

**SQLSTATE Error Code:** n/a<br />
**Example Output:**

```
LOG: temporary file: path "base/pgsql_tmp/pgsql_tmp15967.0", size 200204288
STATEMENT: alter table pgbench_accounts add primary key (aid)
```

---

## <a name="S8"></a> S8: Other Server Notice

**SQLSTATE Error Code:** n/a<br />
**Example Output:**

```
TODO
```

---

## <a name="S9"></a> S9: Server Reloaded

**SQLSTATE Error Code:** n/a<br />
**Example Output:**

```
TODO
```

---

## <a name="S10"></a> S10: Server Process Exited

**SQLSTATE Error Code:** n/a<br />
**Example Output:**

```
TODO
```
