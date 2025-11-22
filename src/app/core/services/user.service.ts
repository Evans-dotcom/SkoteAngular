import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private apiUrl = 'http://localhost:5245/api/Users';

  constructor(private http: HttpClient) {}

  register(userData: any): Observable<any> {
    const payload = {
      username: userData.username,
      email: userData.email,
      passwordHash: userData.passwordHash,
      role: userData.role,
      id: 0
    };

    return this.http.post(`${this.apiUrl}/register`, payload).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Full error response:', error);
        let errorMessage = 'An unknown error occurred.';

        if (error.error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to server. Please check if the API is running.';
        } else if (error.status === 400) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error?.errors) {
            const errors = error.error.errors;
            const errorMessages = Object.keys(errors).map(key => errors[key].join(', '));
            errorMessage = errorMessages.join('. ');
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.error?.title) {
            errorMessage = error.error.title;
          } else {
            errorMessage = 'Invalid data provided. Please check all fields.';
          }
        } else if (error.status === 409) {
          errorMessage = 'Email already exists. Please use a different email.';
        } else if (error.status === 500) {
          if (typeof error.error === 'string') {
            errorMessage = error.error;
          } else {
            errorMessage = 'Server error occurred. Please try again later.';
          }
        } else {
          errorMessage = error.message || `Server Error: ${error.status}`;
        }

        return throwError(errorMessage);
      })
    );
  }
}