import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  AfterViewInit,
  QueryList,
  OnChanges,
  ViewChild,
} from "@angular/core";
import { PatientsService } from "src/app/core/Patient/patients.service";
import {
  EditPatientChronicConditionNoteDto,
  MasterCarePLanDto,
} from "src/app/model/Patient/patient.model";
import { ToastService, ModalDirective } from "ng-uikit-pro-standard";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpResError } from "src/app/model/common/http-response-error";
import { SecurityService } from "src/app/core/security/security.service";
import { UserType } from "src/app/Enums/UserType.enum";
import { Location } from "@angular/common";
import * as moment from "moment";
import { NgModel } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";
import { SubSink } from "src/app/SubSink";

@Component({
  selector: "app-master-care-plan",
  templateUrl: "./master-care-plan.component.html",
  styleUrls: ["./master-care-plan.component.scss"],
})
export class MasterCarePlanComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges
{
  private subs = new SubSink();
  // email = "dawoodshah26@gmail.com";
  // mailto = "mailto:" + this.email + "?Subject=Hello%20again";
  @ViewChildren(NgModel) fields: QueryList<NgModel>;
  @ViewChild("carePlanHistoryViewModal")
  carePlanHistoryViewModal: ModalDirective;
  ApprovalState: string;
  rejectReason: string;
  addEditMAsterCareplanObj = new MasterCarePLanDto();
  OrigionalCopy = new MasterCarePLanDto();
  PatientId: number;
  isLoading: boolean;
  otherValue = "";
  isUpdate= false;
  carePlanHistoryView: any;
  isChanged = false;
  detectChanges = false;
  IsPatientLoginId: number;
  @Input() rating: number;
  @Input() itemId: number;
  @Output() ratingClick: EventEmitter<any> = new EventEmitter<any>();

  isHealthcareFacilityIsYes: boolean;
  inputName: string;
  isG0506: boolean;
  MasterDataLoaded: boolean;
  isLoadingCPHistory: boolean;
  isSecondLanguageIsYes: boolean;
  isLoadingAccept = false;
  IsSameEmergencyContact = false;
  diagnosisList: any;
  editPatientChronicConditionNoteDto = new EditPatientChronicConditionNoteDto();
  isHomeHealthCare = false;
  isSkilledNursing = false;
  isPhysiotherapy = false;
  isHomeHospice = false;
  isNo = false;
  isRehab = false;
  isOtherUtilizing = false;
  isOtherUtilizingData: string;

