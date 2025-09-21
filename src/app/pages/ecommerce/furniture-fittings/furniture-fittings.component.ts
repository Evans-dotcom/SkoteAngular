import { Component, OnInit } from '@angular/core';
import { FurnitureFitting, FurnitureFittingService } from './furniture-fittings.service';

@Component({
  selector: 'app-furniture-fittings',
  templateUrl: './furniture-fittings.component.html',
  styleUrls: ['./furniture-fittings.component.scss']
})
export class FurnitureFittingComponent implements OnInit {
  fittings: FurnitureFitting[] = [];
  selected: FurnitureFitting = this.emptyForm();
  isEdit = false;

  // ✅ Unified Departments
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

  // ✅ Units Map
  unitsMap: { [key: string]: string[] } = {
    'Agriculture, Livestock and Co-operative Management': ['Crop Production', 'Animal Health', 'Co-operatives'],
    'Health Services': ['Clinic', 'Pharmacy', 'Nursing'],
    'Water, Environment, Energy and natural resources': ['Water Supply', 'Forestry', 'Renewable Energy'],
    'Information, Communication, E-Government, Youth Affairs, Gender and Sports': ['ICT Infrastructure', 'E-Government', 'Sports'],
    'Public Works, Roads and Transport': ['Roads', 'Transport', 'Maintenance'],
    'Public Service Management': ['HR', 'Administration', 'Records'],
    'Trade, Industrialization, Tourism and wildlife': ['Trade Development', 'Tourism', 'Wildlife'],
    'Finance and Economic Planning': ['Accounts', 'Audit', 'Procurement'],
    'Education, Culture and Social Services': ['Schools', 'Libraries', 'Culture'],
    'Lands, Housing and Physical Planning': ['Land Registry', 'Survey', 'Urban Planning']
  };

  units: string[] = [];

  constructor(private service: FurnitureFittingService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.service.getAll().subscribe(data => this.fittings = data);
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

  edit(item: FurnitureFitting): void {
    this.selected = { ...item };
    this.isEdit = true;
    this.onDepartmentChange(); // preload units
  }

  delete(id?: number): void {
    if (id && confirm('Delete this item?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  onDepartmentChange(): void {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }

  resetForm(): void {
    this.selected = this.emptyForm();
    this.isEdit = false;
    this.units = [];
  }

  emptyForm(): FurnitureFitting {
    return {
      id: 0,
      itemDescription: '',
      serialNumber: '',
      quantity: 0,
      location: '',
      department: '',
      departmentUnit: '',
      purchaseCost: 0,
      responsibleOfficer: '',
      condition: ''
    };
  }
}
