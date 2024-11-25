import { useState, useEffect } from 'react';
import { X, CreditCard, Lock } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import authService from "../services/auth.service";
import axios from "axios";
import { formatCurrency } from "../utils/format";

interface PaymentModalProps {
  amount: number;
  onClose: () => void;
  onSuccess: () => void;
}

const paymentSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, 'Invalid card number'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
  cvv: z.string().regex(/^\d{3,4}$/, 'Invalid CVV'),
  name: z.string().min(3, 'Name is required')
});

type PaymentForm = z.infer<typeof paymentSchema>;

// Using the public key for client-side integration
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

declare global {
  interface Window {
    PaystackPop: any;
  }
}

export default function PaymentModal({ amount, onClose, onSuccess }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paystack'>('paystack');
  const { user, isAuthenticated } = useAuthStore();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = async () => {
      const token = authService.getToken();
      if (token) {
        try {
          await authService.validateToken(token);
        } catch (error) {
          console.error('Token validation failed:', error);
        }
      }
      setIsAuthChecked(true);
    };

    checkAuth();
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema)
  });

  const handlePaystack = () => {
    // Check authentication status
    if (!isAuthenticated || !user?.email) {
      toast.error('Please log in to continue with payment');
      return;
    }

    console.log('Initializing Paystack with user:', { email: user.email, isAuthenticated });

    try {
      // Convert amount to kobo (smallest currency unit) and ensure it's an integer
      const amountInKobo = Math.round(amount * 100);
      
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: amountInKobo,
        currency: 'NGN',
        ref: 'TRN_' + Math.floor(Math.random() * 1000000000),
        callback: (response: any) => {
          console.log('Payment successful:', response);
          
          // Send confirmation email
          try {
            axios.post('/api/notifications/send-email', {
              type: 'PAYMENT_CONFIRMATION',
              email: user.email,
              metadata: {
                amount,
                reference: response.reference,
                date: new Date().toISOString()
              }
            });
          } catch (error) {
            console.error('Failed to send confirmation email:', error);
          }

          // Create in-app notification
          try {
            axios.post('/api/notifications', {
              type: 'PAYMENT_CONFIRMATION',
              title: 'Payment Successful',
              message: `Your payment of ${formatCurrency(amount)} has been confirmed.`,
              metadata: {
                amount,
                reference: response.reference
              }
            });
          } catch (error) {
            console.error('Failed to create notification:', error);
          }

          toast.success('Payment successful!');
          onSuccess();
        },
        onClose: () => {
          toast.error('Payment cancelled');
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('Paystack setup error:', error);
      toast.error('Failed to initialize payment. Please try again.');
    }
  };

  const onSubmit = async (data: PaymentForm) => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue with payment');
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate direct card payment
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Payment successful!');
      onSuccess();
    } catch (error) {
      toast.error('Payment failed. Please try again.');
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthChecked) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Payment Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Total Amount:</span>
              <span className="text-2xl font-bold">₦{amount.toFixed(2)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Lock className="h-4 w-4 mr-1" />
              Secure Payment
            </div>
          </div>

          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-700">Please log in to proceed with payment.</p>
            </div>
          )}

          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setPaymentMethod('card')}
                disabled={!isAuthenticated}
                className={`flex-1 py-2 px-4 rounded-md ${
                  paymentMethod === 'card'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Card Payment
              </button>
              <button
                onClick={() => {
                  setPaymentMethod('paystack');
                  handlePaystack();
                }}
                disabled={!isAuthenticated}
                className={`flex-1 py-2 px-4 rounded-md ${
                  paymentMethod === 'paystack'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700'
                } ${!isAuthenticated ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Paystack
              </button>
            </div>
          </div>

          {paymentMethod === 'card' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    {...register('cardNumber')}
                    className="pl-10 w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {errors.cardNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    {...register('expiryDate')}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.expiryDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    {...register('cvv')}
                    className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.cvv && (
                    <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isProcessing || !isAuthenticated}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Pay Now'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}