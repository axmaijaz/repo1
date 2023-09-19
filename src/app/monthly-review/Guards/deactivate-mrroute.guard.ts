import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MonthlyReviewComponent } from '../monthly-review/monthly-review.component';

@Injectable({
  providedIn: 'root'
})
export class DeactivateMRRouteGuard implements CanDeactivate<MonthlyReviewComponent> {
  canDeactivate(
    component: MonthlyReviewComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (component.timerStart || component.encounterTimeForm.get('endTime').value) {
        return window.confirm('Changes you made may not be saved, Do you want to exit ?');
      } else {
        return true;
      }
  }
}
