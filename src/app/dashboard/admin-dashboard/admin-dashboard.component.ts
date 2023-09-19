import { options } from '../../user-info/uesr-info.module';
import { BhiService } from '../../core/bhi.service';
import { element } from 'protractor';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import {
  CCMServiceSummaryDto,
  ServiceSummaryData,
  MinutesCCMServiceParam
} from 'src/app/model/admin/ccm.model';
import { UserType } from 'src/app/Enums/UserType.enum';
import { SecurityService } from 'src/app/core/security/security.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import {
  CreateFacilityUserDto,
  FacilityDto
} from 'src/app/model/Facility/facility.model';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService } from 'ng-uikit-pro-standard';
import { BillingService } from 'src/app/core/billing.service';
import { AppDataService } from 'src/app/core/app-data.service';
import { DailyProgreeForDashboardDto, DailyReportSummaryDto } from 'src/app/model/daily-Report/daily_report.model';
import { DailyReportingService } from 'src/app/core/DailyReporting/daily-reporting.service';
import { SubSink } from 'src/app/SubSink';
import { CareGapsGraphDto, GapStatus } from 'src/app/model/pcm/pcm.model';
import { BhiStatusEnum } from 'src/app/Enums/bhi.enum';
import { BhiDashboardFilter } from 'src/app/model/Bhi/bhi.model';
import { ChartDataSets, ChartOptions } from 'chart.js';
import Chart from 'chart.js';
import * as annotation from 'chartjs-plugin-annotation';
import { CareGapDto, InsurancePlanDto } from 'src/app/model/pcm/payers.model';
import { InsuranceService } from 'src/app/core/insurance.service';
import * as FileSaver from 'file-saver';
import moment from 'moment';
import { RpmEndOfDayReportComponent } from '../rpm-end-of-day-report/rpm-end-of-day-report.component';
import { CcmEndOfDayReportComponent } from '../ccm-end-of-day-report/ccm-end-of-day-report.component';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('careGapsChart') careGapsChart: ElementRef;
  selectedFacilityIds = [0];
  dateProp: string;
  currentDate = moment().subtract(1, "day").format("YYYY-MM-DD");
  public assignedDatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD",
    max: this.currentDate,
    min: "2022-08-01",
    appendTo: "body",
    closeOnSelect: true,
    drops: "down",
  };



  private subs = new SubSink();
  isLoading = true;
  dRLoading = true;
  isLoadingMinutes = true;
  gapStatusList = [];
  dashBoardFilterDto = new CCMServiceSummaryDto();
  facilityList = new Array<FacilityDto>();
  dateNow = new Date();
  currentYear: string;
  listOfYears = [];
  CPLoader = false;
  careGapGraphSummary = new CareGapsGraphDto();
  bhiFiltersDto = new BhiDashboardFilter();
  // dailyReportingSummary = new DailyReportSummaryDto();
  // dailyReportYear: number;
  // dailyReportFacilityId = 0;
  // dailyReportingMonth = 0;
  // dailyReportingCareProviderId = 0;
  CareProvidersList = new Array<CreateFacilityUserDto>();
  currentmonth: string;
  // bhiStatusList = new Array<any>();
  careFacilitatorsList = [];
  bIllingProviderList = [];
  // minutesCCMServiceParam = new MinutesCCMServiceParam();
  minuesCompletedData = new Array<{ key: string; Value: string }>();
  dailyReportCompletedData = new Array<{ key: string; Value: string }>();
  careGapsData = new Array<{code: string; count: number; name: string; }>();

  facilityId: number;
  isLoadingPayersList: boolean;
  allCareGaps: CareGapDto[];
  patientsCount = 0;
  facilityUserList = new Array<CreateFacilityUserDto>();
  ResponseDtoCCMServices = {
    totalMinutes: 0,
    totalPatients: 0,
    summaryData: new Array<ServiceSummaryData>()
  };
  isLoadingAuditData: boolean;
  pcmGraphisLoading: boolean;
  public bubbleChartData: ChartDataSets[] = [];
  public bubbleChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        ticks: {
          stepSize: 1,
          min: 0,
          callback: (value, index, values) => {
            // if (index < carSizes.length) {
            //     return carSizes[carSizes.length - (1 + index)]; //this is to reverse the ordering
            // }
            if (index > 0) {
              return this.careGapsData[index - 1].code;
            }
            return value;
          }
        }
      }],
      yAxes: [{
        ticks: {
          // stepSize: 10,
          min: 0,
          max: this.patientsCount + 10,
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
          value: this.patientsCount,
          borderColor: '#000000',
          borderWidth: 2,
          label: {
            backgroundColor: 'red',
            content: `Total Patients ${this.patientsCount}`,
            enabled: true,
            position: 'center',
          }
        }
      ]
    },
    tooltips: {
      callbacks: {
        label: (t, d) =>  {
          return this.careGapsData[t.index].name + ` ( Count: ${t.yLabel} )`;
        }
      }
    }
  };
  facilityUserId: number;
  isCareprovider: boolean;
  isFacilitator: boolean;
  isBillingProvider: boolean;
  isfacilitaorDisable: boolean;
  isCareProviderDisable: boolean;
  isBillingProviderDisable: boolean;
  facilityName: string;
  progresBarForDashboardDto = new DailyProgreeForDashboardDto();
  progressBarData = {
    target: 0 ,
    assigned: 0,
    percentage: 0
  }
  @ViewChild('RPMEndOfDayCMPRef') RPMEndOfDayCMPRef: RpmEndOfDayReportComponent;
  @ViewChild('CCMEndOfDayCMPRef') CCMEndOfDayCMPRef: CcmEndOfDayReportComponent;
  constructor(
    private cCMDataService: CcmDataService,
    public securityService: SecurityService,
    private facilityService: FacilityService,
    private billingService: BillingService,
    private bhiService: BhiService,
    private toaster: ToastService,
    private insuranceService: InsuranceService,
    private appDataService: AppDataService,
    private pcmService: PcmService,
    private dailyReportingService: DailyReportingService
  ) {
  }

  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(219, 0, 0, 0.1)',
        'rgba(0, 165, 2, 0.1)',
        'rgba(255, 195, 15, 0.2)',
        'rgba(55, 59, 66, 0.1)',
        'rgba(0, 0, 0, 0.3)'
      ],
      hoverBackgroundColor: [
        'rgba(219, 0, 0, 0.2)',
        'rgba(0, 165, 2, 0.2)',
        'rgba(255, 195, 15, 0.3)',
        'rgba(55, 59, 66, 0.1)',
        'rgba(0, 0, 0, 0.4)'
      ],
      borderWidth: 2
    }
  ];
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

  public doughnut = 'doughnut';

  public doughnutchartDatasets: Array<any> = [
    { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
  ];
  public minutesCompleteDoughnetChartsData: Array<{
    data: Array<number>;
    label: string;
  }> = [];
  public minutesCompleteDoughnetChartsLabels: Array<string> = [];

  public SummaryBarChartDataSets: Array<{
    data: Array<number>;
    label: string;
  }> = [];
  public monthPickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr
  };
  public SummaryBarChartLabels: Array<string> = [];

  // public linechartColors: Array<any> = [
  //   {
  //     backgroundColor: 'rgba(78, 176, 72, .3)',
  //     borderColor: 'rgba(78, 176, 72, .5)',
  //     borderWidth: 2
  //   },
  //   {
  //     backgroundColor: 'rgba(13, 71, 161, .3)',
  //     borderColor: 'rgba(13, 71, 161, .5)',
  //     borderWidth: 2
  //   }
  // ];

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

  public careGapChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      position: 'right'
      // labels: {
      //   padding: 20,
      //   boxWidth: 10
      // }
    }
  };
  public careGapsBarChartDataSets: Array<{
    data: Array<number>;
    label: string;
  }> = [];
  public careGapsBarChartLabels: Array<string> = [];
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

  public doughnut2 = 'doughnut';

  public doughnutchartDatasets2: Array<any> = [
    { data: [300, 50, 100, 40], label: 'My First dataset' }
  ];
  public dailyReportingDoughnetChartsData2: Array<{
    data: Array<number>;
    label: string;
  }> = [];
  public dailyReportingDoughnetChartsLabels2: Array<string> = [];
  public chartColorss: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5'],
      borderWidth: 2
    }
  ];
  public doughnut3 = 'doughnut';

  public doughnutchartDatasets3: Array<any> = [
    { data: [300, 50, 100, 40], label: 'My First dataset' }
  ];
  public careGapsChartsData2: Array<{
    data: Array<number>;
    label: string;
  }> = [];
  public careGapsChartsLabels2: Array<string> = [];
  public careGapschartColorss: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#008000', '#808080', '#800000', '#FFFF00'
      , '#808000', '#00FF00', '#00FFFF', '#008080', '#0000FF', '#273746', '#FF00FF', '#800080', '#CD5C5C'
      , '#F08080', '#FA8072', '#E9967A', '#FFA07A', '#FCF3CF', '#F4D03F', '#8E44AD', '#C0392B'
      , '#F39C12', '#BA4A00', '#58D68D'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5'],
      borderWidth: 2
    }
  ];

  public chartClicked(e: any): void {}
  public chartHovered(e: any): void {}

  ngOnInit() {
    this.dateProp = this.currentDate;
    this.updateChartAndTable()
    Chart.pluginService.register(annotation);

    this.listOfYears = this.appDataService.listOfYears;

    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityUserId = this.securityService.securityObject.id;
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
      this.facilityName = this.securityService.getClaim('FacilityName').claimValue;
      this.dashBoardFilterDto.facilityId = this.facilityId;
      this.GetCareProvidersByFacilityId();
      this.getFacilityUsersList();
      this.dashBoardFilterDto.careProviderId = this.securityService.securityObject.id;
      this.getFacilityUserByFacilityUserId();

    } else {
      this.facilityUserId = 0;
      this.facilityId = 0;
      this.facilityName = '';
      this.dashBoardFilterDto.facilityId = this.facilityId;
    }
    if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      this.isCareprovider = true;
      this.isFacilitator = true;
      this.isBillingProvider = true;
      this.isfacilitaorDisable = false;
      this.isCareProviderDisable = false;
      this.isBillingProviderDisable = false;
      this.getCareGapsChartData();

    }
    if (this.securityService.securityObject.userType === UserType.CareProvider) {
      this.dashBoardFilterDto.careProviderId = this.securityService.securityObject.id;
    }
    this.dashBoardFilterDto.year = this.dateNow.getFullYear();
    this.dashBoardFilterDto.month = this.dateNow.getMonth() + 1;
    this.GetAllCareGaps();
    this.getCCMServiceSummary();
    this.getMinutesCompletedSummary();
    this.getDailyReportSummary();
    this.getFacilityList();
    this.getMonthlyProgressForProgressBar();
    // this.getCareGapsChartData();
    this.getCareFacilitatorsList();
    this.getbillingProvidersList();
    this.getGapStatusList();
  }
  getdataOnFilter() {
    if (this.dashBoardFilterDto.facilityId == null) {
      this.dashBoardFilterDto.facilityId = 0;
    }
    this.getCCMServiceSummary();
    this.GetCareProvidersByFacilityId();
    this.getMinutesCompletedSummary();
    this.getDailyReportSummary();
    this.getCareGapsChartData()
  }

  getFacilityUserByFacilityUserId() {
    this.isLoading = false;
    this.facilityService.getFacilityUserById(this.facilityUserId).subscribe(
      (res: any) => {
        this.isLoading = true;
        if (res.roles) {
         const rolesList = res.roles.split(',');
         rolesList.forEach(x=> {
           if ( x == 'Care Facilitator' ) {
              this.isFacilitator = true;
              this.isfacilitaorDisable = true;
              this.careGapGraphSummary.careFacilitatorId = this.securityService.securityObject.id;
           }
           if (x == 'Care Provider') {
            this.isCareprovider = true;
            this.isCareProviderDisable = true;
            this.progresBarForDashboardDto.role  = 'Care Provider';
            this.careGapGraphSummary.careProviderId = this.securityService.securityObject.id;
           }
           if (x == 'Billing Provider') {
            this.isBillingProvider = true;
            this.isBillingProviderDisable = true;
            this.careGapGraphSummary.billingProviderId = this.securityService.securityObject.id;
           }
          });

        }
        this.getCareGapsChartData();
      },
      (error) => {
        this.isLoading = true;
        this.toaster.error(error.error);
      }
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  getMonthlyProgressForProgressBar() {
    this.progresBarForDashboardDto.facilityId = this.dashBoardFilterDto.facilityId;
    this.progresBarForDashboardDto.facilityUserId = this.dashBoardFilterDto.careProviderId;
    // this.isLoadingPayersList = true;
    this.dailyReportingService.GetMonthlyProgressForProgressBar(this.progresBarForDashboardDto).subscribe(
      (res: any) => {
        if (res?.target) {
          this.progressBarData.assigned = res.assigned;
          this.progressBarData.target = res.target;
          this.progressBarData.percentage = Math.round((this.progressBarData.assigned / this.progressBarData.target) * 100);
        } else {
          this.progressBarData.percentage = 0;
        }
      },
      (error: HttpResError) => {
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetAllCareGaps() {
    this.isLoadingPayersList = true;
    this.insuranceService.GetAllCareGaps().subscribe(
      (res: CareGapDto[]) => {
        this.allCareGaps = res;
        this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getFacilityList() {
    this.subs.sink = this.facilityService.getFacilityList().subscribe(
      (res: any) => {
        this.facilityList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getCCMServiceSummary() {
    this.isLoading = true;
    this.subs.sink = this.cCMDataService
      .getCCMServiceSummary(this.dashBoardFilterDto)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.ResponseDtoCCMServices = res;
          const MintsArr = new Array<number>();
          const PatientssArr = new Array<number>();
          const tempLabels = new Array<string>();
          this.ResponseDtoCCMServices.summaryData.forEach(
            (element: ServiceSummaryData, index: number) => {
              tempLabels.push((index + 1).toString());
              MintsArr.push(element.minutesCount);
              PatientssArr.push(element.patientsCount);
            }
          );

          const tempArr = new Array<any>();
          tempArr.push({ data: MintsArr, label: 'Minutes' });
          tempArr.push({ data: PatientssArr, label: 'Patients' });
          this.SummaryBarChartLabels = tempLabels;
          this.SummaryBarChartDataSets = tempArr;
        },
        err => {
          this.isLoading = false;
        }
      );
  }
  getAllGraphsData() {
    if (this.dashBoardFilterDto.year == null) {this.dashBoardFilterDto.year = this.dateNow.getFullYear()}
    if (this.dashBoardFilterDto.month == null) {this.dashBoardFilterDto.month = this.dateNow.getMonth() + 1}
    if (this.dashBoardFilterDto.careProviderId == null) {this.dashBoardFilterDto.careProviderId = 0}
    this.getDailyReportSummary();
    this.getCCMServiceSummary();
    this.getMinutesCompletedSummary();
  }
  getCareFacilitatorsList() {
    let roleName =  'Care Facilitator';
    //  this.isLoadingPayersList = true;
     this.bhiService.GetFacilityUsers(this.facilityId, roleName).subscribe(
       (res: []) => {
         this.careFacilitatorsList = res;
        //  this.isLoadingPayersList = false;
       },
       (error: HttpResError) => {
        //  this.isLoadingPayersList = false;
         this.toaster.error(error.error, error.message);
       }
     );
   }
   getbillingProvidersList() {
    let roleName =  'Billing Provider';
    //  this.isLoadingPayersList = true;
     this.bhiService.GetFacilityUsers(this.facilityId, roleName).subscribe(
       (res: []) => {
         this.bIllingProviderList = res;
        //  this.isLoadingPayersList = false;
       },
       (error: HttpResError) => {
        //  this.isLoadingPayersList = false;
         this.toaster.error(error.error, error.message);
       }
     );
   }

  getFacilityUsersList() {
    if (!this.dashBoardFilterDto.facilityId) {
      // this.toaster.warning('Please Select Facility');
      return;
    }
    this.isLoading = true;
    this.subs.sink = this.facilityService
      .getFacilityUserList(this.dashBoardFilterDto.facilityId)
      .subscribe(
        (res: any) => {
          this.facilityUserList = res;
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
        }
      );
  }
  // Patient Record
  getMinutesCompletedSummary() {
    if (!this.dashBoardFilterDto.facilityId) {
      // this.toaster.warning('Please Select Facility');
      return;
    }
    this.isLoading = true;
    this.minuesCompletedData = new Array<{ key: string; Value: string }>();
    this.subs.sink = this.cCMDataService
      .getMinutesSummary(this.dashBoardFilterDto)
      .subscribe(
        (res: any) => {
          Object.keys(res).forEach((value, index, obj) => {
            this.minuesCompletedData.push({
              key: value,
              Value: res[value]
            });
          });
          const tempLabels = new Array<string>();
          this.minuesCompletedData.forEach(element => {
            tempLabels.push(element.key);
          });
          const tempData = new Array<number>();
          this.minuesCompletedData.forEach(element => {
            tempData.push(+element.Value);
          });
          this.minutesCompleteDoughnetChartsLabels = tempLabels;
          const tempArr = new Array<any>();
          tempArr.push({
            data: tempData,
            label: 'Patients Data'
          });
          this.minutesCompleteDoughnetChartsData = tempArr;
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
        }
      );
  }
  getAuditData() {
    this.isLoadingAuditData = true;
    this.subs.sink = this.billingService
      .DownloadEncountersAuditDataByFacility(
        this.dashBoardFilterDto.month,
        this.dashBoardFilterDto.year, this.facilityId
      )
      .subscribe(
        (res: any) => {
          this.isLoadingAuditData = false;
          const fName = this.facilityName ? this.facilityName.split(' ')[0] : '';
          FileSaver.saveAs(new Blob([res] , { type: 'application/csv' } ), `${fName} AuditData.csv`);
          // const newWindow = window.open();
          // const blob = new Blob([res], {
          //   type: 'application/csv'
          // });
          // const url = window.URL.createObjectURL(res);
          // // window.open(url);
          // newWindow.location.href = url;
        },
        (error: HttpResError) => {
          this.isLoadingAuditData = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  GetCareProvidersByFacilityId() {
    this.CPLoader = true;
    this.dashBoardFilterDto.careProviderId = 0;
    this.subs.sink = this.facilityService
      .GetCareProvidersByFacilityId(this.dashBoardFilterDto.facilityId)
      .subscribe(
        (res: any) => {
          this.CPLoader = false;
          this.CareProvidersList = res;
        },
        err => {
          this.CPLoader = false;
        }
      );
  }
  // daily reporting data
  getDailyReportSummary() {
    if (!this.dashBoardFilterDto.facilityId) {
      return;
    }
    this.isLoading = true;
    this.dailyReportCompletedData = new Array<{
      key: string;
      Value: string;
    }>();
    this.subs.sink = this.dailyReportingService
      .getDailyReportSummary(this.dashBoardFilterDto)
      .subscribe(
        (res: any) => {
          Object.keys(res).forEach((value, index, obj) => {
            this.dailyReportCompletedData.push({
              key: value,
              Value: res[value]
            });
          });
          const tempLabels = new Array<string>();
          this.dailyReportCompletedData.forEach(element => {
            tempLabels.push(element.key);
          });
          const tempData = new Array<number>();
          this.dailyReportCompletedData.forEach(element => {
            tempData.push(+element.Value);
          });
          this.dailyReportingDoughnetChartsLabels2 = tempLabels;
          const tempArr = new Array<any>();
          tempArr.push({
            data: tempData,
            label: 'Daily Reporting Data'
          });
          this.dailyReportingDoughnetChartsData2 = tempArr;
          this.isLoading = false;
          // console.log(this.dailyReportingDoughnetChartsData2);
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }

  getGapStatusList() {
    const keys = Object.keys(GapStatus).filter(
      (k) => typeof GapStatus[k as any] === 'number'
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: GapStatus[key as any],
      word: key,
    })); // [0, 1]
    this.gapStatusList = values;
    return values;
  }

  bubbleGraphOptions() {
    var opt: ChartOptions;
    // this.bubbleChartOptions = opt;
    opt = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          ticks: {
            stepSize: 1,
            min: 0,
            callback: (value, index, values) => {
              // if (index < carSizes.length) {
              //     return carSizes[carSizes.length - (1 + index)]; //this is to reverse the ordering
              // }
              if (index > 0 && this.careGapsData[index - 1]) {
                return this.careGapsData[index - 1].code;
              }
              return value;
            }
          }
        }],
        yAxes: [{
          ticks: {
            // stepSize: 10,
            min: 0,
            max: this.patientsCount + 10,
          }
        }]
      },

      annotation: {
        annotations: [
          {
            drawTime: 'afterDatasetsDraw',
            type: 'line',
            mode: 'horizontal',
            scaleID: 'y-axis-0',
            value: this.patientsCount,
            borderColor: '#000000',
            borderWidth: 2,
            label: {
              backgroundColor: 'red',
              content: `Total Patients ${this.patientsCount}`,
              enabled: true,
              position: 'center',
            }
          }
        ]
      },
      tooltips: {
        callbacks: {
          label: (t, d) =>  {
            return this.careGapsData[t.index].name + ` ( Count: ${t.yLabel} )`;
          }
        }
      }
    };
    // console.log('option', opt);
   this.bubbleChartOptions = opt;
  }

  getCareGapsChartData() {
    this.pcmGraphisLoading = true;
    this.patientsCount = 0;
    var opt: ChartOptions;
    this.bubbleChartOptions = opt;
    this.bubbleChartData = [];

    this.careGapsData = new Array<{code: string; count: number; name: string; }>();
    // this.careGapGraphSummary.careProviderId = this.dashBoardFilterDto.careProviderId;
    // this.careGapGraphSummary.facilityId = this.facilityId;
    this.careGapGraphSummary.facilityId = this.dashBoardFilterDto.facilityId;
    if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      this.careGapGraphSummary.facilityId = this.dashBoardFilterDto.facilityId;
    }
    const fPDto = new CareGapsGraphDto();
    for (const filterProp in this.careGapGraphSummary) {
      if (
        this.careGapGraphSummary[filterProp] === null ||
        this.careGapGraphSummary[filterProp] === undefined
      ) {
        this.careGapGraphSummary[filterProp] = fPDto[filterProp];
        // this.careGapGraphSummary[filterProp] = 0;
      }
    }
    this.subs.sink = this.pcmService
      .GetCareGapsChartData(this.careGapGraphSummary)
      .subscribe(
        (res: any) => {
          this.patientsCount = res.patientsCount;
          res.data.forEach(( element: any) => {
            this.careGapsData.push({
              code: element.code,
              count: element.count,
              name: element.name
            });
          });
          const tempLabels = new Array<string>();
          this.careGapsData.forEach(element => {
            tempLabels.push(element.code);
          });
          const tempLabelsName = new Array<string>();
          this.careGapsData.forEach(element => {
            tempLabelsName.push(element.name);
          });
          const tempData = new Array<number>();
          this.careGapsData.forEach(element => {
            tempData.push(+element.count);
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
          this.careGapsBarChartLabels = tempLabels;
          this.careGapsBarChartDataSets = tempArrForBar;
          const dArr = [];
          this.careGapsData.forEach((item, index) => {
            const tempObj = {
              x: index + 1,
              y: item.count,
              r: 10
            };
            dArr.push(tempObj);
          });
          const dataSet = {
            data: dArr,
            label: 'Care Gaps Data',
          };
          this.bubbleChartData.push(dataSet);
          this.pcmGraphisLoading = false;

          // this.careGapsChart.options.events
          // Chart.pluginService.register(annotation);
          this.bubbleGraphOptions();
          // this.bubbleChartOptions.annotation.annotations.push(this.bubbleChartOptions.annotation.annotations[0]);

          // this.
          // this.careGapsChart.nativeElement.refresh();
          // this.bubbleChartOptions.annotation.drawTime = 'afterDatasetsDraw';
          // console.log(this.dailyReportingDoughnetChartsData2);
        },
        err => {
          this.pcmGraphisLoading = false;
        }
      );
  }
  filterChanges(currentValue) {
    if (currentValue == 0) {
      this.selectedFacilityIds = [0];
      this.updateChartAndTable();
    }
    if (!this.selectedFacilityIds || !this.selectedFacilityIds.length) {
      this.selectedFacilityIds = [0];
    }
    if (this.selectedFacilityIds.length > 1) {
      this.selectedFacilityIds = this.selectedFacilityIds.filter(
        (x) => x !== 0
      );
    }
    if (currentValue > 0) {
      this.updateChartAndTable();
    }
  }
  updateChartAndTable(){
      this.RPMEndOfDayCMPRef?.getGraphDataOnSelectedFacilities(this.dateProp, this.selectedFacilityIds);
      this.CCMEndOfDayCMPRef?.getGraphDataOnSelectedFacilities(this.dateProp, this.selectedFacilityIds);
  }
}
