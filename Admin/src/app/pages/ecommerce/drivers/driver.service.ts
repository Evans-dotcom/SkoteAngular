import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = 'https://localhost:44303/api'; // Replace with your actual API URL

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

  addDriver(driverData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Driver`, driverData).pipe(
      tap(response => console.log('Add driver response:', response)),
      catchError(this.handleError)
    );
  }

  updateDriver(driverId: string, driverData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/Driver/${driverId}`, driverData).pipe(
      tap(response => console.log('Update driver response:', response)),
      catchError(this.handleError)
    );
  }

  deleteDriver(driverId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Driver/${driverId}`).pipe(
      tap(response => console.log('Delete driver response:', response)),
      catchError(this.handleError)
    );
  }

  getDrivers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/Driver`).pipe(
      tap(response => console.log('Get drivers response:', response)),
      catchError(this.handleError)
    );
  }

  getDriverById(driverId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Driver/${driverId}`).pipe(
      tap(response => console.log('Get driver by ID response:', response)),
      catchError(this.handleError)
    );
  }
}