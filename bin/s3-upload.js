'use strict';

require('dotenv').config();

const fs = require('fs');
const fileType = require('file-type');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

let filename = process.argv[2] || '';

const mimeType = (data) => {
  return Object.assign({
    ext: 'bin',
    mime: 'application/octet-stream'
  }, fileType(data));
};

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error,data) => {
      if(error){
        reject(error);
      }
      resolve(data);
    });
  });
};

const awsUpload = function(file){
  const options = {
    ACL: "public-read",
    Body: file.data,
    Bucket: 'my.new.buckety',
    ContentType: file.mine,
    Key: `test/test.${file.ext}`
  };
  return new Promise((resolve, reject) => {
    s3.upload(options, (error,data) => {
      if(error){
        reject(error);
      }
      resolve(data);
    });
  });
};

readFile(filename)
.then((data) => {
  // let file = {};
  let file = mimeType(data);
  file.data = data;
  return file;
})
.then(awsUpload)
// .then((file) => {
//
// })
// .then((data) => console.log(`${filename} is ${data.length} bytes long`))
.then(console.log)
.catch(console.error);
