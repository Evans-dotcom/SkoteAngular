import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmailNotification {
  id: number;
  recipientEmail: string;
  subject: string;
  body: string;
  assetType: string;
  assetId: number;
  assetSummary: string;
  status: string;
  sentAt: Date;
  notificationType: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailNotificationService {
  private apiUrl = 'http://localhost:5245/api/EmailNotification';

  constructor(private http: HttpClient) {}

  getMyNotifications(): Observable<EmailNotification[]> {
    return this.http.get<EmailNotification[]>(`${this.apiUrl}/my-notifications`);
  }

  getAdminNotifications(): Observable<EmailNotification[]> {
    return this.http.get<EmailNotification[]>(`${this.apiUrl}/admin-notifications`);
  }

  getAllNotifications(): Observable<EmailNotification[]> {
    return this.http.get<EmailNotification[]>(`${this.apiUrl}`);
  }

  getNotificationById(id: number): Observable<EmailNotification> {
    return this.http.get<EmailNotification>(`${this.apiUrl}/${id}`);
  }

  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/mark-read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read`, {});
  }

  deleteNotification(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`);
  }
}