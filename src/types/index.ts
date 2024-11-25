export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Train {
  id: string;
  name: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
}

export interface Seat {
  id: string;
  number: string;
  status: 'available' | 'booked';
  class: 'first' | 'economy';
}

export interface Booking {
  id: string;
  userId: string;
  trainId: string;
  seats: Seat[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface PaymentDetails {
  bookingId: string;
  amount: number;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'payment' | 'cancellation' | 'reminder';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface PaymentHistory {
  id: string;
  userId: string;
  bookingId: string;
  amount: number;
  status: 'completed' | 'failed' | 'pending';
  method: 'card' | 'paystack';
  reference: string;
  createdAt: string;
}