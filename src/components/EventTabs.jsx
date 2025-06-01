import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import EventTable from "./EventTable";
import EditEventModal from "./EditEventModal";
import toast from "react-hot-toast";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const EventTabs = ({ events = [], userRole, onEventUpdated }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    userRole === "HOST" ? "all" : "my"
  );
  const [eventToEdit, setEventToEdit] = useState(null);

  const token = localStorage.getItem("token");
  const currentUserId = useMemo(() => {
    if (!token) return null;
    try {
      // JWT format: HEADER.PAYLOAD.SIGNATURE
      const payloadBase64 = token.split(".")[1];
      // atob() decodes a base64‐encoded string in the browser
      const payloadJson = JSON.parse(atob(payloadBase64));
      // Assuming the user ID is stored in the `sub` claim:
      return payloadJson.sub || null;
    } catch (e) {
      console.error("Failed to decode JWT payload:", e);
      return null;
    }
  }, [token]);

  // 3. Now filter using the decoded user ID
  const filteredEvents = useMemo(() => {
    // For a HOST, we keep "all", "hosting", "attending"
    if (userRole === "HOST") {
      return {
        all: events,
        hosting: events.filter((e) => e.hostId === currentUserId),
        attending: events.filter((e) =>
          Array.isArray(e.attendees)
            ? e.attendees.includes(currentUserId)
            : false
        ),
      };
    } else {
      return {
        my: events,
      };
    }
  }, [events, userRole, currentUserId]);

  React.useEffect(() => {
    if (userRole !== "HOST") {
      setActiveTab("my");
    }
  }, [userRole]);

  // Row‐click handler: navigate to event detail page
  const handleRowClick = (eventObj) => {
    navigate(`/events/${eventObj.id}`);
  };

  // Edit-click → open edit modal
  const handleEdit = (eventObj) => {
    setEventToEdit(eventObj);
  };
  const handleCloseEdit = () => {
    setEventToEdit(null);
  };

  // Accept invite (ATTENDEE)
  const handleAcceptInvite = async (rsvpId) => {
    console.log(rsvpId,'sdhb')
    if (!token) {
      toast.error("Not authenticated");
      return;
    }
    try {
      const res = await fetch(
        `${apiBaseUrl}/rsvps/${rsvpId}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 401 || res.status === 403) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      const json = await res.json();
      if (json.status === "success" && json.data) {
        toast.success("Invite accepted");
        // json.data is the updated RSVP wrapper
        onEventUpdated(json.data);
      } else {
        toast.error(`Accept failed: ${json.message}`);
      }
    } catch (err) {
      console.error("Accept error:", err);
      toast.error("Network error. Try again.");
    }
  };

  // Reject invite (ATTENDEE)
  const handleRejectInvite = async (rsvpId) => {
    if (!token) {
      toast.error("Not authenticated");
      return;
    }
    try {
      const res = await fetch(
        `${apiBaseUrl}/rsvps/${rsvpId}/cancel`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 401 || res.status === 403) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      const json = await res.json();
      if (json.status === "success" && json.data) {
        toast.success("Invite rejected");
        onEventUpdated(json.data);
      } else {
        toast.error(`Reject failed: ${json.message}`);
      }
    } catch (err) {
      console.error("Reject error:", err);
      toast.error("Network error. Try again.");
    }
  };

  const handleCheckIn = async (Id) => {
    if (!token) {
      toast.error("Not authenticated");
      return;
    }
    try {
      const res = await fetch(
        `${apiBaseUrl}/checkin/${Id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 401 || res.status === 403) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
        return;
      }
      const json = await res.json();
      if (json.status === "success" && json.data) {
        toast.success("Checked In!");
        onEventUpdated(json.data);
      } else {
        toast.error(`Check‐in failed: ${json.message}`);
      }
    } catch (err) {
      console.error("Check-in error:", err);
      toast.error("Network error. Try again.");
    }
  };

  // Called by EditEventModal on successful save
  const handleSaveEdit = (updatedEvent) => {
    // Bubble up to parent (Dashboard) so it can update its list
    onEventUpdated(updatedEvent);
  };

  const tabsToRender = useMemo(() => {
    if (userRole === "HOST") {
      return [{ key: "all", label: "All Events:" }];
    } else {
      return [{ key: "my", label: "My Events" }];
    }
  }, [userRole]);

  const handleSendInvite = (eventId) => {
    // Navigate to /invite with only that one event ID
    navigate("/invite", { state: { eventId } });
  };

  const tabStyle = (tab) =>
    `px-4 py-2 rounded-t-md cursor-pointer ${
      activeTab === tab
        ? "bg-purple-600 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div className="mt-8">
      <div className="flex space-x-2 border-b">
        {tabsToRender.map((t) => (
          <div
            key={t.key}
            className={tabStyle(t.key)}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </div>
        ))}
      </div>

      <div className="bg-white p-4 border rounded-b-md shadow-sm">
        <EventTable
          events={filteredEvents[activeTab] || []}
          onRowClick={handleRowClick}
          onEdit={handleEdit}
          userRole={userRole}
          onSendInvite={handleSendInvite}
          onAcceptInvite={handleAcceptInvite}
          onRejectInvite={handleRejectInvite}
          onCheckIn={handleCheckIn}
        />
      </div>

      {/* Edit Modal */}
      <EditEventModal
        isOpen={!!eventToEdit}
        event={eventToEdit}
        onClose={handleCloseEdit}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default EventTabs;
