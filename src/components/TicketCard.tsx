import React, { useState } from 'react';
import { format } from 'date-fns';
import { Ticket, Calendar, MapPin, Train as TrainIcon, FileText } from 'lucide-react';
import { Booking } from '../types';
import { useBookingStore } from '../store/useBookingStore';
import QRCode from './QRCode';
import ConfirmationModal from './ConfirmationModal';
import TicketActions from './TicketActions';
import InvoiceGenerator from './InvoiceGenerator';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useEmailNotifications } from '../hooks/useEmailNotifications';
import toast from 'react-hot-toast';

interface TicketCardProps {
  booking: Booking;
  showActions?: boolean;
}

export default function TicketCard({ booking, showActions = true }: TicketCardProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const cancelBooking = useBookingStore((state) => state.cancelBooking);
  const { sendCancellationEmail } = useEmailNotifications();

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancelBooking = async () => {
    setIsCancelling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      cancelBooking(booking.id);
      await sendCancellationEmail(booking.id);
      toast.success('Booking cancelled successfully');
      setShowCancelModal(false);
    } catch (error) {
      toast.error('Failed to cancel booking. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              <h3 className="text-lg font-semibold mt-2">{booking.train.name}</h3>
              <p className="text-sm text-gray-500">Ticket #{booking.ticketNumber}</p>
            </div>
            <QRCode value={booking.ticketNumber} size={64} />
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span>{format(new Date(booking.train.departureTime), 'PPP p')}</span>
            </div>

            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-400 mt-1" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{booking.train.from}</span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(booking.train.departureTime), 'p')}
                  </span>
                </div>
                <div className="my-1 border-l-2 border-dashed border-gray-200 h-4 ml-2"></div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{booking.train.to}</span>
                  <span className="text-sm text-gray-500">
                    {format(new Date(booking.train.arrivalTime), 'p')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-sm">
              <TrainIcon className="h-4 w-4 text-gray-400 mr-2" />
              <span>Seat {booking.seat.number} ({booking.seat.class.charAt(0).toUpperCase() + booking.seat.class.slice(1)} Class)</span>
            </div>

            <div className="flex items-center text-sm">
              <Ticket className="h-4 w-4 text-gray-400 mr-2" />
              <span>Passenger: {booking.passengerName}</span>
            </div>
          </div>

          {showActions && (
            <div className="mt-6 space-y-4">
              <div className="flex space-x-4">
                <TicketActions booking={booking} />
                <PDFDownloadLink
                  document={<InvoiceGenerator booking={booking} />}
                  fileName={`invoice-${booking.ticketNumber}.pdf`}
                  className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
                >
                  {({ loading }) => (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      {loading ? 'Generating...' : 'Download Invoice'}
                    </>
                  )}
                </PDFDownloadLink>
              </div>
              
              {booking.status === 'confirmed' && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showCancelModal && (
        <ConfirmationModal
          title="Cancel Booking"
          message={`Are you sure you want to cancel your booking for ${booking.train.name}? This action cannot be undone.`}
          onConfirm={handleCancelBooking}
          onCancel={() => setShowCancelModal(false)}
          isLoading={isCancelling}
        />
      )}
    </>
  );
}