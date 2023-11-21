const multer = require("multer");
const path = require("path");

const tempDir = path.join(process.cwd(), "public/avatars");

const storage = multer.diskStorage({
 destination: (req, file, cb) => {
  cb(null, tempDir);
 },
 filename: (req, file, cb) => {
  cb(null, file.originalname);
 },
});

module.exports = multer({ storage }).single("avatar");
