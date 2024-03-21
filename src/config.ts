import * as pulumi from '@pulumi/pulumi'

interface Config {
  bucketName: string
  iamUserName: string
  prefix: string
}

const config = new pulumi.Config()
const configData = config.requireObject<Config>('data')

export { configData as config }