  @HostListener("window:beforeunload", ["$event"])
  beforeUnloadHander(event) {
    // this.AddEditCarePlanMaster();
  }
  constructor(
    private securityService: SecurityService,
    private patientService: PatientsService,
    private toaster: ToastService,
    private route: ActivatedRoute,
    private sanatizer: DomSanitizer,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    // this.securityService
    // this.route.params.subscribe(routeParams => {
    //   this.PatientId = routeParams["id"];
    //   this.getMasterCarePLanData();
    // });
    this.route.pathFromRoot[2].children[0].params.subscribe((routeParams) => {
      this.PatientId = routeParams.id;
      // this.router.routeReuseStrategy.shouldReuseRoute = function() {
      //   return false;
      // };
      if (this.PatientId) {
        this.isLoading = true;
        this.getMasterCarePLanData();
      }
    });
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    if (!this.PatientId) {
      this.PatientId =
        +this.route.pathFromRoot[2].children[0].snapshot.paramMap.get("id");
    }
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.PatientId = this.securityService.securityObject.id;
      this.IsPatientLoginId = this.securityService.securityObject.id;
    }
    // this.getMasterCarePLanData();
    this.inputName = this.itemId + "_rating";
    this.getChronicConditionsByPatientId();
  }
  ngOnChanges() {
    this.fields.forEach((res) => {
      res.valueChanges.subscribe((res) => {
        this.detectChanges = true;
      });
    });
  }
  ngAfterViewInit() {}
  ngOnDestroy(): void {
    this.subs.unsubscribe();
    // this.AddEditCarePlanMaster();
  }

  onClick(rating: number): void {
    this.rating = rating;
    this.ratingClick.emit({
      itemId: this.itemId,
      rating: rating,
    });
    this.addEditMAsterCareplanObj.satisfactionWithMedicalCare = rating;
  }
  getMasterCarePLanData() {
    this.isLoading = true;
    this.subs.sink = this.patientService.GetCarePlanMasterByPatientId(this.PatientId).subscribe(
      (data: any) => {
        this.isLoading = false;
        this.MasterDataLoaded = true;
        if (data) {
          this.addEditMAsterCareplanObj = data;
          Object.assign(this.OrigionalCopy, this.addEditMAsterCareplanObj);
          // this.OrigionalCopy = data;
          this.ApprovalState = this.addEditMAsterCareplanObj.status;
          if (
            this.addEditMAsterCareplanObj.iLive &&
            this.addEditMAsterCareplanObj.iLive !== 'Alone' &&
            this.addEditMAsterCareplanObj.iLive !== 'Partner/Spouse' &&
            this.addEditMAsterCareplanObj.iLive !== 'Extended family'
          ) {
            this.otherValue = 'Other';
          }
        } else {
          this.OrigionalCopy = {} as any;
          this.addEditMAsterCareplanObj = new MasterCarePLanDto();
        }
      },
      (err: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  DiagnoseDataUpdated(event){
    this.AddEditCarePlanMaster();
  }
  medicationDataUpdated(event) {
    this.AddEditCarePlanMaster();
  }
  allergiesDataUpdated(event) {
    this.AddEditCarePlanMaster();
  }
  providersDataUpdated() {
    this.AddEditCarePlanMaster();
  }
  AddEditCarePlanMaster(sendForApprove?: boolean) {
    this.isLoading = true;
    this.addEditMAsterCareplanObj.patientId = this.PatientId;
    if (!this.addEditMAsterCareplanObj.isG0506) {
      this.addEditMAsterCareplanObj.isG0506 = this.isG0506;
    }
    // if (this.addEditMAsterCareplanObj.id > 0 && this.MasterDataLoaded) {
    //   let isSame = true;
    //   Object.keys(this.addEditMAsterCareplanObj).forEach((key, index, objj) => {
    //     const term1 = this.OrigionalCopy[key];
    //     const term2 = this.addEditMAsterCareplanObj[key];
    //     if (term1 !== term2) {
    //       isSame = false;
    //     }
    //   });
    //   if (isSame) {
    //     // this.toaster.warning('No changes to be saved');
    //     this.isLoading = false;
    //     return;
    //   }
    // }
    this.addEditMAsterCareplanObj.carePlanUpdatedDate = moment().format();
    this.subs.sink = this.patientService
      .AddEditCarePlanMaster(this.addEditMAsterCareplanObj)
      .subscribe(
        (data: any) => {
          if(this.addEditMAsterCareplanObj.isCarePlanUpdate){
            data.carePlanUpdatedDate = moment.utc().format("M/D/YY");
          }else{
            // data.carePlanUpdatedBy = '';
          }
          this.addEditMAsterCareplanObj = data;
          Object.assign(this.OrigionalCopy, this.addEditMAsterCareplanObj);
          if(this.isUpdate){
            this.toaster.success("Careplan updated successfully");
          }else{
            this.toaster.success("Careplan saved successfully");
          }
          if (sendForApprove) {
            this.SendForApproval();
          } else {
            this.isLoading = false;
          }
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  AssignILivetextboxValue(ilive: string) {
    this.addEditMAsterCareplanObj.iLive = ilive;
  }
  AcceptRejectCarePLan(action: number) {
    this.isLoadingAccept = true;
    // 1 accept, 2 Reject
    let str = "Reject";
    if (action === 1) {
      str = "Approved";
    }
    const data1 = {
      id: this.addEditMAsterCareplanObj.carePlanApproval.id,
      status: str,
      // approvedDate: moment().format('YYYY-MM-DD'),
      comments: this.rejectReason,
    };
    this.subs.sink = this.patientService.ReviewCarePlan(data1).subscribe(
      (data: any) => {
        // this.addEditMAsterCareplanObj.carePlanApproval.status = str;
        // this.addEditMAsterCareplanObj.status = str;
        this.ApprovalState = str;
        this.isLoading = false;
        this.isLoadingAccept = false;
        this.toaster.success("data updated successfully");
        this.getMasterCarePLanData();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  SendForApproval() {
    const data1 = {
      id: 0,
      patientId: this.PatientId,
      carePlanMasterId: this.addEditMAsterCareplanObj.id,
    };
    this.isLoading = true;
    this.subs.sink = this.patientService.SendForApproval(data1).subscribe(
      (data: any) => {
        this.isLoading = false;
        this.getMasterCarePLanData();
        // if (this.addEditMAsterCareplanObj.carePlanApproval) {
        //   this.addEditMAsterCareplanObj.carePlanApproval.status = 'Pending';
        // }
        // this.addEditMAsterCareplanObj.status = 'Pending';
        this.ApprovalState = "Pending";
        this.toaster.success("Approval Sent");
        // this.AddEditCarePlanMaster();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  getCarePlanHistory() {
    this.isLoadingCPHistory = true;
    const patientId = this.securityService.securityObject.id;
    this.subs.sink = this.patientService
      .getCarePlanHistoryByPatientId(patientId)
      .subscribe(
        (res: any) => {
          this.isLoadingCPHistory = false;
          // this.isLoading = false;
          // var file = new Blob([response], { type: "application/pdf" });
          var fileURL = URL.createObjectURL(res);
          this.carePlanHistoryView =
            this.sanatizer.bypassSecurityTrustResourceUrl(fileURL);
          this.carePlanHistoryViewModal.show();
        },
        (err) => {
          this.isLoadingCPHistory = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  getChronicConditionsByPatientId(){
    this.patientService.GetChronicConditionsByPatientId(this.PatientId).subscribe((res: any) => {
      this.diagnosisList = res;
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
  EditPatientChronicConditionNote(diagnosis){
    if(diagnosis.note){
      this.editPatientChronicConditionNoteDto.patientId = this.PatientId;
      this.editPatientChronicConditionNoteDto.note = diagnosis.note;
      this.editPatientChronicConditionNoteDto.chronicConditionId = diagnosis.chronicConditionId;
      this.patientService.EditPatientChronicConditionNote(this.editPatientChronicConditionNoteDto).subscribe((res: any) =>{
        this.toaster.success('Note Updated Successfully');
        this.editPatientChronicConditionNoteDto = new EditPatientChronicConditionNoteDto();
      }, (err: HttpResError) => {
        this.toaster.error(err.error);
      })
    }
    }
  copyEmergencyContactDetails() {
    if (this.IsSameEmergencyContact) {
      this.addEditMAsterCareplanObj.careGiverContactName =
        this.addEditMAsterCareplanObj.emergencyContactName;
      this.addEditMAsterCareplanObj.careGiverContactRelationship =
        this.addEditMAsterCareplanObj.emergencyContactRelationship;
      this.addEditMAsterCareplanObj.careGiverContactPrimaryPhoneNo =
        this.addEditMAsterCareplanObj.emergencyContactPrimaryPhoneNo;
      this.addEditMAsterCareplanObj.careGiverContactSecondaryPhoneNo =
        this.addEditMAsterCareplanObj.emergencyContactSecondaryPhoneNo;
    } else {
      this.addEditMAsterCareplanObj.careGiverContactName = "";
      this.addEditMAsterCareplanObj.careGiverContactRelationship = null;
      this.addEditMAsterCareplanObj.careGiverContactPrimaryPhoneNo = "";
      this.addEditMAsterCareplanObj.careGiverContactSecondaryPhoneNo = "";
    }
  }
  appendCheckBoxInTextField() {
    this.addEditMAsterCareplanObj.utilizingCommunity = "";
    if (this.isHomeHealthCare) {
      this.addEditMAsterCareplanObj.utilizingCommunity = this.addEditMAsterCareplanObj.utilizingCommunity + "Home Health Care, ";
    }
    if (this.isSkilledNursing) {
      this.addEditMAsterCareplanObj.utilizingCommunity =
        this.addEditMAsterCareplanObj.utilizingCommunity + "Skilled Nursing, ";
    }
    if (this.isPhysiotherapy) {
      this.addEditMAsterCareplanObj.utilizingCommunity =
        this.addEditMAsterCareplanObj.utilizingCommunity + "Physiotherapy, ";
    }
    if (this.isHomeHospice) {
      this.addEditMAsterCareplanObj.utilizingCommunity =
        this.addEditMAsterCareplanObj.utilizingCommunity + "Home Hospice, ";
    }
    if (this.isRehab) {
      this.addEditMAsterCareplanObj.utilizingCommunity =
        this.addEditMAsterCareplanObj.utilizingCommunity + "Rehab";
    }
    if (this.isNo) {
      this.addEditMAsterCareplanObj.utilizingCommunity = "";
      this.isHomeHealthCare = false;
      this.isSkilledNursing = false;
      this.isPhysiotherapy = false;
      this.isHomeHospice = false;
      this.isRehab = false;
      this.isOtherUtilizing = false;
      this.addEditMAsterCareplanObj.utilizingCommunity =
        this.addEditMAsterCareplanObj.utilizingCommunity + "No";
    }
    if (this.isOtherUtilizing) {
      this.addEditMAsterCareplanObj.utilizingCommunity =
        this.addEditMAsterCareplanObj.utilizingCommunity +
        this.isOtherUtilizingData;
    }
  }
  clearFunctionalValues() {
    if (this.addEditMAsterCareplanObj.functionalNone) {
      this.addEditMAsterCareplanObj.challengesWithVision = false;
      this.addEditMAsterCareplanObj.challengesWithHearing = false;
      this.addEditMAsterCareplanObj.challengesWithTransportation = false;
    } else {
      this.addEditMAsterCareplanObj.functionalNone = false;
    }
  }
  checkAllDailyLivingValue() {
    if (this.addEditMAsterCareplanObj.dailyLivingAll) {
      this.addEditMAsterCareplanObj.dailyLivingBath = true;
      this.addEditMAsterCareplanObj.dailyLivingWalk = true;
      this.addEditMAsterCareplanObj.dailyLivingDress = true;
      this.addEditMAsterCareplanObj.dailyLivingEat = true;
      this.addEditMAsterCareplanObj.dailyLivingTransfer = true;
      this.addEditMAsterCareplanObj.dailyLivingRestroom = true;
    } else {
      this.addEditMAsterCareplanObj.dailyLivingBath = false;
      this.addEditMAsterCareplanObj.dailyLivingWalk = false;
      this.addEditMAsterCareplanObj.dailyLivingDress = false;
      this.addEditMAsterCareplanObj.dailyLivingEat = false;
      this.addEditMAsterCareplanObj.dailyLivingTransfer = false;
      this.addEditMAsterCareplanObj.dailyLivingRestroom = false;
    }
  }
  checkLivingValuesFilled() {
    if (
      this.addEditMAsterCareplanObj.dailyLivingBath === true &&
      this.addEditMAsterCareplanObj.dailyLivingWalk === true &&
      this.addEditMAsterCareplanObj.dailyLivingDress === true &&
      this.addEditMAsterCareplanObj.dailyLivingEat === true &&
      this.addEditMAsterCareplanObj.dailyLivingTransfer === true &&
      this.addEditMAsterCareplanObj.dailyLivingRestroom === true
    ) {
      this.addEditMAsterCareplanObj.dailyLivingAll = true;
    }
  }
  clearLivingValues() {
    this.addEditMAsterCareplanObj.dailyLivingBath = false;
    this.addEditMAsterCareplanObj.dailyLivingWalk = false;
    this.addEditMAsterCareplanObj.dailyLivingDress = false;
    this.addEditMAsterCareplanObj.dailyLivingEat = false;
    this.addEditMAsterCareplanObj.dailyLivingTransfer = false;
    this.addEditMAsterCareplanObj.dailyLivingRestroom = false;
    this.addEditMAsterCareplanObj.dailyLivingAll = false;
  }
  checkAllInstrumentalDailyValue() {
    if (this.addEditMAsterCareplanObj.instrumentalDailyAll) {
      this.addEditMAsterCareplanObj.instrumentalDailyGrocery = true;
      this.addEditMAsterCareplanObj.instrumentalDailyTelephone = true;
      this.addEditMAsterCareplanObj.instrumentalDailyHouseWork = true;
      this.addEditMAsterCareplanObj.instrumentalDailyFinances = true;
      this.addEditMAsterCareplanObj.instrumentalDailyTransportation = true;
      this.addEditMAsterCareplanObj.instrumentalDailyMeals = true;
      this.addEditMAsterCareplanObj.instrumentalDailyMedication = true;
    } else {
      this.addEditMAsterCareplanObj.instrumentalDailyGrocery = false;
      this.addEditMAsterCareplanObj.instrumentalDailyTelephone = false;
      this.addEditMAsterCareplanObj.instrumentalDailyHouseWork = false;
      this.addEditMAsterCareplanObj.instrumentalDailyFinances = false;
      this.addEditMAsterCareplanObj.instrumentalDailyTransportation = false;
      this.addEditMAsterCareplanObj.instrumentalDailyMeals = false;
      this.addEditMAsterCareplanObj.instrumentalDailyMedication = false;
    }
  }
  checkInstrumentalDailyFilled() {
    if (
      this.addEditMAsterCareplanObj.instrumentalDailyGrocery === true &&
      this.addEditMAsterCareplanObj.instrumentalDailyTelephone === true &&
      this.addEditMAsterCareplanObj.instrumentalDailyHouseWork === true &&
      this.addEditMAsterCareplanObj.instrumentalDailyFinances === true &&
      this.addEditMAsterCareplanObj.instrumentalDailyTransportation === true &&
      this.addEditMAsterCareplanObj.instrumentalDailyMeals === true &&
      this.addEditMAsterCareplanObj.instrumentalDailyMedication === true
    ) {
      this.addEditMAsterCareplanObj.instrumentalDailyAll = true;
    }
  }
  clearInstrumentalDailyValues() {
    this.addEditMAsterCareplanObj.instrumentalDailyGrocery = false;
    this.addEditMAsterCareplanObj.instrumentalDailyTelephone = false;
    this.addEditMAsterCareplanObj.instrumentalDailyHouseWork = false;
    this.addEditMAsterCareplanObj.instrumentalDailyFinances = false;
    this.addEditMAsterCareplanObj.instrumentalDailyTransportation = false;
    this.addEditMAsterCareplanObj.instrumentalDailyMeals = false;
    this.addEditMAsterCareplanObj.instrumentalDailyMedication = false;
    this.addEditMAsterCareplanObj.instrumentalDailyAll = false;
  }
}
