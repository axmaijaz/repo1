import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
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
import { RPMEodReport, RPMEodReportGraph } from "src/app/model/eodReport.model";

@Component({
  selector: "app-rpm-end-of-day-report",
  templateUrl: "./rpm-end-of-day-report.component.html",
  styleUrls: ["./rpm-end-of-day-report.component.scss"],
})
export class RpmEndOfDayReportComponent implements OnInit {
  rpmEodReportGraph = new RPMEodReportGraph();
  rpmEodReportList = new Array<RPMEodReportGraph>();
  rpmEodReport = new Array<RPMEodReport>();
  currentDate = moment().subtract(1, "day").format("YYYY-MM-DD");
  dateProp: string;
  facilityId: number;
  facilityList: any;
  selectedFacilityIds = [0];
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
        label: "Encounter Completed",
        type: "line",
        lineTension: 0.5,
      },
      {
        data: [],
        label: "16 Days Reading",
        type: "line",
        fill: false,
        lineTension: 0.5,
      },
      {
        data: [],
        label: "No Reading",
        type: "line",
        fill: false,
        lineTension: 0.5,
      },
      {
        data: [],
        label: "Projections",
        type: "line",
        fill: false,
        lineTension: 0.5,
        borderColor: "#084de0",
      },
      {
        data: [],
        label: "Active Patients",
        // type: "bar",
        // fill: true,
        // borderColor: "#084de0",
        lineTension: 0.5,
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
      legend: {
        text: "You awesome chart with average line",
        display: true,
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        xAxes: [
          {
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
  
  tempRPMEodReportList: RPMEodReportGraph[];
  chartColors: Array<any> = [
    {
      backgroundColor: "#F67277",
      borderColor: "#F64777",
      borderWidth: 3,
    },
    {
      backgroundColor: "#75CDCD",
      borderColor: "#75A4CD",
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
    // if (!this.facilityId) {
    //   this.facilityId = 0;
    //   this.getRpmEodReportGraph();
    // }
  }

  getRpmEodReportGraph() {
    if (!this.dateProp) {
      this.toaster.warning("Please select date");
    } else {
      this.endOfDayService.GetRpmEodReportGraph(this.dateProp).subscribe(
        (res: RPMEodReportGraph[]) => {
          this.rpmEodReportList = res;
          this.tempRPMEodReportList = res;
          if (
            this.selectedFacilityIds.length == 1 &&
            this.selectedFacilityIds[0] == 0
          ) {
            this.rpmEodReportList = this.tempRPMEodReportList;
          } else {
            let filteredFacilitiesReportList = this.rpmEodReportList.filter(
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
            this.rpmEodReportList = filteredFacilitiesReportList;
          }
          this.ApplyGraphValues();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
    }
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
  getSelectedFacilitiesData() {
    console.log(this.dateProp);
    console.log(this.selectedFacilityIds);
  }
  filterChanges(currentValue) {
    if (currentValue == 0) {
      this.selectedFacilityIds = [0];
    }
    if (!this.selectedFacilityIds || !this.selectedFacilityIds.length) {
      this.selectedFacilityIds = [0];
    }
    if (this.selectedFacilityIds.length > 1) {
      this.selectedFacilityIds = this.selectedFacilityIds.filter(
        (x) => x !== 0
      );
    }
  }
  ApplyGraphValues() {
    const facilitiesList = [];
    const activePatients = [];
    const totalCompletedPatients = [];
    const noReadingPatients = [];
    const sixteenDaysReadingPatients = [];
    const rpmProjections = [];
    this.rpmEodReportList.forEach((rep) => {
      facilitiesList.push(rep.facilityName);
      activePatients.push(rep.activePatients);
      totalCompletedPatients.push(rep.totalCompletedPatients);
      noReadingPatients.push(rep.noReadingPatients);
      sixteenDaysReadingPatients.push(rep.sixteenDaysReadingPatients);
      rpmProjections.push(rep.rpmProjection);
    });
    this.chart.datasets = [
      {
        data: sixteenDaysReadingPatients,
        label: "16 Days Reading",
        type: "line",
        fill: false,
        lineTension: 0.3,
        showLine: false //<- set this
      },
      {
        data: noReadingPatients,
        label: "No Reading",
        type: "line",
        fill: false,
        lineTension: 0.3,
        showLine: false //<- set this
      },
      {
        data: totalCompletedPatients,
        label: "Completed",
        type: "line",
        fill: false,
        lineTension: 0.3,
        showLine: false //<- set this
      },
      {
        data: rpmProjections,
        label: "Projections",
        type: "line",
        fill: false,
        lineTension: 0.3,
        showLine: false //<- set this
        // borderColor: "#084de0",
      },
      {
        data: activePatients,
        label: "Eligible Patients",
        // type: "line",
        // borderColor:"#4EC9B0",
        // backgroundColor: '',
        // borderColor: "#084de0",
        lineTension: 0.3,
      },
    ];
    this.chart.labels = [...facilitiesList];
    this.chart.datasets = [...this.chart.datasets];
  }
  getGraphDataOnSelectedFacilities(date, facilities) {
    this.dateProp = date;
    this.selectedFacilityIds = facilities;
    this.getRpmEodReportGraph();
  }
}
