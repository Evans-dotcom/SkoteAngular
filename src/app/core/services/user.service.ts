import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  private apiUrl = 'http://localhost:5245/api/Users/register';

  constructor(private http: HttpClient) { }

  // ✅ Register method for new users
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client Error: ${error.error.message}`;
    } else {
      errorMessage = `Server Error ${error.status}: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
