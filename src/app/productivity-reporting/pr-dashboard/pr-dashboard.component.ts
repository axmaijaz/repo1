import { LazyModalDto, PagingData } from "src/app/model/AppModels/app.model";
import { DataFilterService } from "src/app/core/data-filter.service";
import { ClonerService } from "src/app/core/cloner.service";
import { ProductivityReportingService } from "./../../core/productivity-reporting.service";
import { ToastService } from "ng-uikit-pro-standard";
import { SecurityService } from "src/app/core/security/security.service";
import { FacilityService } from "src/app/core/facility/facility.service";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import moment from "moment";
import { IDatePickerConfig, ECalendarValue } from "ng2-date-picker";
import {
  CreateFacilityUserDto,
  FacilityDto,
} from "src/app/model/Facility/facility.model";
import { UserType } from "src/app/Enums/UserType.enum";
import { HttpResError } from "src/app/model/common/http-response-error";
import {
  GetPRDataParam,
  ProductivityEncounterTypeEnum,
  PRStatListDto,
  TwoCModulesEnum,
} from "src/app/model/productivity.model";
import { CcmMonthlyStatus, SortOrder } from "src/app/Enums/filterPatient.enum";
import { Router } from "@angular/router";
import { DaterangepickerComponent } from "ng2-daterangepicker";
import FileSaver from "file-saver";
import { AppUiService } from "src/app/core/app-ui.service";
import { Subject } from "rxjs";
import { CCMQualityCheckMOdalDto } from "src/app/model/admin/ccm.model";
import { RPMQualityCheckModalDto } from "src/app/model/rpm.model";
@Component({
  selector: "app-pr-dashboard",
  templateUrl: "./pr-dashboard.component.html",
  styleUrls: ["./pr-dashboard.component.scss"],
})
export class PrDashboardComponent implements OnInit, AfterViewInit {
  rowsLimit = 15;
  prstatsList = new Array<PRStatListDto>();
  displayList = new Array<PRStatListDto>();
  selectedUserEncountersList = new Array<PRStatListDto>();
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM",
  };
  selectedDateRange: any;
  public options: any = {
    locale: {
      format: "DD-MMM-YYYY",
      cancelLabel: "Clear",
      // displayFormat: 'DD-MM-YYYY'
    },
    alwaysShowCalendars: false,
  };
  daterange: any = {};
  isLoading = false;
  CareProvidersList = new Array<CreateFacilityUserDto>();
  facilityIds = [-1];
  CPLoader: boolean;
  cUserType: UserType;
  UserTypeEnum = UserType;
  qualityCheck = false;
  facilityList = new Array<FacilityDto>();
  LoadingPR: boolean;
  GetPRDataParamObj = new GetPRDataParam();
  ProductivityEncounterTypeEnumObj = ProductivityEncounterTypeEnum;
  public chartTypeBar = "bar";
  pagingData = new PagingData();
  ccmQualityCheckMOdalDto= new CCMQualityCheckMOdalDto();
  rpmQualityCheckModalDto = new RPMQualityCheckModalDto();
  totalCCMEncounterCount = 0;
  totalRPMEncounterCount = 0;
  totalAWVEncounterCount = 0;
  payEncounter= [-1];

  public chartDatasetsBar: Array<any> = [
    { data: [0, 0, 0, 0, 0, 0, 0], label: "My First dataset" },
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset' }
  ];

  public chartLabelsBar: Array<any> = [
    "CCM 20",
    "CCM 40",
    "CCM 60",
    "RPM 99457",
    "RPM 99458",
    "Transmission",
    "AWV",
  ];

  public chartColorsBar: Array<any> = [
    {
      backgroundColor: "rgba(105, 0, 132, .2)",
      borderColor: "rgba(200, 99, 132, .7)",
      borderWidth: 2,
    },
    {
      backgroundColor: "rgba(0, 137, 132, .2)",
      borderColor: "rgba(0, 10, 130, .7)",
      borderWidth: 2,
    },
  ];

  public chartOptionsBar: any = {
    responsive: true,
    scaleShowValues: true,
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
            autoSkip: false,
          },
        },
      ],
    },
    // labels: {
    //   fontColor: 'red',
    //   defaultFontFamily: 'Arial'
    // }
  };
  public chartTypePie = "pie";

  public chartDatasetsPie: Array<any> = [
    { data: [0, 0, 0, 0, 0], label: "Monthly Status" },
  ];

  public chartLabelsPie: Array<any> = [];

  public chartColorsPie: Array<any> = [
    {
      backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
      hoverBackgroundColor: [
        "#FF5A5E",
        "#5AD3D1",
        "#FFC870",
        "#A8B3C5",
        "#616774",
      ],
      borderWidth: 2,
    },
  ];

  public chartOptionsPie: any = {
    responsive: true,
  };
  prstatsListPre: PRStatListDto[] = [];
  summaryViewObj: {
    CCM: number;
    RPM: number;
    TCM: number;
    BHI: number;
    PrCM: number;
    AWV: number;
    CCM20: number;
    CCM40: number;
    CCM60: number;
    RPM99457: number;
    RPM99458: number;
    Transmission: number;
    Total: number;
  } = {} as any;
  EncounterTypeEnumList = this.datafilterService.getEnumAsList(
    ProductivityEncounterTypeEnum
  );
  ProductivityEncounterTypeEnum = ProductivityEncounterTypeEnum;
  EncunterType: ProductivityEncounterTypeEnum[] = [-1];
  filterStr = "";
  prSummaryFilter = 'All'

  @ViewChild(DaterangepickerComponent) private picker: DaterangepickerComponent;
  isAppAdmin: boolean;
  pagesArr: number[] = [];
  pagesDisplayArr: number[] = [];
  PRCredit = true;
  isDownloadingExcelFile: boolean;
  pieLegendsArr: any[];
  careCoordinatorsListWithCredit = [];
  selectedCareCoordinatorsList= new Array<PRStatListDto>();
  getAllCareCareCoordinator= false;
  prstatsListSave: PRStatListDto[];
  selectedEncounter: PRStatListDto;
  constructor(
    private facilityService: FacilityService,
    private securityService: SecurityService,
    private toaster: ToastService,
    private dCopy: ClonerService,
    private prService: ProductivityReportingService,
    private datafilterService: DataFilterService,
    private router: Router,
    private appUi: AppUiService,
  ) {}

  ngOnInit(): void {
    this.cUserType = this.securityService.securityObject.userType;
    this.GetPRDataParamObj.from = moment()
      .startOf("month")
      .format("YYYY-MM-DD");
    this.GetPRDataParamObj.to = moment().format("YYYY-MM-DD");
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityIds = [
        +this.securityService.getClaim("FacilityId").claimValue,
      ];
      this.getFacilityUserList();
      //this.GetPRDataParamObj.from
      this.GetProductivityReport();
    } else {
      this.facilityIds = [-1];
      this.getFacilityList();
    }
    if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      this.isAppAdmin = true;
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateDateRange();
    }, 1000);
  }
  filterByMonth(date) {}
  public updateDateRange() {
    this.picker.datePicker.setStartDate(
      moment().startOf("month").format("DD-MMM-YYYY")
    );
    this.picker.datePicker.setEndDate(moment().format("DD-MMM-YYYY"));
    this.picker.datePicker.updateView();
    this.picker.datePicker.updateFormInputs();
  }
  clearDate() {
    this.daterange = {};
    this.selectedDateRange = [];
    this.GetPRDataParamObj.from = "";
    this.GetPRDataParamObj.to = "";
    // this.picker.datePicker.setStartDate();
    // this.picker.datePicker.setEndDate();
    this.GetProductivityReport();
  }
  selectedDate(value: any, datepicker?: any) {
    // datepicker.start = value.start;
    // datepicker.end = value.end;
    this.GetPRDataParamObj.from = value.start.format("YYYY-MM-DD");
    this.GetPRDataParamObj.to = value.end.format("YYYY-MM-DD");
    // this.daterange.label = value.label;
    // this.GetProductivityReport();
  }
  getFacilityList() {
    this.isLoading = true;
    this.LoadingPR = true;
    this.facilityService.getFacilityList().subscribe(
      (res: any) => {
        this.facilityList = res;
        if (this.facilityList && this.facilityList.length) {
          // this.facilityIds = [this.facilityList[0].id];
          this.getFacilityUserList();
          this.GetProductivityReport();
        } else {
          this.LoadingPR = false;
        }
        this.isLoading = false;
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getDataOnFilter() {
    if (!this.facilityIds || !this.facilityIds.length) {
      this.facilityIds = [-1];
    }
    // if (this.facilityIds.length > 1) {
    //   this.facilityIds = this.facilityIds.filter((x) => x !== -1);
    // }
    this.GetPRDataParamObj.facilityUserIds = [0];
    this.getFacilityUserList();
    // this.GetProductivityReport();
  }
  filterFacility(currentValue){
    if (currentValue === -1) {
      this.facilityIds = [-1];
    }
    if (
      !this.facilityIds ||
      !this.facilityIds.length
    ) {
      this.facilityIds = [-1];
    }
    if (this.facilityIds.length > 1) {
      this.facilityIds =
        this.facilityIds.filter((x) => x !== -1);
    }
  }
  getFacilityUserList() {
    this.CPLoader = true;
    this.facilityService.GetFacilitiesUsers(this.facilityIds).subscribe(
      (res: any) => {
        this.CPLoader = false;
        this.CareProvidersList = res;
      },
      (error: HttpResError) => {
        this.CPLoader = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  filterChanges(currentValue) {
    this.GetPRDataParamObj.facilityIds = this.facilityIds;
    if (currentValue == 0) {
      this.GetPRDataParamObj.facilityUserIds = [0];
    }
    if (
      !this.GetPRDataParamObj.facilityUserIds ||
      !this.GetPRDataParamObj.facilityUserIds.length
    ) {
      this.GetPRDataParamObj.facilityUserIds = [0];
    }
    if (this.GetPRDataParamObj.facilityUserIds.length > 1) {
      this.GetPRDataParamObj.facilityUserIds =
        this.GetPRDataParamObj.facilityUserIds.filter((x) => x !== 0);
    }
    if (
      !this.GetPRDataParamObj.facilityIds ||
      !this.GetPRDataParamObj.facilityIds.length
    ) {
      this.GetPRDataParamObj.facilityIds = [-1];
    }
    if (this.GetPRDataParamObj.facilityIds.length > 1) {
      this.GetPRDataParamObj.facilityIds =
        this.GetPRDataParamObj.facilityIds.filter((x) => x !== -1);
    }
  }
  sortData(sortInfo) {
    this.GetPRDataParamObj.sortBy = sortInfo;
    if (this.GetPRDataParamObj.sortOrder == SortOrder.Asc) {
      this.GetPRDataParamObj.sortOrder = 1;
    } else if (this.GetPRDataParamObj.sortOrder == SortOrder.Desc) {
      this.GetPRDataParamObj.sortOrder = 0;
    }
    this.GetProductivityReport();
  }
  GetProductivityReport() {
    this.totalCCMEncounterCount = 0;
    this.totalRPMEncounterCount = 0;
    this.totalAWVEncounterCount = 0;
    this.LoadingPR = true;
    this.GetPRDataParamObj.facilityIds = this.facilityIds;
    if (
      !this.GetPRDataParamObj.facilityUserIds ||
      !this.GetPRDataParamObj.facilityUserIds.length
    ) {
      this.GetPRDataParamObj.facilityUserIds = [0];
    }
    if (this.GetPRDataParamObj.facilityUserIds.length > 1) {
      this.GetPRDataParamObj.facilityUserIds =
        this.GetPRDataParamObj.facilityUserIds.filter((x) => x !== 0);
    }
    if (
      !this.GetPRDataParamObj.facilityIds ||
      !this.GetPRDataParamObj.facilityIds.length
    ) {
      this.GetPRDataParamObj.facilityIds = [-1];
    }
    if (this.GetPRDataParamObj.facilityIds.length > 1) {
      this.GetPRDataParamObj.facilityIds =
        this.GetPRDataParamObj.facilityIds.filter((x) => x !== -1);
    }
    // this.GetPRDataParamObj.PRCredit = this.PRCredit;
    // this.GetPRDataParamObj.encounterType = this.EncunterType;
    this.careCoordinatorsListWithCredit = [];
    this.summaryViewObj = {} as any;

    this.pieLegendsArr = [];
    this.chartDatasetsBar = [
      { data: [0, 0, 0, 0, 0, 0, 0], label: "My First dataset" },
      // { data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset' }
    ];
    this.chartDatasetsPie = [
      { data: [0, 0, 0, 0, 0], label: "Monthly Status" },
    ];
    this.prstatsList = [];
    this.prstatsListPre = [];
    this.prstatsListSave = [];
    this.prSummaryFilter = 'All';
    this.PRCredit = true;
    this.EncunterType = [-1];
    this.prService.GetProductivityReport(this.GetPRDataParamObj).subscribe(
      (res: any) => {
        this.LoadingPR = false;
        if (res && res.length) {
          this.prstatsListPre = this.dCopy.deepClone<PRStatListDto[]>(res);
          this.prstatsList = this.dCopy.deepClone<PRStatListDto[]>(res);
          this.prstatsListSave = this.dCopy.deepClone<PRStatListDto[]>(res);
          this.getAllCareCareCoordinator = true;
          this.prstatsList.forEach((prStat: PRStatListDto) => {
            if (prStat.credit > 0) {
              this.careCoordinatorsListWithCredit.push(prStat);
            }
          });
          // console.log(this.careCoordinatorsListWithCredit);
          const ids = this.careCoordinatorsListWithCredit.map(
            (o) => o.facilityUserId
          );
          this.careCoordinatorsListWithCredit =
            this.careCoordinatorsListWithCredit.filter(
              ({ facilityUserId }, index) =>
                !ids.includes(facilityUserId, index + 1)
            );
          this.calculateEncountersCount();
        } else {
          this.prstatsList = [];
          this.prstatsListPre = [];
        }
        this.ApplyAllClientFilter();
      },
      (error: HttpResError) => {
        this.LoadingPR = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  calculateEncountersCount() {
    this.careCoordinatorsListWithCredit.forEach((prStatUser: PRStatListDto) => {
      let userPrStatList = this.prstatsList.filter(
        (prStat: PRStatListDto) =>
          prStat.facilityUserId == prStatUser.facilityUserId
      );
      var ccmEncountersCount = 0;
      var rpmEncountersCount = 0;
      var awvEncountersCount = 0;
      userPrStatList.forEach((us: PRStatListDto) => {
        if((us.encounterType == ProductivityEncounterTypeEnum["CCM 20"] || us.encounterType == ProductivityEncounterTypeEnum["CCM 40"] || us.encounterType == ProductivityEncounterTypeEnum["CCM 60"]) && us.credit > 0){
          ccmEncountersCount = ccmEncountersCount + 1;
          this.totalCCMEncounterCount = this.totalCCMEncounterCount + 1;
        }
        if((us.encounterType == ProductivityEncounterTypeEnum["RPM 99457"] || us.encounterType == ProductivityEncounterTypeEnum["RPM 99458"] || us.encounterType == ProductivityEncounterTypeEnum.Transmission) && us.credit > 0){
          rpmEncountersCount = rpmEncountersCount + 1;
          this.totalRPMEncounterCount = this.totalRPMEncounterCount + 1;
        }
        if((us.encounterType == ProductivityEncounterTypeEnum.AWV) && us.credit > 0){
          awvEncountersCount = awvEncountersCount + 1;
          this.totalAWVEncounterCount = this.totalAWVEncounterCount + 1;
        }
        prStatUser['ccmEncounterCOunt'] = ccmEncountersCount;
        prStatUser['rpmEncounterCOunt'] = rpmEncountersCount;
        prStatUser['awvEncounterCOunt'] = awvEncountersCount;
        prStatUser['encountersCount'] = ccmEncountersCount + rpmEncountersCount + awvEncountersCount;
      });
    });
    this.careCoordinatorsListWithCredit.sort((a, b) => parseFloat(b.encountersCount) - parseFloat(a.encountersCount));
  }
  ApplyAllClientFilter() {
    this.CreateSummaryData();
    this.FilterTableData();
    this.CreateBarChart();
    this.CreatePieChart();
    this.InitializePaging();
  }
  FilterTableData() {
    this.prstatsList = this.dCopy.deepClone<PRStatListDto[]>(this.prstatsListSave);
    if (this.EncunterType && this.EncunterType.length) {
      if (this.EncunterType.length > 1 && this.EncunterType.includes(-1)) {
        this.EncunterType = this.EncunterType.filter((x) => x !== -1);
      }
      if (this.EncunterType.length !== 1 || !this.EncunterType.includes(-1)) {
        this.prstatsList = this.prstatsList.filter((x) => {
          const isValid = this.EncunterType.includes(x.encounterType);
          return isValid;
        });
      }
    } else {
      this.EncunterType = [-1];
    }
    if(this.payEncounter && this.payEncounter.length){
      if (this.payEncounter.length > 1 && this.payEncounter.includes(-1)) {
        this.payEncounter = this.payEncounter.filter((x) => x !== -1);
      }
      if (this.payEncounter.length == 1 && this.payEncounter.includes(-1)) {
        this.payEncounter = [-1];
      }
      if (this.payEncounter.length !== 1 || !this.payEncounter.includes(-1)) {
        if(this.payEncounter.length == 1 &&  this.payEncounter.includes(0) ){
          this.prstatsList = this.prstatsList?.filter((x) => x.paid == true);
        }
        if(this.payEncounter.length == 1 && this.payEncounter.includes(1)){
          this.prstatsList =  this.prstatsList?.filter((x) => x.paid == false);
        }
        if(this.payEncounter.length == 1 && this.payEncounter.includes(0) && this.payEncounter.includes(1)){
          this.toaster.info('both')
        }
      } else{
        this.payEncounter = [-1];
      }
    }else{
      this.payEncounter = [-1];
    }
    if (this.PRCredit === true) {
      this.prstatsList = this.prstatsList.filter((x) => x.credit > 0);
    }
    if(this.qualityCheck === true){
      this.prstatsList = this.prstatsList.filter((x) => x.qualityChecked == 1)
    }
    if (this.filterStr) {
      this.prstatsList = this.prstatsList.filter((x) =>
        x.patientName
          ?.toLowerCase()
          .includes(this.filterStr.toLocaleLowerCase())
      );
    }
  }
  checkFilter(currentValue){
    if(currentValue == -1){
      this.payEncounter = [-1];
    }
  }
  CreateSummaryData() {
    this.summaryViewObj.CCM =
      this.prstatsList.filter(
        (x) => x.serviceType === TwoCModulesEnum.CCM && x.credit > 0
      ).length || 0;
    this.summaryViewObj.RPM =
      this.prstatsList.filter(
        (x) => x.serviceType === TwoCModulesEnum.RPM && x.credit > 0
      ).length || 0;
    this.summaryViewObj.TCM =
      this.prstatsList.filter(
        (x) => x.serviceType === TwoCModulesEnum.TCM && x.credit > 0
      ).length || 0;
    this.summaryViewObj.BHI =
      this.prstatsList.filter(
        (x) => x.serviceType === TwoCModulesEnum.BHI && x.credit > 0
      ).length || 0;
    this.summaryViewObj.PrCM =
      this.prstatsList.filter(
        (x) => x.serviceType === TwoCModulesEnum.PrCM && x.credit > 0
      ).length || 0;
    this.summaryViewObj.AWV =
      this.prstatsList.filter(
        (x) => x.serviceType === TwoCModulesEnum.AWV && x.credit > 0
      ).length || 0;
    this.summaryViewObj.CCM20 =
      this.prstatsList.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["CCM 20"] &&
          x.credit > 0
      ).length || 0;
    this.summaryViewObj.CCM40 =
      this.prstatsList.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["CCM 40"] &&
          x.credit > 0
      ).length || 0;
    this.summaryViewObj.CCM60 =
      this.prstatsList.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["CCM 60"] &&
          x.credit > 0
      ).length || 0;
    this.summaryViewObj.RPM99457 =
      this.prstatsList.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["RPM 99457"] &&
          x.credit > 0
      ).length || 0;
    this.summaryViewObj.RPM99458 =
      this.prstatsList.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["RPM 99458"] &&
          x.credit > 0
      ).length || 0;
    this.summaryViewObj.Transmission =
      this.prstatsList.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["Transmission"] &&
          x.credit > 0
      ).length || 0;
    this.summaryViewObj.Total =
      this.summaryViewObj.CCM +
      this.summaryViewObj.RPM +
      this.summaryViewObj.TCM +
      this.summaryViewObj.BHI +
      this.summaryViewObj.AWV +
      this.summaryViewObj.PrCM;
  }
  CreateBarChart() {
    const CCM20 =
      this.prstatsList?.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["CCM 20"] &&
          x.credit > 0
      ).length || 0;
    const CCM40 =
      this.prstatsList?.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["CCM 40"] &&
          x.credit > 0
      ).length || 0;
    const CCM60 =
      this.prstatsList?.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["CCM 60"] &&
          x.credit > 0
      ).length || 0;
    const RPM99457 =
      this.prstatsList?.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["RPM 99457"] &&
          x.credit > 0
      ).length || 0;
    const RPM99458 =
      this.prstatsList?.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["RPM 99458"] &&
          x.credit > 0
      ).length || 0;
    const Transmission =
      this.prstatsList?.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["Transmission"] &&
          x.credit > 0
      ).length || 0;
    const AWV =
      this.prstatsList?.filter(
        (x) =>
          x.encounterType === ProductivityEncounterTypeEnum["AWV"] &&
          x.credit > 0
      ).length || 0;
    this.chartDatasetsBar = [
      {
        data: [CCM20, CCM40, CCM60, RPM99457, RPM99458, Transmission, AWV],
        label: "Count",
      },
      // { data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset' }
    ];
    this.chartLabelsBar = [
      "CCM 20",
      "CCM 40",
      "CCM 60",
      "RPM 99457",
      "RPM 99458",
      "Transmission",
      "AWV",
    ];
  }
  CreatePieChart() {
    const labelsArr = [];
    const dataArr = [];
    this.pieLegendsArr = [];
    const onlyCCMRows =
      this.prstatsList.filter(
        (x) => x.serviceType === TwoCModulesEnum.CCM
      ) || [];
    const distinctGroup = this.datafilterService.groupByProp(
      onlyCCMRows,
      "status"
    );
    const lableColors = ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"];
    if (distinctGroup && distinctGroup.length) {
      distinctGroup.forEach((x, index) => {
        const uniquePatients = this.datafilterService.distictArrayByProperty(
          x.value,
          "patientId"
        );
        labelsArr.push(x.key);
        dataArr.push(uniquePatients?.length);
        this.pieLegendsArr.push({
          name: x.key,
          value: uniquePatients?.length || 0,
          color: lableColors[index],
        });
      });
    }
    this.chartDatasetsPie = [
      { data: dataArr, label: "My First dataset" },
      // { data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset' }
    ];
    this.chartLabelsPie = labelsArr;
  }
  OpenEncounterDetails(item: PRStatListDto) {
    if (item.serviceType === TwoCModulesEnum.CCM) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`/admin/logsHistory/${item.patientId}`])
      );
      window.open(url, "_blank");
    }
    if (item.serviceType === TwoCModulesEnum.RPM) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([`/admin/logsHistory/${item.patientId}`])
      );
      window.open(url, "_blank");
    }
    if (item.serviceType === TwoCModulesEnum.AWV) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree([
          `/annualWellness/AWMain/${item.patientId}/${item.encounterRefId}/awPatient`,
        ])
      );
      window.open(url, "_blank");
    }
  }
  InitializePaging() {
    this.pagesArr = [];
    this.pagingData.elementsCount = this.prstatsList?.length;
    this.pagingData.pageNumber = 1;
    this.pagingData.pageSize = this.rowsLimit;
    this.pagingData.pageCount = Math.ceil(
      this.pagingData.elementsCount / this.pagingData.pageSize
    );
    for (let index = 1; index <= this.pagingData.pageCount; index++) {
      this.pagesArr.push(index);
    }
    this.ApplyPageFilter();
  }
  ApplyPageFilter() {
    this.displayList = [];
    for (
      var i = (this.pagingData.pageNumber - 1) * this.pagingData.pageSize;
      i < this.pagingData.pageNumber * this.pagingData.pageSize;
      i++
    ) {
      const obj = this.prstatsList[i];
      if (obj) {
        obj["index"] = i + 1;
        this.displayList.push(obj);
      }
    }
    this.CreatePagingNumbers();
  }
  CreatePagingNumbers() {
    this.pagesDisplayArr = [];
    let previous = this.pagingData.pageNumber - 1;
    let current = this.pagingData.pageNumber;
    let next = this.pagingData.pageNumber + 1;
    if (this.pagesArr?.length) {
      if (previous > 0 && previous <= this.pagesArr.length) {
        this.pagesDisplayArr.push(previous);
      }
      if (current > 0 && current <= this.pagesArr.length) {
        this.pagesDisplayArr.push(current);
      }
      if (next > 0 && next <= this.pagesArr.length) {
        this.pagesDisplayArr.push(next);
      }
      if (this.pagesDisplayArr?.length < 3 && this.pagesArr?.length > 2) {
        if (current === 1) {
          this.pagesDisplayArr.push(3);
        }
        if (current === this.pagesArr?.length) {
          this.pagesDisplayArr.unshift(this.pagesArr?.length - 2);
        }
      }
    }
  }
  getReport(careCoordinator: PRStatListDto){
    this.getAllCareCareCoordinator = false;
    this.prSummaryFilter = 'All';
    this.PRCredit = true;
    this.EncunterType = [-1];
    if(this.selectedCareCoordinatorsList.length){
      const coordinator = this.selectedCareCoordinatorsList.filter((careCoId: PRStatListDto) => careCoId.id == careCoordinator.id);
      if(coordinator.length){
        if(coordinator[0]['selected'] == true){
          coordinator[0]['selected'] = false;
          this.selectedCareCoordinatorsList = this.selectedCareCoordinatorsList.filter(item => item.id != coordinator[0].id);
          this.fillFacilityUserIds();
        }else{
          coordinator[0]['selected'] = true;
          this.selectedCareCoordinatorsList.push(careCoordinator);
          this.fillFacilityUserIds();
        }
      }else{
      careCoordinator['selected'] = true;
      this.selectedCareCoordinatorsList.push(careCoordinator);
      this.fillFacilityUserIds();
      }
    }else{
      careCoordinator['selected'] = true;
      this.selectedCareCoordinatorsList.push(careCoordinator);
      this.fillFacilityUserIds();
    }
  }
  getAllCareCoordinatorsReport(){
    // this.selectedCareCoordinatorsList.forEach((careCoordinator: PRStatListDto) => careCoordinator['selected'] = false);
    // this.selectedCareCoordinatorsList= new Array<PRStatListDto>();
    // this.getAllCareCareCoordinator = true;
    // this.GetPRDataParamObj.facilityUserIds = [0];
    // this.prstatsList = this.prstatsListSave;
    // this.displayList= this.prstatsListSave;
    // this.ApplyAllClientFilter();
    this.selectedCareCoordinatorsList= new Array<PRStatListDto>();
    this.GetProductivityReport();

  }
  fillFacilityUserIds(){
    this.selectedUserEncountersList = new Array<PRStatListDto>();
    this.selectedCareCoordinatorsList.forEach((selectedCC: PRStatListDto) => {
      let list = this.prstatsListPre.filter((prStat: PRStatListDto) => prStat.facilityUserId == selectedCC.facilityUserId)
      this.selectedUserEncountersList.push(...list)
    })
    // this.displayList = this.selectedUserEncountersList;
    this.prstatsList = this.selectedUserEncountersList;
    this.prstatsListSave = this.selectedUserEncountersList;

    this.ApplyAllClientFilter();
  }
  getProductivityReportExcelFile() {
    this.isDownloadingExcelFile = true;
    this.selectedCareCoordinatorsList.forEach((careCoordinator) => this.GetPRDataParamObj.facilityUserIds.push(careCoordinator.facilityUserId))
    this.GetPRDataParamObj.facilityIds = this.facilityIds;
    if (
      !this.GetPRDataParamObj.facilityUserIds ||
      !this.GetPRDataParamObj.facilityUserIds.length
    ) {
      this.GetPRDataParamObj.facilityUserIds = [0];
    }
    if (this.GetPRDataParamObj.facilityUserIds.length > 1) {
      this.GetPRDataParamObj.facilityUserIds =
        this.GetPRDataParamObj.facilityUserIds.filter((x) => x !== 0);
    }
    this.GetPRDataParamObj.PRCredit = this.PRCredit;
    this.GetPRDataParamObj.encounterType = this.EncunterType;
    this.prService
      .getProductivityReportExcelFile(this.GetPRDataParamObj)
      .subscribe(
        (res: any) => {
          FileSaver.saveAs(
            new Blob([res], { type: "application/csv" }),
            `ProductivityReport.csv`
          );
          this.isDownloadingExcelFile = false;
        },
        (error: HttpResError) => {
          this.LoadingPR = false;
          this.toaster.error(error.error, error.message);
          this.isDownloadingExcelFile = false;
        }
      );
  }
  openQualityCheckModal(encounter: PRStatListDto){
    if(encounter.encounterType == ProductivityEncounterTypeEnum["CCM 20"] || encounter.encounterType == ProductivityEncounterTypeEnum["CCM 40"] || encounter.encounterType == ProductivityEncounterTypeEnum["CCM 60"] ){
      this.ccmQualityCheckMOdalDto.patientId = encounter.patientId;
      this.ccmQualityCheckMOdalDto.isPrDashboard = true;
      this.appUi.openCCMQualityCheckModal.next(this.ccmQualityCheckMOdalDto);
    }
    if(encounter.encounterType == ProductivityEncounterTypeEnum["RPM 99457"] || encounter.encounterType == ProductivityEncounterTypeEnum["RPM 99458"]){
      this.rpmQualityCheckModalDto.patientId = encounter.patientId;
      this.rpmQualityCheckModalDto.isPrDashboard = true;
      this.appUi.openRPMQualityCheckModal.next(this.rpmQualityCheckModalDto);
    }
  }
  payChecked(message){

        const modalDto = new LazyModalDto();
        modalDto.Title = 'Pay Encounter';
        modalDto.Text = message;
        modalDto.callBack = this.callBackBhi;
        modalDto.rejectCallBack = this.rejectCallBackBhi;
        this.appUi.openLazyConfrimModal(modalDto);

  }
  rejectCallBackBhi = () => {
    this.selectedEncounter.paid = false;
  }
  callBackBhi = (row) => {
   this.markAsPaid()
  }
  checkPrPaymentValidity(encounter:PRStatListDto){
    this.selectedEncounter = encounter;
    this.prService.checkPrPaymentValidity(this.selectedEncounter.id).subscribe((res: any) => {
      this.payChecked(res.message);
      console.log(res);
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
      encounter.paid = false;
    })
  }
  markAsPaid(){
    this.prService.markAsPaid(this.selectedEncounter.id).subscribe((res: any) => {
      // console.log(res);
      this.toaster.success('Paid');
      // this.GetProductivityReport();
      if (!res || !res.length) {
        return
      }
      res.forEach(rowId => {
        var item1 = this.prstatsListPre.find(x => x.id == rowId)
        if (item1) {
          item1.paid = true;
        }
        var item2 = this.prstatsList.find(x => x.id == rowId)
        if (item2) {
          item2.paid = true;
        }
        var item3 = this.prstatsListSave.find(x => x.id == rowId)
        if (item3) {
          item3.paid = true;
        }
        var item4 = this.displayList.find(x => x.id == rowId)
        if (item4) {
          item4.paid = true;
        }
      })
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
}
