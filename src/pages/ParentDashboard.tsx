import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useFetch"; // Import your fetch hook
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Sitter {
  id: number;
  name: string;
  hourly_rate: string | null;
  experience: number;
  bio: string;
}

const ParentDashboard = () => {
  const [parentName, setParentName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [sitters, setSitters] = useState<Sitter[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchSitters = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/sitters/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      setSitters(response.data);
    } catch (err) {
      console.error("Failed to fetch sitters:", err);
      setError("Failed to fetch sitters");
    } finally {
      setLoading(false);
    }
  };

  fetchSitters();
}, []);


  // 🔍 Filter sitters based on search
  const filteredSitters = sitters.filter((sitter) =>
    sitter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch parent name when the component mounts
  useEffect(() => {
    const fetchParentName = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });
        setParentName(response.data.username); // Use `username` for the parent's name
      } catch (error) {
        console.error("Failed to fetch parent name", error);
      }
    };

    fetchParentName();
  }, []);

  return (
    <div className="p-6 bg-[#A7C7E7] min-h-screen">
      <Layout>
        <h2 className="text-xl sm:text-2xl font-semibold text-center">Parent Dashboard</h2>
      </Layout>

      {/* Display parent's name if available */}
      <h1 className="text-2xl font-semibold text-[#264653] mb-4">
        Hello, {parentName || "Loading..."}
      </h1>

      <input
        type="text"
        placeholder="Search sitters..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-lg mb-6 bg-white text-[#264653]"
      />

      {loading && <p>Loading sitters...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredSitters.length > 0 ? (
          filteredSitters.map((sitter) => (
            <div
              key={sitter.id}
              onClick={() => navigate(`/sitters/${sitter.id}`)}
              className="p-4 rounded-lg shadow-md bg-white border border-[#2A9D8F] text-center cursor-pointer transition-transform transform hover:scale-105"
            >
              <h3 className="font-medium text-[#264653]">{sitter.name || "Unknown Sitter"}</h3>
              <p className="text-gray-600">
                {sitter.hourly_rate ? `KES${sitter.hourly_rate}/hr` : "Rate not available"}
              </p>
              <p className="text-gray-600">Experience: {sitter.experience} years</p>
              <p className="text-gray-500">{sitter.bio || "No bio available"}</p>
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
