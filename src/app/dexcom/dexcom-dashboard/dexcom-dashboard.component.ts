import { DexcomDeviceRecord, DexcomStatisticsResDto, SampleDexcomDeObj } from './../../model/Dexcom.model';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { RpmService } from 'src/app/core/rpm.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { DexcomDevicesResObj } from 'src/app/model/Dexcom.model';
import { CalibrationRecord, CareGapsReadingsForRPMDto, DexcomCalibrationResponseDto, DexcomeEventRecord, DexcomEgvDataResultDto, DexcomEventResponseDto, EgvRecord } from 'src/app/model/rpm.model';
import moment from 'moment';
import { ChartOptions } from 'chart.js';
import Chart from 'chart.js';
import * as annotation from 'chartjs-plugin-annotation';
import { DaterangepickerComponent } from 'ng2-daterangepicker';
import { DexcomFilterDataService } from '../dexcom-filter-data.service';
@Component({
  selector: 'app-dexcom-dashboard',
  templateUrl: './dexcom-dashboard.component.html',
  styleUrls: ['./dexcom-dashboard.component.scss']
})
export class DexcomDashboardComponent implements OnInit, AfterViewInit {
  patientId: number;
  isLoadingCalibrations: boolean;
  startDate = '';
  endDate = '';
  isLoadingEvents: boolean;
  isLoadingEgvs: boolean;
  dexcomEgvDataResultDto = new DexcomEgvDataResultDto();
  dexcomEventsDataResultDto = new Array<DexcomeEventRecord>();
  dexcomEgvsList = new Array<EgvRecord>();
  dexcomCalibrationDataResultDto = new Array<CalibrationRecord>();
  isLoadingDevices: boolean;
  dexcomDevicesDataResultDto: DexcomDeviceRecord[] = [];
  dexcomStatisticsDataResultDto = new DexcomStatisticsResDto();
  public chartType = 'line';

  public perDayChartDataSet: Array<any> ;

  public perDayChartLabels: Array<any> ;
  public longRangeChartDataSet: Array<any> ;

  public longRangeChartLabels: Array<any> ;

