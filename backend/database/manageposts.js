const { MongoClient, ObjectId } = require("mongodb");

const fetchallposts = async () => {
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );
  try {
    const posts = await client
      .db("nosql_project")
      .collection("posts")
      .find()
      .toArray();

    posts.sort((a, b) => new Date(b.timePosted) - new Date(a.timePosted));
    return posts;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  } finally {
    await client.close();
  }
};
const addPost = async (body) => {
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );
  try {
    const result = await client
      .db("nosql_project")
      .collection("posts")
      .insertOne(body.post);
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  } finally {
    await client.close();
  }
};

const manageLikes = async (body) => {
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );
  const db = client.db("nosql_project");

  try {
    const result = await db.collection("posts").updateOne(
      { _id: new ObjectId(body.postId) },
      {
        $inc: { likes: body.increment },
        $set: { isLiked: body.increment > 0 },
      }
    );

    console.log("Update result:", result);
    return result;
  } catch (err) {
    console.error("Error updating like count:", err);
  } finally {
    await client.close();
  }
};

const getComment = async (id) => {
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );
  try {
    const post = await client
      .db("nosql_project")
      .collection("posts")
      .findOne({ _id: new ObjectId(id) });
    const comments = post.comments;
    return comments;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  } finally {
    await client.close();
  }
};

const addComment = async (body) => {
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );
  try {
    const result = await client
      .db("nosql_project")
      .collection("posts")
      .updateOne(
        {
          _id: new ObjectId(body.id),
        },
        {
          $push: {
            comments: body.comment, // Add this element to the array
          },
        }
      );

    return result;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  } finally {
    await client.close();
  }
};
const incrementShare = async (id) => {
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );
  try {
    const result = await client
      .db("nosql_project")
      .collection("posts")
      .updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $inc: {
            shares: 1, // Add this element to the array
          },
        }
      );

    return result;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  } finally {
    await client.close();
  }
};
const isSaved = async (id, body) => {
  console.log(id, body);
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );
  try {
    const result = await client
      .db("nosql_project")
      .collection("posts")
      .updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: { isSaved: body.isSaved },
        }
      );

    return result;
  } catch (err) {
    console.log(err);
    console.log(err.message);
  } finally {
    await client.close();
  }
};

async function getPostsAnalytics() {
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );

  try {
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
  const client = await MongoClient.connect(
    "mongodb+srv://aditya:royal@cluster0.pfvdu.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
  );

  try {
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
  addPost,
  fetchallposts,
  manageLikes,
  getComment,
  addComment,
  incrementShare,
  isSaved,
  getPostsAnalytics,
  getUserPostsAnalytics,
};
