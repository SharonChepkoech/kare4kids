import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

interface Sitter {
  id: number;
  name: string;
  location: string;
  profile_picture: string;
}

interface User {
  id: number;
  username: string;
  is_parent: boolean;
}

const ParentDashboard = () => {
  const [sitters, setSitters] = useState<Sitter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          console.warn("No access token found.");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/current-user/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const userData = await response.json();
        console.log("User Data:", userData); // 🔍 Debugging the API response
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    // Fetch sitters
    const fetchSitters = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/sitters/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch sitters");

        const data = await response.json();
        setSitters(data);
      } catch (error) {
        console.error("Error fetching sitters:", error);
      }
    };

    fetchUser();
    fetchSitters();
  }, []);
  const filteredSitters = sitters.filter((sitter) =>
    (sitter.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (sitter.location?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  console.log("Filtered Sitters:", filteredSitters); // Debugging


  return (
    <div className="p-6 bg-[#A7C7E7] min-h-screen">
      <Layout>
        <h2 className="text-xl sm:text-2xl font-semibold text-center">Parent Dashboard</h2>
        <p className="text-center">View available sitters and make bookings here</p>
      </Layout>
      <h1 className="text-2xl font-semibold text-[#264653] mb-4">
        Hello, {user ? user.username : "Parent"}
      </h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search sitters by name or location..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          console.log("Search Query:", e.target.value); // Debugging
        }}
        className="w-full p-2 border rounded-lg mb-6 bg-white text-[#264653]"
      />
      {/* Sitter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredSitters.length > 0 ? ( // ✅ Use filteredSitters
          filteredSitters.map((sitter) => ( // ✅ Corrected
            <div
              key={sitter.id}
              onClick={() => navigate(`/sitters/${sitter.id}`)}
              className="p-4 rounded-lg shadow-md bg-[#FFFFFF] border border-[#2A9D8F] text-center cursor-pointer transition-transform transform hover:scale-105"
            >
              <img
                src={sitter.profile_picture || "/default-avatar.png"}
                alt={sitter.name}
                className="w-24 h-24 rounded-full mx-auto mb-2 border-2 border-[#2A9D8F]"
              />
              <h3 className="font-medium text-[#264653]">{sitter.name}</h3>
              <p className="text-gray-600">Babysitter in {sitter.location}</p>
            </div>
          ))
        ) : (
          <p className="text-[#264653]">No sitters found.</p>
        )}
      </div>

    </div>
  );
};

export default ParentDashboard;
