import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { Observable } from 'rxjs';
import { LaunchModeEnum } from 'src/app/model/AppData.model';
import { AppDataService } from '../app-data.service';
import { AppUiService } from '../app-ui.service';
import { DataFilterService } from '../data-filter.service';
import { PatientsService } from '../Patient/patients.service';

@Injectable({
  providedIn: 'root'
})
export class PatientSummaryGuard implements CanActivate {

  constructor(
    // private security: SecurityService,
    private appData: AppDataService,
    private toaster: ToastService,
    private filterDataService: DataFilterService,
    private appUi: AppUiService,
    private router: Router,
    private patientService: PatientsService,
    private route: ActivatedRoute
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isPatientLayout = next?.data["showPatientLayout"];
      if (this.appData.launchMode == LaunchModeEnum.GlobalContext && isPatientLayout) {
        // this.toaster.warning(`Single patient access is restricted in global context mode`)
        // return false;
       return true;
      } else {
       return true;
      }
  }

}
