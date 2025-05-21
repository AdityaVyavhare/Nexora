const PDFPost = ({ media }) => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md space-y-4">
      {/* PDF Preview */}
      {/* <div className="h-[70vh] w-full border rounded overflow-hidden">
        <iframe
          src={`http://localhost:3000/api/media/${media.fileId}`}
          className="w-full h-full"
          title="PDF Viewer"
        ></iframe>
      </div> */}

      {/* PDF File Info */}
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center">
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
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-800">
              {media.name}
            </div>
            <div className="text-xs text-gray-500">
              {(media.size / 1000000).toFixed(1)} MB
            </div>
          </div>
        </div>
        <a
          href={`http://localhost:3000/api/media/${media.fileId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-sm rounded-md transition"
        >
          View Full
        </a>
      </div>
    </div>
  );
};

export default PDFPost;
