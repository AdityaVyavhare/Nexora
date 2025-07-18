import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  User,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";

const PostAnalyticsDashboard = () => {
  const [postsData, setPostsData] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    engagementRate: 0,
    postsByDay: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("user"); // 'overall' or 'user'
  const [inputUserId, setInputUserId] = useState("");
  const [activeUserId, setActiveUserId] = useState("");
  const currentUserId = useSelector((state) => state.userId);

  useEffect(() => {
    // Set initial user ID from Redux if available
    if (currentUserId) {
      setInputUserId(currentUserId);
    }

    // Fetch initial data
    fetchAnalytics();
  }, [currentUserId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let url = "https://nexora-q1aa.onrender.com//posts/analytics";

      // Use user-specific endpoint when in user tab and we have an active user ID
      if (activeTab === "user" && activeUserId) {
        url = `https://nexora-q1aa.onrender.com//posts/analytics/user/${activeUserId}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();

      if (data.message && data.message.includes("Successfully")) {
        setPostsData(data.result.posts || []);
        setAnalytics(
          data.result.analytics || {
            totalPosts: 0,
            totalLikes: 0,
            totalComments: 0,
            totalShares: 0,
            engagementRate: 0,
            postsByDay: [],
          }
        );
      } else {
        throw new Error(data.message || "Unknown error occurred");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "overall") {
      // Clear active user ID when switching to overall view
      setActiveUserId("");
      fetchAnalytics();
    } else if (tab === "user") {
      // If switching to user tab and we have current user from Redux
      if (currentUserId) {
        setInputUserId(currentUserId);
        setActiveUserId(currentUserId);
        fetchAnalytics();
      }
    }
  };

  const handleUserIdChange = (e) => {
    setInputUserId(e.target.value);
  };

  const handleViewUser = () => {
    // Update the active user ID and fetch data
    setActiveUserId(inputUserId);
    fetchAnalytics();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="text-lg text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full p-6 pt-25 bg-white rounded-lg shadow-lg ">
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200 sticky top-15 bg-white">
        <div className="flex flex-wrap -mb-px">
          <button
            onClick={() => handleTabChange("overall")}
            className={`inline-flex items-center px-4 py-3 mr-4 text-sm font-medium ${
              activeTab === "overall"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <User className="w-5 h-5 mr-2" />
            User Dashboard
          </button>

          <button
            onClick={() => handleTabChange("user")}
            className={`inline-flex items-center px-4 py-3 text-sm font-medium ${
              activeTab === "user"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <Users className="w-5 h-5 mr-2" />
            OverAll Dashboard
          </button>
        </div>
      </div>

      {/* Dashboard Title and Controls */}
      <div className="flex flex-col mb-6 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
          {activeTab === "user" && activeUserId
            ? `User Dashboard: ${activeUserId}`
            : "Overall Analytics Dashboard"}
        </h1>

        {/* User ID Input (only visible in user tab) */}
        {activeTab === "user" && (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputUserId}
              onChange={handleUserIdChange}
              placeholder="Enter User ID"
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleViewUser}
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View User
            </button>
            {currentUserId && (
              <button
                onClick={() => {
                  setInputUserId(currentUserId);
                  setActiveUserId(currentUserId);
                  fetchAnalytics();
                }}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                View My Data
              </button>
            )}
          </div>
        )}
      </div>

      {/* Dashboard Type Indicator */}
      <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center">
          {activeTab === "overall" ? (
            <>
              <Users className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-gray-700">Viewing data for all users</span>
            </>
          ) : (
            <>
              <User className="w-5 h-5 text-blue-500 mr-2" />
              <span className="text-gray-700">
                Viewing data for user: <strong>{activeUserId}</strong>
                {activeUserId === currentUserId && " (You)"}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Posts"
          value={analytics.totalPosts}
          icon={<Calendar className="w-6 h-6 text-blue-500" />}
          color="blue"
        />
        <SummaryCard
          title="Total Likes"
          value={analytics.totalLikes}
          icon={<Heart className="w-6 h-6 text-red-500" />}
          color="red"
        />
        <SummaryCard
          title="Total Comments"
          value={analytics.totalComments}
          icon={<MessageSquare className="w-6 h-6 text-green-500" />}
          color="green"
        />
        <SummaryCard
          title="Total Shares"
          value={analytics.totalShares}
          icon={<Share2 className="w-6 h-6 text-purple-500" />}
          color="purple"
        />
      </div>

      {/* Engagement Rate and Chart */}
      <div className="mb-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Engagement Rate Card */}
        <div className="lg:col-span-1">
          <div className="h-full p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white flex flex-col justify-center">
            <h3 className="text-lg font-medium opacity-90 mb-2">
              Engagement Rate
            </h3>
            <div className="text-4xl font-bold mb-2">
              {analytics.engagementRate?.toFixed(2)}%
            </div>
            <p className="text-sm opacity-80">Average engagement per post</p>
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="lg:col-span-3 p-4 bg-gray-50 rounded-lg">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">
            Post Engagement Over Time
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.postsByDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="likes" fill="#ef4444" name="Likes" />
                <Bar dataKey="comments" fill="#22c55e" name="Comments" />
                <Bar dataKey="shares" fill="#8b5cf6" name="Shares" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Posts Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <h2 className="p-4 text-xl font-semibold text-gray-700 bg-gray-50 flex justify-between items-center">
          <span>Recent Posts</span>
          <span className="text-sm text-gray-500">
            Showing {Math.min(5, postsData.length)} of {postsData.length} posts
          </span>
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left text-sm font-medium text-gray-600">
                  Title
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">
                  User
                </th>
                <th className="p-3 text-left text-sm font-medium text-gray-600">
                  Date
                </th>
                <th className="p-3 text-center text-sm font-medium text-gray-600">
                  Likes
                </th>
                <th className="p-3 text-center text-sm font-medium text-gray-600">
                  Comments
                </th>
                <th className="p-3 text-center text-sm font-medium text-gray-600">
                  Shares
                </th>
                <th className="p-3 text-center text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {postsData.slice(0, 5).map((post) => (
                <tr
                  key={post._id}
                  className="border-t border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-3 text-sm text-gray-800">{post.title}</td>
                  <td className="p-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.user_id}
                      {post.user_id === currentUserId && (
                        <span className="ml-1 text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600">
                    {new Date(post.timePosted).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-sm text-center text-gray-600">
                    <div className="flex items-center justify-center">
                      <Heart
                        className="w-4 h-4 mr-1 text-red-500"
                        fill={post.isLiked ? "#ef4444" : "none"}
                      />
                      {post.likes}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-center text-gray-600">
                    <div className="flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 mr-1 text-green-500" />
                      {post.comments?.length || 0}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-center text-gray-600">
                    <div className="flex items-center justify-center">
                      <Share2 className="w-4 h-4 mr-1 text-purple-500" />
                      {post.shares}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-center">
                    <div className="flex items-center justify-center">
                      <Bookmark
                        className="w-4 h-4 mr-1 text-blue-500"
                        fill={post.isSaved ? "#3b82f6" : "none"}
                      />
                      <span
                        className={
                          post.isSaved ? "text-blue-600" : "text-gray-600"
                        }
                      >
                        {post.isSaved ? "Saved" : "Not saved"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
              {postsData.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No posts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper component for summary cards
const SummaryCard = ({ title, value, icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    red: "bg-red-50 border-red-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
  };

  return (
    <div
      className={`p-4 rounded-lg border ${colorClasses[color]} flex items-center`}
    >
      <div className="mr-4">{icon}</div>
      <div>
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <p className="text-2xl font-bold text-gray-800">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default PostAnalyticsDashboard;
