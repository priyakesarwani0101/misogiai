import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view event details");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${apiBaseUrl}/events/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 401 || response.status === 403) {
          toast.error("Session expired. Please log in again.");
          navigate("/login");
          return;
        }

        const data = await response.json();
        if (data.status === "success") {
          setEvent(data.data);
        } else {
          toast.error(data.message || "Failed to fetch event details");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to fetch event details");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header with back button */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className="text-purple-600 hover:text-purple-800 flex items-center"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">{event.title}</h1>
          </div>

          {/* Event Details */}
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Description
              </h2>
              <p className="text-gray-600">{event.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Date & Time
                  </h3>
                  <p className="text-gray-600">
                    {new Date(event.startDateTime).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    RSVP Deadline
                  </h3>
                  <p className="text-gray-600">
                    {new Date(event.rsvpDeadline).toLocaleString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700">Mode</h3>
                  <p className="text-gray-600">
                    {event.isVirtual ? "Virtual" : "Physical"}
                  </p>
                </div>

                {!event.isVirtual && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                      Location
                    </h3>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Maximum Attendees
                  </h3>
                  <p className="text-gray-600">{event.maxAttendees}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Hosted By
                  </h3>
                  <p className="text-gray-600">User ID: {event.hostId}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    Attendees
                  </h3>
                  <div className="text-gray-600">
                    {event.attendees && event.attendees.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {event.attendees.map((attendee, index) => (
                          <li key={index}>User ID: {attendee}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No attendees yet</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 