import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Dashboard = () => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold">Welcome, {auth.user}!</h1>
      <button
        onClick={auth.logout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
