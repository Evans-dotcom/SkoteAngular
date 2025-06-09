import { Component, OnInit } from '@angular/core';
import { UserService } from './register.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register3',
  templateUrl: './register3.component.html',
  styleUrls: ['./register3.component.scss']
})
export class Register3Component implements OnInit {
  user: any = {
    Username: '',
    Email: '',
    Password: '',
    ConfirmPassword: '',
    Role: ''
  };

  // Add the year property
  year: number;

  constructor(
    private userService: UserService,
    private router: Router
  ) { 
    // Set the current year
    this.year = new Date().getFullYear();
  }

  ngOnInit(): void {
  }

  onSubmit() {
    if (this.validateForm()) {
      Swal.fire({
        title: 'Registering...',
        text: 'Please wait',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      this.userService.registerUser(this.user)
        .subscribe(
          response => {
            Swal.close();
            Swal.fire({
              title: 'Success!',
              text: 'Registration successful',
              icon: 'success',
              showConfirmButton: false,
              timer: 3000
            }).then(() => {
              this.router.navigate(['/account/login3']);
            });
          },
          error => {
            Swal.close();
            Swal.fire({
              title: 'Error!',
              text: 'Registration failed',
              icon: 'error',
              showConfirmButton: false,
              timer: 3000
            });
          }
        );
    }
  }

  validateForm(): boolean {
    if (!this.user.Username || !this.user.Email || !this.user.Password || !this.user.ConfirmPassword) {
      this.showErrorMessage('All fields are required');
      return false;
    }

    if (!this.validateEmail(this.user.Email)) {
      this.showErrorMessage('Please enter a valid email address');
      return false;
    }

    if (this.user.Password !== this.user.ConfirmPassword) {
      this.showErrorMessage('Passwords do not match');
      return false;
    }

    if (this.user.Password.length < 6) {
      this.showErrorMessage('Password must be at least 6 characters long');
      return false;
    }

    return true;
  }

  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }

  showErrorMessage(message: string) {
    Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      showConfirmButton: false,
      timer: 3000
    });
  }

  goToLogin() {
    this.router.navigate(['/account/login3']);
  }
}
