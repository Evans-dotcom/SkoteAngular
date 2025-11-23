import { Component, OnInit } from '@angular/core';
import { BankAccount, BankAccountService, BankAccountCreateDto } from './bankaccount.service';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

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
  selected: BankAccountCreateDto = this.emptyForm();
  isEdit = false;
  isAdmin = false;
  currentUserEmail = '';

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

  loadData() {
    this.service.getApproved().subscribe({
      next: (data) => (this.approvedAccounts = data),
      error: (error) => console.error('Error loading approved accounts:', error)
    });

    this.service.getRejected().subscribe({
      next: (data) => (this.rejectedAccounts = data),
      error: (error) => console.error('Error loading rejected accounts:', error)
    });

    if (this.isAdmin) {
      this.service.getPending().subscribe({
        next: (data) => (this.pendingAccounts = data),
        error: (error) => console.error('Error loading pending accounts:', error)
      });
    }
  }

  save() {
    if (!this.validateForm()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields.'
      });
      return;
    }

    this.service.create(this.selected).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Bank account created successfully and pending approval.',
          timer: 4000
        });
        this.resetForm();
        this.loadData();
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
        this.service.approve(id, remarks).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Approved',
              text: 'Bank account has been approved successfully.',
              timer: 2000
            });
            this.loadData();
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
          return 'You must provide a reason for rejection!';
        }
        return null;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.reject(id, result.value).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Rejected',
              text: 'Bank account has been rejected.',
              timer: 2000
            });
            this.loadData();
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
        this.service.delete(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: 'Bank account has been deleted.',
              timer: 2000
            });
            this.loadData();
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

  resetForm() {
    this.selected = this.emptyForm();
    this.units = [];
    this.isEdit = false;
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
      this.selected.departmentUnit
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

    autoTable(doc, {
      head: [['ID', 'Bank', 'Account No', 'Type', 'Name', 'Department', 'Status']],
      body: [...this.approvedAccounts, ...this.rejectedAccounts].map(a => [
        a.id,
        a.bankName,
        a.accountNumber,
        a.accountType,
        a.accountName,
        a.department,
        a.status
      ]),
      startY: 25,
      styles: { fontSize: 9, halign: 'left' },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save('BankAccounts.pdf');
  }

  exportToExcel() {
    const ws = XLSX.utils.json_to_sheet([...this.approvedAccounts, ...this.rejectedAccounts]);
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



  // printTable() {
  //   window.print();
  // }
