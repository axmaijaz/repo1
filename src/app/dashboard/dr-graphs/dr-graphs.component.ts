import { CcmDataService } from './../../core/ccm-data.service';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { CcmDailyProgressParamsDto, ServiceSummaryData } from 'src/app/model/admin/ccm.model';
import { CareGapsGraphDto } from 'src/app/model/pcm/pcm.model';
import { SubSink } from 'src/app/SubSink';
import moment from 'moment';
import { CreateFacilityUserDto, FacilityDto } from 'src/app/model/Facility/facility.model';
import { AppDataService } from 'src/app/core/app-data.service';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-dr-graphs',
  templateUrl: './dr-graphs.component.html',
  styleUrls: ['./dr-graphs.component.scss']
})
export class DRGraphsComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  @Input() CareProvidersList1 = new Array<CreateFacilityUserDto>();
  @Input() facilitylistdata = new Array<FacilityDto>();
  @Input() isCareProviderDisable1 = new Array<FacilityDto>();
  ResponseDtoCCMServices = {
    totalMinutes: 0,
    totalPatients: 0,
    summaryData: new Array<ServiceSummaryData>()
  };
  daterange: any = {};
  selectedDateRange: any;
  public options: any = {
    locale: { format: 'MM-DD-YYYY',
    cancelLabel: 'Clear',
    // displayFormat: 'DD-MM-YYYY'
  },
    alwaysShowCalendars: false,
  };

  public careGapsChartsData2: Array<{
    data: Array<number>;
    label: string;
  }> = [];
  public careGapsChartsLabels2: Array<string> = [];
  public careGapschartColorss: Array<any> = [
    {
      backgroundColor: this.appDataService.graphsColors,
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5'],
      borderWidth: 2
    }
  ];
  ccmDailyProgressParamsDto = new CcmDailyProgressParamsDto();
  careGapsData = new Array<{date: string; minutesCount: number; patientsCount: number; }>();

  public bubbleChartData: ChartDataSets[] = [];
  public bubbleChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        ticks: {
          stepSize: 1,
          // min: 0,

          // callback: (value, index, values) => {
          //   // if (index < carSizes.length) {
          //   //     return carSizes[carSizes.length - (1 + index)]; //this is to reverse the ordering
          //   // }
          //   if (index > 0) {
          //     return this.careGapsData[index - 1].code;
          //   }
          //   return value;
          // }
        },
        type: 'time',
                time: {
                  unit: 'day'
                    // displayFormats: {
                    //     quarter: 'day'
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
    tooltips: {
      callbacks: {
        label: (t, d) =>  {
          return 'Minutes: ' + this.careGapsData[t.index].minutesCount + ` Patients: ` + this.careGapsData[t.index].patientsCount + ' Date: ' + moment(this.careGapsData[t.index].date).format('MMM DD YYYY');
        }
      }
    }
  };

  public careGapschartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom'
      // labels: {
      //   padding: 20,
      //   boxWidth: 10
      // }
    }
  };

  public bubbleChartLegend = true;
  facilityId = 0;
  facilityUserId = 0;
  pcmGraphisLoading: boolean;
  isLoading: boolean;
  maxPatients: number;
  tepArrayofPCount: any;

  public chartClicked(e: any): void {}
  public chartHovered(e: any): void {}
  public SummaryBarChartDataSets: Array<{
    data: Array<number>;
    label: string;
  }> = [];
  // tslint:disable-next-line: member-ordering
  public SummaryBarChartLabels: Array<string> = [];
  public linechartColors: Array<any> = [
    {
      backgroundColor: 'rgba(78, 176, 72, .3)',
      borderColor: 'rgba(78, 176, 72, .5)',
      borderWidth: 2
    },
    {
      backgroundColor: 'rgba(13, 71, 161, .3)',
      borderColor: 'rgba(13, 71, 161, .5)',
      borderWidth: 2
    }
  ];
  public chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'bottom'
      // labels: {
      //   padding: 20,
      //   boxWidth: 10
      // }
    }
  };
  // html = ;
  constructor(public securityService: SecurityService, private appDataService: AppDataService, private ccmDataService: CcmDataService,
     private toaster: ToastService) { }

  ngOnInit() {
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityUserId = this.securityService.securityObject.id;
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    } else {
      this.facilityUserId = 0;
      this.facilityId = 0;
    }
    this.ccmDailyProgressParamsDto.facilityId = this.facilityId;
    this.ccmDailyProgressParamsDto.facilityUserId = this.facilityUserId;
    this.ccmDailyProgressParamsDto.startDate = moment().format('YYYY-MM-DD');
    this.ccmDailyProgressParamsDto.endDate = moment().format('YYYY-MM-DD');
    this.getCareGapsChartData();
    var abc = document.getElementById('sample');
    console.log(abc);
    // this.stripHtml(abc);
    // console.log('strip text', this.stripHtml(abc));
    // // var html = "<p>Hello, <b>World</b>";
    // let div: any = document.createElement("div");
    // div.innerHTML = abc;
    // alert(div.innerText);
    console.log('strip text',jQuery(abc).text());
    this.GetCcmPatientsCompletedProgress();
      // textArea.remove();
      // this.toaster.success('Content Copied');
  }
  selectedDate(value: any, datepicker?: any) {
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.ccmDailyProgressParamsDto.startDate = value.start.format('YYYY-MM-DD');
    this.ccmDailyProgressParamsDto.endDate = value.end.format('YYYY-MM-DD');
    this.daterange.label = value.label;
    this.GetCcmPatientsCompletedProgress();
    this.getCareGapsChartData();
    // this.filterPatients();
  }
  clearDate(value: any, datepicker?: any) {
    this.daterange = {};
    this.selectedDateRange = [];
    value.start = moment().format('YYYY-MM-DD');
    value.end = moment().format('YYYY-MM-DD');
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.ccmDailyProgressParamsDto.startDate = moment().format('YYYY-MM-DD');
    this.ccmDailyProgressParamsDto.endDate = moment().format('YYYY-MM-DD');
    this.GetCcmPatientsCompletedProgress();
    this.getCareGapsChartData();
    // this.filterPatients();
  }
  GetCcmPatientsCompletedProgress() {
    this.isLoading = true;
    const fPDto = new CcmDailyProgressParamsDto();
    for (const filterProp in this.ccmDailyProgressParamsDto) {
      if (
        this.ccmDailyProgressParamsDto[filterProp] === null ||
        this.ccmDailyProgressParamsDto[filterProp] === undefined
      ) {
        this.ccmDailyProgressParamsDto[filterProp] = fPDto[filterProp];
      }
    }
    this.subs.sink = this.ccmDataService
      .GetCcmPatientsCompletedProgress(this.ccmDailyProgressParamsDto)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.ResponseDtoCCMServices = res;
          const MintsArr = new Array<number>();
          const PatientssArr = new Array<number>();
          const tempLabels = new Array<string>();
          const dateArr = new Array<string>();
          this.ResponseDtoCCMServices.summaryData.forEach(
            (element: ServiceSummaryData, index: number) => {
              tempLabels.push((index + 1).toString());
              MintsArr.push(element.minutesCount);
              PatientssArr.push(element.patientsCount);
              dateArr.push(moment(element.date).format('MMM DD'));
            }
          );

          const tempArr = new Array<any>();
          tempArr.push({ data: MintsArr, label: 'Minutes' });
          tempArr.push({ data: PatientssArr, label: 'Patients' });
          this.SummaryBarChartLabels = dateArr;
          this.SummaryBarChartDataSets = tempArr;
        },
        err => {
          this.isLoading = false;
        }
      );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  bubbleGraphOptions() {
    var opt: ChartOptions;
    // this.bubbleChartOptions = opt;
    opt = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        // xAxes: [{
        //         ticks: {
        //           min: 0,
        //           // max: 5,
        //           // callback: value => this.times[value]
        //         }
        //       }],
        //       yAxes: [{ ticks: { min: 0,
        //         // max: 30,
        //       } }],

        xAxes: [{
          ticks: {
            stepSize: 1,

          },
          type: 'time',
                time: {
                    // displayFormats: {
                    //     quarter: 'day'
                    // }
                    unit: 'day'

                }
      }],
        yAxes: [{
          ticks: {
            min: 0,
            max: this.maxPatients + 2,
          }
        }]
      },
      tooltips: {
        callbacks: {
          label: (t, d) =>  {
            return 'Minutes: ' + this.careGapsData[t.index].minutesCount + ` Patients: ` + this.careGapsData[t.index].patientsCount + ' Date: ' + moment(this.careGapsData[t.index].date).format('MMM DD YYYY') ;
          }
        }
      }
    };
    // console.log('option', opt);
   this.bubbleChartOptions = opt;
  }

  getCareGapsChartData() {
    this.pcmGraphisLoading = true;
    // this.patientsCount = 0;
    var opt: ChartOptions;
    this.bubbleChartOptions = opt;
    this.bubbleChartData = [];
    this.tepArrayofPCount = [];

    this.careGapsData = new Array<{date: string; minutesCount: number; patientsCount: number; }>();
    // this.ccmDailyProgressParamsDto.facilityId = this.facilityId;
    const fPDto = new CcmDailyProgressParamsDto();
    for (const filterProp in this.ccmDailyProgressParamsDto) {
      if (
        this.ccmDailyProgressParamsDto[filterProp] === null ||
        this.ccmDailyProgressParamsDto[filterProp] === undefined
      ) {
        this.ccmDailyProgressParamsDto[filterProp] = fPDto[filterProp];
      }
    }
    // this.ccmDailyProgressParamsDto.facilityUserId = 0;
    this.subs.sink = this.ccmDataService
      .GetCcmPatientsContactedProgress(this.ccmDailyProgressParamsDto)
      .subscribe(
        (res: any) => {
          // this.patientsCount = res.patientsCount;
          res.summaryData.forEach(( element: any) => {
            this.careGapsData.push({
              date: element.date,
              patientsCount: element.patientsCount,
              minutesCount: element.minutesCount
              // code: element.date,
              // count: element.count,
              // name: element.name
            });
            this.tepArrayofPCount.push(element.patientsCount);
            this.maxPatients = Math.max(...this.tepArrayofPCount);
          });
          const tempLabels = new Array<string>();
          this.careGapsData.forEach(element => {
            tempLabels.push(element.date);
          });
          const tempLabelsName = new Array<number>();
          this.careGapsData.forEach(element => {
            tempLabelsName.push(element.minutesCount);
          });
          const tempData = new Array<number>();
          this.careGapsData.forEach(element => {
            tempData.push(+element.patientsCount);
          });
          this.careGapsChartsLabels2 = tempLabels;
          const tempArr = new Array<any>();
          tempArr.push({
            data: tempData,
            label: 'Daily Reporting Data'
          });
          const tempArrForBar = new Array<any>();
          tempArrForBar.push({
            data: tempData,
            label: 'Count'
          });
          this.careGapsChartsData2 = tempArr;
          // this.careGapsBarChartLabels = tempLabels;
          // this.careGapsBarChartDataSets = tempArrForBar;
          const dArr = [];
          var tempGapsMinutes =  this.careGapsData.map(x => x.minutesCount);
          const sum = tempGapsMinutes.reduce((a, b) => a + b, 0);
          let avg = (sum / tempGapsMinutes.length) || 0;
          avg = avg/5;
          this.careGapsData.forEach((item, index) => {
            // if (item.minutesCount <= 50) {
            //   var tempMinutesCount = 5;
            // }
            // else if (item.minutesCount <= 100) {
            //   tempMinutesCount = 10;
            // } else if (item.minutesCount <= 150) {
            //   tempMinutesCount = 15;
            // }

            const tempObj = {
              x: moment(item.date).format('MMM DD YYYY'),
              y: item.patientsCount,
              r: item.minutesCount/avg,
            };
            dArr.push(tempObj);

          });
          const dataSet = {
            data: dArr,
            label: 'Daily Report',
          };
          this.bubbleChartData.push(dataSet);

          this.bubbleGraphOptions();
          this.pcmGraphisLoading = false;
         },
        err => {
          this.pcmGraphisLoading = false;
        }
      );
  }

   stripHtml(html)
{
   let tmp = document.createElement('DIV');
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || '';
}
}
