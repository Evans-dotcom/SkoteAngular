import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authenticationService.CurrentUser();
    
    if (currentUser && currentUser.token) {
      const requiredRoles = route.data['roles'] as Array<string>;
      
      if (requiredRoles && requiredRoles.length > 0) {
        if (this.authenticationService.hasRole(requiredRoles)) {
          return true;
        } else {
          this.router.navigate(['/access-denied']);
          return false;
        }
      }
      
      return true;
    }
    
    this.router.navigate(['/account/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}