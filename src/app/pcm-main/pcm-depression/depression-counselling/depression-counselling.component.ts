import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'src/app/SubSink';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { Location } from '@angular/common';
import { EditDPCounsellingDto } from 'src/app/model/pcm/pcm.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';

@Component({
  selector: 'app-depression-counselling',
  templateUrl: './depression-counselling.component.html',
  styleUrls: ['./depression-counselling.component.scss']
})
export class DepressionCounsellingComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  PatientId: number;
  counsellingId: number;
  editDPCounsellingObj = new EditDPCounsellingDto();
  SavingDPCounselling: boolean;
  loadingDPCounselling: boolean;
  facilityId: number;
  BIllingProviderList = new Array<CreateFacilityUserDto>();
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body'

  };
  constructor(private facilityService: FacilityService, private securityService: SecurityService, private pcmService: PcmService, private location: Location, private route: ActivatedRoute, private toaster: ToastService) { }

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    this.counsellingId = +this.route.snapshot.paramMap.get('cId');if (this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    }
    this.GetDepressionCounselingById();
    this.getBillingProviders();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  goBack() {
    this.location.back();
  }
  SaveDPCounselling() {
    this.SavingDPCounselling = true;
    this.subs.sink = this.pcmService.EditDepressionCounseling(this.editDPCounsellingObj).subscribe(
      (res: any) => {
        this.toaster.success('Encounter saved successfully');
        this.SavingDPCounselling = false;
      },
      (error: HttpResError) => {
        this.SavingDPCounselling = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetDepressionCounselingById() {
    this.loadingDPCounselling = true;
    this.subs.sink = this.pcmService.GetDepressionCounselingById(this.counsellingId).subscribe(
      (res: any) => {
        this.editDPCounsellingObj = res;
        this.loadingDPCounselling = false;
      },
      (error: HttpResError) => {
        this.loadingDPCounselling = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getBillingProviders() {
    this.subs.sink = this.facilityService
      .getBillingProviderByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.BIllingProviderList = res;
          }
        },
        error => {
        }
      );
  }
}
