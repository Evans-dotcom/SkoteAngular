import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverService } from './driver.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class AddDriverComponent implements OnInit {
  driverForm: FormGroup;
  drivers: any[] = [];
  selectedDriverId: string | null = null;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  securityQuestions: string[] = [
    'What is your mother\'s maiden name?',
    'What is the name of your first pet?',
    'What was the name of your elementary school?',
    'What is your favorite book?',
    'What is the name of the town where you were born?',
    'What was your childhood nickname?'
  ];

  constructor(
    private fb: FormBuilder,
    private driverService: DriverService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getDrivers();
    this.getCurrentLocation();
  }

  initForm(): void {
    this.driverForm = this.fb.group({
      driverName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^(07|01)\\d{8}$')]],
      email: ['', [Validators.required, Validators.email]],
      idNo: ['', Validators.required],
      dob: ['', Validators.required],
      carModel: ['', Validators.required],
      licenseNumber: ['', Validators.required],
      carPlateNumber: ['', Validators.required],
      carColour: ['', Validators.required],
      carSeats: ['', [Validators.required, Validators.min(1)]],
      currentLongitude: [0],
      currentLatitude: [0],
      userPassword: ['', [Validators.required, Validators.minLength(8)]],
      securityQuestionOne: ['', Validators.required],
      answerOne: ['', Validators.required],
      securityQuestionTwo: ['', Validators.required],
      answerTwo: ['', Validators.required],
      createdBy: ['']
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.driverForm.valid) {
      const driverData = this.driverForm.value;
      const operation = this.selectedDriverId
        ? this.driverService.updateDriver(this.selectedDriverId, driverData)
        : this.driverService.addDriver(driverData);

      operation.pipe(
        catchError(error => {
          console.error('Error in driver operation', error);
          
          let errorMessage = 'An unknown error occurred';
          if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          
          this.errorMessage = errorMessage;
          return of(null);
        })
      ).subscribe(
        response => {
          if (response) {
            console.log('Driver operation successful', response);
            this.successMessage = this.selectedDriverId
              ? 'Driver updated successfully'
              : 'Driver added successfully';
            this.resetForm();
            this.getDrivers();
          }
          this.isLoading = false;
        }
      );
    } else {
      this.isLoading = false;
      this.errorMessage = 'Please fill out all required fields correctly.';
      this.markFormAsTouched();
    }
  }

  getDrivers(): void {
    this.isLoading = true;
    this.driverService.getDrivers().pipe(
      catchError(error => {
        console.error('Error retrieving drivers', error);
        this.errorMessage = `Failed to retrieve drivers: ${error.message || 'Unknown error'}`;
        return of([]);
      })
    ).subscribe(
      data => {
        this.drivers = data;
        this.isLoading = false;
      }
    );
  }

  editDriver(driver: any): void {
    this.selectedDriverId = driver.id;
    this.driverForm.patchValue(driver);
  }

  deleteDriver(driverId: string): void {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.isLoading = true;
      this.driverService.deleteDriver(driverId).pipe(
        catchError(error => {
          console.error('Error deleting driver', error);
          this.errorMessage = `Failed to delete driver: ${error.message || 'Unknown error'}`;
          return of(null);
        })
      ).subscribe(
        response => {
          if (response !== null) {
            console.log('Driver deleted successfully', response);
            this.successMessage = 'Driver deleted successfully';
            this.getDrivers();
          }
          this.isLoading = false;
        }
      );
    }
  }

  resetForm(): void {
    this.driverForm.reset({
      currentLongitude: 0,
      currentLatitude: 0,
      createdBy: ''
    });
    this.selectedDriverId = null;
    Object.keys(this.driverForm.controls).forEach(key => {
      this.driverForm.get(key)?.setErrors(null);
    });
    this.getCurrentLocation();
  }

  markFormAsTouched(): void {
    Object.keys(this.driverForm.controls).forEach(key => {
      const control = this.driverForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.driverForm.get(fieldName);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.driverForm.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) {
        return `${fieldName} is required`;
      }
      if (control.errors['email']) {
        return 'Invalid email format';
      }
      if (control.errors['pattern']) {
        return 'Invalid format';
      }
      if (control.errors['min']) {
        return `${fieldName} must be at least ${control.errors['min'].min}`;
      }
      if (control.errors['minlength']) {
        return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters long`;
      }
    }
    return '';
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.driverForm.patchValue({
          currentLongitude: position.coords.longitude,
          currentLatitude: position.coords.latitude
        });
      }, (error) => {
        console.error('Error getting geolocation', error);
        this.errorMessage = 'Unable to retrieve location. Please enable location services.';
      });
    } else {
      this.errorMessage = 'Geolocation is not supported by this browser.';
    }
  }
}