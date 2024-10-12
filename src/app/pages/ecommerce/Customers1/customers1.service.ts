import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  //private apiUrl = 'https://localhost:44303/api/Customer';
  private apiUrl = 'https://micropointlive.com/t-TestOneApi/api/Customer';

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


  getCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getallcustomers`).pipe(
      tap(response => console.log('Get customers response:', response)),
      catchError(this.handleError)
    );
  }


}
