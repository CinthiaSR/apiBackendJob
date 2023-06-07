import { S3Client, PutObjectCommand, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import { mainDir } from "../../..";

const {AWS_ACCESSKEYID,AWS_BUCKETNAME,AWS_SECRETACCESSKEY}=process.env

export const setCorsBucket = async () => {
  const client = new S3Client({
    credentials: {
      accessKeyId: AWS_ACCESSKEYID,
      secretAccessKey: AWS_SECRETACCESSKEY,
    },
    region: "us-east-2",
  });
  console.log('AWS_ACCESSKEYID:',AWS_ACCESSKEYID);
  console.log('AWS_SECRETACCESSKEY:',AWS_SECRETACCESSKEY);
  console.log('AWS_BUCKETNAME:',AWS_BUCKETNAME);
  try {
    const input = {
      // PutBucketCorsRequest
      Bucket: AWS_BUCKETNAME, // required
      CORSConfiguration: {
        // CORSConfiguration
        CORSRules: [
          // CORSRules // required
          {
            // CORSRule
            AllowedHeaders: [
              // AllowedHeaders
              "*",
            ],
            AllowedMethods: [
              // AllowedMethods // required
              "POST",
              "GET",
            ],
            AllowedOrigins: [
              // AllowedOrigins // required
              "*",
            ],
            ExposeHeaders: [],
          },
        ],
      },
    };
    const command = new PutBucketCorsCommand(input);
    const response = await client.send(command);

    console.log('response setCorsBucket:..',response);
  } catch (error) {
    console.log('Error setBucketCors:..',error);
  }
};

export const uploadOneFileToBucket = async (dataFile, target_id) => {
  const client = new S3Client({
    credentials: {
      accessKeyId: AWS_ACCESSKEYID,
      secretAccessKey: AWS_SECRETACCESSKEY,
    },
    region: "us-east-2",
  });
  let response = {
    msg: "Proceso upLoadOneFileToBubket:..",
  };
  try {
    fs.readFile(`${mainDir}/${dataFile.tempFilePath}`, async (err, data) => {
      if (err) {
        console.log("error al leer el archivo:..", err);
      } else {
        console.log("alparecer todo ok al leer el archivo:..", data);
        const input = {
          ACL: "public-read",
          Body: data,
          Bucket: AWS_BUCKETNAME,
          Key: `${target_id}/${dataFile.name}`,
        };
        const command = new PutObjectCommand(input);
        const resultUpload = await client.send(command);
        //const resultUploadFile = `resultUpload${item.name}`;

        response = {
          ...response,
          resultUpload,
        };
      }
    });

    return response;
  } catch (error) {
    return {
      ...response,
      error,
    };
  }
};
