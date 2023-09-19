import { Component, Input, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ChartDataSets } from 'chart.js';
import moment from 'moment';
import { MdbTableDirective, MdbTablePaginationComponent, ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ClonerService } from 'src/app/core/cloner.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { DataStorageService } from 'src/app/core/data-storage.service';
import { RpmService } from 'src/app/core/rpm.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { BPDeviceDataDto, BGDeviceDataDto, WeightDataDto, ActivityDataDto, PulseOximetryDataDto, RPMEncounterDto } from 'src/app/model/rpm.model';
import { AlertReason, RpmAlertListDto, SendAlertSmsDto } from 'src/app/model/rpm/rpmAlert.model';
import { RpmQuickEncounterComponent } from '../rpm-quick-encounter/rpm-quick-encounter.component';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { Modalities, RPMServiceType } from 'src/app/Enums/rpm.enum';
import { IntellisenseService } from './../../core/Tools/intellisense.service';

@Component({
  selector: 'app-patient-rpm-alerts',
  templateUrl: './patient-rpm-alerts.component.html',
  styleUrls: ['./patient-rpm-alerts.component.scss']
})
export class PatientRpmAlertsComponent implements OnInit, AfterViewInit {
  @Input() PatientId: number;

  @ViewChild("tableEl2") tableEl2: MdbTableDirective;
  @ViewChild("tableEl2Page") tableEl2Page: MdbTablePaginationComponent;
  @ViewChild("tableEl1") tableEl1: MdbTableDirective;
  @ViewChild("tableEl1Page") tableEl1Page: MdbTablePaginationComponent;
  rpmAlertListDto = new Array<RpmAlertListDto>();
  rpmAlertListTimeLapse = new Array<RpmAlertListDto>();
  rpmAlertListOutOfRange = new Array<RpmAlertListDto>();
  isAlertLoading: boolean;
  facilityId: number;
  outOfRangeAddressedCount: number;
  timeLapseAddressedCount: number;
  selectedRpmAlertOutOfRange: any;
  isBpDevice: boolean;
  isWtDevice: boolean;
  isPoDevice: boolean;
  isBgDevice: boolean;
  isAtDevice: boolean;
  bloodGlucoseStatistics = [];
  bloodPressureStatistics = [];
  daterange: {};
  daterangeOfLastReading: {};
  daterangeOfLastLog: {};
  @ViewChild("outOfRangeAlertsHistoryModal") outOfRangeAlertsHistoryModal: ModalDirective;
  @ViewChild("addRPmEncounterRef") addRPmEncounterRef: RpmQuickEncounterComponent;
  isLoadingRpmModalityStatistics: boolean;
  weightStatistics: any;
  gettingBpData: boolean;
  bpReadingDayCount: number;
  BPDeviceDataList: any;
  PatientTestData: BPDeviceDataDto[];
  DeviceBarChartLabels: string[];
  DeviceBarChartData: any[];
  gettingWTData: boolean;
  wtReadingDayCount: any;
  weightDataList: any;
  isLoading: boolean;
  pulseOximetryDataList: any;
  gettingBGData: boolean;
  bgReadingDayCount: any;
  BGDeviceDataList: any;
  bgCHartData: any;
  activityDataList: any;
  selectedPatient: any;
  selectedModalityCode: string;
  sendAlertSmsObj: any;
  selectedRpmAlert: any;
  isSendingAlertSms: boolean;
  disclaimer: string;
  rpmOutOfRangeMonthId: number = new Date().getMonth() + 1;
  rpmOutOfRangeYearNum: number = new Date().getFullYear();

  isPatientModalityDetails = false;

  public dropdownScroll = {
    axis: "y",
    theme: "dark-3",
    scrollInertia: 2,
    scrollButtons: { enable: true },
    scrollbarPosition: "outside",
  };


