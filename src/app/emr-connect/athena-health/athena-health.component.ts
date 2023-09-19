import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { LoginWithAthenaAssertionDto } from 'src/app/model/EmrConnect/emr-connect.model';
import { EmrConnectService } from './../../core/emr-connect.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { SecurityService } from 'src/app/core/security/security.service';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { BrandingService } from 'src/app/core/branding.service';
import { AppDataService } from 'src/app/core/app-data.service';
import { LaunchModeEnum } from 'src/app/model/AppData.model';

@Component({
  selector: 'app-athena-health',
  templateUrl: './athena-health.component.html',
  styleUrls: ['./athena-health.component.scss']
})
export class AthenaHealthComponent implements OnInit {
  routeData  = {
    nameId : '',
    email: '',
    practiceId: '',
    patientId: '',
    deptId: '',
    firstName: '',
    lastName: '',
    token: ''
  }
  loadingAssertion: boolean;
  alertReason = '';

  loginAssertionObj = new LoginWithAthenaAssertionDto();
  loadingPatient: boolean;
  noPatient: boolean;
  constructor(private route: ActivatedRoute, private toaster: ToastService,
    private securityService: SecurityService,
    public brandingService: BrandingService,
    private appDataService: AppDataService,
    private router: Router,
    private emrConnect: EmrConnectService) { }

  ngOnInit(): void {
    this.routeData.nameId = this.route.snapshot.queryParams['nameId'];
    this.routeData.email = this.route.snapshot.queryParams['email'];
    this.routeData.practiceId = this.route.snapshot.queryParams['practiceId'];
    this.routeData.patientId = this.route.snapshot.queryParams['patientId'];
    this.routeData.deptId = this.route.snapshot.queryParams['deptId'];
    this.routeData.firstName = this.route.snapshot.queryParams['firstName'];
    this.routeData.lastName = this.route.snapshot.queryParams['lastName'];
    this.routeData.token = this.route.snapshot.queryParams['token'];

    this.loginAssertionObj.userName = this.routeData.nameId;
    this.loginAssertionObj.email = this.routeData.email;
    this.loginAssertionObj.practiceId = this.routeData.practiceId;
    this.loginAssertionObj.patientEmrId = this.routeData.patientId;
    this.loginAssertionObj.firstName = this.routeData.firstName;
    this.loginAssertionObj.lastName = this.routeData.lastName;
    this.loginAssertionObj.token = this.routeData.token;
    // var result = this.getCookies();
    this.LoginWithAthenaAssertion();
    if (this.loginAssertionObj.patientEmrId) {
      this.appDataService.extensionPatient = new PatientDto();
      this.appDataService.extensionPatient.patientEmrId = this.loginAssertionObj.patientEmrId;
    }
  }

  getCookies = () => {
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i=0; i<pairs.length; i++){
      var pair = pairs[i].split("=");
      cookies[(pair[0]+'').trim()] = unescape(pair.slice(1).join('='));
    }
    return cookies;
  }

  LoginWithAthenaAssertion() {
    this.loadingAssertion = true;
    this.emrConnect.LoginWithAthenaAssertion(this.loginAssertionObj)
      .subscribe(
        (res: {patientId: number, appUserAuth: AppUserAuth}) => {
          console.log(res)
          console.log(this.loginAssertionObj)
          // this.facilityId = res.appUserAuth.
          if (res.appUserAuth) {
            this.securityService.updateToken(res.appUserAuth)
          }
          if (res.patientId) {
            this.router.navigateByUrl(`/insights/embedded/summary/${res.patientId}`)
          } else if (this.loginAssertionObj.patientEmrId) {
            this.alertReason = 'Patient is not registered in 2C Health';
          } else {
            // this.alertReason = 'Please re-launch 2C App afetr selecting patient';
            // this.alertReason = 'Please enter Emr id to load patient';
            this.appDataService.launchMode = LaunchModeEnum.GlobalContext;
            this.router.navigateByUrl("/dashboard")
          }

          this.loadingAssertion = false;
        },
        (err: HttpResError) => {
          if (err.error || err.message) {
            this.alertReason = err.error || err.message;
          }
          // this.toaster.error( err.error, err.message);
          this.loadingAssertion = false;
        }
      );
  }
  SearchPatient = () => {
    const facilityId = +this.securityService.getClaim('FacilityId')?.claimValue;
    this.loadingPatient = true;
    this.alertReason = `Searching patient`
    this.emrConnect.SearchPatient(this.loginAssertionObj.patientEmrId , facilityId)
      .subscribe(
        (res: PatientDto) => {
          this.loadingPatient = false;
          if (!res?.id) {
            // this.toaster.info(`Loading ${res.firstName}`)
            this.alertReason = `Fetching Patient (${res.fullName})`
            this.RegisterPatient();
          } else {
            this.router.navigateByUrl(`/insights/embedded/summary/${res.id}`)
          }
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.loadingPatient = false;
        }
      );
  }
  RegisterPatient = () => {
    const facilityId = +this.securityService.getClaim('FacilityId')?.claimValue;
    this.loadingPatient = true;
    this.emrConnect.RegisterPatient(this.loginAssertionObj.patientEmrId , facilityId)
      .subscribe(
        (res: PatientDto) => {
          this.loadingPatient = false;
          this.router.navigateByUrl(`/insights/embedded/summary/${res.id}`)
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.loadingPatient = false;
        }
      );
  }
}
