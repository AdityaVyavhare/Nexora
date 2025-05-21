import React, { useState, useRef } from "react";
import {
  FileText,
  Image,
  Film,
  Music,
  File,
  X,
  Upload,
  Send,
  Paperclip,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../store/postsSlice";
import { useNavigate } from "react-router-dom";

const CreatePostForm = () => {
  const [postTitle, setPostTitle] = useState("");
  const [postText, setPostText] = useState("");
  const [postType, setPostType] = useState("text");
  const [mediaFile, setMediaFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const displayName = useSelector((state) => state.profile.displayName);
  const userId = useSelector((state) => state.userId);
  const dispatch = useDispatch();
  const navigaton = useNavigate();

  // if (!userId) {
  //   navigaton("/signin");
  // }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setMediaFile(file);

    // Create preview URL for images and videos
    if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const clearMedia = () => {
    setMediaFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData for submission
    try {
      const formData = new FormData();

      if (mediaFile) {
        console.log(mediaFile);
        formData.append("file", mediaFile);
      }

      const result = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData,
      });

      const res = await result.json();

      const finalpost = {
        user_id: userId,
        title: postTitle,
        text: postText,
        type: postType,
        media: mediaFile
          ? {
              name: mediaFile.name,
              type: mediaFile.type,
              size: mediaFile.size,
              fileId: res.fileId,
            }
          : null,
        likes: 0,
        comments: [],
        shares: 0,
        timePosted: new Date().toISOString(),
        isLiked: false,
        isSaved: false,
      };

      dispatch(addPost(finalpost));
      console.log(userId);
      const response = await fetch("http://localhost:3000/posts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post: finalpost,
        }),
      });

      const data = await response.json();
      console.log("Response from server:", data);
      // Here you would typically send the formData to your API
      // console.log("Post data:", {
      //   title: postTitle,
      //   text: postText,
      //   type: postType,
      //   media: mediaFile
      //     ? {
      //         name: mediaFile.name,
      //         type: mediaFile.type,
      //         size: mediaFile.size,
      //       }
      //     : null,
      // });

      // Reset form

      setPostTitle("");
      setPostText("");
      setPostType("text");
      clearMedia();
      navigaton("/");
    } catch (err) {
      console.log(err);
      console.log(err.message);
      alert(err.message);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Define accepted file types based on post type
  const getAcceptedFileTypes = () => {
    switch (postType) {
      case "image":
        return "image/*";
      case "video":
        return "video/*";
      case "audio":
        return "audio/*";
      case "pdf":
        return "application/pdf";
      default:
        return "*/*";
    }
  };

  // Content type icons and labels
  const contentTypes = [
    { id: "text", icon: <FileText className="w-5 h-5" />, label: "Text" },
    { id: "image", icon: <Image className="w-5 h-5" />, label: "Image" },
    { id: "video", icon: <Film className="w-5 h-5" />, label: "Video" },
    { id: "audio", icon: <Music className="w-5 h-5" />, label: "Audio" },
    { id: "pdf", icon: <File className="w-5 h-5" />, label: "PDF" },
    { id: "file", icon: <Paperclip className="w-5 h-5" />, label: "File" },
  ];

  return (
    // Container div for centering - uses Flexbox for perfect centering

    <div className="flex items-center justify-center min-h-screen w-full bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-2xl w-full">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Create a Post</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Post Title Input */}
          <div className="px-4 pt-4">
            <input
              type="text"
              className="w-full border border-gray-200 rounded-lg p-3 mb-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              placeholder="Post Title"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              required
            />
          </div>

          {/* Post Content Input */}
          <div className="px-4 pb-2">
            <textarea
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none min-h-24 resize-y"
              placeholder="What would you like to share with the community?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              required
            />

            {/* Media Preview */}
            {mediaFile && (
              <div className="mt-3 relative">
                <div className="bg-gray-100 rounded-lg p-3 pr-10">
                  <button
                    type="button"
                    onClick={clearMedia}
                    className="absolute top-2 right-2 p-1 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>

                  {previewUrl && postType === "image" ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-64 rounded object-contain mx-auto"
                    />
                  ) : previewUrl && postType === "video" ? (
                    <video
                      src={previewUrl}
                      controls
                      className="max-h-64 w-full rounded"
                    />
                  ) : (
                    <div className="flex items-center gap-3 py-2">
                      <div className="bg-gray-200 p-2 rounded">
                        {postType === "audio" ? (
                          <Music className="w-6 h-6 text-gray-600" />
                        ) : postType === "pdf" ? (
                          <File className="w-6 h-6 text-red-500" />
                        ) : (
                          <File className="w-6 h-6 text-gray-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {mediaFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(mediaFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )}

                  {postType === "audio" && mediaFile && (
                    <audio controls className="mt-2 w-full">
                      <source
                        src={URL.createObjectURL(mediaFile)}
                        type={mediaFile.type}
                      />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Post Type Selection */}
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setPostType(type.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                    postType === type.id
                      ? "bg-indigo-100 text-indigo-600 border border-indigo-200"
                      : "text-gray-600 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  {React.cloneElement(type.icon, {
                    className: `w-4 h-4 ${
                      postType === type.id ? "text-indigo-600" : "text-gray-500"
                    }`,
                  })}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={getAcceptedFileTypes()}
            className="hidden"
          />

          {/* Form Actions */}
          <div className="p-4 flex items-center justify-between border-t border-gray-100">
            <button
              type="button"
              onClick={triggerFileInput}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              disabled={postType === "text"}
            >
              <Upload className="w-5 h-5" />
              <span>Add {postType !== "text" ? postType : "file"}</span>
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
            >
              <Send className="w-4 h-4" />
              <span>Post</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;
