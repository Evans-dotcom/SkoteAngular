import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  //private apiUrl = 'https://localhost:44303/api/Auth'; // Replace with your actual API URL
  private apiUrl = 'https://micropointlive.com/t-TestOneApi/api/Auth';

  constructor(private http: HttpClient) { }

  registerUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
}