  public chartColors: Array<any> = [
    {
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255,99,132,1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ];
  rpmEncounterDto: RPMEncounterDto;
  patient = new PatientDto();
  usingSMartPhrase: boolean;

  alertFilterObj = {
    outOfRange: "all",
    missedReading: "all"
  }

  constructor(public securityService: SecurityService,
    private toaster: ToastService,
    private cdRef: ChangeDetectorRef,
    private dataFilterService: DataFilterService,
    private dataStorageService: DataStorageService,
    private patientService: PatientsService,
    private intellisenseService: IntellisenseService,
    private cloneService: ClonerService,
    private rpmService: RpmService,) { }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    const pathname = location.pathname;
    pathname.split('/').forEach(x => {
      const pId = +x;
      if (pId && !this.PatientId) {
        this.PatientId = pId;
      }
    });
    this.getPatientById();
    this.GetRpmAlerts()
  }

  ngAfterViewInit(): void {
    this.tableEl2Page.setMaxVisibleItemsNumberTo(5);

    this.tableEl2Page.calculateFirstItemIndex();
    this.tableEl2Page.calculateLastItemIndex();
    this.tableEl1Page.setMaxVisibleItemsNumberTo(5);

    this.tableEl1Page.calculateFirstItemIndex();
    this.tableEl1Page.calculateLastItemIndex();
    this.cdRef.detectChanges();
  }
  getPatientById() {
    this.patientService.getPatientDetail(this.PatientId).subscribe(
      (res: PatientDto) => {
        this.patient = res;
      }, (err) => {
        this.toaster.error(err.error, err.message);
      })

  }
  GetRpmAlerts() {
    this.isAlertLoading = true;
    this.rpmService.GetRPMAlertsForDashboard(0, this.facilityId).subscribe(
      (res: any) => {
        this.isAlertLoading = false;
        this.rpmAlertListDto = res;
        if (this.PatientId) {
          this.rpmAlertListDto = this.rpmAlertListDto.filter(x =>x.patientId == this.PatientId)
        }
        if (this.rpmAlertListDto && this.rpmAlertListDto.length) {
          this.rpmAlertListOutOfRange = this.rpmAlertListDto.filter(
            (x) => x.alertReason === AlertReason.OutOfRange
          );
          this.rpmAlertListOutOfRange.forEach((rpmAlert) => {
            rpmAlert.measurementDate = moment(rpmAlert.measurementDate).format(
              "YYYY-MM-DD hh:mm A"
            );
          });
          this.rpmAlertListTimeLapse = this.rpmAlertListDto.filter(
            (x) => x.alertReason === AlertReason.NotReceived
          );
          // this.rpmAlertListTimeLapse = this.rpmAlertListDto;
        } else {
          this.rpmAlertListOutOfRange = [];
          this.rpmAlertListTimeLapse = [];
        }
        this.tableEl2.setDataSource(this.rpmAlertListOutOfRange);
        this.tableEl1.setDataSource(this.rpmAlertListTimeLapse);

        this.CalculateAddressedCOunt();
        // this.rpmAlertListDto.forEach(element => {
        //   if (element.callTime) {
        //     element.callTime = moment.utc(element.callTime).local().format('DD MMM h:mm a');
        //   }
        //   if (element.smsTime ) {
        //     element.smsTime = moment.utc(element.smsTime).local().format('DD MMM h:mm a');
        //   }
        //   if (element.dueTime ) {
        //     element.dueTime = moment.utc(element.dueTime).local().format('DD MMM h:mm a');
        //   }
        //   if (element.timeOut ) {
        //     element.timeOut = moment.utc(element.timeOut).local().format('DD MMM h:mm a');
        //   }
        //   if (element.alertTime) {
        //     element.alertTime = moment.utc(element.alertTime).local().format('DD MMM h:mm a');
        //   }
        // });
      },
      (error: HttpResError) => {
        this.isAlertLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  CalculateAddressedCOunt() {
    this.outOfRangeAddressedCount = 0;
    this.timeLapseAddressedCount = 0;
    this.rpmAlertListOutOfRange.forEach((element) => {
      if (element.addressedById) {
        this.outOfRangeAddressedCount = this.outOfRangeAddressedCount + 1;
      }
    });
    this.rpmAlertListTimeLapse.forEach((element) => {
      if (element.addressedById) {
        this.timeLapseAddressedCount = this.timeLapseAddressedCount + 1;
      }
    });
  }

  SetAddressedBy(alert: RpmAlertListDto) {
    this.OpenEncounterModal(alert);
    this.rpmService
      .SetAddressedBy({
        facilityUserId: this.securityService.securityObject.id,
        alertId: alert.id,
      })
      .subscribe(
        (res) => {
          alert.addressedById = this.securityService.securityObject.id;
          this.CalculateAddressedCOunt();
          //  this.isLoadingPayersList = false;
        },
        (error: HttpResError) => {
          //  this.isLoadingPayersList = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  OpenEncounterModal(alert: RpmAlertListDto) {
    const encounterObj = new RPMEncounterDto()
    encounterObj.rpmServiceType = RPMServiceType['Data Analysis']
    encounterObj.duration = 5 as any;
    if (alert.modality == Modalities.BP) {
      this.SmartPhraseSelected(alert, 'BP')
    } else if (alert.modality == Modalities.BG) {
      this.SmartPhraseSelected(alert, 'BG')
    } else if (alert.modality == Modalities.PO) {
      this.SmartPhraseSelected(alert, 'PO')
    } else if (alert.modality == Modalities.WT) {
      this.SmartPhraseSelected(alert, 'WT')
    } else {
      this.addRPmEncounterRef.OpenAddEncounterModal(this.patient, encounterObj, alert)
    }
  }

  SmartPhraseSelected(alert: RpmAlertListDto, code: string) {
    this.usingSMartPhrase = true;
    this.intellisenseService.GetModalityReviewText(this.PatientId, code, alert.id).subscribe(
      (res: any) => {
        this.usingSMartPhrase = false;
        const encounterObj = new RPMEncounterDto()
        encounterObj.rpmServiceType = RPMServiceType['Data Analysis']
        encounterObj.duration = 5 as any;
        if (res) {
           if (AlertReason.OutOfRange ==  alert.alertReason) {
            // let nText = `Patient reading noted to be out of range. Reading was taken on ${alert.measurementDate}.  [${code}] is [${alert.reading}]. `
            // res  = nText + res;
          }
          if (AlertReason.NotReceived ==  alert.alertReason) {
            // let nText = `Patient reading has not been received. `
            // res  = nText + res;
           }
          encounterObj.note = res
        }
        this.addRPmEncounterRef.OpenAddEncounterModal(this.patient, encounterObj, alert)
      },
      (error: HttpResError) => {
        this.usingSMartPhrase = false;
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getRpmReadingHistory() {
    this.getRpmModalityStatistics();
    if (this.selectedRpmAlertOutOfRange.modality == "Blood Pressure") {
      this.GetBPDeviceDisplayData();
      this.isBpDevice = true;
    }
    if (this.selectedRpmAlertOutOfRange.modality == "Weight") {
      this.GetWeightDeviceDatabyPatientId();
      this.isWtDevice = true;
    }
    if (this.selectedRpmAlertOutOfRange.modality == "Pulse Oximetry") {
      this.GetPulseDeviceDatabyPatientId();
      this.isPoDevice = true;
    }
    if (this.selectedRpmAlertOutOfRange.modality == "Blood Glucose") {
      this.GetBloodGlucoseDeviceDatabyPatientId();
      this.isBgDevice = true;
    }
    if (this.selectedRpmAlertOutOfRange.modality == "Activity") {
      this.GetActivityDeviceDatabyPatientId();
      this.isAtDevice = true;
    }
    this.outOfRangeAlertsHistoryModal.show();
  }
  getRpmModalityStatistics() {
    this.isLoadingRpmModalityStatistics = true;
    this.rpmService
      .getRpmModalityStatistics(this.selectedRpmAlertOutOfRange.patientId)
      .subscribe(
        (res: any) => {
          this.bloodPressureStatistics = res.bloodPressureStatistics;
          this.bloodGlucoseStatistics = res.bloodGlucoseStatistics;
          this.weightStatistics = res.weightStatistics;
          this.isLoadingRpmModalityStatistics = false;
          console.log(res);
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
          this.isLoadingRpmModalityStatistics = false;
        }
      );
  }
  GetBPDeviceDisplayData() {
    this.gettingBpData = true;
    const lastThirtyDays = true;
    this.rpmService
      .GetBPDisplayData(
        this.selectedRpmAlertOutOfRange.patientId,
        this.rpmOutOfRangeMonthId,
        this.rpmOutOfRangeYearNum,
        lastThirtyDays
      )
      .subscribe(
        (res: BPDeviceDataDto[]) => {
          if (res) {
            res.forEach((element) => {
              element.measurementDate = moment(element.measurementDate).format(
                "D MMM YY,\\ h:mm a"
              );
            });
            this.bpReadingDayCount = res
              .map((x) => x.measurementDate)
              .map((x) => moment(x).format("YYYY-MM-DD"))
              .filter((item, i, ar) => ar.indexOf(item) === i).length;
            // res = this.dataFilterService.distictArrayByProperty(res, 'measurementDate');
            // above code distinct reading on the basis of date time
          }
          this.BPDeviceDataList = this.cloneService.deepClone(res);
          if (res) {
            this.PatientTestData = res.reverse();
            const highPressure = new Array<number>();
            const lowPressure = new Array<number>();
            const heartRate = new Array<number>();
            const bpl = new Array<number>();
            const tempLabels = new Array<string>();
            if (this.PatientTestData && this.PatientTestData.length > 0) {
              this.PatientTestData.forEach(
                (element: BPDeviceDataDto, index: number) => {
                  // tempLabels.push((index + 1).toString());
                  tempLabels.push(
                    // moment.utc(element.measurementDate).local().format('D MMM YY,\\ h:mm a')
                    element.measurementDate
                  );
                  highPressure.push(element.highPressure);
                  lowPressure.push(element.lowPressure);
                  heartRate.push(element.heartRate);
                  bpl.push(element.bpl);
                }
              );
              const tempArr = new Array<any>();
              tempArr.push({ data: highPressure, label: "Systoliac" });
              tempArr.push({ data: lowPressure, label: "Diastolic" });
              // tempArr.push({ data: heartRate, label: 'Heart Rate' });
              // tempArr.push({ data: bpl, label: 'BPL' });
              this.DeviceBarChartLabels = tempLabels;
              this.DeviceBarChartData = tempArr;
            }
            // this.patientDevicesDataList.push({
            //   chartType: 'line',
            //   deviceObj: device,
            //   deviceData: {
            //     labels: this.DeviceBarChartLabels,
            //     data: this.DeviceBarChartData
            //   }
            // });
          }
          this.gettingBpData = false;
          // this.toaster.success('data saved successfully.');
        },
        (error) => {
          this.gettingBpData = false;
          this.toaster.error(error.message, error.error || error.error);
          return null;
        }
      );
  }
  GetWeightDeviceDatabyPatientId() {
    this.gettingWTData = true;
    const lastThirtyDays = true;
    this.rpmService
      .GetWeightDeviceDatabyPatientId(
        this.selectedRpmAlertOutOfRange.patientId,
        this.rpmOutOfRangeMonthId,
        this.rpmOutOfRangeYearNum,
        lastThirtyDays
      )
      .subscribe(
        (res: any) => {
          if (res) {
            res.forEach((element) => {
              element.measurementDate = moment(element.measurementDate).format(
                "D MMM YY,\\ h:mm a"
              );
            });
            this.wtReadingDayCount = res
              .map((x) => x.measurementDate)
              .map((x) => moment(x).format("YYYY-MM-DD"))
              .filter((item, i, ar) => ar.indexOf(item) === i).length;
            res = this.dataFilterService.distictArrayByProperty(
              res,
              "measurementDate"
            );
          }
          this.weightDataList = res;
          if (res) {
            const muscaleValue = new Array<number>();
            const waterValue = new Array<number>();
            const weightValue = new Array<number>();
            const tempLabels = new Array<string>();
            const tempArr = new Array<any>();
            if (res && res.length > 0) {
              res.forEach((element: any, index: number) => {
                // tempLabels.push((index + 1).toString());
                tempLabels.push(
                  // moment(element.measurementDate).format('D MMM YY,\\ h:mm a')
                  // moment.utc(element.measurementDate).local().format('D MMM YY,\\ h:mm a')
                  element.measurementDate
                );
                muscaleValue.push(element.muscaleValue);
                waterValue.push(element.waterValue);
                weightValue.push(element.weightValue);
              });
              // tempArr.push({ data: muscaleValue, label: 'Muscale Value' });
              // tempArr.push({ data: waterValue, label: 'Water Value' });
              tempArr.push({ data: weightValue, label: "Weight Value" });
            }
            // this.patientDevicesDataList.push({
            //   chartType: 'bar',
            //   deviceObj: device,
            //   deviceData: {
            //     labels: tempLabels,
            //     data: tempArr
            //   }
            // });
          }
          this.gettingWTData = false;
          // console.log(this.devicesList);
        },
        (error: HttpResError) => {
          this.gettingWTData = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GetPulseDeviceDatabyPatientId() {
    const lastThirtyDays = true;
    this.rpmService
      .GetPulseDeviceDatabyPatientId(
        this.selectedRpmAlertOutOfRange.patientId,
        this.rpmOutOfRangeMonthId,
        this.rpmOutOfRangeYearNum,
        lastThirtyDays
      )
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.pulseOximetryDataList = res;
          if (res) {
            const bloodOxygen = new Array<number>();
            const heartRate = new Array<number>();
            const tempLabels = new Array<string>();
            const tempArr = new Array<any>();
            if (res && res.length > 0) {
              res.forEach((element: any, index: number) => {
                // tempLabels.push((index + 1).toString());
                tempLabels.push(
                  // moment(element.measurementDate).format('D MMM YY,\\ h:mm a')
                  moment
                    .utc(element.measurementDate)
                    .local()
                    .format("D MMM YY,\\ h:mm a")
                );
                bloodOxygen.push(element.bloodOxygen);
                heartRate.push(element.heartRate);
              });
              tempArr.push({ data: bloodOxygen, label: "Blood Oxygen" });
              tempArr.push({ data: heartRate, label: "Heart Rate" });
            }
            // this.patientDevicesDataList.push({
            //   chartType: 'horizontalBar',
            //   deviceObj: device,
            //   deviceData: {
            //     labels: tempLabels,
            //     data: tempArr
            //   }
            // });
          }
          // console.log(this.devicesList);
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GetBloodGlucoseDeviceDatabyPatientId() {
    this.gettingBGData = true;
    const lastThirtyDays = true;
    this.rpmService
      .GetBloodGlucoseDeviceDatabyPatientId(
        this.selectedRpmAlertOutOfRange.patientId,
        this.rpmOutOfRangeMonthId,
        this.rpmOutOfRangeYearNum,
        lastThirtyDays
      )
      .subscribe(
        (res: any) => {
          if (res) {
            res = res.reverse();
            res.forEach((element1) => {
              element1.measurementDate = moment(
                element1.measurementDate
              ).format("D MMM YY,\\ h:mm a");
            });
            this.bgReadingDayCount = res
              .map((x) => x.measurementDate)
              .map((x) => moment(x).format("YYYY-MM-DD"))
              .filter((item, i, ar) => ar.indexOf(item) === i).length;
            res = this.dataFilterService.distictArrayByProperty(
              res,
              "measurementDate"
            );
          }
          this.BGDeviceDataList = res;
          if (res) {
            const bloodGlucose = new Array<number>();
            const dinnerSituation = new Array<number>();
            const tempArr = new Array<ChartDataSets>();
            let tempLabels = new Array<string>();
            const rData = this.dataFilterService.groupByProp(
              this.BGDeviceDataList,
              "dinnerSituation"
            );
            this.BGDeviceDataList = this.BGDeviceDataList.reverse();
            this.bgCHartData = rData;
            if (res && res.length > 0) {
              rData.forEach((item: any, index: number) => {
                // tempLabels.push((index + 1).toString());
                item.value.forEach((element2: BGDeviceDataDto) => {
                  // const xLabelFormat = moment(element2.measurementDate, 'D MMM YY,\\ h:mm a').format('D MMM \\ h:mm a');
                  tempLabels.push(
                    // moment.utc(element2.measurementDate).local().format('D MMM YY,\\ h:mm a')
                    // moment(element2.measurementDate).format('D MMM YY,\\ h:mm a')
                    element2.measurementDate
                  );
                });
                // tempArr.push({ data: item.value.map((x: BGDeviceDataDto) => x.bg), label: item.key });
              });
            }
            tempLabels = tempLabels.sort((left, right) => {
              const ssd = moment(left, "D MMM YY,\\ h:mm a").diff(
                moment(right, "D MMM YY,\\ h:mm a")
              );
              return ssd;
            });
            rData.forEach((item, index) => {
              const dataSet: ChartDataSets = {};
              dataSet.label = item.key;
              dataSet.data = [];
              dataSet.backgroundColor =
                this.chartColors[0].backgroundColor[index];
              dataSet.borderColor = this.chartColors[0].borderColor[index];
              dataSet.borderWidth = 1;
              tempLabels.forEach((element3) => {
                const currentDate = element3;
                element3 = moment(element3, "D MMM YY,\\ h:mm a").format(
                  "D MMM \\ h:mm a"
                );
                const existDate = item.value.find(
                  (row: BGDeviceDataDto) => row.measurementDate === currentDate
                );
                if (existDate) {
                  dataSet.data.push(existDate.bg);
                } else {
                  dataSet.data.push(null);
                }
              });
              tempArr.push(dataSet);
            });

            // this.patientDevicesDataList.push({
            //   chartType: 'horizontalBar',
            //   deviceObj: device,
            //   deviceData:
            //   // [
            //     {
            //       labels: tempLabels,
            //       data: tempArr
            //     }
            //   // ]
            // });
          }
          this.gettingBGData = false;
          // console.log(this.devicesList);
          // this.selectGraph();
        },
        (error: HttpResError) => {
          this.gettingBGData = true;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GetActivityDeviceDatabyPatientId() {
    const lastThirtyDays = true;
    this.rpmService
      .GetActivityDeviceDatabyPatientId(
        this.selectedRpmAlertOutOfRange.patientId,
        this.rpmOutOfRangeMonthId,
        this.rpmOutOfRangeYearNum,
        lastThirtyDays
      )
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.activityDataList = res;
          if (res) {
            const steps = new Array<number>();
            const calories = new Array<number>();
            const tempLabels = new Array<string>();
            const tempArr = new Array<any>();
            if (res && res.length > 0) {
              res.forEach((element: any, index: number) => {
                // tempLabels.push((index + 1).toString());
                tempLabels.push(
                  // moment(element.measurementDate).format('D MMM YY,\\ h:mm a')
                  moment
                    .utc(element.measurementDate)
                    .local()
                    .format("D MMM YY,\\ h:mm a")
                );
                steps.push(element.steps);
                calories.push(element.calories);
              });
              tempArr.push({ data: steps, label: "Steps" });
              tempArr.push({ data: calories, label: "Calories" });
            }
            // this.patientDevicesDataList.push({
            //   chartType: 'line',
            //   deviceObj: device,
            //   deviceData: {
            //     labels: tempLabels,
            //     data: tempArr
            //   }
            // });
          }
          // console.log(this.devicesList);
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
  }
  getSelectedModalityHistory(){
    this.selectedRpmAlertOutOfRange.patientId=this.selectedPatient.id;
    if(this.selectedModalityCode == 'BG'){
      this.selectedRpmAlertOutOfRange.modality = 'Blood Glucose';
    }
    if(this.selectedModalityCode == 'BP'){
      this.selectedRpmAlertOutOfRange.modality = 'Blood Pressure';
    }
    if(this.selectedModalityCode == 'WT'){
      this.selectedRpmAlertOutOfRange.modality = 'Weight';
    }
    if(this.selectedModalityCode == 'PO'){
      this.selectedRpmAlertOutOfRange.modality = 'Pulse Oximetry';
    }
    if(this.selectedModalityCode == 'AT'){
      this.selectedRpmAlertOutOfRange.modality = 'Activity';
    }
    this.getRpmReadingHistory();
  }
  smsAlertDate() {
    this.sendAlertSmsObj = new SendAlertSmsDto();
    if (this.selectedRpmAlert.modality) {
      this.GetDefaultNotReceivedSmsContent();
    }
    // this.sendAlertSmsObj.timeOut = moment().format('YYYY-MM-DD h:mm:ss a');
  }
  GetDefaultNotReceivedSmsContent() {
    throw new Error('Method not implemented.');
  }
  SendAlertSms(modal: ModalDirective) {
    this.isSendingAlertSms = true;
    if (this.selectedRpmAlert.patientId) {
      this.sendAlertSmsObj.patientId = this.selectedRpmAlert.patientId;
    } else {
      this.sendAlertSmsObj.patientId = this.selectedRpmAlert.id;
    }
    // this.sendAlertSmsObj.patientId = this.selectedRpmAlert.id;
    this.sendAlertSmsObj.rpmAlertId = 0;
    this.sendAlertSmsObj.timeOut = moment(
      this.sendAlertSmsObj.timeOut,
      "YYYY-MM-DD h:mm:ss a"
    )
      .utc()
      .format("YYYY-MM-DD h:mm:ss a");
    this.sendAlertSmsObj.messageText =
      this.sendAlertSmsObj.messageText + " " + this.disclaimer;
    this.rpmService.SendAlertSms(this.sendAlertSmsObj).subscribe(
      (res: any) => {
        this.addEncounterOnSMS();
        this.isSendingAlertSms = false;
        modal.hide();
        this.toaster.success("Sms sent successfully");
        this.sendAlertSmsObj = new SendAlertSmsDto();
        this.GetRpmAlerts();
      },
      (error: HttpResError) => {
        this.isSendingAlertSms = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  addEncounterOnSMS() {
    throw new Error('Method not implemented.');
  }
  clearData() {
    this.BGDeviceDataList = new Array<BGDeviceDataDto>();
    this.BPDeviceDataList = new Array<BPDeviceDataDto>();
    this.weightDataList = new Array<WeightDataDto>();
    this.activityDataList = new Array<ActivityDataDto>();
    this.pulseOximetryDataList = new Array<PulseOximetryDataDto>();
    this.isBpDevice = false;
    this.isWtDevice = false;
    this.isPoDevice = false;
    this.isBgDevice = false;
    this.isAtDevice = false;
  }
  resetEncounterModal(rpmEncounterModal: ModalDirective) {
    this.rpmEncounterDto = new RPMEncounterDto();
    if (this.securityService.hasClaim('IsBillingProvider')) {
      // this.isBillingProvider = true;
      this.rpmEncounterDto.billingProviderId = this.securityService.securityObject.id;
    }
    this.rpmEncounterDto.encounterDate = moment().format("YYYY-MM-DD hh:mm A");
    const time = moment().format("hh:mm");
    this.rpmEncounterDto.startTime = time;
    rpmEncounterModal.show();
  }
}
