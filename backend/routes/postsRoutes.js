const express = require("express");
const router = express.Router();
const db = require("../database/manageposts");
const { ObjectId } = require("mongodb");

// Post CRUD operations
router.post("/add", async (req, res) => {
  try {
    const result = await db.addPost(req.body);
    if (result?.acknowledged) {
      res.status(201).json({ message: "Post Added Successfully", result });
    } else {
      res.status(500).json({ message: "Failed to Add Post" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const result = await db.fetchallposts();
    if (result) {
      res.status(200).json({ message: "Posts Fetched Successfully", result });
    } else {
      res.status(500).json({ message: "Failed to Fetch Posts" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/like", async (req, res) => {
  try {
    const result = await db.manageLikes(req.body);
    if (result) {
      res.status(200).json({ message: "Like Updated Successfully", result });
    } else {
      res.status(500).json({ message: "Failed to update like" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/comment/:id", async (req, res) => {
  try {
    const result = await db.getComment(req.params.id);
    if (result) {
      res
        .status(200)
        .json({ message: "Comments Fetched Successfully", result });
    } else {
      res.status(500).json({ message: "Failed to Fetch Comments" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/comment", async (req, res) => {
  try {
    const result = await db.addComment(req.body);
    if (result) {
      res.status(200).json({ message: "Comment Added Successfully", result });
    } else {
      res.status(500).json({ message: "Failed to Add Comment" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/shares/:id", async (req, res) => {
  try {
    const result = await db.incrementShare(req.params.id);
    if (result) {
      res
        .status(200)
        .json({ message: "Share Incremented Successfully", result });
    } else {
      res.status(500).json({ message: "Failed to Increment Share" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch("/save/:id", async (req, res) => {
  try {
    const result = await db.isSaved(req.params.id, req.body);
    if (result) {
      res.status(200).json({ message: "Saved Changes Successfully", result });
    } else {
      res.status(500).json({ message: "Failed to Change Save" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analytics endpoints
router.get("/analytics", async (req, res) => {
  try {
    const analytics = await db.getPostsAnalytics();
    const posts = await db.fetchallposts();

    res.status(200).json({
      message: "Analytics Fetched Successfully",
      result: {
        analytics: analytics,
        posts: posts,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/analytics/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const analytics = await db.getUserPostsAnalytics(userId);

    // Get user-specific posts
    const allPosts = await db.fetchallposts();
    const userPosts = allPosts.filter((post) => post.user_id === userId);

    res.status(200).json({
      message: "User Analytics Fetched Successfully",
      result: {
        analytics: analytics,
        posts: userPosts,
      },
    });
  } catch (error) {
    console.error("User analytics error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
