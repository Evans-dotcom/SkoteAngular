import { Component, OnInit } from '@angular/core';
import { AccountsReceivable, AccountsReceivableService } from './accounts-receivable.service';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

declare module 'jspdf' {
  export interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

@Component({
  selector: 'app-accounts-receivable',
  templateUrl: './accounts-receivable.component.html',
  styleUrls: ['./accounts-receivable.component.scss']
})
export class AccountsReceivableComponent implements OnInit {
  receivables: AccountsReceivable[] = [];
  selected: AccountsReceivable = this.emptyForm();
  isEdit = false;

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
    'Agriculture, Livestock and Co-operative Management': [
      'Crop Management', 'Livestock', 'Fisheries', 'Co-operatives'
    ],
    'Health Services': [
      'Clinical Services', 'Nursing', 'Pharmacy', 'Public Health'
    ],
    'Water, Environment, Energy and natural resources': [
      'Water Supply', 'Sanitation', 'Forestry', 'Energy'
    ],
    'Information, Communication, E-Government, Youth Affairs, Gender and Sports': [
      'ICT Infrastructure', 'E-Government', 'Youth Affairs', 'Sports'
    ],
    'Public Works, Roads and Transport': [
      'Roads Maintenance', 'Transport', 'Mechanical'
    ],
    'Public Service Management': [
      'HRM', 'Administration', 'Procurement'
    ],
    'Trade, Industrialization, Tourism and wildlife': [
      'Trade Development', 'Industrialization', 'Tourism', 'Wildlife'
    ],
    'Finance and Economic Planning': [
      'Accounts', 'Audit', 'Procurement', 'Planning'
    ],
    'Education, Culture and Social Services': [
      'Early Childhood Education', 'Culture', 'Social Services'
    ],
    'Lands, Housing and Physical Planning': [
      'Survey', 'Physical Planning', 'Housing'
    ]
  };

  units: string[] = [];

  constructor(private service: AccountsReceivableService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getAll().subscribe(data => this.receivables = data);
  }

  save(): void {
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

  edit(item: AccountsReceivable): void {
    this.selected = { ...item };
    this.isEdit = true;
    this.onDepartmentChange();
  }

  delete(id?: number): void {
    if (id && confirm('Delete this Accounts Receivable?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm(): void {
    this.selected = this.emptyForm();
    this.isEdit = false;
    this.units = [];
  }

  emptyForm(): AccountsReceivable {
    return {
      debtorName: '',
      amountDue: 0,
      reason: '',
      remarks: '',
      department: '',
      departmentUnit: ''
    };
  }

  onDepartmentChange(): void {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }

  exportToExcel(): void {
    const data = this.receivables.map(r => ({
      ID: r.id,
      'Debtor Name': r.debtorName,
      'Amount Due (Ksh)': r.amountDue,
      Reason: r.reason,
      Department: r.department,
      Unit: r.departmentUnit,
      Remarks: r.remarks
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AccountsReceivable');
    XLSX.writeFile(wb, 'Accounts_Receivable_Register.xlsx');
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('County Accounts Receivable Register', 14, 15);

    const head = [['ID', 'Debtor Name', 'Amount Due (Ksh)', 'Reason', 'Department', 'Unit', 'Remarks']];
    const body = this.receivables.map(r => [
      r.id ?? '',
      r.debtorName,
      r.amountDue.toLocaleString('en-KE'),
      r.reason,
      r.department,
      r.departmentUnit,
      r.remarks
    ]);

    autoTable(doc, {
      head,
      body,
      startY: 25,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    doc.save('Accounts_Receivable_Register.pdf');
  }

  printTable(): void {
    const printContents = document.getElementById('accounts-receivable-table')?.innerHTML;
    const popup = window.open('', '_blank', 'width=1000,height=700');

    popup?.document.write(`
      <html>
        <head>
          <title>Accounts Receivable Printout</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 10px; text-align: left; font-size: 12px; }
            th { background-color: #eee; font-weight: bold; }
            .no-print { display: none !important; }
            .font-mono { text-align: right; }
          </style>
        </head>
        <body>
          <h2>Accounts Receivable Register - Printout</h2>
          ${printContents || '<p style="text-align: center;">No data available for printing.</p>'}
        </body>
      </html>
    `);

    popup?.document.close();
    setTimeout(() => {
      popup?.print();
    }, 500);
  }
}