  public longRangeChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(0, 137, 132, .2)',
      borderColor: 'rgba(0, 10, 130, .7)',
      borderWidth: 2,
    }
  ];
  public perDayChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105, 0, 132, .2)',
      borderColor: 'rgba(200, 99, 132, .7)',
      borderWidth: 2,
    },
  ];

  public longRangeChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        afterLabel: function(tooltipItem, data) {
          return 'mg/dl';
        }
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          // stepSize: 1,
          min: 0,
          // callback: (value, index, values) => {
          //   // if (index < carSizes.length) {
          //   //     return carSizes[carSizes.length - (1 + index)]; //this is to reverse the ordering
          //   // }
          //   if (index > 0) {
          //     return this.careGapsData[index - 1].code;
          //   }
          //   return value;
          // }
        }
      }],
      yAxes: [{
        ticks: {
          // stepSize: 10,
          min: 0,
          // max: this.patientsCount + 10,
        }
      }]
    },
    annotation: {
      // afterDatasetUpdate:
      drawTime: 'afterDatasetsDraw',
      annotations: [
        {
          drawTime: 'afterDraw',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 181,
          borderColor: '#000000',
          borderWidth: 2,
          label: {
            backgroundColor: 'red',
            content: `180 mg/dL`,
            enabled: true,
            position: 'center',
          }
        },
        {
          drawTime: 'afterDraw',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 70,
          borderColor: '#000000',
          borderWidth: 2,
          label: {
            backgroundColor: 'red',
            content: `70 mg/dL`,
            enabled: true,
            position: 'center',
          }
        }
      ]
    },
  };
  public perDayChartOptions: ChartOptions = {
    responsive: true,
    tooltips: {
      callbacks: {
        afterLabel: function(tooltipItem, data) {
          return 'mg/dl';
        }
      }
    },
    scales: {
      xAxes: [{
        ticks: {
          // stepSize: 1,
          min: 0,
          // callback: (value, index, values) => {
          //   // if (index < carSizes.length) {
          //   //     return carSizes[carSizes.length - (1 + index)]; //this is to reverse the ordering
          //   // }
          //   if (index > 0) {
          //     return this.careGapsData[index - 1].code;
          //   }
          //   return value;
          // }
        }
      }],
      yAxes: [{
        ticks: {
          // stepSize: 10,
          min: 0,
          // max: this.patientsCount + 10,
        }
      }]
    },
    annotation: {
      // afterDatasetUpdate:
      drawTime: 'afterDatasetsDraw',
      annotations: [
        {
          drawTime: 'afterDraw',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 181,
          borderColor: '#000000',
          borderWidth: 2,
          label: {
            backgroundColor: 'red',
            content: `180 mg/dL`,
            enabled: true,
            position: 'center',
          }
        },
        {
          drawTime: 'afterDraw',
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: 70,
          borderColor: '#000000',
          borderWidth: 2,
          label: {
            backgroundColor: 'red',
            content: `70 mg/dL`,
            enabled: true,
            position: 'center',
          }
        }
      ]
    },
  };
  isLoadingStats: boolean;
  alteredEvgData: {} = {};
  selectedPerDayFilterDate: string;
  noOfDays: number;
  @ViewChild(DaterangepickerComponent) private picker: DaterangepickerComponent;
  selectedDateRange: any;
  public options: any = {
    locale: { format: 'YYYY-MM-DD',
    cancelLabel: 'Clear',
    // displayFormat: 'DD-MM-YYYY'
  },
    alwaysShowCalendars: false,
  };
  daterange: any = {};
  filterType = '7Days';
  dexcomTableData: { date: string; ave: number; }[] = [];
  careGapsReadingsForRPMDto = new CareGapsReadingsForRPMDto();

  constructor(private securityService: SecurityService,
    private dexcomService: DexcomFilterDataService,
    private route: ActivatedRoute,
    private rpmService: RpmService,
    private toaster: ToastService) { }
  ngAfterViewInit(): void {
    this.updateDateRange();
  }

  ngOnInit() {
    Chart.pluginService.register(annotation);

  }
  InitDexcom(patientId: number) {
    this.patientId = patientId;
    // this.patientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    this.selecDateFilters(7);
    this.GetCareGapReadingsForRPM();
  }
  selecDateFilters(daysCount: number) {
    this.endDate = moment().format('YYYY-MM-DD');
    this.startDate = moment().subtract(daysCount, 'd').format('YYYY-MM-DD');
    this.loadDexcomData();
  }
  GetCareGapReadingsForRPM() {
    this.rpmService.GetCareGapReadingsForRPM(this.patientId).subscribe(
      (res: CareGapsReadingsForRPMDto ) => {
        var date = new Date('2021-04-01');
        if (res.bmi.lastReadingDate) {
          res.bmi.NoOfMonth = this.Noofmonths(res.bmi.lastReadingDate,date);
        }
        if (res.a1C.lastReadingDate) {
          res.a1C.NoOfMonth = this.Noofmonths(res.a1C.lastReadingDate,date);
        }
        if (res.dn.lastReadingDate) {
          res.dn.NoOfMonth = this.Noofmonths(res.dn.lastReadingDate,date);
        }
        if (res.ld.lastReadingDate) {
          res.ld.NoOfMonth = this.Noofmonths(res.ld.lastReadingDate,date);
        }
        if (res.de.lastReadingDate) {
          res.de.NoOfMonth = this.Noofmonths(res.de.lastReadingDate,date);
        }
        if (res.bmi.value) {
          res.bmi.valueInNumber = Number(res.bmi.value);
          // (Math.round(res.bmi.valueInNumber * 10) / 10).toFixed(1);
          // res.bmi.valueInNumber = Number(res.bmi.valueInNumber);
          res.bmi.valueInNumber = Math.round(res.bmi.valueInNumber);
          // res.bmi.valueInNumber = Number(res.bmi.valueInNumber);
        }
        if (res.a1C.value) {
          res.a1C.valueInNumber = Number(res.a1C.value);
          res.a1C.valueInNumber = Number((Math.round(res.a1C.valueInNumber * 10) / 10).toFixed(1));
          // res.a1C.valueInNumber = Number(res.a1C.valueInNumber);
        }
        if (res.dn.value) {
          res.dn.valueInNumber = Number(res.dn.value);
          // Math.round(res.dn.valueInNumber * 10) / 10;
          // res.dn.valueInNumber = Number(res.dn.valueInNumber);
          // Math.ceil(res.dn.valueInNumber);
          res.dn.valueInNumber = Math.round(res.dn.valueInNumber);
        }
        if (res.ld.value) {
          res.ld.valueInNumber = Number(res.ld.value);
          res.ld.valueInNumber = Math.round(res.ld.valueInNumber);
          // Math.round(res.ld.valueInNumber * 10) / 10;
          // res.ld.valueInNumber = Number(res.ld.valueInNumber);
          // Math.ceil(res.ld.valueInNumber);
        }
        this.careGapsReadingsForRPMDto = res;
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }

  Noofmonths(date1, date2) {
    var readingDate = new Date(Date.parse(date1));
    var Nomonths;
    Nomonths= (date2.getFullYear() - readingDate.getFullYear()) * 12;
    Nomonths-= readingDate.getMonth() + 1;
    Nomonths+= date2.getMonth() +1; // we should add + 1 to get correct month number
    return Nomonths <= 0 ? 0 : Nomonths;
}

  loadDexcomData() {
    // this.GetDexcomStatistics();
    this.GetEgvs();
    this.calculateFromToDays();
  }
  calculateFromToDays() {
    this.noOfDays = moment(this.endDate).diff(this.startDate, 'days') + 1;
  }
  GetCalibrations() {
    if (this.patientId) {
      this.isLoadingCalibrations = true;
      this.rpmService.GetCalibrationsV3(this.patientId, this.startDate, this.endDate).subscribe(
        (res: DexcomCalibrationResponseDto) => {
            this.isLoadingCalibrations = false;
            this.dexcomCalibrationDataResultDto = res.records;
            this.dexcomService._calculateMeandailyCalibrations(this.dexcomCalibrationDataResultDto);
            // this.dexcomCalibrationDataResultDto = [...this.dexcomCalibrationDataResultDto]
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
            this.isLoadingCalibrations = false;
          }
      );
    }
  }
  GetDexcomDevices() {
    if (this.patientId) {
      this.isLoadingDevices = true;
      this.rpmService.GetDexcomDevicesV3(this.patientId, this.startDate, this.endDate).subscribe(
        (res: DexcomDevicesResObj) => {
            if (res.records && res.records.length) {
              this.dexcomDevicesDataResultDto = res.records;
              this.dexcomDevicesDataResultDto.forEach(item => {
                if (item.alertSchedules && item.alertSchedules.length) {
                  item.alertSchedules[0].alertSettings.forEach(setting => {
                    const text = setting.alertName;
                    const result = text.replace( /([A-Z])/g, ' $1' );
                    setting.alertName = result.charAt(0).toUpperCase() + result.slice(1);
                  });
                }
              });
              const response = this.dexcomService._calculateAlertSettingsPercentage(this.dexcomDevicesDataResultDto[0]?.alertSchedules[0]?.alertSettings);
              console.log(response)
            }

            this.isLoadingDevices = false;
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
            this.isLoadingDevices = false;
          }
      );
    }
  }
  // GetDexcomStatistics() {
  //   if (this.patientId) {
  //     this.isLoadingStats = true;
  //     this.rpmService.GetDexcomStatistics(this.patientId, this.startDate, this.endDate, SampleDexcomDeObj.data).subscribe(
  //       (res: any) => {
  //           this.dexcomStatisticsDataResultDto = res;
  //           this.isLoadingStats = false;
  //         },
  //         (error: HttpResError) => {
  //           this.toaster.error(error.message, error.error);
  //           this.isLoadingStats = false;
  //         }
  //     );
  //   }
  // }
  GetEvents() {
    if (this.patientId) {
      this.isLoadingEvents = true;
      this.rpmService.GetEventsV3(this.patientId, this.startDate, this.endDate).subscribe(
        (res: DexcomEventResponseDto) => {
          this.isLoadingEvents = false;
          // this.eventsView.resize;
          this.dexcomEventsDataResultDto = res.records;
          // this.dexcomEventsDataResultDto = [...this.dexcomEventsDataResultDto]
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
          this.isLoadingEvents = false;
        }
      );
    }
  }
  GetEgvs() {
    if (this.patientId) {
      this.isLoadingEgvs = true;
      this.rpmService
        .GetEgvsV3(this.patientId, this.startDate, this.endDate).subscribe(
          (res: DexcomEgvDataResultDto) => {
            this.dexcomEgvDataResultDto = res;
            this.GetDexcomDevices();
            this.dexcomStatisticsDataResultDto = this.dexcomService.createDexcomStatisticsData(res)
            // console.log(response)
            this.dexcomEgvsList = res.records;
            const endResult = {};
            const notResult = [];
            let mCount = 0;
            for (let hourLoop = 0; hourLoop <= 23; hourLoop++) {
              for (let minLoop = 1; minLoop <= 4; minLoop++) {
                // const element = array[minLoop];
                const objResult = this.dexcomEgvsList.filter(x => moment(x.displayTime).hours() === hourLoop && moment(x.displayTime).minutes() < minLoop * 15
                && moment(x.displayTime).minutes() >= (minLoop * 15) - 15 );
                let hourDisplay = hourLoop === 0 ? ' 12' : hourLoop;
                const minutesDisplay = ((minLoop * 15) - 15) > 9 ? ((minLoop * 15) - 15) : `0${((minLoop * 15) - 15)}`;
                hourDisplay = hourDisplay < 9 ? `0${hourDisplay}` : hourDisplay;
                const objKey = `${hourDisplay}:${minutesDisplay}` === '23:45' ? '23:59' : `${hourDisplay}:${minutesDisplay}`;
                if (!endResult[objKey]) {
                  endResult[objKey] = [];
                }
                objResult.forEach(x => {
                  mCount++;
                  const cHours = moment(x.displayTime).hours();
                  const cMinutes = moment(x.displayTime).minutes();
                  const obj = {hour: hourLoop, time: `${moment(x.displayTime).hours()}:${moment(x.displayTime).minutes()}`, value: x.value, displayTime: x.displayTime};
                  if (cHours === hourLoop && cMinutes < minLoop * 15 && cMinutes >= (minLoop * 15) - 15 ) {
                    endResult[objKey].push(obj);
                    // notResult.push(obj);
                  } else {
                  }
                });
              }
            }
            this.longRangeChartLabels = [];
            const dArr = [];
            const resArr = [];
            // notResult.forEach(item => {
            //   this.longRangeChartLabels.push(item.time);
            //   dArr.push(item.value);
            // });
            console.log(mCount);
            Object.keys(endResult).forEach((key, index, objj) => {
              this.longRangeChartLabels.push(key);
              const tempArr = endResult[key];
              const average = tempArr.reduce((total, next) => total + next.value, 0) / tempArr.length;
              resArr.push(average.toFixed());
            });
            this.alteredEvgData = {};
            this.alteredEvgData = endResult;
            this.longRangeChartDataSet = [];
            this.longRangeChartDataSet.push({ data: resArr, label: 'Avg Data' });
            // { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' }
            // console.log(`t ${res.egvs.length}: kdsbfdbs: ${mCount}`);
            // console.log(endResult);
            this.fillDataForPerDayGraph(this.endDate);
            this.filterDataForReadingTable();
            this.isLoadingEgvs = false;
            // this.dexcomEgvsList = [...this.dexcomEgvsList]
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
            this.isLoadingEgvs = false;
          }
        );
    }
  }
  filterDataForReadingTable() {
    const tmp = {};
    this.dexcomTableData = [];
    this.dexcomEgvsList.forEach((item) => {
      // if property for current date already exists  we update existing otherwise start new one
      const cDate =  moment(item.displayTime).format('MMM DD YYYY');
      const obj =  tmp[cDate] = tmp[cDate] || {count: 0, total: 0};
      // increment count and total of all the ratings
      obj.count ++;
      obj.total += item.value;

    });

    const res = Object.entries(tmp).map(function(entry) {
        return { date: entry[0], ave: entry[1]['total'] / entry[1]['count']}
    });
    this.dexcomTableData = res;
  }
  fillDataForPerDayGraph(fDate: string) {
    this.selectedPerDayFilterDate = fDate;
    this.perDayChartLabels = [];
    this.perDayChartDataSet = [];
    const resArr = [];
    Object.keys(this.alteredEvgData).forEach((key, index, objj) => {
      let tempArr = this.alteredEvgData[key];
      tempArr = tempArr.filter(x => moment(x.displayTime).format('YYYY-MM-DD') === moment(fDate).format('YYYY-MM-DD'));
      let average = (tempArr.reduce((total, next) => total + next.value, 0) / tempArr.length);
      if (isNaN(average)) {
        average = 0;
      }
      this.perDayChartLabels.push(key);
      resArr.push(average.toFixed());
    });
    this.perDayChartDataSet.push({ data: resArr, label: 'Avg Data Per Day' });
  }
  changeCurrentfilterDate(fType: number) {
    let newDate: moment.Moment;
    if (fType === 1) {
      newDate = moment(this.selectedPerDayFilterDate).subtract(1, 'days');
    }
    if (fType === 2) {
      newDate = moment(this.selectedPerDayFilterDate).add(1, 'days');
    }
    const isBetween = moment(newDate).isBetween(moment(this.startDate).subtract(1, 'days'), moment(this.endDate).add(1, 'days'));
    if (!isBetween) {
      this.toaster.warning('Selected date is not valid');
      return;
    }
    this.selectedPerDayFilterDate = newDate.toString();
    this.fillDataForPerDayGraph(this.selectedPerDayFilterDate);
  }
  public updateDateRange() {
    this.picker.datePicker.setStartDate(this.startDate);
    this.picker.datePicker.setEndDate(this.endDate);
    this.picker.datePicker.updateView();
    this.picker.datePicker.updateFormInputs();
  }
  selectedDate(value: any, datepicker?: any) {
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.startDate = value.start.format('YYYY-MM-DD');
    this.endDate = value.end.format('YYYY-MM-DD');
    this.daterange.label = value.label;
    // this.filterPatients();
  }
  clearDate(value: any, datepicker?: any) {
    this.daterange = {};
    this.selectedDateRange = [];
    value.start = moment().format('YYYY-MM-DD');
    value.end = moment().format('YYYY-MM-DD');
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.startDate = moment().format('YYYY-MM-DD');
    this.endDate = moment().format('YYYY-MM-DD');
    // this.filterPatients();
  }

}
