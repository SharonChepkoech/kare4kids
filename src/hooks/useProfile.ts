import { useState, useEffect } from "react";
import axios from "axios";

interface ProfileData {
    user_type: "sitter" | "parent";
    name: string;
    email?: string;
    location?: string;
    profile_picture?: string;
    number_of_children?: number; // ✅ Parent field
    bio?: string;          // ✅ Sitter field
    experience?: number;   // ✅ Sitter field
    hourly_rate?: number;  // ✅ Sitter field
}

const useProfile = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [formData, setFormData] = useState<Partial<ProfileData>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) throw new Error("Authentication required.");

                const response = await axios.get("http://127.0.0.1:8000/profile/", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("✅ Profile Data:", response.data);
                setProfile(response.data); // Store full profile
                setFormData(response.data); // Pre-fill form fields
            } catch (err: any) {
                console.error("❌ Error fetching profile:", err);
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? (value ? Number(value) : undefined) : value,
        }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);
        setError(null);
        console.log("🚀 Form submitted! Sending PATCH request...");
        
        try {
            const token = localStorage.getItem("access_token");
            if (!token) throw new Error("No access token found!");
    
            // ✅ Only send changed fields
            const filteredData: Partial<ProfileData> = {};
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== profile?.[key as keyof ProfileData] && value !== undefined) {
                    (filteredData as any)[key] = value;
                }
            });
    
            console.log("📦 Data before sending:", filteredData); // ✅ Debugging
    
            if (Object.keys(filteredData).length === 0) {
                console.log("⚠ No changes detected. Skipping update.");
                setLoading(false);
                return;
            }
    
            // ✅ Send update request
            const response = await axios.patch("http://127.0.0.1:8000/api/profile/", filteredData, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log("✅ Profile updated successfully!", response.data);
            setProfile((prev) => prev ? { ...prev, ...filteredData } : null);
            setSuccess(true);
        } catch (err: any) {
            console.error("❌ Error updating profile:", err.response?.data || err.message);
            setError("Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };
    
    

    return { profile, formData, handleChange, handleSubmit, loading, error, success };
};

export default useProfile;
