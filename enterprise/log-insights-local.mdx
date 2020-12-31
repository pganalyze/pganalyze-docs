---
title: 'Enterprise Edition: Log Insights Setup (Local Storage)'
backlink_href: /docs/enterprise/log-insights
backlink_title: 'pganalyze Enterprise Edition: Log Insights Setup'
---

### 1. Installation of the Minio storage server

Since pganalyze requires an object storage to store log data, we
support the open-source storage server [Minio](https://www.minio.io/)
which can be run in a small Docker container, together with a mounted directory.

The easiest way to get started is to simply launch a Minio container like this,
whilst making sure to choose secure and randomly generated keys:

```
docker run --name minio -e MINIO_ACCESS_KEY=securesecuresecure -e MINIO_SECRET_KEY=securesecuresecure -d -v /storage:/data -p 9000:9000 minio/minio server /data
```

(please make sure to replace `securesecuresecure` with two randomly generated strings!)

This assumes that you have sufficient storage available on the server where you are
launching the container, and that this storage is provided under the `/storage` directory.

Note that whilst we do not require the Minio container and storage to be on the
same server as the pganalyze container, it typically is easiest to get started
that way.

When you now go to the URL `http://minio.internal:9000` (replace `minio.internal` with the actual hostname of the server) you should see the minio login page.

### 2. Configuration of the pganalyze container

With the Minio server working, you can now configure the pganalyze container.

First of all, we also need to generate an encryption key, which will be used to
encrypt all log data in transit as well as at rest. This way you can be sure
that only those that have access to the encryption key can read sensitive log
information.

You can generate a key like this:

`dd if=/dev/urandom bs=32 count=1 2>/dev/null | openssl base64`

And then configure the following environment variables:

```
LOG_ENCRYPTION_KEY={"1": "base64_encoded_key_here"}
MINIO_ACCESS_KEY=XXX
MINIO_SECRET_KEY=XXX
MINIO_ENDPOINT=http://minio.internal:9000
```

At this point all you need to do is restart the pganalyze container, and then
[follow the instructions](/docs/enterprise/log-insights) to install the
collector on your database servers.
