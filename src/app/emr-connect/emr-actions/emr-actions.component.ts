import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { EmrConnectService } from 'src/app/core/emr-connect.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { FacilityService } from './../../core/facility/facility.service';
import { FacilityDto } from 'src/app/model/Facility/facility.model';
import { ManageExtensionService } from 'src/app/core/manage-extension.service';
import { Emr } from 'src/app/extension-manager/extensionManager.model';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { consentDto, MasterCarePLanDto, PatientDto } from 'src/app/model/Patient/patient.model';
import { EncounterClaimType } from 'src/app/model/bills.model';
import { RpmService } from './../../core/rpm.service';
import { CcmDataService } from './../../core/ccm-data.service';
import { CcmEncounterForList } from 'src/app/model/admin/ccm.model';
import moment from 'moment';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from './../../core/app-ui.service';
import { AthenaUploadClaimInfo, AthenaUploadClaimInfoResponse, PatientEmrConnectInfoDto, PatientEmrSummaryDataDto, SubmitClaimDto } from 'src/app/model/EmrConnect/emr-connect.model';
import { AthenaInsuranceDto } from 'src/app/model/EmrConnect/athena.insurance.model';
import { DataFilterService } from './../../core/data-filter.service';
import { AthenaCCmStatusEnum } from 'src/app/model/EmrConnect/athena.ccmStatus.enum';
import { CcmStatus, RpmStatus, CcmMonthlyStatus } from 'src/app/Enums/filterPatient.enum';
import { RpmMonthlyStatus } from 'src/app/Enums/filterPatient.enum';
import { PatientConsentService } from 'src/app/core/Patient/patient-consent.service';

