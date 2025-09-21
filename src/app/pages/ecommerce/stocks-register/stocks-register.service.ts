import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface StocksRegister {
  id?: number;
  itemName: string;
  unit: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
  location: string;
  //lastRestocked: Date;
  remarks: string;
  department: string;
  departmentUnit: string;
}

@Injectable({
  providedIn: 'root'
})
export class StocksRegisterService {
  private apiUrl = 'http://localhost:5245/api/StocksRegister';

  constructor(private http: HttpClient) {}

  getAll(): Observable<StocksRegister[]> {
    return this.http.get<StocksRegister[]>(this.apiUrl);
  }

  getById(id: number): Observable<StocksRegister> {
    return this.http.get<StocksRegister>(`${this.apiUrl}/${id}`);
  }

  create(item: StocksRegister): Observable<StocksRegister> {
    return this.http.post<StocksRegister>(this.apiUrl, item);
  }

  update(id: number, item: StocksRegister): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
