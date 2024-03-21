import * as aws from '@pulumi/aws'
import { BucketPolicy } from '@pulumi/aws/s3'
import { config } from './config'

const tags = {
  Project: 'Backup',
  Name: 'NAS',
}

// Create an IAM user
const bucketUser = new aws.iam.User(config.iamUserName, {
  tags,
})

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket(`${config.prefix}-${config.bucketName}`, {
  tags,
})

const bucketActions = [
  's3:PutObject',
  's3:GetObject',
  's3:ListBucketMultipartUploads',
  's3:AbortMultipartUpload',
  's3:ListBucket',
  's3:DeleteObject',
  's3:GetBucketAcl',
  's3:GetBucketLocation',
  's3:ListMultipartUploadParts',
]

new aws.iam.UserPolicy('userS3AccessPolicy', {
  name: 'userS3AccessPolicy',
  user: bucketUser.name,
  policy: bucket.arn.apply((arn) =>
    JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Action: bucketActions,
          Resource: [arn, `${arn}/*`],
        },
      ],
    })
  ),
})

const getCurrentCallerIdentity = async () => {
  const callerIdentity = await aws.getCallerIdentity({})
  return callerIdentity.arn
}

const currentUserArn = getCurrentCallerIdentity().then((arn) => arn)

new BucketPolicy(`${config.prefix}-${config.bucketName}-s3-policy`, {
  bucket: bucket.id,
  policy: {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'AllowUserAccess',
        Effect: 'Allow',
        Principal: { AWS: bucketUser.arn },
        Action: bucketActions,
        Resource: [
          bucket.arn.apply((arn) => arn),
          bucket.arn.apply((arn) => `${arn}/*`),
        ],
      },
      {
        Sid: 'DenyOthersAccess',
        Effect: 'Deny',
        NotPrincipal: {
          AWS: [bucketUser.arn, currentUserArn],
        },
        Action: 's3:*',
        Resource: [
          bucket.arn.apply((arn) => arn),
          bucket.arn.apply((arn) => `${arn}/*`),
        ],
      },
    ],
  },
})

// Export the name of the bucket
export const bucketName = bucket.id
export const bucketUserId = bucketUser.id
export const currentarn = currentUserArn
