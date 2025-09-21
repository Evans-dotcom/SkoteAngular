import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EquipmentSignout {
  id?: number;
  equipmentId: number;
  issuedTo: string;
  // dateIssued: Date;
  // expectedReturnDate: Date;
  // actualReturnDate: Date;
  conditionOnReturn: string;
  remarks: string;
  department: string;
  departmentUnit: string;
}

@Injectable({
  providedIn: 'root'
})
export class EquipmentSignoutService {
  private apiUrl = 'http://localhost:5245/api/EquipmentSignout';

  constructor(private http: HttpClient) {}

  getAll(): Observable<EquipmentSignout[]> {
    return this.http.get<EquipmentSignout[]>(this.apiUrl);
  }

  getById(id: number): Observable<EquipmentSignout> {
    return this.http.get<EquipmentSignout>(`${this.apiUrl}/${id}`);
  }

  create(entry: EquipmentSignout): Observable<EquipmentSignout> {
    return this.http.post<EquipmentSignout>(this.apiUrl, entry);
  }

  update(id: number, entry: EquipmentSignout): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, entry);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
