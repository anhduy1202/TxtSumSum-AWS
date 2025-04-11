# AI TXT Summarizer Fullyhacks 2025

## Services:

- AWS S3: Storage for uploads/, results/ .txt files

- AWS Lambda: Invoke Bedrock model to get summary of .txt files

- AWS Bedrock: Using Claude V2.1 to summarize

## Setup
- [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions)

- Configure AWS Creds

`aws configure`

- Install AWS CDK

`npm install -g aws-cdk`

- CDK init

`cdk init app --language typescript`

- CDK bootstrap for first time deployment

`cdk bootstrap`

- CDK deploy

`cdk deploy`

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
