import { Component, OnInit, OnDestroy } from "@angular/core";
import { IDatePickerConfig, ECalendarValue } from "ng2-date-picker";
import { SecurityService } from "src/app/core/security/security.service";
import { DailyReportingDto, DailyReportingViewDto } from "src/app/model/daily-Report/daily_report.model";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { DailyReportingService } from "src/app/core/DailyReporting/daily-reporting.service";
import { HttpResError } from "src/app/model/common/http-response-error";
import { ToastService } from "ng-uikit-pro-standard";
import * as moment from "moment";
import { NumberValidatorsService } from "src/app/core/number-validator-service.service";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { FacilityService } from "src/app/core/facility/facility.service";
import { CreateFacilityUserDto } from "src/app/model/Facility/facility.model";
import { UserType } from "src/app/Enums/UserType.enum";
import { SubSink } from 'src/app/SubSink';
import { Location } from "@angular/common";

@Component({
  selector: "app-daily-reporting",
  templateUrl: "./daily-reporting.component.html",
  styleUrls: ["./daily-reporting.component.scss"]
})
export class DailyReportingComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD"
  };
  dailyReportinForm: FormGroup;
  date: "";
  isLoading = false;
  reportId = 0;
  careProviderId = 0;
  dailyReportingList = new Array<DailyReportingDto>();
  dailyReportingDto = new DailyReportingDto();
  dailyReportingViewDto = new DailyReportingViewDto();
  currentDate = new Date();
  public displayDate;
  facilityId: number;
  CareProvidersList = new Array<CreateFacilityUserDto>();
  showDropDown = true;
  constructor(
    private securityService: SecurityService,
    private fb: FormBuilder,
    private location: Location,
    private dailyReportingService: DailyReportingService,
    private facilityService: FacilityService,
    private toaster: ToastService // private numberValidatorService: NumberValidatorsService
  ) {}

  ngOnInit() {
    this.dailyReportinForm = this.fb.group({
      date: ["", [Validators.required]],
      dailyNote: [""],
      potentialPatients: [
        ""
        // [Validators.required, NumberValidatorsService.min(0)]
      ],
      patientsenrolled: [""],
      denied: [""],
      pendingDecision: [""],
      noShows: [""],
      patientContacted: [""],
      patientNotavailable: [""],
      patientCompleted: [""],
      patientIncomplete: [""]
    });
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.showDropDown = false;
      this.careProviderId = this.securityService.securityObject.id;
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    } else {
      this.careProviderId = 0;
      this.facilityId = 0;
    }
    this.getAllReportsBycareproviderId();
    this.getCareProviders();
  }
  navigateBack() {
    this.location.back();
  }
  setDate() {
    this.dailyReportinForm.reset();
    const date = moment().format("YYYY-MM-DD");
    this.dailyReportinForm.get("date").setValue(date);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  addEditDailyReport() {
    if (this.reportId === 0) {
      this.isLoading = true;
      this.dailyReportingDto = this.dailyReportinForm.value;
      this.dailyReportingDto.id = this.reportId;
      this.dailyReportingDto.facilityId = this.facilityId;
      this.dailyReportingDto.careProviderId = this.securityService.securityObject.id;
      for (const daily_report in this.dailyReportingDto) {
        if (this.dailyReportingDto[daily_report] === null) {
          this.dailyReportingDto[daily_report] = 0;
        }
      }
      this.subs.sink = this.dailyReportingService
        .AddEditDailyReport(this.dailyReportingDto)
        .subscribe(
          res => {
            this.isLoading = false;
            this.toaster.success("data added Successfully");
            this.getAllReportsBycareproviderId();

            this.dailyReportinForm.reset();
            this.reportId = 0;
          },
          (error: HttpResError) => {
            this.isLoading = false;
            this.toaster.error(error.message, error.error);
          }
        );
    } else {
      this.isLoading = true;
      this.dailyReportingDto = this.dailyReportinForm.value;
      this.dailyReportingDto.id = this.reportId;
      this.dailyReportingDto.facilityId = this.facilityId;
      this.dailyReportingDto.careProviderId = this.securityService.securityObject.id;
      for (const daily_report in this.dailyReportingDto) {
        if (this.dailyReportingDto[daily_report] === null) {
          this.dailyReportingDto[daily_report] = 0;
        }
      }
      this.subs.sink = this.dailyReportingService
        .AddEditDailyReport(this.dailyReportingDto)
        .subscribe(
          res => {
            this.isLoading = false;
            this.toaster.success("Update Data Successfully");
            this.getAllReportsBycareproviderId();
            this.dailyReportinForm.reset();
            this.reportId = 0;
          },
          (error: HttpResError) => {
            this.isLoading = false;
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }

  getAllReportsBycareproviderId() {
    this.isLoading = true;
    if (!this.careProviderId) {
      this.careProviderId = 0;
    }
    this.subs.sink = this.dailyReportingService
      .GetAllCareProviderReportsByCareProviderId(this.careProviderId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.isLoading = false;
            //  const formatDate = res.date;
            // res.date = moment(res.date).format("yyyy-MM-DD");
            this.dailyReportingList = res;
          }
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  getDailyReportByReportId(row: any) {
    this.dailyReportinForm.reset();
    this.reportId = row.id;
    this.dailyReportinForm.patchValue(row);
    this.dailyReportinForm.get("date").setValue(row.date.slice(0, 10));
    //  this.dailyReportinForm.get("date").setValue(reportingdate);
    //   this.dailyReportingService
    //     .GetDailyReportByReportId(reportId)
    //     .subscribe((res: any) => {
    //       this.reportId = res.id;
    //       this.dailyReportinForm.patchValue(res);
    //       const reportingdate = res.date.slice(0, 10);
    //       this.dailyReportinForm.get("date").setValue(reportingdate);
    //       // this.dailyReportinForm.controls.setValue(res);
    //     });
  }
  getCareProviders() {
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.subs.sink = this.facilityService
      .GetCareProvidersByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.CareProvidersList = res;
          }
        },
        error => {
          // console.log(error);
        }
      );
  }
  getDailyReportForView(DailyReportId: number) {
    const appUserId = this.securityService.securityObject.appUserId;
  }
}
