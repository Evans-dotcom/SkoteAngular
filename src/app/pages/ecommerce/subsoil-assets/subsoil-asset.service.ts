import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SubsoilAsset {
  id?: number;
  resourceType: string;
  location: string;
  estimatedVolume: string;
  ownershipStatus: string;
  valueEstimate: number;
  remarks: string;
  department: string;
  departmentUnit: string;
}

@Injectable({
  providedIn: 'root'
})
export class SubsoilAssetService {
  private apiUrl = 'http://localhost:5245/api/SubsoilAssets';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SubsoilAsset[]> {
    return this.http.get<SubsoilAsset[]>(this.apiUrl);
  }

  getById(id: number): Observable<SubsoilAsset> {
    return this.http.get<SubsoilAsset>(`${this.apiUrl}/${id}`);
  }

  create(data: SubsoilAsset): Observable<SubsoilAsset> {
    return this.http.post<SubsoilAsset>(this.apiUrl, data);
  }

  update(id: number, data: SubsoilAsset): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
