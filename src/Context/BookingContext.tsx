import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

interface Booking {
  id: number;
  parent_name: string;
  job_date: string;
  duration: number;
  rate: number;
  status: string;
}

interface BookingContextType {
  pendingRequests: Booking[];
  confirmedBookings: Booking[];
  refreshBookings: () => void;
}

export const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingRequests, setPendingRequests] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("access_token");

      console.log("🔑 Access Token:", token); // Debugging purpose

      if (!token) {
        console.error("❌ No access token found. Please log in.");
        return;
      }

      const response = await axios.get("http://127.0.0.1:8000/api/sitter/bookings/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Fetch Bookings Response:", response.data);

      const bookings = response.data;
      if (!Array.isArray(bookings)) {
        console.error("❌ Unexpected API response format:", bookings);
        return;
      }

      // Update state with the filtered bookings
      const pending = bookings.filter((b: Booking) => b.status === "pending");
      const confirmed = bookings.filter((b: Booking) => b.status === "accepted");

      console.log(`🔄 Updating State | Pending: ${pending.length}, Confirmed: ${confirmed.length}`);

      setPendingRequests(pending);
      setConfirmedBookings(confirmed);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("❌ Fetch Bookings Failed:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        console.error("❌ Unknown Error:", error.message);
      } else {
        console.error("❌ An unexpected error occurred", error);
      }
    }

  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <BookingContext.Provider value={{ pendingRequests, confirmedBookings, refreshBookings: fetchBookings }}>
      {children}
    </BookingContext.Provider>
  );
};
