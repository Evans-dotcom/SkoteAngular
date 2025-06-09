import { Component, OnInit } from '@angular/core';
import { StocksRegister, StocksRegisterService } from './stocks-register.service';

@Component({
  selector: 'app-stocks-register',
  templateUrl: './stocks-register.component.html',
  styleUrls: ['./stocks-register.component.scss']
})
export class StocksRegisterComponent implements OnInit {
  stockItems: StocksRegister[] = [];
  selectedItem: StocksRegister = this.emptyItem();
  isEdit = false;

  constructor(private service: StocksRegisterService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.service.getAll().subscribe(data => this.stockItems = data);
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

  edit(item: StocksRegister) {
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

  emptyItem(): StocksRegister {
    return {
      itemName: '',
      unit: '',
      quantity: 0,
      unitCost: 0,
      totalValue: 0,
      location: '',
      lastRestocked: new Date(),
      remarks: ''
    };
  }
}
