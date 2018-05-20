---
title: 'Enterprise Edition: Log Insights Setup'
backlink_href: /docs/enterprise
backlink_title: 'pganalyze Enterprise Edition'
---

## 1. Pre-requisites

Log Insights for pganalyze Enterprise Edition currently requires the following, as logs are stored in S3 and encrypted using KMS:

- An Amazon S3 bucket to be used for temporary statistics data
- An Amazon S3 bucket to be used for log data (this is where encrypted log data will be stored)
- An Amazon KMS key to be used for encryption (you can find KMS under "Encryption Keys" in the IAM console)
- An Amazon IAM user that can access the S3 bucket and KMS key (we need the keys in the next steps)

The setup for these should be straightforward - we recommend choosing a region thats close to your database servers, but latency shouldn't be too much of an issue in general.

## 2. Setup IAM user

The pganalyze Docker container needs to have authenticated access to the S3 bucket and KMS key. You can create a regular user, save the access keys, and then assign the following policy:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::mydb-logs"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::mydb-logs/*"
            ]
        },
        {
            "Sid": "Stmt1440353940000",
            "Effect": "Allow",
            "Action": [
                "s3:*"
            ],
            "Resource": [
                "arn:aws:s3:::mydb-snapshots/*",
                "arn:aws:s3:::mydb-snapshots"
            ]
        }
    ]
}
```

You will also need to assign this IAM user as a "Key User" to the KMS key.

Please ensure that S3 buckets don't have public access enabled. All S3 objects created by pganalyze are created as private only.

On the S3 bucket you also need to configure this CORS policy (under the Permissions tab):

```
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
<CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <ExposeHeader>x-amz-meta-x-amz-iv</ExposeHeader>
    <ExposeHeader>x-amz-meta-x-amz-unencrypted-content-length</ExposeHeader>
    <ExposeHeader>x-amz-meta-x-amz-wrap-alg</ExposeHeader>
    <ExposeHeader>x-amz-meta-x-amz-cek-alg</ExposeHeader>
    <ExposeHeader>x-amz-meta-x-amz-key-v2</ExposeHeader>
    <ExposeHeader>x-amz-meta-x-amz-matdesc</ExposeHeader>
    <AllowedHeader>Authorization</AllowedHeader>
    <AllowedHeader>Range</AllowedHeader>
</CORSRule>
</CORSConfiguration>
```

## 3. Configuration on pganalyze Docker container

You will need to add the following configuration to the Docker container:

```
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1
AWS_S3_SNAPSHOTS_BUCKET=mydb-snapshots
AWS_S3_LOGS_BUCKET=mydb-logs
AWS_KMS_LOGS_CMK=...
```

The AWS\_KMS\_LOGS\_CMK is the "ARN" thats listed on the encryption key.

## 4. Setup collector on database servers

In order to collect log information from your database server you will need to install the collector on
the server itself, and configure it.

Note that this is different from the standard Enterprise setup, which runs the collector inside the central pganalyze Docker container.

For this approach, you do not need to add the server into pganalyze itself, as it will auto-register based on an API key, and send all statistics from the database server (instead of pulling them).

Before we get started, retrieve the collector API key from the "API Keys" organization tab in pganalyze (it should already be listed there). If you don't see it in the navigation make sure to click on your organization in the organization dropdown first.

You will also need the hostname of your pganalyze Docker container, which needs to be reachable from your database server.

Now install and enable the pganalyze collector on a server, following the [instructions for pganalyze.com](/docs/install/02_installing_the_collector).

Note that you should be able to follow these instructions as written, with one difference. The [pganalyze] section of the config file needs to look like this:

```
[pganalyze]
api_key: your_pga_organization_api_key
api_base_url: http://your-docker-container.internal
```

Once this works successfully, you can enable [Log Insights for self-hosted servers](/docs/log-insights/setup/self-hosted).

You should then see data flow into the dashboard correctly.
