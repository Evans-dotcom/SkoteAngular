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

  constructor(private service: MotorVehicleService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => this.vehicles = data);
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

  edit(item: MotorVehicle) {
    this.selected = { ...item };
    this.isEdit = true;
  }

  delete(id?: number) {
    if (id && confirm('Confirm delete this vehicle?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyVehicle();
    this.isEdit = false;
  }

  emptyVehicle(): MotorVehicle {
    return {
      registrationNumber: '',
      make: '',
      model: '',
      yearOfManufacture: new Date().getFullYear(),
      engineNumber: '',
      chassisNumber: '',
      purchaseDate: new Date(),
      purchasePrice: 0,
      location: '',
      responsibleOfficer: ''
    };
  }
}
