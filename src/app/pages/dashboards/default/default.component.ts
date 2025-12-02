import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { emailSentBarChart, monthlyEarningChart } from './data';
import { ChartType } from './dashboard.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../../../core/services/event.service';
import { ConfigService } from '../../../core/services/config.service';
import { AuthenticationService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/auth.models';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { BankAccount, BankAccountService } from '../../ecommerce/bank-account/bankaccount.service';
import { interval, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
    bankAccounts: 852,
    totalBalance: 1200000
  };

  managerStats = {
    departmentAssets: 245,
    assignedUsers: 45,
    pendingRequests: 12,
    monthlyBudget: 250000
  };

  userStats = {
    myBankAccounts: 5,
    myAssets: 12,
    totalBalance: 45890,
    pendingRequests: 2
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

  // Categorized bank accounts
  allBankAccounts: BankAccount[] = [];
  recentBankAccounts: BankAccount[] = [];
  selectedBankAccount: BankAccount | null = null;
  accountDetailsModal: Modal | null = null;

  // Bank account counts - now as properties instead of getters
  pendingCount: number = 0;
  approvedCount: number = 0;
  rejectedCount: number = 0;
  totalCount: number = 0;

  unreadNotificationCount: number = 0;
  notificationSubscription: Subscription | null = null;

  @ViewChild('content') content;

  constructor(
    private modalService: NgbModal,
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

    // Load all bank accounts
    this.loadAllBankAccounts();

    this.loadNotificationCount();
    this.startNotificationRefresh();
  }

  ngOnDestroy() {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
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

  loadAllBankAccounts() {
    this.bankAccountService.getAll().subscribe({
      next: (data) => {
        this.allBankAccounts = data;
        
        // Calculate counts
        this.updateBankAccountCounts();
        
        // Sort by ID descending (most recent first) and take top 10 for display
        this.recentBankAccounts = data
          .sort((a, b) => (b.id || 0) - (a.id || 0))
          .slice(0, 10);

        console.log('Bank Accounts Loaded:', {
          total: this.totalCount,
          pending: this.pendingCount,
          approved: this.approvedCount,
          rejected: this.rejectedCount
        });
      },
      error: (error) => {
        console.error('Error loading bank accounts:', error);
        // Reset counts on error
        this.pendingCount = 0;
        this.approvedCount = 0;
        this.rejectedCount = 0;
        this.totalCount = 0;
      }
    });
  }

  /**
   * Calculate and update bank account counts based on status
   */
  private updateBankAccountCounts() {
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
  }

  loadNotificationCount() {
    this.emailNotificationService.getUnreadCount().subscribe({
      next: (data: any) => {
        this.unreadNotificationCount = data.count;
      },
      error: (error) => {
        console.error('Error loading notification count:', error);
      }
    });
  }

  startNotificationRefresh() {
    this.notificationSubscription = interval(30000)
      .pipe(
        switchMap(() => this.emailNotificationService.getUnreadCount())
      )
      .subscribe({
        next: (data: any) => {
          this.unreadNotificationCount = data.count;
        },
        error: (error) => console.error('Error refreshing notification count:', error)
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
            this.loadAllBankAccounts();
            this.loadNotificationCount();
            if (this.accountDetailsModal) {
              this.accountDetailsModal.hide();
            }
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
            this.loadAllBankAccounts();
            this.loadNotificationCount();
            if (this.accountDetailsModal) {
              this.accountDetailsModal.hide();
            }
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
            this.loadAllBankAccounts();
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

  navigateToBankList() {
    this.router.navigate(['/ecommerce/banklist']);
  }

  openModal() {
    this.modalService.open(this.content, { centered: true });
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
    switch (status) {
      case 'Approved':
        return 'bg-success';
      case 'Rejected':
        return 'bg-danger';
      case 'Open':
      case 'Pending':
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }
}