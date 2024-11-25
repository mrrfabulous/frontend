import { useState, useEffect } from 'react';
import { Train, Calendar, Clock, MapPin } from 'lucide-react';
import axios from 'axios';
import { formatCurrency } from '../utils/format';

interface Booking {
  _id: string;
  trainName: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: string[];
  amount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const statusColors = {
  upcoming: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function BookingsList() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('/api/bookings');
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 text-primary-600 hover:text-primary-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-8">
        <Train className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't made any train bookings yet.
        </p>
        <div className="mt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            Book a train
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Train className="h-5 w-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {booking.trainName}
                </h3>
                <span
                  className={\`px-2.5 py-0.5 rounded-full text-xs font-medium \${
                    statusColors[booking.status]
                  }\`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {booking.from} → {booking.to}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {new Date(booking.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{booking.time}</span>
                </div>

                <div className="text-sm text-gray-600">
                  Seat(s): {booking.seats.join(', ')}
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(booking.amount)}
              </p>
              <button className="mt-2 text-sm text-primary-600 hover:text-primary-700">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
