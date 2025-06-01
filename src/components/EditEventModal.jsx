// EditEventModal.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const EditEventModal = ({ isOpen, event, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDateTime: "",   // "YYYY-MM-DDTHH:MM"
    rsvpDeadline: "",    // "YYYY-MM-DDTHH:MM"
    isVirtual: false,
    location: "",
    maxAttendees: "",
  });

  // Utility: convert a full ISO string (with offset) 
  // into "YYYY-MM-DDTHH:MM" local for <input type="datetime-local">
  const toDateTimeLocalString = (isoString) => {
    if (!isoString) return "";
    const dt = new Date(isoString);
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    const hours = String(dt.getHours()).padStart(2, "0");
    const minutes = String(dt.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Utility: convert "YYYY-MM-DDTHH:MM" into full ISO with local offset (e.g. +05:30)
  const toLocalWithOffset = (localDateTime) => {
    if (!localDateTime) return "";
    const withSeconds = localDateTime + ":00"; // e.g. "2025-06-15T10:00:00"
    const offsetMinutes = new Date().getTimezoneOffset(); 
    const totalMinutes = -offsetMinutes;
    const sign = totalMinutes >= 0 ? "+" : "-";
    const absMinutes = Math.abs(totalMinutes);
    const hoursOff = String(Math.floor(absMinutes / 60)).padStart(2, "0");
    const minsOff = String(absMinutes % 60).padStart(2, "0");
    return `${withSeconds}${sign}${hoursOff}:${minsOff}`; 
    // e.g. "2025-06-15T10:00:00+05:30"
  };

  // When `event` changes (or modal opens), populate the form fields:
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        startDateTime: toDateTimeLocalString(event.startDateTime),
        rsvpDeadline: toDateTimeLocalString(event.rsvpDeadline),
        isVirtual: event.isVirtual || false,
        location: event.location || "",
        maxAttendees: event.maxAttendees?.toString() || "",
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event) return;

    // Basic validation:
    const {
      title,
      description,
      startDateTime,
      rsvpDeadline,
      location,
      maxAttendees,
      isVirtual,
    } = formData;
    if (
      !title ||
      !description ||
      !startDateTime ||
      !rsvpDeadline ||
      (!isVirtual && location.trim() === "") ||
      !maxAttendees
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Build the updated payload exactly like your API expects:
    const payload = {
      title: title.trim(),
      description: description.trim(),
      startDateTime: toLocalWithOffset(startDateTime),
      rsvpDeadline: toLocalWithOffset(rsvpDeadline),
      isVirtual,
      location: location.trim(),
      maxAttendees: Number(maxAttendees),
      status: event.status
      // If your backend allows status editing, you can include it here.
      // Otherwise, omit it so only these fields are updated.
    };

    // Grab the token
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Not authenticated. Please log in again.");
      return;
    }

    try {
      const response = await fetch(
        `${apiBaseUrl}/events/${event.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      // If unauthorized or forbidden, maybe redirect to login:
      if (response.status === 401 || response.status === 403) {
        toast.error("Session expired. Please log in again.");
        onClose();
        return;
      }

      const json = await response.json();
      if (json.status === "success" && json.data) {
        toast.success("Event updated successfully!");
        // Pass the updated event object back up:
        onSave(json.data);
        onClose();
      } else {
        console.error("Edit failed:", json.message);
        toast.error(`Failed to update: ${json.message}`);
      }
    } catch (err) {
      console.error("Network or server error:", err);
      toast.error("Failed to update event. Please try again.");
    }
  };

  if (!isOpen || !event) return null;
  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal panel */}
      <div className="relative w-11/12 max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        {/* Close button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close edit modal"
        >
          ✕
        </button>

        <h2 className="mb-4 text-2xl font-semibold text-gray-800">
          Edit Event
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-1"
            >
              Event Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-2 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Start Date & Time */}
          <div>
            <label
              htmlFor="startDateTime"
              className="block text-gray-700 font-medium mb-1"
            >
              Start Date &amp; Time
            </label>
            <input
              id="startDateTime"
              name="startDateTime"
              type="datetime-local"
              value={formData.startDateTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* RSVP Deadline */}
          <div>
            <label
              htmlFor="rsvpDeadline"
              className="block text-gray-700 font-medium mb-1"
            >
              RSVP Deadline
            </label>
            <input
              id="rsvpDeadline"
              name="rsvpDeadline"
              type="datetime-local"
              value={formData.rsvpDeadline}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Virtual vs Physical */}
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isVirtual"
                checked={formData.isVirtual}
                onChange={handleChange}
                className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="ml-2 text-gray-700 font-medium">
                Is this a virtual event?
              </span>
            </label>
          </div>

          {/* Location (only shown if not virtual) */}
          {!formData.isVirtual && (
            <div>
              <label
                htmlFor="location"
                className="block text-gray-700 font-medium mb-1"
              >
                Location (Physical Address)
              </label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                required={!formData.isVirtual}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* Max Attendees */}
          <div>
            <label
              htmlFor="maxAttendees"
              className="block text-gray-700 font-medium mb-1"
            >
              Max Attendees
            </label>
            <input
              id="maxAttendees"
              name="maxAttendees"
              type="number"
              min="1"
              value={formData.maxAttendees}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
