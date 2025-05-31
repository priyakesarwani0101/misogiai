// EventDetailModal.jsx
import React from "react";

const EventDetailModal = ({ isOpen, event, onClose }) => {
  if (!isOpen || !event) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal panel */}
      <div className="relative w-11/12 max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        {/* Close button (X) */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Event Details Header */}
        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          {event.title}
        </h2>

        {/* Event Details Body */}
        <div className="space-y-3 text-gray-700">
          <p>
            <span className="font-medium">Description:</span> {event.description}
          </p>
          <p>
            <span className="font-medium">Date &amp; Time:</span>{" "}
            {new Date(event.startDateTime).toLocaleString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            <span className="font-medium">RSVP Deadline:</span>{" "}
            {new Date(event.rsvpDeadline).toLocaleString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p>
            <span className="font-medium">Mode:</span>{" "}
            {event.isVirtual ? "Virtual" : "Physical"}
          </p>
          {!event.isVirtual && (
            <p>
              <span className="font-medium">Location:</span> {event.location}
            </p>
          )}
          <p>
            <span className="font-medium">Max Attendees:</span>{" "}
            {event.maxAttendees}
          </p>
          <p>
            <span className="font-medium">Hosted By (User ID):</span>{" "}
            {event.hostId}
          </p>
          <p>
            <span className="font-medium">Attendees (User IDs):</span>{" "}
            {event.attendees && event.attendees.length > 0
              ? event.attendees.join(", ")
              : "None"}
          </p>
        </div>

        {/* Footer with Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            className="rounded bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;