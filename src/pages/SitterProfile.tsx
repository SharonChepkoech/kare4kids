import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Layout
    from "../components/Layout";
interface Sitter {
    id: number;
    name: string;
    profile_picture?: string;
    rating: number;
    reviews: number;
    location: string;
    experience: number;
    hourly_rate: number;
}

const SitterProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get sitter ID from URL
    const [sitter, setSitter] = useState<Sitter | null>(null);
    const [user, setUser] = useState<any>(null); // Store logged-in user
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    console.log("Sitter ID from URL:", id);

    // Fetch logged-in user details
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) return;

                const response = await axios.get("http://127.0.0.1:8000/api/users/", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("User Data:", response.data);
                setUser(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    // Fetch sitter details
    useEffect(() => {
        if (!id) return; // Prevent API call if id is not available

        const fetchSitter = async () => {
            try {
                const token = localStorage.getItem("access_token");

                const response = await fetch(`http://127.0.0.1:8000/api/sitters/${id}/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch sitter details");

                const data = await response.json();
                console.log("Fetched Sitter:", data);
                setSitter(data);
            } catch (error) {
                console.error("Error fetching sitter details:", error);
            }
        };

        fetchSitter();
    }, [id]);

    // Request sitter booking
    async function requestSitter() {
        if (!sitter) return;

        setLoading(true);
        setError(null);
        setSuccess(false);

        const token = localStorage.getItem("access_token");
        if (!token) {
            setError("User is not authenticated. Please log in.");
            setLoading(false);
            return;
        }

        const requestData = {
            job_date: new Date().toISOString(),
            duration: 3,
            rate: sitter.hourly_rate,
        };

        console.log("Sending request data:", requestData); // Debugging

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/request-sitter/${sitter.id}/`, // Include sitter ID in the URL
                requestData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            setSuccess(true);
            console.log("Sitter requested successfully:", response.data);
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Axios error:", error.response);

                if (error.response) {
                    const status = error.response.status;

                    if (status === 401) {
                        setError("Authentication failed. Please log in again.");
                    } else if (status === 400) {
                        // Could indicate incorrect request data
                        setError(JSON.stringify(error.response.data));
                    } else if (status === 500) {
                        // General server error
                        setError("Server error. Please try again later.");
                    } else {
                        setError("Failed to request sitter. Please try again.");
                    }
                } else {
                    setError("Failed to request sitter. Please try again.");
                }
            } else {
                console.error("Unexpected error:", error);
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    }

    if (!sitter) return <p className="text-center text-gray-600">Loading...</p>;

    return (
        <div className="flex flex-col items-center p-6 bg-[#A7C7E7] min-h-screen">
            <Layout>
                <h2 className="text-xl sm:text-2xl font-semibold text-center">Book Baby Sitter</h2>
            </Layout>
            {/* Profile Picture */}
            <img
                src={sitter.profile_picture || "/default-avatar.png"}
                alt={sitter.name}
                className="w-32 h-32 rounded-full border-4 border-[#2A9D8F] shadow-lg"
            />

            {/* Sitter Name */}
            <h1 className="text-2xl font-semibold text-[#264653] mt-4">{sitter.name}</h1>

            {/* Rating and Reviews */}
            <div className="flex items-center mt-2">
                <span className="text-yellow-500 text-xl">⭐ {sitter.rating}</span>
                <span className="ml-2 text-gray-600">({sitter.reviews} reviews)</span>
            </div>

            {/* Location and Favorite Button */}
            <div className="flex items-center mt-2">
                <p className="text-gray-600">Babysitter in {sitter.location}</p>
                <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`ml-2 text-2xl ${isFavorite ? "text-red-500" : "text-gray-400"}`}
                >
                    ❤️
                </button>
            </div>

            {/* Experience */}
            <p className="mt-3 text-gray-700">Experience: {sitter.experience} years</p>

            {/* Rate per Hour */}
            <p className="text-lg font-medium text-[#264653] mt-2">
                Rate: KSH {sitter.hourly_rate} per hour
            </p>

            {/* Request Button */}
            <button
                onClick={requestSitter}
                disabled={loading}
                className="mt-6 px-6 py-2 !bg-[#2A9D8F] text-white rounded-lg shadow-md hover:bg-[#228176]"
            >
                {loading ? "Requesting..." : `Request ${sitter.name}`}
            </button>

            {success && <p className="text-green-500 mt-2">Sitter requested successfully!</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default SitterProfile;
