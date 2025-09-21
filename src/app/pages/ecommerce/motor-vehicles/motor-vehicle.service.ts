import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MotorVehicle {
  id?: number;
  registrationNumber: string;
  make: string;
  model: string;
  yearOfManufacture: number;
  engineNumber: string;
  chassisNumber: string;
  //purchaseDate?: Date;
  purchasePrice: number;
  location: string;
  responsibleOfficer: string;
  department: string;
  departmentUnit: string;
}

@Injectable({ providedIn: 'root' })
export class MotorVehicleService {
  private apiUrl = 'http://localhost:5245/api/MotorVehicles'; // ✅ adjust if needed

  constructor(private http: HttpClient) {}

  getAll(): Observable<MotorVehicle[]> {
    return this.http.get<MotorVehicle[]>(this.apiUrl);
  }

  getById(id: number): Observable<MotorVehicle> {
    return this.http.get<MotorVehicle>(`${this.apiUrl}/${id}`);
  }

  create(vehicle: MotorVehicle): Observable<MotorVehicle> {
    return this.http.post<MotorVehicle>(this.apiUrl, vehicle);
  }

  update(id: number, vehicle: MotorVehicle): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, vehicle);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
