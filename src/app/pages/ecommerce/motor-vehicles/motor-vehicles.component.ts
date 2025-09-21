import { Component, OnInit } from '@angular/core';
import { MotorVehicle, MotorVehicleService } from './motor-vehicle.service';

@Component({
  selector: 'app-motor-vehicle',
  templateUrl: './motor-vehicles.component.html',
  styleUrls: ['./motor-vehicles.component.scss']
})
export class MotorVehicleComponent implements OnInit {
  vehicles: MotorVehicle[] = [];
  selected: MotorVehicle = this.emptyVehicle();
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

  constructor(private service: MotorVehicleService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => (this.vehicles = data));
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

  edit(vehicle: MotorVehicle) {
    this.selected = { ...vehicle };
    this.isEdit = true;
    this.onDepartmentChange();
  }

  delete(id?: number) {
    if (id && confirm('Are you sure you want to delete this vehicle?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyVehicle();
    this.isEdit = false;
    this.units = [];
  }

  emptyVehicle(): MotorVehicle {
    return {
      registrationNumber: '',
      make: '',
      model: '',
      yearOfManufacture: new Date().getFullYear(),
      engineNumber: '',
      chassisNumber: '',
    //  purchaseDate: new Date(),
      purchasePrice: 0,
      location: '',
      responsibleOfficer: '',
      department: '',
      departmentUnit: ''
    };
  }

  onDepartmentChange() {
    this.units = this.unitsMap[this.selected.department] || [];
    this.selected.departmentUnit = '';
  }
}
