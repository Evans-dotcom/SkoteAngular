import { Component, OnInit } from '@angular/core';
import { StandardAsset, StandardAssetService } from './standardassets.service';

// Import necessary libraries for Export/Print
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';



// This augmentation is necessary for TypeScript when using jspdf-autotable
declare module 'jspdf' {
  export interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
@Component({
  selector: 'app-standard-asset',
  templateUrl: './standard-assets.component.html',
  styleUrls: ['./standard-assets.component.scss']
})
export class StandardAssetComponent implements OnInit {
  assets: StandardAsset[] = [];
  selected: StandardAsset = this.emptyAsset();
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
    'Agriculture, Livestock and Co-operative Management': ['Crop Management', 'Veterinary', 'Fisheries'],
    'Health Services': ['Clinic', 'Pharmacy', 'Nursing'],
    'Water, Environment, Energy and natural resources': ['Water Supply', 'Forestry', 'Conservation'],
    'Information, Communication, E-Government, Youth Affairs, Gender and Sports': ['ICT', 'Youth Affairs', 'Sports'],
    'Public Works, Roads and Transport': ['Roads', 'Transport', 'Maintenance'],
    'Public Service Management': ['HR', 'Administration'],
    'Trade, Industrialization, Tourism and wildlife': ['Trade', 'Tourism', 'Wildlife'],
    'Finance and Economic Planning': ['Accounts', 'Procurement', 'Audit'],
    'Education, Culture and Social Services': ['Schools', 'Culture', 'Social Work'],
    'Lands, Housing and Physical Planning': ['Survey', 'Housing', 'Planning']
  };

  units: string[] = [];

  constructor(private service: StandardAssetService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => (this.assets = data));
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

  edit(item: StandardAsset) {
    // Ensure the date strings are copied correctly
    this.selected = { ...item };
    this.isEdit = true;
    this.onDepartmentChange();
  }

  delete(id?: number) {
    if (id && confirm('Delete this asset?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyAsset();
    this.isEdit = false;
    this.units = [];
  }

  emptyAsset(): StandardAsset {
    return {
      assetDescription: '',
      serialNumber: '',
      makeModel: '',
      tagNumber: '',
      pvNumber: '',
      purchaseAmount: 0,
      depreciationRate: 0,
      annualDepreciation: 0,
      accumulatedDepreciation: 0,
      netBookValue: 0,
      responsibleOfficer: '',
      location: '',
      assetCondition: '',
      notes: '',
      department: '',
      departmentUnit: '',
      // deliveryDate: '' 
      // contractDate: ''
    };
  }

  onDepartmentChange() {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }

  /**
   * Export Functions
   */
  exportToExcel(): void {
    const data = this.assets.map(a => ({
      ID: a.id,
      Description: a.assetDescription,
      Serial: a.serialNumber,
      Model: a.makeModel,
      Tag: a.tagNumber,
      // Delivery_Date: a.deliveryDate,
      // Contract_Date: a.contractDate,
      PV_Number: a.pvNumber,
      Purchase_Amount: a.purchaseAmount,
      Depreciation_Rate: a.depreciationRate,
      Annual_Depreciation: a.annualDepreciation,
      Accumulated_Depreciation: a.accumulatedDepreciation,
      Net_Book_Value: a.netBookValue,
      Responsible_Officer: a.responsibleOfficer,
      Location: a.location,
      Condition: a.assetCondition,
      Department: a.department,
      Unit: a.departmentUnit,
      Notes: a.notes,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'StandardAssets');
    XLSX.writeFile(wb, 'Standard_Asset_Register.xlsx');
  }

  exportToPDF(): void {
    const doc = new jsPDF('landscape');
    doc.setFontSize(10);
    doc.text('County Standard Asset Register', 14, 15);

    const head = [[
      'ID', 'Description', 'Model', 'Tag', 'Purchase', 'NBV',
      'Officer', 'Location', 'Condition', 'Dept', 'Unit'
    ]];

    const body = this.assets.map(a => [
      a.id?.toString() || '',
      a.assetDescription,
      a.makeModel,
      a.tagNumber,
      a.purchaseAmount.toLocaleString('en-KE'),
      a.netBookValue.toLocaleString('en-KE'),
      a.responsibleOfficer,
      a.location,
      a.assetCondition,
      a.department,
      a.departmentUnit
    ]);

    autoTable(doc, {
      head: head,
      body: body,
      startY: 20,
      styles: { fontSize: 7, cellPadding: 1, overflow: 'linebreak' },
      headStyles: { fillColor: [44, 62, 80], fontStyle: 'bold' },
      columnStyles: { 4: { halign: 'right' }, 5: { halign: 'right' } }
    });

    doc.save('Standard_Asset_Register.pdf');
  }

  printTable(): void {
    const tableElement = document.getElementById('standard-asset-table');
    if (!tableElement) {
      console.error('Table element not found for printing.');
      return;
    }

    const printContents = tableElement.outerHTML;

    const popup = window.open('', '_blank', 'width=1200,height=800');

    popup?.document.write(`
      <html>
        <head>
          <title>Standard Asset Printout</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
            .card { border: none !important; box-shadow: none !important; }
            .d-flex { display: flex; justify-content: space-between; align-items: center; }
            h5 { font-size: 1.25rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; table-layout: fixed; }
            th, td { border: 1px solid #ccc; padding: 5px; text-align: left; font-size: 10px; word-wrap: break-word; }
            th { background-color: #eee; font-weight: bold; }
            /* Hide action buttons and columns */
            .no-print { display: none !important; }
            .text-sm { font-size: 0.75rem; }
            .text-end { text-align: right; }
            .text-success { color: #198754; }
            .fw-bold { font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>County Standard Asset Register - Printout</h2>
          ${printContents}
        </body>
      </html>
    `);

    popup?.document.close();
    // Wait a moment for the content to fully load before printing
    setTimeout(() => {
      popup?.print();
    }, 500);
  }
}
