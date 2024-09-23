import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2'; // For displaying success/error messages
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  error = '';
  returnUrl: string;
  
  // Set the current year
  year: number = new Date().getFullYear();

  // Define the API endpoint
  private apiUrl = 'https://localhost/44303/api/users/login'; // Replace with your actual login API endpoint

  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private http: HttpClient // Use HttpClient to make the API call
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    this.submitted = true;

    // Stop if the form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      email: this.f.email.value,
      password: this.f.password.value
    };

    // Use HttpClient to make the login API request
    this.login(loginData).pipe(first()).subscribe(
      data => {
        // Navigate to the return URL on successful login
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigate([this.returnUrl]);
      },
      error => {
        // Handle login errors
        this.error = error;
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: this.error || 'An error occurred during login',
        });
      }
    );
  }

  /**
   * Method to make HTTP POST request to the login API
   */
  private login(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Error handling method
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
