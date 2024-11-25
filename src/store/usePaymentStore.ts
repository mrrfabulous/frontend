import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PaymentHistory } from '../types';

interface PaymentState {
  payments: PaymentHistory[];
  addPayment: (payment: Omit<PaymentHistory, 'id' | 'createdAt'>) => void;
  getPaymentsByUserId: (userId: string) => PaymentHistory[];
  getPaymentsByBookingId: (bookingId: string) => PaymentHistory[];
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      payments: [],
      addPayment: (payment) => {
        const newPayment: PaymentHistory = {
          ...payment,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          payments: [newPayment, ...state.payments],
        }));
      },
      getPaymentsByUserId: (userId) => {
        return get().payments.filter((p) => p.userId === userId);
      },
      getPaymentsByBookingId: (bookingId) => {
        return get().payments.filter((p) => p.bookingId === bookingId);
      },
    }),
    {
      name: 'payment-store',
    }
  )
);