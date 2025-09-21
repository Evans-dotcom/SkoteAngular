import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BankAccount {
  id?: number;
  bankName: string;
  accountNumber: string;
  accountType: string;
  openingBalance: number;
  currentBalance: number;
  remarks: string;
  department: string;
  departmentUnit: string;
  accountName: string;
  contractDate?: Date;
  officerInCharge: string;
  signatories: string;
}

@Injectable({ providedIn: 'root' })
export class BankAccountService {
  private apiUrl = 'http://localhost:5245/api/BankAccount'; // ✅ Update if needed  http://localhost:5245/api/BankAccount


  constructor(private http: HttpClient) {}

  getAll(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.apiUrl);
  }

  getById(id: number): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiUrl}/${id}`);
  }

  create(account: BankAccount): Observable<BankAccount> {
    return this.http.post<BankAccount>(this.apiUrl, account);
  }

  update(id: number, account: BankAccount): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, account);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
