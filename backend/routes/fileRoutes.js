const express = require("express");
const router = express.Router();
const fs = require("fs");
const mongoose = require("mongoose");
const { getGFS } = require("../database/config/db");
const { upload } = require("../database/config/upload");
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  console.log(req.file);
  const gfs = getGFS();

  // Create a readable stream from the uploaded file
  const readStream = fs.createReadStream(req.file.path);

  // Set up metadata
  const metadata = {
    uploadedBy: req.body.uploadedBy || "anonymous",
    uploadDate: new Date(),
    description: req.body.description || "",
    originalFileName: req.file.originalname,
    fieldName: req.file.fieldname,
  };

  // Create a writable stream to GridFS
  const uploadStream = gfs.openUploadStream(req.file.originalname, {
    contentType: req.file.mimetype,
    metadata: metadata,
  });

  // Pipe the readable stream to the GridFS writable stream
  readStream.pipe(uploadStream);

  uploadStream.on("error", (error) => {
    console.error("Upload error:", error);
    return res.status(500).send({ message: "Error uploading file" });
  });

  uploadStream.on("finish", () => {
    // Remove temp file
    fs.unlinkSync(req.file.path);
    res.send({
      success: true,
      fileId: uploadStream.id,
      fileName: req.file.originalname,
      contentType: req.file.mimetype,
      metadata: metadata,
    });
  });
});

// Upload multiple files
router.post("/upload-multiple", upload.array("files", 10), (req, res) => {
  console.log("req files lenght", req.files.length);
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: "No files uploaded" });
  }

  const gfs = getGFS();
  const uploadResults = [];
  const uploadPromises = [];

  req.files.forEach((file) => {
    const uploadPromise = new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(file.path);

      const metadata = {
        uploadedBy: req.body.uploadedBy || "anonymous",
        uploadDate: new Date(),
        description: req.body.description || "",
        originalFileName: file.originalname,
        fieldName: file.fieldname,
      };

      const uploadStream = gfs.openUploadStream(file.originalname, {
        contentType: file.mimetype,
        metadata: metadata,
      });

      readStream.pipe(uploadStream);

      uploadStream.on("error", (error) => {
        console.error("Upload error:", error);
        reject(error);
      });

      uploadStream.on("finish", () => {
        // Remove temp file
        fs.unlinkSync(file.path);

        uploadResults.push({
          success: true,
          fileId: uploadStream.id,
          fileName: file.originalname,
          contentType: file.mimetype,
          metadata: metadata,
        });

        resolve();
      });
    });

    uploadPromises.push(uploadPromise);
  });

  Promise.all(uploadPromises)
    .then(() => {
      res.send({
        success: true,
        message: `${uploadResults.length} files uploaded successfully`,
        files: uploadResults,
      });
    })
    .catch((error) => {
      console.error("Error in multi-upload:", error);
      res.status(500).send({
        message: "Error uploading files",
        error: error.message,
      });
    });
});

// Custom profile upload endpoint
router.post(
  "/profile",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  (req, res) => {
    console.log("pfifaffdsfdskfjs");
    // Extract basic profile data
    const { user_id } = req.body;
    const profileData = { ...req.body };

    // Parse JSON string arrays back to arrays
    if (profileData.interests) {
      try {
        profileData.interests = JSON.parse(profileData.interests);
      } catch (e) {
        console.error("Error parsing interests:", e);
      }
    }

    const gfs = getGFS();
    const uploadedFiles = {};
    const uploadPromises = [];

    // Process received files
    if (req.files) {
      Object.keys(req.files).forEach((fieldName) => {
        const file = req.files[fieldName][0];

        const uploadPromise = new Promise((resolve, reject) => {
          const readStream = fs.createReadStream(file.path);

          const metadata = {
            uploadedBy: user_id || "anonymous",
            uploadDate: new Date(),
            fieldName: fieldName,
            originalFileName: file.originalname,
            profileId: user_id,
          };

          const uploadStream = gfs.openUploadStream(file.originalname, {
            contentType: file.mimetype,
            metadata: metadata,
          });

          readStream.pipe(uploadStream);

          uploadStream.on("error", (error) => {
            console.error(`Error uploading ${fieldName}:`, error);
            reject(error);
          });

          uploadStream.on("finish", () => {
            // Remove temp file
            fs.unlinkSync(file.path);

            // Store file ID in the result
            uploadedFiles[fieldName] = {
              fileId: uploadStream.id,
              fileName: file.originalname,
              contentType: file.mimetype,
            };

            // Add file ID to profile data
            // profileData[`${fieldName}Id`] = uploadStream.id;

            resolve();
          });
        });

        uploadPromises.push(uploadPromise);
      });
    }

    Promise.all(uploadPromises)
      .then(() => {
        // Remove file objects from profileData
        delete profileData.profileImage;
        delete profileData.coverImage;

        // Here you would typically save the profile data to your database
        // Example: await db.collection('profiles').updateOne({ userId: user_id }, { $set: profileData })

        res.json({
          success: true,
          message: "Profile updated successfully",
          profile: profileData,
          fileUploads: uploadedFiles,
        });
      })
      .catch((error) => {
        console.error("Error in profile upload process:", error);
        res.status(500).json({
          success: false,
          message: "Error updating profile",
          error: error.message,
        });
      });
  }
);

