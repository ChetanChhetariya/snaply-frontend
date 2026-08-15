import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import ProtectedRoute from "./routes/ProtectedRoute";
import Navbar from "./layouts/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Profile from "./pages/ProfilePage";

import "./App.css";

function AppContent() {
  const location = useLocation();

  const isPublicPage =
    location.pathname === "/login" ||
    location.pathname === "/signup";

  return (
    <div className="app">
      <Navbar />

      <div
        className={
          isPublicPage
            ? "main-content pt-16"
            : "main-content md:pl-60 pb-16 md:pb-0"
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<Signup />} />

          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <Feed />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-post"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;