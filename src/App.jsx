import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login";
import Navbar from "./components/Navbar";
import SignupPage from "./components/Signup";
import HomePage from "./components/HomePage";
import Dashboard from "./components/Dashboard";
import CreateEventForm from "./components/CreateEventForm";
import AttendeeList from "./components/AttandeeList";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
console.log("Base URL is:", apiBaseUrl);
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* <Route path="/" element={<HomePage />}></Route> */}
        <Route path="/" element={<Dashboard />}></Route>
        <Route path="/signup" element={<SignupPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/create-event" element={<CreateEventForm />}></Route>
        <Route path="/invite" element={<AttendeeList />} />
      </Routes>
      {/* <LoginPage /> */}
    </>
  );
}

export default App;
