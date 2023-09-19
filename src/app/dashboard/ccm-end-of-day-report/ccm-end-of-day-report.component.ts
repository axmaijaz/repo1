import { Component, OnInit } from "@angular/core";
import Chart from "chart.js";
import { ChartDataSets } from "chart.js";
import moment from "moment";
import { ToastService } from "ng-uikit-pro-standard";
import { ECalendarValue, IDatePickerConfig } from "ng2-date-picker";
import { EndOfDayService } from "src/app/core/end-of-day.service";
import { FacilityService } from "src/app/core/facility/facility.service";
import { SecurityService } from "src/app/core/security/security.service";
import { HttpResError } from "src/app/model/common/http-response-error";
import { CCMEodReport, CCMEodReportGraph } from "src/app/model/eodReport.model";

@Component({
  selector: "app-ccm-end-of-day-report",
  templateUrl: "./ccm-end-of-day-report.component.html",
  styleUrls: ["./ccm-end-of-day-report.component.scss"],
})
export class CcmEndOfDayReportComponent implements OnInit {
  selectedFilterGraphFacilities = [];
  selectedFilterFacilities = [];
  ccmEodReportGraph = new CCMEodReportGraph();
  ccmEodReportList = new Array<CCMEodReportGraph>();
  tempCCMEodReportList = new Array<CCMEodReportGraph>();
  ccmEodReport = new Array<CCMEodReport>();
  currentDate = moment().subtract(1, "day").format("YYYY-MM-DD");
  selectedDate = moment().subtract(1, "day").format("YYYY-MM-DD");
  facilitiesList = [];
  dateProp: string;
  achievements = [];
  eligiblePatients = [];
  lastMonthAchievements = [];
  ccmProjections = [];
  facilityId: number;
  facilityList: any;
  selectedFacilityIds = [0];
  addedPatientsTotal = 0;
  eligiblePatientsTotal = 0;
  activePatientsTotal = 0;
  contactedPatientsTotal=0;
  completedPatientsTotal = 0;
  notAnsweredTotal = 0;
  declinedPatientsTotal = 0;
  deferredPatientsTotal = 0;
  hhcDeferredTotal = 0;
  changedProviderTotal = 0;
  deathPatientsTotal = 0;
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

  public chart = {
    datasets: [
      {
        data: [],
        label: "Eligible Patients",
        type: "bar",
        fill: false,
        borderColor: "#084de0",
      },
      {
        data: [],
        label: "Completed",
        type: "line",
      },
      {
        data: [],
        label: "Last Month",
        type: "line",
        fill: false,
      },
      {
        backgroundColor: '#DDD',
        hoverBackgroundColor: '#DDD',
        data:  [],
        datalabels: {
          display: false
        }
      },
      {
        data: [],
        label: "Projections",
        type: "line",
        fill: false,
        lineTension: 0.3,
        borderColor: "#084de0",
      },
    ] as ChartDataSets[],
    labels: [],
    options: {
      tooltips: {
        mode: "index",
        intersect: false,
      },
      hover: {
        mode: "index",
        intersect: false,
      },
      bezierCurve: false,
      legend: {
        text: "You awesome chart with average line",
        display: true,
      },
      scales: {
        yAxes: [
          {
            stacked: false,
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
            stacked: true,
            ticks: {
              callback: (value, index, values) => {
                var characterLimit = 20;
                if (value.length >= characterLimit) {
                  return (
                    value
                      .slice(0, value.length)
                      .substring(0, characterLimit - 1)
                      .trim() + "..."
                  );
                }
                return value;
              },
              maxRotation: 50,
              minRotation: 30,
              padding: 10,
              autoSkip: false,
              fontSize: 10,
            },
          },
        ],
      },
      animation: {
        duration: 500,
        easing: "easeOutQuart",
        onComplete: function () {
            var ctx = this.chart.ctx;
            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            this.data.datasets.forEach(function (dataset) {
                for (var i = 0; i < dataset.data.length; i++) {
                    var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                        scale_max = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;
                    ctx.fillStyle = '#444';
                    var y_pos = model.y - 5;
                    // Make sure data value does not get overflown and hidden
                    // when the bar's value is too close to max value of scale
                    // Note: The y value is reverse, it counts from top down
                    if ((scale_max - model.y) / scale_max >= 0.93)
                        y_pos = model.y + 20;
                    ctx.fillText(dataset.data[i], model.x, y_pos);
                }
            });
        }
    }
    },
  };
  chartColors: Array<any> = [
    {
      backgroundColor: "#75CDCD",
      borderColor: "#75A4CD",
      borderWidth: 3,
    },
    // {
    //   backgroundColor: "#7E0CD6",
    //   borderColor: "#7E0CD6",
    //   borderWidth: 3,
    // },
    {
      backgroundColor: "#F28F93",
      borderColor: "#F28F93",
      borderWidth: 3,
    },
    {
      backgroundColor: "#66B5EF",
      borderColor: "#668CEF",
      borderWidth: 3,
    },
    {
      backgroundColor: "#FFCFA3",
      borderColor: "#FF9E40",
      borderWidth: 3,
    },
    {
      backgroundColor: "rgba(148, 205, 139, .61)",
      borderColor: "#4DB047",
      borderWidth: 2,
    },
  ];
  tempCCMEodReport: any;
  isLoadingCcmEodReport: boolean;
  constructor(
    private endOfDayService: EndOfDayService,
    private toaster: ToastService,
    private securityService: SecurityService,
    private facilityService: FacilityService
  ) {}

