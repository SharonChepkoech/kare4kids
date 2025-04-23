import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { handleApiError, showSuccessToast } from "../utils/errorhandler";


const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  

  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }
  if (!authContext) {
    throw new Error("AuthContext must be used within an AuthProvider");
  }  

  const { setUser, setRole } = authContext;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, password } = formData;

    setIsSubmitting(true); 

  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (!username || !password) {
        handleApiError(new Error("Please enter both username and password."));
        return;
      }      

      if (response.ok) {
        showSuccessToast("Login successful!");
        setUser(data.username);
        setRole(data.user_type);
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("role", data.user_type);
      
        navigate(data.user_type === "parent" ? "/dashboard/parent" : "/dashboard/sitter");
      } else {
        if (response.status === 401) {
          handleApiError(new Error("Invalid username or password. Please check your login credentials."));
        } else {
          handleApiError(new Error(data?.detail || "Something went wrong. Please try again."));
        }
      }
      
    } catch (error) {
      handleApiError(error, "Unable to login. Please try again later.");
    }finally{
      setIsSubmitting(false); 
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-8 rounded-lg shadow-md w-96 border border-gray-300">
        <h2 className="text-xl font-semibold mb-4 text-cyan-500">Login</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded border-cyan-500 text-cyan-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
       <div className="relative mb-4">
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    className="w-full p-2 border rounded border-cyan-500 text-cyan-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 pr-10"
  />
<span onClick={togglePasswordVisibility} className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-cyan-500">
  {showPassword ? <FaEyeSlash /> : <FaEye />}
</span>
</div>
<button type="submit" disabled={isSubmitting} className="w-full !bg-cyan-500 text-white p-2 rounded">
        {isSubmitting ? "Logging In..." : "Login"}
      </button>
        <div className="text-cyan-500  flex space-x-4 justify-center">
          <p>Don't have an account?</p>
          <Link to="/register" className=" !text-cyan-500 ">Register </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
