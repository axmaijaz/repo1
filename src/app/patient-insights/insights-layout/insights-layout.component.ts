import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { InsightsSettingDto } from 'src/app/model/Insights/insight.model';
import { ToastService } from 'ng-uikit-pro-standard';
import { InsightsService } from 'src/app/core/insights.service';
import { AppUiService } from 'src/app/core/app-ui.service';

@Component({
  selector: 'app-insights-layout',
  templateUrl: './insights-layout.component.html',
  styleUrls: ['./insights-layout.component.scss']
})
export class InsightsLayoutComponent implements OnInit {
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

  constructor(private route: ActivatedRoute, private securityService: SecurityService, private router: Router,
     private toaster: ToastService, private insights: InsightsService, private appUiService: AppUiService) { }

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
    this.GetQuickViewConfigByFacilityId();
    const pathname = location.pathname;
    pathname.split('/').forEach(x => {
      const pId = +x;
      if (pId) {
        this.PatientId = pId;
      }
    });
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
}
