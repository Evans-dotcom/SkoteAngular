import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginRequest, AuthResponse } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  [x: string]: any;
  private apiUrl = 'http://localhost:5245/api/Users';
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser$: Observable<User>;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  private getUserFromStorage(): User {
    const authUser = sessionStorage.getItem('authUser');
    return authUser ? JSON.parse(authUser) : null;
  }

  login(email: string, password: string): Observable<User> {
    const loginData: LoginRequest = { email, password };

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        map(response => {
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            token: response.token,
            role: response.role
          };

          this.SetUser(user, JSON.stringify(response));
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(this.handleError)
      );
  }

  CurrentUser(): User {
    return this.getUserFromStorage();
  }

  SetUser(user: User, userData: string): void {
    sessionStorage.setItem('authUser', JSON.stringify(user));
    sessionStorage.setItem('userData', userData);
    this.currentUserSubject.next(user);
  }

  getUserRole(): string {
    const user = this.CurrentUser();
    return user?.role || '';
  }

  isAdmin(): boolean {
    return this.getUserRole().toLowerCase() === 'admin';
  }

  isUser(): boolean {
    return this.getUserRole().toLowerCase() === 'user';
  }

  isManager(): boolean {
    return this.getUserRole().toLowerCase() === 'manager';
  }

  hasRole(roles: string[]): boolean {
    const userRole = this.getUserRole().toLowerCase();
    return roles.map(r => r.toLowerCase()).includes(userRole);
  }

  isAuthenticated(): boolean {
    const user = this.CurrentUser();
    return user !== null && user.token !== null;
  }

  logout(): void {
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('userData');
    sessionStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/account/login']);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.error && typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.error && error.error.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else {
      errorMessage = `Server Error: ${error.status}`;
    }

    return throwError(() => ({ message: errorMessage, status: error.status }));
  }
}