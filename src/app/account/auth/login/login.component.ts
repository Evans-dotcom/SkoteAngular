import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2'; // For displaying success/error messages
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/auth.models';

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
  loginError: string;
  successmsg = false;
  showPassword: boolean = false;
  returnUrl: string;
  showpassword: boolean = false;
  isDisconnected: boolean = false;
  public loading: boolean = false;
  
  // Set the current year
  year: number = new Date().getFullYear();

  // Define the API endpoint
 // private apiUrl = 'https://localhost/44303/api/users/login'; // Replace with your actual login
 private apiUrl = 'https://micropointlive.com/t-TestOneApi/api/Auth/login';
 
  constructor(
    private formBuilder: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, private authenticationService:AuthenticationService,
    private http: HttpClient // Use HttpClient to make the API call
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      Password: ['', Validators.required]
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
    this.loading = true;
  
    // Stop if the form is invalid
    if (this.loginForm.invalid) {
      debugger;
      this.loading = false;
      return;
    }
  
    const loginData = {
      Username: this.f.UserName.value,
      password: this.f.Password.value
    };
  
    // Use HttpClient to make the login API request
    this.login(loginData).pipe(first()).subscribe(
      (response: any) => {
        this.loading = false;
        console.log(response); // Log the response for inspection
  
        // Map the response data to a User object
        const user: User = {
          id: 0,  // Since the response does not provide an id, you can set a default value or handle it differently
          token: response.token ,  // Use the token from the response
          username: this.f.UserName.value,  // Get the username from the form control
          // Include other properties as needed from the response or form
        };
        
  
        // Convert the response data to a JSON string
        const userData = JSON.stringify(response);
  
        if (user.token) {
          this.successmsg = true;
          // Store the user object in session storage
          this.authenticationService.SetUser(user, userData);
          // Navigate to the dashboard or any other route as needed
          this.router.navigate(['/dashboard']);
        } else {
          // Handle case where login was not successful
          console.error('Login failed:', response.ErrorDescription);
          this.error = response.ErrorDescription;
        }
      },
      (error) => {
        this.isDisconnected = true;
        this.loading = false;
        this.error = error ? error : 'An error occurred during login.';
        if (error.status === 404) {
          window.alert('Invalid username or password');
        }
        console.log(error); // Log the error for debugging purposes
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
  revShowpassword(){
    if(this.showpassword == true)
    this.showpassword = false
    else
    this.showpassword = true;
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
