import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    endpoint: process.env.NEXT_PUBLIC_S3_ENDPOINT,
    region: process.env.NEXT_PUBLIC_S3_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY || '',
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY || ''
    },
    forcePathStyle: true
});

async function getFile(key: string): Promise<{ buffer: Buffer; contentType?: string }> {
    try {
        const response = await s3Client.send(
            new GetObjectCommand({
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
                Key: key
            })
        );

        if (!response.Body) {
            throw new Error(`File not found: ${key}`);
        }

        // Convert the stream to a buffer
        const buffer = Buffer.from(await response.Body.transformToByteArray());

        return {
            buffer,
            contentType: response.ContentType
        };
    } catch (err: any) {
        // Handle S3 specific errors
        if (err.name === 'NoSuchKey' || err.$metadata?.httpStatusCode === 404) {
            throw new Error(`File not found: ${key}`);
        }
        throw err;
    }
}

const s3 = {
    getFile,
}

export default s3;