import { S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_DEFAULT_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const endpoint = process.env.AWS_ENDPOINT;

if (!region || !accessKeyId || !secretAccessKey || !endpoint) {
  throw new Error("Unable to connect s3 client");
}

const s3Client = new S3Client({
  region,
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export default s3Client;
