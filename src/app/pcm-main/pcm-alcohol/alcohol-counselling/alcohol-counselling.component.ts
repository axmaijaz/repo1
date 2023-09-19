import { Component, OnInit, OnDestroy } from '@angular/core';
import { SubSink } from 'src/app/SubSink';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { PcmAlcoholService } from 'src/app/core/pcm/pcm-alcohol.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { Location } from '@angular/common';
import { EditAMCounsellingDto } from 'src/app/model/pcm/pcm-alcohol.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';

@Component({
  selector: 'app-alcohol-counselling',
  templateUrl: './alcohol-counselling.component.html',
  styleUrls: ['./alcohol-counselling.component.scss']
})
export class AlcoholCounsellingComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  PatientId: number;
  counsellingID: number;
  editAmCounsellingObj = new EditAMCounsellingDto();
  SavingAMCounselling: boolean;
  loadingAMCounselling: boolean;
  facilityId: number;
  BIllingProviderList = new Array<CreateFacilityUserDto>();
  isGeneralCounselling: boolean;

  constructor(private facilityService: FacilityService, private securityService: SecurityService, private location: Location, private alcoholService: PcmAlcoholService, private route: ActivatedRoute, private toaster: ToastService) { }

  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body'

  };

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    this.counsellingID = +this.route.snapshot.paramMap.get('cId');
    if (this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    }
    this.GetAMCounselingById();
    this.getBillingProviders();
     this.isGeneralCounselling = this.route.snapshot.data['gCounselling'] ? true : false;
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  goBack() {
    this.location.back();
  }
  SaveAMCounselling() {
    this.SavingAMCounselling = true;
    this.editAmCounsellingObj.id = this.counsellingID;
    this.subs.sink = this.alcoholService.EditAMCounseling(this.editAmCounsellingObj).subscribe(
      (res: any) => {
        this.toaster.success('Encounter saved successfully');
        this.SavingAMCounselling = false;
      },
      (error: HttpResError) => {
        this.SavingAMCounselling = false;
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
  GetAMCounselingById() {
    this.loadingAMCounselling = true;
    this.subs.sink = this.alcoholService.GetAMCounselingById(this.counsellingID).subscribe(
      (res: any) => {
        this.editAmCounsellingObj = res;
        this.loadingAMCounselling = false;
      },
      (error: HttpResError) => {
        this.loadingAMCounselling = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

}
