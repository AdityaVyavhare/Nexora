// Add these functions to your database/manageposts.js file

const { MongoClient } = require("mongodb");

async function getPostsAnalytics() {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017/");

    const db = await client.db("nosql_project");
    const collection = db.collection("posts");

    // Get overall stats
    const overallStats = await collection
      .aggregate([
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalLikes: { $sum: "$likes" },
            totalShares: { $sum: "$shares" },
            totalComments: { $sum: { $size: { $ifNull: ["$comments", []] } } },
          },
        },
        {
          $project: {
            _id: 0,
            totalPosts: 1,
            totalLikes: 1,
            totalShares: 1,
            totalComments: 1,
            engagementRate: {
              $multiply: [
                {
                  $divide: [
                    { $add: ["$totalLikes", "$totalComments", "$totalShares"] },
                    { $cond: [{ $eq: ["$totalPosts", 0] }, 1, "$totalPosts"] },
                  ],
                },
                100,
              ],
            },
          },
        },
      ])
      .toArray();

    // Get daily stats
    const postsByDay = await collection
      .aggregate([
        {
          $addFields: {
            postDate: {
              $dateFromString: {
                dateString: "$timePosted",
                onError: "$$NOW",
              },
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$postDate" } },
            count: { $sum: 1 },
            likes: { $sum: "$likes" },
            shares: { $sum: "$shares" },
            comments: { $sum: { $size: { $ifNull: ["$comments", []] } } },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
            likes: 1,
            shares: 1,
            comments: 1,
          },
        },
        { $sort: { date: 1 } },
      ])
      .toArray();

    return {
      ...(overallStats[0] || {
        totalPosts: 0,
        totalLikes: 0,
        totalShares: 0,
        totalComments: 0,
        engagementRate: 0,
      }),
      postsByDay,
    };
  } catch (error) {
    console.error("Error in getPostsAnalytics:", error);
    throw error;
  } finally {
    await client.close();
  }
}

async function getUserPostsAnalytics(userId) {
  try {
    const client = await MongoClient.connect("mongodb://localhost:27017/");

    const db = await client.db("nosql_project");
    const collection = db.collection("posts");

    // Get user-specific stats
    const userStats = await collection
      .aggregate([
        { $match: { user_id: userId } },
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalLikes: { $sum: "$likes" },
            totalShares: { $sum: "$shares" },
            totalComments: { $sum: { $size: { $ifNull: ["$comments", []] } } },
          },
        },
        {
          $project: {
            _id: 0,
            totalPosts: 1,
            totalLikes: 1,
            totalShares: 1,
            totalComments: 1,
            engagementRate: {
              $multiply: [
                {
                  $divide: [
                    { $add: ["$totalLikes", "$totalComments", "$totalShares"] },
                    { $cond: [{ $eq: ["$totalPosts", 0] }, 1, "$totalPosts"] },
                  ],
                },
                100,
              ],
            },
          },
        },
      ])
      .toArray();

    // Get user's daily stats
    const postsByDay = await collection
      .aggregate([
        { $match: { user_id: userId } },
        {
          $addFields: {
            postDate: {
              $dateFromString: {
                dateString: "$timePosted",
                onError: "$$NOW",
              },
            },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$postDate" } },
            count: { $sum: 1 },
            likes: { $sum: "$likes" },
            shares: { $sum: "$shares" },
            comments: { $sum: { $size: { $ifNull: ["$comments", []] } } },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            count: 1,
            likes: 1,
            shares: 1,
            comments: 1,
          },
        },
        { $sort: { date: 1 } },
      ])
      .toArray();

    // Get top performing posts
    const topPosts = await collection
      .aggregate([
        { $match: { user_id: userId } },
        {
          $addFields: {
            totalEngagement: {
              $add: [
                "$likes",
                { $size: { $ifNull: ["$comments", []] } },
                "$shares",
              ],
            },
          },
        },
        { $sort: { totalEngagement: -1 } },
        { $limit: 5 },
      ])
      .toArray();

    return {
      ...(userStats[0] || {
        totalPosts: 0,
        totalLikes: 0,
        totalShares: 0,
        totalComments: 0,
        engagementRate: 0,
      }),
      postsByDay,
      topPosts,
    };
  } catch (error) {
    console.error("Error in getUserPostsAnalytics:", error);
    throw error;
  } finally {
    await client.close();
  }
}

module.exports = {
  // Keep your existing exports
  getPostsAnalytics,
  getUserPostsAnalytics,
};
