import Register from "./pages/RegisterPage";
import Home from "./pages/HomePage";
import ParentDashboard from "./pages/ParentDashboard";
import SitterProfile from "./pages/SitterProfile";
import SitterDashboard from "./pages/Sitterdasboard";
import ProfilePage from "./pages/ProfilePage";
import ChatsPage from "./pages/Chats";
import FavouritesPage from "./pages/Favourites";
import { BookingProvider } from "./Context/BookingContext";
import Login from "./pages/LoginPage";
import { AuthProvider } from "./Context/AuthContext";
import { Routes, Route } from "react-router-dom";
import CompletedJobsPage from "./pages/CompleteJobs";

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <div className="!w-full h-screen flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/sitters/:id" element={<SitterProfile />} />
            <Route path="/dashboard/parent" element={<ParentDashboard />} />
            <Route path="/dashboard/sitter" element={<SitterDashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/chats" element={<ChatsPage />} />
            <Route path="/favourites" element={<FavouritesPage />} />
            <Route path="/completed-jobs" element={<CompletedJobsPage />} />


          </Routes>
        </div>
      </BookingProvider>
    </AuthProvider>
  );
}
export default App;