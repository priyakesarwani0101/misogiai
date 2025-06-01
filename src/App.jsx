import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/Login";
import Navbar from "./components/Navbar";
import SignupPage from "./components/Signup";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
import CreateEventForm from "./components/CreateEventForm";
import AttendeeList from "./components/AttandeeList";
import EventAnalytics from "./components/EventAnalytics";
import EventDetail from "./components/EventDetail";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log("Base URL is:", apiBaseUrl);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <HomePage />
            )
          }
        />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-event"
          element={
            <ProtectedRoute>
              <CreateEventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invite"
          element={
            <ProtectedRoute>
              <AttendeeList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:eventId/analytics"
          element={
            <ProtectedRoute>
              <EventAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:eventId"
          element={
            <ProtectedRoute>
              <EventDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;