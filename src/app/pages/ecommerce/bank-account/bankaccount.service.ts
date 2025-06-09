import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BankAccount {
  id?: number;
  bankName: string;
  accountNumber: string;
  accountType: string;
  openingBalance: number;
  currentBalance: number;
  remarks: string;
}


@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private baseUrl = 'http://localhost:5245/api/BankAccount';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.baseUrl);
  }

  getById(id: number): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.baseUrl}/${id}`);
  }

  create(account: BankAccount): Observable<BankAccount> {
    return this.http.post<BankAccount>(this.baseUrl, account);
  }

  update(id: number, account: BankAccount): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, account);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
