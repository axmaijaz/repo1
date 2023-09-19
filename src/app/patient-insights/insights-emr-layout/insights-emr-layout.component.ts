import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { InsightsSettingDto } from 'src/app/model/Insights/insight.model';
import { ToastService } from 'ng-uikit-pro-standard';
import { InsightsService } from 'src/app/core/insights.service';
import { AppUiService } from 'src/app/core/app-ui.service';
import { EmrConnectService } from 'src/app/core/emr-connect.service';
import { PatientEmrConnectInfoDto } from 'src/app/model/EmrConnect/emr-connect.model';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { PatientDto } from './../../model/Patient/patient.model';
import moment from 'moment';
import { BrandingService } from './../../core/branding.service';
import { FacilityService } from './../../core/facility/facility.service';
import { FacilityDto } from 'src/app/model/Facility/facility.model';
import { UserType } from 'src/app/Enums/UserType.enum';

@Component({
  selector: 'app-insights-emr-layout',
  templateUrl: './insights-emr-layout.component.html',
  styleUrls: ['./insights-emr-layout.component.scss']
})
export class InsightsEmrLayoutComponent implements OnInit {
  PatientId: number;
  facilityId: number;
  isLoading: boolean;
  addEditInsightsData = new InsightsSettingDto();
  adminInsightsData = new InsightsSettingDto();
  hasSomethingTOShow = true;
  displaySec
  lookUpRoutes = {
    isSummaryView: `/insights/summary/`,
    isDiagnosisView: `/insights/diagnoses/`,
    isMedicationsView: `/insights/medications/`,
    isAllergiesView: `/insights/allergies/`,
    isCCMLogsView: `/insights/ccmLogs/logsHistory/`,
    isRPMLogsView: `/insights/rpmLogs/logsHistory/`,
    isRPMDeviceView: `/insights/rpm/`,
  };
  syncingPatient: boolean;
  gettingConnectInfo: boolean;
  emrConnectInfo: PatientEmrConnectInfoDto;
  PatientData = new PatientDto();
  PatientAge: number;
  facility: FacilityDto;

  constructor(private route: ActivatedRoute, public brandingService: BrandingService, private facilityService: FacilityService,
     private securityService: SecurityService, private router: Router, private emrConnect: EmrConnectService,
     private toaster: ToastService, private insights: InsightsService, private appUiService: AppUiService, private patientService: PatientsService) { }

