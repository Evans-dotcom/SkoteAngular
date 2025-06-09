import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Imprest {
  id?: number;
  officer: string;
  amount: number;
  dateIssued: Date;
  purpose: string;
  status: string;
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImprestService {
  private apiUrl = 'http://localhost:5245/api/Imprest';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Imprest[]> {
    return this.http.get<Imprest[]>(this.apiUrl);
  }

  getById(id: number): Observable<Imprest> {
    return this.http.get<Imprest>(`${this.apiUrl}/${id}`);
  }

  create(entry: Imprest): Observable<Imprest> {
    return this.http.post<Imprest>(this.apiUrl, entry);
  }

  update(id: number, entry: Imprest): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, entry);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
