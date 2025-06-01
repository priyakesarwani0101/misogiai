import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EventTabs from "./EventTabs";
import toast from "react-hot-toast";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const userString = localStorage.getItem("loggedUser");
const user = userString ? JSON.parse(userString) : null;

useEffect(() => {
  if (!user) {
    console.warn("No loggedUser found; redirecting to /login");
    navigate("/login");
  }
}, [user, navigate]);

useEffect(() => {
    const fetchMyEvents = async () => {
      setLoading(true);

      // 1. Grab the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No access token found. Redirecting to login.");
        navigate("/login");
        return;
      }

      const endpoint =
        user.role === "HOST"
          ? "/events/mine"
          : "/rsvps/me";

      try {
        const response = await fetch(`${apiBaseUrl}${endpoint}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        // 2. If unauthorized, redirect to login
        if (response.status === 401 || response.status === 403) {
          console.warn("Unauthorized. Redirecting to login.");
          navigate("/login");
          return;
        }

        const json = await response.json();

        // 3. Assuming your API responds with { status: "success", data: [ ... ] }
        if (json.status === "success" && Array.isArray(json.data)) {
          setEvents(json.data);
        } else {
          console.error(
            `Failed to fetch ${
              user.role === "HOST" ? "events" : "RSVPs"
            }:`,
            json.message || "Unexpected response format"
          );
          toast.error("Could not load events. Please try again later.");
        }
      } catch (err) {
        console.error("Network or parsing error while fetching events:", err);
        toast.error("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyEvents();
    }
  }, [navigate]);

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

//   const handleManage = (eventId) => {
//     alert(`Managing event ${eventId}`);
//   };
const handleEventUpdated = (updatedEvent) => {
  setEvents((prev) =>
    prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
  );
};

const isHost = user?.role === "HOST";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Events and RSVPs</h1>
        <button
          onClick={handleCreateEvent}
          disabled={!isHost}
          className={`px-4 py-2 rounded font-medium transition
            ${isHost
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Create Event
        </button>
      </div>
      {/* <EventTabs events={events} currentUserId={currentUserId} /> */}
      {loading ? (
        <p className="text-gray-500">Loading your events…</p>
      ) : events.length === 0 ? (
        <p className="text-gray-500">
          {isHost
            ? "You have no created events."
            : "You are not attending any events."}
        </p>
      ) : (
        <EventTabs
          events={events}
          userRole={user?.role}
          onEventUpdated={handleEventUpdated}
        />
      )}
    </div>
  );
};

export default Dashboard;
