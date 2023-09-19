import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { AppDataService } from 'src/app/core/app-data.service';
import { AwsService } from 'src/app/core/aws/aws.service';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { DocListDto } from 'src/app/model/Bhi/bhi.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { DocDataDto } from 'src/app/model/pcm/pcm.model';
import { PRCMUploadDocDto, PrCMEncounterForListDto, PRCMStatusEnum, PRCMEncounterDto } from 'src/app/model/Prcm/Prcm.model';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { PRCMService } from 'src/app/core/prcm.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { TwoCTextAreaComponent } from 'src/app/utility/two-c-text-area/two-c-text-area.component';
import { EventObj } from '@tinymce/tinymce-angular/editor/Events';

@Component({
  selector: 'app-pr-cm-encounter',
  templateUrl: './pr-cm-encounter.component.html',
  styleUrls: ['./pr-cm-encounter.component.scss']
})
export class PrCMEncounterComponent implements OnInit {
  @ViewChild('addAttachment') addAttachmentModal: ModalDirective;
  switchModalComponent: number; // 1 for diagnoses // 2 for medications
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: "body",
    drops:'down'
  };
  PRCMUploadDocObj = new PRCMUploadDocDto();
  public onlydatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: "body",
    drops:'down'
  };
  public timePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'hh:mm'
  };
  public dropdownScroll = {
    axis: 'y',
    theme: 'dark-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    scrollbarPosition: 'outside'
  };
  facilityId = 0;
  providerList = new Array<CreateFacilityUserDto>();
  isLoadingPayersList: boolean;
  psyfacilityUserList = new Array<CreateFacilityUserDto>();
  addPRCMEncounterDto = new PRCMEncounterDto();
  IsaddingEncounterLoading: boolean;
  PatientId = 0;
  yearNum = 0;
  listOfYears = [];
   currentMonth: number = new Date().getMonth() + 1;
  loadingPsy: boolean;
  loadingPRCMUsers: boolean;
  PRCMCarePlan: any;
  prcmCoordinatorsList = new Array<CreateFacilityUserDto>();
  prcmSpecialistsList = new Array<CreateFacilityUserDto>();
  prCMCareFacilitatorsList = new Array<CreateFacilityUserDto>();
  savingCareplan: boolean;
  uploadingDoc: boolean;
  docData: DocDataDto;
  documentsList: DocListDto[];
  PRCMCareFacilitatorId: number;
  PRCMSpecialistId: number;
  file: any;
  PRCMEncountersList: PrCMEncounterForListDto[];
  IsEncounterLoading: boolean;
  gettingDocs: boolean;
  viewEncounterObj = new PrCMEncounterForListDto();
  @ViewChild('durationInput') durationInput: ElementRef;
  @ViewChild('editor12') editor12: ElementRef;
  @ViewChild('myFIeldRefPCM') myFIeldRefPCM: TwoCTextAreaComponent;
  IsdeletingDoc: boolean;
  public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'light-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true,
    scrollbarPosition: 'inside'
  };
  PRCMINfoHtml = `<ul>
  <li>1.If patient PRCM Status is “Active CoCM”, CPT 99492 and CPT 99493 will be populated.
  a.	In case there is no previous encounter for that patient in database CPT 99492 will be selected by default.
  b.	In case patient has any previous encounter history CPT 99493 will be selected by default.
  </li>
  <li>2.If patient PRCM Status is “Active G-PRCM”, only one selection will be available which is CPT 99484.</li>
  </ul>
  `;
  durationNO: number;
  loadingEditor = true;
  PRCMStatus: PRCMStatusEnum;
  PRCMStatusEnum = PRCMStatusEnum;
  tempAddEncounter = new PrCMEncounterForListDto();
  isEditingPRCMEncounter: boolean;
  durationtemp: number;
  queryParams = '';
  objectURLStrAW: string;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;
  isLoading: boolean;
  isEndo = false;
  isGeneral = false;
  constructor(private securityService: SecurityService, private facilityService: FacilityService,private clipboard: Clipboard,
    private PRCMService: PRCMService, private route: ActivatedRoute, private toaster: ToastService, private ccmDataService: CcmDataService,
    private appDataService: AppDataService, private location: Location, private awsService: AwsService,
    private dataFilterService: DataFilterService, private router: Router) { }

  ngOnInit() {
    const tempTabChwck = this.appDataService.tabCheck;
    if(tempTabChwck){
      if(tempTabChwck == "isGeneral"){
        this.isGeneral = true;
      }
      if(tempTabChwck == "isEndo"){
        this.isEndo = true;
      }
    }
    // this.testCollapse.isCollapsed = false;
    this.yearNum = this.appDataService.currentYear;
    this.listOfYears = this.appDataService.listOfYears;
    this.PatientId = +this.route.snapshot.paramMap.get('id');

    // prcmCareFacilitatorId=${row.end_PrCMCareFacilitatorId}&prcmSpecialistId=
    this.PRCMCareFacilitatorId = +this.route.snapshot.queryParamMap.get('prcmCareFacilitatorId');
    if (this.PRCMCareFacilitatorId) {
      this.addPRCMEncounterDto.end_PrCMCareFacilitatorId = this.PRCMCareFacilitatorId;
    }
    this.PRCMSpecialistId = +this.route.snapshot.queryParamMap.get('prcmSpecialistId');
    if (this.PRCMSpecialistId) {
      this.addPRCMEncounterDto.end_PrCMSpecialistBillerId = this.PRCMSpecialistId;
    }
    if(this.securityService.getClaim("IsEndoCareCoordinator") && this.securityService.getClaim("IsEndoCareCoordinator").claimValue) {
      this.addPRCMEncounterDto.prCMCareCoordinatorId = this.securityService.securityObject.id;
    }
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    // this.loadProviders();
    this.GetPRCMCarePlan();
    this.getPRCMSpecialistFacilityUsers();
    this.getPRCMFacilitatorFacilityUsers();
    this.getPrcmCoordinatorsUsers()
    const date = moment().format('hh:mm');
    this.addPRCMEncounterDto.startTime = date;
    const date1 = moment().format('YYYY-MM-DD');
    this.addPRCMEncounterDto.encounterDate = date1;
    this.getPRCMEncountersByPatientId();
    this.GetPRCMDocumentsByPatientId();
    this.queryParams = window.location.href.substring(window.location.href.indexOf('?'));
  }
  navigateBack() {
    // this.location.back();
    if(this.dataFilterService.routeState){
      this.router.navigate([this.dataFilterService.routeState],{
        queryParams:{isEndo: true}
      });
    }
    if(this.dataFilterService.routeState){
      this.router.navigate([this.dataFilterService.routeState],{
        queryParams:{isGeneral: true}
      });
    }
  }
  editorLoaded(text: string) {
    console.log(text);
  }
  loadProviders() {
    // this.userManagerService.getGetCareProviderList().subscribe(
    // this.facilityService.getFacilityUserList(this.facilityId).subscribe(
    this.facilityService
      .getCareProvidersByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.providerList = res;
          }
        },
        error => {
          // console.log(error);
        }
      );
  }
  GetPRCMCarePlan() {
    // this.userManagerService.getGetCareProviderList().subscribe(
    // this.facilityService.getFacilityUserList(this.facilityId).subscribe(
    this.PRCMService.GetPRCMCarePlan(this.PatientId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.PRCMCarePlan = res.carePlan ;
          }
        },
        (error: HttpResError) => {
          // this.loadingPsy = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  GetPRCMDocumentsByPatientId() {
    // this.userManagerService.getGetCareProviderList().subscribe(
    // this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      this.gettingDocs = true;
      this.PRCMService.GetPRCMDocumentsByPatientId(this.PatientId)
      .subscribe(
        (res: any) => {
          this.documentsList = res;
          this.gettingDocs = false;
        },
        (error: HttpResError) => {
          this.gettingDocs = false;
          // this.loadingPsy = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
   viewEncunterDetail(encounter: PrCMEncounterForListDto, modal: ModalDirective) {
    this.viewEncounterObj = encounter;
    modal.show();
   }
   OpenEditPRCMEncounter(encounter: PrCMEncounterForListDto, modal: ModalDirective) {
    Object.assign(this.tempAddEncounter, this.addPRCMEncounterDto);
    this.addPRCMEncounterDto.id = encounter.id;
    this.addPRCMEncounterDto.encounterDate = encounter.encounterDate;
    this.addPRCMEncounterDto.startTime = encounter.startTime;
    this.addPRCMEncounterDto.endTime = encounter.endTime;
    this.addPRCMEncounterDto.prCMCareCoordinatorId = encounter.prCMCareCoordinatorId;
    this.addPRCMEncounterDto.end_PrCMCareFacilitatorId = encounter.end_PrCMCareFacilitatorId;
    this.addPRCMEncounterDto.end_PrCMSpecialistBillerId = encounter.end_PrCMSpecialistBillerId;
    this.addPRCMEncounterDto.patientId = encounter.patientId;
    this.addPRCMEncounterDto.cptCode = encounter.cptCode;
    this.addPRCMEncounterDto.prCMServiceTypeId = encounter.end_PrCMServiceType;
    // this.addPRCMEncounterDto.gPRCMPsychiatrist = encounter.gPRCMPsychiatrist;
    this.addPRCMEncounterDto.note = encounter.note;
    this.durationtemp = +this.durationInput.nativeElement.value;
    modal.show();
    const du  = +encounter.duration.split(':')[1];
    this.durationNO = +du;
    this.FillNoteText(this.addPRCMEncounterDto.note);
   }
   FillNoteText(text: string) {
    if (this.myFIeldRefPCM?.FillValue) {
      this.myFIeldRefPCM.FillValue(text || '');
    } else {
      setTimeout(() => {
        if (this.myFIeldRefPCM?.FillValue) {
          this.myFIeldRefPCM.FillValue(text || '');
        }
      }, 1000);
    }
  }

   EditPRCMCarePLan() {
    this.savingCareplan = true;
    const data = {
      patientId: this.PatientId,
      PRCMCarePlan: this.PRCMCarePlan
    };
    this.PRCMService.EditPRCMCarePlan(data).subscribe(
      (res) => {
      //  this.psyfacilityUserList = res;
        this.savingCareplan = false;
      },
      (error: HttpResError) => {
        this.savingCareplan = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
   getPrcmCoordinatorsUsers() {
    const roleName = 'Care Coordinator';
    this.loadingPRCMUsers = true;
    this.PRCMService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.prcmCoordinatorsList =  res;
        this.loadingPRCMUsers = false;
      },
      (error: HttpResError) => {
        this.loadingPRCMUsers = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
   getPRCMFacilitatorFacilityUsers() {
    const roleName = 'Care Facilitator';
    this.loadingPRCMUsers = true;
    this.PRCMService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.prCMCareFacilitatorsList =  res;
        this.loadingPRCMUsers = false;
      },
      (error: HttpResError) => {
        this.loadingPRCMUsers = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
   getPRCMSpecialistFacilityUsers() {
    const roleName = 'Biller';
    this.loadingPRCMUsers = true;
    this.PRCMService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.prcmSpecialistsList =  res;
        this.loadingPRCMUsers = false;
      },
      (error: HttpResError) => {
        this.loadingPRCMUsers = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
   onUploadOutput(event) {
    if (event.target.files[0].size > 26214400) {
      this.toaster.warning('file size is more than 25 MB');
      return;
    }
    this.file = event.target.files[0];
    // this.PRCMUploadDocObj.title = this.file.name;
   }
   fillDate() {
    this.PRCMUploadDocObj.dateCreated = moment().format('YYYY-MM-DD');
   }
   AddPRCMDocument() {
    this.uploadingDoc = true;
    const data = {
      title: this.PRCMUploadDocObj.title+ '.' + this.file.name.split('.').pop(),
      // code: this.selectedMeasure.code,
      patientId: this.PatientId,
      note: this.PRCMUploadDocObj.note,
      dateCreated: this.PRCMUploadDocObj.dateCreated
    };
    this.PRCMService.AddPRCMDocument(data).subscribe(
      (res: DocDataDto) => {
        this.docData = res;
        this.uploadPRCMDocToS3();
      },
      (err: HttpResError) => {
        // this.editingPcmData = false;
        this.uploadingDoc = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
   async uploadPRCMDocToS3() {
    // if (this.patientRpmConsentType === 1) {
    // this.rpmInputLoading = true;
    this.uploadingDoc = true;
    const path = `PRCMDocs/BehaviorHealth-${this.PatientId}/${this.file.name}`;
    this.awsService.uploadUsingSdk(this.file, this.docData['path']).then(
      data => {
        this.uploadingDoc = false;
        this.toaster.success('Document uploaded successfully');
        this.addAttachmentModal.hide();
        this.GetPRCMDocumentsByPatientId();
      },
      err => {
        this.uploadingDoc = false;
        this.PRCMService.AddPRCMDocumentError(122).subscribe(res => {
          if (res) {
            this.toaster.error(err.message, err.error || err.error);
          }
        });
      }
    );
    // }
  }
   addPRCMEncounter() {
     this.IsaddingEncounterLoading = true;
     this.addPRCMEncounterDto.patientId = this.PatientId;
     this.PRCMService.AddPRCMEncounter(this.addPRCMEncounterDto).subscribe(
       (res: []) => {
        //  this.psyfacilityUserList = res;
       this.resetEncounterForm();
        this.toaster.success('Encounter added successfully');
        this.getPRCMEncountersByPatientId();
         this.IsaddingEncounterLoading = false;
       },
       (error: HttpResError) => {
        this.IsaddingEncounterLoading = false;
         this.toaster.error(error.error, error.message);
       }
     );
   }
   editPRCMEncounter(modal: ModalDirective) {
    this.isEditingPRCMEncounter = true;
    // if (this.PRCMStatus == 4) {
    //   this.addPRCMEncounterDto.PRCMSpecialistId = null;
    //  } else {
    //    this.addPRCMEncounterDto.gPRCMPsychiatrist = '';
    //  }
    this.PRCMService.EditPRCMEncounter(this.addPRCMEncounterDto).subscribe(
      (res: any) => {
       //  this.psyfacilityUserList = res;
       this.resetEncounterForm();
       this.toaster.success('Encounter edited successfully');
       this.OnCloseEditEncounter();
       modal.hide();
       this.isEditingPRCMEncounter = false;
       this.getPRCMEncountersByPatientId();
      },
      (error: HttpResError) => {
       this.isEditingPRCMEncounter = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  resetEncounterForm() {
    this.addPRCMEncounterDto = new PRCMEncounterDto();
    const date = moment().format('hh:mm');
    this.addPRCMEncounterDto.startTime = date;
    const date1 = moment().format('YYYY-MM-DD');
    this.addPRCMEncounterDto.encounterDate = date1;
    if (this.PRCMSpecialistId) {
      this.addPRCMEncounterDto.end_PrCMSpecialistBillerId = this.PRCMSpecialistId;
    }
    if (this.PRCMCareFacilitatorId) {
    this.addPRCMEncounterDto.end_PrCMCareFacilitatorId = this.PRCMCareFacilitatorId;
    }
    if(this.securityService.getClaim("IsPrCMCareCoordinator") && this.securityService.getClaim("IsPrCMCareCoordinator").claimValue) {
      this.addPRCMEncounterDto.prCMCareCoordinatorId = this.securityService.securityObject.id;
    }
    this.durationNO = null;
    this.FillNoteText(this.addPRCMEncounterDto.note);
  }
  OnCloseEditEncounter() {
    if (!this.tempAddEncounter.endTime) {
      this.tempAddEncounter.endTime = '';
    }
    this.durationInput.nativeElement.value = +this.durationtemp;
    Object.assign(this.addPRCMEncounterDto, this.tempAddEncounter);
  }
  DeletePRCMDocument(id: number) {
    this.IsdeletingDoc = true;
    this.PRCMService.DeletePRCMDocument(id).subscribe(
      (res: []) => {
       //  this.psyfacilityUserList = res;
       this.toaster.success('Document deleted successfully');
        this.GetPRCMDocumentsByPatientId();
        this.IsdeletingDoc = false;
      },
      (error: HttpResError) => {
       this.IsdeletingDoc = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getPRCMEncountersByPatientId() {
    this.IsEncounterLoading = true;
    this.PRCMService.GetPRCMEncountersByPatientId(this.PatientId, this.currentMonth, this.yearNum).subscribe(
      (res: any) => {
        this.PRCMEncountersList = res.prcmEncountersList;
        this.IsEncounterLoading = false;
      },
      (error: HttpResError) => {
       this.IsEncounterLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getPublicUrl(url: string) {
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const importantStuff = window.open(nUrl);
    this.ccmDataService.getPublicPath(url).subscribe(
      (res: any) => {
        // importantStuff.location.href = res;
        if (url.toLocaleLowerCase().includes('.pdf')) {
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
        // FileSaver.saveAs(
        //   new Blob([res], { type: 'application/pdf' }),
        //   'Consent-Document'
        // );
      },
      err => {
        // this.preLoader = 0;
        this.toaster.error(err.error, err.message);
      }
    );
  }
   durationChanged(minsToAdd: number) {
    const startTime = this.addPRCMEncounterDto.startTime;
    function D(J) {
      return (J < 10 ? '0' : '') + J;
    }
    const piece: any = startTime.split(':');
    const mins = piece[0] * 60 + +piece[1] + +minsToAdd;

    // tslint:disable-next-line: no-bitwise
    const newTime = D(((mins % (24 * 60)) / 60) | 0) + ':' + D(mins % 60);
    // this.encounterTimeForm.get('endTime').setValue(newTime);
    this.addPRCMEncounterDto.endTime = newTime;
  }
  DownLoadPDF() {
    this.isLoading = true;
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const mWindow = window.open(nUrl);
    this.PRCMService
      .GetPRCMCarePlanPdf(this.PatientId)
      .subscribe(
        (res: any) => {
          this.isLoading = false;

          const file = new Blob([res], { type: 'application/pdf' });
          const objectURL = window.URL.createObjectURL(file);

          mWindow.close();
          this.objectURLStrAW = objectURL;
          this.viewPdfModal.show();
          // mWindow.location.href = fileURL;

          // FileSaver.saveAs(
          //   new Blob([res], { type: "application/pdf" }),
          //   `${patientId}-${monthId}-${this.yearNum}-LogHistory.pdf`
          // );
        },
        (err: any) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  copyCarePlan() {
     let mydoc = document;
    const div = mydoc.createElement('div');
    // div.style.display = 'none';
    // const data: string = text;
    div.innerHTML = this.PRCMCarePlan;
    mydoc.body.appendChild(div);
    const text = div.innerText;
    div.remove();
    this.clipboard.copy(text.toString());
    this.toaster.success('Content Copied');
  }
  OnPasteInTextEditor(eData: EventObj<ClipboardEvent> | any) {
    // Prevent default paste behavior
    // eData.preventDefault();

    // Check for clipboard data in various places for cross-browser compatibility.
    // Get that data as text.
    // var sds = navigator.clipboard.readText();
    // var content = ((eData.originalEvent || eData).clipboardData || window.clipboardData).getData('Text');

    // Let TinyMCE do the heavy lifting for inserting that content into the editor.
    // this.editor12.nativeElement.execCommand('mceInsertContent', false, 'sds');
  }
  EditorRendered(event) {
    var ed = event?.editor;
    ed.ui.registry.addContextMenu('customItem1', {
      text: 'Menu Item 1',
      context: 'tools',
      onclick: function () {
          alert('Menu item 1 clicked');
      }
    });
    
  }
}
