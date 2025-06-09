import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PlantMachinery {
  id?: number;
  equipmentName: string;
  serialNumber: string;
  makeModel: string;
  purchaseDate: Date;
  value: number;
  location: string;
  operationalStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlantMachineryService {
  private baseUrl = 'http://localhost:5245/api/PlantMachinery';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PlantMachinery[]> {
    return this.http.get<PlantMachinery[]>(this.baseUrl);
  }
  getById(id: number): Observable<PlantMachinery> {
    return this.http.get<PlantMachinery>(`${this.baseUrl}/${id}`);
  }
  create(item: PlantMachinery): Observable<PlantMachinery> {
    return this.http.post<PlantMachinery>(this.baseUrl, item);
  }
  update(id: number, item: PlantMachinery): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, item);
  }
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
