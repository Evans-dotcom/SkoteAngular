import { Component, OnInit } from '@angular/core';
import { PlantMachinery, PlantMachineryService } from './plant-machinery.service';

@Component({
  selector: 'app-plant-machinery',
  templateUrl: './plant-machinery.component.html',
  styleUrls: ['./plant-machinery.component.scss']
})
export class PlantMachineryComponent implements OnInit {
  assets: PlantMachinery[] = [];
  selected: PlantMachinery = this.emptyAsset();
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

  constructor(private service: PlantMachineryService) {}

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

  edit(item: PlantMachinery) {
    this.selected = { ...item };
    this.isEdit = true;
    this.onDepartmentChange();
  }

  delete(id?: number) {
    if (id && confirm('Delete this Plant Machinery asset?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyAsset();
    this.isEdit = false;
    this.units = [];
  }

  emptyAsset(): PlantMachinery {
    return {
      equipmentName: '',
      serialNumber: '',
      makeModel: '',
     // purchaseDate: new Date(),
      value: 0,
      location: '',
      operationalStatus: '',
      department: '',
      departmentUnit: ''
    };
  }

  onDepartmentChange() {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }
}
