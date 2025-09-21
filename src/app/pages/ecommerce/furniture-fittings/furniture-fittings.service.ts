import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FurnitureFitting {
  id?: number;
  itemDescription: string;
  serialNumber: string;
  quantity: number;
  location: string;
  department: string;
  departmentUnit: string;
  purchaseCost: number;
  responsibleOfficer: string;
  condition: string;
  purchaseDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class FurnitureFittingService {
  private apiUrl = 'http://localhost:5245/api/FurnitureFitting';

  constructor(private http: HttpClient) {}

  getAll(): Observable<FurnitureFitting[]> {
    return this.http.get<FurnitureFitting[]>(this.apiUrl);
  }

  getById(id: number): Observable<FurnitureFitting> {
    return this.http.get<FurnitureFitting>(`${this.apiUrl}/${id}`);
  }

  create(item: FurnitureFitting): Observable<FurnitureFitting> {
    return this.http.post<FurnitureFitting>(this.apiUrl, item);
  }

  update(id: number, item: FurnitureFitting): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
