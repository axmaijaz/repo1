import { UserType } from './../../Enums/UserType.enum';
import { InsightsService } from './../../core/insights.service';
import { Component, OnInit } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { InsightsSettingDto } from 'src/app/model/Insights/insight.model';

@Component({
  selector: 'app-insights-setting',
  templateUrl: './insights-setting.component.html',
  styleUrls: ['./insights-setting.component.scss']
})
export class InsightsSettingComponent implements OnInit {
  facilityId: number;
  isLoading: boolean;
  addEditInsightsData = new InsightsSettingDto();
  adminInsightsData = new InsightsSettingDto();
  savingData: boolean;
  isAdmin = false;

  constructor(private toaster: ToastService, private insights: InsightsService,
    private appUi: AppUiService, private facilityService: FacilityService, private securityService: SecurityService) { }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.isAdmin = this.securityService.securityObject.userType === UserType.AppAdmin;
    this.GetQuickViewConfigByFacilityId();
  }
  GetQuickViewConfigByFacilityId() {
    this.isLoading = true;
    this.addEditInsightsData.facilityId = this.facilityId;
    if (this.isAdmin) {
      this.addEditInsightsData.facilityId = 0;
      this.facilityId = 0;
    }
    this.insights.GetQuickViewConfigByFacilityId(this.facilityId).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.addEditInsightsData = res.facilityConfig || new InsightsSettingDto();
        this.adminInsightsData = res.adminConfig || new InsightsSettingDto();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AddorEditQuickViewConfigByFacilityId() {
    this.savingData = true;
    if (this.isAdmin) {
      this.addEditInsightsData.facilityId = 0;
      this.facilityId = 0;
    }
    this.insights.AddorEditQuickViewConfigByFacilityId(this.addEditInsightsData).subscribe(
      (res: any) => {
        this.savingData = false;
        this.toaster.success('Settings saved successfully');
      },
      (error: HttpResError) => {
        this.savingData = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

}