@Component({
  selector: 'app-emr-actions',
  templateUrl: './emr-actions.component.html',
  styleUrls: ['./emr-actions.component.scss']
})
export class EmrActionsComponent implements OnInit {
  @Input() patientId: number;
  syncingPatient: boolean;
  uploadingDocument: boolean;
  updatingStatus: boolean;
  facility = new FacilityDto();
  facilityId: number;
  loadingEmr: boolean;
  filterMonth: any;
  emrList = new Array<Emr>();
  facilityEMR: Emr;
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MMM-YYYY',
  };
  gettingInsurances: boolean;
  patient: PatientDto;
  gettingConnectInfo: boolean;
  gettingCarePlan: boolean;
  addEditMAsterCareplanObj: MasterCarePLanDto;
  hasCarePlan: boolean;

  EncounterClaimTypeEnum = EncounterClaimType;
  rpmEncounterTime: string;
  gettingEncounterLogs: boolean;

  ccmEncounterList: CcmEncounterForList;
  rpmMinutes: number;
  ccmMinutes: number;
  uploadFC: boolean;
  uploadFCD: boolean;
  getClaimInfo: boolean;
  insuranceData: AthenaInsuranceDto;
  emrConnectInfo: PatientEmrConnectInfoDto;


  athenaStatusArr = this.dataFilter.getEnumAsList(AthenaCCmStatusEnum);
  uploadClaimInfo: AthenaUploadClaimInfoResponse;
  gettingAppointments: boolean;
  creatingAppointments: boolean;
  noteText: string;
  appointments = [];
  EmrSummaryData = new PatientEmrSummaryDataDto();


  ccmStatusEnum = CcmStatus;
  ccmMonthlyStatusEnum = CcmMonthlyStatus;
  rpmStatusEnum = RpmStatus;
  rpmMonthlyStatusEnum = RpmMonthlyStatus;
  isLoadingConsents: boolean;
  consentInfo: { ccmDate: string; ccmConsentTakenBy: string; rpmDate: string; rpmConsentTakenBy: string; };
  constructor(private route: ActivatedRoute, private toaster: ToastService,
    private securityService: SecurityService,
    private router: Router,
    private appUi: AppUiService,
    private dataFilter: DataFilterService,
    private patientService: PatientsService,
    private patientConsentService: PatientConsentService,
    private rpmService: CcmDataService,
    private facilityService: FacilityService,
    private extService: ManageExtensionService,
    private emrConnect: EmrConnectService) { }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.filterMonth = moment().format('MMM-YYYY')
    this.getPatientById();
    this.GetEmrList();
    // this.GetInsurances();
    // this.GetPatientAppointments();
    // this.GetUploadFinantialClaimInfo();
    this.GetPatientEmrConnectInfo();
    this.getMasterCarePLanData();
    this.getRpmEncounterTime1();
    this.getLogsByPatientAndMonthId();
    this.GetPatientEmrSummaryData();
    this.getPatientConsentsByPId();
  }
  CCMEncounterAdded() {
    this.getPatientById();
    this.getLogsByPatientAndMonthId();
    this.GetPatientEmrSummaryData();
  }
  RPMEncounterAdded() {
    this.getPatientById();
    this.getRpmEncounterTime1();
    this.GetPatientEmrSummaryData();
  }
  DateChanged() {
    // this.GetUploadFinantialClaimInfo();
    this.GetPatientEmrConnectInfo();
    this.getRpmEncounterTime1();
    this.getLogsByPatientAndMonthId();
  }
  GetEmrList() {
    this.loadingEmr = true;
    this.extService.GetEmrList().subscribe((res: any) => {
      this.emrList = res;
      this.loadingEmr = false;
      this.getFacilityDetails();
    }, (err: HttpResError) => {
      this.loadingEmr = false;
      this.toaster.error(err.error);
    })
  }
  GetPatientEmrSummaryData() {
    const monthId = moment(this.filterMonth, 'MMM-YYYY').format('M');
    const yearId = moment(this.filterMonth, 'MMM-YYYY').format('YYYY');
    this.loadingEmr = true;
    this.patientService.GetPatientEmrSummaryData(this.patientId, +monthId, +yearId).subscribe((res: PatientEmrSummaryDataDto) => {
      this.EmrSummaryData = res;
      this.loadingEmr = false;
      this.getFacilityDetails();
    }, (err: HttpResError) => {
      this.loadingEmr = false;
      this.toaster.error(err.error);
    })
  }
  getFacilityDetails() {
    this.facilityService.getFacilityDetail(this.facilityId).subscribe(
      (res: FacilityDto) => {
        this.facility = res;
        this.facility.integrationEnabled
        this.facilityEMR = this.emrList.find(x => x.id == res.emrId);
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }

  getPatientById() {
    this.patientService.getPatientDetail(this.patientId).subscribe(
      (res: PatientDto) => {
        this.patient = res;
      }, (err) => {
        this.toaster.error(err.error, err.message);
      })

  }
  getPatientConsentsByPId() {
    this.isLoadingConsents = true;
    this.patientConsentService
      .getPatientConsentsByPatientId(this.patientId)
      .subscribe(
        (res: consentDto) => {
                this.isLoadingConsents = false;
                this.consentInfo = {
                  ccmDate: '',
                  ccmConsentTakenBy: '',
                  rpmDate: '',
                  rpmConsentTakenBy: '',
                }
                res.patientConsentsDto.forEach(cons => {
                  if (cons.consentNature.toUpperCase() == 'CCM') {
                    this.consentInfo.ccmDate = cons.consentDate;
                    this.consentInfo.ccmConsentTakenBy = cons.createdBy;
                  }
                  if (cons.consentNature.toUpperCase() == 'RPM') {
                    this.consentInfo.rpmDate = cons.consentDate;
                    this.consentInfo.rpmConsentTakenBy = cons.createdBy;
                  }
                });
                // this.listOfConsents = res;
        },
        (err) => {
          this.isLoadingConsents = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }

  SyncPatient() {
    this.syncingPatient = true;
    this.emrConnect.SyncPatient(this.patientId)
      .subscribe(
        (res: any) => {
          this.syncingPatient = false;
          this.toaster.success(`Data synced successfully`);
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.syncingPatient = false;
        }
      );
  }

  getMasterCarePLanData() {
    this.gettingCarePlan = true;
    this.patientService.GetCarePlanMasterByPatientId(this.patientId).subscribe(
      (data: any) => {
        this.gettingCarePlan = false;
        if (data) {
          this.addEditMAsterCareplanObj = data;
        } else {
          this.addEditMAsterCareplanObj = new MasterCarePLanDto();
        }
        this.hasCarePlan = this.addEditMAsterCareplanObj?.id ? true : false;
      },
      (err: HttpResError) => {
        this.gettingCarePlan = false;
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  ConfirmPostVitals() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Post Vitals";
    modalDto.Text = "Are you sure to Post Vitals?";
    modalDto.callBack = this.PostVitals;
    modalDto.data = null;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  PostVitals = () => {
    this.uploadingDocument = true;
    this.emrConnect.PostVitals(this.patientId)
      .subscribe(
        (res: any) => {
          this.uploadingDocument = false;
          this.toaster.success(`Vitals submitted successfully`);
          this.GetPatientEmrConnectInfo();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.uploadingDocument = false;
        }
      );
  }
  ConfirmPostLabResult() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Post Lab Result";
    modalDto.Text = "Are you sure to Post Lab Result?";
    modalDto.callBack = this.PostLabResult;
    modalDto.data = null;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  PostLabResult = () => {
    this.uploadingDocument = true;
    this.emrConnect.PostLabResult(this.patientId)
      .subscribe(
        (res: any) => {
          this.uploadingDocument = false;
          this.toaster.success(`Lab Result submitted successfully`);
          this.GetPatientEmrConnectInfo();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.uploadingDocument = false;
        }
      );
  }
  ConfirmUploadClinicalDocument() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Update Care Plan";
    modalDto.Text = "Are you sure to update Care Plan?";
    modalDto.callBack = this.UploadClinicalDocument;
    modalDto.data = null;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  UploadClinicalDocument = () => {
    this.uploadingDocument = true;
    this.emrConnect.UploadClinicalDocument(this.patientId)
      .subscribe(
        (res: any) => {
          this.uploadingDocument = false;
          this.toaster.success(`Care Plan updated successfully`);
          this.GetPatientEmrConnectInfo();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.uploadingDocument = false;
        }
      );
  }
  ConfirmClaimDocUpload(ServiceType: EncounterClaimType) {
    const modalDto = new LazyModalDto();
    modalDto.Title = `Submit ${EncounterClaimType[ServiceType]} Claim & Document`;
    modalDto.Text = `Are you sure to Submit ${EncounterClaimType[ServiceType]} Claim & Document ?`;
    modalDto.callBack = this.UploadBoth;
    modalDto.data = ServiceType;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  UploadBoth = (ServiceType: EncounterClaimType) => {
    this.UploadFinancialClaim(ServiceType)
    this.UploadFinancialClaimDocument(ServiceType)
  }
  UploadFinancialClaim = (ServiceType: EncounterClaimType) => {
    const monthId = moment(this.filterMonth, 'MMM-YYYY').format('M');
    const yearId = moment(this.filterMonth, 'MMM-YYYY').format('YYYY');
    const calimObj = new SubmitClaimDto();
    calimObj.patientId = this.patientId;
    calimObj.claimType = ServiceType;
    calimObj.monthId = +monthId;
    calimObj.yearId = +yearId;
    this.uploadFC = true;
    this.emrConnect.UploadFinancialClaim(this.patientId, calimObj)
      .subscribe(
        (res: any) => {
          this.uploadFC = false;
          this.toaster.success(`Claim generated successfully`);
          this.GetUploadFinantialClaimInfo()
        },
        (err: HttpResError) => {
          this.toaster.error( err.error, err.message);
          this.uploadFC = false;
        }
      );
  }
  UploadFinancialClaimDocument = (ServiceType: EncounterClaimType) => {
    const monthId = moment(this.filterMonth, 'MMM-YYYY').format('M');
    const yearId = moment(this.filterMonth, 'MMM-YYYY').format('YYYY');
    const calimObj = new SubmitClaimDto();
    calimObj.patientId = this.patientId;
    calimObj.claimType = ServiceType;
    calimObj.monthId = +monthId;
    calimObj.yearId = +yearId;
    this.uploadFCD = true;
    this.emrConnect.UploadFinancialClaimDocument(this.patientId, calimObj)
      .subscribe(
        (res: any) => {
          this.uploadFCD = false;
          this.toaster.success(`Claim Document submitted successfully`);
          this.GetUploadFinantialClaimInfo()
        },
        (err: HttpResError) => {
          this.toaster.error( err.error, err.message);
          this.uploadFCD = false;
        }
      );
  }
  UpdateCcmEnrollmentStatus(status: AthenaCCmStatusEnum) {
    if (!this.insuranceData || !this.insuranceData?.insurances[0]) {
      this.toaster.warning('No insurances found');
      return ;
    }
    this.insuranceData.insurances[0].insuranceid
    this.updatingStatus = true;
    this.emrConnect.UpdateCcmEnrollmentStatus(this.patientId, status, AthenaCCmStatusEnum[status], this.insuranceData?.insurances[0].insuranceid)
      .subscribe(
        (res: any) => {
          this.updatingStatus = false;
          this.toaster.success(`Status changed successfully`);
          this.GetPatientEmrConnectInfo();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.updatingStatus = false;
        }
      );
  }
  GetInsurances() {
    this.gettingInsurances = true;
    this.emrConnect.GetInsurances(this.patientId)
      .subscribe(
        (res: AthenaInsuranceDto) => {
          this.gettingInsurances = false;
          this.insuranceData = res;
          // this.toaster.success(`Status changed successfully`);
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.gettingInsurances = false;
        }
      );
  }
  GetPatientAppointments() {
    this.gettingAppointments = true;
    this.emrConnect.GetPatientAppointments(this.patientId)
      .subscribe(
        (res: {"totalcount":number,"appointments":[]}) => {
          this.gettingAppointments = false;
          this.appointments = res.appointments;
          // this.insuranceData = res;
          // this.toaster.success(`Status changed successfully`);
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.gettingAppointments = false;
        }
      );
  }
  CreateAppointmentNote() {
    if (!this.appointments?.length) {
      this.toaster.warning('No appointments found')
      return
    }
    let noteText = prompt("Please enter Note");
    if(!noteText) {
      this.toaster.warning('Empty text')
      return
    }
    this.creatingAppointments = true;
    this.emrConnect.CreateAppointmentNote(this.appointments[0].appointmentid,noteText)
      .subscribe(
        (res: any) => {
          this.creatingAppointments = false;
          // this.insuranceData = res;
          this.toaster.success(`Note added successfully`);
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.creatingAppointments = false;
        }
        );
      }
      CreatePateintsChartAlert() {
        let noteText = prompt("Please enter Note");
        if(!noteText) {
          this.toaster.warning('Empty text')
          return
        }
        this.creatingAppointments = true;
        this.emrConnect.CreatePateintsChartAlert(this.patientId, noteText)
        .subscribe(
          (res: any) => {
            this.creatingAppointments = false;
            this.toaster.success(`Note added successfully`);
          // this.insuranceData = res;
          // this.toaster.success(`Status changed successfully`);
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.creatingAppointments = false;
        }
      );
  }
  GetUploadFinantialClaimInfo() {
    const monthId = moment(this.filterMonth, 'MMM-YYYY').format('M');
    const yearId = moment(this.filterMonth, 'MMM-YYYY').format('YYYY');
    const calimObj = new SubmitClaimDto();
    calimObj.patientId = this.patientId;
    calimObj.claimType = EncounterClaimType.CCM;
    calimObj.monthId = +monthId;
    calimObj.yearId = +yearId;
    this.getClaimInfo = true;
    this.emrConnect.GetUploadFinantialClaimInfo(calimObj)
      .subscribe(
        (res: AthenaUploadClaimInfoResponse) => {
          this.getClaimInfo = false;
          this.uploadClaimInfo = res
          // this.toaster.success(`Status changed successfully`);
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.getClaimInfo = false;
        }
      );
  }
  GetPatientEmrConnectInfo() {
    this.gettingConnectInfo = true;
    this.emrConnect.GetPatientEmrConnectInfo(this.patientId)
      .subscribe(
        (res: PatientEmrConnectInfoDto) => {
          this.gettingConnectInfo = false;
          this.emrConnectInfo = res;
          // this.toaster.success(`Status changed successfully`);
        },
        (err: HttpResError) => {
          this.toaster.error(err.error, err.message);
          this.gettingConnectInfo = false;
        }
      );
  }

  getRpmEncounterTime1() {
    const monthId = moment(this.filterMonth, 'MMM-YYYY').format('M');
    const yearId = moment(this.filterMonth, 'MMM-YYYY').format('YYYY');
    this.rpmService
      .GetRpmEncountersDurationByPatientId(this.patientId, +monthId, +yearId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.rpmEncounterTime = res.duration;
          } else {
            this.rpmEncounterTime = '00:00:00';
          }
          this.rpmMinutes = moment(this.rpmEncounterTime, 'hh:mm:ss').minutes();
          // this.toaster.success('Data Updated Successfully');
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );

  }
  getLogsByPatientAndMonthId() {
    const monthId = moment(this.filterMonth, 'MMM-YYYY').format('M');
    const yearId = moment(this.filterMonth, 'MMM-YYYY').format('YYYY');
    this.gettingEncounterLogs = true;
      this.rpmService.getCCMEncounterByPatientId(this.patientId, monthId , yearId)
        .subscribe(
          (res) => {
            this.gettingEncounterLogs = false;
            this.ccmEncounterList = res;
            this.ccmMinutes = moment(this.ccmEncounterList.ccmTimeCompleted, 'hh:mm:ss').minutes();

          },
          (err) => {
            this.gettingEncounterLogs = false;
          }
        );
  }

}
