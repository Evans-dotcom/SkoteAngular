import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PlantMachinery {
  id?: number;
  equipmentName: string;
  serialNumber: string;
  makeModel: string;
  //purchaseDate?: Date;
  value: number;
  location: string;
  operationalStatus: string;
  department: string;
  departmentUnit: string;
}

@Injectable({ providedIn: 'root' })
export class PlantMachineryService {
  private apiUrl = 'http://localhost:5245/api/PlantMachinery';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PlantMachinery[]> {
    return this.http.get<PlantMachinery[]>(this.apiUrl);
  }

  getById(id: number): Observable<PlantMachinery> {
    return this.http.get<PlantMachinery>(`${this.apiUrl}/${id}`);
  }

  create(asset: PlantMachinery): Observable<PlantMachinery> {
    return this.http.post<PlantMachinery>(this.apiUrl, asset);
  }

  update(id: number, asset: PlantMachinery): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, asset);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
