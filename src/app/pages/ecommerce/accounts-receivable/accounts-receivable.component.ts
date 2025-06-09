import { Component, OnInit } from '@angular/core';
import { AccountsReceivable, AccountsReceivableService } from './accounts-receivable.service';

@Component({
  selector: 'app-accounts-receivable',
  templateUrl: './accounts-receivable.component.html',
  styleUrls: ['./accounts-receivable.component.scss']
})
export class AccountsReceivableComponent implements OnInit {
  receivables: AccountsReceivable[] = [];
  selected: AccountsReceivable = this.emptyEntry();
  isEdit = false;

  constructor(private service: AccountsReceivableService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.service.getAll().subscribe(data => this.receivables = data);
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

  edit(entry: AccountsReceivable) {
    this.selected = { ...entry };
    this.isEdit = true;
  }

  delete(id?: number) {
    if (id && confirm('Are you sure you want to delete this entry?')) {
      this.service.delete(id).subscribe(() => this.loadData());
    }
  }

  resetForm() {
    this.selected = this.emptyEntry();
    this.isEdit = false;
  }

  emptyEntry(): AccountsReceivable {
    return {
      debtorName: '',
      amountDue: 0,
      dueDate: new Date(),
      reason: '',
      remarks: ''
    };
  }
}