  ngOnInit(): void {
    // const PatientId3 = +this.route.pathFromRoot[3]?.snapshot.paramMap.get('id');
    // const PatientId2 = +this.route.pathFromRoot[2]?.snapshot.paramMap.get('id');
    // const PatientId1 = +this.route.pathFromRoot[1]?.snapshot.paramMap.get('id');
    // const PatientId0 = +this.route.pathFromRoot[0]?.snapshot.paramMap.get('id');
    // const PatientIdd = +this.route.snapshot.paramMap.get('id');
    // const sds1 = location.pathname;
    // this.route.queryParams.subscribe(params => {
    //   const sds = location.href;
    //   let date = params['id'];
    //   if (date) {
    //   }
    // });
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    // this.GetQuickViewConfigByFacilityId();
    const pathname = location.pathname;
    pathname.split('/').forEach(x => {
      const pId = +x;
      if (pId) {
        this.PatientId = pId;
      }
    });
    this.GetPatientEmrConnectInfo();
    this.getPatientById();
    this.getFacilityDetails();
  }
  getFacilityDetails() {
    this.facilityService.getFacilityDetail(this.facilityId).subscribe(
      (res: FacilityDto) => {
        this.facility = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error, err.message);
      }
    );
  }
  GetQuickViewConfigByFacilityId() {
    this.isLoading = true;
    this.addEditInsightsData.facilityId = this.facilityId;
    this.insights.GetQuickViewConfigByFacilityId(this.facilityId).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.addEditInsightsData = res.facilityConfig || new InsightsSettingDto();
        this.adminInsightsData = res.adminConfig || new InsightsSettingDto();
        this.ApplyRestrictions()
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  ApplyRestrictions() {
    if (this.addEditInsightsData.isSummaryView && this.adminInsightsData.isSummaryView) {
      return;
    }

    this.hasSomethingTOShow = false;
    Object.keys(this.adminInsightsData).forEach((value, index) => {
      if (this.adminInsightsData[value] == true && this.addEditInsightsData[value] == true) {
        if (!this.hasSomethingTOShow) {
          const url = this.lookUpRoutes[value] + this.PatientId.toString();
          if (url.includes('ccmLogs')) {
            this.router.navigateByUrl(url + `?isIframe=true&viewType=CCM`);
          } else if (url.includes('rpmLogs')) {
            this.router.navigateByUrl(url + `?isIframe=true&viewType=RPM`);
          } else {
            this.router.navigateByUrl(url);
          }
        }
        this.hasSomethingTOShow = true;
      }
    })
    // if (this.addEditInsightsData.isSummaryView && this.adminInsightsData.isSummaryView) {

    // } else if (this.addEditInsightsData.isDiagnosisView && this.adminInsightsData.isDiagnosisView) {

    // } else if (this.addEditInsightsData.isMedicationsView && this.adminInsightsData.isMedicationsView) {

    // } else if (this.addEditInsightsData.isAllergiesView && this.adminInsightsData.isAllergiesView) {

    // } else if (this.addEditInsightsData.isCCMLogsView && this.adminInsightsData.isCCMLogsView) {

    // } else if (this.addEditInsightsData.isRPMDeviceView && this.adminInsightsData.isRPMDeviceView) {

    // } else if (this.addEditInsightsData.isRPMLogsView && this.adminInsightsData.isRPMLogsView) {

    // }
  }
  hideModalitiesDetail(){
    this.appUiService.hideModalitiesDetails.next()
  }
  SyncPatient() {
    this.syncingPatient = true;
    this.emrConnect.SyncPatient(this.PatientId)
      .subscribe(
        (res: any) => {
          this.syncingPatient = false;
          this.toaster.success(`Data synced successfully`);
          this.GetPatientEmrConnectInfo();
        },
        (err: HttpResError) => {
          this.toaster.error( err.error, err.message);
          this.syncingPatient = false;
        }
      );
  }
  GetPatientEmrConnectInfo() {
    this.gettingConnectInfo = true;
    this.emrConnect.GetPatientEmrConnectInfo(this.PatientId)
      .subscribe(
        (res: PatientEmrConnectInfoDto) => {
          this.gettingConnectInfo = false;
          this.emrConnectInfo = res;
          // this.toaster.success(`Status changed successfully`);
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.gettingConnectInfo = false;
        }
      );
  }
  public calculateAge(birthdate: any): number {
    return moment().diff(birthdate, 'years');
  }
  getPatientById(){
    this.patientService.getPatientDetail(this.PatientId).subscribe((res: PatientDto)=>{
      this.PatientData =  res;
      this.PatientAge = this.calculateAge(
        this.PatientData.dateOfBirth
      );
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
  OpenAppurl(type: string) {
    if (type == 'QuickNote') {
      type = type + 'VV' + this.PatientData.id;
    }
    if (type == 'ChatWindow') {
      type = type + 'VV' + this.PatientData.userId;
    }
    if (type == 'ComplaintModal') {
      type = type + 'VV' + this.PatientData.id;
    }
    const appUrl = this.router.serializeUrl(
      this.router.createUrlTree([`/admin/patient/${this.PatientData.id}/summary`], { queryParams: {PageLoadActions:type}})
    );

    window.open(appUrl, '_blank');
  }
  navigateHome() {
    if (this.securityService.securityObject.isAuthenticated) {
      if (this.securityService.securityObject.userType === UserType.AppAdmin) {
        this.router.navigateByUrl("/dashboard");
      } else if (
        this.securityService.securityObject.userType === UserType.Patient
      ) {
        this.router.navigateByUrl("/patient/profile");
      } else if (
        this.securityService.securityObject.userType === UserType.FacilityUser
      ) {
        this.router.navigateByUrl("/home");
      }
    } else {
      this.router.navigateByUrl("/login");
    }
  }
}
