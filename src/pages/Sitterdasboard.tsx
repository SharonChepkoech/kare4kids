import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

interface Booking {
  id: number;
  parent_name: string;
  job_date: string;
  duration: number;
  rate: number;
  status: string;
}

interface User {
  id: number;
  name: string;
  is_sitter: boolean;
  is_parent: boolean;
}

const SitterDashboard: React.FC = () => {
  const [pendingRequests, setPendingRequests] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  // ✅ Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("User not authenticated.");

        const { data } = await axios.get("http://127.0.0.1:8000/api/current-user/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // ✅ Fetch bookings only if user is a sitter
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user || !user.is_sitter) return;

      try {
        const token = localStorage.getItem("access_token");
        const { data } = await axios.get("http://127.0.0.1:8000/api/sitter/bookings/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!Array.isArray(data)) throw new Error("Invalid API response.");

        setPendingRequests(data.filter((b: Booking) => b.status === "pending"));
        setConfirmedBookings(data.filter((b: Booking) => b.status === "accepted"));
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to fetch bookings.");
      }
    };

    fetchBookings();
  }, [refreshTrigger, user]);

  // ✅ Update booking status
  const updateBookingStatus = async (id: number, status: "accepted" | "declined") => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.patch(`http://127.0.0.1:8000/api/bookings/${id}/`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRefreshTrigger((prev) => prev + 1); // 🔄 Refresh list
    } catch (err) {
      console.error("Error updating booking:", err);
      setError("Failed to update booking.");
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (user && user.is_parent) return <p className="text-center text-gray-600">This page is for sitters only.</p>;

  return (
    <div className="w-full h-full flex flex-col items-center p-4 sm:p-6 bg-[#A7C7E7]">
      <Layout>
        <h2 className="text-xl sm:text-2xl font-semibold text-center">Sitter Dashboard</h2>
      </Layout>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#2A9D8F] mb-2">Pending Requests</h2>
          <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
            {pendingRequests.length > 0 ? (
              <ul className="space-y-4">
                {pendingRequests.map((booking) => (
                  <li key={booking.id} className="p-4 border text-cyan-500 rounded-lg bg-gray-100 shadow-sm">
                    <p><strong>Parent:</strong> {booking.parent_name}</p>
                    <p><strong>Date:</strong> {new Date(booking.job_date).toLocaleString()}</p>
                    <p><strong>Duration:</strong> {booking.duration} hours</p>
                    <p><strong>Rate:</strong> KSH {booking.rate}</p>

                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                      <button
                        onClick={() => updateBookingStatus(booking.id, "accepted")}
                        className="px-4 py-2 !bg-cyan-500 text-white rounded w-full sm:w-auto mb-2 sm:mb-0"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, "declined")}
                        className="px-4 py-2 !bg-pink-500 text-white rounded w-full sm:w-auto"
                      >
                        Reject
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No pending requests.</p>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-[#2A9D8F] mb-2">Confirmed Bookings</h2>
          <div className="max-h-[300px] text-cyan-500 overflow-y-auto scrollbar-hide">
            {confirmedBookings.length > 0 ? (
              <ul className="space-y-4">
                {confirmedBookings.map((booking) => (
                  <li key={booking.id} className="p-4 border rounded-lg bg-gray-100 shadow-sm">
                    <p><strong>Parent:</strong> {booking.parent_name}</p>
                    <p><strong>Date:</strong> {new Date(booking.job_date).toLocaleString()}</p>
                    <p><strong>Duration:</strong> {booking.duration} hours</p>
                    <p><strong>Rate:</strong> KSH {booking.rate}</p>
                    <p className="text-green-500 font-semibold">Accepted</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-700">No confirmed bookings yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SitterDashboard;
