import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LandRegister {
  id?: number;
  parcelNumber: string;
  location: string;
  acreage: number;
  titleDeedNumber: string;
  dateAcquired?: Date;
  ownershipStatus: string;
  landValue: number;
  department: string;
  departmentUnit: string;
}

@Injectable({ providedIn: 'root' })
export class LandRegisterService {
  private apiUrl = 'http://localhost:5245/api/LandRegister';

  constructor(private http: HttpClient) {}

  getAll(): Observable<LandRegister[]> {
    return this.http.get<LandRegister[]>(this.apiUrl);
  }

  getById(id: number): Observable<LandRegister> {
    return this.http.get<LandRegister>(`${this.apiUrl}/${id}`);
  }

  create(record: LandRegister): Observable<LandRegister> {
    return this.http.post<LandRegister>(this.apiUrl, record);
  }

  update(id: number, record: LandRegister): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, record);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
