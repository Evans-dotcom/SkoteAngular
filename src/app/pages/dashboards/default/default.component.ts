import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { emailSentBarChart, monthlyEarningChart } from './data';
import { ChartType } from './dashboard.model';
import { EventService } from '../../../core/services/event.service';
import { ConfigService } from '../../../core/services/config.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.models';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { BankAccount, BankAccountService } from '../../ecommerce/bank-account/bankaccount.service';
import { interval, Subscription, forkJoin, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { EmailNotificationService } from '../email-notification/email-notification.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit, OnDestroy {
  isVisible: string;
  emailSentBarChart: ChartType;
  monthlyEarningChart: ChartType;
  transactions: Array<[]>;
  statData: Array<[]>;
  isActive: string;

  currentUser: User;
  isAdmin: boolean = false;
  isManager: boolean = false;
  isUser: boolean = false;

  adminStats = {
    totalUsers: 1235,
    totalAssets: 5420,
    bankAccounts: 0,
    totalBalance: 0
  };

  managerStats = {
    departmentAssets: 245,
    assignedUsers: 45,
    pendingRequests: 0,
    monthlyBudget: 250000
  };

  userStats = {
    myBankAccounts: 0,
    myAssets: 12,
    totalBalance: 0,
    pendingRequests: 0
  };

  recentActivities = [
    { user: 'John Doe', action: 'Created Bank Account', asset: 'Chase Bank - 1234', date: '2024-01-15', status: 'Completed' },
    { user: 'Jane Smith', action: 'Updated Asset', asset: 'Dell Laptop XPS 15', date: '2024-01-14', status: 'Completed' },
    { user: 'Mike Johnson', action: 'Requested Asset', asset: 'iPad Pro 12.9"', date: '2024-01-14', status: 'Pending' }
  ];

  userTransactions = [
    { account: 'Chase Bank - 1234', type: 'Deposit', amount: 5000, date: '2024-01-15', status: 'Completed' },
    { account: 'Wells Fargo - 5678', type: 'Withdrawal', amount: 2000, date: '2024-01-14', status: 'Completed' },
    { account: 'Bank of America - 9012', type: 'Transfer', amount: 1500, date: '2024-01-13', status: 'Pending' }
  ];

  // Bank accounts data
  allBankAccounts: BankAccount[] = [];
  recentBankAccounts: BankAccount[] = [];
  selectedBankAccount: BankAccount | null = null;
  accountDetailsModal: Modal | null = null;

  // Bank account counts
  pendingCount: number = 0;
  approvedCount: number = 0;
  rejectedCount: number = 0;
  totalCount: number = 0;

  unreadNotificationCount: number = 0;
  notificationSubscription: Subscription | null = null;
  dataRefreshSubscription: Subscription | null = null;

  constructor(
    private configService: ConfigService,
    private eventService: EventService,
    public authService: AuthenticationService,
    private bankAccountService: BankAccountService,
    private emailNotificationService: EmailNotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.CurrentUser();
    this.isAdmin = this.authService.isAdmin();
    this.isManager = this.authService.isManager();
    this.isUser = this.authService.isUser();

    const attribute = document.body.getAttribute('data-layout');
    this.isVisible = attribute;
    const vertical = document.getElementById('layout-vertical');
    if (vertical != null) {
      vertical.setAttribute('checked', 'true');
    }
    if (attribute == 'horizontal') {
      const horizontal = document.getElementById('layout-horizontal');
      if (horizontal != null) {
        horizontal.setAttribute('checked', 'true');
      }
    }

    this.fetchData();
    this.loadBankAccounts();
    this.loadNotificationCount();
    this.startNotificationRefresh();
    this.startDataRefresh();
    
    // Load user transactions if user is logged in
    if (this.isUser && this.currentUser?.email) {
      this.loadUserTransactions();
    }
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
    if (this.dataRefreshSubscription) {
      this.dataRefreshSubscription.unsubscribe();
    }
  }

  private fetchData() {
    this.monthlyEarningChart = monthlyEarningChart;
    this.isActive = 'year';
    this.configService.getConfig().subscribe(data => {
      this.transactions = data.transactions;
      this.statData = data.statData;
    });
  }

  /**
   * Load bank accounts based on user role
   */
  loadBankAccounts() {
    console.log('Loading bank accounts data...');
    
    if (this.isAdmin) {
      this.loadAllBankAccountsForAdmin();
    } else {
      this.loadUserBankAccounts();
    }
  }

  /**
   * Load all bank accounts for admin users
   */
  private loadAllBankAccountsForAdmin() {
    const pendingRequest = this.bankAccountService.getPending().pipe(
      catchError(error => {
        console.error('Error loading pending accounts:', error);
        return of([]);
      })
    );
    
    const approvedRequest = this.bankAccountService.getApproved().pipe(
      catchError(error => {
        console.error('Error loading approved accounts:', error);
        return of([]);
      })
    );
    
    const rejectedRequest = this.bankAccountService.getRejected().pipe(
      catchError(error => {
        console.error('Error loading rejected accounts:', error);
        return of([]);
      })
    );

    forkJoin([pendingRequest, approvedRequest, rejectedRequest])
      .subscribe({
        next: ([pendingData, approvedData, rejectedData]) => {
          console.log('Bank accounts loaded:', {
            pending: pendingData.length,
            approved: approvedData.length,
            rejected: rejectedData.length
          });

          // Combine all accounts
          this.allBankAccounts = [...pendingData, ...approvedData, ...rejectedData];
          
          // Update counts
          this.pendingCount = pendingData.length;
          this.approvedCount = approvedData.length;
          this.rejectedCount = rejectedData.length;
          this.totalCount = this.allBankAccounts.length;

          // Update stats
          this.managerStats.pendingRequests = this.pendingCount;
          this.adminStats.bankAccounts = this.totalCount;
          this.adminStats.totalBalance = this.calculateTotalBalance();

          // Get recent bank accounts (top 10)
          this.recentBankAccounts = this.allBankAccounts
            .sort((a, b) => {
              const dateA = new Date(a.requestedAt || '');
              const dateB = new Date(b.requestedAt || '');
              return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 10);

          console.log('Recent bank accounts:', this.recentBankAccounts);
        },
        error: (error) => {
          console.error('Error loading bank accounts data:', error);
          this.resetCounts();
        }
      });
  }

  /**
   * Load bank accounts for regular users (non-admin)
   */
  private loadUserBankAccounts() {
    const userEmail = this.currentUser?.email;
    if (!userEmail) {
      this.allBankAccounts = [];
      this.recentBankAccounts = [];
      return;
    }

    this.bankAccountService.getAll().subscribe({
      next: (data) => {
        // Filter accounts for the current user
        this.allBankAccounts = data.filter(account => 
          account.requestedBy === userEmail
        );
        
        this.updateUserStats();
        
        this.recentBankAccounts = this.allBankAccounts
          .sort((a, b) => {
            const dateA = new Date(a.requestedAt || '');
            const dateB = new Date(b.requestedAt || '');
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 10);
      },
      error: (error) => {
        console.error('Error loading user bank accounts:', error);
        this.allBankAccounts = [];
        this.recentBankAccounts = [];
        this.resetCounts();
      }
    });
  }

  /**
   * Load user transactions - can be connected to a real API later
   */
  private loadUserTransactions() {
    // For now, use mock data. Replace with real API call when available
    console.log('Loading user transactions...');
    
    // Example of how this could work with a real service:
    // this.transactionService.getUserTransactions(this.currentUser.email).subscribe({
    //   next: (data) => {
    //     this.userTransactions = data;
    //   },
    //   error: (error) => {
    //     console.error('Error loading transactions:', error);
    //   }
    // });
    
    // For demo purposes, we'll update the mock data with user's actual bank accounts
    if (this.allBankAccounts.length > 0) {
      // Create transactions based on user's bank accounts
      this.userTransactions = this.allBankAccounts.slice(0, 3).map(account => ({
        account: `${account.bankName} - ${account.accountNumber}`,
        type: this.getRandomTransactionType(),
        amount: Math.floor(Math.random() * 10000) + 1000,
        date: this.getRandomDate(),
        status: Math.random() > 0.3 ? 'Completed' : 'Pending'
      }));
    }
  }

  /**
   * Helper method to get random transaction type
   */
  private getRandomTransactionType(): string {
    const types = ['Deposit', 'Withdrawal', 'Transfer', 'Payment', 'Fee'];
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * Helper method to get random recent date
   */
  private getRandomDate(): string {
    const today = new Date();
    const daysAgo = Math.floor(Math.random() * 30);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
  }

  /**
   * Update user-specific stats
   */
  private updateUserStats() {
    this.pendingCount = this.allBankAccounts.filter(a => 
      a.status === 'Open' || a.status === 'Pending'
    ).length;
    
    this.approvedCount = this.allBankAccounts.filter(a => 
      a.status === 'Approved'
    ).length;
    
    this.rejectedCount = this.allBankAccounts.filter(a => 
      a.status === 'Rejected'
    ).length;
    
    this.totalCount = this.allBankAccounts.length;

    // Update user stats
    this.userStats.myBankAccounts = this.totalCount;
    this.userStats.pendingRequests = this.pendingCount;
    this.userStats.totalBalance = this.calculateUserTotalBalance();
  }

  /**
   * Calculate total balance from all approved accounts
   */
  private calculateTotalBalance(): number {
    if (!this.allBankAccounts.length) return 0;
    
    return this.allBankAccounts
      .filter(account => account.status === 'Approved')
      .reduce((total, account) => {
        const balance = parseFloat(account.openingBalance?.toString() || '0');
        return total + (isNaN(balance) ? 0 : balance);
      }, 0);
  }

  /**
   * Calculate total balance for the current user
   */
  private calculateUserTotalBalance(): number {
    if (!this.allBankAccounts.length) return 0;
    
    return this.allBankAccounts
      .filter(account => account.status === 'Approved')
      .reduce((total, account) => {
        const balance = parseFloat(account.openingBalance?.toString() || '0');
        return total + (isNaN(balance) ? 0 : balance);
      }, 0);
  }

  /**
   * Reset all counts to zero
   */
  private resetCounts() {
    this.pendingCount = 0;
    this.approvedCount = 0;
    this.rejectedCount = 0;
    this.totalCount = 0;
    this.recentBankAccounts = [];
  }

  loadNotificationCount() {
    this.emailNotificationService.getUnreadCount().subscribe({
      next: (data: any) => {
        this.unreadNotificationCount = data.count || 0;
      },
      error: (error) => {
        console.error('Error loading notification count:', error);
        this.unreadNotificationCount = 0;
      }
    });
  }

  startNotificationRefresh() {
    this.notificationSubscription = interval(30000) // Refresh every 30 seconds
      .pipe(
        switchMap(() => this.emailNotificationService.getUnreadCount())
      )
      .subscribe({
        next: (data: any) => {
          this.unreadNotificationCount = data.count || 0;
        },
        error: (error) => console.error('Error refreshing notification count:', error)
      });
  }

  startDataRefresh() {
    this.dataRefreshSubscription = interval(60000) // Refresh data every minute
      .subscribe({
        next: () => {
          console.log('Refreshing dashboard data...');
          this.loadBankAccounts();
          this.loadNotificationCount();
          if (this.isUser) {
            this.loadUserTransactions();
          }
        },
        error: (error) => console.error('Error in data refresh:', error)
      });
  }

  viewBankAccountDetails(account: BankAccount) {
    this.selectedBankAccount = account;
    const modalElement = document.getElementById('bankAccountDetailsModal');
    if (modalElement) {
      this.accountDetailsModal = new Modal(modalElement);
      this.accountDetailsModal.show();
    }
  }

  approveBankAccount(account: BankAccount) {
    Swal.fire({
      title: 'Approve Bank Account',
      html: `
        <div style="text-align: left; padding: 15px;">
          <p><strong>Bank:</strong> ${account.bankName}</p>
          <p><strong>Account Number:</strong> ${account.accountNumber}</p>
          <p><strong>Account Name:</strong> ${account.accountName}</p>
          <p><strong>Department:</strong> ${account.department}</p>
          <p><strong>Requested By:</strong> ${account.requestedBy}</p>
        </div>
      `,
      input: 'textarea',
      inputLabel: 'Approval Remarks',
      inputPlaceholder: 'Enter your remarks...',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      confirmButtonColor: '#28a745',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const remarks = result.value || 'Approved by Admin';
        
        Swal.fire({
          title: 'Approving...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.bankAccountService.approve(account.id!, remarks).subscribe({
          next: () => {
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Approved',
              text: 'Bank account has been approved successfully and user has been notified via email.',
              timer: 3000,
              showConfirmButton: false
            });
            this.loadBankAccounts();
            this.loadNotificationCount();
            this.hideAccountDetailsModal();
          },
          error: (error) => {
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error || 'Failed to approve account'
            });
          }
        });
      }
    });
  }

  rejectBankAccount(account: BankAccount) {
    Swal.fire({
      title: 'Reject Bank Account',
      html: `
        <div style="text-align: left; padding: 15px;">
          <p><strong>Bank:</strong> ${account.bankName}</p>
          <p><strong>Account Number:</strong> ${account.accountNumber}</p>
          <p><strong>Account Name:</strong> ${account.accountName}</p>
        </div>
      `,
      input: 'textarea',
      inputLabel: 'Rejection Reason',
      inputPlaceholder: 'Enter reason for rejection...',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'You must provide a reason for rejection!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Rejecting...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.bankAccountService.reject(account.id!, result.value).subscribe({
          next: () => {
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Rejected',
              text: 'Bank account has been rejected and user has been notified via email.',
              timer: 3000,
              showConfirmButton: false
            });
            this.loadBankAccounts();
            this.loadNotificationCount();
            this.hideAccountDetailsModal();
          },
          error: (error) => {
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error || 'Failed to reject account'
            });
          }
        });
      }
    });
  }

  /**
   * Hide the account details modal
   */
  private hideAccountDetailsModal() {
    if (this.accountDetailsModal) {
      this.accountDetailsModal.hide();
      this.selectedBankAccount = null;
    }
  }

  deleteBankAccount(id?: number) {
    if (!id) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this bank account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deleting...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.bankAccountService.delete(id).subscribe({
          next: () => {
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Bank account has been deleted successfully.',
              timer: 2000,
              showConfirmButton: false
            });
            this.loadBankAccounts();
          },
          error: (error) => {
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error || 'Failed to delete account'
            });
          }
        });
      }
    });
  }

  /**
   * Refresh dashboard data
   */
  refreshDashboard() {
    this.loadBankAccounts();
    this.loadNotificationCount();
    if (this.isUser) {
      this.loadUserTransactions();
    }
    
    Swal.fire({
      icon: 'success',
      title: 'Refreshed',
      text: 'Dashboard data has been updated.',
      timer: 1500,
      showConfirmButton: false
    });
  }

  /**
   * Load all bank accounts (for the refresh button)
   */
  loadAllBankAccounts() {
    this.loadBankAccounts();
  }

  weeklyreport() {
    this.isActive = 'week';
  }

  monthlyreport() {
    this.isActive = 'month';
  }

  yearlyreport() {
    this.isActive = 'year';
  }

  changeLayout(layout: string) {
    this.eventService.broadcast('changeLayout', layout);
  }

  getStatusBadgeClass(status?: string): string {
    if (!status) return 'bg-secondary';
    
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      case 'open':
      case 'pending':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }

  /**
   * Navigate to bank list page
   */
  navigateToBankList() {
    this.router.navigate(['/ecommerce/banklist']);
  }
}