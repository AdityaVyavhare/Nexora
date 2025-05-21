// Post.jsx - FIXED
import PostHeader from "./PostHeader";
import MediaContent from "./MediaContent";
import PostInteractions from "./PostInteractions";
import PostStats from "./PostStats";

const Post = ({ post, onCommentClick, onLike, onToggleSave, fetchh }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <PostHeader userId={post.user_id} timePosted={post.timePosted} />

      <div className="mt-3">
        <h2 className="text-lg font-semibold">{post.title}</h2>
        <p className="mt-1 text-gray-700">{post.text}</p>

        <MediaContent type={post.type} media={post.media} text={post.text} />
      </div>

      <PostStats
        likes={post.likes}
        comments={post.comments}
        shares={post.shares}
      />
      <PostInteractions
        post={post}
        onLike={onLike}
        onToggleSave={onToggleSave}
        onCommentClick={onCommentClick}
        fetchh={fetchh}
      />
    </div>
  );
};

export default Post;
