import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Share2, Download, Printer } from 'lucide-react';
import { Booking } from '../types';
import { generateQRCode, shareTicket } from '../utils/ticketUtils';
import TicketPDF from './TicketPDF';
import toast from 'react-hot-toast';

interface TicketActionsProps {
  booking: Booking;
}

export default function TicketActions({ booking }: TicketActionsProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const handleShare = async () => {
    try {
      const result = await shareTicket(booking);
      if (result) {
        toast.success(result);
      }
    } catch (error) {
      toast.error('Failed to share ticket');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  React.useEffect(() => {
    generateQRCode(booking)
      .then(setQrCodeUrl)
      .catch(() => toast.error('Failed to generate QR code'));
  }, [booking]);

  return (
    <div className="flex space-x-4">
      <button
        onClick={handleShare}
        className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </button>

      <PDFDownloadLink
        document={<TicketPDF booking={booking} qrCodeUrl={qrCodeUrl} />}
        fileName={`ticket-${booking.ticketNumber}.pdf`}
        className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
      >
        {({ loading }) => (
          <>
            <Download className="w-4 h-4 mr-2" />
            {loading ? 'Generating...' : 'Download PDF'}
          </>
        )}
      </PDFDownloadLink>

      <button
        onClick={handlePrint}
        className="flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
      >
        <Printer className="w-4 h-4 mr-2" />
        Print
      </button>
    </div>
  );
}