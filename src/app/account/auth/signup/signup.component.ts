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

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserProfileService
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.signupForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Form Incomplete',
        text: 'Please fill in all required fields before proceeding.'
      });
      return;
    }

    this.userService.register(this.signupForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          Swal.fire({
            title: 'Registration Successful 🎉',
            text: 'Your account has been created. You can now log in.',
            icon: 'success',
            confirmButtonColor: '#34c38f'
          }).then(() => this.router.navigate(['/account/login']));
        },
        error: (err) => {
          console.error('Registration error:', err);
          Swal.fire({
            title: 'Registration Failed ❌',
            text: err?.message || 'An unexpected error occurred during signup.',
            icon: 'error',
            confirmButtonColor: '#f46a6a'
          });
        }
      });
  }
}
