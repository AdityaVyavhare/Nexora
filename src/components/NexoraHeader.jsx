import React, { useEffect, useState } from "react";
import {
  Bell,
  Search,
  Menu,
  X,
  MessageSquare,
  User,
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle,
  LayoutDashboard,
  Plus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NexoraHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profile = useSelector((state) => state.profile);
  const userId = useSelector((state) => state.userId);

  const navigation = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigation("/signin");
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  // Add this function to handle link clicks
  const handleLinkClick = () => {
    setIsProfileOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm w-full fixed">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-indigo-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">N</span>
              </div>
            </div>
            <div className="hidden md:block ml-3">
              <span className="text-lg font-semibold text-gray-800">
                Nexora
              </span>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search..."
              />
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center">
            {/* Post Button - Now properly positioned */}
            <Link to="/createpostform" onClick={handleLinkClick}>
              <button
                type="button"
                className="hidden md:flex items-center gap-2 mr-3 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Post</span>
              </button>
            </Link>

            {/* Messages */}
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none">
              <MessageSquare className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative ml-3">
              <button
                onClick={toggleNotifications}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>

              {/* Notifications Dropdown */}
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <h3 className="text-sm font-medium text-gray-800">
                        Notifications
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {[1, 2, 3].map((item) => (
                        <a
                          key={item}
                          href="#"
                          className="flex px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
                        >
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500 mr-3">
                            <User className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800">
                              <span className="font-medium">User {item}</span>{" "}
                              sent you a message
                            </p>
                            <p className="text-xs text-gray-500">5 min ago</p>
                          </div>
                        </a>
                      ))}
                      <div className="px-4 py-2 text-center">
                        <a
                          href="#"
                          className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          View all notifications
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative ml-3">
              <div>
                <button
                  onClick={toggleProfile}
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-1">
                    {/* <User className="h-4 w-4" /> */}
                    <img
                      className="rounded-3xl"
                      src={`http://localhost:3000/api/media/${profile?.profileImage?.fileId}`}
                    />
                  </div>
                  <span className="hidden md:flex items-center">
                    <span className="text-sm font-medium text-gray-700 mr-1">
                      {profile.displayName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </span>
                </button>
              </div>

              {/* Profile Menu */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical">
                    <Link
                      to="/userprofile"
                      state={{ userId }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={handleLinkClick}
                    >
                      <User className="mr-3 h-4 w-4 text-gray-500" />
                      Your Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={handleLinkClick}
                    >
                      <LayoutDashboard className="mr-3 h-4 w-4 text-gray-500" />
                      DashBoard
                    </Link>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={handleLinkClick}
                    >
                      <HelpCircle className="mr-3 h-4 w-4 text-gray-500" />
                      Help Center
                    </a>
                    <div className="border-t border-gray-100"></div>
                    <Link
                      to="/signin"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      role="menuitem"
                      onClick={handleLinkClick}
                    >
                      <LogOut className="mr-3 h-4 w-4 text-gray-500" />
                      Sign out
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-3">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="px-3 py-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search..."
                />
              </div>
            </div>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={handleLinkClick}
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={handleLinkClick}
            >
              Projects
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={handleLinkClick}
            >
              Messages
            </a>
            <a
              href="#"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
              onClick={handleLinkClick}
            >
              Community
            </a>
            {/* Post button in mobile menu */}
            <Link to={"/createpostform"} onClick={handleLinkClick}>
              <div className="px-3 py-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Post</span>
                </button>
              </div>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default NexoraHeader;
