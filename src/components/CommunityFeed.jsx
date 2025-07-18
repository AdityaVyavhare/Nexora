// CommunityFeed.jsx - Main updates
import { useDispatch, useSelector } from "react-redux";
import fetchallposts from "../utils/fetchallPosts";
import Post from "./posts/Post";
import CommentPopup from "./CommentPopup";
import { useEffect, useState } from "react";
import { setPosts, toggleLike, toggleSave } from "../store/postsSlice";

const CommunityFeed = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);

  // Comment popup state
  const [commentPopupOpen, setCommentPopupOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchh = () => {
    fetchallposts().then((res) => {
      res = res.map((post, id) => {
        return { id, ...post };
      });
      dispatch(setPosts(res));
    });
  };

  // Toggle save status for a post - FIXED VERSION
  const toggleSavePost = async (postId) => {
    console.log("Toggling save for post ID:", postId);

    // Find the post by ID
    const post = posts.find((p) => p.id === postId);

    if (!post) {
      console.error("Post not found");
      return;
    }

    // Create a new status
    const newSaveStatus = !post.isSaved;

    // Update Redux state immediately for better UX
    dispatch(toggleSave({ postId }));

    try {
      const response = await fetch(
        `https://nexora-q1aa.onrender.com/posts/save/${post._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isSaved: newSaveStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Save toggle response from server:", data);

      // No need to update Redux again since we did it optimistically
    } catch (err) {
      console.error("Error toggling save:", err);

      // Revert the optimistic update on error by toggling again
      dispatch(toggleSave({ postId }));

      // Optional: Refresh all posts to ensure UI is in sync with server
      // fetchh();
    }
  };

  // Like a post
  const likePost = async (postId) => {
    const post = posts.find((p) => p.id === postId);

    const updatedPost = {
      ...post,
      isLiked: !post.isLiked,
      likes: post.isLiked ? post.likes - 1 : post.likes + 1,
    };

    dispatch(toggleLike(updatedPost)); // ✅ Dispatch updated post immediately

    try {
      const response = await fetch(
        "https://nexora-q1aa.onrender.com/posts/like",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId: post._id,
            increment: post.isLiked ? -1 : 1,
          }),
        }
      );
      const data = await response.json();
      console.log("Response from server:", data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Open comment popup
  const handleCommentClick = (post) => {
    setSelectedPost(post);
    setCommentPopupOpen(true);
    // Add overflow hidden to body to prevent background scrolling
    document.body.style.overflow = "hidden";
  };

  // Close comment popup
  const closeCommentPopup = () => {
    fetchh();
    setCommentPopupOpen(false);
    // Restore body scrolling
    document.body.style.overflow = "";
  };

  useEffect(() => {
    fetchh();
  }, [dispatch]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Community Feed</h1>

      <div className="space-y-6">
        {posts.map((post) => (
          <Post
            key={post.id}
            post={post}
            onLike={likePost}
            onToggleSave={toggleSavePost}
            onCommentClick={handleCommentClick}
            fetchh={fetchh}
          />
        ))}
      </div>

      {/* Comment popup */}
      <CommentPopup
        isOpen={commentPopupOpen}
        onClose={closeCommentPopup}
        post={selectedPost}
      />
    </div>
  );
};

export default CommunityFeed;
