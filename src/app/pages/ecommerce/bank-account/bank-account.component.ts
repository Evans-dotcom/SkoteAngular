import { Component, OnInit } from '@angular/core';
import { BankAccount, BankAccountService } from './bankaccount.service';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {
  accounts: BankAccount[] = [];
  selected: BankAccount = this.emptyAccount();
  isEdit = false;

  // Departments + units
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

  constructor(private service: BankAccountService) {}

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
    this.isEdit = true;
    this.onDepartmentChange(); // reload units
  }

  delete(id?: number) {
    if (id && confirm('Delete this bank account?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyAccount();
    this.isEdit = false;
    this.units = [];
  }

  emptyAccount(): BankAccount {
    return {
      bankName: '',
      accountNumber: '',
      accountType: '',
      openingBalance: 0,
      currentBalance: 0,
      remarks: '',
      department: '',
      departmentUnit: '',
      accountName: '',
      officerInCharge: '',
      signatories: ''
    };
  }

  onDepartmentChange() {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }
}
