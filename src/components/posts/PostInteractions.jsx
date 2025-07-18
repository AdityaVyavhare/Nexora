// PostInteractions.jsx - FIXED
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";

const PostInteractions = ({
  post,
  onLike,
  onToggleSave,
  onCommentClick,
  fetchh,
}) => {
  const share = async (id) => {
    try {
      const response = await fetch(
        `https://nexora-q1aa.onrender.com/posts/shares/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Response from server:", data);
      fetchh();
    } catch (err) {
      console.log(err);
      console.log(err.message);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
      <button
        onClick={() => onLike(post.id)}
        className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
      >
        <Heart
          size={18}
          className={post.isLiked ? "fill-blue-600 text-blue-600" : ""}
        />
        <span>Like</span>
      </button>

      <button
        className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
        onClick={() => onCommentClick(post)}
      >
        <MessageCircle size={18} />
        <span>Comment</span>
      </button>

      <button
        className="flex items-center space-x-1 text-gray-500 hover:text-blue-600"
        onClick={() => share(post._id)}
      >
        <Share2 size={18} />
        <span>Share</span>
      </button>

      <button
        onClick={() => onToggleSave(post.id)}
        className={`flex items-center space-x-1 ${
          post.isSaved ? "text-blue-600" : "text-gray-500 hover:text-blue-600"
        }`}
      >
        {post.isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        <span>{post.isSaved ? "Saved" : "Save"}</span>
      </button>
    </div>
  );
};

export default PostInteractions;
