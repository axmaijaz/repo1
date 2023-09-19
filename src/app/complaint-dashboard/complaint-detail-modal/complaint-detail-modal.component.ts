import { AwsService } from 'src/app/core/aws/aws.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { FacilityService } from './../../core/facility/facility.service';
import { ComplaintsService } from 'src/app/core/complaints.service';
import { Component, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { EditComplaintDto, ComplaintForListDto, ComplaintDetailDto } from 'src/app/model/AppModels/complaints.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { environment } from 'src/environments/environment';
import { AWSService } from 'aws-sdk/clients/auditmanager';
import { DomSanitizer } from '@angular/platform-browser';
import { ComplaintStatus } from 'src/app/Enums/complaints.enum';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import moment from 'moment';


@Component({
  selector: 'app-complaint-detail-modal',
  templateUrl: './complaint-detail-modal.component.html',
  styleUrls: ['./complaint-detail-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ComplaintDetailModalComponent implements OnInit {
  @ViewChild('cDetailModalRe') cDetailModalRe: ModalDirective;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;
  @Output() public refreshComplaints = new EventEmitter();
  editCOmplaintObj = new EditComplaintDto();
  savingDetail: boolean;
  gettingFacilityUser: boolean;
  facilityId: number;
  facilityUsersList = new Array<CreateFacilityUserDto>();
  patientDetail =  {};
  gettingComplaintDetail: boolean;
  complaintDetailObj = new ComplaintDetailDto();
  processingDoc: boolean;
  objectURLStrAW: string;
  hasVideo: boolean;
  complainIsEditable: boolean;
  complaintTypesList: any;
  complaintSubTypesList: any;
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MM-DD-YYYY',
  };

  constructor(private toaster: ToastService, private complaintService: ComplaintsService, private awsService: AwsService,
    private facilityService: FacilityService, private securityService: SecurityService, private sanatizer: DomSanitizer) { }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.getFacilityUsers();
  }
  public scrollbarOptionsTimeline = {
    axis: "y",
    theme: "dark-3",
    scrollInertia: 3,
    scrollButtons: { enable: true },
    scrollbarPosition: "outside",
  };
  getComplaintTypes(){
    this.complaintService.getComplaintTypes().subscribe(
      (res: any) => {
        this.complaintTypesList = res;
         this.getComplaintSubTypes()
      }, (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    )
  }
  getComplaintSubTypes(){
    if(this.editCOmplaintObj.complaintTypeId){
      this.complaintService.getComplaintSubTypes(this.editCOmplaintObj.complaintTypeId).subscribe(
        (res: any) => {
          this.complaintSubTypesList = res;
        }, (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      )
    }
  }
  getComplaintSubTypesForDropDown(){
    this.editCOmplaintObj.complaintSubTypeId = null;
    if(this.editCOmplaintObj.complaintTypeId){
      this.complaintService.getComplaintSubTypes(this.editCOmplaintObj.complaintTypeId).subscribe(
        (res: any) => {
          this.complaintSubTypesList = res;
        }, (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      )
    }
  }
  getFacilityUsers() {
    // let roleName = "PRCM Care Manager";
    this.gettingFacilityUser = true;
    this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      (res: []) => {
        this.facilityUsersList = res;
        this.gettingFacilityUser = false;
      },
      (error: HttpResError) => {
        this.gettingFacilityUser = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  OpenDetailModal(cData: ComplaintForListDto) {
    this.getComplaintTypes();
    this.complainIsEditable = true;
    if (cData.complaintStatus === ComplaintStatus.Closed) {
      this.complainIsEditable = true;
    }
    this.patientDetail = {};
    this.patientDetail['name'] = cData.fullName;
    this.patientDetail['patientEmrId'] = cData.patientEmrId;
    this.editCOmplaintObj = new EditComplaintDto();
    this.complaintDetailObj = new ComplaintDetailDto();
    this.hasVideo = false;
    this.editCOmplaintObj.id = cData.id;
    this.editCOmplaintObj.details = cData.details;
    // this.editCOmplaintObj.complaintType = cData.complaintType;
    this.editCOmplaintObj.complaintTypeId = cData.complaintTypeId
    this.editCOmplaintObj.complaintSubTypeId = cData.complaintSubTypeId
    this.editCOmplaintObj.complaintPriority = cData.complaintPriority;
    this.editCOmplaintObj.departmentType = cData.departmentType;
    this.editCOmplaintObj.complaintStatus = cData.complaintStatus;
    this.complaintDetailObj.ticketNo = cData.ticketNo;
    this.editCOmplaintObj.assignedFacilityUserId = cData['assignedFacilityUserId'];
    if(cData.actionDate){
      this.editCOmplaintObj.id = cData.id;
      this.editCOmplaintObj.actionDate = moment(cData.actionDate).format('MM-DD-YYYY');
    }
    this.GetComplaintById();
    this.cDetailModalRe.show();
  }
  GetComplaintById(dontReload?: boolean) {
    this.gettingComplaintDetail = true;
    this.complaintService.GetComplaintById(this.editCOmplaintObj.id).subscribe(
      (res: ComplaintDetailDto) => {
        this.complaintDetailObj = res;
        if(res.patientPrimaryPhoneNo){
          res.patientPrimaryPhoneNo = res.patientPrimaryPhoneNo.replace(
            /^(\d{0,3})(\d{0,3})(\d{0,4})/,
            '($1)$2-$3')
        }
        if(res.patientSecondaryPhoneNo){
          res.patientSecondaryPhoneNo = res.patientSecondaryPhoneNo.replace(
            /^(\d{0,3})(\d{0,3})(\d{0,4})/,
            '($1)$2-$3')
        }
        this.patientDetail['patientDob'] = res.patientDob;
        this.patientDetail['patientPrimaryPhoneNo'] = res.patientPrimaryPhoneNo;
        this.patientDetail['patientSecondaryPhoneNo'] = res.patientSecondaryPhoneNo;
        this.complaintDetailObj.logDetails += `<style>
        .d-flex-m {
          display: flex;
        }
        .align-items-center-m {
            align-items: center;
        }
        .justify-content-between-m {
            justify-content: space-between;
        }
        .p-color {
            color: #4eaf48;
        }

        div .font-color {
            color: #262323;
        }
        .mb-2-0 {
            margin-bottom: 10px;
        }
        .Inprogress-0 {
            min-width: 10px;height:10px;background-color: #999;display: inline-block;border-radius: 1px;margin: 0 1px;
        }
        .open-0 {
            min-width: 10px;height:10px;background-color: #4eaf48;display: inline-block;border-radius: 1px;margin: 0 1px;
        }
        </style>`
        this.complaintDetailObj['logDetails1'] = this.sanatizer.bypassSecurityTrustHtml(this.complaintDetailObj.logDetails);
        if (!dontReload && this.complaintDetailObj.patientComplaintRecording && this.complaintDetailObj.patientComplaintRecording.path) {
          this.hasVideo = true;
          this.GetVideoLink(this.complaintDetailObj.patientComplaintRecording.path);
        }
        this.gettingComplaintDetail = false;
      },
      (error: HttpResError) => {
        this.gettingComplaintDetail = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  EditComplaintDetail(modal: ModalDirective) {
    this.savingDetail = true;
    this.complaintService.EditComplaint(this.editCOmplaintObj).subscribe(
      (res: any) => {
        this.savingDetail = false;
        this.editCOmplaintObj.comment = '';
        this.GetComplaintById(true);
        // modal.hide();
        this.toaster.success('Complaint Saved Successfully');
        this.refreshComplaints.emit();
        this.complaintService.refreshComplaintCount.next();
      },
      (error: HttpResError) => {
        this.savingDetail = false;
        this.toaster.error(error.message, error.error);
      });
  }
  GetVideoLink(path: string) {
      this.awsService.getPublicPath(path).subscribe(
        (res: any) => {
          const videoElem = document.getElementById('recordVideoPlay');
          videoElem['src'] = res;
          setTimeout(() => {
          }, 2000);
        },
        err => {
          this.toaster.error(err.error, err.message);
        }
      );
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

}
