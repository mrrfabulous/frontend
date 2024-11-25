import axios from 'axios';
import { Notification, NotificationPreferences } from '../types/notification';
import authService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class NotificationService {
  async getNotifications(): Promise<Notification[]> {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: { Authorization: `Bearer ${authService.getToken()}` }
    });
    return response.data;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await axios.patch(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      }
    );
  }

  async markAllAsRead(): Promise<void> {
    await axios.patch(
      `${API_URL}/notifications/mark-all-read`,
      {},
      {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      }
    );
  }

  async updatePreferences(preferences: NotificationPreferences): Promise<void> {
    await axios.put(
      `${API_URL}/notifications/preferences`,
      preferences,
      {
        headers: { Authorization: `Bearer ${authService.getToken()}` }
      }
    );
  }

  async getPreferences(): Promise<NotificationPreferences> {
    const response = await axios.get(`${API_URL}/notifications/preferences`, {
      headers: { Authorization: `Bearer ${authService.getToken()}` }
    });
    return response.data;
  }
}

export default new NotificationService();
