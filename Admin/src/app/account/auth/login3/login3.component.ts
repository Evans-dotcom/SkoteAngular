import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login3.component.html',
  styleUrls: ['./login3.component.scss']
})
export class Login3Component implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Revert form to use Username instead of Email
    this.loginForm = this.fb.group({
      Username: ['', Validators.required],
      Password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { Username, Password } = this.loginForm.value; // Use Username and Password
      this.loginService.login(Username, Password).subscribe(
        response => {
          console.log('Login successful', response);
          // Navigate to dashboard after successful login
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('Login failed', error);
          this.errorMessage = 'Invalid username or password'; // Show appropriate error message
        }
      );
    } else {
      Object.values(this.loginForm.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }
}
