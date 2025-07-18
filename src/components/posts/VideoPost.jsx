const VideoPost = ({ media }) => {
  return (
    <div className="mt-2 rounded-lg overflow-hidden bg-gray-100">
      <div className="w-full max-h-64 flex items-center justify-center">
        <div className="text-gray-500">
          <video
            controls
            width="600"
            src={`https://nexora-q1aa.onrender.com//api/media/${media.fileId}`}
            style={{ borderRadius: "10px" }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
        {/* <div className="text-gray-500">Video Preview: {media.name}</div> */}
      </div>
      <div className="p-2 text-xs text-gray-500">
        {(media.size / 1000000).toFixed(1)} MB
      </div>
    </div>
  );
};
export default VideoPost;
