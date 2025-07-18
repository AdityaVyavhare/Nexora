const FilePost = ({ media }) => {
  const fileUrl = `https://nexora-q1aa.onrender.com/api/media/${media.fileId}`;
  return (
    <div className="mt-2 p-4 rounded-lg bg-gray-100">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">{media.name}</div>
          <div className="text-xs text-gray-500">
            {(media.size / 1000000).toFixed(1)} MB
          </div>
        </div>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
        >
          View Full
        </a>
      </div>
    </div>
  );
};

export default FilePost;
