import { Component, OnInit } from '@angular/core';
import { FurnitureFitting } from 'src/app/core/models/furniture-fitting.model';
import { FurnitureFittingService } from './furniture-fittings.service';

@Component({
  selector: 'app-furniture-fitting',
  templateUrl: './furniture-fittings.component.html',
  styleUrls: ['./furniture-fittings.component.scss']
})
export class FurnitureFittingComponent implements OnInit {
  fittings: FurnitureFitting[] = [];
  selected: FurnitureFitting = this.emptyForm();
  isEdit = false;

  constructor(private service: FurnitureFittingService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => this.fittings = data);
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

  edit(item: FurnitureFitting) {
    this.selected = { ...item };
    this.isEdit = true;
  }

  delete(id?: number) {
    if (id && confirm('Delete this item?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyForm();
    this.isEdit = false;
  }

  emptyForm(): FurnitureFitting {
    return {
      id: 0,
      itemDescription: '',
      serialNumber: '',
      quantity: 0,
      location: '',
      department: '',
      purchaseDate: new Date(),
      purchaseCost: 0,
      responsibleOfficer: '',
      condition: ''
    };
  }
}
