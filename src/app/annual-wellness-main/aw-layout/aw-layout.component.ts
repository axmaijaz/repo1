import { AwDataService } from './../../core/annualWellness/aw-data.service';
import { data } from 'jquery';
import { SecurityService } from './../../core/security/security.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { Component, OnInit, HostListener, Inject, ViewChild, OnDestroy } from '@angular/core';
import { trigger, state, transition, style, animate } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import FileSaver from 'file-saver';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { Location } from '@angular/common';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AwFormsENum, FacilityFormsDto } from 'src/app/model/Facility/facility.model';
import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { AppDataService } from 'src/app/core/app-data.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { AWPhysiciantabEncounterDto, SendAWToPatientDto } from 'src/app/model/AnnualWellness/aw.model';
import { PcmEncounterStatus } from 'src/app/model/pcm/pcm.model';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { DownloadawDocConfComponent } from '../downloadaw-doc-conf/downloadaw-doc-conf.component';
import { PatientsService } from 'src/app/core/Patient/patients.service';
@Component({
  selector: 'app-aw-layout',
  templateUrl: './aw-layout.component.html',
  styleUrls: ['./aw-layout.component.scss'],
})
export class AwLayoutComponent implements OnInit, OnDestroy {
  activeTabId = 1;
  isLoadingZip: boolean;
  facilityFormsDto = new FacilityFormsDto();
  patientFormsDto = new FacilityFormsDto();
  annualWellnessID: number;
  facilityId: number;
  isSyncDisabled: boolean;
  awStatus: PcmEncounterStatus;
  isCopyAWData: boolean;
  sendingToPatient: boolean;
  sendToPatienTDto = new SendAWToPatientDto();
  PatientId = 0;
  objectURLStrAW = '';
  isLoadingPayersList: boolean;
  facilityUsersList = [];
  careCoordinator: number;
  awFormType = AwFormsENum;
  countryCallingCode: any;
  countriesList: any;

  constructor(private location: Location, @Inject(DOCUMENT) document, private router: Router, private route: ActivatedRoute,
  private awService: AwService, private toaster: ToastService, private facilityService: FacilityService, private securityService: SecurityService,
  private eventBus: EventBusService, private appDataService: AppDataService, public appUi: AppUiService,private clipboard: Clipboard, private awDataService: AwDataService,
  private patientService: PatientsService
  ) {

  }

