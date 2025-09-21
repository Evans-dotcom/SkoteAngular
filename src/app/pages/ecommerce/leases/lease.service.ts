import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lease } from 'src/app/core/models/lease.model';  // ✅ shared model

@Injectable({
  providedIn: 'root'
})
export class LeaseService {
  private apiUrl = 'http://localhost:5245/api/Lease';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Lease[]> {
    return this.http.get<Lease[]>(this.apiUrl);
  }

  getById(id: number): Observable<Lease> {
    return this.http.get<Lease>(`${this.apiUrl}/${id}`);
  }

  create(item: Lease): Observable<Lease> {
    return this.http.post<Lease>(this.apiUrl, item);
  }

  update(id: number, item: Lease): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
