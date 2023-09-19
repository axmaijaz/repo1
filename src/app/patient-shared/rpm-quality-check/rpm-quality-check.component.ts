import { Component, OnInit, ViewChild } from "@angular/core";
import moment from "moment";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { AppUiService } from "src/app/core/app-ui.service";
import { CcmDataService } from "src/app/core/ccm-data.service";
import { ClonerService } from "src/app/core/cloner.service";
import { DataFilterService } from "src/app/core/data-filter.service";
import { RpmService } from "src/app/core/rpm.service";
import { RpmQualityCheckedEnum, RPMServiceType } from "src/app/Enums/rpm.enum";
import { HttpResError } from "src/app/model/common/http-response-error";
import { PatientsService } from 'src/app/core/Patient/patients.service';
import {
  BGDeviceDataDto,
  BPDeviceDataDto,
  RPMCopyDto,
  RPMDeviceListDtoNew,
  RPMEncounterDto,
  RpmPatientsListDto,
  RPMQualityCheckModalDto,
  WeightDataDto,
} from "src/app/model/rpm.model";
import { PatientDto } from "src/app/model/Patient/patient.model";
import { SecurityService } from "src/app/core/security/security.service";
import { AppUserAuth } from "src/app/model/security/app-user.auth";

@Component({
  selector: "app-rpm-quality-check",
  templateUrl: "./rpm-quality-check.component.html",
  styleUrls: ["./rpm-quality-check.component.scss"],
})
export class RpmQualityCheckComponent implements OnInit {
  @ViewChild("rpmQualityCheckModal") rpmQualityCheckModal: ModalDirective;
  currentMonthNum: number = new Date().getMonth() + 1;
  currentYearNum: number = new Date().getFullYear();
  selectedModalityCode = "";
  devicesList = new Array<RPMDeviceListDtoNew>();
  rpmEncounterTime: any;
  rpmCarePlan: string;
  // rpmMonthId: number;
  // rpmYearId: number;
  selectedPatient = new PatientDto();
  selectedDate = moment().format("YYYY-MM");
  rpmEncounterList = new Array<RPMEncounterDto>();
  isLoading: boolean;
  selectedPatientRPMQC: RpmQualityCheckedEnum;
  rpmQualityCheckedEnum = RpmQualityCheckedEnum;
  changingQualityCHeck: boolean;
  gettingRPMCopyData: boolean;
  yearNum: number = new Date().getFullYear();
  rpmCopyDataObj: RPMCopyDto;
  RPMServiceTypeEnum = RPMServiceType;
  copyDataStr: string;
  includeEncounters = true;
  BGDeviceDataList = new Array<BGDeviceDataDto>();
  BPDeviceDataList = new Array<BPDeviceDataDto>();
  weightDataList = new Array<WeightDataDto>();
  rpmQualityCheckModalDto = new RPMQualityCheckModalDto();
  isPrDashboardQC= false;
  selectedMonth: number;
  selectedYear: number;
  currentUser: AppUserAuth = null;
  constructor(
    private toaster: ToastService,
    private rpmService: RpmService,
    private ccmService: CcmDataService,
    private dataFilterService: DataFilterService,
    private cloneService: ClonerService,
    private appUi: AppUiService,
    private patientService: PatientsService,
    private securityService: SecurityService
  ) {}

