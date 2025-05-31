// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const CreateEventForm = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     date: "",
//     time: "",
//     rsvpDeadline: "",
//     location: "",
//     maxAttendees: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log('form data===',formData)
//     try {
//       // TODO: Add your API call here to create the event
//       // const response = await fetch(`${apiBaseUrl}/events`, {
//       //   method: 'POST',
//       //   headers: {
//       //     'Content-Type': 'application/json',
//       //   },
//       //   body: JSON.stringify(formData),
//       // });

//       toast.success("Event created successfully!");
//       navigate("/"); // Navigate back to dashboard
//     } catch (error) {
//       toast.error("Failed to create event");
//       console.error("Error creating event:", error);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto mt-5 p-5 bg-white rounded-xl shadow-lg">
//       <h2 className="text-3xl font-semibold text-gray-800 mb-4 border-b pb-2">
//         🎉 Create a New Event
//       </h2>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Title */}
//         <div>
//           <label
//             htmlFor="title"
//             className="block text-gray-700 font-medium mb-1"
//           >
//             Event Title
//           </label>
//           <input
//             id="title"
//             name="title"
//             type="text"
//             value={formData.title}
//             onChange={handleChange}
//             required
//             placeholder="Enter event title"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label
//             htmlFor="description"
//             className="block text-gray-700 font-medium mb-1"
//           >
//             Description
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             rows="4"
//             value={formData.description}
//             onChange={handleChange}
//             required
//             placeholder="Write a short description about the event..."
//             className="w-full px-2 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>

//         {/* Date & Time */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label
//               htmlFor="date"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Date
//             </label>
//             <input
//               id="date"
//               name="date"
//               type="date"
//               value={formData.date}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="time"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Time
//             </label>
//             <input
//               id="time"
//               name="time"
//               type="time"
//               value={formData.time}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>
//         </div>

//         {/* RSVP Deadline & Max Attendees */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label
//               htmlFor="rsvpDeadline"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               RSVP Deadline
//             </label>
//             <input
//               id="rsvpDeadline"
//               name="rsvpDeadline"
//               type="date"
//               value={formData.rsvpDeadline}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="maxAttendees"
//               className="block text-gray-700 font-medium mb-1"
//             >
//               Max Attendees
//             </label>
//             <input
//               id="maxAttendees"
//               name="maxAttendees"
//               type="number"
//               min="1"
//               value={formData.maxAttendees}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//             />
//           </div>
//         </div>

//         {/* Location */}
//         <div>
//           <label
//             htmlFor="location"
//             className="block text-gray-700 font-medium mb-1"
//           >
//             Location / Virtual URL
//           </label>
//           <input
//             id="location"
//             name="location"
//             type="text"
//             value={formData.location}
//             onChange={handleChange}
//             required
//             placeholder="Enter physical address or virtual meeting link"
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
//           />
//         </div>

//         {/* Buttons */}
//         <div className="flex justify-end gap-4 pt-4 border-t mt-6">
//           <button
//             type="button"
//             onClick={() => navigate("/")}
//             className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-5 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition"
//           >
//             Create Event
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateEventForm;


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateEventForm = () => {
  const navigate = useNavigate();

  // We now keep two datetime‐local strings in state:
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDateTime: "",   // e.g. "2025-06-15T10:00"
    rsvpDeadline: "",    // e.g. "2025-06-10T23:59"
    isVirtual: false,    // added, as your final JSON expects it
    location: "",
    maxAttendees: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      // if it’s a checkbox, take checked; otherwise take the string value
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Utility: given a "YYYY-MM-DDTHH:mm" (local) string, return "YYYY-MM-DDTHH:mm:00+05:30"
  const toLocalWithOffset = (localDateTime) => {
    if (!localDateTime) return "";

    // localDateTime is like "2025-06-15T10:00"
    // First, append seconds
    const withSeconds = localDateTime + ":00"; // "2025-06-15T10:00:00"

    // Compute the offset of the user's browser:
    const offsetMinutes = new Date().getTimezoneOffset(); 
    // getTimezoneOffset() returns difference (in minutes) UTC − Local. 
    // For IST, getTimezoneOffset() = –330 (because IST is UTC+5:30).
    // We want a string like "+05:30" or "-04:00".

    const totalMinutes = -offsetMinutes; 
    // Now totalMinutes = +330 for IST (because –(–330) = +330)

    const sign = totalMinutes >= 0 ? "+" : "-";
    const absMinutes = Math.abs(totalMinutes);
    const hours = String(Math.floor(absMinutes / 60)).padStart(2, "0");
    const minutes = String(absMinutes % 60).padStart(2, "0");

    return `${withSeconds}${sign}${hours}:${minutes}`; 
    // e.g. "2025-06-15T10:00:00+05:30"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData)
    // Basic client‐side validation:
    const {
      title,
      description,
      startDateTime,
      rsvpDeadline,
      location,
      maxAttendees,
    } = formData;
    if (
      !title ||
      !description ||
      !startDateTime ||
      !rsvpDeadline ||
      (!location && !formData.isVirtual) ||
      !maxAttendees ||
      (formData.isVirtual === false && location.trim() === "")
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Build the payload exactly in the shape you provided:
    const payload = {
      title: formData.title,
      description: formData.description,
      startDateTime: toLocalWithOffset(formData.startDateTime),
      rsvpDeadline: toLocalWithOffset(formData.rsvpDeadline),
      isVirtual: formData.isVirtual,
      location: formData.location,
      maxAttendees: Number(formData.maxAttendees),
    };

    try {
      const token = localStorage.getItem("token"); 
      const response = await fetch(`https://4f6b-49-36-144-50.ngrok-free.app/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If your API needs Authorization, add:
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (json.status === "success") {
        toast.success("Event created successfully!");
        navigate("/");
      } else {
        console.error("Create event failed:", json.message);
        toast.error(`Failed to create event: ${json.message}`);
      }
    } catch (err) {
      console.error("Network or parsing error:", err);
      toast.error("Failed to create event. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-5 p-5 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4 border-b pb-2">
        🎉 Create a New Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
            Event Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter event title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-gray-700 font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Write a short description about the event..."
            className="w-full px-2 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Start Date & Time */}
        <div>
          <label htmlFor="startDateTime" className="block text-gray-700 font-medium mb-1">
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
          <label htmlFor="rsvpDeadline" className="block text-gray-700 font-medium mb-1">
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

        {/* Virtual or Physical */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isVirtual"
              checked={formData.isVirtual}
              onChange={handleChange}
              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="ml-2 text-gray-700 font-medium">Is this a virtual event?</span>
          </label>
        </div>

        {/* Location (only if not virtual) */}
        {!formData.isVirtual && (
          <div>
            <label htmlFor="location" className="block text-gray-700 font-medium mb-1">
              Location (Physical Address)
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              required={!formData.isVirtual}
              placeholder="Enter physical address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        {/* Max Attendees */}
        <div>
          <label htmlFor="maxAttendees" className="block text-gray-700 font-medium mb-1">
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
            onClick={() => navigate("/")}
            className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;

