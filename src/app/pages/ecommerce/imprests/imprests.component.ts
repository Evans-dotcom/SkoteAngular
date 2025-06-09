import { Component, OnInit } from '@angular/core';
import { Imprest, ImprestService } from './imprests.service';

@Component({
  selector: 'app-imprest',
  templateUrl: './imprests.component.html',
  styleUrls: ['./imprests.component.css']
})
export class ImprestComponent implements OnInit {
  imprests: Imprest[] = [];
  selected: Imprest = this.emptyEntry();
  isEdit = false;

  constructor(private service: ImprestService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => this.imprests = data);
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

  edit(entry: Imprest) {
    this.selected = { ...entry };
    this.isEdit = true;
  }

  delete(id?: number) {
    if (id && confirm('Are you sure you want to delete this Imprest?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyEntry();
    this.isEdit = false;
  }

  emptyEntry(): Imprest {
    return {
      officer: '',
      amount: 0,
      dateIssued: new Date(),
      purpose: '',
      status: '',
      remarks: ''
    };
  }
}
