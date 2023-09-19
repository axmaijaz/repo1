import { ModalDirective, TabsetComponent } from 'ng-uikit-pro-standard';
import { FacilityService } from './../../core/facility/facility.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SubSink } from 'src/app/SubSink';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import * as moment from 'moment';
import { PatientDto, FilterPatient, AllChronicDiseaseDto, ChronicIcd10CodeDto } from 'src/app/model/Patient/patient.model';
import { PagingData, LazyModalDto } from 'src/app/model/AppModels/app.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { DataTableDirective } from 'angular-datatables';
import { ToastService } from 'ng-uikit-pro-standard';
import { Subject, fromEvent } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { PreventiveGapScreenParams, PreventiveGapScreenDto, GapStatus, PcmStatusDto, MeasureDto, MeasureInfoDto, PCMeasureDataForGraphDto, FacilityGapsListDto } from 'src/app/model/pcm/pcm.model';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { debounceTime, map } from 'rxjs/operators';
import { SecurityService } from 'src/app/core/security/security.service';
import { InsurancePlanDto, CareGapDto, PayersListDto } from 'src/app/model/pcm/payers.model';
import { InsuranceService } from 'src/app/core/insurance.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import FileSaver from 'file-saver';
import { AppUiService } from 'src/app/core/app-ui.service';
import { PcmStatus, ScheduleFlag } from 'src/app/Enums/pcm.enum';
import { CcmStatus, CommunicationConsent } from 'src/app/Enums/filterPatient.enum';
import { AddEditCustomListDto, AssignPatientsToCustomListDto } from 'src/app/model/custome-list.model';
import { CustomeListService } from 'src/app/core/custome-list.service';
import { UserType } from 'src/app/Enums/UserType.enum';

