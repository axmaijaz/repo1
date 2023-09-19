import { Component, OnInit } from "@angular/core";
import moment from "moment";
import { ToastService } from "ng-uikit-pro-standard";
import { EndOfDayService } from "src/app/core/end-of-day.service";
import { SecurityService } from "src/app/core/security/security.service";
import { HttpResError } from "src/app/model/common/http-response-error";
import {
  CCMEodReportGraph,
  EodMonthlyReport,
  RPMEodReport,
  RPMEodReportGraph,
} from "src/app/model/eodReport.model";

@Component({
  selector: "app-ccm-rpm-end-of-day-report",
  templateUrl: "./ccm-rpm-end-of-day-report.component.html",
  styleUrls: ["./ccm-rpm-end-of-day-report.component.scss"],
})
export class CcmRpmEndOfDayReportComponent implements OnInit {
  currentDate = moment().subtract(1, "day").format("YYYY-MM-DD");
  rpmEodReport = new RPMEodReportGraph();
  ccmEodReport = new CCMEodReportGraph();
  eodMonthlyReport = new EodMonthlyReport();
  rpmEodReportValues = [];
  ccmEodReportValues = [];
  ccmEodMonthlyReportValue = [];
  rpmEodMonthlyReportValue = [];
  ccmEodMonthlyReportMonthOne = [];
  ccmEodMonthlyReportMonthTwo = [];
  ccmEodMonthlyReportMonthThree = [];
  rpmEodMonthlyReportMonthOne = [];
  rpmEodMonthlyReportMonthTwo = [];
  rpmEodMonthlyReportMonthThree = [];
  monthOne : string;
  monthTwo : string;
  monthThree : string;

  public ccmEodReportChartType = "bar";

  public ccmEodReportChartDatasets: Array<any> = [{
      label: "",
      backgroundColor: "blue",
      data: this.ccmEodMonthlyReportMonthOne
   }, {
      label: "",
      backgroundColor: "red",
      data: this.ccmEodMonthlyReportMonthTwo
   }, {
      label: "",
      backgroundColor: "green",
      data: this.ccmEodMonthlyReportMonthThree
   }
  ];

  public ccmEodReportChartLabels: Array<any> = [
    "Completed Encounters",
    "No. of calls not answered",
    "Declined",
  ];

