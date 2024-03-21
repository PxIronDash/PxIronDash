# S3 With Pulumi and Typescript

Create AWS S3 Bucket and IAM user using Pulumi with Typescript. The IAM user has specific roles that are allowed to access the bucket by the bucket’s policy

## Get Started

Follow Pulumi [Get Started](https://www.pulumi.com/docs/clouds/aws/get-started/begin/) to install appropriate tools to create S3 resources

## Config

Update Pulumi config data

**bucketName**: The name for the S3 bucket.

**iamUserName**: The name of the IAM user with access to the S3 bucket

**prefix**: The prefix is used for all resources. This will aid in establishing the resource's name as globally unique across all AWS accounts, especially the S3 bucket

## Deployment

`npm run deploy`

## Delete

`npm run destroy`
