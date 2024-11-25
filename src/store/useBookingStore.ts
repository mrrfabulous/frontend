import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Booking } from '../types';
import { mockBookings } from '../data/mockData';

interface BookingState {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  getBookingsByUserId: (userId: string) => Booking[];
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: mockBookings,
      addBooking: (booking) => set((state) => ({ 
        bookings: [...state.bookings, booking] 
      })),
      cancelBooking: (bookingId) => set((state) => ({
        bookings: state.bookings.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'cancelled' as const }
            : booking
        )
      })),
      getBookingsByUserId: (userId) => {
        return get().bookings.filter(booking => booking.userId === userId);
      }
    }),
    {
      name: 'booking-store',
    }
  )
);