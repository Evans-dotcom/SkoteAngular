import { Component, OnInit } from '@angular/core';
import { Investment, InvestmentService } from './investment.service';

@Component({
  selector: 'app-investments',
  templateUrl: './investments.component.html',
  styleUrls: ['./investments.component.scss']
})
export class InvestmentsComponent implements OnInit {
  investments: Investment[] = [];
  selected: Investment = this.emptyInvestment();
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

  // ✅ Example Units mapping for each department
  unitsMap: { [key: string]: string[] } = {
    'Agriculture, Livestock and Co-operative Management': ['Crops', 'Livestock', 'Co-operatives'],
    'Health Services': ['Nursing', 'Pharmacy', 'Clinics'],
    'Water, Environment, Energy and natural resources': ['Water Supply', 'Forestry', 'Energy'],
    'Information, Communication, E-Government, Youth Affairs, Gender and Sports': ['ICT', 'Youth Affairs', 'Sports'],
    'Public Works, Roads and Transport': ['Roads', 'Transport', 'Maintenance'],
    'Public Service Management': ['HR', 'Administration', 'Training'],
    'Trade, Industrialization, Tourism and wildlife': ['Trade', 'Tourism', 'Wildlife'],
    'Finance and Economic Planning': ['Accounts', 'Audit', 'Procurement'],
    'Education, Culture and Social Services': ['Primary Education', 'Secondary Education', 'Culture'],
    'Lands, Housing and Physical Planning': ['Survey', 'Housing', 'Urban Planning']
  };

  units: string[] = [];

  constructor(private service: InvestmentService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getAll().subscribe(data => (this.investments = data));
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

  edit(item: Investment): void {
    this.selected = { ...item };
    this.isEdit = true;
    this.onDepartmentChange();
  }

  delete(id?: number): void {
    if (id && confirm('Are you sure you want to delete this investment?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  onDepartmentChange(): void {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }

  resetForm(): void {
    this.selected = this.emptyInvestment();
    this.isEdit = false;
    this.units = [];
  }

  emptyInvestment(): Investment {
    return {
      investmentType: '',
      institution: '',
      //dateInvested: new Date(),
      amount: 0,
      expectedReturn: 0,
      remarks: '',
      department: '',
      departmentUnit: ''
    };
  }
}
