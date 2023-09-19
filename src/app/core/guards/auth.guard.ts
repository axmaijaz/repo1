import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from '../security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { ToastService } from 'ng-uikit-pro-standard';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private securityService: SecurityService, private router: Router, private toaster: ToastService) {
  }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const claimType: string = next.data['claimType'];
    if (!this.securityService.securityObject.isAuthenticated) {
      this.router.navigate(['login'], {
        queryParams: { returnUrl: state.url, reason: `Invalid claim ${claimType} or Authentication Problem ${this.securityService.securityObject.isAuthenticated}` }
      });
      return false;
    }
    if (this.securityService.hasClaim(claimType)) {
      if (this.securityService.securityObject.userType === UserType.Patient && (state.url.includes('home'))) {
        this.router.navigateByUrl('/patient/profile');
      }
      if (this.securityService.securityObject.userType === UserType.AppAdmin && (state.url.includes('home'))) {
        this.router.navigateByUrl('/dashboard');
      }
      return true;
    } else {
      this.toaster.error( `This functionality is only accessible with following Permission(s) "${claimType?.toString()}"`,'Restricted Access')
      return false;
    }
  }
}
