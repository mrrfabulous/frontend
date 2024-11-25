import axios from 'axios';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Invoice {
  _id: string;
  bookingId: string;
  userId: string;
  amount: number;
  status: 'PAID' | 'PENDING' | 'CANCELLED';
  paymentMethod: string;
  createdAt: string;
  paidAt?: string;
  items: {
    description: string;
    amount: number;
    quantity: number;
  }[];
}

class InvoiceService {
  async getInvoices(): Promise<Invoice[]> {
    const response = await axios.get(`${API_URL}/invoices`, {
      headers: { Authorization: `Bearer ${authService.getToken()}` }
    });
    return response.data;
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    const response = await axios.get(`${API_URL}/invoices/${invoiceId}`, {
      headers: { Authorization: `Bearer ${authService.getToken()}` }
    });
    return response.data;
  }

  async downloadInvoice(invoiceId: string): Promise<Blob> {
    const response = await axios.get(`${API_URL}/invoices/${invoiceId}/download`, {
      headers: { Authorization: `Bearer ${authService.getToken()}` },
      responseType: 'blob'
    });
    return response.data;
  }

  async emailInvoice(invoiceId: string): Promise<void> {
    await axios.post(
      `${API_URL}/invoices/${invoiceId}/email`,
      {},
      {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      }
    );
  }
}

export default new InvoiceService();
