import { Component, OnInit } from '@angular/core';
import { BankAccount, BankAccountService, BankAccountCreateDto } from './bankaccount.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { BreadcrumbItem, HeaderAction } from 'src/app/shared/components/page-header/page-header.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {
  accounts: BankAccount[] = [];
  approvedAccounts: BankAccount[] = [];
  rejectedAccounts: BankAccount[] = [];
  pendingAccounts: BankAccount[] = [];
  
  // Filtered accounts for display
  filteredApprovedAccounts: BankAccount[] = [];
  filteredRejectedAccounts: BankAccount[] = [];
  filteredPendingAccounts: BankAccount[] = [];
  
  selected: BankAccountCreateDto = this.emptyForm();
  selectedAccount: BankAccount | null = null;
  isEdit = false;
  isAdmin = false;
  currentUserEmail = '';
  confirmDetails = false;

  // View state
  currentView: 'list' | 'form' = 'list';

  // Search functionality
  searchTerm = '';
  searchType = 'all';
  showAdvancedSearch = false;
  searchFilters = {
    bankName: '',
    department: '',
    accountType: '',
    status: '',
    startDate: '',
    endDate: ''
  };

  // Pagination variables for Approved Accounts
  approvedCurrentPage = 1;
  approvedPageSize = 10;
  approvedTotalItems = 0;
  approvedPageSizeOptions = [5, 10, 25, 50, 100];

  // Pagination variables for Rejected Accounts
  rejectedCurrentPage = 1;
  rejectedPageSize = 10;
  rejectedTotalItems = 0;
  rejectedPageSizeOptions = [5, 10, 25, 50, 100];

  // Pagination variables for Pending Accounts
  pendingCurrentPage = 1;
  pendingPageSize = 10;
  pendingTotalItems = 0;
  pendingPageSizeOptions = [5, 10, 25, 50, 100];

  // Modal instance
  private accountDetailsModal: Modal | null = null;

  // Header Configuration
  breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', url: '/dashboard' },
    { label: 'Assets', url: '/' },
    { label: 'Bank Accounts', active: true }
  ];

  headerActions: HeaderAction[] = [
    { 
      label: 'Add New', 
      icon: 'bx bx-plus-circle', 
      cssClass: 'btn-primary',
      action: 'add'
    }
  ];

  formHeaderActions: HeaderAction[] = [
    { 
      label: 'View List', 
      icon: 'bx bx-list-ul', 
      cssClass: 'btn-outline-primary',
      action: 'list'
    }
  ];

  banks: string[] = [
    'CENTRAL BANK OF KENYA', 'Absa Bank Kenya Plc', 'Access Bank (Kenya) PLC', 'African Banking Corporation Limited',
    'Bank of Africa Limited', 'Bank of Baroda (K) Limited', 'Bank of India', 'Caritas Microfinance Bank Limited',
    'Choice Microfinance Bank Limited', 'Citibank N.A. Kenya', 'Consolidated Bank of Kenya Limited',
    'Co-operative Bank of Kenya Limited', 'Credit Bank Plc', 'Development Bank of Kenya Limited',
    'Diamond Trust Bank Kenya Limited', 'DIB Bank Kenya Limited', 'Ecobank Kenya Limited',
    'Equity Bank Kenya Limited', 'Family Bank Limited', 'Faulu Microfinance Bank Limited',
    'Guaranty Trust Bank Limited', 'Guardian Bank Limited', 'Gulf African Bank Limited', 'Habib Bank A.G Zurich',
    'HFC Limited', 'I&M Bank Limited', 'KCB Bank Kenya Limited', 'Kenya Women Microfinance Bank Limited',
    'Kingdom Bank Limited', 'Maisha Microfinance Bank Limited', 'Commercial International Bank',
    'Middle East Bank (K) Limited', 'M-Oriental Bank Limited', 'National Bank of Kenya Limited',
    'NCBA Bank Kenya PLC', 'Paramount Bank Limited', 'Premier Bank', 'Prime Bank Limited',
    'Rafiki Microfinance Bank Limited', 'Salaam Microfinance Bank Limited', 'SBM Bank Kenya Limited',
    'Sidian Bank Limited', 'Spire Bank Limited', 'Stanbic Bank Kenya Limited',
    'Standard Chartered Bank (K) Limited', 'UBA Kenya Bank Limited', 'Victoria Commercial Bank Plc'
  ];

  accountTypes: string[] = ['Development Account', 'Current Account'];

  departments: string[] = [
    'Agriculture, Livestock and Co-operative Management',
    'Health Services',
    'Water, Environment, Energy and natural resources',
    'Information, Communication, E-Government, Youth Affairs, Gender and Sports',
    'Public Works, Roads and Transport',
    'Public Service Management',
    'Trade, Industrialization, Tourism and wildlife',
    'Finance and Economic Planning',
    'Education, Culture and Social Services',
    'Lands, Housing and Physical Planning'
  ];

  unitsMap: { [key: string]: string[] } = {
    'Agriculture, Livestock and Co-operative Management': ['Crop Management', 'Livestock', 'Fisheries', 'Co-operatives'],
    'Health Services': ['Clinical Services', 'Nursing', 'Pharmacy', 'Public Health'],
    'Water, Environment, Energy and natural resources': ['Water Supply', 'Sanitation', 'Forestry', 'Energy'],
    'Information, Communication, E-Government, Youth Affairs, Gender and Sports': ['ICT Infrastructure', 'E-Government', 'Youth Affairs', 'Sports'],
    'Public Works, Roads and Transport': ['Roads Maintenance', 'Transport', 'Mechanical'],
    'Public Service Management': ['HRM', 'Administration', 'Procurement'],
    'Trade, Industrialization, Tourism and wildlife': ['Trade Development', 'Industrialization', 'Tourism', 'Wildlife'],
    'Finance and Economic Planning': ['Accounts', 'Audit', 'Procurement', 'Planning'],
    'Education, Culture and Social Services': ['Early Childhood Education', 'Culture', 'Social Services'],
    'Lands, Housing and Physical Planning': ['Survey', 'Physical Planning', 'Housing']
  };

  units: string[] = [];

  constructor(
    private service: BankAccountService,
    public authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.currentUserEmail = this.authService.CurrentUser()?.email || '';
    this.loadData();
  }

  // Search Methods
  applySearch() {
    this.filterAccounts();
    this.resetPagination();
  }

  clearSearch() {
    this.searchTerm = '';
    this.searchType = 'all';
    this.resetFilters();
  }

  toggleAdvancedSearch() {
    this.showAdvancedSearch = !this.showAdvancedSearch;
    if (this.showAdvancedSearch) {
      this.applySearch();
    }
  }

  resetFilters() {
    this.searchFilters = {
      bankName: '',
      department: '',
      accountType: '',
      status: '',
      startDate: '',
      endDate: ''
    };
    this.showAdvancedSearch = false;
    this.applySearch();
  }

  private filterAccounts() {
    // Always filter all accounts first
    this.filteredPendingAccounts = this.pendingAccounts.filter(account => 
      this.matchesSearch(account) && this.matchesFilters(account)
    );

    this.filteredApprovedAccounts = this.approvedAccounts.filter(account => 
      this.matchesSearch(account) && this.matchesFilters(account)
    );

    this.filteredRejectedAccounts = this.rejectedAccounts.filter(account => 
      this.matchesSearch(account) && this.matchesFilters(account)
    );

    // If a specific search type is selected, show only that type
    if (this.searchType !== 'all') {
      switch (this.searchType) {
        case 'pending':
          // Keep only pending accounts, clear others
          this.filteredApprovedAccounts = [];
          this.filteredRejectedAccounts = [];
          break;
        case 'approved':
          // Keep only approved accounts, clear others
          this.filteredPendingAccounts = [];
          this.filteredRejectedAccounts = [];
          break;
        case 'rejected':
          // Keep only rejected accounts, clear others
          this.filteredPendingAccounts = [];
          this.filteredApprovedAccounts = [];
          break;
      }
    }
  }

  private matchesSearch(account: BankAccount): boolean {
    if (!this.searchTerm) return true;
    
    const term = this.searchTerm.toLowerCase();
    return (
      account.bankName?.toLowerCase().includes(term) ||
      account.accountNumber?.toLowerCase().includes(term) ||
      account.accountName?.toLowerCase().includes(term) ||
      account.department?.toLowerCase().includes(term) ||
      account.departmentUnit?.toLowerCase().includes(term) ||
      account.requestedBy?.toLowerCase().includes(term)
    );
  }

  private matchesFilters(account: BankAccount): boolean {
    if (this.searchFilters.bankName && account.bankName !== this.searchFilters.bankName) return false;
    if (this.searchFilters.department && account.department !== this.searchFilters.department) return false;
    if (this.searchFilters.accountType && account.accountType !== this.searchFilters.accountType) return false;
    if (this.searchFilters.status && account.status !== this.searchFilters.status) return false;
    
    if (this.searchFilters.startDate) {
      const requestedDate = new Date(account.requestedAt || '');
      const startDate = new Date(this.searchFilters.startDate);
      if (requestedDate < startDate) return false;
    }
    
    if (this.searchFilters.endDate) {
      const requestedDate = new Date(account.requestedAt || '');
      const endDate = new Date(this.searchFilters.endDate);
      endDate.setHours(23, 59, 59, 999);
      if (requestedDate > endDate) return false;
    }
    
    return true;
  }

  // Pagination Methods for Approved Accounts
  get paginatedApprovedAccounts(): BankAccount[] {
    return this.filteredApprovedAccounts;
  }

  getPaginatedApprovedAccounts(): BankAccount[] {
    const startIndex = (this.approvedCurrentPage - 1) * this.approvedPageSize;
    const endIndex = startIndex + this.approvedPageSize;
    return this.filteredApprovedAccounts.slice(startIndex, endIndex);
  }

  getApprovedTotalPages(): number {
    return Math.ceil(this.getFilteredApprovedCount() / this.approvedPageSize);
  }

  onApprovedPageChange(page: number): void {
    if (page >= 1 && page <= this.getApprovedTotalPages()) {
      this.approvedCurrentPage = page;
    }
  }

  onApprovedPageSizeChange(): void {
    this.approvedCurrentPage = 1;
  }

  // Pagination Methods for Rejected Accounts
  get paginatedRejectedAccounts(): BankAccount[] {
    return this.filteredRejectedAccounts;
  }

  getPaginatedRejectedAccounts(): BankAccount[] {
    const startIndex = (this.rejectedCurrentPage - 1) * this.rejectedPageSize;
    const endIndex = startIndex + this.rejectedPageSize;
    return this.filteredRejectedAccounts.slice(startIndex, endIndex);
  }

  getRejectedTotalPages(): number {
    return Math.ceil(this.getFilteredRejectedCount() / this.rejectedPageSize);
  }

  onRejectedPageChange(page: number): void {
    if (page >= 1 && page <= this.getRejectedTotalPages()) {
      this.rejectedCurrentPage = page;
    }
  }

  onRejectedPageSizeChange(): void {
    this.rejectedCurrentPage = 1;
  }

  // Pagination Methods for Pending Accounts
  get paginatedPendingAccounts(): BankAccount[] {
    return this.filteredPendingAccounts;
  }

  getPaginatedPendingAccounts(): BankAccount[] {
    const startIndex = (this.pendingCurrentPage - 1) * this.pendingPageSize;
    const endIndex = startIndex + this.pendingPageSize;
    return this.filteredPendingAccounts.slice(startIndex, endIndex);
  }

  getPendingTotalPages(): number {
    return Math.ceil(this.getFilteredPendingCount() / this.pendingPageSize);
  }

  onPendingPageChange(page: number): void {
    if (page >= 1 && page <= this.getPendingTotalPages()) {
      this.pendingCurrentPage = page;
    }
  }

  onPendingPageSizeChange(): void {
    this.pendingCurrentPage = 1;
  }

  private resetPagination() {
    this.approvedCurrentPage = 1;
    this.rejectedCurrentPage = 1;
    this.pendingCurrentPage = 1;
  }

  // Helper methods
  get Math() {
    return Math;
  }

  getPageNumbers(totalPages: number): number[] {
    const maxPages = 5;
    const pages: number[] = [];
    
    if (totalPages <= maxPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, this.approvedCurrentPage - 2);
      const end = Math.min(totalPages, start + maxPages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

  // Counter methods
  getFilteredApprovedCount(): number {
    return this.filteredApprovedAccounts.length;
  }

  getFilteredRejectedCount(): number {
    return this.filteredRejectedAccounts.length;
  }

  getFilteredPendingCount(): number {
    return this.filteredPendingAccounts.length;
  }

  getFilteredTotal(): number {
    if (this.searchType === 'pending') return this.getFilteredPendingCount();
    if (this.searchType === 'approved') return this.getFilteredApprovedCount();
    if (this.searchType === 'rejected') return this.getFilteredRejectedCount();
    return this.getFilteredApprovedCount() + this.getFilteredRejectedCount() + this.getFilteredPendingCount();
  }

  getTotalAccounts(): number {
    return this.approvedTotalItems + this.rejectedTotalItems + this.pendingTotalItems;
  }

  // Header Action Handler
  onHeaderAction(action: string) {
    switch (action) {
      case 'add':
        this.showForm();
        break;
      case 'list':
        this.showList();
        break;
    }
  }

  showForm() {
    this.currentView = 'form';
    this.resetForm();
  }

  showList() {
    this.currentView = 'list';
    this.resetForm();
  }

  loadData() {
    this.service.getApproved().subscribe({
      next: (data) => {
        this.approvedAccounts = data;
        this.approvedTotalItems = data.length;
        this.applySearch(); // Apply search after loading
      },
      error: (error) => console.error('Error loading approved accounts:', error)
    });

    this.service.getRejected().subscribe({
      next: (data) => {
        this.rejectedAccounts = data;
        this.rejectedTotalItems = data.length;
        this.applySearch(); // Apply search after loading
      },
      error: (error) => console.error('Error loading rejected accounts:', error)
    });

    if (this.isAdmin) {
      this.service.getPending().subscribe({
        next: (data) => {
          this.pendingAccounts = data;
          this.pendingTotalItems = data.length;
          this.applySearch(); // Apply search after loading
        },
        error: (error) => console.error('Error loading pending accounts:', error)
      });
    }
  }

  refreshData() {
    this.loadData();
    Swal.fire({
      icon: 'success',
      title: 'Refreshed',
      text: 'Bank account data has been updated.',
      timer: 1500,
      showConfirmButton: false
    });
  }

  save() {
    if (!this.validateForm()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields and confirm the details.'
      });
      return;
    }

    Swal.fire({
      title: this.isEdit ? 'Updating Account...' : 'Creating Account...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const request = this.isEdit 
      ? this.service.create(this.selected as any)
      : this.service.create(this.selected);

    request.subscribe({
      next: () => {
        Swal.close();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: this.isEdit 
            ? 'Bank account updated successfully.'
            : 'Bank account created successfully. Admin has been notified via email and will review your request.',
          timer: 3000
        });
        this.resetForm();
        this.loadData();
        this.showList();
      },
      error: (error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error || `Failed to ${this.isEdit ? 'update' : 'create'} bank account`
        });
      }
    });
  }

  approveAccount(id: number) {
    Swal.fire({
      title: 'Approve Bank Account',
      input: 'textarea',
      inputLabel: 'Approval Remarks',
      inputPlaceholder: 'Enter remarks...',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      confirmButtonColor: '#28a745',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        const remarks = result.value || 'Approved';

        Swal.fire({
          title: 'Approving...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        this.service.approve(id, remarks).subscribe({
          next: () => {
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Approved',
              text: 'Bank account has been approved successfully and user has been notified via email.',
              timer: 3000
            });
            this.loadData();
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

  rejectAccount(id: number) {
    Swal.fire({
      title: 'Reject Bank Account',
      input: 'textarea',
      inputLabel: 'Rejection Reason',
      inputPlaceholder: 'Enter reason for rejection...',
      showCancelButton: true,
      confirmButtonText: 'Reject',
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'You must provide a reason for Account rejection!';
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

        this.service.reject(id, result.value).subscribe({
          next: () => {
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Rejected',
              text: 'Bank account has been rejected and user has been notified via email.',
              timer: 3000
            });
            this.loadData();
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

  viewAccountDetails(account: BankAccount) {
    this.selectedAccount = account;
    const modalElement = document.getElementById('accountDetailsModal');
    if (modalElement) {
      this.accountDetailsModal = new Modal(modalElement);
      this.accountDetailsModal.show();
    }
  }

  hideAccountDetailsModal() {
    if (this.accountDetailsModal) {
      this.accountDetailsModal.hide();
    }
  }

  delete(id?: number) {
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

        this.service.delete(id).subscribe({
          next: () => {
            Swal.close();
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Bank account has been deleted.',
              timer: 2000
            });
            this.loadData();
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

  resetForm() {
    this.selected = this.emptyForm();
    this.units = [];
    this.isEdit = false;
    this.confirmDetails = false;
  }

  onDepartmentChange() {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }

  validateForm(): boolean {
    return !!(
      this.selected.bankName &&
      this.selected.accountNumber &&
      this.selected.accountType &&
      this.selected.accountName &&
      this.selected.department &&
      this.selected.departmentUnit &&
      this.confirmDetails
    );
  }

  emptyForm(): BankAccountCreateDto {
    return {
      bankName: '',
      accountNumber: '',
      accountType: '',
      accountName: '',
      openingBalance: 0,
      remarks: '',
      department: '',
      departmentUnit: '',
      officerInCharge: '',
      signatories: ''
    };
  }

  getStatusBadgeClass(status: string): string {
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

  exportToPDF() {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Bank Accounts Report', 14, 15);

    const allAccounts = [...this.approvedAccounts, ...this.rejectedAccounts];
    const data = allAccounts.map(a => [
      a.id,
      a.bankName,
      a.accountNumber,
      a.accountType,
      a.accountName,
      a.department,
      a.status
    ]);

    autoTable(doc, {
      head: [['ID', 'Bank', 'Account No', 'Type', 'Name', 'Department', 'Status']],
      body: data,
      startY: 25,
      styles: { fontSize: 9, halign: 'left' },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save('BankAccounts.pdf');
  }

  exportToExcel() {
    const allAccounts = [...this.approvedAccounts, ...this.rejectedAccounts];
    const data = allAccounts.map(account => ({
      ID: account.id,
      'Bank Name': account.bankName,
      'Account Number': account.accountNumber,
      'Account Type': account.accountType,
      'Account Name': account.accountName,
      'Opening Balance': account.openingBalance,
      'Department': account.department,
      'Department Unit': account.departmentUnit,
      'Officer In Charge': account.officerInCharge,
      'Signatories': account.signatories,
      'Status': account.status,
      'Requested By': account.requestedBy,
      'Requested At': account.requestedAt,
      'Approved By': account.approvedBy,
      'Approval Remarks': account.approvalRemarks,
      'Remarks': account.remarks
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BankAccounts');
    XLSX.writeFile(wb, 'BankAccounts.xlsx');
  }

  printTable() {
    const approvedSection = document.getElementById('approved-table')?.innerHTML;
    const rejectedSection = document.getElementById('rejected-table')?.innerHTML;
    
    const popup = window.open('', '_blank', 'width=900,height=700');
    popup?.document.write(`
      <html>
        <head>
          <title>Bank Account Records</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h3 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 40px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 11px; }
            th { color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h2 { margin: 0; color: #0d6efd; }
            .section-title { 
              margin-top: 30px; 
              margin-bottom: 15px; 
              padding: 10px; 
              font-size: 18px;
              font-weight: bold;
            }
            .approved-section { 
              color: #28a745; 
              background-color: #d4edda;
              border-left: 5px solid #28a745;
            }
            .rejected-section { 
              color: #dc3545; 
              background-color: #f8d7da;
              border-left: 5px solid #dc3545;
            }
            .table-success th { background-color: #28a745 !important; }
            .table-danger th { background-color: #dc3545 !important; }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
            
            @media print {
              .no-print { display: none !important; }
              body { padding: 10px; }
              table { page-break-inside: auto; }
              tr { page-break-inside: avoid; page-break-after: auto; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>County Government Bank Accounts</h2>
            <p><strong>Generated On:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Report Type:</strong> Approved & Rejected Bank Accounts</p>
          </div>

          <div class="section-title approved-section">
            ✓ Approved Bank Accounts (${this.approvedAccounts.length})
          </div>
          ${approvedSection || '<p>No approved accounts available.</p>'}

          <div class="section-title rejected-section page-break">
            ✗ Rejected Bank Accounts (${this.rejectedAccounts.length})
          </div>
          ${rejectedSection || '<p>No rejected accounts available.</p>'}

          <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
            <p>Total Approved: ${this.approvedAccounts.length} | Total Rejected: ${this.rejectedAccounts.length}</p>
            <p>© ${new Date().getFullYear()} County Government - Asset Management System</p>
          </div>
        </body>
      </html>
    `);
    popup?.document.close();
    popup?.print();
  }
}