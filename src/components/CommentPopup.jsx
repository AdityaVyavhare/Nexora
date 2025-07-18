import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { useSelector } from "react-redux";
import timeAgo from "../utils/timeago";

const CommentPopup = ({ isOpen, onClose, post }) => {
  if (!post) return null;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const popupRef = useRef(null);
  const textareaRef = useRef(null);
  const profile = useSelector((state) => state.profile);

  // Sample comments - in a real app, you would fetch these from an API

  const addComment = async (post_id, comment) => {
    try {
      const response = await fetch(
        "https://nexora-q1aa.onrender.com/posts/comment",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: post_id,
            comment,
          }),
        }
      );
      const data = await response.json();
      console.log("Response from server:", data);
    } catch (err) {
      console.log(err);
      console.log(err.message);
    }
  };

  const fetchCommets = async () => {
    try {
      console.log("postttid", post._id);
      const response = await fetch(
        `https://nexora-q1aa.onrender.com/posts/comment/${post._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      const commetsss = data.result.map((val, ind) => {
        return { id: ind, ...val };
      });
      commetsss.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      console.log("Response from server:", commetsss);
      return commetsss;
    } catch (err) {
      console.log(err);
      console.log(err.message);
      return [];
    }
  };

  useEffect(() => {
    const fetch = async () => {
      if (isOpen && post) {
        const sampleComments = await fetchCommets();
        setComments(sampleComments || []);

        // Focus the textarea when popup opens
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
          }
        }, 300);
      }
    };
    fetch();
  }, [isOpen, post]); // Removed comments.length

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj = {
        author: profile.displayName,
        text: newComment,
        timestamp: new Date().toISOString(),
        avatar: profile.profileImage.fileId,
      };

      await addComment(post._id, newCommentObj);
      const updatedComments = await fetchCommets();
      setComments(updatedComments || []);
      setNewComment("");
    }
  };

  return (
    <>
      {/* Backdrop overlay with decreased opacity (changed from bg-opacity-10 to bg-opacity-5) */}
      <div
        className={`fixed inset-0 bg-[rgba(0,0,0,.1)] bg-opacity-5 transition-opacity z-40 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Comment popup panel */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        ref={popupRef}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
            <div>
              <h2 className="text-lg font-semibold">
                Comments ({post.comments.length})
              </h2>
              <p className="text-sm text-gray-500 truncate">{post.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
              aria-label="Close comments"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-4">
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                        {comment.avatar && (
                          <img
                            src={`https://nexora-q1aa.onrender.com/api/media/${comment.avatar}`}
                            alt={comment.author}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-medium">{comment.author}</div>
                        <p className="text-gray-700">{comment.text}</p>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {timeAgo(comment.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-8">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <form
              onSubmit={handleSubmitComment}
              className="flex items-end space-x-2"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gray-200">
                  <img
                    src={`https://nexora-q1aa.onrender.com/api/media/${profile?.profileImage?.fileId}`}
                    alt="Current user"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div className="flex-grow">
                <textarea
                  ref={textareaRef}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full border rounded-lg p-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                  rows={2}
                />
              </div>
              <button
                type="submit"
                className={`p-2 rounded-full ${
                  newComment.trim()
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                disabled={!newComment.trim()}
                aria-label="Post comment"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommentPopup;
