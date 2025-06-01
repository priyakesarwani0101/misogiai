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

// Sample data for EventAnalytics
const sampleEventData = {
  totalRsvps: 42,
  totalCheckIns: 37,
  feedbackVolume: [
    { minute: "2025-06-01T09:00:00.000Z", count: "3" },
    { minute: "2025-06-01T09:01:00.000Z", count: "5" },
    { minute: "2025-06-01T09:02:00.000Z", count: "2" },
    { minute: "2025-06-01T09:03:00.000Z", count: "7" },
    { minute: "2025-06-01T09:04:00.000Z", count: "4" },
    { minute: "2025-06-01T09:05:00.000Z", count: "6" }
  ],
  topEmojis: [
    { emoji: "👍", count: "15" },
    { emoji: "😊", count: "10" },
    { emoji: "❤️", count: "8" }
  ],
  topKeywords: [
    { word: "great", count: 12 },
    { word: "insightful", count: 7 },
    { word: "helpful", count: 5 },
    { word: "interactive", count: 4 },
    { word: "engaging", count: 3 }
  ]
};

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
        <Route path="/analytics" element={<EventAnalytics eventData={sampleEventData} />} />
      </Routes>
    </>
  );
}

export default App;