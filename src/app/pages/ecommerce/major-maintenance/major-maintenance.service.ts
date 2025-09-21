import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MajorMaintenance {
  id?: number;
  assetId: number;
  maintenanceType: string;
  // dateStarted: Date;
  // dateCompleted: Date;
  cost: number;
  remarks: string;
  department: string;
  departmentUnit: string;
}

@Injectable({
  providedIn: 'root'
})
export class MajorMaintenanceService {
  private apiUrl = 'http://localhost:5245/api/MajorMaintenance';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MajorMaintenance[]> {
    return this.http.get<MajorMaintenance[]>(this.apiUrl);
  }

  getById(id: number): Observable<MajorMaintenance> {
    return this.http.get<MajorMaintenance>(`${this.apiUrl}/${id}`);
  }

  create(asset: MajorMaintenance): Observable<MajorMaintenance> {
    return this.http.post<MajorMaintenance>(this.apiUrl, asset);
  }

  update(id: number, asset: MajorMaintenance): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, asset);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
