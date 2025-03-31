import { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

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

    const { username, password } = formData;  // ✅ Extract values

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login Response Data:", data);  // ✅ Check received data

      if (response.ok) {
        setUser(data.username);
        setRole(data.user_type);  // ✅ Make sure this exists in the API response

        console.log("User Type from API:", data.user_type);
        console.log("Checking user_type:", data.user_type || data.user?.user_type);
        console.log("API Response:", data);
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("role", data.user_type);

        console.log("Navigating to:", data.user_type === "parent" ? "/dashboard/parent" : "/dashboard/sitter");

        setTimeout(() => {
          navigate(data.user_type === "parent" ? "/dashboard/parent" : "/dashboard/sitter");
        }, 100);
      } else {
        console.error("Login failed", data);
      }
    } catch (error) {
      console.error("Error:", error);
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
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded border-cyan-500 text-cyan-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button type="submit" className="w-full !bg-cyan-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 hover:bg-cyan-600  text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
