import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  template: `
    <div class="account-pages my-5 pt-sm-5">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card overflow-hidden">
              <div class="card-body text-center p-5">
                <div class="mb-4">
                  <i class="mdi mdi-lock-outline text-danger" style="font-size: 72px;"></i>
                </div>
                <h4 class="text-uppercase mt-3">Access Denied</h4>
                <p class="text-muted">You don't have permission to access this page.</p>
                <button class="btn btn-primary mt-3" (click)="goBack()">
                  <i class="mdi mdi-arrow-left"></i> Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}