import { createContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;  // ✅ Added
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;  // ✅ Added
  login: (token: string, username: string, role: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    if (storedUser && storedRole) {
      setUser(storedUser);
      setRole(storedRole);
    }
  }, []);

  const login = (token: string, username: string, userRole: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", username);
    localStorage.setItem("role", userRole);
    setUser(username);
    setRole(userRole);

    setTimeout(() => {
      navigate(userRole === "parent" ? "/dashboard/parent" : "/dashboard/sitter");
    }, 100);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setRole(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, role, setRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
