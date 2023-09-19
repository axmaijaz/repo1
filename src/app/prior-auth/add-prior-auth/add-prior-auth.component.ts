import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AwsService } from 'src/app/core/aws/aws.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { InsuranceService } from 'src/app/core/insurance.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { PriorAuthService } from 'src/app/core/PriorAuth/prior-auth.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { FilterPatient, PatientDto } from 'src/app/model/Patient/patient.model';
import { InsurancePlanDto } from 'src/app/model/pcm/payers.model';
import { DocDataDto } from 'src/app/model/pcm/pcm.model';
import { PaCaseStep, PACaseType, PADocForListDto, PriorAuthDto } from 'src/app/model/PriorAuth/prioAuth.model';
import { Speciality } from 'src/app/model/Provider/provider.model';
import { SubSink } from 'src/app/SubSink';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-prior-auth',
  templateUrl: './add-prior-auth.component.html',
  styleUrls: ['./add-prior-auth.component.scss']
})
export class AddPriorAuthComponent implements OnInit, OnDestroy {
  @ViewChild('addEditPriorAuth') addEditPriorAuthModal: ModalDirective;
  @Output() addedOrEdited = new EventEmitter();
  isLoading: boolean;
  private subs = new SubSink();
  facilityUserList: CreateFacilityUserDto[];
  facilityId: number;
  priorAuthAddEditDto = new PriorAuthDto();
  caseTypesLIst: PACaseType[];
  caseStepArr: PaCaseStep[];
  patientList: PatientDto[];
  savingPriorAuth: boolean;
  LoadingData: boolean;
  searchWatch = new Subject<string>();
  objectURLStrAW: string;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    closeOnSelect: true
  };
  filterPatientDto = new FilterPatient();
  specialities = new Array<Speciality>();
  insurancePLanList: InsurancePlanDto[];
  isLoadingPayersList: boolean;
  applyValidation: boolean;
  docData: DocDataDto;
  uploadingPriorDoc: boolean;
  deletingfile: boolean;
  processingDoc: boolean;
  constructor(private toaster: ToastService, private patientsService: PatientsService, private facilityService: FacilityService, private priorAuthService: PriorAuthService,
    private securityService: SecurityService, private insuranceService: InsuranceService, private awsService: AwsService,private pcmService: PcmService) { }

  ngOnInit() {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.getFacilityUsersList();
    this.GetCaseTypesList();
    this.SearchObserver();
    this.getProviderSpecialities();
    this.GetInsurancePlansByFacilityId();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  getFacilityUsersList() {
    this.subs.sink = this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      (res: any) => {
        this.facilityUserList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getProviderSpecialities() {
    this.subs.sink = this.patientsService.getProviderSpecialities().subscribe(
      (res: any) => {
        this.specialities = res || [];
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
  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      this.filterPatientDto.SearchParam = x;
      if (this.filterPatientDto.SearchParam === null) {
        return;
      }
      this.getFilterPatientsList2();
    });
  }
  getFilterPatientsList2() {
    const fPDto = new FilterPatient();
    this.patientList = [];
    this.LoadingData = true;
    for (const filterProp in this.filterPatientDto) {
      if (
        this.filterPatientDto[filterProp] === null ||
        this.filterPatientDto[filterProp] === undefined
      ) {
        this.filterPatientDto[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
    this.LoadingData = true;
    // this.LoadingDataPayersList = true;
    this.filterPatientDto.FacilityUserId = 0;
    // FacilityId = 0
    this.filterPatientDto.CareProviderId = 0;
    this.filterPatientDto.FacilityId = this.facilityId;
    this.filterPatientDto.PageNumber = 1;
    this.filterPatientDto.PageSize = 20;

    this.patientsService.getFilterPatientsList2(this.filterPatientDto).subscribe(
      (res: any) => {
        this.LoadingData = false;
        this.patientList = res.patientsList;
      },
      (error: HttpResError) => {
        this.LoadingData = false;
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetCaseTypesList() {
    this.subs.sink = this.priorAuthService.PACaseTypes(this.facilityId).subscribe(
      (res: any) => {
        this.caseTypesLIst = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  FillSteps() {
    this.priorAuthAddEditDto.paCaseStepId = -1;
    const res = this.caseTypesLIst.find(x => x.id === this.priorAuthAddEditDto.paCaseTypeId);
    this.caseStepArr = res ? res.paCaseSteps : [];
  }
  GetPriorAuthById(priorId: number) {
    this.isLoading = true;
    this.subs.sink = this.priorAuthService.GetPriorAuthById(priorId).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.priorAuthAddEditDto = res;
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AddPriorAuth(model: ModalDirective) {
    this.savingPriorAuth = true;
    this.subs.sink = this.priorAuthService.AddPriorAuth(this.priorAuthAddEditDto).subscribe(
      (res: any) => {
        this.savingPriorAuth = false;
        model.hide();
        this.toaster.success('Record added successfully');
        this.addedOrEdited.emit();
      },
      (error: HttpResError) => {
        this.savingPriorAuth = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  EditPriorAuth(model: ModalDirective) {
    this.savingPriorAuth = true;
    const PaDto = new PriorAuthDto();
    for (const PaProp in this.priorAuthAddEditDto) {
      if (
        this.priorAuthAddEditDto[PaProp] === null ||
        this.priorAuthAddEditDto[PaProp] === undefined
      ) {
        this.priorAuthAddEditDto[PaProp] = PaDto[PaProp];
        // this.FilterPatientDto[PaProp] = 0;
      }
    }
    this.subs.sink = this.priorAuthService.EditPriorAuth(this.priorAuthAddEditDto).subscribe(
      (res: any) => {
        this.savingPriorAuth = false;
        model.hide();
        this.toaster.success('Record updated successfully');
        this.addedOrEdited.emit();
      },
      (error: HttpResError) => {
        this.savingPriorAuth = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  ShowAddEditModal(){
    this.addEditPriorAuthModal.show();
  }
  HideAddEditModal(){
    this.addEditPriorAuthModal.hide();
  }
  onUploadOutput(output: any): void {
    if (output.target.files[0].size > 26214400) {
      this.toaster.warning('file size is more than 25 MB');
      return;
    }
    this.uploadingPriorDoc = true;
    this.AddPADocument(output.target.files[0]);
    // }
  }
  AddPADocument(file: any) {
    this.uploadingPriorDoc = true;
    this.priorAuthService.AddPADocument(file.name, this.priorAuthAddEditDto.id).subscribe(
      (res: DocDataDto) => {
        this.docData = res;
        this.uploadPcmDocToS3(file);
      },
      (err: HttpResError) => {
        this.uploadingPriorDoc = false;
        // this.editingPcmData = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  DeletePADocument(item: PADocForListDto) {
    item['processingDoc'] = true;
    this.priorAuthService.DeletePADocument(item.id).subscribe(
      (res: any) => {
        const index = this.priorAuthAddEditDto.paDocuments.findIndex(x => x.id === item.id);
        this.priorAuthAddEditDto.paDocuments.splice(index, 1);
        item['processingDoc'] = false;
      },
      (err: HttpResError) => {
        item['processingDoc'] = false;
        // this.editingPcmData = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  async uploadPcmDocToS3(file) {
    this.awsService.uploadUsingSdk(file, this.docData['path']).then(
      data => {
        this.uploadingPriorDoc = false;
        const newFile: PADocForListDto = {
          id: this.docData.id,
          title: file.name,
          path: this.docData.preSignedUrl
         };
         if (!this.priorAuthAddEditDto.paDocuments) {
          this.priorAuthAddEditDto.paDocuments = [];
         }
          this.priorAuthAddEditDto.paDocuments.push(newFile);
        // this.getMeasureDataByCode(this.currentCode ,null);
      },
      err => {
        this.uploadingPriorDoc = false;
        this.priorAuthService.AddPADocumentOnError(this.docData.id).subscribe(res => {
          if (res) {
            this.toaster.error(err.message, err.error || err.error);
          }
        });
      }
    );
    // }
  }
  viewDoc(path: string) {
    // doc.path
    this.processingDoc = true;
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const importantStuff = window.open(nUrl);
      // const importantStuff = window.open("", "_blank");
      this.subs.sink = this.pcmService.getPublicPath(path).subscribe(
        (res: any) => {
          this.processingDoc = false;
          // importantStuff.location.href = res;
          // var win = window.open(res, '_blank');
          // win.opener = null;
          // win.focus();
          if (path.toLocaleLowerCase().includes('.pdf')) {
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
          this.processingDoc = false;
          // this.preLoader = 0;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  patientSelected() {
    setTimeout(() => {
      const cPatient = this.patientList.find(x => x.id === this.priorAuthAddEditDto.patientId);
      if (cPatient) {
        this.priorAuthAddEditDto.insurancePlanId = cPatient.insurancePlanId || null;
      }
    }, 500);
  }
}
