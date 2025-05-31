// src/components/AttendeeList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const AttendeeList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Retrieve selectedEventIds from location.state
  const { eventId } = location.state || {};

  // If no eventIds passed, redirect back to dashboard
  useEffect(() => {
    if (!eventId) {
      navigate("/dashboard");
    }
  }, [eventId, navigate]);

  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Which attendee IDs are checked
  const [selectedAttendeeIds, setSelectedAttendeeIds] = useState([]);

  // 2. Fetch all attendees on mount
  useEffect(() => {
    if (!eventId) return;
    const fetchAttendees = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Not authenticated. Redirecting to login.");
        navigate("/login");
        return;
      }
      try {
        const response = await fetch(`https://4f6b-49-36-144-50.ngrok-free.app/rsvps/event/${eventId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          toast.error("Unauthorized. Redirecting to login.");
          navigate("/login");
          return;
        }

        const json = await response.json();
        console.log('json==',json.data)
        if (json.status === "success" ) {
          setAttendees(json.data);
        } else {
          console.error("Failed to fetch attendees:", json.message);
          toast.error("Could not load attendees. Please try again later.");
        }
      } catch (err) {
        console.error("Network error while fetching attendees:", err);
        toast.error("Network error. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };


    fetchAttendees();
  }, [eventId, navigate]);

  // 3. Handle “select all” checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedAttendeeIds(attendees.map((a) => a.id));
    } else {
      setSelectedAttendeeIds([]);
    }
  };

  const handleAttendeeCheckbox = (e, attendeeId) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedAttendeeIds([...selectedAttendeeIds, attendeeId]);
    } else {
      setSelectedAttendeeIds(
        selectedAttendeeIds.filter((id) => id !== attendeeId)
      );
    }
  };

  const handleSendInvitations = async () => {
    if (selectedAttendeeIds.length === 0) {
      toast.error("Please select at least one attendee.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not authenticated. Redirecting to login.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`https://4f6b-49-36-144-50.ngrok-free.app/rsvps/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId, // single event
          attendeeIds: selectedAttendeeIds,
        }),
      });

      if (response.status === 401 || response.status === 403) {
        toast.error("Unauthorized. Redirecting to login.");
        navigate("/login");
        return;
      }

      const json = await response.json();
      if (json.status === "success") {
        toast.success("Invitations sent successfully!");
        navigate("/dashboard");
      } else {
        console.error("Failed to send invites:", json.message);
        toast.error(`Failed to send invitations: ${json.message}`);
      }
    } catch (err) {
      console.error("Network error while sending invites:", err);
      toast.error("Network error. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Invite Attendees to Event
      </h2>

      <p className="mb-4 text-gray-600">
        You are inviting attendees to event ID:{" "}
        <span className="font-medium">{eventId}</span>
      </p>

      {loading ? (
        <p className="text-gray-500">Loading attendees…</p>
      ) : attendees.length === 0 ? (
        <p className="text-gray-500">No attendees found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-left text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 py-1 whitespace-nowrap">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      attendees.length > 0 &&
                      selectedAttendeeIds.length === attendees.length
                    }
                  />
                </th>
                <th className="px-2 py-1">Name</th>
                <th className="px-2 py-1">Email</th>
                <th className="px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendees?.map((att) => (
                <tr key={att.id} className="border-t hover:bg-gray-50">
                  <td className="px-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedAttendeeIds.includes(att.user.id)}
                      onChange={(e) => handleAttendeeCheckbox(e, att.user.id)}
                    />
                  </td>
                  <td className="px-2 py-1">{att.user.name}</td>
                  <td className="px-2 py-1">{att.user.email}</td>
                  <td className="px-2 py-1">{att.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Send Invitation Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSendInvitations}
          disabled={selectedAttendeeIds.length === 0}
          className={`px-4 py-2 rounded font-medium transition
            ${
              selectedAttendeeIds.length > 0
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }`}
        >
          Send Invitations
        </button>
      </div>
    </div>
  );
};

export default AttendeeList;