import { useEffect } from 'react';
import { useBookingStore } from '../store/useBookingStore';
import { useAuthStore } from '../store/useAuthStore';
import { generateEmailTemplate, sendEmail } from '../services/emailService';
import { useNotificationStore } from '../store/useNotificationStore';
import toast from 'react-hot-toast';

export const useEmailNotifications = () => {
  const bookings = useBookingStore((state) => state.bookings);
  const user = useAuthStore((state) => state.user);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const sendBookingEmail = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || !user?.email) return;

    try {
      const template = generateEmailTemplate('booking', booking);
      await sendEmail(user.email, template);
      
      addNotification({
        userId: user.id,
        type: 'booking',
        title: 'Booking Confirmation Sent',
        message: `Booking confirmation email sent for ticket #${booking.ticketNumber}`,
      });
    } catch (error) {
      toast.error('Failed to send booking confirmation email');
    }
  };

  const sendCancellationEmail = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || !user?.email) return;

    try {
      const template = generateEmailTemplate('cancellation', booking);
      await sendEmail(user.email, template);
      
      addNotification({
        userId: user.id,
        type: 'cancellation',
        title: 'Booking Cancellation Confirmed',
        message: `Cancellation confirmation email sent for ticket #${booking.ticketNumber}`,
      });
    } catch (error) {
      toast.error('Failed to send cancellation email');
    }
  };

  const sendPaymentEmail = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || !user?.email) return;

    try {
      const template = generateEmailTemplate('payment', booking);
      await sendEmail(user.email, template);
      
      addNotification({
        userId: user.id,
        type: 'payment',
        title: 'Payment Confirmation',
        message: `Payment confirmation email sent for ticket #${booking.ticketNumber}`,
      });
    } catch (error) {
      toast.error('Failed to send payment confirmation email');
    }
  };

  const sendReminderEmail = async (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking || !user?.email) return;

    try {
      const template = generateEmailTemplate('reminder', booking);
      await sendEmail(user.email, template);
      
      addNotification({
        userId: user.id,
        type: 'reminder',
        title: 'Journey Reminder',
        message: `Reminder email sent for your journey tomorrow on ticket #${booking.ticketNumber}`,
      });
    } catch (error) {
      toast.error('Failed to send reminder email');
    }
  };

  // Check for upcoming journeys daily and send reminders
  useEffect(() => {
    if (!user) return;

    const checkUpcomingJourneys = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const dayAfterTomorrow = new Date(tomorrow);
      dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

      const upcomingBookings = bookings.filter(booking => {
        const departureDate = new Date(booking.train.departureTime);
        return (
          booking.status === 'confirmed' &&
          departureDate >= tomorrow &&
          departureDate < dayAfterTomorrow
        );
      });

      upcomingBookings.forEach(booking => {
        sendReminderEmail(booking.id);
      });
    };

    // Check once when component mounts
    checkUpcomingJourneys();

    // Set up daily check
    const interval = setInterval(checkUpcomingJourneys, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, bookings]);

  return {
    sendBookingEmail,
    sendCancellationEmail,
    sendPaymentEmail,
    sendReminderEmail
  };
};