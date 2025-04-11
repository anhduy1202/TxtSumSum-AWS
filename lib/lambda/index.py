import boto3
import json

s3 = boto3.client('s3')
bedrock = boto3.client('bedrock-runtime')

def lambda_handler(event, context):
    # Print the incoming event for debugging/logging
    print("Received S3 Event:")
    print(json.dumps(event))
    try:
        record = event['Records'][0]
        bucket = record['s3']['bucket']['name']
        key = record['s3']['object']['key']
        
        # Only process .txt files from uploads/
        if not key.startswith("uploads/") or not key.endswith(".txt"):
            return {"statusCode": 400, "body": "Not a valid .txt file in upload folder"}
        
        # Read file content from S3
        file_obj = s3.get_object(Bucket=bucket, Key=key)
        input_text = file_obj['Body'].read().decode('utf-8')
        
        # Call Bedrock model (Claude V2 example since V3 requires inference profile)
        response = bedrock.invoke_model(
            modelId="anthropic.claude-v2:1",
            contentType="application/json",
            accept="*/*",
            body=json.dumps({
                "prompt": f"\n\nHuman: Summarize the following:\n\n{input_text}\n\nAssistant:",
                "max_tokens_to_sample": 500,
                "temperature": 0.5,
                "top_k": 250,
                "top_p": 1,
                "stop_sequences": ["\n\nHuman:"],
                "anthropic_version": "bedrock-2023-05-31"
            })
        )
        
        result = json.loads(response['body'].read())
        summary = result['completion']
        
        # Save summary to results/ folder
        filename = key.split('/')[-1].replace(".txt", "_summary.txt")
        s3.put_object(
            Bucket=bucket,
            Key=f"results/{filename}",
            Body=summary
        )
        
        return {"statusCode": 200, "body": f"Summary written to results/{filename}"}
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        return {
            "statusCode": 500,
            "body": f"Error: {str(e)}"
        }