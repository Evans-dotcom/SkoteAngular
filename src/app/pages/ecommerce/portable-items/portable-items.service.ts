import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PortableItem {
  id?: number;
  itemName: string;
  tagNumber: string;
  assignedTo: string;
  department: string;
  departmentUnit: string;
  location: string;
  dateIssued: Date;
  condition: string;
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})
export class PortableItemService {
  private apiUrl = 'http://localhost:5245/api/PortableItem';

  constructor(private http: HttpClient) {}

  getAll(): Observable<PortableItem[]> {
    return this.http.get<PortableItem[]>(this.apiUrl);
  }

  getById(id: number): Observable<PortableItem> {
    return this.http.get<PortableItem>(`${this.apiUrl}/${id}`);
  }

  create(record: PortableItem): Observable<PortableItem> {
    return this.http.post<PortableItem>(this.apiUrl, record);
  }

  update(id: number, record: PortableItem): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, record);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
