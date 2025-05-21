const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

// Create temp directory if it doesn't exist
if (!fs.existsSync("./temp")) {
  fs.mkdirSync("./temp");
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./temp");
  },
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) return cb(err);
      cb(null, buf.toString("hex") + path.extname(file.originalname));
    });
  },
});

// File filter to validate uploads
// const fileFilter = (req, file, cb) => {
//   // You can add file type validation here
//   cb(null, true);
// };
const fileFilter = (req, file, cb) => {
  console.log("Uploading file:", file.originalname);
  cb(null, true);
};

// Export configured multer middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 * 1024 }, // 1GB limit
});

module.exports = { upload };
