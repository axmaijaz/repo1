import { NgForm } from '@angular/forms';
import { data } from 'jquery';
import { Item } from './../../model/Medicare/eob.model';
import { id } from '@swimlane/ngx-datatable';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { AwsService } from 'src/app/core/aws/aws.service';
import moment from 'moment';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { AppUiService } from 'src/app/core/app-ui.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { InsuranceService } from 'src/app/core/insurance.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { PagingData } from 'src/app/model/AppModels/app.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { AddInsurancePlanDto, CareGapDto, InsurancePlanDto, PayersListDto } from 'src/app/model/pcm/payers.model';
import { DocDataDto, EditMeasureDataParams, MeasureDto, PcmMeasureDataObj, PcmMeasureDto, GapStatus, PreventiveGapScreenParams, Status, MeasureInfoDto, FacilityGapsListDto, HeadersDto } from 'src/app/model/pcm/pcm.model';
import { SubSink } from 'src/app/SubSink';
import { AMScreeningDto } from 'src/app/model/pcm/pcm-alcohol.model';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { Location, NgTemplateOutlet } from "@angular/common";
import { environment } from 'src/environments/environment';
import { AllChronicDiseaseDto, ChronicIcd10CodeDto } from 'src/app/model/Patient/patient.model';
import { EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { ScheduleFlag } from 'src/app/Enums/pcm.enum';
import FileSaver from 'file-saver';
@Component({
  selector: 'app-pcm-care-gaps-list',
  templateUrl: './pcm-care-gaps-list.component.html',
  styleUrls: ['./pcm-care-gaps-list.component.scss']
})
export class PcmCareGapsListComponent implements OnInit {
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MM-DD-YYYY',
    appendTo: 'body',
  };
  currentDate = moment().format('YYYY-MM-DD')

  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body',
    // min: moment('YYYY-MM-DD')

  };
  public disableDatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: 'body',
    min: this.currentDate
  };
  // public datePickerConfigForSelectDate: IDatePickerConfig = {
  //   allowMultiSelect: false,
  //   returnedValueType: ECalendarValue.StringArr,
  //   format: 'YYYY-MM-DD',
  //   appendTo: 'body',
  //   min: moment('YYYY-MM-DD')

  // };

  filterPatientDto = new PreventiveGapScreenParams();
  private subs = new SubSink();
  rowIndex = 0;
  dtTrigger = new Subject<any>();
  objectURLStrAW: string;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;

  dtOptions: DataTables.Settings | any = {};
  dtSelect: DataTables.RowMethods | any = {};
  dtSeacrh: DataTables.SearchSettings = {};

  loadingOnStart: boolean;
  isLoading = true;
  selected: any[];
  rows = new Array<PcmMeasureDto>();
  selectedPatient = new PcmMeasureDto();
  pagingData = new PagingData();
  table = $('#example').DataTable();

  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  @ViewChild('pcmMOdel') pcmMOdel: ModalDirective;
  cronicDiseaseList = new Array<{ id: 0; algorithm: "" }>();
  gridCheckAll: boolean;
  rowId: any;
  @ViewChild('searchPatient') searchPatient: ElementRef;
  isLoadingPayersList: boolean;
  facilityId: number;
  insurancePLanList: InsurancePlanDto[];
  gapStatusENumList = this.datafilterService.getEnumAsList(GapStatus);
  CareGapsList: CareGapDto[];
  CareFacilitatorsList = new Array<CreateFacilityUserDto>();
  billingProviderList = new Array<CreateFacilityUserDto>();
  careCordinatorList: any[];
  searchWatch = new Subject<string>();
  searchParam: string;
  loadingPayers: boolean;
  PayersList = new Array<PayersListDto>();
  facilityUserId: number;
  public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'light-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true,
    scrollbarPosition: 'inside'
  };
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'hh:mm'
  };
  selectedMeasure = new MeasureDto();
  pcmModelLoading: boolean;
  selectedGapStatus: { name: string; value: number };
  pcmMOdelData = new PcmMeasureDataObj();
  tempStatusList = new Array<Status>();
  whoIsCovered: any;
  uploadImg: boolean;
  PatientId: number;
  docData = new DocDataDto();
  editingPcmData: boolean;
  isCreatingScreening: boolean;
  isCreatingAWEncounter: boolean;
  isCreatingCounselling: boolean;
  popupQustion = null;
  // CareProvidersList = new Array<CreateFacilityUserDto>();
  pagingObj = new Array<{display: string, active: boolean}>();
  measureInfoList = new Array<MeasureInfoDto>();
  tempMeasureInfoList = new Array<MeasureInfoDto>();
  SetQualityCheck: boolean;
  @ViewChild('form') form: NgForm;
  isDetectValueChanges = false;

  @Input() insurancePLanList1 = new Array<InsurancePlanDto>();
  tempFacilityGapsListDto1 = new Array<FacilityGapsListDto>();
  @Input() facilityGapsListDto1 = new Array<FacilityGapsListDto>();
  @Input() ccmStatusList1: any;
  @Input() cronicDiseaseList1 = new Array<AllChronicDiseaseDto>()
  @Input() tempCronicDiseaseList1 = new Array<AllChronicDiseaseDto>()
  @Input() careManagerList1 = new Array<CreateFacilityUserDto>();
  @Input() CareFacilitatorsList1 = new Array<CreateFacilityUserDto>();
  @Input() billingProviderList1 = new Array<CreateFacilityUserDto>();
  @Input() CareProvidersList1 = new Array<CreateFacilityUserDto>();
  @Input() allGapsListDto1 = new Array<CareGapDto>();
  cronicConditionsLIst = new Array<{ id: 0; algorithm: "" }>();
  // @Input() filterPatientDto = new PreventiveGapScreenParams();
  // @Input() filtersTemplate1: NgTemplateOutlet;
  // @Input() SelectedinsurancePLan1 = new InsurancePlanDto();
  SelectedinsurancePLan: any;

  daterange: any = {};
  selectedDateRange: any;
  public options: any = {
    locale: { format: 'MM-DD-YYYY',
    cancelLabel: 'Clear',
    // displayFormat: 'DD-MM-YYYY'
  },
    alwaysShowCalendars: false,
  };
  // ccmStatusList: any;
  facilityGapsListDto = new Array<FacilityGapsListDto>();
  GapStatusEnumList: { number: string; word: string; }[];
  ScheduleFlagEnumList: { number: string; word: string; }[];
  patientSchedulingNote: string;
  isIncludeGapDetails: boolean;
  headers = new Array<string>();
  disableChronicFilter: boolean;
  LoadingData: boolean;
  // tempFacilityGapsListDto = new Array<FacilityGapsListDto>();

  constructor(private pcmService: PcmService, private datafilterService: DataFilterService, private patientService: PatientsService,
    private insuranceService: InsuranceService, private facilityService: FacilityService, private location: Location,
    private appUi: AppUiService, private securityService: SecurityService, private toaster: ToastService, private router: Router,
    private sanatizer: DomSanitizer,private awsService: AwsService,private awService: AwService,private eventBusService: EventBusService,) { }

    ngOnInit() {
    // this.filterPatientDto.CareProviderId = 0;
    // this.filterPatientDto.FacilityUserId = 0;
    this.SelectedinsurancePLan = -1;
  this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
  this.dtSelect = {
    select: true,
  };
  this.filterPatientDto.pageSize = 10;
  if (
    this.securityService.securityObject.userType === UserType.FacilityUser
  ) {
   this.facilityUserId = this.securityService.securityObject.id;
  } else {
    this.filterPatientDto.facilityUserId = 0;
  }

  // this.getFacilityGaps();
    this.getScheduleFlagArray();
    this.GetAllMeasureInfos();
    this.initializeDataTable();
    // this.GetInsurancePlansByFacilityId();
    // this.getCronicDiseases();
    // this.GetAllCareGaps();
    this.GetCareFacilitatorsByFacilityId();
    this.getCareCordinatorFacilityUsers();
    this.SearchObserver();
    // this.getScheduleFlagArray();
    this.getGapStatusArray();
    this.getDependentDiseases('');
    this.getCronicConditions();
    // this.getBillingProviderList();
    // this.getCareProviders();
    // this.insuranceGaps();
    // this.tempFacilityGapsListDto = [...this.facilityGapsListDto1];
    this.eventBusService.on(EventTypes.refreshQualityMeasureTab).subscribe((res) => {
      this.resetFilter();
      this.filterPatients();
      });
      setTimeout(() => {

      }, 500);
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
    this.cronicDiseaseList1 = new Array<ChronicIcd10CodeDto>();
    this.patientService.GetChronicDiseaseCodes(id).subscribe(
      (res: any) => {
        this.LoadingData = false;
        this.cronicDiseaseList1 = res;
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
  assignFacilityGapsDto() {
    if (this.SelectedinsurancePLan == -1) {
      this.tempFacilityGapsListDto1 = this.facilityGapsListDto1;
    }

  }
  filteredByGaps() {
      this.measureInfoList.forEach(x => {
        x['tempCheck'] = false;
        x['isShowColumn'] = true;
      })
    if (this.SelectedinsurancePLan && this.tempFacilityGapsListDto1.length > 0 && this.filterPatientDto.gapIds.length == 0) {
      this.tempFacilityGapsListDto1.forEach(gaps => {
        this.rows.forEach(patient => {
          patient.measureInfoList.forEach(pMeasure => {
            if (gaps.pcmMeasureInfoId == pMeasure.id) {
              pMeasure['isShowColumn'] = true;
              pMeasure['tempCheck'] = true;
            } else if (gaps.pcmMeasureInfoId !== pMeasure.id && !pMeasure['tempCheck']) {
              pMeasure['isShowColumn'] = false;
            }
          });
        });
        this.measureInfoList.forEach(measure => {
          if (gaps.pcmMeasureInfoId == measure.id) {
            measure['isShowColumn'] = true;
            measure['tempCheck'] = true;
          } else if (gaps.pcmMeasureInfoId !== measure.id && !measure['tempCheck']) {
            measure['isShowColumn'] = false;
          }
        });
      });
    } else if (this.filterPatientDto.gapIds.length > 0) {
      this.filterPatientDto.gapIds.forEach(gapsId => {
        this.rows.forEach(patient => {
          patient.measureInfoList.forEach(pMeasure => {
            if (gapsId == pMeasure.id) {
              pMeasure['isShowColumn'] = true;
              pMeasure['tempCheck'] = true;
            } else if (gapsId !== pMeasure.id && !pMeasure['tempCheck']) {
              pMeasure['isShowColumn'] = false;
            }
          });
        });
        this.measureInfoList.forEach(measure => {
          if (gapsId == measure.id) {
            measure['isShowColumn'] = true;
            measure['tempCheck'] = true;
          } else if (gapsId !== measure.id && !measure['tempCheck']) {
            measure['isShowColumn'] = false;
          }
        });
      });
    } else {
        this.rows.forEach(patient => {
          patient.measureInfoList.forEach(pMeasure => {
              pMeasure['isShowColumn'] = true;
              pMeasure['tempCheck'] = false;

          });
        });
    }

  }
  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      this.searchParam = x;
      this.GetAllPayers();
    });
  }
  filterChronicDisease(event?) {
    this.cronicDiseaseList1 = new Array<AllChronicDiseaseDto>();
    if (event && event.term) {
      const val = event.term.toLowerCase();
    // filter our data
      const temp = this.tempCronicDiseaseList1.filter(function(d) {
      return d.detail.toLowerCase().indexOf(val) !== -1 || !val;
    });
       temp.slice(0, 10).map((item, i) => {
      this.cronicDiseaseList1.push(item);
       });
      // this.cronicDiseaseList = this.tempCronicDiseaseList.filter(x => x.detail == data.term);
    } else {

      this.tempCronicDiseaseList1.slice(0, 10).map((item, i) => {
        this.cronicDiseaseList1.push(item);
      });
    }
    // if (this.cronicDiseaseList && this.cronicDiseaseList.length > 10) {

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
  }
  // getCareProviders() {
  //   if (!this.facilityId) {
  //     this.facilityId = 0;
  //   }
  //   this.subs.sink = this.facilityService
  //     .GetCareProvidersByFacilityId(this.facilityId)
  //     .subscribe(
  //       (res: any) => {
  //         if (res) {
  //           this.CareProvidersList = res;
  //         }
  //       },
  //       (error) => {}
  //     );
  // }
  GetAllMeasureInfos() {
    this.subs.sink = this.pcmService.GetAllMeasureInfos()
      .subscribe(
        (res: any) => {
          if (res) {
            // this.CareProvidersList = res;
            this.tempMeasureInfoList = [...res];
            this.measureInfoList = [...res];
            // this.initializeDataTable();
          }
        },
        (err: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
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
          'DataTables_PCMCG' + window.location.pathname,
          JSON.stringify(oData)
        );
      },
      stateLoadCallback: function (oSettings) {
        return JSON.parse(
          localStorage.getItem('DataTables_PCMCG' + window.location.pathname)
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
        { targets: 1, orderable: true },
        { targets: 2, orderable: false },
        // { targets: 3, orderable: true },
        // { targets: 4, orderable: true },
        // { targets: 5, orderable: true },
        // { targets: 6, orderable: true },
        // { targets: 7, orderable: true },
        // { targets: 8, orderable: true },
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
          if (dataTablesParameters.start === 1) {
            dataTablesParameters.start = 0;
          }
          this.rowIndex = dataTablesParameters.start;
          // this.filterPatientDto.pageSize = dataTablesParameters.length;
          // this.filterPatientDto.pageNumber =
          //   dataTablesParameters.start / dataTablesParameters.length + 1;
          // this.filterPatientDto.pageNumber = Math.floor(
          //   this.filterPatientDto.pageNumber
          // );
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
        // this.filterPatientDto.pageSize = 15;
        this.loadingOnStart = false;
        this.isLoading = true;
        // this.filterPatientDto.lastDoneFrom = '';
        // this.filterPatientDto.lastDoneTo = '';
        // this.filterPatientDto.payerId = 0;
        this.nullChecking();
        this.subs.sink = this.pcmService
          .GetPcmPatients(this.filterPatientDto)
          .subscribe(
            (res: any) => {
              this.isLoading = false;
              this.selected = [];
              this.rows = new Array<PcmMeasureDto>();
              // this.rowIndex = this.filterPatientDto.rowIndex;
              // if (this.measureInfoList && this.measureInfoList.length) {
              //   res.patientsList.forEach(item => {
              //     if (item.measureInfoList.length < this.measureInfoList.length) {
              //       for (let index = 0; index < this.measureInfoList.length; index++) {
              //         const infoItem = item.measureInfoList.find(x => x.code === this.measureInfoList[index].code);
              //         if (!infoItem) {
              //           const newMeasure = new MeasureDto();
              //           newMeasure['notFOund'] = true;
              //           item.measureInfoList.splice(index, 0 , newMeasure);
              //         }
              //       }
              //     }
              //   });
              // }
              // this.headers = res.headers;
              this.rows = res.patientsList;
              this.filterdGapsHeadersAndData();
              // this.filteredByGaps();
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
              this.calculatePaging();
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
        // { name: 'checkBox' },
        { name: 'careGaps' },
        // { name: 'insurancePlan' },
        // { name: 'measure' },
        // { name: 'status' },
        // { name: 'lastDone' },
        // { name: 'nextDue' },
        // { name: 'result' },
        // { name: 'note' },
        // { name: 'action' },
      ],
    };
  }
  filterdGapsHeadersAndData() {
    let headers = new Array<HeadersDto>();
    this.rows.forEach(pat => {
      pat.measureInfoList.forEach(measure => {
        const IsExist = headers.find(x => x.id == measure.id);
        if (!IsExist && !measure.removeHeader) {

          const newHeader = new HeadersDto();
          newHeader.code = measure.code;
          newHeader.id = measure.id;
          newHeader.fullName = measure.measureName;
          // if (!newHeader.id) {
          // }
          headers.push(newHeader);
        }
      });
    });
    this.rows.forEach(patient => {
    let newMeasuresInfo = new Array<MeasureDto>();
      patient.measureInfoList.forEach(mea => {
        const isfindheader = headers.find(x => x.code == mea.code);
        if (isfindheader) {
          newMeasuresInfo.push(mea);
        }
      });
      patient.measureInfoList = newMeasuresInfo.sort((a, b) => a.id - b.id);
      // patient.measureInfoList = patient.measureInfoList.sort(x => x.id);

    })
    headers = headers.sort((a, b) => a.id - b.id);
    this.headers = headers.map(h => h.fullName);
  }
  calculatePaging() {
    const nPagingObj = [];
    const res = Math.ceil(this.pagingData.elementsCount / this.pagingData.pageSize);
    for (let index = 1; index <= res; index++) {
      const isActive = index === this.pagingData.pageNumber;
      const pObj = {
        display: index.toString(),
        active: isActive
      };
      nPagingObj.push(pObj);
    }
    this.pagingObj = nPagingObj;
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
    } else {
      const index = this.selected.findIndex((x) => x.patientId === row.patientId);
      this.selected.splice(index, 1);
    }
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
  navigateBack() {
    this.location.back();
  }

  // openConfirmModal(data: any) {
  //   const modalDto = new LazyModalDto();
  //   modalDto.Title = "Delete Record";
  //   modalDto.Text = "Are you sure to delete this record";
  //   modalDto.callBack = this.callBack;
  //   modalDto.data = data;
  //   this.appUi.openLazyConfrimModal(modalDto);
  // }
  // callBack = (data: any) => {
  //   this.deletePatientsMeasuresSummary(data);
  // }
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
  AddEditPatientSchedulingNote() {
    this.patientService.AddEditPatientSchedulingNote(this.selectedPatient.id, this.patientSchedulingNote).subscribe(
      (res: any) => {
        this.selectedPatient.patientSchedulingNote = res;
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

  GetAllCareGaps() {
    this.subs.sink = this.insuranceService.GetAllCareGaps().subscribe(
      (res: CareGapDto[]) => {
        this.CareGapsList = res;
      },
      (error: HttpResError) => {
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
  getCronicDiseases() {
    this.patientService.getChronicConditions().subscribe(
      (res: any) => {
        this.cronicDiseaseList = res;
      },
      err => {}
    );
  }
  onClickRow(row) {
    // this.patientsService.getPatientDetail(row)

    this.rowId = row.id;
      this.router.navigate(["/admin/patient/", row.id]);
    // if (row.profileStatus) {
    //   this.router.navigate(["/admin/patient/", row.id]);
    // } else {
    //   this.clickOnRow.show();
    //   // this.router.navigate(['/admin/addPatient/'+ row.id);
    //   // this.router.navigate(['/admin/addPatient/', row.id]);
    // }
  }
  gridAllRowsCheckBoxChecked(e) {
    this.rows.forEach((data: any) => {
      data.checked = e.target.checked;
    });
    if (e.target.checked) {
      this.selected = [];
      Object.assign(this.selected, this.rows);
    } else {
      this.selected = [];
    }
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
    this.filterPatientDto.tempChronicDiseasesIds = this.cronicDiseaseList1.map(x => x.id);
  } else {
    this.filterPatientDto.tempChronicDiseasesIds = [];
  }
}
  filterPatients() {
    this.filterPatientDto.facilityId = this.facilityId;
    this.filterPatientDto.facilityUserId = this.facilityUserId;
    this.isLoading = true;
    this.selectICDCodes();
    this.assignUserValues();
    this.rerender();
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
    this.filterPatientDto = new PreventiveGapScreenParams();
    // this.tempFacilityGapsListDto1 = new Array<FacilityGapsListDto>();
    this.tempFacilityGapsListDto1 = this.facilityGapsListDto1;
    this.filterPatientDto.pageNumber = 1;
    this.filterPatientDto.pageSize = 10;
    this.SelectedinsurancePLan = -1;
  }
  getMeasureDataByCode(pid: number, Item: MeasureDto, model: ModalDirective) {
    // this.currentCode = code
    this.pcmModelLoading = true;
    if (model) {
      model.show();
    }
    this.PatientId = pid;
    this.subs.sink = this.pcmService
      .GetPCMeasureData(this.PatientId, Item.code)
      .subscribe(
        (res: PcmMeasureDataObj) => {
          if (res) {
            if (res.lastDone) {
              res.lastDone = moment.utc(res.lastDone).local().format('YYYY-MM-DD');
            }
            if (res.nextDue) {res.nextDue = moment.utc(res.nextDue).local().format('YYYY-MM-DD'); }
            if (res.updatedOn) {res.updatedOn = moment.utc(res.updatedOn).local().format('YYYY-MM-DD HH:mm:ssZ'); }
            if (!res.eventDate || res.eventDate == '0001-01-01T00:00:00') {res.eventDate = moment.utc(this.currentDate).local().format('YYYY-MM-DD');
          } else {
            res.eventDate = moment.utc(res.eventDate).local().format('YYYY-MM-DD')
          }
            this.pcmMOdelData = res;
            if (!this.pcmMOdelData.scheduleFlag) {
              this.pcmMOdelData.scheduleFlag = null;
            }
            this.tempStatusList = this.pcmMOdelData.statusList;
            this.selectedGapStatus = this.tempStatusList.find(status => status.value === this.pcmMOdelData.currentStatus);
            console.log(this.selectedGapStatus);
            this.whoIsCovered = this.sanatizer.bypassSecurityTrustHtml(
              this.pcmMOdelData.whoIsCovered
            );
          } else {
            this.pcmMOdelData = new PcmMeasureDataObj();
          }
          this.pcmModelLoading = false;
        },
        (err: HttpResError) => {
          if (model) {model.hide();}
          this.pcmModelLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  onUploadOutput(output: any): void {
    if (output.target.files[0].size > 26214400) {
      this.toaster.warning('file size is more than 25 MB');
      return;
    }
    this.uploadImg = true;
    this.addPcDocument(output.target.files[0]);
  }
  addPcDocument(file: any) {
    this.uploadImg = true;
    let data = {
      title: file.name,
      code: this.selectedMeasure.code,
      patientId: this.PatientId
    };
    this.pcmService.addPcDocument(data).subscribe(
      (res: DocDataDto) => {
        this.docData = res;
        this.uploadPcmDocToS3(file);
      },
      (err: HttpResError) => {
        // this.editingPcmData = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  async uploadPcmDocToS3(file) {
    // if (this.patientRpmConsentType === 1) {
    // this.rpmInputLoading = true;
    const path = `pcmDocs/preventiveCare-${this.PatientId}/${file.name}`;
    this.awsService.uploadUsingSdk(file, path).then(
      data => {
        this.uploadImg = false;
        const newFile = {
          id: this.docData.id,
          title: file.name
         };
          this.pcmMOdelData.pcmDocuments.push(newFile);
        // this.getMeasureDataByCode(this.currentCode ,null);
      },
      err => {
        this.uploadImg = false;
        this.pcmService.addPCDocumentOnError(this.docData).subscribe(res => {
          if (res) {
            this.toaster.error(err.message, err.error || err.error);
          }
        });
      }
    );
    // }
  }
  valueChanges() {
    this.isDetectValueChanges = true;
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
  AddEditMeasureData(model: ModalDirective) {
    if (this.isDetectValueChanges) {
      const data = new EditMeasureDataParams();
      data.id = this.pcmMOdelData.id;
      data.patientId = this.PatientId;
      data.code = this.selectedMeasure.code;
      data.lastDone = this.pcmMOdelData.lastDone;
      data.nextDue = this.pcmMOdelData.nextDue;
      data.result = this.pcmMOdelData.result;
      data.controlled = this.pcmMOdelData.controlled;
      data.note = this.pcmMOdelData.note;
      data.careGapSchedule.scheduleFlag = this.pcmMOdelData.scheduleFlag;
      data.careGapSchedule.eventDate = this.pcmMOdelData.eventDate;
      data.careGapSchedule.scheduleNote = this.pcmMOdelData.scheduleNote;
      if (!this.pcmMOdelData.currentStatus) {
        this.pcmMOdelData.currentStatus = 0;
      }
      data.insuranceGapFlags = this.pcmMOdelData.insuranceGapFlags;
      data.currentStatus = this.pcmMOdelData.currentStatus;
      this.editingPcmData = true;
      this.subs.sink = this.pcmService.AddEditMeasureData(data).subscribe(
        (res: any) => {
          this.editingPcmData = false;
          this.filterPatients();
          this.toaster.success('Data updated successfully');
            model.hide();
        },
        (err: HttpResError) => {
          this.editingPcmData = false;
          this.toaster.error(err.error, err.message);
        }
      );

    } else {
      this.toaster.warning('No Changes Found');
    }
  }
  DeleteDoc(doc: any) {
    // this.pcmService.deletePCDocument(id).subscribe(res => {});
    this.pcmService.deletePCDocument(doc.id).subscribe(res => {
      // this.getMeasureDataByCode(this.currentCode ,null);
      this.pcmMOdelData.pcmDocuments = this.pcmMOdelData.pcmDocuments.filter(myfile => myfile.id !== doc.id);
      this.toaster.success('Deleted successfully');
    },
    (err: HttpResError) => {
      this.editingPcmData = false;
      this.toaster.error(err.error, err.message);
    });
  }
  viewDoc(doc: any) {
    // doc.path
      // const importantStuff = window.open("", "_blank");
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const importantStuff = window.open(nUrl);
      this.subs.sink = this.pcmService.getPublicPath(doc.path).subscribe(
        (res: any) => {
          this.isLoading = false;
          // // importantStuff.location.href = res;
          // var win = window.open(res, '_blank');
          // // win.opener = null;
          // win.focus();
          if (doc.path && doc.path.toLocaleLowerCase().includes('.pdf')) {
            fetch(res).then(async (fdata: any) => {
              const slknasl = await fdata.blob();
              const blob = new Blob([slknasl], { type: 'application/pdf' });
              const objectURL = URL.createObjectURL(blob);
              importantStuff.close();
              this.objectURLStrAW = objectURL;
              this.viewPdfModal.show();
              // importantStuff.location.href = objectURL;
              // window.open(objectURL, '_blank');
            });
          } else {
            // window.open(res, "_blank");
            importantStuff.location.href = res;
            // setTimeout(() => {
            //   importantStuff.close();
            // }, 2000);
          }
        },
        err => {
          this.isLoading = false;
          // this.preLoader = 0;
          this.toaster.error(err.error, err.message);
        }
      );
      }

  AddScreening() {
    if (this.selectedMeasure.code === 'AM') {
      this.AddAMScreening();
    } else if (this.selectedMeasure.code === 'DP') {
      this.AddDepressionScreening();
    }
  }
  AddCounselling() {
    if (this.selectedMeasure.code === 'AM') {
      this.AddAlcoholCounselling();
    } else if (this.selectedMeasure.code === 'DP') {
      this.AddDepressionCounselling();
    }
  }
  AddDepressionCounselling() {
    this.isCreatingCounselling = true;
    this.pcmService.AddDepressionCounseling(this.PatientId).subscribe((res: any) => {
      this.isCreatingCounselling = false;
      this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionCounselling/${res.id}`);
    },
    (err: HttpResError) => {
      this.isCreatingCounselling = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddAlcoholCounselling() {
    this.isCreatingCounselling = true;
    this.pcmService.AddAMCounseling(this.PatientId).subscribe((res: any) => {
      this.isCreatingCounselling = false;
      this.router.navigateByUrl(`/pcm/pcmAlcohol/${this.PatientId}/alcoholCounselling/${res.id}`);
    },
    (err: HttpResError) => {
      this.isCreatingCounselling = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddDepressionScreening() {
    this.isCreatingScreening = true;
    this.pcmService.AddDPScreening(this.PatientId).subscribe((res: AMScreeningDto) => {
      this.isCreatingScreening = false;
      this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionScreening/${res.id}`);
    },
    (err: HttpResError) => {
      this.isCreatingScreening = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddAMScreening() {
    this.isCreatingScreening = true;
    this.pcmService.AddAMScreening(this.PatientId).subscribe((res: AMScreeningDto) => {
      this.isCreatingScreening = false;
      this.router.navigateByUrl(`/pcm/pcmAlcohol/${this.PatientId}/alcoholScreening/${res.id}`);
    },
    (err: HttpResError) => {
      this.isCreatingScreening = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddAWEncounter() {
    this.isCreatingAWEncounter = true;
    this.awService.AddAWEncounter(this.PatientId).subscribe((res: number) => {
      this.isCreatingAWEncounter = false;
      this.router.navigateByUrl(`/annualWellness/AWMain/${this.PatientId}/${res}/awPatient`);
    },
    (err: HttpResError) => {
      this.isCreatingAWEncounter = false;
      this.toaster.error(err.error, err.message);
    });
  }
  popoverToggle(popover) {
      if(popover){
        popover.toggle();
      }
  }
  setCareGapQualityChecked(data: any) {
    this.SetQualityCheck = true;
    this.subs.sink = this.pcmService
      .SetCareGapQualityChecked(data.id)
      .subscribe(
        (res: any) => {
          data.qualityChecked = true;
          this.pcmMOdelData.updatedOn = new Date();
          this.rows.forEach(patient => {
            if (patient.id === this.PatientId) {
              patient.measureInfoList.forEach(measure => {
                if (this.selectedMeasure.code === measure.code) {
                  measure.qualityChecked = true;
                }
              });
            }
          });
          this.pcmMOdel.hide();
          this.SetQualityCheck = false;
        },
        (err: HttpResError) => {
          this.SetQualityCheck = false;
          this.toaster.error(err.error, err.message);
        }
      );
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
  insuranceGaps() {
    this.filterPatientDto.gapIds = [];
    this.tempFacilityGapsListDto1 = [];
    if (this.SelectedinsurancePLan === null) {
      this.SelectedinsurancePLan = -1;
    }
    // this.tempFacilityGapsListDto1 = [...this.facilityGapsListDto1];
    if (this.SelectedinsurancePLan == -1) {
      this.tempFacilityGapsListDto1 = this.facilityGapsListDto1;
      this.filterPatientDto.payerId = 0;
      return;
    }
    if (this.SelectedinsurancePLan) {
    this.filterPatientDto.payerId = this.SelectedinsurancePLan.payerId;
    this.SelectedinsurancePLan.insuranceGapIds.forEach(x => {
      var gaps = this.allGapsListDto1.find(gap => gap.id == x);
      if (gaps) {
        let tempGaps = {
         pcmMeasureInfoId: gaps.id,
         name: gaps.code + " " + gaps.measureName
        }
        this.tempFacilityGapsListDto1.push(tempGaps);
      }
    });
  } else {
    this.filterPatientDto.payerId = 0;
    this.tempFacilityGapsListDto1 = new Array<FacilityGapsListDto>();
  }
    // this.tempFacilityGapsListDto1 = this.tempFacilityGapsListDto1.reduce((accumalator, current) => {
    //   if(!accumalator.some(item => item.pcmMeasureInfoId === current.pcmMeasureInfoId)) {
    //     accumalator.push(current);
    //   }
    //   return accumalator;
    // },[]);
  }

}
