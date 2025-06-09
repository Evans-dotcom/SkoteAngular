import { Component, OnInit } from '@angular/core';
import { BankAccount, BankAccountService } from './bankaccount.service';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {
  bankAccounts: BankAccount[] = [];
  selectedAccount: BankAccount = {
    bankName: '',
    accountNumber: '',
    accountType: '',
    openingBalance: 0,
    currentBalance: 0,
    remarks: ''
  };
  isEdit = false;

  constructor(private accountService: BankAccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts() {
    this.accountService.getAll().subscribe(data => this.bankAccounts = data);
  }

  saveAccount() {
    if (this.isEdit && this.selectedAccount.id) {
      this.accountService.update(this.selectedAccount.id, this.selectedAccount).subscribe(() => {
        this.resetForm();
        this.loadAccounts();
      });
    } else {
      this.accountService.create(this.selectedAccount).subscribe(() => {
        this.resetForm();
        this.loadAccounts();
      });
    }
  }

  edit(account: BankAccount) {
    this.selectedAccount = { ...account };
    this.isEdit = true;
  }

  delete(id: number | undefined) {
    if (id && confirm('Are you sure you want to delete this account?')) {
      this.accountService.delete(id).subscribe(() => this.loadAccounts());
    }
  }
  resetForm() {
    this.selectedAccount = {
      bankName: '',
      accountNumber: '',
      accountType: '',
      openingBalance: 0,
      currentBalance: 0,
      remarks: ''
    };
    this.isEdit = false;
  }
}
