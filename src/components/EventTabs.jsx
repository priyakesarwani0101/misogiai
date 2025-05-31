import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import EventTable from "./EventTable";
import EventDetailModal from "./EventDetailModal";
import EditEventModal from "./EditEventModal";
const EventTabs = ({ events = [], userRole, onEventUpdated }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(
    userRole === "HOST" ? "all" : "my"
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
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
        my: events.filter((e) => e.attendees?.includes(currentUserId)),
      };
    }
  }, [events, userRole, currentUserId]);

  // Row‐click handler: open the modal with this event’s details
  const handleRowClick = (eventObj) => {
    setSelectedEvent(eventObj);
  };

  // Modal close handler
  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  // Edit-click → open edit modal
  const handleEdit = (eventObj) => {
    setEventToEdit(eventObj);
  };
  const handleCloseEdit = () => {
    setEventToEdit(null);
  };

  // Called by EditEventModal on successful save
  const handleSaveEdit = (updatedEvent) => {
    // Bubble up to parent (Dashboard) so it can update its list
    onEventUpdated(updatedEvent);
    // Also, if we are currently viewing the detail modal for this event, update it
    if (selectedEvent?.id === updatedEvent.id) {
      setSelectedEvent(updatedEvent);
    }
  };

  const tabsToRender = useMemo(() => {
    if (userRole === "HOST") {
      return [{ key: "all", label: "All Events:" }];
    } else {
      return [{ key: "my", label: "My Events" }];
    }
  }, [userRole]);

  // If the user is an attendee, make sure activeTab = "my"
  React.useEffect(() => {
    if (userRole !== "HOST") {
      setActiveTab("my");
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
        />
      </div>
      {/* Event‐detail modal (conditionally rendered) */}
      <EventDetailModal
        isOpen={!!selectedEvent}
        event={selectedEvent}
        onClose={handleCloseModal}
      />

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
