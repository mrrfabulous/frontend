import { User, Train, Booking } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+2347012345678',
    isAdmin: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+2348012345678'
  }
];

export const CITIES = [
  'Lagos',
  'Abuja',
  'Port Harcourt',
  'Kano',
  'Ibadan',
  'Kaduna',
  'Enugu',
  'Benin City',
  'Warri',
  'Jos',
  'Calabar',
  'Abeokuta',
  'Onitsha',
  'Maiduguri',
  'Aba'
];

export const mockTrains: Train[] = [
  {
    id: '1',
    name: 'Express 101',
    from: 'Lagos',
    to: 'Abuja',
    departureTime: '2024-03-25T08:00:00',
    arrivalTime: '2024-03-25T14:00:00',
    price: 15000,
    availableSeats: 45,
    class: ['economy', 'business', 'first']
  },
  {
    id: '2',
    name: 'Coastal Line',
    from: 'Lagos',
    to: 'Port Harcourt',
    departureTime: '2024-03-26T09:30:00',
    arrivalTime: '2024-03-26T18:30:00',
    price: 18000,
    availableSeats: 32,
    class: ['business', 'first']
  },
  {
    id: '3',
    name: 'Northern Express',
    from: 'Abuja',
    to: 'Kano',
    departureTime: '2024-03-27T07:00:00',
    arrivalTime: '2024-03-27T13:00:00',
    price: 12000,
    availableSeats: 50,
    class: ['economy', 'business']
  },
  {
    id: '4',
    name: 'Eastern Comfort',
    from: 'Port Harcourt',
    to: 'Enugu',
    departureTime: '2024-03-28T10:00:00',
    arrivalTime: '2024-03-28T15:30:00',
    price: 13500,
    availableSeats: 38,
    class: ['economy', 'business', 'first']
  },
  {
    id: '5',
    name: 'Western Line',
    from: 'Lagos',
    to: 'Ibadan',
    departureTime: '2024-03-25T11:00:00',
    arrivalTime: '2024-03-25T13:30:00',
    price: 8000,
    availableSeats: 55,
    class: ['economy', 'business']
  },
  {
    id: '6',
    name: 'Capital Connect',
    from: 'Abuja',
    to: 'Kaduna',
    departureTime: '2024-03-26T14:00:00',
    arrivalTime: '2024-03-26T16:30:00',
    price: 9500,
    availableSeats: 42,
    class: ['economy', 'business', 'first']
  },
  {
    id: '7',
    name: 'South East Express',
    from: 'Enugu',
    to: 'Aba',
    departureTime: '2024-03-27T09:00:00',
    arrivalTime: '2024-03-27T12:30:00',
    price: 11000,
    availableSeats: 35,
    class: ['economy', 'business']
  },
  {
    id: '8',
    name: 'Delta Line',
    from: 'Warri',
    to: 'Port Harcourt',
    departureTime: '2024-03-28T08:30:00',
    arrivalTime: '2024-03-28T12:00:00',
    price: 10500,
    availableSeats: 40,
    class: ['economy', 'business']
  },
  {
    id: '9',
    name: 'Middle Belt Express',
    from: 'Jos',
    to: 'Abuja',
    departureTime: '2024-03-29T07:30:00',
    arrivalTime: '2024-03-29T13:00:00',
    price: 14000,
    availableSeats: 45,
    class: ['economy', 'business', 'first']
  },
  {
    id: '10',
    name: 'Cross River Line',
    from: 'Calabar',
    to: 'Port Harcourt',
    departureTime: '2024-03-30T10:30:00',
    arrivalTime: '2024-03-30T15:00:00',
    price: 12500,
    availableSeats: 38,
    class: ['economy', 'business']
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    trainId: '1',
    train: mockTrains[0],
    seat: {
      id: 'seat-1',
      number: '12A',
      class: 'business',
      price: 5000,
      isAvailable: false
    },
    status: 'confirmed',
    totalAmount: 20000,
    bookingDate: '2024-03-20T10:30:00',
    passengerName: 'John Doe',
    ticketNumber: 'TKT123456',
    paymentMethod: 'paystack',
    paymentStatus: 'completed',
    paymentReference: 'PST-123456789'
  },
  {
    id: '2',
    userId: '2',
    trainId: '2',
    train: mockTrains[1],
    seat: {
      id: 'seat-2',
      number: '5A',
      class: 'first',
      price: 8000,
      isAvailable: false
    },
    status: 'completed',
    totalAmount: 26000,
    bookingDate: '2024-03-15T15:45:00',
    passengerName: 'Jane Smith',
    ticketNumber: 'TKT789012',
    paymentMethod: 'card',
    paymentStatus: 'completed',
    paymentReference: 'CRD-987654321'
  }
];