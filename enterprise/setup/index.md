---
title: 'Enterprise Edition: Initial Setup'
backlink_href: /docs/enterprise
backlink_title: 'pganalyze Enterprise Edition'
---

These are the installation instructions for [pganalyze Enterprise Edition](/enterprise-postgres-monitoring), which runs fully-contained within your own environment.

The pganalyze Docker image is mostly self-contained, and runs various services inside the Docker container.

```toc
```

## Installation steps

### Pre-requisites

* Provision a virtual machine
  * Assign at least 4GB - 8GB of RAM, 1-2 dedicated CPU cores
* Install Docker on your virtual machine
  * pganalyze Enterprise Edition is delivered through a Docker image
* Setup a PostgreSQL database that can be used for storing statistics data
  * PostgreSQL 10 or newer
  * 50 GB of dedicated disk space or more
* Optional: If you use the RDS integration, setup an appropriate IAM role that can be used
  * You can also assign the required policy to an existing EC2 instance and its instance role
  * Appendix A lists out the exact IAM policy

### Step 1: Download the Docker Image

The Docker image is made available to you through the container hosting service quay.io. We have provided you with the credentials you can use for access by email.

Enable access to the image like this:

```
docker login -e="." -u="pganalyze+enterprise_customer" -p="YOUR_PASSWORD" quay.io
```

Note that this will add the login information to your current user's `.dockercfg` file - you will need this on every host where you'd like to access the image.

You should now be able to pull the pganalyze Enterprise Edition Docker image:

```
docker pull quay.io/pganalyze/enterprise:[version]
```

Please note that `[version]` should be replaced with the version you are using. We recommend using [the latest release](/docs/enterprise/releases).


### Step 2: Setting Environment Variables

The Docker image uses environment variables that are passed in to determine how to access outside services, like PostgreSQL, LDAP and mail servers.

Here is an example .env file to get you started:

```
DATABASE_URL=postgres://myusername:mypassword@example.com:5432/mydatabase
MAILER_URL=smtp://myusername:mypassword@example.com:25
LICENSE_KEY=KEYKEYKEY
```

You can find the full explanation of all variables in Appendix C.


### Step 3: Initialize Database & Verify Installation

First, run the Enterprise self check, to ensure the configuration is correct:

```
docker run --env-file pganalyze.env quay.io/pganalyze/enterprise:[version] rake enterprise:self_check
```

```
Testing database connection... Success!
Testing Redis connection... Success!
Testing LDAP connection... Success!

All tests completed successfully!
```

In the case of an error this will give you a very verbose error message - please don't hesitate to [ask us about it](/contact/).

Assuming it succeeds, continue by initializing the database schema.

```
docker run --env-file pganalyze.env quay.io/pganalyze/enterprise:[version] rake db:structure:load
```

If you get permission errors, you may need to create the extensions `btree_gist` and `pgcrypto` beforehand. A successful output looks like this:

```
Jul  2 07:15:16 aa84f55aceba syslog-ng[160]: syslog-ng starting up; version='3.13.2'
Jul  2 07:15:17 aa84f55aceba cron[180]: (CRON) INFO (pidfile fd = 3)
Jul  2 07:15:17 aa84f55aceba cron[180]: (CRON) INFO (Running @reboot jobs)
 set_config 
------------
 
(1 row)

Jul  2 07:15:22 aa84f55aceba syslog-ng[160]: syslog-ng shutting down; version='3.13.2'
```

Next, create the initial user:

```
docker run --env-file pganalyze.env quay.io/pganalyze/enterprise:[version] rake db:seed
```

Make sure to note down the default user email and password:

