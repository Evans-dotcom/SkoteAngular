import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface BuildingsRegister {
  id?: number;
  buildingName: string;
  location: string;
  usePurpose: string;
  //dateConstructed: Date;
  constructionCost: number;
  depreciation: number;
  netBookValue: number;
  department: string;
  departmentUnit: string;
}

@Injectable({
  providedIn: 'root'
})
export class BuildingsRegisterService {
  private apiUrl = 'http://localhost:5245/api/BuildingsRegister';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BuildingsRegister[]> {
    return this.http.get<BuildingsRegister[]>(this.apiUrl);
  }

  getById(id: number): Observable<BuildingsRegister> {
    return this.http.get<BuildingsRegister>(`${this.apiUrl}/${id}`);
  }

  create(entry: BuildingsRegister): Observable<BuildingsRegister> {
    return this.http.post<BuildingsRegister>(this.apiUrl, entry);
  }

  update(id: number, entry: BuildingsRegister): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, entry);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
