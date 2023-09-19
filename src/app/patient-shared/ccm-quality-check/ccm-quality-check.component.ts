import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import moment from "moment";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { AppUiService } from "src/app/core/app-ui.service";
import { CcmDataService } from "src/app/core/ccm-data.service";
import { DataFilterService } from "src/app/core/data-filter.service";
import { MrAdminService } from "src/app/core/mr-admin.service";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { SecurityService } from "src/app/core/security/security.service";
import { CcmEncounterListDto, CCMQualityCheckMOdalDto } from "src/app/model/admin/ccm.model";
import { HttpResError } from "src/app/model/common/http-response-error";
import { MRInterventionStatus } from "src/app/model/MonthlyReview/mReview.enum";
import { MonthlyReviewDataDto } from "src/app/model/MonthlyReview/mReview.model";
import { PatientDto } from "src/app/model/Patient/patient.model";
import { AppUserAuth } from "src/app/model/security/app-user.auth";
import { SubSink } from "src/app/SubSink";

@Component({
  selector: "app-ccm-quality-check",
  templateUrl: "./ccm-quality-check.component.html",
  styleUrls: ["./ccm-quality-check.component.scss"],
})
export class CcmQualityCheckComponent implements OnInit {
  @ViewChild("monthlyReview") monthlyReview: ModalDirective;
  currentMonthNum: number = new Date().getMonth() + 1;
  currentYearNum: number = new Date().getFullYear();
  private subs = new SubSink();
  selectedPatient = new PatientDto();
  mrReviewData: MonthlyReviewDataDto;
  MRInterventionStatusENum = MRInterventionStatus;
  GettingMRData = false;
  SetQualityCheckForMR: boolean;
  rows = new Array<PatientDto>();
  currentUser: AppUserAuth = null;
  nameCaption: string;
  selectedPatientId : number;
  isPrDashboardQC= false;
  selectedMonth: number;
  selectedYear: number;
  constructor(
    private toaster: ToastService,
    private datePipe: DatePipe,
    private mrService: MrAdminService,
    private appUi: AppUiService,
    private securityService: SecurityService,
    private ccmService: CcmDataService, 
    private dataFilterService: DataFilterService,
    private patientsService: PatientsService
  ) {}

  ngOnInit() {
    if (
      this.securityService.securityObject &&
      this.securityService.securityObject.isAuthenticated
    ) {
      this.currentUser = this.securityService.securityObject;
    }
   this.appUi.openCCMQualityCheckModal.subscribe((res: CCMQualityCheckMOdalDto) => {
    this.monthlyReview.config = { backdrop: false, ignoreBackdropClick: false };

    this.selectedPatientId = res.patientId;
    this.isPrDashboardQC = res.isPrDashboard;
    this.GetMonthlyReviewData(res.patientId);
   })

  }

