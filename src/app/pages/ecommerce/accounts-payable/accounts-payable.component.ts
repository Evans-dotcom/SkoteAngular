import { Component, OnInit } from '@angular/core';
import { AccountsPayable, AccountsPayableService } from './accounts-payable.service';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';


// This augmentation is necessary for TypeScript when using jspdf-autotable with jspdf
declare module 'jspdf' {
  export interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

@Component({
  selector: 'app-accounts-payable',
  templateUrl: './accounts-payable.component.html',
  styleUrls: ['./accounts-payable.component.scss']
})
export class AccountsPayableComponent implements OnInit {
  payables: AccountsPayable[] = [];
  selected: AccountsPayable = this.emptyForm();
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

  constructor(private service: AccountsPayableService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getAll().subscribe(data => this.payables = data);
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

  edit(item: AccountsPayable): void {
    this.selected = { ...item };
    this.isEdit = true;
    this.onDepartmentChange();
  }

  delete(id?: number): void {
    if (id && confirm('Delete this Accounts Payable?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm(): void {
    this.selected = this.emptyForm();
    this.units = [];
    this.isEdit = false;
  }

  emptyForm(): AccountsPayable {
    return {
      creditorName: '',
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
    const data = this.payables.map(p => ({
        ID: p.id,
        'Creditor Name': p.creditorName,
        'Amount Due (Ksh)': p.amountDue,
        Reason: p.reason,
        Department: p.department,
        Unit: p.departmentUnit,
        Remarks: p.remarks
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'AccountsPayable');
    XLSX.writeFile(wb, 'Accounts_Payable_Register.xlsx');
  }

  exportToPDF(): void {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('County Accounts Payable Register', 14, 15);

    const head = [['ID', 'Creditor Name', 'Amount Due (Ksh)', 'Reason', 'Department', 'Unit', 'Remarks']];
const body = this.payables.map(p => [
  p.id ?? '',
  p.creditorName,
  p.amountDue.toLocaleString('en-KE'),
  p.reason,
  p.department,
  p.departmentUnit,
  p.remarks
]);

autoTable(doc, {
  head,
  body,
  startY: 25,
  styles: { fontSize: 8 },
  headStyles: { fillColor: [22, 160, 133] },
  alternateRowStyles: { fillColor: [240, 240, 240] }
});

doc.save('Accounts_Payable_Register.pdf');
  }

  printTable(): void {
    const printContents = document.getElementById('accounts-payable-table')?.innerHTML;
    const popup = window.open('', '_blank', 'width=1000,height=700');

    popup?.document.write(`
      <html>
        <head>
          <title>Accounts Payable Printout</title>
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
          <h2>Accounts Payable Register - Printout</h2>
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