  public ccmEodReportChartColors: Array<any> = [
    {
      backgroundColor: ["#5ac853", "#2c4978", "#FDB45C",],
      hoverBackgroundColor: [
        "#7ddc77",
        "#3f5c8a",
        "#FFC870",
      ],
      borderWidth: 1,
    },
  ];
  public ccmEodReportChartOptions: any = {
    responsive: true,
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
            maxRotation: 50,
            minRotation: 30,
            padding: 10,
            autoSkip: false,
            fontSize: 10,
          },
        },
      ],
    },
  };
  public rpmEodReportChartType = "bar";

  public rpmEodReportChartDatasets: Array<any> = [{
    label: '',
    backgroundColor: "blue",
    data: this.rpmEodMonthlyReportMonthOne
 }, {
    label: "",
    backgroundColor: "red",
    data: this.rpmEodMonthlyReportMonthTwo
 }, {
    label: "'",
    backgroundColor: "green",
    data: this.rpmEodMonthlyReportMonthThree
 }
];


  public rpmEodReportChartLabels: Array<any> = [
    "Active Patients",
    "Completed 16 Days Readings",
    "Completed Encounters",
  ];

  public rpmEodReportChartColors: Array<any> = [
    {
      backgroundColor: ["#5ac853", "#2c4978", "#FDB45C",],
      hoverBackgroundColor: [
        "#7ddc77",
        "#3f5c8a",
        "#FFC870",
      ],
      borderWidth: 1,
    },
  ];
  public rpmEodReportChartOptions: any = {
    responsive: true,
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
            maxRotation: 50,
            minRotation: 30,
            padding: 10,
            autoSkip: false,
            fontSize: 10,
          },
        },
      ],
    },
  };

  public ccmChartTypePie = "bar";

  public ccmChartDatasetsPie: Array<any> = [
    { data: this.ccmEodReportValues, label: "Ccm" },
  ];

  public ccmChartLabelsPie: Array<any> = [
    "Eligible Patients",
    "CCM Projection",
    "Completed",
    "Last Month CCM",
  ];

  public ccmChartColorsPie: Array<any> = [
    {
      backgroundColor: ["#5ac853", "#2c4978", "#FDB45C", "#949FB1", "#4D5360"],
      hoverBackgroundColor: [
        "#7ddc77",
        "#3f5c8a",
        "#FFC870",
        "#A8B3C5",
        "#616774",
      ],
      borderWidth: 1,
    },
  ];

  public ccmChartOptionsPie: any = {
    responsive: true,
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
            maxRotation: 50,
            minRotation: 30,
            padding: 10,
            autoSkip: false,
            fontSize: 10,
          },
        },
      ],
    },
  };

  public chartTypePie = "bar";

  public chartDatasetsPie: Array<any> = [
    { data: this.rpmEodReportValues, label: "Rpm" },
  ];
  // this.rpmEodReportValues
  public chartLabelsPie: Array<any> = [
    "Eligible Patients",
    "Rpm Projection",
    "Completed",
    "16 Days Reading",
    "No reading Patients",
  ];

  public chartColorsPie: Array<any> = [
    {
      backgroundColor: ["#5ac853", "#2c4978", "#FDB45C", "#949FB1", "#4D5360"],
      hoverBackgroundColor: [
        "#7ddc77",
        "#3f5c8a",
        "#FFC870",
        "#A8B3C5",
        "#616774",
      ],
      borderWidth: 1,
    },
  ];

  public chartOptionsPie: any = {
    responsive: true,
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
            maxRotation: 50,
            minRotation: 30,
            padding: 10,
            autoSkip: false,
            fontSize: 10,
          },
        },
      ],
    },
  };
  facilityId: number;
  ccmProjectionPercentage: number;
  ccmAchievementPercentage: number;
  ccmLastAchievementPercentage: number;
  rpmProjectionPercentage: number;
  rpmAchievementPercentage: number;
  rpmSixteenDaysReadingPercentage: number;

  constructor(
    private endOfDayService: EndOfDayService,
    private securityService: SecurityService,
    private toaster: ToastService
  ) {}

  ngOnInit() {
    this.facilityId = +this.securityService.getClaim("FacilityId")?.claimValue;
    if (this.facilityId) {
      this.GetCcmEodReportGraphByFacilityId();
      this.GetRpmEodReportGraphByFacilityId();
      this.getMonthlyReportForGraph();
    }
  }
  GetCcmEodReportGraphByFacilityId() {
    this.endOfDayService
      .GetCcmEodReportGraphByFacilityId(this.facilityId, this.currentDate)
      .subscribe(
        (res: CCMEodReportGraph) => {
          this.ccmProjectionPercentage = +((res.ccmProjection / res.eligiblePatients)* 100 ).toFixed(1) || 0;
          this.ccmAchievementPercentage = +((res.achievements / res.ccmProjection) * 100).toFixed(1) || 0;
          this.ccmLastAchievementPercentage = +((res.lastMonthAchievements / res.achievements) * 100).toFixed(1) || 0;
          this.ccmEodReport = res;
          this.ccmEodReportValues.push(res.eligiblePatients);
          this.ccmEodReportValues.push(res.ccmProjection);
          this.ccmEodReportValues.push(res.achievements);
          this.ccmEodReportValues.push(res.lastMonthAchievements);
          this.ccmChartDatasetsPie = [...this.ccmChartDatasetsPie];
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
  }

  GetRpmEodReportGraphByFacilityId() {
    this.endOfDayService
      .GetRpmEodReportGraphByFacilityId(this.facilityId, this.currentDate)
      .subscribe(
        (res: RPMEodReportGraph) => {
          this.rpmProjectionPercentage = +((res.rpmProjection/res.activePatients)* 100).toFixed(1) || 0;
          this.rpmAchievementPercentage= +((res.totalCompletedPatients/res.rpmProjection)*100).toFixed(1) || 0;
          this.rpmSixteenDaysReadingPercentage= +((res.sixteenDaysReadingPatients/res.totalCompletedPatients)*100).toFixed(1) || 0;
          this.rpmEodReport = res;
          this.rpmEodReportValues.push(res.activePatients);
          this.rpmEodReportValues.push(res.rpmProjection);
          this.rpmEodReportValues.push(res.totalCompletedPatients);
          this.rpmEodReportValues.push(res.sixteenDaysReadingPatients);
          this.rpmEodReportValues.push(res.noReadingPatients);
          this.chartDatasetsPie = [...this.chartDatasetsPie];
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
  }
  getMonthlyReportForGraph(){
    this.endOfDayService.GetMonthlyReportForGraph(this.facilityId).subscribe((res: EodMonthlyReport) => {

      this.monthOne = res[0].month;
      this.monthTwo = res[1].month;
      this.monthThree = res[2].month;

      this.ccmEodMonthlyReportMonthOne.push(res[0].ccmCompletedPatientsCount);
      this.ccmEodMonthlyReportMonthOne.push(res[0].notAnsweredCount);
      this.ccmEodMonthlyReportMonthOne.push(res[0].declinedCount);
      this.ccmEodMonthlyReportMonthTwo.push(res[1].ccmCompletedPatientsCount);
      this.ccmEodMonthlyReportMonthTwo.push(res[1].notAnsweredCount);
      this.ccmEodMonthlyReportMonthTwo.push(res[1].declinedCount);
      this.ccmEodMonthlyReportMonthThree.push(res[2].ccmCompletedPatientsCount);
      this.ccmEodMonthlyReportMonthThree.push(res[2].notAnsweredCount);
      this.ccmEodMonthlyReportMonthThree.push(res[2].declinedCount);    
      
      this.rpmEodMonthlyReportMonthOne.push(res[0].rpmActivePatientsCount);
      this.rpmEodMonthlyReportMonthOne.push(res[0].rpmReadingCompletedCount);
      this.rpmEodMonthlyReportMonthOne.push(res[0].rpmCompletedPatientsCount);
      this.rpmEodMonthlyReportMonthTwo.push(res[1].rpmActivePatientsCount);
      this.rpmEodMonthlyReportMonthTwo.push(res[1].rpmReadingCompletedCount);
      this.rpmEodMonthlyReportMonthTwo.push(res[1].rpmCompletedPatientsCount);
      this.rpmEodMonthlyReportMonthThree.push(res[2].rpmActivePatientsCount);
      this.rpmEodMonthlyReportMonthThree.push(res[2].rpmReadingCompletedCount);
      this.rpmEodMonthlyReportMonthThree.push(res[2].rpmCompletedPatientsCount);  
      this.ccmEodReportChartDatasets = [{
        label: this.monthOne,
        backgroundColor: "blue",
        data: this.ccmEodMonthlyReportMonthOne
     }, {
        label: this.monthTwo,
        backgroundColor: "red",
        data: this.ccmEodMonthlyReportMonthTwo
     }, {
        label: this.monthThree,
        backgroundColor: "green",
        data: this.ccmEodMonthlyReportMonthThree
     }
    ];
      this.rpmEodReportChartDatasets = [{
        label: this.monthOne,
        backgroundColor: "blue",
        data: this.rpmEodMonthlyReportMonthOne
     }, {
        label: this.monthTwo,
        backgroundColor: "red",
        data: this.rpmEodMonthlyReportMonthTwo
     }, {
        label: this.monthThree,
        backgroundColor: "green",
        data: this.rpmEodMonthlyReportMonthThree
     }
    ];
    },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      })
  }
}
