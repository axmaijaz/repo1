import { AppUiService } from './../../core/app-ui.service';
import { AddCcmEncounterDto } from './../../model/admin/ccm.model';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { BhiService } from './../../core/bhi.service';
import { FacilityService } from './../../core/facility/facility.service';
import { SecurityService } from './../../core/security/security.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { BhiEncounterDto, BHIUploadDocDto, DocListDto, BhiEncountersListDto } from 'src/app/model/Bhi/bhi.model';
import { ActivatedRoute } from '@angular/router';
import { AppDataService } from 'src/app/core/app-data.service';
import { Location } from '@angular/common';
import { AwsService } from 'src/app/core/aws/aws.service';
import { DocDataDto } from 'src/app/model/pcm/pcm.model';
import * as moment from 'moment';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { BhiMonthEnum, BhiMonthlyStatus, BhiStatusEnum } from 'src/app/Enums/bhi.enum';
import { environment } from 'src/environments/environment';
import { Clipboard } from '@angular/cdk/clipboard';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { TwoCTextAreaComponent } from 'src/app/utility/two-c-text-area/two-c-text-area.component';
import { DataFilterService } from 'src/app/core/data-filter.service';
@Component({
  selector: 'app-bhi-add-encounters',
  templateUrl: './bhi-add-encounters.component.html',
  styleUrls: ['./bhi-add-encounters.component.scss']
})
export class BhiAddEncountersComponent implements OnInit {
  @ViewChild('addAttachment') addAttachmentModal: ModalDirective;
  @ViewChild('bhiMonthStatusModal') bhiMonthStatusModal: ModalDirective;
  switchModalComponent: number; // 1 for diagnoses // 2 for medications
  selectedToolTab = 1;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    appendTo: "body",
    drops:'down'
  };
  bhiUploadDocObj = new BHIUploadDocDto();
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
  addBhiEncounterDto = new BhiEncounterDto();
  IsaddingEncounterLoading: boolean;
  PatientId = 0;
  yearNum = 0;
  listOfYears = [];
   currentMonth: number = new Date().getMonth() + 1;
  loadingPsy: boolean;
  loadingBhiUsers: boolean;
  bhiCarePlan: any;
  bhiFacilityUsersList: CreateFacilityUserDto[];
  savingCareplan: boolean;
  uploadingDoc: boolean;
  docData: DocDataDto;
  documentsList: DocListDto[];
  bhiCareManagerId: number;
  psychiatristId: number;
  file: any;
  bhiEncountersList: BhiEncountersListDto[];
  IsEncounterLoading: boolean;
  gettingDocs: boolean;
  viewEncounterObj = new BhiEncountersListDto();
  bhiMonthlyStatusList = this.filterDataService.getEnumAsList(BhiMonthlyStatus);
  bhiMonthlyStatusEnum = BhiMonthlyStatus;
  PatientEncounterMonthlyStatusTExt = BhiMonthlyStatus[BhiMonthlyStatus['Not Started']];
  @ViewChild('durationInput') durationInput: ElementRef;
  @ViewChild('editor12') editor12: ElementRef;
  @ViewChild('myFIeldRefBHI') myFIeldRefBHI: TwoCTextAreaComponent;
  IsdeletingDoc: boolean;
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
  activePcm99426PopOvers = `<ul>
  <li>Principal care management services, for a single high-risk disease with the same required elements as code 99424 (see previous slide). First 30 minutes of clinical staff time directed by a physician or other qualified health care professional; per calendar month.
  </li>
  </ul>
  `;
  activePcm99427PopOvers = `<ul>
  <li>Each additional 30 minutes of clinical staff time directed by a physician or other qualified health care professional; per calendar month (List separately in addition to code for primary procedure)
  </li>
  </ul>
  `;
  durationNO: number;
  loadingEditor = true;
  bhiStatus: BhiStatusEnum;
  bhiStatusEnum = BhiStatusEnum;
  bhiMonthStatus: BhiMonthEnum;
  bhiMonthEnum = BhiMonthEnum;
  tempAddEncounter = new BhiEncounterDto();
  isEditingBhiEncounter: boolean;
  bhiCareCoordinatorId: any;
  durationtemp: number;
  queryParams = '';
  objectURLStrAW: string;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;
  isLoading: boolean;
  deletingBHIEncounter: boolean;
  facilityUsersList = new Array<CreateFacilityUserDto>();
  constructor(private securityService: SecurityService, private facilityService: FacilityService,private clipboard: Clipboard,
    private bhiService: BhiService,private route: ActivatedRoute, private toaster: ToastService, private ccmDataService: CcmDataService,
    private appDataService: AppDataService, private location: Location, private awsService: AwsService, private appUi: AppUiService, private filterDataService: DataFilterService,) { }

  ngOnInit() {
    // this.testCollapse.isCollapsed = false;
    this.yearNum = this.appDataService.currentYear;
    this.listOfYears = this.appDataService.listOfYears;
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    this.bhiCareManagerId = +this.route.snapshot.queryParamMap.get('bhiCareManagerId');
    this.psychiatristId = +this.route.snapshot.queryParamMap.get('psychiatristId');
    this.psychiatristId = +this.route.snapshot.queryParamMap.get('psychiatristId');
    // const tempBhiCareCoordinatorIds = this.route.snapshot.queryParamMap.get('bhiCareCoordinatorIds');
    // let a = "1,2,3,4";
    // this.bhiCareCoordinatorId = Array.from(tempBhiCareCoordinatorIds.split(','),Number);
    this.bhiStatus = +this.route.snapshot.queryParamMap.get('bhiStatus');
    if (this.bhiStatus === this.bhiStatusEnum['Active G-BHI']) {
      this.addBhiEncounterDto.cptCode = '99484';
    }
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    // this.loadProviders();
    this.GetBhiCarePlan();
    if (this.bhiStatus === this.bhiStatusEnum['Active CoCM']) {
      this.GetBhiCocmMonth();
    }
    this.getPsyFacilityUsers();
    this.getBhiFacilityUsers();
    const date = moment().format('hh:mm');
    this.addBhiEncounterDto.startTime = date;
    const date1 = moment().format('YYYY-MM-DD');
    this.addBhiEncounterDto.encounterDate = date1;
    this.getBhiEncountersByPatientId();
    this.GetBhiDocumentsByPatientId();
    this.queryParams = window.location.href.substring(window.location.href.indexOf('?'));
    this.getFacilityUsers();
  }
  navigateBack() {
    this.location.back();
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
  GetBhiCarePlan() {
    // this.userManagerService.getGetCareProviderList().subscribe(
    // this.facilityService.getFacilityUserList(this.facilityId).subscribe(
    this.bhiService.GetBhiCarePlan(this.PatientId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.bhiCarePlan = res.carePlan ;
          }
        },
        (error: HttpResError) => {
          // this.loadingPsy = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  GetBhiCocmMonth() {
    this.bhiService.GetBhiCocmMonth(this.PatientId).subscribe((res: {bhiMonth: BhiMonthEnum}) => {
        if (res) {
          this.bhiMonthStatus = res.bhiMonth;
          if (this.bhiMonthStatus === BhiMonthEnum.UnKnown) {
            this.bhiMonthStatusModal.show();
          }
          if (this.bhiMonthStatus === BhiMonthEnum.FirstMonth) {
            this.addBhiEncounterDto.cptCode = '99492';
          }
          if (this.bhiMonthStatus === BhiMonthEnum.SubsequentMonth) {
            this.addBhiEncounterDto.cptCode = '99493';
          }

        }
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SetBhiCocmMonth() {
    this.bhiService.SetBhiCocmMonth(this.PatientId, this.bhiMonthStatus).subscribe((res: any) => {
        if (res) {
        }
        this.bhiMonthStatusModal.hide();
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetBhiDocumentsByPatientId() {
    // this.userManagerService.getGetCareProviderList().subscribe(
    // this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      this.gettingDocs = true;
      this.bhiService.GetBhiDocumentsByPatientId(this.PatientId)
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
  getFacilityUsers() {
    // let roleName = "PRCM Care Manager";
    this.isLoadingPayersList = true;
    this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      (res: []) => {
        this.facilityUsersList = res;
        // this.addBhiEncounterDto.bhiCareCoordinatorId = this.bhiCareCoordinatorId;
        this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getPsyFacilityUsers() {
    const roleName =  'Psychiatrist';
     this.loadingPsy = true;
     this.bhiService.GetFacilityUsers(this.facilityId, roleName).subscribe(
       (res: []) => {
         this.psyfacilityUserList = res;
         if (this.psychiatristId) {
          this.addBhiEncounterDto.psychiatristId = this.psychiatristId;
         }
         this.loadingPsy = false;
       },
       (error: HttpResError) => {
         this.loadingPsy = false;
         this.toaster.error(error.error, error.message);
       }
     );
   }
   viewEncunterDetail(encounter: BhiEncountersListDto, modal: ModalDirective) {
    this.viewEncounterObj = encounter;
    modal.show();
   }
   OpenEditBhiEncounter(encounter: BhiEncountersListDto, modal: ModalDirective) {
    Object.assign(this.tempAddEncounter, this.addBhiEncounterDto);
    this.addBhiEncounterDto.id = encounter.id;
    this.addBhiEncounterDto.encounterDate = encounter.encounterDate;
    this.addBhiEncounterDto.startTime = encounter.startTime;
    this.addBhiEncounterDto.endTime = encounter.endTime;
    this.addBhiEncounterDto.bhiCareManagerId = encounter.bhiCareManagerId;
    this.addBhiEncounterDto.psychiatristId = encounter.psychiatristId;
    this.addBhiEncounterDto.patientId = encounter.patientId;
    this.addBhiEncounterDto.cptCode = encounter.cptCode;
    this.addBhiEncounterDto.bhiServiceTypeId = encounter.bhiServiceType;
    this.addBhiEncounterDto.gbhiPsychiatrist = encounter.gbhiPsychiatrist;
    this.addBhiEncounterDto.bhiCareCoordinatorId = encounter.bhiCareCoordinatorId;
    this.addBhiEncounterDto.isProviderEncounter = encounter.isProviderEncounter;
    this.addBhiEncounterDto.note = encounter.note;
    this.addBhiEncounterDto.bhiMonthlyStatus = encounter.bhiMonthlyStatus;
    this.durationtemp = +this.durationInput.nativeElement.value;
    modal.show();
    const du  = +encounter.duration.split(':')[1];
    this.durationNO = +du;
    this.FillNoteText(this.addBhiEncounterDto.note);
   }
   FillNoteText(text: string) {
    if (this.myFIeldRefBHI?.FillValue) {
      this.myFIeldRefBHI.FillValue(text || '');
    } else {
      setTimeout(() => {
        if (this.myFIeldRefBHI?.FillValue) {
          this.myFIeldRefBHI.FillValue(text || '');
        }
      }, 1000);
    }
  }
   EditBhiCarePLan() {
    this.savingCareplan = true;
    const data = {
      patientId: this.PatientId,
      bhiCarePlan: this.bhiCarePlan
    };
    this.bhiService.EditBhiCarePlan(data).subscribe(
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
   getBhiFacilityUsers() {
    const roleName = 'Care Manager';
    this.loadingBhiUsers = true;
    this.bhiService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.bhiFacilityUsersList =  res;
        if (this.bhiCareManagerId) {
          this.addBhiEncounterDto.bhiCareManagerId = this.bhiCareManagerId;
         }
        this.loadingBhiUsers = false;
      },
      (error: HttpResError) => {
        this.loadingBhiUsers = false;
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
    // this.bhiUploadDocObj.title = this.file.name;
   }
   fillDate() {
    this.bhiUploadDocObj.dateCreated = moment().format('YYYY-MM-DD');
   }
   AddBhiDocument() {
    this.uploadingDoc = true;
    const data = {
      title: this.bhiUploadDocObj.title+ '.' + this.file.name.split('.').pop(),
      // code: this.selectedMeasure.code,
      patientId: this.PatientId,
      note: this.bhiUploadDocObj.note,
      dateCreated: this.bhiUploadDocObj.dateCreated
    };
    this.bhiService.AddBhiDocument(data).subscribe(
      (res: DocDataDto) => {
        this.docData = res;
        this.uploadBhiDocToS3();
      },
      (err: HttpResError) => {
        // this.editingPcmData = false;
        this.uploadingDoc = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
   async uploadBhiDocToS3() {
    // if (this.patientRpmConsentType === 1) {
    // this.rpmInputLoading = true;
    this.uploadingDoc = true;
    const path = `bhiDocs/BehaviorHealth-${this.PatientId}/${this.file.name}`;
    this.awsService.uploadUsingSdk(this.file, this.docData['path']).then(
      data => {
        this.uploadingDoc = false;
        this.toaster.success('Document uploaded successfully');
        this.addAttachmentModal.hide();
        this.GetBhiDocumentsByPatientId();
      },
      err => {
        this.uploadingDoc = false;
        this.bhiService.AddBhiDocumentError(122).subscribe(res => {
          if (res) {
            this.toaster.error(err.message, err.error || err.error);
          }
        });
      }
    );
    // }
  }
   addBhiEncounter() {
     this.IsaddingEncounterLoading = true;
     if (this.bhiStatus == 4) {
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
   editBhiEncounter(modal: ModalDirective) {
    this.isEditingBhiEncounter = true;
    if (this.bhiStatus == 4) {
      this.addBhiEncounterDto.psychiatristId = null;
     } else {
       this.addBhiEncounterDto.gbhiPsychiatrist = '';
     }
    this.bhiService.EditBhiEncounter(this.addBhiEncounterDto).subscribe(
      (res: any) => {
       //  this.psyfacilityUserList = res;
       this.resetEncounterForm();
       this.toaster.success('Encounter edited successfully');
       this.OnCloseEditEncounter();
       modal.hide();
       this.isEditingBhiEncounter = false;
       this.getBhiEncountersByPatientId();
      },
      (error: HttpResError) => {
       this.isEditingBhiEncounter = false;
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
    if (this.psychiatristId) {
      this.addBhiEncounterDto.psychiatristId = this.psychiatristId;
    }
    if (this.bhiCareManagerId) {
    this.addBhiEncounterDto.bhiCareManagerId = this.bhiCareManagerId;
    }
    this.durationNO = null;
    this.FillNoteText(this.addBhiEncounterDto.note);
    this.addBhiEncounterDto.bhiMonthlyStatus = this.bhiMonthlyStatusEnum['Not Started'];
    this.PatientEncounterMonthlyStatusTExt = BhiMonthlyStatus[BhiMonthlyStatus['Not Started']];
  }
  OnCloseEditEncounter() {
    if (!this.tempAddEncounter.endTime) {
      this.tempAddEncounter.endTime = '';
    }
    this.durationInput.nativeElement.value = +this.durationtemp;
    Object.assign(this.addBhiEncounterDto, this.tempAddEncounter);
  }
  DeleteBhiDocument(id: number) {
    this.IsdeletingDoc = true;
    this.bhiService.DeleteBhiDocument(id).subscribe(
      (res: []) => {
       //  this.psyfacilityUserList = res;
       this.toaster.success('Document deleted successfully');
        this.GetBhiDocumentsByPatientId();
        this.IsdeletingDoc = false;
      },
      (error: HttpResError) => {
       this.IsdeletingDoc = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getBhiEncountersByPatientId() {
    this.IsEncounterLoading = true;
    this.bhiService.GetBhiEncountersByPatientId(this.PatientId, this.currentMonth, this.yearNum).subscribe(
      (res: any) => {
        this.bhiEncountersList = res.bhiEncountersList;
        this.IsEncounterLoading = false;
        if (this.bhiStatus === this.bhiStatusEnum['Active G-BHI']) {
          this.addBhiEncounterDto.cptCode = '99484';
          return;
        }
        // if (this.bhiEncountersList.length > 0) {
        //   this.addBhiEncounterDto.cptCode = '99493';
        // } else {
        //   this.addBhiEncounterDto.cptCode = '99492';
        // }
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
  DownLoadPDF() {
    this.isLoading = true;
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const mWindow = window.open(nUrl);
    this.bhiService
      .GetBhiCarePlanPdf(this.PatientId)
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
    div.innerHTML = this.bhiCarePlan;
    mydoc.body.appendChild(div);
    const text = div.innerText;
    div.remove();
    this.clipboard.copy(text.toString());
    this.toaster.success('Content Copied');
  }
  openConfirmModal(data: number) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Remove Encounter';
    modalDto.Text = 'Are you sure that you want to delete this Encounter.';
    modalDto.callBack = this.DeleteBhiEncounterById;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  DeleteBhiEncounterById = (id: number) => {
    this.deletingBHIEncounter = true;
    this.bhiService.DeleteBhiEncounter(id).subscribe(
      (res: any) => {
        this.getBhiEncountersByPatientId();
        this.deletingBHIEncounter = false;
      },
      (error: HttpResError) => {
        this.deletingBHIEncounter = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
}
