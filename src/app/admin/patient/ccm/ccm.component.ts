import { DataFilterService } from 'src/app/core/data-filter.service';
import { DatePipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { AppDataService } from 'src/app/core/app-data.service';
import { ClonerService } from 'src/app/core/cloner.service';
import {
  EmitEvent,
  EventBusService,
  EventTypes,
} from 'src/app/core/event-bus.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { QuestionnaireService } from 'src/app/core/questionnaire.service';
import { RpmService } from 'src/app/core/rpm.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { StatementManagementService } from 'src/app/core/statement-management.service';
import { UserManagerService } from 'src/app/core/UserManager/user-manager.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import {
  CcmEncounterForList,
  CcmEncounterListDto,
  ChangeMonthlyCcmStatus,
  Language,
} from 'src/app/model/admin/ccm.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { RPMEncounterDto, SetIsBleEnabled } from 'src/app/model/rpm.model';
import { AppUserClaim } from 'src/app/model/security/app-user-claim';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { SubSink } from 'src/app/SubSink';
import { CcmDataService } from '../../../core/ccm-data.service';
import { CcmServiceType } from '../../../model/Questionnaire/Questionnire.model';
import { TcmDataService } from 'src/app/tcm-data.service';
import { TcmStatusEnum, tcmStatus2Enum } from 'src/app/model/Tcm/tcm.enum';
import { AddTcmEncounterDto } from 'src/app/model/Tcm/tcm.model';
import { CcmStatusChangeDto, EditPatientPreferencesDto, PatientDto } from 'src/app/model/Patient/patient.model';
import { BhiService } from 'src/app/core/bhi.service';
import { BhiEncounterDto } from 'src/app/model/Bhi/bhi.model';
import { BhiStatusEnum } from 'src/app/Enums/bhi.enum';
import { CcmMonthlyStatus, CcmStatus, RpmStatus } from 'src/app/Enums/filterPatient.enum';
import { PcmStatus } from 'src/app/Enums/pcm.enum';
import { PRCMStatusEnum } from 'src/app/model/Prcm/Prcm.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
@Component({
  selector: 'app-ccm',
  templateUrl: './ccm.component.html',
  providers: [DatePipe],
  styleUrls: ['./ccm.component.scss'],
})
export class CcmComponent implements OnInit, OnDestroy {
  @ViewChild('timerInput') TimerInput: ElementRef;
  @ViewChild('durationInput') durationInput: ElementRef;
  @ViewChild('unApprovedCarePLanModal') unApprovedCarePLanModal: ModalDirective;
  @ViewChild('IsRevokedModal') IsRevokedModal: ModalDirective;
  followUpDataObj = {
    patientId: 0,
    followUpDate: '',
    recentPcpAppointment: '',
    recentHospitalizationDate: '',
    lastTcmStatus: tcmStatus2Enum,
    lastTcmEncounterId: 0,
  };
  languageList = new Array<Language>();
  notesRowSize = 3;
  providerList = new Array<CreateFacilityUserDto>();
  serviceTypes = new Array<CcmServiceType>();
  ccmEncounterList: CcmEncounterForList;
  rpmEncounterDto = new RPMEncounterDto();
  rpmEncounterList = new Array<RPMEncounterDto>();
  bhiEncounterDto: any;
  PatientId: number;
  loading = false;
  consentDate: string;
  stopCounterOnDuration = true;
  followUpDate: string;
  isBluetoothEnabled: boolean;
  editPatientPreferencesDto = new EditPatientPreferencesDto()
  setIsBleEnabledDto = new SetIsBleEnabled();
  currentMonth: number = new Date().getMonth() + 1;
  encounterTimeForm: FormGroup;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MMM DD, YYYY hh:mm A',
  };
  public onlydatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MMM DD, YYYY',
  };
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'hh:mm',
  };
  public displayDate;
  seleteddate = new Date();
  monthId: number = new Date().getMonth() + 1;
  rpmMonthId: number = new Date().getMonth() + 1;
  bhiMonthId: number = new Date().getMonth() + 1;
  yearNum: number;
  bhiYearNum: number;
  listOfYears = [];
  language = "";
  // for timer properties
  timer = 0;
  firstimeTimerStart = true;
  timerStart = false;
  divide = 1000;
  myInterval = -1;
  seconds = 0;
  minutes = 0;
  hours = 0;
  PatientData: PatientDto;
  PatientAge: number;
  facilityId: number;
  billingProviders = new Array<CreateFacilityUserDto>();
  selectedBillingProvider = new CreateFacilityUserDto();
  password = '';
  canAddEncounter = false;
  currentdate: string;
  totalTime: string;
  startingTime: string;
  initiaTimeStr = '';
  isCarePlanApproved = false;
  rpmEncounterTime = '';
  bhiEncounterTime = '';
  showAlertFEncounter = false;
  addingEncounter: boolean;
  isLoading = true;
  private subs = new SubSink();
  isOpenCollapse: boolean;
  MReview: string;
  creatingTcm: boolean;
  lastTcmStatus: number;
  tcmStatusEnum = tcmStatus2Enum;
  lastTcmEncounterId = 0;
  textFor: string;
  addTcmEncounterDto = new AddTcmEncounterDto();
  addBhiEncounterDto = new BhiEncounterDto();
  IsaddingEncounterLoading: boolean;
  isLoadingUsers: boolean;
  facilityUsersList = new Array<CreateFacilityUserDto>();
  CcmMonthlyStatusList = this.filterDataService.getEnumAsList(CcmMonthlyStatus);
  ccmStatusChangeDto = new CcmStatusChangeDto();
  ccmMonthlyStatusChangeDto = new ChangeMonthlyCcmStatus();
  ccmStatusList: any;
  durationNO: number;
  bhiStatusEnum = BhiStatusEnum;
  ccmStatus = CcmStatus;
  pcmStatus = PcmStatus;
  bhiStatus = BhiStatusEnum;
  prCMStatus = PRCMStatusEnum;
  tcmStatus = TcmStatusEnum;
  rpmStatus = RpmStatus;
  PatientForm: FormGroup;
  public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'light-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true,
    scrollbarPosition: 'inside'
  };
  bhiINfoHtml = `<ul>
  <li>1.If patient BHI Status is “Active CoCM”, CPT 99492 and CPT 99493 will be populated.
  a.	In case there is no previous encounter for that patient in database CPT 99492 will be selected by default.
  b.	In case patient has any previous encounter history CPT 99493 will be selected by default.
  </li>
  <li>2.If patient BHI Status is “Active G-BHI”, only one selection will be available which is CPT 99484.</li>
  </ul>
  `;
  // differeence:string;
  constructor(
    private route: ActivatedRoute,
    private rpmService: RpmService,
    private eventBus: EventBusService,
    private facilityService: FacilityService,
    private patientsService: PatientsService,
    private ccmService: CcmDataService,
    private cloneService: ClonerService,
    private questionService: QuestionnaireService,
    private securityService: SecurityService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private filterDataService: DataFilterService,
    private toaster: ToastService,
    private userManagerService: UserManagerService,
    private router: Router,
    private statementManagementService: StatementManagementService,
    private appDataService: AppDataService,
    private tcmSevice: TcmDataService,
    private bhiService: BhiService,
    private appUi: AppUiService,
    private ccmDataService: CcmDataService
  ) {}

  public doughnut = 'doughnut';
  public pie = 'doughnut';

  public doughnutchartDatasets: Array<any> = [
    {
      data: [],
      label: 'My First dataset',
    },
  ];

  public doughnutchartLabels: Array<any> = ['Time Completed', 'Time Left'];

  public doughnutchartColors: Array<any> = [
    {
      backgroundColor: ['#1d3d71', '#ccc'],
      hoverBackgroundColor: ['#1d3d71', '#ccc'],
    },
  ];

  public chartOptions: any = {
    responsive: true,
    legend: {
      labels: {
        // This more red font property overrides the global property
        defaultFontSize: 10,
        usePointStyle: true,
        padding: 10,
      },
      position: 'top',
    },
    weight: 2,
  };
  public dropdownScroll = {
    axis: 'y',
    theme: 'dark-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    scrollbarPosition: 'outside',
  };
  // public scrollbarOptions = { axis: 'y', theme: 'minimal-dark' };
  ngOnInit() {
    this.yearNum = this.appDataService.currentYear;
    this.bhiYearNum = this.appDataService.currentYear;
    this.listOfYears = this.appDataService.listOfYears;
    // this.PatientId = +this.route.parent.snapshot.paramMap.get('id');
    // this.statementManagementService.quickNotesPatientId = this.PatientId;
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    if (!this.PatientId) {
      this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get("id");
    }
    this.encounterTimeForm = this.fb.group({
      id: 0,
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      encounterDate: [
        this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
        Validators.required,
      ],
      note: [''],
      ccmServiceTypeId: [null, Validators.required],
      patientId: this.PatientId,
      appAdminId: 1,
      careProviderId: [null, Validators.required],
      careProviderName: '',
    });
    if (this.statementManagementService.timerStart) {
      const currentdate = moment().format('hh:mm:ss');
      const starttime = this.statementManagementService.counterStartingTime;
      // starttime.fromNow()
      const previous = moment(starttime, 'hh:mm:ss');
      const pre = moment(previous, 'hh:mm:ss');
      const current = moment(currentdate, 'hh:mm:ss');
      const result = moment.duration(current.diff(pre));
      this.initiaTimeStr = moment(
        result.hours().toString() +
          ':' +
          result.minutes().toString() +
          ':' +
          result.seconds().toString(),
        'hh:mm:ss'
      ).format('hh:mm:ss');
      // this.totalTime = moment(this.totalTime, 'hh:mm:ss');
      this.hours = moment(result.hours(), 'hh').hours();
      this.minutes = moment(result.minutes(), 'mm').minutes();
      this.seconds = moment(result.seconds().toString(), 'ss').seconds();
      this.startTimer();
    }
    this.checkIfCareplanApproved();

    this.subs.sink = this.questionService.getServiceTypeList(false).subscribe(
      (res: any) => {
        this.serviceTypes = res;
      },
      (err) => {
        // console.log(err);
      }
    );
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
      this.getBillingProviders();
    } else {
      this.facilityId = 0;
    }

    this.canAddEncounter = this.securityService.hasClaim('CanModifyRPMEncounter');

    const date = moment().format('hh:mm');
    this.addBhiEncounterDto.startTime = date;
    const date1 = moment().format('YYYY-MM-DD');
    this.addBhiEncounterDto.encounterDate = date1;
    // if(this.securityService.getClaim("BHI Care Manager").claimValue) {
    //   this.addBhiEncounterDto.bhiCareManagerId = this.securityService.securityObject.id;
    // }
    if (this.securityService.getClaim('IsBHICareManager') && this.securityService.getClaim('IsBHICareManager').claimValue) {
      this.addBhiEncounterDto.bhiCareManagerId = this.securityService.securityObject.id;
    }
    if (this.securityService.getClaim('IsBhiCareCoordinator') && this.securityService.getClaim('IsBhiCareCoordinator').claimValue) {
      this.addBhiEncounterDto.bhiCareCoordinatorId = this.securityService.securityObject.id;
    }
    if (this.securityService.getClaim('IsPsychiatrist') && this.securityService.getClaim('IsPsychiatrist').claimValue) {
      this.addBhiEncounterDto.psychiatristId = this.securityService.securityObject.id;
    }

    this.getLogsByPatientAndMonthId(this.PatientId, this.currentMonth);
    this.loadProviders();
    this.gertPatientData();
    this.getFollowUpDate();
    this.getLogsByPatientAndMonthIdRPM();
    this.getBhiEncountersByPatientId();
    this.getRpmEncounterTime();
    // this.GetBhiEncountersDurationByPatientId();
    this.getCcmStatus();
    this.getFacilityUsers();
    this.isBleEnabled();
    this.getLanguages();
  }
  addBhiEncounter() {
    this.IsaddingEncounterLoading = true;
    if (this.PatientData && this.PatientData.bhiStatus == 4) {
     this.addBhiEncounterDto.psychiatristId = null;
    } else {
      this.addBhiEncounterDto.gbhiPsychiatrist = '';
    }
    this.addBhiEncounterDto.patientId = this.PatientId;
    this.bhiService.AddBhiEncounter(this.addBhiEncounterDto).subscribe(
      (res: []) => {
       //  this.psyfacilityUserList = res;
      this.resetEncounterForm();
       this.toaster.success('Encounter added successfully');
       this.getBhiEncountersByPatientId();
        this.IsaddingEncounterLoading = false;
      },
      (error: HttpResError) => {
       this.IsaddingEncounterLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  resetEncounterForm() {
    this.addBhiEncounterDto = new BhiEncounterDto();
        const date = moment().format('hh:mm');
        this.addBhiEncounterDto.startTime = date;
        const date1 = moment().format('YYYY-MM-DD');
        this.addBhiEncounterDto.encounterDate = date1;

    if(this.securityService.getClaim('IsBHICareManager') && this.securityService.getClaim('IsBHICareManager').claimValue) {
      this.addBhiEncounterDto.bhiCareManagerId = this.securityService.securityObject.id;
    }
    if(this.securityService.getClaim('IsBhiCareCoordinator') && this.securityService.getClaim('IsBhiCareCoordinator').claimValue) {
      this.addBhiEncounterDto.bhiCareCoordinatorId = this.securityService.securityObject.id;
    }
    if(this.securityService.getClaim('IsPsychiatrist') && this.securityService.getClaim('IsPsychiatrist').claimValue) {
      this.addBhiEncounterDto.psychiatristId = this.securityService.securityObject.id;
    }
    if (this.PatientData.bhiStatus === this.bhiStatusEnum['Active G-BHI']) {
      this.addBhiEncounterDto.cptCode = '99484';
    }
        this.durationNO = null;
  }

  gertPatientData() {
    this.isLoading = true;
    if (this.PatientId) {
      this.subs.sink = this.patientsService
        .getPatientDetail(this.PatientId)
        .subscribe(
          (res: any) => {
            if (res) {
              this.isLoading = false;
              this.PatientData = res;
              this.editPatientPreferencesDto.preferredLanguage =  this.PatientData.preferredLanguage;
              this.editPatientPreferencesDto.bestTimeToCall =  this.PatientData.bestTimeToCall;
              if (this.PatientData.bhiStatus === this.bhiStatusEnum['Active G-BHI']) {
                this.addBhiEncounterDto.cptCode = '99484';
              }
              this.PatientAge = this.calculateAge(this.PatientData.dateOfBirth);

              // this.PatientData.chronicDiseasesIds
            }
          },
          (error) => {
            this.isLoading = false;
            // console.log(error);
          }
        );
    }
  }
  checkCcmRevoked() {
    if (this.PatientData.isCCMRevoked) {
      // return;
      this.textFor = 'ccm';
      this.IsRevokedModal.show();
    } else {
      // this.ccmStatusModal.show();
      this.checkdiagnoseidssForMR2(this.PatientId);
    }
  }
  toggleCheckCcmRevoked() {
    if (this.PatientData.isCCMRevoked) {
      // return;
      this.textFor = 'ccm';
      this.IsRevokedModal.show();
      return;
    }
  }
  toggleCheckRpmRevoked(rpmEncounter) {
    if (this.PatientData.isRPMRevoked) {
      // return;
      this.textFor = 'rpm';
      this.IsRevokedModal.show();
    } else {
      rpmEncounter.toggle();
    }
  }
  toggleCheckBhiRevoked(bhiEncounter) {
    if (this.PatientData.isBHIRevoked) {
      // return;
      this.textFor = 'bhi';
      this.IsRevokedModal.show();
    } else {
      bhiEncounter.toggle();
    }
  }
  // toggleCheckRpmRevoked(bhiEncounter) {
  //   if (this.PatientData.isRPMRevoked) {
  //     // return;
  //     this.textFor = "rpm";
  //     this.IsRevokedModal.show();
  //   } else {
  //     bhiEncounter.toggle();
  //   }
  // }
  checkRpmRevoked() {
    if (this.PatientData.isRPMRevoked) {
      // return;
      this.textFor = 'rpm';
      this.IsRevokedModal.show();
    } else {
      // this.ccmStatusModal.show();
      this.checkdiagnoseid(this.PatientId);
    }
  }
  checkBhiRevoked() {
    if (this.PatientData.isBHIRevoked) {
      // return;
      this.textFor = 'bhi';
      this.IsRevokedModal.show();
    } else {
      // this.ccmStatusModal.show();
      this.router.navigateByUrl(`/bhi/bhiEncounters/${this.PatientData.id}?psychiatristId=${this.PatientData.psychiatristId}&bhiCareManagerId=${this.PatientData.bhiCareManagerId}&bhiStatus=${this.PatientData.bhiStatus}`);
    }
  }
  async checkIfCareplanApproved() {
    const result = await this.patientsService
      .IsCarePlanApproved(this.PatientId)
      .subscribe(
        (res: any) => {
          this.isCarePlanApproved = res;
          return this.isCarePlanApproved;
        },
        (error) => {
          this.isCarePlanApproved = false;
          this.toaster.error(error.message, error.error || error.error);
          return this.isCarePlanApproved;
        }
      );
    this.subs.sink = result;
    return result;
  }
  checkdiagnoseidss(patientid: number) {
    this.isOpenCollapse = false;
    if (
      this.PatientData.chronicDiagnosesIds.length > 1 &&
      this.PatientData.profileStatus === true
    ) {
      if (this.isCarePlanApproved === false) {
        this.checkIfCareplanApproved();
        this.unApprovedCarePLanModal.show();
        return;
      }
      this.router.navigateByUrl('/admin/CpQuestions/' + patientid);
    } else {
      if (this.PatientData.profileStatus === false) {
        this.router.navigate(['/admin/addPatient/' + this.PatientId]);
        this.toaster.warning('Please complete profile before proceed.');
        return;
      } else {
        this.router.navigate(["/admin/patient/" + this.PatientId +"/pDetail/pDiagnoses"]);
            this.toaster.warning(
              "Please add chronic diseases before proceeding."
            );
        return;
      }
    }
  }
  checkdiagnoseidssForMR2(patientid: number) {
    this.isOpenCollapse = false;
    if (
      this.PatientData.chronicDiagnosesIds.length > 1 &&
      this.PatientData.profileStatus === true
    ) {
      if (this.isCarePlanApproved === false) {
        this.checkIfCareplanApproved();
        this.unApprovedCarePLanModal.show();
        return;
      }
      this.router.navigateByUrl('/patientMr/' + patientid + '/monthlyReview');
    } else {
      if (this.PatientData.profileStatus === false) {
        this.router.navigate(['/admin/addPatient/' + this.PatientId]);
        this.toaster.warning('Please complete profile before proceed.');
        return;
      } else {
        this.router.navigate(["/admin/patient/" + this.PatientId +"/pDetail/pDiagnoses"]);
            this.toaster.warning(
              "Please add chronic diseases before proceeding."
            );
        return;
      }
    }
  }
  navigateToMonthlyReview() {
    if (this.MReview === 'mr1') {
      this.router.navigateByUrl('/admin/CpQuestions/' + this.PatientId);
    } else {
      this.router.navigateByUrl(
        '/patientMr/' + this.PatientId + '/monthlyReview'
      );
    }
  }

  checkCareplanApproval(encounterCollapse, openCollapse?: boolean) {
    this.toggleCheckCcmRevoked();
    if (!this.PatientData.isCCMRevoked) {
      this.isOpenCollapse = false;
      if (openCollapse) {
        this.isOpenCollapse = true;
      }
      if (this.PatientData.profileStatus === false) {
        this.router.navigate(['/admin/addPatient/' + this.PatientId]);
        this.toaster.warning('Please complete profile before proceed.');
        return;
      } else if (this.PatientData.chronicDiagnosesIds.length < 2) {
        this.router.navigate(["/admin/patient/" + this.PatientId +"/pDetail/pDiagnoses"]);
        this.toaster.warning(
          "Please add chronic diseases before proceeding."
        );
        return;
      }
      if (this.isCarePlanApproved === false) {
        this.checkIfCareplanApproved().then(() => {
          if (this.isCarePlanApproved === false) {
            this.unApprovedCarePLanModal.show();
          } else {
            encounterCollapse.toggle();
          }
        });
      } else {
        encounterCollapse.toggle();
      }
    }
  }
  checkdiagnoseid(patientid: number) {
    // if (this.PatientData.chronicDiseasesIds.length > 1) {
    this.router.navigateByUrl('/rpm/PatientRpm/' + patientid);
    // routerLink='/rpm/PatientRpm/{{PatientId}}'
    // } else {
    //   // this.router.navigateByUrl('/admin/addPatient/' + patientid + '?setActive=3');
    //   this.router.navigate(['/admin/addPatient/' + patientid], { queryParams: { setActive: 3 } });
    //   this.toaster.warning('Please complete chronic diseases profile before proceed.');
    // }
  }

  public calculateAge(birthdate: any): number {
    return moment().diff(birthdate, 'years');
  }
  loadProviders() {
    // this.userManagerService.getGetCareProviderList().subscribe(
    // this.facilityService.getFacilityUserList(this.facilityId).subscribe(
    this.subs.sink = this.facilityService
      .getCareProvidersByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.providerList = res;
            this.encounterTimeForm
              .get('careProviderId')
              .setValue(this.securityService.securityObject.id);
          }
        },
        (error) => {
          // console.log(error);
        }
      );
  }
  durationChanged(minsToAdd: number) {
    const startTime = this.encounterTimeForm.get('startTime').value;
    function D(J) {
      return (J < 10 ? '0' : '') + J;
    }
    const piece = startTime.split(':');
    const mins = piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ':' + D(mins % 60);
    this.encounterTimeForm.get('endTime').setValue(newTime);
  }
  bhiDurationChanged(minsToAdd: number) {
    const startTime = this.addBhiEncounterDto.startTime;
    function D(J) {
      return (J < 10 ? '0' : '') + J;
    }
    const piece: any = startTime.split(':');
    const mins = piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ':' + D(mins % 60);
    // this.encounterTimeForm.get('endTime').setValue(newTime);
    this.addBhiEncounterDto.endTime = newTime;
  }
  getFacilityUsers() {
    // let roleName = "PRCM Care Manager";
    this.isLoadingUsers = true;
    this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      (res: []) => {
        this.facilityUsersList = res;
        this.isLoadingUsers = false;
      },
      (error: HttpResError) => {
        this.isLoadingUsers = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

  SubmitEncounterTimeForm() {
    if (this.timerStart) {
      this.stopTimer();
    }
    // const encounterDate = this.encounterTimeForm.get('encounterDate').value;
    // const splitedarray = encounterDate.split('-');
    // const actualDate =
    //   splitedarray[1] + '-' + splitedarray[0] + '-' + splitedarray[2];
    // this.encounterTimeForm.get('encounterDate').setValue(actualDate);
    const a = this.encounterTimeForm.value;
    if (!this.validaeTimeDifference(a)) {
      this.showAlertFEncounter = true;
      setTimeout(() => {
        this.showAlertFEncounter = false;
      }, 5000);
      return;
    }
    this.addingEncounter = true;
    this.loading = true;
    this.subs.sink = this.ccmService.addCCMEncounter(a, this.PatientData.ccmMonthlyStatus).subscribe(
      (res: CcmEncounterListDto) => {
        this.loading = false;
        this.addingEncounter = false;
        this.encounterTimeForm.get('startTime').setValue('');
        this.encounterTimeForm.get('endTime').setValue('');
        this.encounterTimeForm.get('note').setValue('');
        this.encounterTimeForm.get('ccmServiceTypeId').setValue(null);
        this.getLogsByPatientAndMonthId(this.PatientId, this.currentMonth);
        // this.ccmEncounterList.ccmEncountersList.unshift(res);
      },
      (err) => {
        this.encounterTimeForm.get('startTime').setValue('');
        this.encounterTimeForm.get('endTime').setValue('');
        this.encounterTimeForm.get('note').setValue('');
        this.toaster.error(err.message, err.error || err.error);
        this.loading = false;
        this.addingEncounter = false;
      }
    );
  }
  validaeTimeDifference(a: any): boolean {
    const sTime = moment(a.startTime, 'hh:mm');
    const eTime = moment(a.endTime, 'hh:mm');
    const res = sTime.isBefore(eTime);
    return res;
  }

  searchLogsByMonth() {
    this.getLogsByPatientAndMonthId(this.PatientId, this.currentMonth);
  }

  getLogsByPatientAndMonthId(patientId, monthId) {
    if (patientId && monthId) {
      this.subs.sink = this.ccmService
        .getCCMEncounterByPatientId(patientId, monthId, this.yearNum)
        .subscribe(
          (res) => {
            this.ccmEncounterList = res;
            const hours = +this.ccmEncounterList.ccmTimeCompleted.split(':')[0];
            const val = +this.ccmEncounterList.ccmTimeCompleted.split(':')[1];
            const tempArr = [];
            if (hours && hours > 0) {
              tempArr.push(val + hours * 60);
              tempArr.push(60 - 60);
            } else {
              tempArr.push(val);
              tempArr.push(60 - val);
            }
            if ((val && val > 20) || hours > 0) {
              this.doughnutchartColors[0].backgroundColor[0] = '#4EB048';
              this.doughnutchartColors[0].hoverBackgroundColor[0] = '#4EB048';
              // this.doughnutchartColors = [...this.doughnutchartColors , ...tempObj];
            }
            this.doughnutchartDatasets = tempArr;
            this.consentDate = this.datePipe.transform(
              this.ccmEncounterList.consentDate,
              'mediumDate'
            );
            this.followUpDate = this.datePipe.transform(
              this.ccmEncounterList.followUpDate,
              'mediumDate'
            );
          },
          (err) => {}
        );
    }
  }

  getCcmStatus() {
    this.subs.sink = this.patientsService
      .getCcmStatus()
      .subscribe((res: any) => {
        if (res) {
          this.ccmStatusList = res;
        }
      });
  }
  AssignCcmStatus() {
    this.ccmStatusChangeDto.appUserId = this.securityService.securityObject.appUserId;
    this.ccmStatusChangeDto.patientId = this.PatientData.id;
    this.ccmStatusChangeDto.newStatusValue = this.PatientData.ccmStatus;
    this.subs.sink = this.patientsService
      .changePatientCcmStatus(this.ccmStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success('Ccm Status Changed Successfully');
        },
        (error: HttpResError) => {
          this.toaster.error(error.error, error.message);
        }
      );
  }
  AssignCcmMonthlyStatus() {
    this.ccmMonthlyStatusChangeDto.ccmMonthlyStatus = this.PatientData.ccmMonthlyStatus;
    this.ccmMonthlyStatusChangeDto.PatientId = this.PatientData.id;
    this.subs.sink = this.patientsService
      .editPatientCcmMonthlyStatus(this.ccmMonthlyStatusChangeDto)
      .subscribe(
        (res) => {
          this.toaster.success('Ccm Monthly Status Changed Successfully');
        },
        (error: HttpResError) => {
          this.toaster.error(error.error, error.message);
        }
      );
  }
  startTimer() {
    this.durationInput.nativeElement.value = null;
    if (this.firstimeTimerStart) {
      if (!this.initiaTimeStr) {
        const date = moment().format('hh:mm');
        this.statementManagementService.date = date;
        this.startingTime = moment().format('hh:mm:ss');
        this.statementManagementService.counterStartingTime = this.startingTime;
        this.encounterTimeForm.get('startTime').setValue(date);
      } else {
        this.encounterTimeForm
          .get('startTime')
          .setValue(this.statementManagementService.date);
      }

      this.encounterTimeForm.get('endTime').setValue('');
      this.firstimeTimerStart = false;
    }
    this.myInterval = <any>setInterval(() => {
      this.seconds++;
      if (this.seconds === 60) {
        this.minutes++;
        this.seconds = 0;
        if (this.minutes === 60) {
          this.hours++;
          this.minutes = 0;
          if (this.hours === 24) {
            this.hours = 0;
          }
        }
      }
      this.TimerInput.nativeElement.value = this.getTimerTime(
        this.seconds,
        this.minutes,
        this.hours
      );
    }, 1000);
    this.timerStart = true;
  }
  ngOnDestroy() {
    if (this.timerStart) {
      // var counterStartingTime = this.startingTime;

      this.timerStart = true;

      this.statementManagementService.timerStart = this.timerStart;
    } else {
      this.timerStart = false;
    }
    this.subs.unsubscribe();
  }
  pauseTimer() {
    clearInterval(this.myInterval);
    this.myInterval = -1;
    this.timerStart = false;
  }
  stopTimer() {
    this.pauseTimer();
    const startTime = this.encounterTimeForm.get('startTime').value;
    const splitedTime = startTime.split(':');
    // tslint:disable-next-line:radix
    const second = parseInt(splitedTime[2]);
    // tslint:disable-next-line:radix
    const minute = parseInt(splitedTime[1]);
    // tslint:disable-next-line:radix
    const hour = parseInt(splitedTime[0]);
    let EndTime = hour + this.hours + ':' + (minute + this.minutes);
    // + ':' +
    // (second + this.seconds);
    EndTime = moment(EndTime, 'h:m').format('hh:mm');
    this.encounterTimeForm.get('endTime').setValue(EndTime);
    this.seconds = 0;
    this.minutes = 0;
    this.hours = 0;
    this.TimerInput.nativeElement.value = '00:00:00';
    this.firstimeTimerStart = true;
    this.timerStart = false;
    this.statementManagementService.timerStart = false;
    this.initiaTimeStr = '';
    const pre = moment(startTime, 'hh:mm');
    const current = moment(EndTime, 'hh:mm');
    if (this.stopCounterOnDuration) {
      const result = moment.duration(current.diff(pre));
      this.durationInput.nativeElement.value =
        result.hours() * 60 + result.minutes();
    } else {
      this.stopCounterOnDuration = true;
    }
  }

  getTimerTime(seconds, minutes, hours): string {
    let times = '';
    if (hours < 10) {
      times += '0' + hours;
    } else {
      times += hours;
    }
    times += ':';
    if (minutes < 10) {
      times += '0' + minutes;
    } else {
      times += minutes;
    }
    times += ':';
    if (seconds < 10) {
      times += '0' + seconds;
    } else {
      times += seconds;
    }

    return times;
  }
  updateFollowUpDate(type) {
    var date
    if(type === 'nextCCM'){
        date = moment(this.followUpDataObj.followUpDate, 'MMM DD, YYYY hh:mm A', true);
    }
    if(type === 'pcpAppointment'){
      date = moment(this.followUpDataObj.recentPcpAppointment, 'MMM DD, YYYY hh:mm A', true);
    }
    if(type === 'hospitalizationDate'){
      date = moment(this.followUpDataObj.recentHospitalizationDate, 'MMM DD, YYYY', true);
    }
    const dateValid = date.isValid();
    if(dateValid){
      this.followUpDataObj.patientId = this.PatientId;
      this.subs.sink = this.ccmService
        .changefollowUpDate(this.followUpDataObj)
        .subscribe(
          (res) => {
            this.toaster.success('Data Updated Successfully');
          },
          (err) => {
            this.toaster.error(err.message, err.error || err.error);
          }
        );
    }else{
      this.toaster.warning('Date is incorrect.');
    }
  }

  getRpmEncounterTime() {
    const monthId = new Date().getMonth() + 1;
    const yearId = this.appDataService.currentYear;
    this.subs.sink = this.ccmService
      .GetRpmEncountersDurationByPatientId(this.PatientId, monthId, yearId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.rpmEncounterTime = res.duration;
          } else {
            this.rpmEncounterTime = '00:00:00';
          }
          // this.toaster.success('Data Updated Successfully');
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  GetBhiEncountersDurationByPatientId() {
    const monthId = new Date().getMonth() + 1;
    this.subs.sink = this.bhiService
      .GetBhiEncountersDurationByPatientId(this.PatientId, monthId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.bhiEncounterTime = res.timeSpan;
          } else {
            this.bhiEncounterTime = '00:00:00';
          }
          // this.toaster.success('Data Updated Successfully');
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
  getFollowUpDate() {
    this.subs.sink = this.ccmService.getfollowUpDate(this.PatientId).subscribe(
      (res: any) => {
        if (!res) {
          return;
        }
        this.lastTcmStatus = res.lastTcmStatus;
        this.lastTcmEncounterId = res.lastTcmEncounterId;
        Object.assign(this.followUpDataObj, res);
        // this.toaster.success('Data Updated Successfully');
        if (this.followUpDataObj.followUpDate) {
          this.followUpDataObj.followUpDate = moment(
            this.followUpDataObj.followUpDate
          ).format('MMM DD, YYYY hh:mm A');
        }

        if (this.followUpDataObj.recentPcpAppointment) {
          this.followUpDataObj.recentPcpAppointment = moment(
            this.followUpDataObj.recentPcpAppointment
          ).format('MMM DD, YYYY hh:mm A');
        }
        if (this.lastTcmStatus > 2) {
          this.followUpDataObj.recentHospitalizationDate = '';
        }

        if (this.followUpDataObj.recentHospitalizationDate) {
          this.followUpDataObj.recentHospitalizationDate = this.followUpDataObj.recentHospitalizationDate.slice(
            0,
            10
          );
          this.followUpDataObj.recentHospitalizationDate = moment(this.followUpDataObj.recentHospitalizationDate, 'YYYY-MM-DD').format('MMM DD, YYYY');
        }
      },
      (err: HttpResError) => {
        this.toaster.error(err.error, err.error);
      }
    );
  }
  updateConsentDate(date: any) {
    const obj = {
      patientId: this.PatientId,
      consentDate: date,
    };
    this.subs.sink = this.ccmService.changeConsentDate(obj).subscribe(
      (res) => {
        this.toaster.success('Data Updated Successfully');
      },
      (err) => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }

  OpenClinicalSummary() {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = EventTypes.OpenClinicalSummary;
    event.value = 'OpenClinicalSummary';
    this.eventBus.emit(event);
  }

  addRpmEncounter() {
    if (this.PatientId) {
      this.rpmEncounterDto.patientId = this.PatientId;
      this.rpmEncounterDto.facilityUserId = this.securityService.securityObject.id;
      this.rpmEncounterDto.startTime = moment(
        this.rpmEncounterDto.encounterDate,
        'YYYY-MM-DD hh:mm A'
      ).format('hh:mm');
      this.rpmDurationChanged(+this.rpmEncounterDto.duration);
      const hours = Math.floor(+this.rpmEncounterDto.duration / 60);
      const minutes = +this.rpmEncounterDto.duration % 60;
      this.rpmEncounterDto.duration = hours + ':' + minutes;
      if (hours > 0) {
        this.rpmEncounterDto.duration = moment(
          this.rpmEncounterDto.duration,
          'h:m'
        ).format('hh:mm');
      }
      this.subs.sink = this.rpmService
        .addRPMEncounter(this.rpmEncounterDto)
        .subscribe(
          (res) => {
            this.getLogsByPatientAndMonthIdRPM();
            this.rpmEncounterDto.encounterDate = '';
            this.rpmEncounterDto.note = '';
            this.rpmEncounterDto.duration = '';
            this.rpmEncounterDto.startTime = '';
            this.rpmEncounterDto.endTime = '';
            // this.rpmEncounterList = res;
            this.toaster.success('Rpm Encounter Added Successfully');
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  getLogsByPatientAndMonthIdRPM() {
    if (this.PatientId && this.rpmMonthId) {
      this.subs.sink = this.rpmService
        .getRPMEncounters(this.PatientId, this.rpmMonthId, this.yearNum)
        .subscribe(
          (res) => {
            this.rpmEncounterList = res;
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  getBhiEncountersByPatientId() {
    if (this.PatientId && this.bhiMonthId && this.bhiYearNum) {
      this.subs.sink = this.bhiService
        .GetBhiEncountersByPatientId(this.PatientId, this.bhiMonthId, this.bhiYearNum)
        .subscribe(
          (res) => {
            this.bhiEncounterDto = res;
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  rpmDurationChanged(minsToAdd: number) {
    const startTime = this.rpmEncounterDto.startTime;
    function D(J) {
      return (J < 10 ? '0' : '') + J;
    }
    const piece = startTime.split(':');
    const mins = +piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ':' + D(mins % 60);
    this.rpmEncounterDto.endTime = newTime;
  }

  validateUser() {
    this.subs.sink = this.rpmService
      .validateUser(this.selectedBillingProvider.userId, this.password)
      .subscribe(
        (res: boolean) => {
          if (res) {
            this.canAddEncounter = res;
            let curentUser = new AppUserAuth();
            // Object.assign(curentUser, this.securityService.securityObject);
            curentUser = this.cloneService.deepClone<AppUserAuth>(
              this.securityService.securityObject
            );
            if (!this.securityService.hasClaim('CanModifyRPMEncounter')) {
              const claim = new AppUserClaim();
              claim.claimType = 'CanModifyRPMEncounter';
              claim.claimValue = 'true';
              curentUser.claims.push(claim);
            }
            if (!this.securityService.getClaim('RPMEncounterUserId')) {
              const claim = new AppUserClaim();
              claim.claimType = 'RPMEncounterUserId';
              claim.claimValue = this.selectedBillingProvider.id.toString();
              curentUser.claims.push(claim);
            } else {
              this.securityService.updateClaim(
                'RPMEncounterUserId',
                this.selectedBillingProvider.id.toString()
              );
            }
            this.securityService.updateToken(curentUser);
            this.toaster.success('User Verified Successfully.');
          } else {
            this.toaster.warning('This User is not verified.');
          }
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
  }
  getBillingProviders() {
    if (this.facilityId) {
      this.subs.sink = this.facilityService
        .getBillingProvidersByFacilityId(this.facilityId)
        .subscribe(
          (res) => {
            this.billingProviders = res;
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  consolelog() {
    // console.log("clicked");
  }
  createTcmEncounter() {
    if (
      this.followUpDataObj.recentHospitalizationDate &&
      (this.lastTcmStatus > 2 || this.lastTcmStatus == 0)
    ) {
      this.creatingTcm = true;
      this.addTcmEncounterDto.patientId = this.PatientId;
    this.addTcmEncounterDto.hospitalizationDate = this.followUpDataObj.recentHospitalizationDate;
      this.tcmSevice.createTcm(this.addTcmEncounterDto).subscribe(
        (res) => {
          this.creatingTcm = false;
          this.router.navigateByUrl(
            `/tcm/dischargeOverview/${this.PatientId}/${res}`
          );
        },
        (error: HttpResError) => {
          this.creatingTcm = false;
        }
      );
    }
  }
  checkBluetooth(){
    var state = '';
    if(this.isBluetoothEnabled){
      state = 'Enable'
    }else{
      state = 'Disable'
    }
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Confirmation';
    modalDto.Text = `Are you sure you want to ${state} the bluetooth?`;
    modalDto.callBack = this.callBackBhi;
    modalDto.rejectCallBack = this.rejectCallBackBhi;
    this.appUi.openLazyConfrimModal(modalDto);
    }
  rejectCallBackBhi = () => {
    if(this.isBluetoothEnabled){
      this.isBluetoothEnabled = false;
    }else{
      this.isBluetoothEnabled = true;
    }
    }
  callBackBhi = (row) => {
    this.setIsBleEnabled();
    }
    isBleEnabled(){
      this.rpmService.IsBleEnabled(this.PatientId).subscribe((res: any) => {
        this.isBluetoothEnabled = res;
      }, (err: HttpResError) => {
        this.toaster.error(err.error);
      })
    }
    setIsBleEnabled(){
      this.setIsBleEnabledDto.enable = this.isBluetoothEnabled;
      this.setIsBleEnabledDto.patientId = this.PatientId;
      this.rpmService.SetIsBleEnabled(this.setIsBleEnabledDto).subscribe((res: any) => {
        if(this.isBluetoothEnabled){
          this.toaster.success('Bluetooth Enabled.')
        }else{
          this.toaster.success('Bluetooth Disabled.')
        }
      }, (err: HttpResError) => {
        this.toaster.error(err.error);
      })
    }
    getLanguages(){
      this.ccmDataService.getLanguageList().subscribe(
        (res: any) => {
          this.languageList = res;
        },
        err => {}
      );
    }
    editPatientPreferences(){
      if(!this.editPatientPreferencesDto.preferredLanguage && this.language){
        this.editPatientPreferencesDto.preferredLanguage = this.language;
      }
      this.editPatientPreferencesDto.patientId = this.PatientId;
      this.patientsService.AddUpdatePatientPreference(this.editPatientPreferencesDto).subscribe((res: any) => {
       this.toaster.success('Preferences Updated')
      }, (err: HttpResError) => {
        this.toaster.error(err.error);
      })
    }
}
