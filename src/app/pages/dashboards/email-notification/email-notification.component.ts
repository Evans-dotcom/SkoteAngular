import { Component, OnInit, OnDestroy } from '@angular/core';
import { BankAccountService, BankAccount } from '../../ecommerce/bank-account/bankaccount.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Modal } from 'bootstrap';
import { EmailNotification, EmailNotificationService } from './email-notification.service';

@Component({
  selector: 'app-email-notification-panel',
  templateUrl: './email-notification.component.html',
  styleUrls: ['./email-notification.component.scss']
})
export class EmailNotificationPanelComponent implements OnInit, OnDestroy {
  notifications: EmailNotification[] = [];
  isAdmin: boolean = false;
  isLoading: boolean = false;
  displayLimit: number = 5;
  unreadCount: number = 0;
  refreshSubscription: Subscription | null = null;

  selectedBankAccount: BankAccount | null = null;
  bankDetailsModal: Modal | null = null;
  loadingDetails: boolean = false;

  constructor(
    private emailService: EmailNotificationService,
    private bankAccountService: BankAccountService,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.loadNotifications();
    this.startAutoRefresh();
  }

  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  loadNotifications() {
    this.isLoading = true;
    const request = this.isAdmin 
      ? this.emailService.getAdminNotifications()
      : this.emailService.getMyNotifications();

    request.subscribe({
      next: (data) => {
        this.notifications = data;
        this.updateUnreadCount();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
        this.isLoading = false;
      }
    });
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => n.status !== 'Read').length;
  }

  startAutoRefresh() {
    this.refreshSubscription = interval(30000)
      .pipe(
        switchMap(() => this.isAdmin 
          ? this.emailService.getAdminNotifications()
          : this.emailService.getMyNotifications()
        )
      )
      .subscribe({
        next: (data) => {
          this.notifications = data;
          this.updateUnreadCount();
        },
        error: (error) => console.error('Error auto-refreshing notifications:', error)
      });
  }

  markAsRead(notification: EmailNotification) {
    this.emailService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.status = 'Read';
        this.updateUnreadCount();
      },
      error: (error) => console.error('Error marking notification as read:', error)
    });
  }

  deleteNotification(notification: EmailNotification, event: Event) {
    event.stopPropagation();
    this.emailService.deleteNotification(notification.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.updateUnreadCount();
      },
      error: (error) => console.error('Error deleting notification:', error)
    });
  }

  markAllAsRead() {
    this.emailService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.status = 'Read');
        this.updateUnreadCount();
      },
      error: (error) => console.error('Error marking all as read:', error)
    });
  }

  viewBankDetails(notification: EmailNotification, event: Event) {
    event.stopPropagation();
    this.loadingDetails = true;
    
    this.bankAccountService.getById(notification.assetId).subscribe({
      next: (account) => {
        this.selectedBankAccount = account;
        this.loadingDetails = false;
        this.openBankDetailsModal();
      },
      error: (error) => {
        console.error('Error loading bank account details:', error);
        this.loadingDetails = false;
      }
    });
  }

  openBankDetailsModal() {
    const modalElement = document.getElementById('bankDetailsModalFromNotification');
    if (modalElement) {
      this.bankDetailsModal = new Modal(modalElement);
      this.bankDetailsModal.show();
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'Approval':
        return 'bx bx-check-circle';
      case 'Rejection':
        return 'bx bx-x-circle';
      case 'Creation':
        return 'bx bx-plus-circle';
      default:
        return 'bx bx-bell';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'Approval':
        return 'success';
      case 'Rejection':
        return 'danger';
      case 'Creation':
        return 'info';
      default:
        return 'secondary';
    }
  }

  getDisplayedNotifications(): EmailNotification[] {
    return this.notifications.slice(0, this.displayLimit);
  }

  hasMore(): boolean {
    return this.notifications.length > this.displayLimit;
  }
}