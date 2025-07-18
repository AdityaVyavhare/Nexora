import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import timeAgo from "../../utils/timeago";
import { Link } from "react-router-dom";
const PostHeader = ({ userId, timePosted }) => {
  const [author, setAuthor] = useState("");
  const [fileId, setFileId] = useState("");

  const fecthPostUserDetail = async () => {
    try {
      const response = await fetch(
        `https://nexora-q1aa.onrender.com//users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const jsondata = await response.json();
      const data = jsondata.result;
      if (data) {
        setAuthor(data.profile.displayName);
        setFileId(data.profile.profileImage.fileId);
      }
    } catch (err) {
      console.log(err);
      console.log(err.message);
      return null;
    }
  };
  useEffect(() => {
    fecthPostUserDetail();
  }, []);
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          {/* <span className="font-medium text-blue-600">{author.charAt(0)}</span> */}
          <img
            className="rounded-3xl"
            src={`https://nexora-q1aa.onrender.com//api/media/${fileId}`}
          />
        </div>
        <div>
          <Link to="/userprofile" state={{ userId }}>
            <div className="font-medium">{author}</div>
          </Link>
          <div className="text-xs text-gray-500">{timeAgo(timePosted)}</div>
        </div>
      </div>
      <button className="text-gray-500 hover:text-gray-700">
        <MoreHorizontal size={20} />
      </button>
    </div>
  );
};

export default PostHeader;
