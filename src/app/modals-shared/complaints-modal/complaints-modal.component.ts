import { AwsService } from 'src/app/core/aws/aws.service';
import { EventBusService, EventTypes } from './../../core/event-bus.service';
import { S3RecordingService } from './../../core/aws/s3-recording.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { RpmPatientsListDto } from 'src/app/model/rpm.model';
import { AddComplaintDto, ComplaintListDto, ComplaintForListDto } from 'src/app/model/AppModels/complaints.model';
import { ComplaintsService } from 'src/app/core/complaints.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { environment } from 'src/environments/environment';
import { DocDataDto } from 'src/app/model/pcm/pcm.model';
import { PADocForListDto } from 'src/app/model/PriorAuth/prioAuth.model';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { SearchedChatUsersDto } from 'src/app/model/chat/chat.model';
import { SecurityService } from 'src/app/core/security/security.service';
import { TwocChatService } from 'src/app/core/2c-chat.service';
import { debounceTime } from 'rxjs/operators';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { Subject, fromEvent } from 'rxjs';
import { DepartmentType, ComplaintStatus } from 'src/app/Enums/complaints.enum';

@Component({
  selector: 'app-complaints-modal',
  templateUrl: './complaints-modal.component.html',
  styleUrls: ['./complaints-modal.component.scss']
})
export class ComplaintsModalComponent implements OnInit, AfterViewInit {
  recorderObj: any;
  @ViewChild('complaintsMOdal') complaintsMOdal: ModalDirective;
  @ViewChild('patientComplaintsModal') patientComplaintsModal: ModalDirective;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;
  CurrentPatient = new RpmPatientsListDto();
  addComplaintObject = new AddComplaintDto();
  currentRecordingUrl: string;
  processingDoc: boolean;
  objectURLStrAW: string;
  uploadingDocument: boolean;
  ComplaintDocuments = [];
  docData: DocDataDto;
  documentUploadProgress: number;
  uploadingRecording: boolean;
  docDataRecording: DocDataDto;
  recordingBlob: any;
  // ComplaintTypeEnum = ComplaintType;
  DepartmentTypeEnum = DepartmentType;
  ComplaintStatusEnum = ComplaintStatus;
  recordingUploadProgress: number;
  patientComplaintsList: ComplaintListDto[];
  gettingComplaints: boolean;
  searchingChatUsers: boolean;
  securityObject: AppUserAuth;
  searchParam = '';
  searchedChatUserList = new Array<SearchedChatUsersDto>();
  complaintTypesList: any;
  complaintSubTypesList: any;
  selectedComplaintType: number;



  public scrollbarOptions = {
    axis: 'y',
    theme: 'dark-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true
  };
  public scrollbarOptionsTimeline = {
    axis: "y",
    theme: "dark-3",
    scrollInertia: 2,
    scrollButtons: { enable: true },
    scrollbarPosition: "outside",
  };

  searchWatch = new Subject<string>();
  facilityId: number;
  UserTypeForSearchChat = 1;
  hasDocument: boolean;
  hasRecording: boolean;
  addingComplaint: boolean;
  isGeneralComplaint= false;
  constructor(private recordingService: S3RecordingService, private eventBus: EventBusService, private complaintService: ComplaintsService,
    private toaster: ToastService, private awsService: AwsService,
    private securityService: SecurityService,
    private TwocHatService: TwocChatService
    ) {
      this.securityObject = securityService.securityObject;
      // this.currentUserAppId = this.securityObject.appUserId;
    }

