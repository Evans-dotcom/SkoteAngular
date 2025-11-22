import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  error = '';
  showpassword: boolean = false;
  loading: boolean = false;
  year: number = new Date().getFullYear();
  returnUrl: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      Email: ['', [Validators.required, Validators.email]],
      Password: ['', Validators.required]
    });

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Form',
        text: 'Please fill in all required fields correctly.'
      });
      return;
    }

    this.loading = true;
    this.error = '';

    this.authenticationService.login(this.f.Email.value, this.f.Password.value)
      .pipe(first())
      .subscribe({
        next: (user) => {
          this.loading = false;
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: `Welcome back, ${user.username || user.email}!`,
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            this.router.navigate([this.returnUrl]);
          });
        },
        error: (error) => {
          this.loading = false;
          this.error = error.message || 'Login failed. Please check your credentials.';
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: this.error
          });
        }
      });
  }

  revShowpassword() {
    this.showpassword = !this.showpassword;
  }
}