'use strict';

const multer = require('multer');
const storage = multer.memoryStorage(); // <-- big no-no in production

module.exports = multer({ storage });
