import React from "react";
const EventTable = ({
  events = [],
  onRowClick,
  onEdit,
  userRole,
  onSendInvite,
  onAcceptInvite,
  onRejectInvite,
  onCheckIn,
}) => {
  console.log("events ===", events);

  // Normalize each item into a flat event object + attendee flags
  const normalize = (item) => {
    if (userRole === "HOST") {
      // Hosts receive a flat event object
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        startDateTime: item.startDateTime,
        location: item.location,
        rsvpDeadline: item.rsvpDeadline,
        maxAttendees: item.maxAttendees,
        status: item.status,
        hostId: item.hostId,
      };
    } else {
      // Attendees receive an RSVP object with `event` nested
      const evt = item.event || {};
      return {
        id: evt.id,
        title: evt.title,
        description: evt.description,
        startDateTime: evt.startDateTime,
        location: evt.location,
        rsvpDeadline: evt.rsvpDeadline,
        maxAttendees: evt.maxAttendees,
        status: evt.status,
        cancelled: item.cancelled,
        confirmed: item.confirmed,
        rsvpId: item.id,
        checkInEnabled: evt.checkInEnabled || false,
        checkedIn: item.checkedIn || false, // needed for accept/reject API calls
      };
    }
  };

  if (events.length === 0) {
    return <p className="text-gray-500 text-sm">No events found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border mt-2 text-left text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1"></th>
            <th className="px-2 py-1 whitespace-nowrap">Title</th>
            <th className="px-2 py-1 whitespace-nowrap">Description</th>
            <th className="px-2 py-1 whitespace-nowrap">Date</th>
            <th className="px-2 py-1 whitespace-nowrap">Location</th>
            <th className="px-2 py-1 whitespace-nowrap">RSVP Deadline</th>

            {/* Only show “Max Attendees” for hosts */}
            {userRole === "HOST" && (
              <th className="px-2 py-1 whitespace-nowrap">Max Attendees</th>
            )}
            <th className="px-2 py-1 whitespace-nowrap">
              {userRole === "HOST" ? "Status" : "Invite Status"}
            </th>

            {userRole === "ATTENDEE" && (
              <th className="px-2 py-1 whitespace-nowrap">Check In</th>
            )}

            {/* Only hosts can Edit */}
            {userRole === "HOST" && (
              <th className="px-2 py-1 whitespace-nowrap">Edit</th>
            )}

            {/* Only hosts can Send Invite */}
            {userRole === "HOST" && (
              <th className="px-2 py-1 whitespace-nowrap">Invite</th>
            )}
          </tr>
        </thead>
        <tbody>
          {events.map((rawItem) => {
            const event = normalize(rawItem);

            return (
              <tr
                key={
                  userRole === "HOST" ? event.id : `${event.id}-${event.rsvpId}`
                }
                onClick={() => onRowClick?.(event)}
                className="cursor-pointer border-t hover:bg-gray-50"
              >
                <td className="px-2 py-1">
                  {event.status === "LIVE" ? (
                    <span className="inline-flex items-center text-red-600 animate-pulse">
                      ● Live
                    </span>
                  ) : null}
                </td>
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
                <td className="px-2 py-1">{event.location || "—"}</td>
                <td className="border px-4 py-2">
                  {new Date(event.rsvpDeadline).toLocaleString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>

                {/* Max Attendees only for hosts */}
                {userRole === "HOST" && (
                  <td className="px-2 py-1">{event.maxAttendees}</td>
                )}

                {/* Status column: HOST sees event.status; ATTENDEE sees accept/reject or status text */}
                <td className="px-2 py-1">
                  {userRole === "HOST" ? (
                    event.status
                  ) : event.cancelled ? (
                    <span className="text-red-600 font-medium">Cancelled</span>
                  ) : event.confirmed ? (
                    <span className="text-green-600 font-medium">Accepted</span>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAcceptInvite?.(event.rsvpId);
                        }}
                        className="rounded bg-green-600 px-3 py-1 text-white text-sm hover:bg-green-700 transition"
                      >
                        Accept Invite
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRejectInvite?.(event.rsvpId);
                        }}
                        className="rounded bg-red-500 px-3 py-1 text-white text-sm hover:bg-red-600 transition"
                      >
                        Reject Invite
                      </button>
                    </div>
                  )}
                </td>

                {/* {userRole === "ATTENDEE" && (
                  <td className="px-2 py-1">
                    {event.checkInEnabled ? (
                      // If not yet confirmed, show “Pending”
                      !event.confirmed ? (
                        <span className="text-yellow-600 font-medium">
                          Pending
                        </span>
                      ) : event.checkedIn ? (
                        // If already checked in, disable button
                        <button
                          disabled
                          className="rounded bg-gray-400 px-3 py-1 text-white text-sm cursor-not-allowed"
                        >
                          Checked In
                        </button>
                      ) : (
                        // Otherwise (checkInEnabled && confirmed && not checkedIn), show “Check In”
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCheckIn?.(event.id);
                          }}
                          className="rounded bg-blue-600 px-3 py-1 text-white text-sm hover:bg-blue-700 transition"
                        >
                          Check In
                        </button>
                      )
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                )} */}

                {userRole === "ATTENDEE" && (
                  <td className="px-2 py-1">
                    {!event.checkInEnabled ? (
                      <span className="text-gray-500">—</span>
                    ) : !event.confirmed ? (
                      <span className="text-yellow-600 font-medium">
                        Pending
                      </span>
                    ) : event.checkedIn ? (
                      <button
                        disabled
                        className="rounded bg-gray-400 px-3 py-1 text-white text-sm cursor-not-allowed"
                      >
                        Checked In
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCheckIn?.(event.id);
                        }}
                        className="rounded bg-blue-600 px-3 py-1 text-white text-sm hover:bg-blue-700 transition"
                      >
                        Check In
                      </button>
                    )}
                  </td>
                )}

                {/* Edit button only for hosts */}
                {userRole === "HOST" && (
                  <td className="px-2 py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(event);
                      }}
                      className="rounded bg-purple-500 px-3 py-1 text-white text-sm hover:bg-purple-700 transition"
                    >
                      Edit
                    </button>
                  </td>
                )}

                {/* Invite button only for hosts */}
                {userRole === "HOST" && (
                  <td className="px-2 py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSendInvite(event.id);
                      }}
                      className="rounded bg-green-600 px-3 py-1 text-white text-sm hover:bg-green-700 transition"
                    >
                      Send Invite
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EventTable;
