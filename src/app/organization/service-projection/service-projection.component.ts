import { Component, OnInit } from "@angular/core";
import moment from "moment";
import { ToastService } from "ng-uikit-pro-standard";
import { ECalendarValue, IDatePickerConfig } from "ng2-date-picker";
import { EndOfDayService } from "src/app/core/end-of-day.service";
import { SecurityService } from "src/app/core/security/security.service";
import { HttpResError } from "src/app/model/common/http-response-error";
import {
  EditMonthlyProjection,
  MonthlyProjection,
} from "src/app/model/eodReport.model";

@Component({
  selector: "app-service-projection",
  templateUrl: "./service-projection.component.html",
  styleUrls: ["./service-projection.component.scss"],
})
export class ServiceProjectionComponent implements OnInit {
  selectedDate = moment().format("YYYY-MM");
  currentDate = moment().format("YYYY-MM");
  facilityId: number;
  monthlyProjectionDto = new MonthlyProjection();
  editMonthlyProjection = new EditMonthlyProjection();
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM",
    min: "2022-08-01",
    max: this.currentDate,
  };
  isEditingServiceTarget: boolean;
  isSameMonth = true;
  constructor(
    private endOfDayService: EndOfDayService,
    private securityService: SecurityService,
    private toaster: ToastService
  ) {}

  ngOnInit() {
    this.facilityId = +this.securityService.getClaim("FacilityId")?.claimValue;
    if (this.facilityId) {
      this.getMonthlyProjectionByFacilityId();
    }
  }
  filterByMonth(date) {
    this.isSameMonth = moment(date.date).isSame(new Date(), "month");
    this.selectedDate = date.date;
    this.getMonthlyProjectionByFacilityId();
  }
  getMonthlyProjectionByFacilityId() {
    var check = moment(this.selectedDate, "YYYY/MM/DD");
    var month = check.format("M");
    var year = check.format("YYYY");
    this.endOfDayService
      .GetMonthlyProjectionByFacilityId(this.facilityId, month, year)
      .subscribe(
        (res: MonthlyProjection) => {
          this.monthlyProjectionDto = res;
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
  }
  editMonthlyProjectionById() {
    this.isEditingServiceTarget = true;
    var check = moment(this.selectedDate, "YYYY/MM/DD");
    var month = check.format("M");
    var year = check.format("YYYY");
    this.editMonthlyProjection.id = this.monthlyProjectionDto.id;
    this.editMonthlyProjection.month = +month;
    this.editMonthlyProjection.year = +year;
    this.editMonthlyProjection.ccmTarget = this.monthlyProjectionDto.ccmTarget;
    this.editMonthlyProjection.rpmTarget = this.monthlyProjectionDto.rpmTarget;
    if(this.editMonthlyProjection.ccmTarget === null){
      this.editMonthlyProjection.ccmTarget = 0;
    }
    if(this.editMonthlyProjection.rpmTarget === null){
      this.editMonthlyProjection.rpmTarget = 0;
    }
    this.endOfDayService
      .EditMonthlyProjectionById(this.editMonthlyProjection)
      .subscribe(
        (res: any) => {
          this.toaster.success("Monthly Target Saved.");
          this.isEditingServiceTarget = false;
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
          this.isEditingServiceTarget = false;
        }
      );
  }
}
