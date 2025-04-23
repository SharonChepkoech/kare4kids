import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { handleApiError, showSuccessToast } from "../utils/errorhandler";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", password1: "", password2: "", user_type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const togglePassword1Visibility = () => {
    setShowPassword1((prev) => !prev);
  };
  const togglePassword2Visibility = () => {
    setShowPassword2((prev) => !prev);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password1, password2, user_type } = formData;

    if (password1.length < 6) {
      handleApiError(new Error("Password must be at least 6 characters long."));
      return;
    }

    if (password1 !== password2) {
      handleApiError(new Error("Passwords do not match. Please check your passwords."));
      return;
    }

    setIsSubmitting(true); 

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password1, password2, user_type }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccessToast("Registration successful! Please login.");
        localStorage.setItem("access_token", data.access);
        navigate("/login");
      } else {
        if (data?.detail) {
          handleApiError(new Error(data.detail));
        } else {
          handleApiError(new Error("This username is taken. Please try again."));
        }
      }
    } catch (error) {
      handleApiError(error, "Unable to register. Please try again later.");
    } finally {
      setIsSubmitting(false); 
    }

    setFormData({ username: "", password1: "", password2: "", user_type: "" });
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full px-4">
      <form onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
        <h2 className="text-xl font-semibold mb-4 text-cyan-500">Register</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 mb-4 border border-cyan-500 rounded text-cyan-500 bg-gray-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
        />
       
       <div className="relative mb-4">
  <input
    type={showPassword1 ? "text" : "password"}
    name="password1"
    placeholder="Password"
    value={formData.password1}
    onChange={handleChange}
    className="w-full p-2 border rounded border-cyan-500 text-cyan-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
  />
  <span
    onClick={togglePassword1Visibility}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-cyan-500"
  >
    {showPassword1 ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

<div className="relative mb-4">
  <input
    type={showPassword2 ? "text" : "password"}
    name="password2"
    placeholder="Confirm Password"
    value={formData.password2}
    onChange={handleChange}
    className="w-full p-2 border rounded border-cyan-500 text-cyan-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
  />
  <span
    onClick={togglePassword2Visibility}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-cyan-500"
  >
    {showPassword2 ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

        <div className="mb-4">
          <select
            name="user_type"
            value={formData.user_type}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-cyan-500 rounded text-cyan-500 bg-gray-100 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
          >
            <option value="" disabled>Select User Type</option>
            <option value="parent">Parent</option>
            <option value="sitter">Sitter</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full !bg-cyan-500 text-white p-2 rounded">
        {isSubmitting ? "Registering..." : "Register"}
      </button>
        <div className="text-cyan-500  flex space-x-4 justify-center">
          <p>Already have an account?</p>
          <Link to="/login" className=" !text-cyan-500 ">Login </Link>
        </div>
        
      </form>
    </div>
  );
};
export default Register;
