import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
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

  pendingBankAccounts: BankAccount[] = [];
  approvedBankAccounts: BankAccount[] = [];
  rejectedBankAccounts: BankAccount[] = [];
  selectedBankAccount: BankAccount | null = null;
  accountDetailsModal: Modal | null = null;

  @ViewChild('content') content;

  constructor(
    private modalService: NgbModal,
    private configService: ConfigService,
    private eventService: EventService,
    public authService: AuthenticationService,
    private bankAccountService: BankAccountService
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

    if (this.isAdmin) {
      this.loadPendingBankAccounts();
      this.loadApprovedBankAccounts();
      this.loadRejectedBankAccounts();
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

  loadPendingBankAccounts() {
    this.bankAccountService.getPending().subscribe({
      next: (data) => {
        this.pendingBankAccounts = data;
      },
      error: (error) => {
        console.error('Error loading pending accounts:', error);
      }
    });
  }

  loadApprovedBankAccounts() {
    this.bankAccountService.getApproved().subscribe({
      next: (data) => {
        this.approvedBankAccounts = data;
      },
      error: (error) => {
        console.error('Error loading approved accounts:', error);
      }
    });
  }

  loadRejectedBankAccounts() {
    this.bankAccountService.getRejected().subscribe({
      next: (data) => {
        this.rejectedBankAccounts = data;
      },
      error: (error) => {
        console.error('Error loading rejected accounts:', error);
      }
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
        this.bankAccountService.approve(account.id!, remarks).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Approved',
              text: 'Bank account has been approved successfully.',
              timer: 2000
            });
            this.loadPendingBankAccounts();
            this.loadApprovedBankAccounts();
            if (this.accountDetailsModal) {
              this.accountDetailsModal.hide();
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error
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
        this.bankAccountService.reject(account.id!, result.value).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Rejected',
              text: 'Bank account has been rejected.',
              timer: 2000
            });
            this.loadPendingBankAccounts();
            this.loadRejectedBankAccounts();
            if (this.accountDetailsModal) {
              this.accountDetailsModal.hide();
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: error
            });
          }
        });
      }
    });
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
        return 'bg-warning';
      default:
        return 'bg-secondary';
    }
  }
}