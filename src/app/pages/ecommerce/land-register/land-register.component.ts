import { Component, OnInit } from '@angular/core';
import { LandRegister, LandRegisterService } from './land-register.service';

@Component({
  selector: 'app-land-register',
  templateUrl: './land-register.component.html',
  styleUrls: ['./land-register.component.scss']
})
export class LandRegisterComponent implements OnInit {
  lands: LandRegister[] = [];
  selected: LandRegister = this.emptyRecord();
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

  constructor(private service: LandRegisterService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => (this.lands = data));
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

  edit(record: LandRegister) {
    this.selected = { ...record };
    this.isEdit = true;
    this.onDepartmentChange();
  }

  delete(id?: number) {
    if (id && confirm('Are you sure you want to delete this land record?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyRecord();
    this.isEdit = false;
    this.units = [];
  }

  emptyRecord(): LandRegister {
    return {
      parcelNumber: '',
      location: '',
      acreage: 0,
      titleDeedNumber: '',
      dateAcquired: new Date(),
      ownershipStatus: '',
      landValue: 0,
      department: '',
      departmentUnit: ''
    };
  }

  onDepartmentChange() {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }
}
