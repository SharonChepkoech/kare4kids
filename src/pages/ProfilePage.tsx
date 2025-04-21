import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfileForm from "../components/ProfileForm";
import Layout from "../components/Layout";

const ProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile/`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` }
                });
                setProfile(response.data);
                console.log("Profile loaded:", response.data);

                // Set initial preview image
                if (response.data.profile_picture) {
                    setPreview(response.data.profile_picture);
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            }
        };

        fetchProfile();
    }, []);

    // ✅ Handle File Selection
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file)); // Show preview before upload
        }
    };

    // ✅ Handle Profile Picture Upload
    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage("Please select an image first.");
            return;
        }

        const formData = new FormData();
        formData.append("profile_picture", selectedFile);

        try {
            setUploading(true);
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/profile/upload-picture/`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage("Profile picture updated successfully!");

            // ✅ Fetch updated profile after upload
            const profileResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile/`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
            });

            setProfile(profileResponse.data);

            // ✅ Update preview with FULL URL
            if (profileResponse.data.profile_picture) {
                setPreview(profileResponse.data.profile_picture);
            }
        } catch (error: any) {
            console.error("Upload failed:", error.response ? error.response.data : error.message);
            setMessage("Upload failed. Please try again later.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 sm:p-6 bg-[#A7C7E7]">
            <Layout>
                <h2 className="text-xl sm:text-2xl font-semibold text-center">Profile</h2>
            </Layout>
            <div className="p-6 bg-cyan-500 text-white rounded-lg shadow-md max-w-2xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>

                {/* ✅ Show profile picture preview */}
                {preview && <img src={preview} alt="Profile Preview" className="w-32 h-32 rounded-full mx-auto mb-4" />}

                {/* ✅ File input & Upload button */}
                <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4" />
                <button onClick={handleUpload} disabled={uploading} className="!bg-white text-cyan-500 px-4 py-2 rounded">
                    {uploading ? "Uploading..." : "Upload Picture"}
                </button>
                {message && <p className="text-center mt-2 text-sm">{message}</p>}

                {/* ✅ Pass only the `profile` object */}
                {profile && <ProfileForm profile={profile} />}
            </div>
        </div>
    );
};

export default ProfilePage;
