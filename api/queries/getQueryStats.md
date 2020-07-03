---
title: 'getQueryStats - Export query statistics'
backlink_href: /docs/api/queries
backlink_title: 'pganalyze GraphQL API Queries'
---

## Use case

You can use this endpoint to **get the list of the top queries by % of runtime**, in order to do analysis on which
queries have been newly introduced into the system.

You can use this data to e.g. export new slow queries to ticketing systems, or to
compare the frequency and impact of queries over time.

## API

Arguments for `getQueryStats`:

* **`databaseId` (string)**<br>Database ID for which to retrieve query statistics for
* **`startTs` (integer)**<br>Start Unix timestamp in seconds (optional, defaults to 24 hours ago)
* **`endTs` (integer)**<br>End Unix timestamp in seconds (optional, defaults to now)

Fields returned:

* **`id` (number)**<br>Unique identifier for this query in the pganalyze system
* **`queryUrl` (string)**<br>URL to the pganalyze query page
* **`truncatedQuery` (string)**<br>Shortened query text up to 100 characters (same as displayed in "Query Performance" overview)
* **`queryComment` (string)**<br>First comment contained in the query (this is taken from the full query string, not just the truncated one)
* **`statementType` (array of strings)**<br>List of statement type(s) used in this query
* **`tableNames` (array of strings)**<br>Fully qualified list of table names used in this query
* **`totalCalls` (integer)**<br>Total number of calls for this query
* **`avgTime` (float)**<br>Average runtime in milliseconds for this query
* **`avgIoTime` (float)**<br>Average time spent in I/O operations for this query (this requires `track_io_timing` to be enabled on the database)
* **`bufferHitRatio` (float)**<br>% of query data that was returned from the buffer cache, instead of the disk or page cache
* **`pctOfTotal` (float)**<br>% of runtime this query represents compared to the cumulative runtime of all queries

Note that the data returned reflects the statistics of the previous 24 hours, from the time the API request was run.

## Example

```
query {
  getQueryStats(databaseId: 12345) {
    id
    queryUrl
    truncatedQuery
    statementType
    tableNames
    totalCalls
    avgTime
    bufferHitRatio
    pctOfTotal
  }
}
```

```
curl -XPOST -H 'Authorization: Token XXXXXXX' -F 'query=query { getQueryStats(databaseId: 12345) { id, queryUrl, truncatedQuery, statementType, tableNames, totalCalls, avgTime, bufferHitRatio, pctOfTotal } }' https://app.pganalyze.com/graphql
```

```
{
  "data": {
    "getQueryStats": [
      {
        "id":"678910",
        "queryUrl": "https://app.pganalyze.com/databases/12345/queries/678910",
        "truncatedQuery": "UPDATE \"pgbench_accounts\" SET abalance = $1 WHERE \"aid\" = $2",
        "statementType": [
          "UPDATE"
        ],
        "tableNames": [
          "pgbench_accounts"
        ],
        "totalCalls": 1887313,
        "avgTime": 35.3024511808419,
        "bufferHitRatio": 69.50736528891339,
        "pctOfTotal": 96.0880225982751
      },
      [ ... ]
    }
  }
}
```

## CSV Export

In case you are looking for a CSV export instead of the JSON output for this API call, the following Ruby script can be used:

```
require 'csv'
require 'json'
require 'net/http'

DATABASE_ID = 12345
API_TOKEN = 'XXXXXX'

API_ENDPOINT = 'https://app.pganalyze.com/graphql'
QUERY = '''
query {
  getQueryStats(databaseId: %d) {
    id
    queryUrl
    truncatedQuery
    statementType
    tableNames
    totalCalls
    avgTime
    bufferHitRatio
    pctOfTotal
  }
}
'''

uri = URI(API_ENDPOINT)
req = Net::HTTP::Post.new(uri.request_uri)
req['authorization'] = 'Token ' + API_TOKEN
req.form_data = { 'query' => format(QUERY, DATABASE_ID) }
res = Net::HTTP.new(uri.host, uri.port).request(req)

stats = JSON.parse(res.body)['data']['getQueryStats']
exit(1) if stats.empty?

csv_output = CSV.generate do |csv|
  csv << stats[0].keys
  stats.each do |d|
    csv << d.values
  end
end

puts csv_output
```

This will output the following on stdout:

```
id,queryUrl,truncatedQuery,statementType,tableNames,totalCalls,avgTime,bufferHitRatio,pctOfTotal
678910,https://app.pganalyze.com/databases/12345/queries/678910,"UPDATE ""pgbench_accounts"" SET abalance = $1 WHERE ""aid"" = $2","[""UPDATE""]","[""pgbench_accounts""]",1887313,35.3024511808419,69.50736528891339,96.0880225982751
...
```
