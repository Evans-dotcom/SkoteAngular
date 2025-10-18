import { Component, OnInit } from '@angular/core';
import { BankAccount, BankAccountService } from './bankaccount.service';
import jsPDF from 'jspdf';
// import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {
  accounts: BankAccount[] = [];
  selected: BankAccount = this.emptyForm();
  isEdit = false;

  // Bank list
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

  constructor(private service: BankAccountService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => (this.accounts = data));
  }

  save() {
    if (this.isEdit && this.selected.id) {
      this.service.update(this.selected.id, this.selected).subscribe(() => {
        this.resetForm();
        this.loadData();
      });
    } else {
      this.service.create(this.selected).subscribe(() => {
        this.resetForm();
        this.loadData();
      });
    }
  }

  edit(item: BankAccount) {
    this.selected = { ...item };
    this.onDepartmentChange();
    this.isEdit = true;
  }

  delete(id?: number) {
    if (id && confirm('Are you sure you want to delete this bank account?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
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

  emptyForm(): BankAccount {
    return {
      id: 0,
      bankName: '',
      accountNumber: '',
      accountType: '',
      accountName: '',
      openingBalance: 0,
      currentBalance: 0,
      remarks: '',
      department: '',
      departmentUnit: '',
      officerInCharge: '',
      signatories: ''
    };
  }

  // ---------- Export & Print Features ----------
  exportToPDF() {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(14);
    doc.text('Bank Accounts Report', 14, 15);

    // Table
    autoTable(doc, {
      head: [['ID', 'Bank', 'Account No', 'Type', 'Name', 'Department', 'Unit']],
      body: this.accounts.map(a => [
        a.id,
        a.bankName,
        a.accountNumber,
        a.accountType,
        a.accountName,
        a.department,
        a.departmentUnit
      ]),
      startY: 25,
      styles: { fontSize: 9, halign: 'left' },
      headStyles: { fillColor: [22, 160, 133] },
    });

    // Save file
    doc.save('BankAccounts.pdf');
  }


  exportToExcel() {
    const ws = XLSX.utils.json_to_sheet(this.accounts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'BankAccounts');
    XLSX.writeFile(wb, 'BankAccounts.xlsx');
  }

  printTable() {
  const printContents = document.getElementById('table-section')?.innerHTML;
  const popup = window.open('', '_blank', 'width=900,height=700');
  popup?.document.write(`
    <html>
      <head>
        <title>Bank Account Records</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h3 { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; font-size: 12px; }
          th { background-color: #343a40; color: white; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .header { text-align: center; margin-bottom: 20px; }
          .header h2 { margin: 0; color: #0d6efd; }
          
          /* Hide elements with no-print class */
          .no-print { display: none !important; }
          
          @media print {
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>County Government Bank Accounts</h2>
          <p><strong>Generated On:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <h3>Bank Account Records</h3>
        ${printContents || '<p>No data available.</p>'}
      </body>
    </html>
  `);
  popup?.document.close();
  popup?.print();
}

}
