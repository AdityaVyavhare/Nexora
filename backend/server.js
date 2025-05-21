const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const db = require("./database/db");
const { connectDB } = require("./database/config/db");
const fileRoutes = require("./routes/fileRoutes");
const postsRoutes = require("./routes/postsRoutes");
const useRouter = require("./routes/users");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).json("Welcome to Nexora");
});

app.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const id = await db.create_user(req.body);
    console.log(id);
    if (id) {
      res.status(201).json({ message: "User registered successfully", id });
    } else {
      res.status(500).json({ message: "Failed to register user" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/profile", async (req, res) => {
  try {
    const result = await db.create_profile(req.body);
    if (result?.acknowledged) {
      res
        .status(201)
        .json({ message: "User Profile Saved successfully", result });
    } else {
      res.status(500).json({ message: "Failed to Saved User Profile" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/signin", async (req, res) => {
  console.log("signin", req.body);
  try {
    const response = await db.validate_user(req.body);
    if (response) {
      res.status(200).json(response);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  // res.send("sucssess");
});

connectDB()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection error:", err));

// Routes
app.use("/users", useRouter);
app.use("/posts", postsRoutes);
app.use("/api", fileRoutes);

app.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});
