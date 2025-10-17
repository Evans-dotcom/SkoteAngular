import { Component, OnInit } from '@angular/core';
import { BankAccount, BankAccountService } from './bankaccount.service';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {
  accounts: BankAccount[] = [];
  selected: BankAccount = this.emptyForm();
  isEdit = false;

  // ✅ Banks dropdown
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

  // ✅ Account types
  accountTypes: string[] = ['Development Account', 'Current Account'];

  // ✅ Departments and Units
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
}
