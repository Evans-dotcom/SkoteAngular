import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AccountsPayable {
  id?: number;
  creditorName: string;
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
export class AccountsPayableService {
  private apiUrl = 'http://localhost:5245/api/AccountsPayable';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AccountsPayable[]> {
    return this.http.get<AccountsPayable[]>(this.apiUrl);
  }

  getById(id: number): Observable<AccountsPayable> {
    return this.http.get<AccountsPayable>(`${this.apiUrl}/${id}`);
  }

  create(data: AccountsPayable): Observable<AccountsPayable> {
    return this.http.post<AccountsPayable>(this.apiUrl, data);
  }

  update(id: number, data: AccountsPayable): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
