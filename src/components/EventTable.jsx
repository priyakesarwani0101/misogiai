import React from "react";
const EventTable = ({
  events = [],
  onRowClick,
  onEdit,
  userRole,
  onSendInvite,
}) => {
  if (events.length === 0) {
    return <p className="text-gray-500 text-sm">No events found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border mt-2 text-left text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1 whitespace-nowrap">Title</th>
            <th className="px-2 py-1 whitespace-nowrap">Description</th>
            <th className="px-2 py-1 whitespace-nowrap">Date</th>
            <th className="px-2 py-1 whitespace-nowrap">Location</th>
            <th className="px-2 py-1 whitespace-nowrap">RSVP Deadline</th>
            <th className="px-2 py-1 whitespace-nowrap">Max Attendees</th>
            <th className="px-2 py-1 whitespace-nowrap">Status</th>
            <th className="px-2 py-1 whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr
              key={event.id}
              onClick={() => onRowClick?.(event)}
              className="cursor-pointer border-t hover:bg-gray-50"
            >
              <td className="px-2 py-1">{event.title}</td>
              <td className="px-2 py-1 truncate max-w-[150px]">
                {event.description}
              </td>
              <td className="border px-4 py-2">
                {new Date(event.startDateTime).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-2 py-1">{event.location}</td>
              <td className="border px-4 py-2">
                {new Date(event.rsvpDeadline).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td className="px-2 py-1">{event.maxAttendees}</td>
              <td className="px-2 py-1">{event.status}</td>
              <td className="px-2 py-1 space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(event);
                  }}
                  className="rounded bg-purple-500 px-3 py-1 text-white text-sm hover:bg-purple-700 transition"
                >
                  Edit
                </button>
                {userRole === "HOST" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendInvite(event.id);
                      }}
                      className="rounded bg-green-600 px-3 py-1 text-white text-sm hover:bg-green-700 transition"
                    >
                      Send Invite
                    </button>
                    <a
                      href={`/events/${event.id}/analytics`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded bg-blue-600 px-3 py-1 text-white text-sm hover:bg-blue-700 transition inline-block"
                    >
                      Analytics
                    </a>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;