```
Jul  2 07:15:29 8bc5a4c0e6b6 syslog-ng[150]: syslog-ng starting up; version='3.13.2'
Jul  2 07:15:30 8bc5a4c0e6b6 cron[167]: (CRON) INFO (pidfile fd = 3)
Jul  2 07:15:30 8bc5a4c0e6b6 cron[167]: (CRON) INFO (Running @reboot jobs)
I, [2020-07-02T07:15:35.006455 #159]  INFO -- : *****************************
I, [2020-07-02T07:15:35.006520 #159]  INFO -- : *** INITIAL ADMIN CREATED ***
I, [2020-07-02T07:15:35.006538 #159]  INFO -- : *****************************
I, [2020-07-02T07:15:35.006551 #159]  INFO -- : 
I, [2020-07-02T07:15:35.006563 #159]  INFO -- : *****************************
I, [2020-07-02T07:15:35.006599 #159]  INFO -- : Email:    admin@example.com
I, [2020-07-02T07:15:35.006619 #159]  INFO -- : Password: abcdefabcdef
I, [2020-07-02T07:15:35.006636 #159]  INFO -- : *****************************
I, [2020-07-02T07:15:35.006648 #159]  INFO -- : 
I, [2020-07-02T07:15:35.006660 #159]  INFO -- : Use these credentials to login and then change email address and password.
Jul  2 07:15:35 8bc5a4c0e6b6 syslog-ng[150]: syslog-ng shutting down; version='3.13.2'
```

### Step 4: Start Docker Image & Login to pganalyze

You can now start the Docker image in the background using this command:

```
docker run -d --name pganalyze --env-file pganalyze.env -p 8080:5000 quay.io/pganalyze/enterprise:[version]
```

This will make the web interface accessible on the server's address, on port 8080. You should see a site like this when you open your web browser for that address and port:

![](login.png)

Please now login to the pganalyze interface using the generated credentials you've seen earlier when setting up the database. If successful you should see this screen:

![](create_organization.png)

If authentication does not work, or you see an error message, please check the container's logs using `docker logs`.

Choose an organization name of your choice (typically your company name), and then click "Add Server" on the next screen. You should now see this form:

![](add_server.png)

### Step 5: Preparing Your PostgreSQL Database for Monitoring

Before you can add a database to the pganalyze installation, you'll need to enable the `pg_stat_statements` extension on it.

This extension is bundled with PostgreSQL and allows you detailed query monitoring. Its overhead on the database system is minimal, and it is required to use pganalyze.

Please see [self-hosted systems](/docs/install/01_enabling_pg_stat_statements) or [Amazon RDS](/docs/install/amazon_rds) instructions on how to add it to your database.

In addition you will need to either use the database superuser (usually "postgres") to give pganalyze access to your database, or create a special [restricted monitoring user](/docs/install/amazon_rds/02_create_monitoring_user).

You don't need to run anything else on your database server - the pganalyze container will connect to your database at regular intervals to gather information from PostgreSQL's statistics tables.

### Step 6: Add Your First Database to pganalyze

You can now fill out the "New Database" form. Once you click "Add Database" the collector running inside the container will update, and start collecting information within 10 minutes.

Initially, until sufficient information is available, your screen will look like this:

![](server_empty.png)

You can check whether any information has been received by clicking the "Server Settings" link in the left navigation, and scrolling down to the "Debug Info" section:

![](debug_info_no_data.png)

Once data is coming in successfully, the "Debug Info" looks like this:

![](debug_info_with_data.png)

Be aware that some graphs need at least a few hours worth of data and might not work properly before. It is therefore recommended that you wait for up to 24 hours before evaluating the system more closely.

Once the system has collected sufficient data it should look similar to this:

![](dashboard_with_data.png)


### Step 7: Adding Additional Team Members

For regular setups, you can invite additional team members on a per-database basis, through the Settings screen.

With LDAP authentication you can simply direct your colleagues to the root of your pganalyze URL, an account will be created when they first login.

Note that only administrators can add new databases (see Appendix B).


## Appendix

### Appendix A - Amazon Web Services IAM Role

Your IAM role will need two policies assigned - at first, the predefined `AmazonRDSReadOnlyAccess` policy that gives access to most Amazon RDS information and statistics.

