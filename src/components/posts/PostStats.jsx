const PostStats = ({ likes, comments, shares }) => {
  return (
    <div className="mt-3 text-sm text-gray-500 flex items-center">
      <span>{likes} likes</span>
      <span className="mx-2">•</span>
      <span>{comments.length} comments</span>
      <span className="mx-2">•</span>
      <span>{shares} shares</span>
    </div>
  );
};
export default PostStats;
