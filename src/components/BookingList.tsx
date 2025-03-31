import React from "react";
import { Booking } from "../interfaces/bookingTypes";

interface BookingListProps {
  title: string;
  bookings: Booking[];
  showActions?: boolean;
  onUpdateStatus?: (id: number, status: "accepted" | "declined") => void;
}

const BookingList: React.FC<BookingListProps> = ({ title, bookings, showActions, onUpdateStatus }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-[#2A9D8F] mb-2">{title}</h2>
      <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
        {bookings.length > 0 ? (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="p-4 border rounded-lg bg-gray-100 text-cyan-500 shadow-sm">
                <p><strong>Parent:</strong> {booking.parent_name}</p>
                <p><strong>Date:</strong> {new Date(booking.job_date).toLocaleString()}</p>
                <p><strong>Duration:</strong> {booking.duration} hours</p>
                <p><strong>Rate:</strong> KSH {booking.rate}</p>
                {showActions && onUpdateStatus && (
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:space-x-2">
                    <button
                      onClick={() => onUpdateStatus(booking.id, "accepted")}
                      className="px-4 py-2 bg-green-500 text-white rounded w-full sm:w-auto mb-2 sm:mb-0"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => onUpdateStatus(booking.id, "declined")}
                      className="px-4 py-2 bg-red-500 text-white rounded w-full sm:w-auto"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">No bookings available.</p>
        )}
      </div>
    </div>
  );
};

export default BookingList;
