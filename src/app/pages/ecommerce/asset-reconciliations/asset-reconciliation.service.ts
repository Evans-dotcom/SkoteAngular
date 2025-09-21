import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssetReconciliation {
  id?: number;
  assetId: number;
//  dateReconciled: Date;
  physicalCount: number;
  systemCount: number;
  reconciledBy: string;
  discrepancy: string;
  remarks: string;
  department: string;
  departmentUnit: string;
  //contractDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AssetReconciliationService {
  private apiUrl = 'http://localhost:5245/api/AssetReconciliation';

  constructor(private http: HttpClient) {}

  getAll(): Observable<AssetReconciliation[]> {
    return this.http.get<AssetReconciliation[]>(this.apiUrl);
  }

  getById(id: number): Observable<AssetReconciliation> {
    return this.http.get<AssetReconciliation>(`${this.apiUrl}/${id}`);
  }

  create(entry: AssetReconciliation): Observable<AssetReconciliation> {
    return this.http.post<AssetReconciliation>(this.apiUrl, entry);
  }

  update(id: number, entry: AssetReconciliation): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, entry);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
