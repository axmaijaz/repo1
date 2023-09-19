import { Component, OnInit, OnDestroy } from '@angular/core';

import {
  HttpRequest,
  HttpHeaders,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { BluButtonService } from 'src/app/core/BlueButton/blu-button.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: 'app-blue-button',
  templateUrl: './blue-button.component.html',
  styleUrls: ['./blue-button.component.scss']
})
export class BlueButtonComponent implements OnInit, OnDestroy {
  PatientId = 0;
  blueButtonUrl = '';
  code: string;
  private subs = new SubSink();
  constructor(private route: ActivatedRoute, private router: Router, private bluButtonService: BluButtonService,
    private securityService: SecurityService,
    private toaster: ToastService) {}

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    if (!this.PatientId) {
      this.PatientId = this.route.snapshot.queryParams['patientID'];
    }
    this.code = this.route.snapshot.queryParams['code'];
    if (this.code) {
      // this.router.navigateByUrl('admin/bluebutton');
    }
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.PatientId = this.securityService.securityObject.id;
    }
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  getBlueButtonData(code: string) {
    // this.subs.sink = this.bluButtonService.getBlueButtonPatientData(code , this.PatientId).subscribe((res: any) => {
    //   const patientData = res;
    // }, (error: HttpResError) => {
    //   this.toaster.error(error.error , error.message);
    // });
  }
  getBluButtonCode() {
    this.blueButtonUrl = environment.blueButtonAuthCodeUrl;
    this.blueButtonUrl = this.blueButtonUrl.replace('{test1}', this.PatientId.toString());
    const openedWindow = window.open(this.blueButtonUrl, '_blank');
  }
}