  ngOnInit(): void {
   this.SubscribeModalOpen();
   this.SubscribeAddComplaintModalOpen();
   this.SearchObserver();
   this.getComplaintTypes();
   this.securityService.getClaim('FacilityId')
      ? (this.facilityId = +this.securityService.getClaim('FacilityId')
          .claimValue)
      : (this.facilityId = 0);
    if (!this.facilityId) {
      this.facilityId = 0;
    }
  }
  ngAfterViewInit() {
    this.patientComplaintsModal.config = { backdrop: false, ignoreBackdropClick: false };
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
  }
  getComplaintTypes(){
    this.complaintService.getComplaintTypes().subscribe(
      (res: any) => {
        this.complaintTypesList = res;
      }, (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    )
  }
  getComplaintSubTypes(){
    this.complaintSubTypesList = [];
    this.addComplaintObject.complaintSubTypeId = null;
    if(this.addComplaintObject.complaintTypeId){
      this.complaintService.getComplaintSubTypes(this.addComplaintObject.complaintTypeId).subscribe(
        (res: any) => {
          this.complaintSubTypesList = res;
        },(err: HttpResError) => {
          this.toaster.error(err.error);
        }
      )
    }
  }
  SubscribeModalOpen() {
    this.eventBus.on(EventTypes.openComplaintsModal).subscribe((x: RpmPatientsListDto) => {
      this.CurrentPatient = x;
      if (this.recordingService.isRecording) {
        return this.toaster.warning('Please stop previous recording');
      }
     this.CurrentPatient = x;

     this.patientComplaintsModal.config = { backdrop: false, ignoreBackdropClick: true };
     this.patientComplaintsModal.show();
     this.GetComplaintsByPatientId();
    });
    this.eventBus.on(EventTypes.stopRecordingEmit).subscribe(x => {
      this.StopRecording();
    });
  }
  SubscribeAddComplaintModalOpen(){
    this.eventBus.on(EventTypes.openAddComplaintModal).subscribe((x) => {
      if (this.recordingService.isRecording) {
        return this.toaster.warning('Please stop previous recording');
      }
     this.complaintsMOdal.config = { backdrop: false, ignoreBackdropClick: true };
     this.isGeneralComplaint = true;
     this.complaintsMOdal.show();
    });
    this.eventBus.on(EventTypes.stopRecordingEmit).subscribe(x => {
      this.StopRecording();
    });
  }
  GetComplaintsByPatientId() {
    this.gettingComplaints = true;
    this.patientComplaintsList = [];
    this.complaintService.GetComplaintsByPatientId(this.CurrentPatient.id).subscribe(
      (res: ComplaintListDto[]) => {
        this.gettingComplaints = false;
        this.patientComplaintsList = res;
      },
      (err: HttpResError) => {
        this.gettingComplaints = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  async initRecorder(withAudio: boolean) {
    this.recorderObj = await this.recordingService.GetRecorder(withAudio);
  }

  async StartRecording(withAudio: boolean) {
    try {
      this.currentRecordingUrl = '';
      await this.initRecorder(withAudio);
      this.recorderObj.start();
      this.recordingService.startRecordingInterval();
      this.complaintsMOdal.hide();
    } catch (error) {
      this.recordingService.stopRecordingInterval();
    }
  }
  async StopRecording() {
    this.recordingService.stopRecordingInterval();
    const recordedData = await this.recorderObj.stop();
    this.currentRecordingUrl = recordedData.recordingUrl;
    setTimeout(() => {
      const videoElem = document.getElementById('recordVideoPlay');
      if (videoElem) {
        videoElem['src'] = this.currentRecordingUrl;
      } else {
        setTimeout(() => {
          const videoElem1 = document.getElementById('recordVideoPlay');
          videoElem1['src'] = this.currentRecordingUrl;
        }, 2000);
      }
    }, 2000);
    this.recordingBlob = recordedData.recordingBlob;
    // this.recordigService.uploadTOS3(recordedData.recordingBlob);
    // this.recordigService.saveFile(recordedData.recordingBlob);
    this.complaintsMOdal.show();
  }
  AddPatientComplaint() {
  this.addComplaintObject.patientId = this.CurrentPatient.id;
  this.addingComplaint = true;
  if(this.isGeneralComplaint){
    this.addComplaintObject.patientId = null;
  }
  this.complaintService.AddPatientComplaint(this.addComplaintObject).subscribe(
    (res: ComplaintListDto) => {
      this.addComplaintObject.id = res.id;
      this.addingComplaint = false;
      this.hasRecording = false;
      this.hasDocument = false;
      if (this.ComplaintDocuments && this.ComplaintDocuments.length) {
        this.hasDocument = true;
        this.ComplaintDocuments.forEach(element => {
          this.AddPADocument(element);
        });
      }
      if (this.currentRecordingUrl && this.recordingBlob) {
        this.hasRecording = true;
        this.AddComplaintRecording();
      }
      if (!this.hasDocument && !this.hasRecording) {
        this.toaster.success('Added Patient Complaint Successfully');
        this.ResetAndCloseModal();
      }
      this.addComplaintObject.complaintType = null;
      this.addComplaintObject.departmentType = null;
      this.addComplaintObject.details = ''
      this.complaintService.refreshComplaintCount.next()
    },
    (error: HttpResError) => {
      this.addingComplaint = false;
      this.toaster.error(error.message, error.error);
    }
    );

  }
  ResetAndCloseModal() {
    this.recordingService.stopRecordingInterval();
    this.complaintsMOdal.hide();
    this.currentRecordingUrl = '';
    this.recordingBlob = null;
    this.hasRecording = false;
    this.hasDocument = false;
    this.docData = new DocDataDto();
    this.addComplaintObject = new AddComplaintDto();
    this.ComplaintDocuments = [];
    this.documentUploadProgress = 0;
    this.recordingUploadProgress = 0;
  }
  removeVideo() {
    this.currentRecordingUrl = '';
    this.recordingBlob = null;
    this.hasRecording = false;
  }
  onUploadOutput(output: any): void {
    if (output.target.files[0].size > 26214400) {
      this.toaster.warning('file size is more than 25 MB');
      return;
    }
    this.documentUploadProgress = 0;
    this.ComplaintDocuments.push(output.target.files[0]);
    this.ComplaintDocuments[this.ComplaintDocuments.length - 1].title = output.target.files[0].name;
  }
  AddPADocument(file: any) {
    this.uploadingDocument = true;
    this.complaintService.AddComplaintDocument(file.name, this.addComplaintObject.id).subscribe(
      (res: DocDataDto) => {
        this.docData = res;
        this.uploadComplaintDocToS3(file);
      },
      (err: HttpResError) => {
        this.uploadingDocument = false;
        // this.editingPcmData = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  deletedSelectedDocument(i){
    this.ComplaintDocuments.splice(i, 1);
  }
  DeletePADocument(item: PADocForListDto) {
    item['processingDoc'] = true;
    this.complaintService.DeleteComplaintDocument(item.id).subscribe(
      (res: any) => {
        const index = this.ComplaintDocuments.findIndex(x => x.id === item.id);
        this.ComplaintDocuments.splice(index, 1);
        item['processingDoc'] = false;
      },
      (err: HttpResError) => {
        item['processingDoc'] = false;
        // this.editingPcmData = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  async uploadComplaintDocToS3(file) {
    const upload = this.awsService.uploadUsingSdkForProgress(file, this.docData['path'], environment.bucketAws);
    upload.on('httpUploadProgress', (progress: ManagedUpload.Progress) => {
      this.documentUploadProgress = Math.round(progress.loaded / progress.total * 100);
    });
    upload.promise().then(
      (data) => {
        this.uploadingDocument = false;
        const newFile: PADocForListDto = {
          id: this.docData.id,
          title: file.name,
          path: data.Key
         };
         if (!this.ComplaintDocuments) {
          this.ComplaintDocuments = [];
         }
          // this.ComplaintDocuments[0] = newFile;
          file = newFile;
          if (!this.hasRecording || (this.hasRecording && this.uploadingRecording === false)) {
            this.ResetAndCloseModal();
            this.toaster.success('Added Patient Complaint Successfully');
          }
          this.toaster.success('Document uploaded.');
      },
      err => {
        this.uploadingDocument = false;
        this.complaintService.AddComplaintDocumentOnError(this.docData.id).subscribe(res => {
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
      this.awsService.getPublicPath(path).subscribe(
        (res: any) => {
          this.processingDoc = false;
          if (path.toLocaleLowerCase().includes('.pdf')) {
            fetch(res).then(async (fdata: any) => {
              const slknasl = await fdata.blob();
              const blob = new Blob([slknasl], { type: 'application/pdf' });
              const objectURL = URL.createObjectURL(blob);
              importantStuff.close();
              this.objectURLStrAW = objectURL;
              this.viewPdfModal.show();
            });
          } else {
            importantStuff.location.href = res;
          }
        },
        err => {
          this.processingDoc = false;
          // this.preLoader = 0;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  AddComplaintRecording() {
    this.uploadingRecording = true;
    const s3Key = `TestRecordings/video-file-${new Date().toISOString()}.webm`;
    this.complaintService.AddComplaintRecording(s3Key, this.addComplaintObject.id).subscribe(
      (res: DocDataDto) => {
        this.docDataRecording = res;
        this.uploadComplaintRecordingToS3(this.recordingBlob);
      },
      (err: HttpResError) => {
        this.uploadingRecording = false;
        // this.editingPcmData = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  DeleteComplaintRecording(item: PADocForListDto) {
    item['processingRecording'] = true;
    this.complaintService.DeleteComplaintRecording(item.id).subscribe(
      (res: any) => {
        this.recordingBlob = null;
        this.currentRecordingUrl = '';
        item['processingRecording'] = false;
      },
      (err: HttpResError) => {
        item['processingRecording'] = false;
        // this.editingPcmData = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  async uploadComplaintRecordingToS3(file) {
    const fSize = file.size;
    console.log('sasaAa  = ' +  (fSize / (1024 * 1024)).toFixed(2));
    const upload = this.awsService.uploadUsingSdkForProgress(file, this.docDataRecording['path'], environment.bucketAws);
    upload.on('httpUploadProgress', (progress: ManagedUpload.Progress) => {
      this.recordingUploadProgress = Math.round(progress.loaded / progress.total * 100);
    });
    upload.promise().then(
      (data) => {
        this.uploadingRecording = false;
        if (!this.hasDocument || (this.hasDocument && this.uploadingDocument === false)) {
          this.ResetAndCloseModal();
          this.toaster.success('Added Patient Complaint Successfully');
        }
        this.toaster.success('Recording uploaded');
      },
      err => {
        this.uploadingRecording = false;
        this.complaintService.AddComplaintRecordingOnError(this.docDataRecording.id).subscribe(res => {
          if (res) {
            this.toaster.error(err.message, err.error || err.error);
          }
        });
      }
    );
    // }
  }
  changed(searchStr: string) {
    if (!searchStr) {
      this.searchedChatUserList = new Array<SearchedChatUsersDto>();
      return;
    }
    this.searchWatch.next(searchStr);
  }
  searchChatUsers(searchStr: string) {
    if (!searchStr) {
      searchStr = '';
    }
    this.searchingChatUsers = true;
    this.TwocHatService.SearchChatUsers(
      this.securityObject.appUserId,
      this.facilityId,
      searchStr,
      this.UserTypeForSearchChat
    ).subscribe(
      res => {
        this.searchingChatUsers = false;
        this.searchedChatUserList = res;
      },
      err => {
        this.searchingChatUsers = false;
        this.toaster.show('error searching data');
      }
    );
  }
  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      if (x) {
        this.searchChatUsers(x);
      }
    });
  }
  addComplaintUser(user){
    console.log(user);
    this.CurrentPatient = user
    this.searchParam = ''
    this.changed(this.searchParam);
    // this.eventBus.on(EventTypes.openComplaintsModal).subscribe((x: RpmPatientsListDto) => {
    //   this.CurrentPatient = x;
    //   if (this.recordingService.isRecording) {
    //     return this.toaster.warning('Please stop previous recording');
    //   }
    //  this.CurrentPatient = x
    //   console.log(this.CurrentPatient)
    //   this.complaintsMOdal.show();
    // });
  }
  updateModalConf(modal: ModalDirective) {
    modal.config = { backdrop: false, ignoreBackdropClick: true };
  }
  resetComplaintModal(){
    if(this.isGeneralComplaint){
      this.addComplaintObject = new AddComplaintDto();
      this.CurrentPatient = new RpmPatientsListDto();
      this.isGeneralComplaint = false;
    }
  }
  resetSelectedPatient(){
    this.CurrentPatient = new RpmPatientsListDto();
  }

}
