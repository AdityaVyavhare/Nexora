const ImagePost = ({ media }) => {
  console.log(media);
  return (
    <div className="mt-2 rounded-lg overflow-hidden">
      <img
        src={`https://nexora-q1aa.onrender.com//api/media/${media.fileId}`}
        alt="Post image"
        className="w-full h-64 object-cover"
      />
      <div className="text-xs text-gray-500 mt-1">{media.name}</div>
    </div>
  );
};

export default ImagePost;
