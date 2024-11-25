import QRCode from 'qrcode';
import { Booking } from '../types';

export const generateQRCode = async (booking: Booking): Promise<string> => {
  const qrData = JSON.stringify({
    ticketNumber: booking.ticketNumber,
    trainId: booking.trainId,
    seatNumber: booking.seat.number,
    departureTime: booking.train.departureTime,
  });

  try {
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

export const shareTicket = async (booking: Booking) => {
  try {
    const shareData = {
      title: 'Train Ticket',
      text: `Train: ${booking.train.name}\nFrom: ${booking.train.from}\nTo: ${booking.train.to}\nDeparture: ${new Date(booking.train.departureTime).toLocaleString()}\nTicket #: ${booking.ticketNumber}`,
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // Fallback for browsers that don't support the Web Share API
      await navigator.clipboard.writeText(shareData.text);
      return 'Ticket details copied to clipboard';
    }
  } catch (error) {
    console.error('Error sharing ticket:', error);
    throw new Error('Failed to share ticket');
  }
};