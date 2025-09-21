import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Litigation {
  id?: number;
  caseNumber: string;
  partiesInvolved: string;
  subject: string;
  status: string;
  dateFiled: Date;
  remarks: string;
  department: string;
  departmentUnit: string;
}

@Injectable({
  providedIn: 'root'
})
export class LitigationService {
  private apiUrl = 'http://localhost:5245/api/Litigation';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Litigation[]> {
    return this.http.get<Litigation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Litigation> {
    return this.http.get<Litigation>(`${this.apiUrl}/${id}`);
  }

  create(record: Litigation): Observable<Litigation> {
    return this.http.post<Litigation>(this.apiUrl, record);
  }

  update(id: number, record: Litigation): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, record);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