  ngOnInit() {
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    this.annualWellnessID = +this.route.pathFromRoot[3].snapshot.paramMap.get('awId');
    if (!this.isActive()) {
      this.activeTabId = 0;
    }
    this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    if (this.securityService.hasClaim("IsCareCordinator")) {
      this.careCoordinator = this.securityService.securityObject.id;
      this.awDataService.careCordinatorId = this.securityService.securityObject.id;
    } else {
      this.awDataService.careCordinatorId = null;
    }
    this.GetFacilityForms();
    this.GetStaffCareCoordinator();
    this.GetPatientCustomForms();
    this.GetIsSyncFromAnnualWellness();
    this.GetAWEncounterPhysicianTabById();
    this.getFacilityUsers();
    this.GetAllCountries()
  }
  ngOnDestroy() {
    this.appDataService.awGapsData = '';
    this.patientFormsDto = new FacilityFormsDto();

  }
  getFacilityUsers() {
    // let roleName = "PRCM Care Manager";
    this.isLoadingPayersList = true;
    this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      (res: []) => {
        this.facilityUsersList = res;
        this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetFacilityForms() {
    // this.selectedFacilityId = row.id;
    this.facilityService.GetFacilityForms(this.facilityId).subscribe(
      (res: FacilityFormsDto) => {

        this.facilityFormsDto = res;
      },
      (error: HttpResError) => {
        // this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  createForm (formType: AwFormsENum) {
    if (formType === AwFormsENum.HumanaForm) {
      this.patientFormsDto.hasHumana = true;
      this.activeTabId = 5;
      this.router.navigate(['awForm/humana'], { relativeTo: this.route});
    }
    if (formType === AwFormsENum.SuperBill) {
      this.patientFormsDto.hasSuperBill = true;
      this.activeTabId = 4;
      this.router.navigate(['awSupplement'], { relativeTo: this.route});
    }
    if (formType === AwFormsENum.PrimeWest) {
      this.patientFormsDto.hasPWReport = true;
      this.activeTabId = 6;
      this.router.navigate(['awForm/primeWest'], { relativeTo: this.route});
    }
    if (formType === AwFormsENum.AnnualWellness) {
      this.patientFormsDto.hasAWReport = true;
      this.activeTabId = 7;
      this.router.navigate(['awForm/awvReport'], { relativeTo: this.route});
    }
  }
  GetPatientCustomForms() {
    // this.selectedFacilityId = row.id;
    this.facilityService.GetPatientCustomForms(this.PatientId, this.annualWellnessID).subscribe(
      (res: FacilityFormsDto) => {

        this.patientFormsDto = res;
      },
      (error: HttpResError) => {
        // this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }

  openConfirmModal2(formType: number) {
    const modalDto = new LazyModalDto();
    modalDto.Title = `Delete ${AwFormsENum[formType]}`;
    modalDto.Text = `Are you sure you want to remove ${AwFormsENum[formType]}? All data will be lost.`;
    // modalDto.hideProceed = true;
    modalDto.callBack = this.callBack2;
    modalDto.data = formType;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack2 = (data: number) => {
    this.RemoveAWForm(data)
  };

  RemoveAWForm(formType: number) {
    // this.selectedFacilityId = row.id;
    this.awService.RemoveAWForm(this.annualWellnessID, formType ).subscribe(
      (res) => {
        this.GetPatientCustomForms();
        this.router.navigateByUrl(`/annualWellness/AWMain/${this.PatientId}/${this.annualWellnessID}/awPatient`)
        this.toaster.success(`${AwFormsENum[formType]} deleted Successfully`)

      },
      (error: HttpResError) => {
        // this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetAWEncounterPhysicianTabById() {
    this.awService.GetAWEncounterPhysicianTabById(this.annualWellnessID).subscribe((res: AWPhysiciantabEncounterDto) => {
      this.awStatus = res.status;
      this.awDataService.awStatus = res.status;

    });
  }
  GetIsSyncFromAnnualWellness() {
    this.awService.GetIsSyncFromAnnualWellness(this.annualWellnessID).subscribe(
      (res: boolean) => {
        this.isSyncDisabled = res;
        // this.toaster.success("");
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetStaffCareCoordinator() {
    this.awService.GetStaffCareCoordinator(this.annualWellnessID).subscribe(
      (res: any) => {
        if (res.coordinatorId) {
          this.careCoordinator = res.coordinatorId;
          this.awDataService.careCordinatorId = res.coordinatorId;
        } else if (this.awDataService.careCordinatorId) {
          this.UpdateStaffCareCoordinator();
        }
        // this.toaster.success("");
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  UpdateStaffCareCoordinator() {
    this.awService.UpdateStaffCareCoordinator(this.annualWellnessID, this.careCoordinator).subscribe(
      (res: any) => {
        this.awDataService.careCordinatorId = this.careCoordinator;
        // this.isSyncDisabled = res;
        this.toaster.success("Assign Successfully");
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SendToPatient(modal: ModalDirective) {
    this.sendingToPatient = true;
    const phoneNumberWithCountryCallingCode =  1 + this.sendToPatienTDto.phoneNo;
    this.sendToPatienTDto.phoneNo = phoneNumberWithCountryCallingCode;
    this.sendToPatienTDto.awEncounterId = this.annualWellnessID;
    let url = '';
    //  url = "http://localhost:4200/teleCare/vCall";
    if (environment.production === true) {
      url = `https://app.2chealthsolutions.com/awForm/awPatient/${this.PatientId}/${this.annualWellnessID}`;
    } else {
      url = `${environment.appUrl}awForm/awPatient/${this.PatientId}/${this.annualWellnessID}`;
    }
    this.sendToPatienTDto.urlLink = url;
    this.awService.SendToPatient(this.sendToPatienTDto).subscribe((res: AWPhysiciantabEncounterDto) => {
      // this.awEncounterPTabDto = res;
      modal.hide();
      this.sendToPatienTDto = new SendAWToPatientDto();
      this.countryCallingCode = null;
      this.sendingToPatient = false;
    },
      (err: HttpResError) => {
        this.sendingToPatient = false;
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      });
  }
  OPenPatientTab() {
    let url = '';
    //  url = "http://localhost:4200/teleCare/vCall";
    if (environment.production === true) {
      url = `https://app.2chealthsolutions.com/awForm/awPatient/${this.PatientId}/${this.annualWellnessID}`;
    } else {
      url = `${environment.appUrl}awForm/awPatient/${this.PatientId}/${this.annualWellnessID}`;
    }
    window.open(url, '_blank');
  }
  UpdateSyncFromAnnualWellness() {
    this.awService.UpdateSyncFromAnnualWellness(this.annualWellnessID, this.isSyncDisabled).subscribe(
      (res: boolean) => {
        // this.isSyncDisabled = res;
        // this.EmitEventForGapDataChange();
        // this.toaster.success("");
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  copyText() {
    this.isCopyAWData = true;
    const mydoc = document;
    this.awService
    .GetAwEncounterForCopy(this.annualWellnessID)
    .subscribe(
      (res: any) => {

        setTimeout(() => {
          this.copyOnClipboard(res);
        }, 1000);
    //     const textArea = document.createElement('textarea');
    // // textArea.style.display = 'none';
    // // const data: string = res.result;
    // // textArea.value = data;
    // textArea.innerText = res.result;;
    // mydoc.body.appendChild(textArea);
    // // textArea.innerText = data;
    // // textArea.focus();
    // textArea.select();
    // textArea.setSelectionRange(0, 99999);
    // mydoc.execCommand('copy');
    // textArea.remove();
    // // copyDataBtn.title = 'Copied';
    // this.toaster.success('Content Copied');
        // this.copyOnClipboard(res.result);
        // const el = document.createElement('textarea');
        // el.value = 'shdax jasxbjhaxbs hjasbcxjsancx dshcsdjc';
        // el.setAttribute('readonly', '');
        // el.style.position = 'absolute';
        // el.style.left = '-9999px';
        // document.body.appendChild(el);
        // el.select();
        // document.execCommand('copy');
        // document.body.removeChild(el);
          // this.toaster.success('Content Copied');
        this.isCopyAWData = false;
      },
      (error: HttpResError) => {
        this.isCopyAWData = false;
        this.toaster.error(error.error, error.message);
      }
    );

  }
  copyOnClipboard(text: any) {
    // this.clipboard.copy(text);
    navigator.clipboard.writeText(text.result);
    // let mydoc = document;
    // const textArea = mydoc.createElement('input');
    // // textArea.style.display = 'none';
    // // const data: string = text;
    // textArea.value = text;
    // mydoc.body.appendChild(textArea);
    // // textArea.focus();
    // textArea.select();
    // textArea.setSelectionRange(0, 99999);
    // setTimeout(() => {
    //   mydoc.execCommand('copy');
    // }, 1000);
    // // textArea.remove();
    // // copyDataBtn.title = 'Copied';
    this.toaster.success('Content Copied');
  }
  openConfirmModal() {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Refresh Gaps Data';
    modalDto.Text = 'Changes you made in Gaps Data may be lost, Do you want to refresh ?';
    modalDto.callBack = this.RefreshGapsData;
    // modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  RefreshGapsData = () => {
    this.awService.RefreshGapsData(this.annualWellnessID).subscribe(
      (res: any) => {
        this.EmitEventForGapDataChange(res.gapsData);
        this.toaster.success('Gaps data refreshed');
        // this.isSyncDisabled = res;
        // this.EmitEventForGapDataChange();
        // this.toaster.success("");
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  EmitEventForGapDataChange(data?: string) {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = EventTypes.AwSyncingCheckbox;
    event.value = data;
    this.eventBus.emit(event);
  }
  navigateBack() {
    this.location.back();
  }
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset > 500) {
      const element = document.getElementById('ccm-header');
      if (!element) {
        return;
      }
      element.classList.add('sticky-header');
    } else {
      const element = document.getElementById('ccm-header');
      if (!element) {
        return;
      }
      element.classList.remove('sticky-header');
    }
  }
  isActive(): boolean {
    const ddf = this.router.isActive(this.router.createUrlTree(['awPatient'], {relativeTo: this.route}).toString(), true);
    console.log(ddf);
    return ddf;
  }
  DownLoadPdf() {
    this.isLoadingZip = true;
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const importantStuff = window.open(nUrl);
      this.awService
        .GetAnnualWellnessPdf(this.annualWellnessID)
        .subscribe(
          (res: any) => {
            this.isLoadingZip = false;
            const file = new Blob([res], { type: 'application/pdf' });
            const fileURL = window.URL.createObjectURL(file);
            importantStuff.location.href = fileURL;
            // FileSaver.saveAs(
            //   new Blob([res], { type: 'application/pdf' }),
            //   `${this.annualWellnessID}-Annual-wellness.pdf`
            // );
          },
          (err: any) => {
            this.isLoadingZip = false;
            this.toaster.error(err.error, err.message);
          }
        );
  }
  DownLoadMergedPdf(awData: any, comp: DownloadawDocConfComponent, modal: ModalDirective) {
    comp.isLoadingData = true;
    comp.downloadDocumentsModal.hide();
    awData.awEncounterId = this.annualWellnessID;
      this.awService
        .GetMergedPdf(awData)
        .subscribe(
          (res: any) => {
            const file = new Blob([res], { type: 'application/pdf' });
            const fileURL = window.URL.createObjectURL(file);
            this.objectURLStrAW = fileURL;
            modal.show();
            comp.isLoadingData = false;
            // importantStuff.location.href = fileURL;
            // FileSaver.saveAs(
            //   new Blob([res], { type: 'application/pdf' }),
            //   `${this.annualWellnessID}-Annual-wellness.pdf`
            // );
          },
          (err: any) => {
            comp.isLoadingData = false;
            this.toaster.error(err.error, err.message);
          }
        );
  }
  GetAllCountries(){
    this.patientService.GetAllCountries().subscribe((res: any) => {
      this.countriesList = res;
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
}
