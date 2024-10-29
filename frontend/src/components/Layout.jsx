import { logout } from "@/services/apiService";
import Cookies from "js-cookie";
import { Gauge } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const token = Cookies.get("userToken");
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      Cookies.remove("userToken");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className=" bg-gray-100 overflow-hidden font-roboto">
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0  z-10 flex justify-between">
        <div className="max-w-7xlpx-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2">
          <Link to={"/"}>
            <img src="/Group 1.png" alt="" />
          </Link>
        </div>
        {token && (
          <div className="max-w-7xlpx-4 sm:px-6 lg:px-8 py-4 flex items-center">
            <button
              className="flex gap-2 items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              onClick={handleLogout}
            >
              <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              Logout
            </button>
          </div>
        )}
      </header>
      <main className="min-h-screen mt-16">{children}</main>
    </div>
  );
};

export default Layout;
