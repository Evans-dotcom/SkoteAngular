import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StandardAsset } from 'src/app/core/models/standard-asset.model';

@Injectable({
  providedIn: 'root'
})
export class StandardAssetService {
  private baseUrl = 'http://localhost:5245/api/StandardAssets';

  constructor(private http: HttpClient) {}

  getAll(): Observable<StandardAsset[]> {
    return this.http.get<StandardAsset[]>(this.baseUrl);
  }

  getById(id: number): Observable<StandardAsset> {
    return this.http.get<StandardAsset>(`${this.baseUrl}/${id}`);
  }

  create(asset: StandardAsset): Observable<StandardAsset> {
    return this.http.post<StandardAsset>(this.baseUrl, asset);
  }

  update(id: number, asset: StandardAsset): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, asset);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
