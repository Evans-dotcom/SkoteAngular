import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccountsReceivable {
  id?: number;
  debtorName: string;
  amountDue: number;
  //dueDate: Date;
  reason: string;
  remarks: string;
  department: string;
  departmentUnit: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountsReceivableService {
  private apiUrl = 'http://localhost:5245/api/AccountsReceivable';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AccountsReceivable[]> {
    return this.http.get<AccountsReceivable[]>(this.apiUrl);
  }

  getById(id: number): Observable<AccountsReceivable> {
    return this.http.get<AccountsReceivable>(`${this.apiUrl}/${id}`);
  }

  create(entry: AccountsReceivable): Observable<AccountsReceivable> {
    return this.http.post<AccountsReceivable>(this.apiUrl, entry);
  }

  update(id: number, entry: AccountsReceivable): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, entry);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
