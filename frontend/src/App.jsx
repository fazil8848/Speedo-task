import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashborad";
import TripDetails from "./pages/TripDetails";
import Singup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import UnprotectedRoute from "./components/UprotectedRoutes";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<UnprotectedRoute element={<Login />} />} />
          <Route
            path="/signup"
            element={<UnprotectedRoute element={<Singup />} />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedRoute element={<Dashboard />} />}
          />

          <Route
            path="/trip-details"
            element={<ProtectedRoute element={<TripDetails />} />}
          />
        </Routes>
      </Layout>
      <Toaster
        position="top-center"
        toastOptions={{
          className: "bg-gray-800 text-white",
          style: {
            border: "1px solid #4F46E5",
            borderRadius: "8px",
          },
          duration: 3000,
        }}
      />
    </Router>
  );
}

export default App;
