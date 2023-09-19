import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { SetFacilityServiceConfigDto } from 'src/app/model/Facility/facility.model';

@Component({
  selector: 'app-services-config',
  templateUrl: './services-config.component.html',
  styleUrls: ['./services-config.component.scss']
})
export class ServicesConfigComponent implements OnInit {

  SetFacilityServiceCOnfigDto = new SetFacilityServiceConfigDto();
  isLoadingServiceConfig: boolean;
  isSetFacilityServiceCOnfig: boolean;
  facilityId: number;
  constructor(private facilityService: FacilityService,
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private toaster: ToastService,
    private appUi: AppUiService) { }

  ngOnInit(): void {
    this.facilityId = +this.route.snapshot.paramMap.get("facilityId");
    this.GetFacilityServiceConfig(this.facilityId)
  }
  GetFacilityServiceConfig(facilityId: number) {
    this.isLoadingServiceConfig = true;
    this.facilityService.GetFacilityServiceConfig(facilityId).subscribe(
      (res: SetFacilityServiceConfigDto) => {
        this.SetFacilityServiceCOnfigDto = res;
        this.isLoadingServiceConfig = false;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
        this.isLoadingServiceConfig = false;
      }
    );
  }
  AutoTimeCaptureChanged() {
    if (!this.SetFacilityServiceCOnfigDto.autoTimeCapture) {
      this.SetFacilityServiceCOnfigDto.timeLapseAlertDuration = 0;
      this.SetFacilityServiceCOnfigDto.outOfRangeAlertDuration = 0;
    } else {
      this.SetFacilityServiceCOnfigDto.timeLapseAlertDuration = 5;
      this.SetFacilityServiceCOnfigDto.outOfRangeAlertDuration = 5;
    }
    this.SetFacilityServiceCOnfig()
  }
  SetFacilityServiceCOnfig() {
    this.isSetFacilityServiceCOnfig = true;
    if (!this.SetFacilityServiceCOnfigDto.rpmService) {
      this.SetFacilityServiceCOnfigDto.rpmComplianceMonitoring = false;
    }
    this.facilityService
      .SetFacilityServiceCOnfig(this.SetFacilityServiceCOnfigDto)
      .subscribe(
        (res: any) => {
          this.isSetFacilityServiceCOnfig = false;
          this.toaster.success("Facility Service Updated");
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
          this.isSetFacilityServiceCOnfig = false;
        }
      );
  }

  showRpmNotificationConfirmationModal(){
    const modalDto = new LazyModalDto();
    modalDto.Title = 'RPM Notifications Confirmation';
    if(!this.SetFacilityServiceCOnfigDto.enableNotifications){
      modalDto.Text = 'This action will disable sending SMS Messages to all patients, are you sure?';
    }else{
      modalDto.Text = 'This action will enable sending SMS Messages to all patients, are you sure?';
    }
    modalDto.callBack = this.callBackBhi;
      modalDto.rejectCallBack = this.rejectCallBackBhi;
      this.appUi.openLazyConfrimModal(modalDto);
    
  }
  rejectCallBackBhi = () => {
    if(this.SetFacilityServiceCOnfigDto.enableNotifications){
      this.SetFacilityServiceCOnfigDto.enableNotifications = false;
    }else{
      this.SetFacilityServiceCOnfigDto.enableNotifications = true;
    }
  }
  callBackBhi = (row) => {
    this.SetFacilityServiceCOnfig();
  }
}
