/**
 * File: config/db.js
 * Purpose: MongoDB connection and GridFS initialization
 */
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

// Connection instance
let conn = null;
// GridFS bucket instance
let gfs = null;

const connectDB = async (
  mongoURI = "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0/fileuploaddb"
) => {
  try {
    const connection = await mongoose.connect(mongoURI);

    conn = connection.connection;

    // Initialize GridFS
    gfs = new GridFSBucket(conn.db, {
      bucketName: "uploads",
    });

    console.log("MongoDB connected and GridFS initialized");
    return { conn, gfs };
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Get the GridFS instance
const getGFS = () => {
  if (!gfs) {
    throw new Error("GridFS not initialized. Call connectDB first.");
  }
  return gfs;
};

// Get the MongoDB connection
const getConnection = () => {
  if (!conn) {
    throw new Error("MongoDB not connected. Call connectDB first.");
  }
  return conn;
};

module.exports = {
  connectDB,
  getGFS,
  getConnection,
};
