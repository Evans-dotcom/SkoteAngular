import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface BankAccount {
  id?: number;
  bankName: string;
  accountNumber: string;
  accountType: string;
  openingBalance: number;
  currentBalance: number;
  remarks: string;
  department: string;
  departmentUnit: string;
  accountName: string;
  contractDate?: Date;
  officerInCharge: string;
  signatories: string;
  status?: string;
  requestedBy?: string;
  requestedAt?: Date;
  approvedBy?: string;
  approvalDate?: Date;
  approvalRemarks?: string;
}

export interface BankAccountCreateDto {
  bankName: string;
  accountNumber: string;
  accountType: string;
  openingBalance: number;
  remarks: string;
  department: string;
  departmentUnit: string;
  accountName: string;
  contractDate?: Date;
  officerInCharge: string;
  signatories: string;
}

export interface BankAccountApproveDto {
  approve: boolean;
  remarks: string;
}

@Injectable({ providedIn: 'root' })
export class BankAccountService {
  private apiUrl = 'http://localhost:5245/api/BankAccount';

  constructor(private http: HttpClient) {}

  getAll(includeUnapproved: boolean = false): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.apiUrl}?includeUnapproved=${includeUnapproved}`)
      .pipe(catchError(this.handleError));
  }

  getPending(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.apiUrl}/pending`)
      .pipe(catchError(this.handleError));
  }

  getApproved(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.apiUrl}`)
      .pipe(catchError(this.handleError));
  }

  getRejected(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(`${this.apiUrl}/rejected`)
      .pipe(catchError(this.handleError));
  }

  getById(id: number): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(dto: BankAccountCreateDto): Observable<BankAccount> {
    return this.http.post<BankAccount>(this.apiUrl, dto)
      .pipe(catchError(this.handleError));
  }

  approve(id: number, remarks: string): Observable<void> {
    const dto: BankAccountApproveDto = { approve: true, remarks };
    return this.http.post<void>(`${this.apiUrl}/${id}/approve`, dto)
      .pipe(catchError(this.handleError));
  }

  reject(id: number, remarks: string): Observable<void> {
    const dto: BankAccountApproveDto = { approve: false, remarks };
    return this.http.post<void>(`${this.apiUrl}/${id}/approve`, dto)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred.';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to server.';
    } else if (error.status === 400) {
      errorMessage = typeof error.error === 'string' ? error.error : 'Invalid data provided.';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized. Please login again.';
    } else if (error.status === 403) {
      errorMessage = 'Access denied. You do not have permission to perform this action.';
    } else if (error.status === 404) {
      errorMessage = 'Resource not found.';
    } else if (error.status === 500) {
      errorMessage = typeof error.error === 'string' ? error.error : 'Server error occurred.';
    } else {
      errorMessage = `Error ${error.status}: ${error.message}`;
    }
    
    return throwError(() => errorMessage);
  }
}