  ngOnInit() {
    if (
      this.securityService.securityObject &&
      this.securityService.securityObject.isAuthenticated
    ) {
      this.currentUser = this.securityService.securityObject;
    }
    this.selectedDate = this.dataFilterService.selectedRPMDashboardDate;
    this.appUi.openRPMQualityCheckModal.subscribe((res: RPMQualityCheckModalDto) => {
      this.rpmQualityCheckModal.config = { backdrop: false, ignoreBackdropClick: false };
      this.isPrDashboardQC = res.isPrDashboard;
      this.getPatientById(res.patientId);
      setTimeout(() => {
        this.GetPatientRPMDetails(res.patientId);
      }, 1000);
      this.rpmQualityCheckModal.show();
    });
  }
  async getPatientById(patientId){
    this.patientService.getPatientDetail(patientId).subscribe((res: any)=>{
      this.selectedPatient =  res;
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
  onCloseRpmQualityCheckModal() {
    this.selectedModalityCode = "";
    this.devicesList = new Array<RPMDeviceListDtoNew>();
    this.selectedPatient = new PatientDto();
    this.rpmEncounterList =new Array<RPMEncounterDto>();
    this.rpmCarePlan= "";
  }
  GetRPMCarePlan(patientId: number) {
    this.rpmService.GetRpmCarePlan(patientId).subscribe(
      (res: any) => {
        if (res) {
          this.rpmCarePlan = res.carePlan;
        }
      },
      (error: HttpResError) => {
        // this.loadingPsy = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getLogsByPatientAndMonthId(patientId) {
    // this.rpmMonthId = moment(this.dataFilterService.selectedRPMDashboardDate, "YYYY-MM").month() + 1;
    // this.rpmYearId = moment(this.dataFilterService.selectedRPMDashboardDate, "YYYY-MM").year();
    if(this.dataFilterService.selectedRPMDashboardDate){
      this.selectedMonth = moment(this.dataFilterService.selectedRPMDashboardDate, "YYYY-MM").month() + 1;
       this.selectedYear = moment(this.dataFilterService.selectedRPMDashboardDate, "YYYY-MM").year();
     }else{
      this.selectedMonth = this.currentMonthNum;
       this.selectedYear = this.currentYearNum;
     }
    if (patientId && this.selectedMonth) {
      this.rpmService
        .getRPMEncounters(
          patientId,
          this.selectedMonth,
          this.selectedYear
        )
        .subscribe(
          (res) => {
            this.rpmEncounterList = res;
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  ChangeQualityCheckValue(enumVal: RpmQualityCheckedEnum, encounterId) {
    this.changingQualityCHeck = true;
    this.rpmService
      .SetQualityChecked(encounterId, enumVal)
      .subscribe(
        (res: any) => {
          this.rpmEncounterList.forEach((encounter: RPMEncounterDto) => {
            encounter.qualityCheckedByName =
            this.currentUser.fullName;
          encounter.qualityCheckedDate = moment().format();
            if(encounter.id == encounterId){
              encounter.qualityChecked = enumVal;
            }
          })
          // this.selectedPatient.qualityChecked = enumVal;
          this.checkQualityCheckStatus();
          this.changingQualityCHeck = false;
        },
        (error: HttpResError) => {
          this.changingQualityCHeck = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  CopyModalitiesData() {
    this.gettingRPMCopyData = true;
    this.rpmService
      .GetRPMEncountersAndReadingsForCopy(
        this.selectedPatient.id,
        this.selectedMonth,
        this.yearNum
      )
      .subscribe(
        (res: RPMCopyDto) => {
          this.rpmCopyDataObj = res;
          const mydoc = document;
          const div = mydoc.createElement("div");
          // div.style.display = 'none';
          // const data: string = text;
          div.innerHTML = this.rpmCarePlan;
          mydoc.body.appendChild(div);
          const text = div.innerText;
          div.remove();
          this.copyDataStr = ``;
          this.copyDataStr += `Patient Name: ${this.selectedPatient.fullName}\n`;
          this.copyDataStr += `Date of Birth: ${moment(
            this.selectedPatient.dateOfBirth
          ).format("MM-DD-YYYY")}\n`;
          this.copyDataStr += `Age: ${moment().diff(
            this.selectedPatient.dateOfBirth,
            "years"
          )}\n`;
          this.copyDataStr += `\n-------------- Treatment Plan ------------------\n`;
          this.copyDataStr += text + "\n";
          if (this.selectedModalityCode === "BP") {
            this.includeBpDataForCopy();
          }
          if (this.selectedModalityCode === "BG") {
            this.includeBGDataForCopy();
          }
          if (this.selectedModalityCode === "CGM") {
            this.includeCGMDataForCopy();
          }
          if (this.includeEncounters) {
            this.includeEncounterLogs();
          }
          this.executeCopyCommand();
          this.gettingRPMCopyData = false;
        },
        (error: HttpResError) => {
          this.gettingRPMCopyData = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  includeBpDataForCopy() {
    if (this.rpmCopyDataObj && this.rpmCopyDataObj.bloodPressureList) {
      this.copyDataStr += `\n-------------Blood Pressure Data----------------\n`;
      this.rpmCopyDataObj.bloodPressureList.forEach((item) => {
        const time = moment(item.measurementDate).format(
          "MM-DD-YYYY,\\ h:mm a"
        );
        this.copyDataStr += `  ${time} ${item.highPressure}/${item.lowPressure} mmHg ${item.heartRate} beats/min \n`;
      });
    }
  }
  includeBGDataForCopy() {
    if (this.rpmCopyDataObj && this.rpmCopyDataObj.bloodGlucoseList) {
      this.copyDataStr += `\n-------------Blood Glucose Data----------------\n`;
      this.rpmCopyDataObj.bloodGlucoseList.forEach((item) => {
        const time = moment(item.measurementDate).format(
          "MM-DD-YYYY,\\ h:mm a"
        );
        this.copyDataStr += `  ${time} ${item.bg} mg/dl \n`;
      });
    }
  }
  includeCGMDataForCopy() {
    this.copyDataStr += `\n-------------CONTINUOUS GLUCOSE (AVG)----------------\n`;
    if (this.rpmCopyDataObj && this.rpmCopyDataObj.cgmpPerDayAvgList) {
      this.rpmCopyDataObj.cgmpPerDayAvgList.forEach((item) => {
        // const time = moment(item.measurementDate).format('MM-DD-YYYY,\\ h:mm a');
        this.copyDataStr += `  ${item.date} ${item.avg} mg/dl \n`;
      });
      // this.copyDataStr += ` ${moment().month(this.rpmMonthId).format('MMM')} ${this.yearNum} ` + this.rpmCopyDataObj.cgmAvg + `\n`;
    }
  }
  includeEncounterLogs() {
    if (this.rpmCopyDataObj && this.rpmCopyDataObj.rpmEncounters) {
      this.copyDataStr += `\n-------------RPM Encounter Logs----------------\n`;
      this.rpmCopyDataObj.rpmEncounters.forEach((log) => {
        // tslint:disable-next-line: max-line-length
        this.copyDataStr += `Service Type : ${
          this.RPMServiceTypeEnum[log.rpmServiceType]
        }\n Created By : ${log.facilityUserName} \n Date : ${moment(
          log.encounterDate
        ).format("D MMM YY,\\ h:mm a")} , Start Time: ${
          log.startTime
        }, End Time : ${log.endTime} \n Duration : ${log.duration} \n`;
        this.copyDataStr += `Note: ${log.note} \n`;
      });
    }
  }
  executeCopyCommand() {
    const textArea = document.createElement("textarea");
    // textArea.style.display = 'none';
    textArea.value = this.copyDataStr;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    textArea.remove();
    this.toaster.success("Content Copied");
  }
  GetPatientRPMDetails(patientId: number) {
    // this.selectedPatientRPMQC = row.qualityChecked;
    this.rpmEncounterTime = "";
    this.rpmEncounterList = [];
    this.getLogsByPatientAndMonthId(patientId);
    this.getRpmEncounterTime(patientId);
    this.GetRPMCarePlan(patientId);
    this.GetPHDevicesByPatientId(patientId);
  }
  getRpmEncounterTime(patientId) {
    if(this.dataFilterService.selectedRPMDashboardDate){
     this.selectedMonth = moment(this.dataFilterService.selectedRPMDashboardDate, "YYYY-MM").month() + 1;
      this.selectedYear = moment(this.dataFilterService.selectedRPMDashboardDate, "YYYY-MM").year();
    }else{
     this.selectedMonth = this.currentMonthNum;
      this.selectedYear = this.currentYearNum;
    }
    this.ccmService
      .GetRpmEncountersDurationByPatientId(
        patientId,
        this.selectedMonth,
        this.selectedYear
      )
      .subscribe(
        (res: any) => {
          if (res) {
            this.rpmEncounterTime = res.duration;
          } else {
            this.rpmEncounterTime = "00:00:00";
          }
          // this.toaster.success('Data Updated Successfully');
        },
        (error) => {
          this.rpmEncounterTime = "00:00:00";
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  GetPHDevicesByPatientId(patientId: number) {
    this.isLoading = true;
    this.rpmService.GetPHDevicesByPatientId(patientId).subscribe(
      (res: any) => {
        this.devicesList = res;
        this.getDeviceDisplayData(patientId);
        if (this.devicesList) {
          this.devicesList.forEach((device: RPMDeviceListDtoNew) => {
            if (device.modality) {
              if (device.modality === "BP") {
                device.modalityName = "Blood Pressure";
              }
              if (device.modality === "WT") {
                device.modalityName = "Weight";
              }
              if (device.modality === "PO") {
                device.modalityName = "Pulse Oximetry";
              }
              if (device.modality === "BG") {
                device.modalityName = "Blood Glucose";
              }
              if (device.modality === "AT") {
                device.modalityName = "Activity";
              }
            }
          });
        }
        // this.toaster.success('Data Saved Successfully');
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  getDeviceDisplayData(patientId: number) {
    if (!this.selectedModalityCode) {
      setTimeout(() => {
        this.selectedModalityCode = this.devicesList[0]?.modality;
      }, 2000);
    }
    this.rpmService
      .getDevicesDatabyPatientId(patientId, this.selectedMonth, this.selectedYear)
      .subscribe((res: any) => {
        console.log(res);
        if (res.bgData.length > 0) {
          res.bgData = res.bgData.reverse();
          res.bgData.forEach((element) => {
            element.measurementDate = moment(element.measurementDate).format(
              "D MMM YY,\\ h:mm a"
            );
          });
          res.bgData = this.dataFilterService.distictArrayByProperty(
            res.bgData,
            "measurementDate"
          );
          this.BGDeviceDataList = res.bgData;
        }
        if (res.bpData.length > 0) {
          res.bpData.forEach((element) => {
            element.measurementDate = moment(element.measurementDate).format(
              "D MMM YY,\\ h:mm a"
            );
          });
          this.BPDeviceDataList = this.cloneService.deepClone(res.bpData);
        }
        if (res.wtData.length > 0) {
          res.wtData.forEach((element) => {
            element.measurementDate = moment(element.measurementDate).format(
              "D MMM YY,\\ h:mm a"
            );
          });
          res.wtData = this.dataFilterService.distictArrayByProperty(
            res.wtData,
            "measurementDate"
          );
          this.weightDataList = res.wtData;
        }
      });
  }
  checkQualityCheckStatus(){
    if(this.rpmEncounterList.length){
      const notQualityChecked = this.rpmEncounterList.filter((encounter: RPMEncounterDto)=>encounter.qualityChecked == 0);
      if(!notQualityChecked.length){
        this.patientService.refreshQualityCheckStatusOfRPM.next(0);
      }else{
        const qualityChecked = this.rpmEncounterList.filter((encounter: RPMEncounterDto)=>encounter.qualityChecked == 1);
        if(qualityChecked.length == this.rpmEncounterList.length){
        this.patientService.refreshQualityCheckStatusOfRPM.next(0);
        }else{
        this.patientService.refreshQualityCheckStatusOfRPM.next(2);
        }
      }
    }
  }
}
