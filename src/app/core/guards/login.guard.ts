import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private securityService: SecurityService, private router: Router) {
  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.securityService.securityObject.isAuthenticated) {
      if (this.securityService.securityObject.userType === UserType.AppAdmin) {
          this.router.navigateByUrl('/dashboard');
      } else if (this.securityService.securityObject.userType === UserType.Patient) {
          this.router.navigateByUrl('/patient/profile');
      } else if (this.securityService.securityObject.userType === UserType.FacilityUser) {
          this.router.navigateByUrl('/home');
      }
      return false;
    } else {
      return true;
    }
  }
}

