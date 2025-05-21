const express = require("express");
const router = express.Router();
const db = require("../database/db");
router.get("/:id", async (req, res) => {
  try {
    const result = await db.get_user(req.params.id);
    if (result) {
      res
        .status(201)
        .json({ message: "user Details Fetched Successfully", result });
    } else {
      res.status(500).json({ message: "Failed to User Details" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
