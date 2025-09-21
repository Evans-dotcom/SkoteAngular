import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoadsInfrastructure {
  id?: number;
  roadName: string;
  location: string;
  lengthKm: number;
  constructionCost: number;
  yearConstructed: number;
  remarks: string;
  department: string;
  departmentUnit: string;
  contractDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RoadsInfrastructureService {
  private apiUrl = 'http://localhost:5245/api/RoadsInfrastructure';

  constructor(private http: HttpClient) {}

  getAll(): Observable<RoadsInfrastructure[]> {
    return this.http.get<RoadsInfrastructure[]>(this.apiUrl);
  }

  getById(id: number): Observable<RoadsInfrastructure> {
    return this.http.get<RoadsInfrastructure>(`${this.apiUrl}/${id}`);
  }

  create(road: RoadsInfrastructure): Observable<RoadsInfrastructure> {
    return this.http.post<RoadsInfrastructure>(this.apiUrl, road);
  }

  update(id: number, road: RoadsInfrastructure): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, road);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
