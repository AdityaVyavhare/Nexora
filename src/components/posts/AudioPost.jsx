const AudioPost = ({ media }) => {
  return (
    <div className="mt-4 p-4 rounded-lg bg-gray-100 shadow-sm w-full max-w-full overflow-hidden">
      {/* File Info Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-800 truncate">
            {media.name}
          </div>
          <div className="text-xs text-gray-500">
            {(media.size / 1000000).toFixed(1)} MB
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <div className="mt-2">
        <audio
          controls
          className="w-full rounded-md outline-none"
          style={{ display: "block" }}
        >
          <source
            src={`https://nexora-q1aa.onrender.com//api/media/${media.fileId}`}
            type={media.type}
          />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default AudioPost;
