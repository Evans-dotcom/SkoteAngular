import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  //private apiUrl = 'https://localhost:44303/api'; // Replace with your actual API URL
  private apiUrl = 'https://micropointlive.com/t-TestOneApi/api';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server-side error: ${error.status} ${error.statusText}`;
      if (error.error) {
        errorMessage += `, Details: ${JSON.stringify(error.error)}`;
      }
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  // Commenting out unused methods
  addDriver(driverData: any): Observable<any> {
    // return this.http.post(`${this.apiUrl}/Driver`, driverData).pipe(...);
    return; // Placeholder for addDriver method
  }

  updateDriver(driverId: string, driverData: any): Observable<any> {
    // return this.http.put(`${this.apiUrl}/Driver/${driverId}`, driverData).pipe(...);
    return; // Placeholder for updateDriver method
  }

  deleteDriver(driverId: string): Observable<any> {
    // return this.http.delete(`${this.apiUrl}/Driver/${driverId}`).pipe(...);
    return; // Placeholder for deleteDriver method
  }

  getDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Driver`).pipe(
      tap(response => console.log('Get drivers response:', response)),
      catchError(this.handleError)
    );
  }

  // Uncomment if you need to fetch driver by ID
  // getDriverById(driverId: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/Driver/${driverId}`).pipe(...);
  // }
}
