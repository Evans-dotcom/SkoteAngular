import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WorkInProgress {
  id?: number;
  projectName: string;
  startDate?: Date;
  expectedCompletion?: Date;
  currentValue: number;
  remarks: string;
  department: string;
  departmentUnit: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkInProgressService {
  private apiUrl = 'http://localhost:5245/api/WorkInProgress';

  constructor(private http: HttpClient) {}

  getAll(): Observable<WorkInProgress[]> {
    return this.http.get<WorkInProgress[]>(this.apiUrl);
  }

  getById(id: number): Observable<WorkInProgress> {
    return this.http.get<WorkInProgress>(`${this.apiUrl}/${id}`);
  }

  create(data: WorkInProgress): Observable<WorkInProgress> {
    return this.http.post<WorkInProgress>(this.apiUrl, data);
  }

  update(id: number, data: WorkInProgress): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
