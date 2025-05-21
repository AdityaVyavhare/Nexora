import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import App from "./App.jsx";
import SignIn from "./components/SignIn.jsx";
import SignUp from "./components/SingUp.jsx";
import ProfileEditor from "./components/ProfileInput.jsx";
import CreatePostForm from "./components/CreatePostForm.jsx";
import NexoraHeader from "./components/NexoraHeader.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import UserProfile from "./components/UserProfile.jsx";
import PostAnalyticsDashboard from "./components/PostAnalyticsDashboard.jsx";
// Wrapper to handle conditional header
function AppWithHeader() {
  const location = useLocation();
  const hideHeaderRoutes = ["/signin", "/signup", "/profile"];
  const shouldHideHeader = hideHeaderRoutes.includes(
    location.pathname.toLowerCase()
  );

  return (
    <>
      {!shouldHideHeader && <NexoraHeader />}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/signin" index element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<ProfileEditor />} />
        <Route path="/createpostform" element={<CreatePostForm />} />
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/dashboard" element={<PostAnalyticsDashboard />} />
      </Routes>
    </>
  );
}

// Final render
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppWithHeader />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