In addition, you'll also need to add an inline policy with the following content, if you want to use the log monitoring feature:

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "rds:Describe*",
                "rds:ListTagsForResource",
                "ec2:DescribeAccountAttributes",
                "ec2:DescribeAvailabilityZones",
                "ec2:DescribeSecurityGroups",
                "ec2:DescribeVpcs"
            ],
            "Effect": "Allow",
            "Resource": "*"
        },
        {
            "Action": [
                "cloudwatch:GetMetricStatistics",
                "logs:DescribeLogStreams",
                "logs:GetLogEvents"
            ],
            "Effect": "Allow",
            "Resource": "*"
        },
        {
            "Action": [ "rds:DownloadDBLogFilePortion" ],
            "Effect": "Allow",
            "Resource": "*"
        }
    ]
}
```

This is required so that pganalyze can access and download the log files for each instance.


### Appendix B - User Roles

Administrator roles:
* Can create new databases
* Can access the /admin pages
* Can modify database settings
* Can delete databases

Normal user roles:
* Can view statistics and query information
* Can view automated Check-Up information, and mark check-ups as acknowledged
* Receive weekly email reports (if enabled)

Users without valid accounts cannot access any information.


### Appendix C - Environment Variables

The following environment variables can be passed into the Docker image. Note that the examples are listed with multiple lines here for formatting reasons, but you need to pass them as one line.

* `DATABASE_URL`: PostgreSQL server used for storing statistics information (required)
* `LICENSE_KEY`: License key provided to you by the pganalyze team (required)
* `MAILER_URL`: SMTP server used to send system emails, e.g. user invites (optional, recommended)
* `AWS_ACCESS_KEY_ID:` AWS Access Key ID (optional)
* `AWS_SECRET_ACCESS_KEY`: AWS Secret Access Key (optional)
* `AWS_REGION`: Default AWS region (optional)

An example configuration looks like this:

```
DATABASE_URL=postgres://myusername:mypassword@example.com:5432/mydatabase
LICENSE_KEY=KEYKEYKEY
MAILER_URL=smtp://myusername:mypassword@example.com:25
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=ReallyLongStringYouWillGetFromYourAwsConsole
AWS_REGION=us-east-1
```

### Appendix D - LDAP configuration

* `LDAP_HOST`: Internal hostname or IP of your LDAP server
* `LDAP_PORT`: Port of your LDAP server. Use port 636 for LDAPS
* `LDAP_BASE_DN`: Base DN that all lookups should be done with. You can use this to restrict access to a subset of your LDAP accounts
* `LDAP_ADMIN_GROUP_CN`: Common Name of the group used to identify pganalyze admins. Note that members don’t need to be LDAP admins
* `LDAP_LOOKUP_CN`: Common Name of an account that will be used to run authentication lookups on your LDAP directory
* `LDAP_LOOKUP_PASSWORD`: Password for the account that will be used to run authentication lookups
* `LDAP_FIELD_UID`: UID field on your LDAP entries. This is usually `sAMAccountName` on Active Directory servers
* `LDAP_ENCRYPTION`: Encryption mode to use for LDAP connections. Only add this when you want to use LDAPS (Port 636) or STARTTLS (Port 389) for a secure connection to your server. Specify `ssl` for LDAPS, and `tls` for STARTTLS (optional)

Example LDAP configuration, in addition to regular environment variables:

```
LDAP_HOST=example.com
LDAP_PORT=389
LDAP_BASE_DN=OU=Users,OU=ldaptest,DC=ldaptest,DC=pganalyze,DC=com
LDAP_ADMIN_GROUP_CN=opsteam
LDAP_LOOKUP_CN=Admin
LDAP_LOOKUP_PASSWORD=ReallyLongSecurePassword
LDAP_FIELD_UID=sAMAccountName
LDAP_ENCRYPTION=ssl
```

If LDAP authentication does not work, or you see an error message instead of this form, please check the container's logs using `docker logs` and verify your `LDAP_ADMIN_GROUP_CN` setting.

### Appendix E - Command Line Debugging Tools

There are two essential debugging tools:

#### Enterprise Self Check

```
docker run --env-file ... rake enterprise:self_check
```

Verifies the environment variables you have passed in for errors.

#### Docker Container Logs

```
docker logs -f pganalyze
```

Shows the full log messages from the pganalyze container - if you encounter an error screen in the software this will show the details. This information will be required when submitting issues to our support team.

### Appendix F - Updating to a new Version

See [upgrade instructions](/docs/enterprise/upgrade).