  GetMonthlyReviewData(pId: number) {
    if(this.dataFilterService.selectedCCMDashboardDate){
      this.selectedMonth = moment(this.dataFilterService.selectedCCMDashboardDate, "YYYY-MM").month() + 1;
      this.selectedYear = moment(this.dataFilterService.selectedCCMDashboardDate, "YYYY-MM").year();
    }else{
      this.selectedMonth = this.currentMonthNum;
      this.selectedYear = this.currentYearNum;
    }
    this.GettingMRData = true;
    this.monthlyReview.show();
    this.mrReviewData = new MonthlyReviewDataDto();
    this.subs.sink = this.mrService.GetMonthlyReviewData(pId, this.selectedMonth, this.selectedYear).subscribe(
      (res: MonthlyReviewDataDto) => {
        this.mrReviewData = res;
        this.selectedPatient.msQualityCheckedByName =
          res.patient.msQualityCheckedByName;
        this.GettingMRData = false;
      },
      (err: HttpResError) => {
        this.GettingMRData = false;
        this.monthlyReview.hide();
        this.toaster.error(err.error, err.message);
      }
    );
  }
  CopyMRData1() {
    let copyStr = "";
    copyStr += `CCM Time : ${this.mrReviewData.ccmTimeCompleted} \n`;
    copyStr += `Notes \n`;
    this.mrReviewData.ccmEncounters.forEach((log) => {
      // tslint:disable-next-line: max-line-length
      copyStr += `Service Type : ${log.ccmServiceType}, Created By : ${
        log.careProviderName
      } , Date : ${this.datePipe.transform(
        log.encounterDate,
        "MM-dd-yyyy"
      )} , Start Time: ${log.startTime}, End Time : ${
        log.endTime
      } , Duration : ${log.duration} \n`;
      copyStr += `Note: ${log.note} \n`;
    });
    // copyStr += `Assessments \n`;
    // if (this.mrReviewData.assessments.length < 1) {
    //   copyStr += `       No assessments found \n`;
    // }
    copyStr += `-----------------------------\n`;
    this.mrReviewData.assessments.forEach((assm) => {
      copyStr += `Assessment - ${assm.name} \n`;
      assm.assessmentPatientProblems.forEach((Problem) => {
        copyStr += ` ${Problem.description} \n`;
        Problem.assessmentPatientQuestions.forEach((question) => {
          copyStr += `  Question : ${question.question}\n`;
          copyStr += `  Answer : ${question.answer}\n`;
          if (question.comment) {
            copyStr += `  Comment : ${question.comment}\n`;
          }
        });
      });
    });
    copyStr += `\n-----------------------------\n`;
    this.mrReviewData.interventions.forEach((interv) => {
      copyStr += `Intervention - ${interv.name} \n`;
      interv.mrPatientProblems.forEach((Problem) => {
        copyStr += ` ${Problem.description} \n`;
        Problem.mrPatientGoals.forEach((goal) => {
          copyStr += `  Goal : ${goal.description}\n`;
          goal.mrPatientInterventions.forEach((pInterv) => {
            copyStr += `   Intervention : ${pInterv.description}\n`;
            copyStr += `   Status : ${
              this.MRInterventionStatusENum[pInterv.status]
            }\n`;
            if (pInterv.interventionDate) {
              copyStr += `   Date : ${this.datePipe.transform(
                pInterv.interventionDate,
                "MM-dd-yyyy"
              )}\n`;
            }
          });
        });
      });
      copyStr += `-----------------------------\n`;
    });
    const textArea = document.createElement("textarea");
    textArea.value = copyStr;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    textArea.remove();
    this.toaster.success("Content Copied");
  }
  SetMsQualityChecked(encounterId) {
    this.SetQualityCheckForMR = true;
    this.subs.sink = this.mrService
      .SetMsQualityChecked(encounterId)
      .subscribe(
        (res: any) => {
          this.selectedPatient.msQualityChecked = true;
          this.rows.forEach((iPatient) => {
            if (iPatient.id === this.selectedPatientId) {
              iPatient.msQualityChecked = true;
            }
          });
          this.SetQualityCheckForMR = false;
          this.selectedPatient.msQualityCheckedByNameAbbreviation =
            this.nameCaption;
          this.selectedPatient.msQualityCheckedByName =
            this.currentUser.fullName;
          this.selectedPatient.msQualityCheckedDate = moment().format();
          const dateTime = moment(
            this.selectedPatient.msQualityCheckedDate
          ).format("MMMM Do YYYY, h:mm:ss a");
          const msQualityCheckedByNameAndDate = `${this.selectedPatient.msQualityCheckedByName}\n ${dateTime}`;
          this.selectedPatient["msQualityCheckedByNameAndDate"] =
            msQualityCheckedByNameAndDate;
          console.log(this.selectedPatient);
          console.log(this.currentUser);
        },
        (err: HttpResError) => {
          this.SetQualityCheckForMR = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  setEncounterQualityCheck(encounterId, qualityChecked){
    this.ccmService.SetQualityChecked(encounterId, qualityChecked).subscribe((res: any) => {
      this.mrReviewData.ccmEncounters.forEach((encounter: CcmEncounterListDto) => {
        if(encounter.id == encounterId){
          encounter.qualityChecked = true;
          // encounter.msQualityCheckedByNameAbbreviation =
          //   this.nameCaption;
          encounter.qualityCheckedByName =
            this.currentUser.fullName;
          encounter.qualityCheckedDate = moment().format();
          const dateTime = moment(
            encounter.qualityCheckedDate
          ).format("MMMM Do YYYY, h:mm:ss a");
          const msQualityCheckedByNameAndDate = `${encounter.qualityCheckedByName}\n ${dateTime}`;
          encounter["QualityCheckedByNameAndDate"] =
            msQualityCheckedByNameAndDate;
        }
      })
      this.checkQualityCheckStatus();
    }, (err: HttpResError) => {
      this.toaster.error(err.error)
    })
  }
  checkQualityCheckStatus(){
    if(this.mrReviewData.ccmEncounters.length){
      const notQualityChecked = this.mrReviewData.ccmEncounters.filter((encounter: CcmEncounterListDto)=>encounter.qualityChecked == false);
      if(!notQualityChecked.length){
        this.patientsService.refreshQualityCheckStatusOfCCM.next(0);
      }else{
        const qualityChecked = this.mrReviewData.ccmEncounters.filter((encounter: CcmEncounterListDto)=>encounter.qualityChecked == true);
        if(qualityChecked.length == this.mrReviewData.ccmEncounters.length){
        this.patientsService.refreshQualityCheckStatusOfCCM.next(0);
        }else{
        this.patientsService.refreshQualityCheckStatusOfCCM.next(2);
        }
      }
    }
  }
}
