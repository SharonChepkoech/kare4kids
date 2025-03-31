
import useProfile from "../hooks/useProfile";

interface ProfileData {
    username: string;
    user_type: "sitter" | "parent";
    location?: string;
    bio?: string;  
    experience?: number;
    hourly_rate?: number | null;
    number_of_children?: number;
}

const ProfileForm = ({ profile }: { profile: Partial<ProfileData> }) => {
    const { formData, handleChange, handleSubmit, loading, error, success } = useProfile();

    if (loading) return <p>Loading profile...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-900 text-white rounded-lg shadow-md max-w-md mx-auto">
            {/* ✅ Name Field */}
            <label className="block">
                <span className="text-gray-300">Name:</span>
                <input
                    type="text"
                    name="name"
                    value={formData.name ?? profile?.username ?? ""}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="mt-1 p-2 w-full border border-gray-700 bg-gray-800 rounded text-white"
                />
            </label>

            {/* ✅ Parent-Specific Field: Number of Children */}
            {profile?.user_type === "parent" && (
                <label className="block">
                    <span className="text-gray-300">Number of Children:</span>
                    <input
                        type="number"
                        name="number_of_children"
                        value={formData.number_of_children ?? profile?.number_of_children ?? ""}
                        onChange={handleChange}
                        placeholder="Enter number of children"
                        className="mt-1 p-2 w-full border border-gray-700 bg-gray-800 rounded text-white"
                    />
                </label>
            )}

            {/* ✅ Sitter-Specific Fields */}
            {profile?.user_type === "sitter" && (
                <>
                    <label className="block">
                        <span className="text-gray-300">Experience (years):</span>
                        <input
                            type="number"
                            name="experience"
                            value={formData.experience ?? profile?.experience ?? ""}
                            onChange={handleChange}
                            placeholder="Enter experience"
                            className="mt-1 p-2 w-full border border-gray-700 bg-gray-800 rounded text-white"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-300">Hourly Rate (KSH):</span>
                        <input
                            type="number"
                            name="hourly_rate"
                            value={formData.hourly_rate ?? profile?.hourly_rate ?? ""}
                            onChange={handleChange}
                            placeholder="Enter hourly rate"
                            className="mt-1 p-2 w-full border border-gray-700 bg-gray-800 rounded text-white"
                        />
                    </label>

                    <label className="block">
                        <span className="text-gray-300">Bio:</span>
                        <textarea
                            name="bio"
                            value={formData.bio ?? profile?.bio ?? ""}
                            onChange={handleChange}
                            placeholder="Tell parents about your experience..."
                            className="mt-1 p-2 w-full border border-gray-700 bg-gray-800 rounded text-white"
                            rows={3}
                        />
                    </label>
                </>
            )}

            {/* ✅ Location Field */}
            <label className="block">
                <span className="text-gray-300">Location:</span>
                <input
                    type="text"
                    name="location"
                    value={formData.location ?? profile?.location ?? ""}
                    onChange={handleChange}
                    placeholder="Enter location"
                    className="mt-1 p-2 w-full border border-gray-700 bg-gray-800 rounded text-white"
                />
            </label>

            {/* ✅ Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-cyan-500 text-white rounded-lg hover:bg-[#228176] transition"
            >
                {loading ? "Saving..." : "Update"}
            </button>

            {success && <p className="text-green-500 text-center mt-2">Profile updated successfully!</p>}
        </form>
    );
};

export default ProfileForm;


