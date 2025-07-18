import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

const UserProfile = () => {
  // Mock data based on the provided information
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Function to handle adding new interest
  const [newInterest, setNewInterest] = useState("");
  const location = useLocation();
  const userId = location.state.userId;

  const handleAddInterest = () => {
    if (newInterest.trim() && userData) {
      const updatedInterests = [
        ...(userData.interests || []),
        newInterest.trim(),
      ];
      setUserData({
        ...userData,
        interests: updatedInterests,
      });
      setNewInterest("");
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://nexora-q1aa.onrender.com/users/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const jsondata = await response.json();
      const data = jsondata.result;
      console.log("Fetched user data:", data); // Log the data structure

      if (data) {
        // Determine if profileImage and coverImage are at root level or within profile
        const profileImageData =
          data.profileImage || data.profile?.profileImage;
        const coverImageData = data.coverImage || data.profile?.coverImage;

        // Ensure the data structure has all required properties
        const sanitizedData = {
          _id: data._id || "Unknown",
          email: data.email || "No email provided",
          profile: {
            fullName: data.profile?.fullName || "No name provided",
            displayName: data.profile?.displayName || "User",
            bio: data.profile?.bio || "No bio available",
            location: data.profile?.location || "Not specified",
            website: data.profile?.website || "#",
            dateOfBirth: data.profile?.dateOfBirth || null,
          },
          profileImage: {
            fileName: profileImageData?.fileName || "No profile image",
            fileId: profileImageData?.fileId || null,
          },
          coverImage: {
            fileName: coverImageData?.fileName || "No cover image",
            fileId: coverImageData?.fileId || null,
          },
          interests: Array.isArray(data.interests) ? data.interests : [],
        };

        console.log("Sanitized data:", sanitizedData); // Log the sanitized data
        setUserData(sanitizedData);
      } else {
        throw new Error("No user data returned");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err.message || "Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    } else {
      console.warn("No userId available in Redux state");
      setLoading(false);
    }
  }, [userId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading user profile...
      </div>
    );
  if (error)
    return <div className="text-red-500 p-4 text-center">Error: {error}</div>;
  if (!userData)
    return (
      <div className="text-gray-500 p-4 text-center">
        No user data available
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cover Image */}
      <div className="w-full h-48 md:h-64 bg-gradient-to-r from-blue-400 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-opacity-50 bg-[rgba(0,0,0,.5)]"></div>
        {userData.coverImage?.fileId ? (
          <img
            src={`https://nexora-q1aa.onrender.com/api/media/${userData.coverImage.fileId}`}
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("Failed to load cover image:", e);
              e.target.style.display = "none";
              e.target.parentNode.classList.add(
                "bg-gradient-to-r",
                "from-blue-400",
                "to-indigo-600"
              );
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-indigo-600"></div>
        )}
      </div>

      {/* Profile Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Profile Image and Name */}
            <div className="flex flex-col sm:flex-row items-center">
              <div className="relative mb-4 sm:mb-0">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white">
                  {userData.profileImage?.fileId ? (
                    <img
                      src={`https://nexora-q1aa.onrender.com/api/media/${userData.profileImage.fileId}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Failed to load profile image:", e);
                        e.target.style.display = "none";
                        e.target.parentNode.classList.add(
                          "bg-gray-200",
                          "flex",
                          "items-center",
                          "justify-center"
                        );
                        const svg = document.createElementNS(
                          "http://www.w3.org/2000/svg",
                          "svg"
                        );
                        svg.setAttribute("class", "h-12 w-12 text-gray-400");
                        svg.setAttribute("fill", "none");
                        svg.setAttribute("viewBox", "0 0 24 24");
                        svg.setAttribute("stroke", "currentColor");
                        const path = document.createElementNS(
                          "http://www.w3.org/2000/svg",
                          "path"
                        );
                        path.setAttribute("stroke-linecap", "round");
                        path.setAttribute("stroke-linejoin", "round");
                        path.setAttribute("stroke-width", "2");
                        path.setAttribute(
                          "d",
                          "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        );
                        svg.appendChild(path);
                        e.target.parentNode.appendChild(svg);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <div className="sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData.profile.fullName}
                </h1>
                <p className="text-indigo-600 font-medium">
                  @{userData.profile.displayName}
                </p>
                <p className="text-gray-500 mt-1">{userData.profile.bio}</p>
              </div>
              <div className="sm:ml-auto mt-4 sm:mt-0">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">User ID</h3>
                  <p className="mt-1 text-sm text-gray-900 break-all">
                    {userData._id}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Location
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {userData.profile.location}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(userData.profile.dateOfBirth)}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Website</h3>
                  {userData.profile.website &&
                  userData.profile.website !== "#" ? (
                    <a
                      href={userData.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 text-sm text-indigo-600 hover:text-indigo-500 block"
                    >
                      {userData.profile.website}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      No website provided
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Profile Image
                  </h3>
                  <p className="mt-1 text-sm text-gray-900 truncate">
                    {userData.profileImage?.fileName || "No profile image"}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    Cover Image
                  </h3>
                  <p className="mt-1 text-sm text-gray-900 truncate">
                    {userData.coverImage?.fileName || "No cover image"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interests Section */}
          <div className="border-t border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Interests
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {userData.interests && userData.interests.length > 0 ? (
                userData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No interests added yet</p>
              )}
            </div>

            {/* Add Interest */}
            <div className="mt-4 flex">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add new interest"
                className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <button
                onClick={handleAddInterest}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
