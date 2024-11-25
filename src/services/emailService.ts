import { Booking } from '../types';

interface EmailTemplate {
  subject: string;
  body: string;
}

export const generateEmailTemplate = (
  type: 'booking' | 'cancellation' | 'reminder' | 'payment',
  booking: Booking
): EmailTemplate => {
  const templates = {
    booking: {
      subject: `Booking Confirmation - Ticket #${booking.ticketNumber}`,
      body: `
Dear ${booking.passengerName},

Your train ticket has been successfully booked!

Journey Details:
Train: ${booking.train.name}
From: ${booking.train.from}
To: ${booking.train.to}
Date: ${new Date(booking.train.departureTime).toLocaleDateString()}
Time: ${new Date(booking.train.departureTime).toLocaleTimeString()}
Seat: ${booking.seat.number} (${booking.seat.class} Class)

Total Amount Paid: ₦${booking.totalAmount}

Your ticket has been attached to this email. You can also view it in your account.

Safe travels!
TrainEase Team
      `
    },
    cancellation: {
      subject: `Booking Cancellation - Ticket #${booking.ticketNumber}`,
      body: `
Dear ${booking.passengerName},

Your booking has been successfully cancelled.

Cancelled Journey Details:
Train: ${booking.train.name}
From: ${booking.train.from}
To: ${booking.train.to}
Date: ${new Date(booking.train.departureTime).toLocaleDateString()}

A refund of ₦${booking.totalAmount} will be processed within 5-7 business days.

Thank you for choosing TrainEase.
TrainEase Team
      `
    },
    reminder: {
      subject: `Journey Reminder - Tomorrow's Trip`,
      body: `
Dear ${booking.passengerName},

This is a reminder for your journey tomorrow:

Train: ${booking.train.name}
From: ${booking.train.from}
To: ${booking.train.to}
Departure: ${new Date(booking.train.departureTime).toLocaleTimeString()}
Seat: ${booking.seat.number}

Please arrive at the station at least 30 minutes before departure.

Have a great journey!
TrainEase Team
      `
    },
    payment: {
      subject: `Payment Confirmation - Ticket #${booking.ticketNumber}`,
      body: `
Dear ${booking.passengerName},

We've received your payment of ₦${booking.totalAmount} for ticket #${booking.ticketNumber}.

Payment Details:
Amount: ₦${booking.totalAmount}
Payment Method: ${booking.paymentMethod}
Reference: ${booking.paymentReference}

Your invoice has been attached to this email.

Thank you for choosing TrainEase.
TrainEase Team
      `
    }
  };

  return templates[type];
};

export const sendEmail = async (
  to: string,
  template: EmailTemplate,
  attachments?: string[]
): Promise<boolean> => {
  // This is a mock implementation. In a real application, you would:
  // 1. Use a service like SendGrid, Mailgun, or AWS SES
  // 2. Handle attachments properly
  // 3. Implement proper error handling and retries
  
  console.log('Sending email:', {
    to,
    subject: template.subject,
    body: template.body,
    attachments
  });

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
};