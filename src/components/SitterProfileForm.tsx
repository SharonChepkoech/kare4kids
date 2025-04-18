import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BookingContext } from "../Context/BookingContext";

const SitterProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Sitter ID from URL
    const [sitter, setSitter] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    const [activeBooking, setActiveBooking] = useState<any>(null);

    const bookingContext = useContext(BookingContext);
    const { refreshBookings } = bookingContext || {};

    // **State for user inputs**
    const [jobDate, setJobDate] = useState("");
    const [duration, setDuration] = useState<number | "">("");

    // Fetch user details
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) return;

                const response = await axios.get("http://127.0.0.1:8000/api/current-user/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUser(response.data);
            } catch (error: unknown) {
                console.error("❌ Error fetching user data:", error);
            }
        };

        fetchUser();
    }, []);

    // Fetch sitter details
    useEffect(() => {
        if (!id) return;

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
                setSitter(data);
            } catch (error: unknown) {
                console.error("Error fetching sitter details:", error);
            }
        };

        fetchSitter();
    }, [id]);

    // Request sitter booking
    const requestSitter = async () => {
        if (!jobDate || !duration ) {
            setError("Please fill in all booking details.");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");

            const response = await axios.post(
                `http://127.0.0.1:8000/api/request-sitter/${id}/`,
                {
                    parent: user?.parent?.id,
                    job_date: jobDate,
                    duration,
                }, // ❌ Removed rate here
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            

            console.log("✅ Sitter Requested Successfully:", response.data);
            setSuccess(true);
            setError(null);

            if (refreshBookings) {
                refreshBookings();
            }
        } catch (error: unknown) {
            console.error("❌ Axios Error:", error);
            setError("Failed to request sitter. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Fetch active booking
    useEffect(() => {
        if (!user || !user.parent || !id) return;

        const fetchActiveBooking = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`http://127.0.0.1:8000/api/bookings/parent/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const bookings = response.data.filter(
                    (booking: any) =>
                        booking.sitter === parseInt(id) &&
                        ["pending", "accepted"].includes(booking.status)
                );

                if (bookings.length > 0) {
                    setActiveBooking(bookings[0]);
                }
            } catch (error: unknown) {
                console.error("❌ Error fetching parent bookings:", error);
            }
        };

        fetchActiveBooking();
    }, [user, id, refreshBookings]); // ✅ Auto-refresh when bookings update

    if (!sitter) return <p className="text-center text-gray-600">Loading...</p>;

    return (
        <div className="flex flex-col items-center p-6 bg-[#A7C7E7] min-h-screen">
            <h1 className="text-2xl font-semibold">{sitter.name}</h1>

            {/* Booking Form */}
            <div className="mt-6 p-4 bg-white shadow-lg rounded-lg w-full max-w-md">
                <h2 className="text-lg font-semibold">Book {sitter.name}</h2>

                <label className="block mt-3">Date & Time:</label>
                <input
                    type="datetime-local"
                    value={jobDate}
                    onChange={(e) => setJobDate(e.target.value)}
                    className="w-full p-2 border rounded"
                />

                <label className="block mt-3">Duration (hours):</label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                />
             
                <button
                    onClick={requestSitter}
                    disabled={loading}
                    className="mt-4 w-full bg-[#2A9D8F] text-white p-2 rounded"
                >
                    {loading ? "Requesting..." : `Request ${sitter.name}`}
                </button>
            </div>

            {/* Show Active Booking Details */}
            {activeBooking && (
                <div className="mt-6 p-4 bg-white shadow-lg rounded-lg w-full max-w-md">
                    <h2 className="text-lg font-semibold">Your Booking Details</h2>
                    <p><strong>Date:</strong> {new Date(activeBooking.job_date).toLocaleString()}</p>
                    <p><strong>Duration:</strong> {activeBooking.duration} hours</p>
                    <p><strong>Status:</strong> {activeBooking.status}</p>
                </div>
            )}

            {success && <p className="text-green-500 mt-2">Sitter requested successfully!</p>}
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
    );
};

export default SitterProfile;