  ngOnInit() {
    this.dateProp = this.currentDate;
    this.getFacilityList();
    this.facilityId = +this.securityService.getClaim("FacilityId")?.claimValue;
    if (!this.facilityId) {
      this.facilityId = 0;
      this.getCcmEodReportGraph();
    }
    this.getCcmEodReport();
  }
  getFacilityList() {
    this.facilityService.getFacilityList().subscribe(
      (res: any) => {
        this.facilityList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }

  getCcmEodReportGraph() {
    if (!this.dateProp) {
      this.toaster.warning("Please select date");
    } else {
      this.endOfDayService.GetCcmEodReportGraph(this.dateProp).subscribe(
        (res: CCMEodReportGraph[]) => {
          this.ccmEodReportList = res;
          this.tempCCMEodReportList = res;
          if (
            this.selectedFacilityIds.length == 1 &&
            this.selectedFacilityIds[0] == 0
          ) {
            this.ccmEodReportList = this.tempCCMEodReportList;
          } else {
            let filteredFacilitiesReportList = this.ccmEodReportList.filter(
              (report) => {
                const result = this.selectedFacilityIds.find(
                  (x) => x === report.facilityId
                );
                if (result) {
                  return true;
                } else {
                  return false;
                }
              }
            );
            this.ccmEodReportList = filteredFacilitiesReportList;
          }
          this.ApplyGraphValues();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
    }
  }
  getCcmEodReport() {
    if (!this.dateProp) {
      this.toaster.warning("Please select date");
    } else {
      this.isLoadingCcmEodReport = true;
      this.endOfDayService
        .GetCcmEodReport(this.facilityId, this.dateProp)
        .subscribe(
          (res: CCMEodReport[]) => {
            this.ccmEodReport = res;
           this.getTotalOfCCMEodReport();
            this.tempCCMEodReport = res;
            if (this.selectedFilterFacilities.length) {
              this.getSelectedFacilitiesData();
            }
            this.isLoadingCcmEodReport = false;
          },
          (err: HttpResError) => {
            this.toaster.error(err.error);
            this.isLoadingCcmEodReport = false;
          }
        );
    }
  }
  getSelectedFacilitiesData() {
    this.ccmEodReport = [];
    this.selectedFilterFacilities = [];
    if (
      this.selectedFacilityIds.length == 1 &&
      this.selectedFacilityIds[0] == 0
    ) {
      this.ccmEodReport = this.tempCCMEodReport;
      this.getTotalOfCCMEodReport();
    } else {
      this.selectedFacilityIds.forEach((facilityId: number) => {
        this.tempCCMEodReport.forEach((facility: CCMEodReport) => {
          if (facilityId == facility.facilityId) {
            this.selectedFilterFacilities.push(facility);
          }
        });
      });
      this.ccmEodReport = this.selectedFilterFacilities;
      this.getTotalOfCCMEodReport();
    }
  }
  resetTotalOfCCMEodReport(){
    this.addedPatientsTotal = 0;
    this.eligiblePatientsTotal = 0;
    this.activePatientsTotal = 0;
    this.contactedPatientsTotal=0;
    this.completedPatientsTotal = 0;
    this.notAnsweredTotal = 0;
    this.declinedPatientsTotal = 0;
    this.deferredPatientsTotal = 0;
    this.hhcDeferredTotal = 0;
    this.changedProviderTotal = 0;
    this.deathPatientsTotal = 0;
  }
  getTotalOfCCMEodReport(){
    this.resetTotalOfCCMEodReport();
    this.ccmEodReport?.forEach((report: CCMEodReport) => {
      this.addedPatientsTotal =  report.totalAddedPatients + this.addedPatientsTotal ;
      this.eligiblePatientsTotal =  report.eligiblePatients + this.eligiblePatientsTotal ;
      this.activePatientsTotal =  report.totalActivePatients + this.activePatientsTotal ;
      this.contactedPatientsTotal =  report.totalContactedPatients + this.contactedPatientsTotal ;
      this.completedPatientsTotal =  report.totalCompletedPatients + this.completedPatientsTotal ;
      this.notAnsweredTotal =  report.notAnsweredPatients + this.notAnsweredTotal ;
      this.declinedPatientsTotal =  report.declinedPatients + this.declinedPatientsTotal ;
      this.deferredPatientsTotal =  report.defferedPatients + this.deferredPatientsTotal ;
      this.hhcDeferredTotal =  report.hHCDefferedPatients  + this.hhcDeferredTotal || 0;
      this.changedProviderTotal =  report.changedProviderPatients  + this.changedProviderTotal ;
      this.deathPatientsTotal =  report.deadPatients  + this.deathPatientsTotal ;
    })
  }
  // getSelectedFacilitiesGraphData() {
  //   this.ccmEodReportList = [];
  //   this.selectedFilterGraphFacilities = [];
  //   this.selectedFacilityIds.forEach((facilityId: number) => {
  //     this.tempCCMEodReportList.forEach((facility: CCMEodReportGraph) => {
  //       if (facilityId == facility.facilityId) {
  //         this.selectedFilterGraphFacilities.push(facility);
  //       }
  //     });
  //   });
  //   this.ccmEodReportList = this.selectedFilterGraphFacilities;
  //   this.clearGraphValues();
  //   this.ccmEodReportList.forEach((rep) => {
  //     this.facilitiesList.push(rep.facilityName);
  //     this.achievements.push(rep.achievements);
  //     this.eligiblePatients.push(rep.eligiblePatients);
  //     this.lastMonthAchievements.push(rep.lastMonthAchievements);
  //     this.ccmProjections.push(rep.ccmProjection);
  //   });
  //   this.chart.datasets = [...this.chart.datasets];
  // }
  filterChanges(currentValue) {
    if (currentValue == 0) {
      this.selectedFacilityIds = [0];
      this.ccmEodReport = this.tempCCMEodReport;
      this.selectedFilterFacilities = [];
      this.ccmEodReportList = this.tempCCMEodReportList;
      this.selectedFilterGraphFacilities = [];
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
      this.getSelectedFacilitiesData();
      // this.getSelectedFacilitiesGraphData();
    }
  }
  ApplyGraphValues() {
    const facilitiesList = [];
    const achievements = [];
    const eligiblePatients = [];
    const lastMonthAchievements = [];
    const ccmProjections = [];
    const todayGoal = [];
    this.ccmEodReportList.forEach((rep) => {
      facilitiesList.push(rep.facilityName);
      achievements.push(rep.achievements);
      eligiblePatients.push(rep.eligiblePatients);
      lastMonthAchievements.push(rep.lastMonthAchievements);
      ccmProjections.push(rep.ccmProjection);
      todayGoal.push(rep.todayGoal);
    });
    var star = new Image();
    star.src = '../../../assets/icons/star2.png';
    var line = new Image();
    line.src = '../../../assets/icons/remove2.png';
    var dottedLine = new Image();
    dottedLine.src = '../../../assets/icons/remove3.png';
    this.chart.datasets = [
      {
        data: lastMonthAchievements,
        label: "Last Month",
        type: "line",
        lineTension: 0.3,
        fill: false,
        pointStyle: star,
        showLine: false //<- set this
      },
      // {
      //   data: achievements,
      //   label: "Achievements",
      //   type: "line",
      //   fill: false,
      //   lineTension: 0.3,
      //   showLine: false, //<- set this
      //   backgroundColor: 'rgb(54, 195, 110)',
      // },
      {
        data: todayGoal,
        label: "TodayGoal",
        type: "line",
        fill: false,
        lineTension: 0.3,
        pointStyle: dottedLine,
        showLine: false //<- set this
      },
      {
        backgroundColor: '#75CDCD',
        hoverBackgroundColor: '#75CDCD',
        label: "Completed",
        data:  achievements,
        // datalabels: {
        //   display: false
        // }
      },

      {
        data: ccmProjections,
        label: "Projections",
        type: "line",
        fill: false,
        lineTension: 0.3,
        pointStyle: line,
        showLine: false //<- set this
      },
      {
        data: eligiblePatients,
        label: "Eligible Patients",
        // type: "bar",
        lineTension: 0.3,
      },
    ];
    this.chart.labels = [...facilitiesList];
    this.chart.datasets = [...this.chart.datasets];
  }
  getGraphDataOnSelectedFacilities(date, facilities) {
    this.dateProp = date;
    this.selectedFacilityIds = facilities;
    this.getCcmEodReportGraph();
    this.getSelectedFacilitiesData();
  }
}
