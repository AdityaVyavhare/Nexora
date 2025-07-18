import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProfile } from "../store/userProfileSlice";
import { useSelector } from "react-redux";
const ProfileEditor = () => {
  const [profile, setProfile] = useState({
    fullName: "",
    displayName: "",
    bio: "",
    location: "",
    website: "",
    dateOfBirth: "",
    profileImage: null,
    coverImage: null,
    interests: [],
    newInterest: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewProfileImage, setPreviewProfileImage] = useState(null);
  const [previewCoverImage, setPreviewCoverImage] = useState(null);
  const navigation = useNavigate();
  const userId = useSelector((state) => state.userId);

  const dispatch = useDispatch();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setProfile({
        ...profile,
        [name]: files[0],
      });

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        if (name === "profileImage") {
          setPreviewProfileImage(e.target.result);
        } else if (name === "coverImage") {
          setPreviewCoverImage(e.target.result);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const addInterest = () => {
    if (
      profile.newInterest.trim() &&
      !profile.interests.includes(profile.newInterest.trim())
    ) {
      setProfile({
        ...profile,
        interests: [...profile.interests, profile.newInterest.trim()],
        newInterest: "",
      });
    }
  };

  const removeInterest = (interest) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter((item) => item !== interest),
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!profile.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!profile.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

    if (profile.bio.length > 250) {
      newErrors.bio = "Bio must be less than 250 characters";
    }

    // Simple website URL validation
    if (
      profile.website &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(
        profile.website
      )
    ) {
      newErrors.website = "Please enter a valid URL";
    }

    return newErrors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);

      try {
        const formData = new FormData();
        formData.append("profileImage", profile.profileImage);
        formData.append("coverImage", profile.coverImage);

        // Add text fields
        formData.append("user_id", userId);
        formData.append("name", profile.name);
        formData.append("bio", profile.bio);
        formData.append("location", profile.location);
        formData.append("interests", JSON.stringify(profile.interests || []));

        const result = await fetch(
          "https://nexora-q1aa.onrender.com//api/profile",
          {
            method: "POST",
            body: formData,
          }
        );

        const res = await result.json();
        console.log("Uploaded Profile Images:", res);

        const userProfile = {
          ...profile,
          coverImage: res.fileUploads.coverImage,
          profileImage: res.fileUploads.profileImage,
        };

        dispatch(addProfile(userProfile));

        const response = await fetch(
          "https://nexora-q1aa.onrender.com//profile",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              profile: userProfile,
            }),
          }
        );

        const data = await response.json();
        console.log("Response from server:", data);

        setTimeout(() => {
          setIsSubmitting(false);
          navigation("/");
        }, 1500);
      } catch (error) {
        console.error("Error:", error);
        setIsSubmitting(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="relative h-48 bg-blue-600">
          {previewCoverImage ? (
            <img
              src={previewCoverImage}
              alt="Cover preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-500">
              <span className="text-white">No cover image</span>
            </div>
          )}
          <label className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <input
              type="file"
              name="coverImage"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div className="relative px-6 pb-6">
          <div className="absolute -top-12 left-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full border-4 border-white overflow-hidden">
              {previewProfileImage ? (
                <img
                  src={previewProfileImage}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="h-full w-full text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <input
                type="file"
                name="profileImage"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <h2 className="text-2xl font-bold text-transparent mb-6">
            Edit Profile
          </h2>
          <div className="mt-16">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleChange}
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.displayName ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.displayName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.displayName}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    This is how your name will appear publicly
                  </p>
                </div>
              </div>

              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  value={profile.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  className={`mt-1 block w-full px-3 py-2 border ${
                    errors.bio ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                ></textarea>
                <div className="mt-1 flex justify-between">
                  {errors.bio && (
                    <p className="text-sm text-red-600">{errors.bio}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    {profile.bio.length}/250 characters
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={profile.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className={`mt-1 block w-full px-3 py-2 border ${
                      errors.website ? "border-red-500" : "border-gray-300"
                    } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.website}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={profile.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {profile.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-1 inline-flex text-blue-500 hover:text-blue-700"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    id="newInterest"
                    name="newInterest"
                    value={profile.newInterest}
                    onChange={handleChange}
                    placeholder="Add an interest"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addInterest())
                    }
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto float-right flex justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSubmitting
                      ? "bg-blue-400"
                      : "bg-blue-600 hover:bg-blue-700"
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Profile"
                  )}
                </button>
                <button
                  type="button"
                  className="w-full md:w-auto mr-4 float-right flex justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <div className="clear-both"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
