import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import * as moment from 'moment';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { SubSink } from 'src/app/SubSink';
import { PatientCarePlanApprovalDto } from 'src/app/model/admin/ccm.model';
import { PagingData } from 'src/app/model/AppModels/app.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ccm-approval',
  templateUrl: './ccm-approval.component.html',
  styleUrls: ['./ccm-approval.component.scss']
})
export class CcmApprovalComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  IsLoading: boolean;
  showPending = true;
  facilityUserId: number;
  facilityId: number;
  rejectReason: string;
  approvalList: PatientCarePlanApprovalDto[];
  selectedItem: PatientCarePlanApprovalDto;
  isLoadingAccept: boolean;
  pagingData = new PagingData();
  approvalListPreserve: PatientCarePlanApprovalDto[];
  isLoadingCPHistory: boolean;
  carePlanHistoryView: any;
  @ViewChild('patientCarePLanDetailModal') patientCarePLanDetailModal: ModalDirective;

  // tslint:disable-next-line: max-line-length
  constructor(private sanatizer: DomSanitizer, private location: Location, private patientService: PatientsService, private router: Router, private toaster: ToastService , private ccmDataService: CcmDataService, private securityService: SecurityService) { }

  ngOnInit() {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.getCarePlanApprovals();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  getCarePlanApprovals() {
    this.IsLoading = true;
    this.subs.sink = this.ccmDataService.GetCarePlanApprovals(this.facilityId).subscribe((res: any) => {
      this.IsLoading = false;
      this.approvalList = res;
      this.approvalListPreserve = res;
      this.applyPendingFilter();
    }, (err: HttpResError) => {
      this.IsLoading = false;
    });
  }
  AcceptRejectCarePLan(action: number) {
    this.IsLoading = true;
    // 1 accept, 2 Reject
    let str = 'Reject';
    if (action === 1) {
      str = 'Approved';
    }
    const data1 = {
      id: this.selectedItem.currentApprovalId,
      status: str,
      // approvedDate: moment().format('YYYY-MM-DD'),
      comments: this.rejectReason
    };
    this.subs.sink = this.patientService.ReviewCarePlan(data1).subscribe(
      (data: any) => {
        this.selectedItem.currentApprovalStatus = str;
        if (str === 'Approved') {
          this.selectedItem.lastApprovedDate = moment().format('YYYY-MM-DD');
        }
        this.IsLoading = false;
        this.toaster.success(data);
      },
      (err: HttpResError) => {
        this.IsLoading = false;
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  ApproveAllPending() {
    const ids = this.approvalListPreserve.map((x) => {
     if (x.currentApprovalStatus === 'Pending') {
       return x.currentApprovalId;
     }
    }).filter(x => {
      if (x) {
        return x;
      }
    });
    if (ids.length < 1) {
      this.toaster.warning('No Pending Approval Found');
      this.IsLoading = false;
      return;
    }
    this.subs.sink = this.patientService.ApproveAllPending(ids).subscribe(
      (data: any) => {
        this.approvalList.forEach(element => {
          if (element.currentApprovalStatus === 'Pending') {
            element.lastApprovedDate = moment().format('YYYY-MM-DD');
            element.currentApprovalStatus = 'Approved';
          }
        });
        this.approvalList = [... this.approvalList];
        this.IsLoading = false;
        this.toaster.success('Data saved successfully');
      },
      (err: HttpResError) => {
        this.IsLoading = false;
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  getCarePlanHistory() {
    this.selectedItem.isLoading = true;
    this.isLoadingCPHistory = true;
    const patientId = this.selectedItem.patientId;
    this.subs.sink = this.patientService.getCarePlanHistoryByPatientId(patientId).subscribe(
      (res: any) => {
         this.patientCarePLanDetailModal.show();
        // this.isLoading = false;
        this.isLoadingCPHistory = false;
        this.selectedItem.isLoading = false;
        // var file = new Blob([response], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(res);
        this.carePlanHistoryView = this.sanatizer.bypassSecurityTrustResourceUrl(
          fileURL
        );
      },
      err => {
    this.selectedItem.isLoading = false;
        this.isLoadingCPHistory = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  applyPendingFilter() {
    if (this.showPending) {
      this.approvalList = this.approvalListPreserve.filter(x => x.currentApprovalStatus === 'Pending');
    } else {
      this.approvalList = this.approvalListPreserve;
    }
  }
  navigateBack() {
    this.location.back();
  }
}
