export interface Notification {
  _id: string;
  userId: string;
  type: 'BOOKING_CONFIRMATION' | 'PAYMENT_CONFIRMATION' | 'JOURNEY_REMINDER' | 'GENERAL';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    bookingId?: string;
    paymentId?: string;
    journeyDate?: string;
    amount?: number;
  };
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  pushNotifications: boolean;
  journeyReminders: boolean;
  promotionalEmails: boolean;
}
