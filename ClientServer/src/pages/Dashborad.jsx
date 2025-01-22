import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      
      <div className="bg-white shadow-md w-full max-w-4xl p-4 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          AlphaPrinting and Textile
        </h1>
      </div>

      <div className="mt-8 flex space-x-6">
        <Link
          to="/manstop"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          MansTop
        </Link>
        <Link
          to="/tshirt"
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
          T-shirt
        </Link>
        <Link
          to="/zippertop"
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
          ZipperTop
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
