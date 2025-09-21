import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssetHandover {
  id?: number;
  assetId: number;
  fromEmployee: string;
  toEmployee: string;
  department: string;
  departmentUnit: string;
  // contractDate: Date;
//  dateHandedOver: Date;
  condition: string;
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssetHandoverService {
  private apiUrl = 'http://localhost:5245/api/AssetHandover';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AssetHandover[]> {
    return this.http.get<AssetHandover[]>(this.apiUrl);
  }

  getById(id: number): Observable<AssetHandover> {
    return this.http.get<AssetHandover>(`${this.apiUrl}/${id}`);
  }

  create(entry: AssetHandover): Observable<AssetHandover> {
    return this.http.post<AssetHandover>(this.apiUrl, entry);
  }

  update(id: number, entry: AssetHandover): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, entry);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
