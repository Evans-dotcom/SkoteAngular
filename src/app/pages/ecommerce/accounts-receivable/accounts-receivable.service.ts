import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccountsReceivable {
  id?: number;
  debtorName: string;
  amountDue: number;
  dueDate: Date;
  reason: string;
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountsReceivableService {
  private baseUrl = 'http://localhost:5245/api/AccountsReceivable';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AccountsReceivable[]> {
    return this.http.get<AccountsReceivable[]>(this.baseUrl);
  }

  getById(id: number): Observable<AccountsReceivable> {
    return this.http.get<AccountsReceivable>(`${this.baseUrl}/${id}`);
  }

  create(entry: AccountsReceivable): Observable<AccountsReceivable> {
    return this.http.post<AccountsReceivable>(this.baseUrl, entry);
  }

  update(id: number, entry: AccountsReceivable): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, entry);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
