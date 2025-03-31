import { useState, useEffect } from "react";
import axios from "axios";
import { Booking } from "../interfaces/bookingTypes";

interface User {
  id: number;
  name: string;
  is_sitter: boolean;
  is_parent: boolean;
}

export const useBookings = () => {
  const [pendingRequests, setPendingRequests] = useState<Booking[]>([]);
  const [confirmedBookings, setConfirmedBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); 

  useEffect(() => {
    const fetchUserAndBookings = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) throw new Error("User not authenticated.");

        const userResponse = await axios.get("/api/current-user/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const currentUser = userResponse.data;
        setUser(currentUser);

        const apiUrl = currentUser.is_sitter ? "/api/sitter/bookings/" : "/api/parent/bookings/";
        const bookingsResponse = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bookings = bookingsResponse.data;
        setPendingRequests(bookings.filter((b: Booking) => b.status === "pending"));
        setConfirmedBookings(bookings.filter((b: Booking) => b.status === "accepted"));
      } catch (err) {
        setError("Failed to fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndBookings();
  }, [refreshTrigger]); 

  return { 
    user, 
    pendingRequests, 
    confirmedBookings, 
    loading, 
    error, 
    setPendingRequests, 
    setConfirmedBookings, 
    setRefreshTrigger 
  };
};
