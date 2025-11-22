import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { UserProfileService } from '../../../core/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitted = false;
  year: number = new Date().getFullYear();
  roles: string[] = ['Admin', 'Manager', 'User'];
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserProfileService
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  get f() {
    return this.signupForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.signupForm.invalid) {
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        if (control && control.invalid) {
          control.markAsTouched();
        }
      });

      Swal.fire({
        icon: 'warning',
        title: 'Form Incomplete',
        text: 'Please fill in all required fields correctly.'
      });
      return;
    }

    this.loading = true;

    const formData = this.signupForm.value;
    
    console.log('Sending registration data:', formData);

    this.userService.register(formData)
      .pipe(first())
      .subscribe({
        next: (response) => {
          this.loading = false;
          console.log('Registration successful:', response);
          Swal.fire({
            title: 'Registration Successful',
            text: 'Your account has been created. You can now log in.',
            icon: 'success',
            confirmButtonColor: '#34c38f'
          }).then(() => {
            this.signupForm.reset();
            this.submitted = false;
            this.router.navigate(['/account/login']);
          });
        },
        error: (errorMessage: string) => {
          this.loading = false;
          console.error('Registration error:', errorMessage);
          
          Swal.fire({
            title: 'Registration Failed',
            text: errorMessage || 'An unexpected error occurred during signup.',
            icon: 'error',
            confirmButtonColor: '#f46a6a'
          });
        }
      });
  }
}