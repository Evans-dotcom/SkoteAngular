import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OtherInfrastructure {
  id?: number;
  assetName: string;
  location: string;
  description: string;
  value: number;
  //acquisitionDate: Date;
  remarks: string;
  department: string;
  departmentUnit: string;
}

@Injectable({
  providedIn: 'root'
})
export class OtherInfrastructureService {
  private apiUrl = 'http://localhost:5245/api/OtherInfrastructure';

  constructor(private http: HttpClient) {}

  getAll(): Observable<OtherInfrastructure[]> {
    return this.http.get<OtherInfrastructure[]>(this.apiUrl);
  }

  getById(id: number): Observable<OtherInfrastructure> {
    return this.http.get<OtherInfrastructure>(`${this.apiUrl}/${id}`);
  }

  create(record: OtherInfrastructure): Observable<OtherInfrastructure> {
    return this.http.post<OtherInfrastructure>(this.apiUrl, record);
  }

  update(id: number, record: OtherInfrastructure): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, record);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
