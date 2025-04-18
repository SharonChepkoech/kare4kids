import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<"sitter" | "parent" | null>(null);

  // 🔄 Fetch User Role When Navbar Mounts
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const response = await axios.get("http://127.0.0.1:8000/api/current-user/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        if (user.is_sitter) {
          setUserRole("sitter");
        } else if (user.is_parent) {
          setUserRole("parent");
        }
      } catch (error) {
        console.error("❌ Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full bg-cyan-500 text-white shadow-md z-50">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center py-3">
        <h1 className="text-xl font-bold">Kare4Kids</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {userRole === "sitter" && (
            <Link to="/dashboard/sitter" className="hover:underline !text-white">
              Sitter Dashboard
            </Link>
          )}
          {userRole === "parent" && (
            <Link to="/dashboard/parent" className="hover:underline !text-white">
              Parent Dashboard
            </Link>
          )}
          <Link to="/profile" className="hover:underline !text-white">Profile</Link>
          <Link to="/chats" className="hover:underline !text-white">Chats</Link>
          <Link to="/favourites" className="hover:underline !text-white">Favourites</Link>
          <Link to="/completed-jobs" className="hover:underline !text-white">complete jobs</Link>

        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden block text-white focus:outline-none" 
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-cyan-500 p-4 space-y-3">
          {userRole === "sitter" && (
            <Link to="/dashboard/sitter" className="block text-white hover:underline" onClick={() => setMenuOpen(false)}>
              Sitter Dashboard
            </Link>
          )}
          {userRole === "parent" && (
            <Link to="/dashboard/parent" className="block text-white hover:underline" onClick={() => setMenuOpen(false)}>
              Parent Dashboard
            </Link>
          )}
          <Link to="/profile" className="block text-white hover:underline" onClick={() => setMenuOpen(false)}>
            Profile
          </Link>
          <Link to="/chats" className="block text-white hover:underline" onClick={() => setMenuOpen(false)}>
            Chats
          </Link>
          <Link to="/favourites" className="block text-white hover:underline" onClick={() => setMenuOpen(false)}>
            Favourites
          </Link>
          <Link to="/completed-jobs" className="block text-white hover:underline" onClick={() => setMenuOpen(false)}>
            complete jobs
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
