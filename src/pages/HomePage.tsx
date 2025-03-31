import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl text-cyan-500 font-bold mb-4">Welcome to Kare4Kids</h1>
      <div className="space-x-4">
        <Link to="/login" className=" bg-cyan-500 !text-white px-4 py-2 rounded">Login</Link>
        <Link to="/register" className="bg-cyan-500 !text-white px-4 py-2 rounded">Register</Link>
      </div>
    </div>
  );
};

export default Home;
