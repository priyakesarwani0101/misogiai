import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login";
import Navbar from "./components/Navbar";
import SignupPage from "./components/Signup";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
import CreateEventForm from "./components/CreateEventForm";
import AttendeeList from "./components/AttandeeList";
import EventAnalytics from "./components/EventAnalytics";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log("Base URL is:", apiBaseUrl);

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-event" element={<CreateEventForm />} />
        <Route path="/invite" element={<AttendeeList />} />
        <Route path="/events/:eventId/analytics" element={<EventAnalytics />} />
      </Routes>
    </>
  );
}

export default App