import { Location } from "@angular/common";
import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { data } from 'jquery';
import Chart, { ChartOptions } from 'chart.js';
import { AppDataService } from 'src/app/core/app-data.service';
import { CustomListForPatientListsComponent } from 'src/app/custom-patient-listing/custom-list-for-patient-lists/custom-list-for-patient-lists.component';
@Component({
  selector: 'app-pcm-patients-list',
  templateUrl: './pcm-patients-list.component.html',
  styleUrls: ['./pcm-patients-list.component.scss']
})
export class PcmPatientsListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  @ViewChild('clickOnRow') clickOnRow: ModalDirective;
  @ViewChild('chartProgress') chartProgress: ElementRef;
  @ViewChild('customListForPatientsListCompRef') customListForPatientsListCompRef: CustomListForPatientListsComponent;
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MM-DD-YYYY',
    appendTo: 'body',
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

  filterPatientDto = new PreventiveGapScreenParams();
  private subs = new SubSink();
  rowIndex = 0;
  dtTrigger = new Subject<any>();

  dtOptions: DataTables.Settings | any = {};
  dtSelect: DataTables.RowMethods | any = {};
  dtSeacrh: DataTables.SearchSettings = {};

  isGraph = false;
  isPcmPatients = false;
  isQualityMeasure = false;
  loadingOnStart: boolean;
  isLoading: boolean;
  selected: any[];
  rows = new Array<PreventiveGapScreenDto>();
  communicationConsentList = this.filterDataService.getEnumAsList(CommunicationConsent);
  ccmStatusEnum = CcmStatus;
  pagingData = new PagingData();
  pcmStatusEnum = PcmStatus;
  table = $('#example').DataTable();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  cronicDiseaseList = new Array<AllChronicDiseaseDto>();
  tempCronicDiseaseList = new Array<AllChronicDiseaseDto>();
  gridCheckAll: boolean;
  rowId: any;
  @ViewChild('searchPatient') searchPatient: ElementRef;
  isLoadingPayersList: boolean;
  facilityId: number;
  insurancePLanList: InsurancePlanDto[];
  SelectedinsurancePLan: any;
  gapStatusENumList = this.datafilterService.getEnumAsList(GapStatus);
  CareGapsList: CareGapDto[];
  CareFacilitatorsList = new Array<CreateFacilityUserDto>();
  billingProviderList = new Array<CreateFacilityUserDto>();
  CareProvidersList = new Array<CreateFacilityUserDto>();
  careManagerList = new Array<CreateFacilityUserDto>();
  careCordinatorList: any[];
  searchWatch = new Subject<string>();
  searchParam: string;
  loadingPayers: boolean;
  PayersList = new Array<PayersListDto>();
  measureInfoList = new Array<MeasureInfoDto>();
  pcmStatusDto = new PcmStatusDto();
  selectedPatient = new PreventiveGapScreenDto();

  CustomListDto = new Array<AddEditCustomListDto>();
  facilityUserId = 0;
  addPatientInCustmListDto = new AssignPatientsToCustomListDto();
  gettingDueGaps: boolean;
  dueGapsList = new Array<MeasureDto>();
  // AverageMeasureData: {patients: number, coveredPercent: number , pcmPatients: number};
  MeasureDataForGraph: {covered: number, notCovered: number};
  activeMeasure: number;
  loadingMeasures: boolean;
  loadingAvgdata: boolean;
  loadingGraphData: boolean;
  // AllgapsDataForBubbles: PCMeasureDataForGraphDto[];
  AllgapsDataForBubbles2: PCMeasureDataForGraphDto;
  isGraphsLoading = true;
  facilityGapsListDto = new Array<FacilityGapsListDto>();
  allGapsListDto = new Array<CareGapDto>();
  tempFacilityGapsListDto = new Array<FacilityGapsListDto>();
  ScheduleFlagEnumList: { number: string; word: string; }[];
  GapStatusEnumList: { number: string; word: string; }[];
  isIncludeGapDetails: boolean;
  disableChronicFilter: boolean;

  public chartType: string = 'doughnut';

  public chartColors: Array<any> = [
    {
      backgroundColor: ['#4eb048', '#bdbdbd'],
      hoverBackgroundColor: ['#4eb048','#bdbdbd'],
      borderWidth: 0,
    }
  ];

  public chartOptions: ChartOptions = {
    responsive: true,
      maintainAspectRatio: false,
      cutoutPercentage: 85,
      tooltips: {
        bodyFontSize: 10,
      },
    animation: {
      duration: 0,
    }
  };

  public doughnut = 'doughnut';
  ccmStatusList: any;
  cronicConditionsLIst = new Array<{ id: 0; algorithm: "" }>();
  LoadingData: boolean;
  queryParamsApplied: any;

  public chartClicked(e: any): void {}
  public chartHovered(e: any): void {}
  public chartColorss: Array<any> = [
    {
      backgroundColor: ['#00c851', '#00c851', '#4b515d' , '#4b515d' ,'#ff3547', '#ff3547'],
      hoverBackgroundColor: ['#00c851', '#00c851', '#4b515d' , '#4b515d' ,'#ff3547', '#ff3547'],
      borderWidth: 0,
      weight: 2,
    }
  ];

  constructor(private pcmService: PcmService, private datafilterService: DataFilterService, private patientService: PatientsService,
    private insuranceService: InsuranceService, private facilityService: FacilityService, private location: Location,
    private customListService: CustomeListService, private eventBus: EventBusService, private route: ActivatedRoute,
    private appUi: AppUiService, private securityService: SecurityService, private toaster: ToastService, private router: Router, private appData: AppDataService,
    private cdr: ChangeDetectorRef, private filterDataService: DataFilterService) { }

    GetCustomListsByFacilityUserId() {
      // this.isLoadingPayersList = true;
      this.customListService.GetCustomListsByFacilityUserId(this.facilityUserId).subscribe(
        (res: any) => {
          this.CustomListDto = res.customListsDto;
        },
        (error: HttpResError) => {
          // this.isLoadingPayersList = false;
          this.toaster.error(error.error, error.message);
        }
      );
    }
    ngAfterContentChecked(){
      this.cdr.detectChanges();
    }
    AddPatientsToList(id: number) {this.cdr
      // this.isLoadingPayersList = true;
      this.addPatientInCustmListDto.patientIds = new Array<number>();
      this.selected.forEach((element) => {
        this.addPatientInCustmListDto.patientIds.push(element.id);
      });
      this.addPatientInCustmListDto.customListIds = [id];
      this.customListService.AddPatientsToList(this.addPatientInCustmListDto).subscribe(
        (res) => {
          this.toaster.success('Data Saved Successfully');
        },
        (error: HttpResError) => {
          // this.isLoadingPayersList = false;
          this.toaster.error(error.error, error.message);
        }
      );
    }

  graph() {
  //   this.minutesCompleteDoughnetChartsData = [
  //     { data: [20, 20, 20, 20, 20], label: 'My First dataset' }
  //   ];
  //   this.chartOptions = {
  //     responsive: true,
  //       maintainAspectRatio: false,
  //       cutoutPercentage: 85,

  // };
  }
  ngOnInit() {
    const tempIsPcmPatients = this.route.snapshot.queryParams['isPcmPatients'];
    if(tempIsPcmPatients){
      this.isPcmPatients = JSON.parse(tempIsPcmPatients);
      // this.getFiltersData();
      this.router.navigate([], {
        queryParams: {
          'isPcmPatients': null,
        },
        queryParamsHandling: 'merge'
      });
    }
    // this.filterPatientDto.CareProviderId = 0;
    // this.filterPatientDto.FacilityUserId = 0;
    if (this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.filterPatientDto.facilityUserId = this.securityService.securityObject.id;
      this.facilityUserId = this.securityService.securityObject.id;
      // this.filterPatientDto.CareProviderId = this.securityService.securityObject.id;
    } else {
      this.filterPatientDto.facilityUserId = 0;
    }
  this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
  this.dtSelect = {
    select: true,
  };
  this.eventBus.on(EventTypes.RefreshCustomList).subscribe((res) => {
    this.GetCustomListsByFacilityUserId();
     });
    //  private eventBus: EventBusService

    this.initializeDataTable();
    this.GetInsurancePlansByFacilityId();
    this.getDependentDiseases('');
    this.getCronicConditions()
    // this.getCronicDiseases();
    this.getFacilityGaps();
    this.getCcmStatus();
    this.getCareManagerList();
    this.GetCareFacilitatorsByFacilityId();
    this.getCareCordinatorFacilityUsers();
    this.SearchObserver();
    this.getBillingProviderList();
    this.getCareProviders();
    this.GetCustomListsByFacilityUserId();
    // this.GetAllMeasureInfos();
    // this.GetCoveredPCMeasureDataAverage();
    // this.GetAllPCMeasureDataForGraph();
    this.GetAllPCMeasureDataForGraph2();
    this.getAllCareGaps();
    this.getScheduleFlagArray();
    this.getGapStatusArray();
    // Test
    // var chartProgress = document.getElementById("chartProgress");
// if (this.chartProgress) {

// }
  }
  getFiltersData(){
    if(this.datafilterService.filterData['pcmList']){
      this.filterPatientDto = this.datafilterService.filterData['pcmList'];
    }
  }
  getCronicConditions() {
    this.patientService.getChronicConditions().subscribe(
      (res: any) => {
        this.cronicConditionsLIst = res;
      },
      err => {}
    );
  }
  getDependentDiseases(id: any) {
    if(!id || (Array.isArray(id) && id.includes('0'))) {
      id = '';
    }
    this.LoadingData = true;
    this.cronicDiseaseList = new Array<ChronicIcd10CodeDto>();
    this.patientService.GetChronicDiseaseCodes(id).subscribe(
      (res: any) => {
        this.LoadingData = false;
        this.cronicDiseaseList = res;
      },
      err => {
        this.LoadingData = false;
      }
    );
  }
  applyChronicFilterLogic() {
    if (this.filterPatientDto.conditionsIds && this.filterPatientDto.conditionsIds.length > 1) {
      const hasAll = this.filterPatientDto.conditionsIds.includes('0');
      if (hasAll) {
        this.filterPatientDto.conditionsIds = this.filterPatientDto.conditionsIds.filter(x => x !== '0');
        this.filterPatientDto.diseaseIds = ['0'];
      }
    }
    if (!this.filterPatientDto.conditionsIds || !this.filterPatientDto.conditionsIds.length) {
      this.filterPatientDto.conditionsIds = ['0'];
    }

  }
  applyICDFilterLogic() {
    if (this.filterPatientDto.diseaseIds && this.filterPatientDto.diseaseIds.length > 1) {
      const hasAll = this.filterPatientDto.diseaseIds.includes('0');
      if (hasAll) {
        this.filterPatientDto.diseaseIds = this.filterPatientDto.diseaseIds.filter(x => x !== '0');
      }
    }
    if (!this.filterPatientDto.diseaseIds || !this.filterPatientDto.diseaseIds.length) {
      this.filterPatientDto.diseaseIds = ['0'];
    }
    if (this.filterPatientDto.diseaseIds && this.filterPatientDto.diseaseIds.length) {
      const hasAll = this.filterPatientDto.diseaseIds.includes('0');
      if (!hasAll) {
        this.disableChronicFilter = true;
      } else {
        this.disableChronicFilter = false;
      }
    }
  }

  GetPcmPatientsCareGapsExcel() {
    // this.assignUserValues();
    this.selectICDCodes();
    this.nullChecking();
    this.subs.sink = this.pcmService
      .GetPcmPatientsCareGapsExcel(this.filterPatientDto)
      .subscribe(
        (res: any) => {
          // this.facilityList = res;
          this.isLoading = false;
          FileSaver.saveAs(new Blob([res] , { type: 'application/csv' } ), `PatientList.csv`);
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }

  getScheduleFlagArray() {
    const keys = Object.keys(ScheduleFlag).filter(
      (k) => typeof ScheduleFlag[k as any] === 'number'
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: ScheduleFlag[key as any],
      word: key,
    })); // [0, 1]
    this.ScheduleFlagEnumList = values;
    return values;
  }
  getGapStatusArray() {
    const keys = Object.keys(GapStatus).filter(
      (k) => typeof GapStatus[k as any] === 'number'
    ); // ["A", "B"]
    const values = keys.map((key) => ({
      number: GapStatus[key as any],
      word: key,
    })); // [0, 1]
    this.GapStatusEnumList = values;
    return values;
  }
  EmitEventForRefreshQM() {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = EventTypes.refreshQualityMeasureTab;
    event.value = '';
    this.eventBus.emit(event);
  }
  getCcmStatus() {
    this.subs.sink = this.patientService
      .getCcmStatus()
      .subscribe((res: any) => {
        if (res) {
          this.ccmStatusList = res;
        }
      });
  }
  getFacilityGaps() {
    this.subs.sink = this.pcmService.GetFacilityGaps(this.facilityId)
      .subscribe(
        (res: FacilityGapsListDto[]) => {
          if (res) {
            // this.CareProvidersList = res;
            this.facilityGapsListDto = res;
            this.tempFacilityGapsListDto = res;
            // this.initializeDataTable();
          }
        },
        (err: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  getAllCareGaps() {
    this.subs.sink = this.insuranceService.GetAllCareGaps()
      .subscribe(
        (res: CareGapDto[]) => {
          if (res) {
            // this.CareProvidersList = res;
            this.allGapsListDto = res;
            // this.initializeDataTable();
          }
        },
        (err: HttpResError) => {
          // this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  getCareManagerList() {
    let roleName = 'Care Manager'
    this.facilityService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.careManagerList = res;
      },
      (error: HttpResError) => {
        this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  // GetAllMeasureInfos() {
  //   this.loadingMeasures = true;

  //   this.subs.sink = this.pcmService.GetAllMeasureInfos()
  //     .subscribe(
  //       (res: any) => {
  //         if (res) {
  //           // this.CareProvidersList = res;
  //           this.measureInfoList = res;
  //           this.activeMeasure = this.measureInfoList[0].id;
  //           this.GetPCMeasureDataForGraph(this.activeMeasure);
  //         }
  //         this.loadingMeasures = false;
  //       },
  //       (err: HttpResError) => {
  //         this.loadingMeasures = false;
  //         this.toaster.error(err.error, err.message);
  //       }
  //     );
  // }
  // GetCoveredPCMeasureDataAverage() {
  //   this.loadingAvgdata = true;
  //   this.subs.sink = this.pcmService.GetCoveredPCMeasureDataAverage(this.facilityId)
  //     .subscribe(
  //       (res: any) => {
  //         if (res) {
  //           // this.CareProvidersList = res;
  //           this.AverageMeasureData = res;
  //           console.log(this.AverageMeasureData)
  //         }
  //         this.loadingAvgdata = false;
  //       },
  //       (err: HttpResError) => {
  //         this.loadingAvgdata = false;
  //         this.toaster.error(err.error, err.message);
  //       }
  //     );
  // }
  // GetPCMeasureDataForGraph(measureId: number) {
  //   this.loadingGraphData = true;
  //   this.subs.sink = this.pcmService.GetPCMeasureDataForGraph(this.facilityId, measureId)
  //     .subscribe(
  //       (res: any) => {
  //         if (res) {
  //           // this.CareProvidersList = res;
  //           this.MeasureDataForGraph = res;
  //           this.chartDatasets = [
  //             {data: [this.MeasureDataForGraph.covered, this.MeasureDataForGraph.notCovered], label: 'PatientsData'}
  //           ];
  //           this.chartLabels = ['Covered', 'Not Covered'];
  //         }
  //         this.loadingGraphData = false;
  //       },
  //       (err: HttpResError) => {
  //         this.loadingGraphData = false;
  //         this.toaster.error(err.error, err.message);
  //       }
  //     );
  // }
  // GetAllPCMeasureDataForGraph() {
  //   this.subs.sink = this.pcmService.GetAllPCMeasureDataForGraph(this.facilityId)
  //     .subscribe(
  //       (res: any) => {
  //         if (res) {
  //           // this.CareProvidersList = res;
  //           this.AllgapsDataForBubbles = res;
  //           this.AllgapsDataForBubbles.forEach(item => {
  //             const total = item.covered + item.notCovered;
  //             item['percentage'] = ((item.covered / total) * 100).toFixed();
  //           });
  //         }
  //       },
  //       (err: HttpResError) => {
  //         this.isLoading = false;
  //         this.toaster.error(err.error, err.message);
  //       }
  //     );
  // }
  nullChecking() {
    const fPDto = new PreventiveGapScreenParams();
    for (const filterProp in this.filterPatientDto) {
      if (
        this.filterPatientDto[filterProp] === null ||
        this.filterPatientDto[filterProp] === undefined
      ) {
        this.filterPatientDto[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
  }
  GetAllPCMeasureDataForGraph2() {
    this.isGraphsLoading = true;
    this.AllgapsDataForBubbles2 = null;
    this.filterPatientDto.facilityId = this.facilityId;
    this.filterPatientDto.facilityUserId = this.facilityUserId;
    this.selectICDCodes();
    this.nullChecking();
    this.subs.sink = this.pcmService.GetAllPCMeasureDataForGraph2(this.filterPatientDto)
      .subscribe(
        (res: PCMeasureDataForGraphDto) => {
          if (res) {
            let v = 1;
            res.gapsResult.forEach(x => {
              x['percentage'] = ((x.covered / res.pcmPatientsCount) * 100).toFixed();
              v++;
              let dataSet = [{ data: [], label: '' }];
              dataSet[0].data = x.statusValue;
              dataSet[0].label = 'my data' + v;
              x.dataSet = dataSet;
            });
            v = 1;
            this.AllgapsDataForBubbles2 = res;
            // this.filteredByGaps();

            // this.minutesCompleteDoughnetChartsData = [
              //   { data: [20, 20, 20, 20, 20], label: 'My First dataset' }
              // ];
            }
            // setTimeout(() => {
              this.isGraphsLoading = false;
            // }, 1000);
        },
        (err: HttpResError) => {
          this.isGraphsLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  filteredByGaps() {
    if (this.SelectedinsurancePLan && this.tempFacilityGapsListDto.length > 0 && this.filterPatientDto.gapIds.length == 0) {
      this.tempFacilityGapsListDto.forEach(gaps => {
        // this.rows.forEach(patient => {
          this.AllgapsDataForBubbles2.gapsResult.forEach(pMeasure => {
            if (gaps.pcmMeasureInfoId == pMeasure.id) {
              pMeasure['isShowColumn'] = true;
              pMeasure['tempCheck'] = true;
            } else if (gaps.pcmMeasureInfoId !== pMeasure.id && !pMeasure['tempCheck']) {
              pMeasure['isShowColumn'] = false;
            }
          });
        // });
        // this.measureInfoList.forEach(measure => {
        //   if (gaps.pcmMeasureInfoId == measure.id) {
        //     measure['isShowColumn'] = true;
        //     measure['tempCheck'] = true;
        //   } else if (gaps.pcmMeasureInfoId !== measure.id && !measure['tempCheck']) {
        //     measure['isShowColumn'] = false;
        //   }
        // });
      });
    } else if (this.filterPatientDto.gapIds.length > 0) {
      this.filterPatientDto.gapIds.forEach(gapsId => {
        // this.rows.forEach(patient => {
          this.AllgapsDataForBubbles2.gapsResult.forEach(pMeasure => {
            if (gapsId == pMeasure.id) {
              pMeasure['isShowColumn'] = true;
              pMeasure['tempCheck'] = true;
            } else if (gapsId !== pMeasure.id && !pMeasure['tempCheck']) {
              pMeasure['isShowColumn'] = false;
            }
          });
        // });
        // this.measureInfoList.forEach(measure => {
        //   if (gapsId == measure.id) {
        //     measure['isShowColumn'] = true;
        //     measure['tempCheck'] = true;
        //   } else if (gapsId !== measure.id && !measure['tempCheck']) {
        //     measure['isShowColumn'] = false;
        //   }
        // });
      });
    } else {
        // this.rows.forEach(patient => {
          this.AllgapsDataForBubbles2.gapsResult.forEach(pMeasure => {
              pMeasure['isShowColumn'] = true;
              pMeasure['tempCheck'] = false;

          });
        // });
    }

  }
  addRequiredData() {
    // this.router.navigateByUrl('/admin/addPatient/'+ this.rowId, {state: {filters:this.filterPatientDto}});
    this.router.navigate(['/admin/addPatient/' + this.rowId]
    , {
      state: this.filterPatientDto,
    }
    );
  }
  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      this.searchParam = x;
      this.GetAllPayers();
    });
  }
  navigatePcmCodeScreen() {
    this.router.navigateByUrl(`insurance/pcm-status`);
  }
  checkIfQueryParams() {
    this.getFiltersData();
    // this.queryParamsApplied = true;
    // const filterState = this.route.snapshot.queryParams['filterState'];
    // if (filterState) {
    //   this.filterPatientDto = JSON.parse(filterState);
    // }
  }
  GetAllPayers() {
    this.loadingPayers = true;
    this.subs.sink = this.insuranceService.GetAllPayers(this.searchParam).subscribe(
      (res: PayersListDto[]) => {
        this.loadingPayers = false;
        this.PayersList = res;
      },
      (error: HttpResError) => {
        this.loadingPayers = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  ngAfterViewInit() {
    if(this.isPcmPatients){
      this.staticTabs.setActiveTab(2);
  }
    this.dtTrigger.next();
    this.subs.sink = fromEvent(this.searchPatient.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000)
      )
      .subscribe((text: string) => {
        this.filterPatients();
    });
  this.graph();
  this.customListForPatientsListCompRef.filterPatientDto = this.filterPatientDto as any;
  }
  ngOnDestroy() {
    this.dtTrigger.unsubscribe();
    this.subs.unsubscribe();
  }

  initializeDataTable() {
    this.dtOptions = {
      pagingType: 'first_last_numbers',
      scrollX: true,
      scrollCollapse: true,
      serverSide: true,
      stateSave: true,
      stateDuration: -1,
      stateSaveCallback: function (oSettings, oData) {
        localStorage.setItem(
          'DataTables_PCMP' + window.location.pathname,
          JSON.stringify(oData)
        );
      },
      stateLoadCallback: function (oSettings) {
        return JSON.parse(
          localStorage.getItem('DataTables_PCMP' + window.location.pathname)
        );
      },
      //         localStorage.removeItem( 'DataTables_'+window.location.pathname );
      // location.reload();
      responsive: true,
      processing: false,
      autoWidth: true,
      pageLength: this.filterPatientDto.pageSize,
      // displayStart: this.filterPatientDto.PageNumber,
      searching: false,
      paging: true,
      select: true,
      order: [],
      lengthMenu: [
        [10, 25, 50, 100],
        [10, 25, 50, 100],
      ],
      columnDefs: [
        { targets: 0, orderable: false },
        { targets: 1, orderable: false },
        { targets: 2, orderable: true },
        { targets: 3, orderable: true },
        { targets: 4, orderable: true },
        { targets: 5, orderable: false },
        { targets: 6, orderable: true },
        { targets: 7, orderable: true },
        { targets: 8, orderable: false },
        { targets: 9, orderable: true },
        // { targets: 8, orderable: false },
        // { targets: 9, orderable: true },
        // { targets: 10, orderable: false },
        // { targets: 11, orderable: false },
        // { targets: 2, orderDataType: 'num-fmt', orderable: false },
        // { targets: 12, orderable: false },
      ],
      language: {
        paginate: {
          first: '<i class="fa fa-backward fa-lg"></i>',
          last: '<i class="fa fa-forward fa-lg"></i>',
        },
      },
      initComplete: function (aa) {
        // console.log('api', aa);
      },
      ajax: (dataTablesParameters: any, callback, settings) => {
        // if (this.filters) {
        //   // this.filterPatientDto.PageSize = dataTablesParameters.length;
        //   this.filterPatientDto.rowIndex = this.statementManagementService.filterPatientData.rowIndex;
        //   this.filterPatientDto.PageNumber = this.statementManagementService.filterPatientData.PageNumber;
        //   this.filterPatientDto.PageSize = this.statementManagementService.filterPatientData.PageSize;
        //   this.filters = '';
        // } else {
          if (dataTablesParameters.start === 1) {
            dataTablesParameters.start = 0;
          }
          // this.filterPatientDto.rowIndex = dataTablesParameters.start;
          this.rowIndex = dataTablesParameters.start;
          this.filterPatientDto.pageSize = dataTablesParameters.length;
          this.filterPatientDto.pageNumber =
            dataTablesParameters.start / dataTablesParameters.length + 1;
          this.filterPatientDto.pageNumber = Math.floor(
            this.filterPatientDto.pageNumber
          );
        if (
          dataTablesParameters.draw > 1 &&
          dataTablesParameters.order.length > 0
        ) {
          const findFilterColumn = dataTablesParameters.columns.filter(
            (res) => {
              return res.data === dataTablesParameters.order[0].column;
            }
          );
          this.filterPatientDto.sortBy = findFilterColumn[0].name;
          if (dataTablesParameters.order[0].dir === 'asc') {
            this.filterPatientDto.sortOrder = 0;
          }
          if (dataTablesParameters.order[0].dir === 'desc') {
            this.filterPatientDto.sortOrder = 1;
          }
        }
        this.filterPatientDto.facilityId = this.facilityId;
        this.filterPatientDto.facilityUserId = this.facilityUserId;
        this.loadingOnStart = false;
        this.isLoading = true;
        this.nullChecking();
        if (!this.queryParamsApplied) {
          this.checkIfQueryParams();
        }
        this.datafilterService.filterData['pcmList'] = this.filterPatientDto;
        this.subs.sink = this.pcmService
          .GetPreventiveGapSummaryScreenData(this.filterPatientDto)
          .subscribe(
            (res: any) => {
              // res.preventiveGapScreenDtos.forEach((element) => {
              //   // if (element.dob) {
              //   //   element.dob = moment.utc( element.dob).local().format('YYYY-MM-DD');
              //   // }
              //   if (element.dob) {
              //     element.dob = moment( element.dob).format('YYYY-MM-DD');
              //   }
              //   if (element.lastDone) {
              //     element.lastDone = moment( element.lastDone).format('YYYY-MM-DD');
              //   }
              //   if (element.nextDue) {
              //     element.nextDue = moment( element.nextDue).format('YYYY-MM-DD');
              //   }
              // });
              this.isLoading = false;
              this.selected = [];
              this.rows = new Array<PreventiveGapScreenDto>();
              // this.rowIndex = this.filterPatientDto.rowIndex;
              this.rows = res.patientsList;
              this.pagingData = res.pagingData;
              this.table.page(this.pagingData.pageNumber).draw(false);
              callback({
                recordsTotal: this.pagingData.elementsCount,
                recordsFiltered: this.pagingData.elementsCount,
                data: [],
              });

              setTimeout(() => {
                this.redDraw();
              }, 50);
            },
            (err: HttpResError) => {
              this.isLoading = false;
              this.toaster.error(err.error, err.message);
            }
          );
      },

      columns: [
        { name: 'id' },
        { name: 'name' },
        { name: 'checkBox' },
        { name: 'pcmStatus' },
        { name: 'careFacilitatorName' },
        { name: 'careProviders' },
        { name: 'billingProviderName' },
        { name: 'ccmStatus' },
        { name: 'chronicIcdCodes' },
        { name: 'insurancePlanName' },
        // { name: 'result' },
        // { name: 'note' },
        // { name: 'action' },
      ],
    };
  }
  navigateBack() {
    this.location.back();
  }
  GetPatientDueCareGaps(row: PreventiveGapScreenDto, modal: ModalDirective) {
    if (!row.dueGapsCount || row.dueGapsCount < 1) {
      this.toaster.success('No due gaps found.');
      return;
    }
    this.dueGapsList = [];
    modal.show();
    this.gettingDueGaps = true;
    this.subs.sink = this.pcmService.GetPatientsDueGaps(row.id).subscribe(
        (res: MeasureDto[]) => {
          this.dueGapsList = [];
          this.dueGapsList = res;
          this.dueGapsList.forEach(element => {
            if (!element.statusList) {
              return;
            }
            const find = element.statusList.find(x => x.value === element.status);
            if (find) {
              element['cStatus'] = find.name;
            }
          });
          this.gettingDueGaps = false;
        },
        (err: HttpResError) => {
          this.gettingDueGaps = false;
          modal.hide();
          this.toaster.error(err.error, err.message);
        }
      );
  }
  UpdateDueGapeNote(item: PreventiveGapScreenDto) {
    if (item.note) {
      this.subs.sink = this.pcmService
        .UpdateDueGapeNote(item)
        .subscribe(
          (res: any) => {
            // this.serviceTypes = res;
          },
          (err) => {}
        );
    }
  }
  getCareProviders() {
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.subs.sink = this.facilityService
      .GetCareProvidersByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.CareProvidersList = res;
          }
        },
        (error) => {}
      );
  }
  async onClickRow(row) {
    const tempTab = "isPcmPatients";
    this.appData.addTabCheck(tempTab);
    // const isSaved = await this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: { filterState: JSON.stringify(this.filterPatientDto) },
    //     queryParamsHandling: 'merge'
    //   });
    // if (isSaved) {
    // }
    // this.patientsService.getPatientDetail(row)

    this.rowId = row.id;
    if (row.profileStatus) {
      this.router.navigate(['/admin/patient/', row.id]);
    } else {
      this.clickOnRow.show();
      // this.router.navigate(['/admin/addPatient/'+ row.id);
      // this.router.navigate(['/admin/addPatient/', row.id]);
    }
  }
  redDraw(): void {
    this.dtElement.dtInstance.then((mydtInstance: DataTables.Api) => {
      // Destroy the table first
      mydtInstance.columns.adjust();
      // console.log('dtInt', mydtInstance);
    });
    this.table.page(this.pagingData.pageNumber).draw(false);
  }
  rowCheckBoxChecked(e, row) {
    this.gridCheckAll = false;
    if (e.target.checked) {
      this.selected.push(row);
      this.customListForPatientsListCompRef.selected = this.selected;
    } else {
      const index = this.selected.findIndex((x) => x.patientId === row.patientId);
      this.selected.splice(index, 1);
      this.customListForPatientsListCompRef.selected = this.selected;
    }
  }
  updatePcmStatus(pcmStatusModal: ModalDirective) {
    this.pcmStatusDto.patientId = this.selectedPatient.id;
    this.subs.sink = this.pcmService
      .UpdatePcmStatus(this.pcmStatusDto)
      .subscribe(
        (res: any) => {
          this.selectedPatient.pcmStatus = this.pcmStatusDto.pcmStatus;
          pcmStatusModal.hide();
        },
        (error) => {
        this.toaster.error(error.error, error.message);
        }
      );
  }
  GetCareFacilitatorsByFacilityId() {
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.subs.sink = this.facilityService
      .GetCareFacilitatorsByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.CareFacilitatorsList = res;
          }
        },
        (error) => {}
      );
  }
  deletePatientsMeasuresSummary(gapId: number) {
    this.subs.sink = this.pcmService
    .DeletePatientsMeasuresSummary(gapId)
    .subscribe(
      (res: any) => {
        this.filterPatients();
       this.toaster.success("Deleted Successfully");
      },
      (error) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Delete Record";
    modalDto.Text = "Are you sure to delete this record";
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.deletePatientsMeasuresSummary(data);
  }
  getPreventiveGapSummaryScreenDataPdf() {
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.filterPatientDto.pageSize = 0;
    this.subs.sink = this.pcmService
      .GetPreventiveGapSummaryScreenDataPdf(this.filterPatientDto)
      .subscribe(
        (res: any) => {
          if (res) {

            FileSaver.saveAs(new Blob([res]), `preventiveGapSummary.csv`);
          }
        },
        (error) => {}
      );
  }
  getCareCordinatorFacilityUsers() {
    let roleName = 'Care Cordinator'
    this.facilityService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.careCordinatorList = res;
      },
      (error: HttpResError) => {
        this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getBillingProviderList() {
    let roleName = 'Billing Provider'
    this.facilityService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.billingProviderList = res;
      },
      (error: HttpResError) => {
        this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetInsurancePlansByFacilityId() {
    this.isLoadingPayersList = true;
    this.insuranceService.GetInsurancePlansByFacilityId(this.facilityId).subscribe(
      (res: InsurancePlanDto[]) => {
        this.insurancePLanList = res;
        this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  // getCronicDiseases() {
  //   this.patientService.getChronicConditions().subscribe(
  //     (res: any) => {
  //       this.cronicDiseaseList = res;
  //     },
  //     err => {}
  //   );
  // }
  // getCronicDiseases() {
  //   this.subs.sink = this.patientService.getAllChronicDisease().subscribe(
  //     (res: any) => {
  //       this.tempCronicDiseaseList = res;
  //       this.cronicDiseaseList = res;
  //       this.filterChronicDisease();
  //     },
  //     (err) => {}
  //   );
  // }

  // filterChronicDisease(event?) {
  //   this.cronicDiseaseList = new Array<AllChronicDiseaseDto>();
  //   if (event && event.term) {
  //     const val = event.term.toLowerCase();
  //   // filter our data
  //     const temp = this.tempCronicDiseaseList.filter(function(d) {
  //     return d.detail.toLowerCase().indexOf(val) !== -1 || !val;
  //   });
  //      temp.slice(0, 10).map((item, i) => {
  //     this.cronicDiseaseList.push(item);
  //      });
  //     // this.cronicDiseaseList = this.tempCronicDiseaseList.filter(x => x.detail == data.term);
  //   } else {

  //     this.tempCronicDiseaseList.slice(0, 10).map((item, i) => {
  //       this.cronicDiseaseList.push(item);
  //     });
  //   }
  //   // if (this.cronicDiseaseList && this.cronicDiseaseList.length > 10) {

  //   // }
  // }

  gridAllRowsCheckBoxChecked(e) {
    this.rows.forEach((data: any) => {
      data.checked = e.target.checked;
    });
    if (e.target.checked) {
      this.selected = [];
      Object.assign(this.selected, this.rows);
      this.customListForPatientsListCompRef.selected = this.selected;
    } else {
      this.selected = [];
      this.customListForPatientsListCompRef.selected = [];
    }
  }
  deselectCheckedRows(){
    this.selected = [];
    this.rows.forEach((data: any) => {
      data.checked = false;
    });
    this.gridCheckAll = false;
  }
  rerender(): void {
    // this.forRerendertable = false;
    this.dtElement.dtInstance.then((mydtInstance: DataTables.Api) => {
      // Destroy the table first
      mydtInstance.columns.adjust().draw();
      // mydtInstance.destroy();
      // Call the dtTrigger to rerender again
      // this.dtTrigger.next();
      // mydtInstance.columns.adjust().draw('page');
    });
    // clearInterval(this.myVar);
  }
  selectICDCodes() {
    var tempicdCodes = this.filterPatientDto.diseaseIds.filter(x => x !== '0');
    var tempConditions = this.filterPatientDto.conditionsIds.filter(x => x !== '0');
  if (tempConditions && tempConditions.length > 0 && tempicdCodes.length == 0) {
    this.filterPatientDto.tempChronicDiseasesIds = this.cronicDiseaseList.map(x => x.id);
  } else {
    this.filterPatientDto.tempChronicDiseasesIds = [];
  }
}
  filterPatients() {
    // this.filterPatientDto.facilityId = this.facilityId;
    this.datafilterService.filterData['pcmList'] = this.filterPatientDto;
    this.selectICDCodes();
    this.filterPatientDto.facilityId = this.facilityId;
    this.filterPatientDto.facilityUserId = this.facilityUserId;
    this.isLoading = true;
    this.assignUserValues();
    this.rerender();

    // this.subs.sink = this.patientsService
    //   .getFilterPatientsList2(this.filterPatientDto)
    //   .subscribe(
    //     (res: any) => {
    //       this.isLoading = false;
    //       this.selected = [];
    //       this.rows = new Array<PatientDto>();
    //       this.rerender();
    //       const len = this.rows.length;
    //       this.rows = res.patientsList;
    //       this.pagingData = res.pagingData;
    //       // this.rerender();
    //     },
    //     (err: HttpResError) => {
    //       this.isLoading = false;
    //       this.toaster.error(err.error, err.message);
    //     }
    //   );
    // this.table.ajax.reload(()=>,true)
    // recordsTotal: this.pagingData.elementsCount,
    //           recordsFiltered: this.pagingData.elementsCount,
    //           data: []
  }
  assignUserValues() {
    this.isLoading = true;
    const fPDto = new PreventiveGapScreenParams();
    for (const filterProp in this.filterPatientDto) {
      if (this.filterPatientDto[filterProp] === null || this.filterPatientDto[filterProp] === undefined ) {
        this.filterPatientDto[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
    // this.filterPatientDtoforExcelFile = this.filterPatientDto;
  }
  resetFilter() {
    this.daterange = {};
    this.selectedDateRange = [];
    this.isIncludeGapDetails = false;
    // this.tempFacilityGapsListDto = new Array<FacilityGapsListDto>();
    this.tempFacilityGapsListDto = this.facilityGapsListDto;
    this.filterPatientDto = new PreventiveGapScreenParams();
    this.filterPatientDto.pageNumber = 1;
    this.SelectedinsurancePLan = -1;
  }
  insuranceGaps() {
    this.filterPatientDto.gapIds = [];
    this.tempFacilityGapsListDto = [];
    // this.tempFacilityGapsListDto = [...this.facilityGapsListDto];

    if (this.SelectedinsurancePLan == -1) {
      this.tempFacilityGapsListDto = this.facilityGapsListDto;
      this.filterPatientDto.payerId = 0;
      return;
    }
    if (this.SelectedinsurancePLan) {
      this.filterPatientDto.payerId = this.SelectedinsurancePLan.payerId;
      this.SelectedinsurancePLan.insuranceGapIds.forEach(x => {
       var gaps = this.allGapsListDto.find(gap => gap.id == x);
       if (gaps) {
         let tempGaps = {
          pcmMeasureInfoId: gaps.id,
          name: gaps.code + " " + gaps.measureName
         }
         this.tempFacilityGapsListDto.push(tempGaps);
       }
      })
    } else {
      this.filterPatientDto.payerId = 0;
      this.tempFacilityGapsListDto = new Array<FacilityGapsListDto>();
    }
    this.tempFacilityGapsListDto = this.tempFacilityGapsListDto.reduce((accumalator, current) => {
      if(!accumalator.some(item => item.pcmMeasureInfoId === current.pcmMeasureInfoId)) {
        accumalator.push(current);
      }
      return accumalator;
    },[]);
  }
  selectedDate(value: any, datepicker?: any) {
    datepicker.start = value.start;
    datepicker.end = value.end;
    this.filterPatientDto.lastDoneFrom = value.start.format('YYYY-MM-DD');
    this.filterPatientDto.lastDoneTo = value.end.format('YYYY-MM-DD');
    this.daterange.label = value.label;
    // this.filterPatients();
  }
  clearDate() {
    this.daterange = {};
    this.selectedDateRange = [];
    this.filterPatientDto.lastDoneFrom = '';
    this.filterPatientDto.lastDoneTo = '';
    // this.filterPatients();
  }
  fillCustomListValue(selectedCustomListId){
    this.filterPatientDto.customListId = selectedCustomListId;
    this.filterPatients();
  }
}
