import { DatatableComponent, NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { RpmService } from 'src/app/core/rpm.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { CalibrationRecord, DexcomCalibrationResponseDto, DexcomeEventRecord, DexcomEgvDataResultDto, DexcomEventResponseDto, EgvRecord } from 'src/app/model/rpm.model';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-device-data',
  templateUrl: './device-data.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./device-data.component.scss']
})
export class DeviceDataComponent implements OnInit {
  isLoadingDevice: boolean;
  isLoadingEvg: boolean;
  isLoadingEvents: boolean;
  isLoadingCalibration: boolean;
  patientId: number;
  startDate = '';
  endDate = '';
  dexcomEgvDataResultDto = new DexcomEgvDataResultDto();
  dexcomEventsDataResultDto = new Array<DexcomeEventRecord>();
  dexcomEgvsList = new Array<EgvRecord>();
  dexcomCalibrationDataResultDto = new Array<CalibrationRecord>();
  @ViewChild('EventsView') eventsView: DatatableComponent
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MM-DD-YYYY',
  };
  isCheckingToken: boolean;
  isDexcomConnected: any;

  constructor(private securityService: SecurityService,
    private route: ActivatedRoute,
    private rpmService: RpmService,
    private cdtr: ChangeDetectorRef,
    private toaster: ToastService,) { }

  ngOnInit() {
    if (
      this.securityService.securityObject.userType === UserType.Patient
    ) {
      this.patientId = this.securityService.securityObject.id;
    }

    this.GetDexcomCheckAuthGiven();
  }
  GetDexcomCheckAuthGiven() {
    this.isCheckingToken = true;
    this.rpmService
      .GetDexcomCheckAuthGiven(this.patientId)
      .subscribe(
        (res: any) => {
          this.isCheckingToken = false;
          this.isDexcomConnected = res;
          if (this.isDexcomConnected) {
            this.getAllTabsData();
          } else {
            this.toaster.warning('Dexcom consent not taken');
          }
        },
        (error: HttpResError) => {
          this.isCheckingToken = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  onActivate(event: any) {
    if (event.type === "click") {
      // id: number = +event.row.id;
    }
  }
  getAllTabsData() {
    if (!this.startDate || !this.endDate) {
      return;
    }
    this.GetEgvs();
    this.GetCalibrations();
    this.GetEvents();
  }
  GetCalibrations() {
    if (this.patientId) {
      this.isLoadingDevice = true;
      this.rpmService
        .GetCalibrationsV3(this.patientId, this.startDate, this.endDate)
        .subscribe(
          (res: DexcomCalibrationResponseDto) => {
            this.isLoadingDevice = false;
            this.dexcomCalibrationDataResultDto = res.records;
            this.cdtr.detectChanges();
            // this.dexcomCalibrationDataResultDto = [...this.dexcomCalibrationDataResultDto]
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
            this.isLoadingDevice = false;
          }
        );
    }
  }
  GetEvents() {
    if (this.patientId) {
      this.isLoadingDevice = true;
      this.rpmService
        .GetEventsV3(this.patientId, this.startDate, this.endDate)
        .subscribe(
          (res: DexcomEventResponseDto) => {
            this.isLoadingDevice = false;
            // this.eventsView.resize;
            this.dexcomEventsDataResultDto = res.records;
            this.cdtr.detectChanges();
            // this.dexcomEventsDataResultDto = [...this.dexcomEventsDataResultDto]
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
            this.isLoadingDevice = false;
          }
        );
    }
  }
  GetEgvs() {
    if (this.patientId) {
      this.isLoadingDevice = true;
      this.rpmService
        .GetEgvsV3(this.patientId, this.startDate, this.endDate)
        .subscribe(
          (res: DexcomEgvDataResultDto) => {
            this.isLoadingDevice = false;
            this.dexcomEgvDataResultDto = res;
            this.dexcomEgvsList = res.records;
            this.cdtr.detectChanges();
            // this.dexcomEgvsList = [...this.dexcomEgvsList]
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
            this.isLoadingDevice = false;
          }
        );
    }
  }

}
