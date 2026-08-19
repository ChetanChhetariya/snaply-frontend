import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import CreatePost from './pages/CreatePost';
import ProtectedRoute from './routes/ProtectedRoute';
import Navbar from './layouts/Navbar';
import { AuthProvider } from './context/AuthContext';
import Profile from "./pages/ProfilePage";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navbar />
          <div className="main-content md:pl-60 pb-16 md:pb-0">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
              <Route path="/create-post" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;