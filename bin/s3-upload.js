'use strict';

const fs = require('fs');
const fileType = require('file-type');

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
    key: `test/test.${file.ext}`
  };
  return Promise.resolve(options);
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
