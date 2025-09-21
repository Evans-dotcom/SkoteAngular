import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssetTransfer {
  id?: number;
  assetId: number;
  fromDepartment: string;
  toDepartment: string;
//  dateTransferred: Date;
  approvedBy: string;
  remarks: string;
  department: string;
  departmentUnit: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssetTransferService {
  private apiUrl = 'http://localhost:5245/api/AssetTransfer';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AssetTransfer[]> {
    return this.http.get<AssetTransfer[]>(this.apiUrl);
  }

  getById(id: number): Observable<AssetTransfer> {
    return this.http.get<AssetTransfer>(`${this.apiUrl}/${id}`);
  }

  create(entry: AssetTransfer): Observable<AssetTransfer> {
    return this.http.post<AssetTransfer>(this.apiUrl, entry);
  }

  update(id: number, entry: AssetTransfer): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, entry);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
