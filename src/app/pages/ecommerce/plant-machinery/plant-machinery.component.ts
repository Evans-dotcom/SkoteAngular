import { Component, OnInit } from '@angular/core';
import { PlantMachinery, PlantMachineryService } from './plant-machinery.service';

@Component({
  selector: 'app-plant-machinery',
  templateUrl: './plant-machinery.component.html',
  styleUrls: ['./plant-machinery.component.scss']
})
export class PlantMachineryComponent implements OnInit {
  plantItems: PlantMachinery[] = [];
  selectedItem: PlantMachinery = this.emptyItem();
  isEdit = false;

  constructor(private service: PlantMachineryService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.service.getAll().subscribe(data => this.plantItems = data);
  }

  save() {
    if (this.isEdit && this.selectedItem.id) {
      this.service.update(this.selectedItem.id, this.selectedItem).subscribe(() => {
        this.resetForm();
        this.loadItems();
      });
    } else {
      this.service.create(this.selectedItem).subscribe(() => {
        this.resetForm();
        this.loadItems();
      });
    }
  }

  edit(item: PlantMachinery) {
    this.selectedItem = { ...item };
    this.isEdit = true;
  }

  delete(id?: number) {
    if (id && confirm('Are you sure you want to delete this record?')) {
      this.service.delete(id).subscribe(() => this.loadItems());
    }
  }

  resetForm() {
    this.selectedItem = this.emptyItem();
    this.isEdit = false;
  }

  emptyItem(): PlantMachinery {
    return {
      equipmentName: '',
      serialNumber: '',
      makeModel: '',
      purchaseDate: new Date(),
      value: 0,
      location: '',
      operationalStatus: ''
    };
  }
}
