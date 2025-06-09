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
  purchaseDate: Date;
  purchasePrice: number;
  location: string;
  responsibleOfficer: string;
}

@Injectable({
  providedIn: 'root'
})
export class MotorVehicleService {
  private apiUrl = 'http://localhost:5245/api/MotorVehicles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<MotorVehicle[]> {
    return this.http.get<MotorVehicle[]>(this.apiUrl);
  }

  getById(id: number): Observable<MotorVehicle> {
    return this.http.get<MotorVehicle>(`${this.apiUrl}/${id}`);
  }

  create(item: MotorVehicle): Observable<MotorVehicle> {
    return this.http.post<MotorVehicle>(this.apiUrl, item);
  }

  update(id: number, item: MotorVehicle): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
