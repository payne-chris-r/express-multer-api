'use strict';

require('dotenv').config();

const fs = require('fs');
const fileType = require('file-type');
const AWS = require('aws-sdk');
const crypto = require('crypto');

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

const randomHexString = (length) => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(length, (error, buffer) => {
      if(error){
        reject(error);
      }
      resolve(buffer.toString('hex'));
    });
  });
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
  return randomHexString(16)
  .then((filename) => {
    let dir = new Date().toISOString().split('T')[0];
    return {
      ACL: "public-read",
      Body: file.data,
      Bucket: 'my.new.buckety',
      ContentType: file.mine,
      Key: `${dir}/${filename}.${file.ext}`
    };
  })
  .then((options) => {
    return new Promise((resolve, reject) => {
      s3.upload(options, (error,data) => {
        if(error){
          reject(error);
        }
        resolve(data);
      });
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
