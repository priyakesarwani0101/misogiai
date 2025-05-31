import React from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo/Brand */}
      <div className="text-2xl font-bold text-purple-600">
        <Link to="/">
         EventPulse
        </Link>
      </div>

      {/* Links */}
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-4 py-2 text-purple-600 border border-purple-600 rounded hover:bg-purple-100 transition"
        >Login
        </Link>
        <Link
          to="/signup"
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Signup
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
