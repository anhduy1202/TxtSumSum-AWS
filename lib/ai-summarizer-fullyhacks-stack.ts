// bedrock-summary-app-stack.ts
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

export class AiSummarizerFullyhacksStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 bucket
    const bucket = new s3.Bucket(this, 'SummaryBucket', {
      bucketName: 'sumsum-bucket-cdk',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create uploads/ and results folders with empty objects
    new cdk.aws_s3_deployment.BucketDeployment(this, 'CreateFolders', {
      destinationBucket: bucket,
      sources: [
        cdk.aws_s3_deployment.Source.data('uploads/', ''),
        cdk.aws_s3_deployment.Source.data('results/', ''),
      ],
    });

    // Lambda function
    const summaryFunction = new lambda.Function(this, 'SummaryLambda', {
      runtime: lambda.Runtime.PYTHON_3_12,
      handler: 'index.lambda_handler',
      code: lambda.Code.fromAsset(path.join(__dirname, './lambda')),
      timeout: cdk.Duration.seconds(30),
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    // Permissions for Lambda
    bucket.grantReadWrite(summaryFunction);
    summaryFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: ['*'],
    }));

    // S3 trigger
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3n.LambdaDestination(summaryFunction),
      { prefix: 'uploads/', suffix: '.txt' }
    );
  }
}
