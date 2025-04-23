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
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import CompletedJobsPage from "./pages/CompleteJobs";
import 'react-toastify/dist/ReactToastify.css';

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
            <ToastContainer
  position="top-center"
  autoClose={4000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light" // you can also use "dark" or "colored"
  toastStyle={{
    background: "#ECFEFF", // light cyan
    color: "#0E7490",
    border: "1px solid #22D3EE",
  }}
/>

        </div>
      </BookingProvider>
    </AuthProvider>
  );
}
export default App;