// List all files - no change needed as this doesn't receive file data
router.get("/files", async (req, res) => {
  try {
    const gfs = getGFS();
    const cursor = gfs.find();
    const files = await cursor.toArray();

    if (!files || files.length === 0) {
      return res.status(404).send({ message: "No files found" });
    }

    const filesInfo = files.map((file) => ({
      id: file._id,
      filename: file.filename,
      contentType: file.contentType,
      size: file.length,
      uploadDate: file.uploadDate,
      metadata: file.metadata,
    }));

    res.send(filesInfo);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving files", error: error.message });
  }
});

// Get files by profileId - to find files associated with a specific profile
router.get("/files/profile/:profileId", async (req, res) => {
  try {
    const gfs = getGFS();
    const profileId = req.params.profileId;
    const cursor = gfs.find({ "metadata.profileId": profileId });
    const files = await cursor.toArray();

    if (!files || files.length === 0) {
      return res
        .status(404)
        .send({ message: "No files found for this profile" });
    }

    const filesInfo = files.map((file) => ({
      id: file._id,
      filename: file.filename,
      contentType: file.contentType,
      size: file.length,
      uploadDate: file.uploadDate,
      metadata: file.metadata,
      fieldName: file.metadata.fieldName,
    }));

    res.send(filesInfo);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving profile files",
      error: error.message,
    });
  }
});

// Get file info by ID - no change needed for receiving files
router.get("/files/info/:fileId", async (req, res) => {
  try {
    const gfs = getGFS();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const cursor = gfs.find({ _id: fileId });
    const files = await cursor.toArray();

    if (!files || files.length === 0) {
      return res.status(404).send({ message: "File not found" });
    }

    const fileInfo = {
      id: files[0]._id,
      filename: files[0].filename,
      contentType: files[0].contentType,
      size: files[0].length,
      uploadDate: files[0].uploadDate,
      metadata: files[0].metadata,
    };

    res.send(fileInfo);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error retrieving file info", error: error.message });
  }
});

// Download/view file by ID - no change needed for receiving files
router.get("/files/:fileId", async (req, res) => {
  try {
    const gfs = getGFS();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    // Check if file exists
    const cursor = gfs.find({ _id: fileId });
    const files = await cursor.toArray();

    if (!files || files.length === 0) {
      return res.status(404).send({ message: "File not found" });
    }

    // Set proper content type
    res.set("Content-Type", files[0].contentType);

    // Set content disposition based on request query
    if (req.query.download === "true") {
      res.set(
        "Content-Disposition",
        `attachment; filename="${files[0].filename}"`
      );
    }

    // Create read stream and pipe to response
    const readStream = gfs.openDownloadStream(fileId);
    readStream.pipe(res);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error downloading file", error: error.message });
  }
});

// Replace a file - allows updating a file via form data
router.put("/files/:fileId", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const gfs = getGFS();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    // First, check if the file exists
    const cursor = gfs.find({ _id: fileId });
    const files = await cursor.toArray();

    if (!files || files.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(404).send({ message: "File not found" });
    }

    // Delete the old file
    await gfs.delete(fileId);

    // Get original metadata
    const originalMetadata = files[0].metadata || {};

    // Create a readable stream from the uploaded file
    const readStream = fs.createReadStream(req.file.path);

    // Set up updated metadata
    const metadata = {
      ...originalMetadata,
      uploadedBy:
        req.body.uploadedBy || originalMetadata.uploadedBy || "anonymous",
      uploadDate: new Date(),
      description: req.body.description || originalMetadata.description || "",
      originalFileName: req.file.originalname,
      fieldName: req.file.fieldname,
      isUpdated: true,
      previousFileId: fileId,
    };

    // Create a writable stream to GridFS
    const uploadStream = gfs.openUploadStream(req.file.originalname, {
      contentType: req.file.mimetype,
      metadata: metadata,
    });

    // Pipe the readable stream to the GridFS writable stream
    readStream.pipe(uploadStream);

    uploadStream.on("error", (error) => {
      console.error("File replacement error:", error);
      return res.status(500).send({ message: "Error replacing file" });
    });

    uploadStream.on("finish", () => {
      // Remove temp file
      fs.unlinkSync(req.file.path);
      res.send({
        success: true,
        message: "File replaced successfully",
        previousFileId: fileId,
        newFileId: uploadStream.id,
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        metadata: metadata,
      });
    });
  } catch (error) {
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res
      .status(500)
      .send({ message: "Error replacing file", error: error.message });
  }
});

// Delete file - no change needed for receiving files
router.delete("/files/:fileId", async (req, res) => {
  try {
    const gfs = getGFS();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    await gfs.delete(fileId);
    res.send({ message: "File deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error deleting file", error: error.message });
  }
});

router.get("/media/:id", async (req, res) => {
  try {
    console.log("Request received for image:", req.params.id);

    if (mongoose.connection.readyState !== 1) {
      return res.status(500).send("Database not connected");
    }

    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const bucket = getGFS();

    // First check if file exists in the files collection
    const file = await mongoose.connection.db
      .collection("uploads.files")
      .findOne({ _id: fileId });

    if (!file) {
      return res.status(404).send("File not found");
    }

    // Set correct Content-Type from the files collection
    res.set("Content-Type", file.contentType || "application/octet-stream");

    // Stream file
    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on("error", (err) => {
      console.error("GridFS error:", err);
      res.status(500).send("Error retrieving file");
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send("Server error");
  }
});
module.exports = router;
