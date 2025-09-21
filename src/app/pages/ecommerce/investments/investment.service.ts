import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Investment {
  id?: number;
  investmentType: string;
  institution: string;
//  dateInvested?: Date;
  amount: number;
  expectedReturn: number;
  remarks: string;
  department: string;
  departmentUnit: string;
}

@Injectable({ providedIn: 'root' })
export class InvestmentService {
  private apiUrl = 'http://localhost:5245/api/Investment';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Investment[]> {
    return this.http.get<Investment[]>(this.apiUrl);
  }

  getById(id: number): Observable<Investment> {
    return this.http.get<Investment>(`${this.apiUrl}/${id}`);
  }

  create(record: Investment): Observable<Investment> {
    return this.http.post<Investment>(this.apiUrl, record);
  }

  update(id: number, record: Investment): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, record);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
