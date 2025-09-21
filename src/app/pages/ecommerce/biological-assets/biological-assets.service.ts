import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BiologicalAsset {
  id?: number;
  assetType: string;
  quantity: number;
  acquisitionDate: Date;
  location: string;
  value: number;
  notes: string;
  department: string;
  departmentUnit: string;
  contractDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BiologicalAssetService {
  private apiUrl = 'http://localhost:5245/api/BiologicalAsset';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BiologicalAsset[]> {
    return this.http.get<BiologicalAsset[]>(this.apiUrl);
  }

  getById(id: number): Observable<BiologicalAsset> {
    return this.http.get<BiologicalAsset>(`${this.apiUrl}/${id}`);
  }

  create(entry: BiologicalAsset): Observable<BiologicalAsset> {
    return this.http.post<BiologicalAsset>(this.apiUrl, entry);
  }

  update(id: number, entry: BiologicalAsset): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, entry);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
