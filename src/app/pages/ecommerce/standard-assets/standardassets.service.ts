import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StandardAsset {
  id?: number;
  assetDescription: string;
  serialNumber: string;
  makeModel: string;
  tagNumber: string;
  deliveryDate?: Date;
  contractDate?: Date;
  pvNumber: string;
  purchaseAmount: number;
  depreciationRate: number;
  annualDepreciation: number;
  accumulatedDepreciation: number;
  netBookValue: number;
  responsibleOfficer: string;
  location: string;
  assetCondition: string;
  notes: string;
  department: string;
  departmentUnit: string;
}

@Injectable({ providedIn: 'root' })
export class StandardAssetService {
  private apiUrl = 'http://localhost:5245/api/StandardAssets'; 

  constructor(private http: HttpClient) {}

  getAll(): Observable<StandardAsset[]> {
    return this.http.get<StandardAsset[]>(this.apiUrl);
  }

  getById(id: number): Observable<StandardAsset> {
    return this.http.get<StandardAsset>(`${this.apiUrl}/${id}`);
  }

  create(asset: StandardAsset): Observable<StandardAsset> {
    return this.http.post<StandardAsset>(this.apiUrl, asset);
  }

  update(id: number, asset: StandardAsset): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, asset);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
