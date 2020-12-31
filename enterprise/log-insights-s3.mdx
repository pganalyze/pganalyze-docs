---
title: 'Enterprise Edition: Log Insights Setup (Amazon S3)'
backlink_href: /docs/enterprise/log-insights
backlink_title: 'pganalyze Enterprise Edition: Log Insights Setup'
---

## 1. Pre-requisites

Log Insights for pganalyze Enterprise Edition currently requires the following when storing logs in Amazon S3 and encrypting them using KMS:

- An Amazon S3 bucket to be used for temporary statistics data
- An Amazon S3 bucket to be used for log data (this is where encrypted log data will be stored)
- An Amazon KMS key to be used for encryption (you can find KMS under "Encryption Keys" in the IAM console)
- An Amazon IAM user that can access the S3 bucket and KMS key (we need the keys in the next steps)

The setup for these should be straightforward - we recommend choosing a region thats close to your database servers, but latency shouldn't be too much of an issue in general.

If you are not using Amazon Web Services, the [local storage setup](/docs/enterprise/log-insights-local) might be a better fit.

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

After a pganalyze container restart you can continue with the [general steps](/docs/enterprise/log-insights).
