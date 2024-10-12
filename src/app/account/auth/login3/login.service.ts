import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  //private apiUrl = 'https://localhost:44303/api/Auth'; // Adjust the URL as needed
  private apiUrl = 'https://micropointlive.com/t-TestOneApi/api/Auth';
  


  constructor(private http: HttpClient) {}

  login(Username: string, Password: string): Observable<any> {
  //  return this.http.post<any>(this.apiUrl + '/login', { Username, Password });
    return this.http.post(`${this.apiUrl}/login`, { Username, Password });
  }
}
