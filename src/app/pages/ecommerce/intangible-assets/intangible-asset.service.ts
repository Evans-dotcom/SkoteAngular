import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IntangibleAsset {
  id?: number;
  assetType: string;
  description: string;
  //dateAcquired: Date;
  value: number;
  usefulLifeYears: number;
  department: string;
  departmentUnit: string;
}

@Injectable({
  providedIn: 'root'
})
export class IntangibleAssetService {
  private apiUrl = 'http://localhost:5245/api/IntangibleAssets';

  constructor(private http: HttpClient) {}

  getAll(): Observable<IntangibleAsset[]> {
    return this.http.get<IntangibleAsset[]>(this.apiUrl);
  }

  getById(id: number): Observable<IntangibleAsset> {
    return this.http.get<IntangibleAsset>(`${this.apiUrl}/${id}`);
  }

  create(asset: IntangibleAsset): Observable<IntangibleAsset> {
    return this.http.post<IntangibleAsset>(this.apiUrl, asset);
  }

  update(id: number, asset: IntangibleAsset): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, asset);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
