import { Component, OnInit } from '@angular/core';
import { StocksRegister, StocksRegisterService } from './stocks-register.service';

@Component({
  selector: 'app-stocks-register',
  templateUrl: './stocks-register.component.html',
  styleUrls: ['./stocks-register.component.scss']
})
export class StocksRegisterComponent implements OnInit {
  stocks: StocksRegister[] = [];
  selected: StocksRegister = this.emptyForm();
  isEdit = false;

  // Departments and Units
  departments: { [key: string]: string[] } = {
    "Agriculture, Livestock and Co-operative Management": ["Livestock", "Crop Production", "Fisheries"],
    "Health Services": ["Hospitals", "Clinics", "Public Health"],
    "Water, Environment, Energy and natural resources": ["Water Supply", "Environment", "Forestry"],
    "Information, Communication, E-Government, Youth Affairs, Gender and Sports": ["ICT", "Youth Affairs", "Sports"],
    "Public Works, Roads and Transport": ["Roads", "Bridges", "Transport Services"],
    "Public Service Management": ["HR", "Administration", "Training"],
    "Trade, Industrialization, Tourism and wildlife": ["Trade", "Tourism", "Wildlife"],
    "Finance and Economic Planning": ["Accounts", "Revenue", "Budgeting"],
    "Education, Culture and Social Services": ["Schools", "Culture", "Community"],
    "Lands, Housing and Physical Planning": ["Land Registry", "Housing", "Urban Planning"]
  };

  availableUnits: string[] = [];

  constructor(private service: StocksRegisterService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => this.stocks = data);
  }

  save() {
    this.selected.totalValue = this.selected.quantity * this.selected.unitCost;

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

  onDepartmentChange() {
    this.availableUnits = this.departments[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }

  edit(item: StocksRegister) {
    this.selected = { ...item };
    this.onDepartmentChange(); // load correct units
    this.isEdit = true;
  }

  delete(id?: number) {
    if (id && confirm('Are you sure you want to delete this stock item?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyForm();
    this.availableUnits = [];
    this.isEdit = false;
  }

  emptyForm(): StocksRegister {
    return {
      itemName: '',
      unit: '',
      quantity: 0,
      unitCost: 0,
      totalValue: 0,
      location: '',
      //lastRestocked: new Date(),
      remarks: '',
      department: '',
      departmentUnit: ''
    };
  }
}
