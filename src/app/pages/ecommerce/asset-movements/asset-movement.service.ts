import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssetMovement {
  id?: number;
  assetId: number;
  fromLocation: string;
  toLocation: string;
//  dateMoved: Date;
  movedBy: string;
  remarks: string;
  department: string;
  departmentUnit: string;
//  contractDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AssetMovementService {
  private apiUrl = 'http://localhost:5245/api/AssetMovement';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AssetMovement[]> {
    return this.http.get<AssetMovement[]>(this.apiUrl);
  }

  getById(id: number): Observable<AssetMovement> {
    return this.http.get<AssetMovement>(`${this.apiUrl}/${id}`);
  }

  create(entry: AssetMovement): Observable<AssetMovement> {
    return this.http.post<AssetMovement>(this.apiUrl, entry);
  }

  update(id: number, entry: AssetMovement): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, entry);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
