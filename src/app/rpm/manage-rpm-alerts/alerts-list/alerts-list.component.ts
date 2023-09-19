import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { RpmService } from 'src/app/core/rpm.service';
import { RpmAlertListDto, SendAlertSmsDto, AddRpmAlertCallDto, EditRpmALertDto, AlertStatusEnum, SendRpmAlertChatDto } from 'src/app/model/rpm/rpmAlert.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import moment from 'moment';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { AddTaskComponent } from 'src/app/patient-Task-modal/add-task/add-task.component';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { PubnubChatService } from 'src/app/core/pubnub-chat.service';
import { ActivatedRoute } from '@angular/router';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';


@Component({
  selector: 'app-alerts-list',
  templateUrl: './alerts-list.component.html',
  styleUrls: ['./alerts-list.component.scss']
})
export class AlertsListComponent implements OnInit {
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD hh:mm A',
    appendTo: 'body',
    disableKeypress: true,
    drops:'down'
  };
  isLoading: boolean;
  CareProvidersList = new Array<CreateFacilityUserDto>();
  facilityUserList = new Array<CreateFacilityUserDto>();
  rpmAlertListDto = new Array<RpmAlertListDto>();
  selectedRpmAlert = new RpmAlertListDto();
  sendAlertSmsObj = new SendAlertSmsDto();
  addRpmCallLogObj = new AddRpmAlertCallDto();
  editRpmAlertobj = new EditRpmALertDto();
  alertStatusEnumObj = AlertStatusEnum;
  alertStatusEnumList = this.filterDataService.getEnumAsList(AlertStatusEnum);
  isLoadingAlerts: boolean;
  isLoadingSmsContent: boolean;
  smsNotReceivedContent: string;
  isSendingAlertSms: boolean;
  isSendingAlertCall: boolean;
  isSavingAlert: boolean;
  patientId: number;
  sendChatToProviderDto = new SendRpmAlertChatDto();
  @ViewChild('addTaskCompRef') addTaskComp: AddTaskComponent;
  isSendingChatMsg: boolean;
  isLoadingFacilityList: boolean;
  constructor(private location: Location, private facilityService: FacilityService ,private patientsService: PatientsService, private toaster: ToastService,
    private chatService: PubnubChatService ,private route: ActivatedRoute,private rpmService: RpmService, private filterDataService: DataFilterService,
    private securityService: SecurityService,) { }

  ngOnInit(): void {
    this.patientId = +this.route.snapshot.paramMap.get("id");
    if (!this.patientId) {
      this.patientId = 0;
      if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      this.GetRpmAlerts();
      }

    }
    if (this.patientId > 0) {
      this.GetRpmAlerts();
    }
    this.chatService.RpmAlertDataChanged.asObservable().subscribe(
      (data: any) => {
        this.GetRpmAlerts();
      }
    );
  }
  goBack() {
    this.location.back();
  }
  GetRpmAlerts() {
    this.isLoadingAlerts = true;
    this.rpmService.GetRpmAlerts(this.patientId, 0).subscribe(
      (res: any) => {
        this.isLoadingAlerts = false;
        this.rpmAlertListDto = res;
          this.rpmAlertListDto.forEach(element => {
            if (element.callTime) {
              element.callTime = moment.utc(element.callTime).local().format('DD MMM h:mm a');
            }
            if (element.smsTime ) {
              element.smsTime = moment.utc(element.smsTime).local().format('DD MMM h:mm a');
            }
            if (element.dueTime ) {
              element.dueTime = moment.utc(element.dueTime).local().format('DD MMM h:mm a');
            }
            if (element.timeOut ) {
              element.timeOut = moment.utc(element.timeOut).local().format('DD MMM h:mm a');
            }
            if (element.alertTime) {
              element.alertTime = moment.utc(element.alertTime).local().format('DD MMM h:mm a');
            }
          });
      },
      (error: HttpResError) => {
        this.isLoadingAlerts = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SendAlertSms(modal: ModalDirective) {
    this.isSendingAlertSms = true;
    this.sendAlertSmsObj.patientId = this.selectedRpmAlert.patientId;
    this.sendAlertSmsObj.rpmAlertId = this.selectedRpmAlert.id;
    this.sendAlertSmsObj.timeOut = moment(this.sendAlertSmsObj.timeOut, 'YYYY-MM-DD h:mm:ss a').utc().format('YYYY-MM-DD h:mm:ss a');
    this.rpmService.SendAlertSms(this.sendAlertSmsObj).subscribe(
      (res: any) => {
        this.isSendingAlertSms = false;
        modal.hide();
        this.toaster.success('Sms sent successfully');
        this.sendAlertSmsObj = new SendAlertSmsDto();
        this.GetRpmAlerts();
      },
      (error: HttpResError) => {
        this.isSendingAlertSms = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SendCHatMessage(modal: ModalDirective) {
    this.isSendingChatMsg = true;
    this.sendChatToProviderDto.alertId = this.selectedRpmAlert.id;
    this.rpmService.SendRpmAlertChat(this.sendChatToProviderDto).subscribe(
      (res: any) => {
        this.isSendingChatMsg = false;
        modal.hide();
        this.toaster.success('Chat message sent successfully');
        this.sendChatToProviderDto = new SendRpmAlertChatDto();
        // this.GetRpmAlerts();
      },
      (error: HttpResError) => {
        this.isSendingChatMsg = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AddAllertCallLog(modal: ModalDirective) {
    this.isSendingAlertCall = true;
    // this.addRpmCallLogObj.patientId = this.selectedRpmAlert.patientId;
    this.addRpmCallLogObj.alertId = this.selectedRpmAlert.id;
    // this.addRpmCallLogObj.callTime = moment.utc(this.addRpmCallLogObj.callTime).format('YYYY-MM-DD h:mm:ss a');
    this.addRpmCallLogObj.callTime = moment(this.addRpmCallLogObj.callTime, 'YYYY-MM-DD h:mm:ss a').utc().format('YYYY-MM-DD h:mm:ss a');
    if (this.addRpmCallLogObj.timeOut) {
      this.addRpmCallLogObj.timeOut = moment(this.addRpmCallLogObj.timeOut, 'YYYY-MM-DD h:mm:ss a').utc().format('YYYY-MM-DD h:mm:ss a');
    }
    this.rpmService.AddAllertCallLog(this.addRpmCallLogObj).subscribe(
      (res: any) => {
        this.isSendingAlertCall = false;
        modal.hide();
        this.toaster.success('Call log successfully');
        this.addRpmCallLogObj = new AddRpmAlertCallDto();
        this.GetRpmAlerts();
      },
      (error: HttpResError) => {
        this.isSendingAlertCall = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  fillEditAlertDetail() {
    this.editRpmAlertobj.id = this.selectedRpmAlert.id;
    this.editRpmAlertobj.note = this.selectedRpmAlert.note;
    this.editRpmAlertobj.alertStatus = this.selectedRpmAlert.alertStatus;
  }
  EditAllertLog(modal: ModalDirective) {
    this.isSavingAlert = true;
    this.rpmService.EditRpmALert(this.editRpmAlertobj).subscribe(
      (res: any) => {
        this.isSavingAlert = false;
        modal.hide();
        this.toaster.success('Alert detail updated successfully');
        this.editRpmAlertobj = new EditRpmALertDto();
        this.GetRpmAlerts();
      },
      (error: HttpResError) => {
        this.isSavingAlert = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetDefaultNotReceivedSmsContent() {
    this.isLoadingSmsContent = true;
    this.sendAlertSmsObj.messageText = '';
    this.rpmService.GetDefaultNotReceivedSmsContent(this.selectedRpmAlert.patientId, this.selectedRpmAlert.modality).subscribe(
      (res: any) => {
        this.isLoadingSmsContent = false;
        this.smsNotReceivedContent = res.message;
        this.sendAlertSmsObj.messageText = res.message;
      },
      (error: HttpResError) => {
        this.isLoadingSmsContent = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  setCallDefaultTime() {
    this.addRpmCallLogObj.callTime = moment().format('YYYY-MM-DD h:mm:ss a');
  }
  openPatientTaskModel(alrt: RpmAlertListDto) {

  }
  getPatientDetail(alrt: RpmAlertListDto) {
    this.addTaskComp.CareProvidersList = [];
    this.patientsService.getPatientDetail(alrt.patientId).subscribe(
        (res: any) => {
          if (res) {
            // this.addTaskComp.patientData = res;
            res['primaryPhoneNumber'] = res['homePhone'];
            this.addTaskComp.OpenTaskViewModal(res);
          }
        },
        error => {
          //  console.log(error);
        });
    this.getCareProviders(alrt.facilityId);
  }
  getCareProviders(facilityId: number) {
    if (!facilityId) {
      facilityId = 0;
    }
    this.facilityService
      .GetCareProvidersByFacilityId(facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.addTaskComp.CareProvidersList = res;
          }
        },
        (error) => {}
      );
  }
  getFacilityUsersList(id: number) {
    this.facilityUserList = [];
    this.isLoadingFacilityList = true;
    this.facilityService
      .getFacilityUserList(id)
      .subscribe(
        (res: any) => {
          this.facilityUserList = res;
          this.isLoadingFacilityList = false;
        },
        err => {
          this.isLoadingFacilityList = false;
        }
      );
  }

}

