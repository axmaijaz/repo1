import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { ToastService } from 'ng-uikit-pro-standard';
import { RPMServiceType } from 'src/app/Enums/rpm.enum';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { RingCentralService } from 'src/app/core/RingCentral/ring-central.service';
import { AppUiService } from 'src/app/core/app-ui.service';
import { CommunicationService } from 'src/app/core/communication.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { LazyModalDto, PagingData, TwoCModulesEnum } from 'src/app/model/AppModels/app.model';
import { PatientNotificationDto } from 'src/app/model/Patient/patient-notification-model';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { AddCommunicationDto, ChangeCommunicationFlagsDto, CommunicationMethod, CommunicationType, MarkPatientGroupFlagsDto, PatientCommunicationHistoryDto, PatinetCommunicationGroup } from 'src/app/model/PatientEngagement/communication.model';
import { AddCcmEncounterDto } from 'src/app/model/admin/ccm.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { RPMEncounterDto } from 'src/app/model/rpm.model';
import { TwoCTextAreaComponent } from 'src/app/utility/two-c-text-area/two-c-text-area.component';

@Component({
  selector: 'app-communication-detail',
  templateUrl: './communication-detail.component.html',
  styleUrls: ['./communication-detail.component.scss']
})
export class CommunicationDetailComponent implements OnInit {
  @Output() closeCommDetails  = new EventEmitter<boolean>()
  @Input() insideMain = false;
  @Input() insideSideNav = false;
  @Input() selectedGroup: PatinetCommunicationGroup;
  @ViewChild("myFIeldRef9898") myFIeldRef: TwoCTextAreaComponent;
  loadingTelephonyData: boolean;
  commHistory: PatientCommunicationHistoryDto[];
  selectedPatient: PatientDto;
  sendingMessage: boolean;
  messageText: string;
  facilityId: number;
  pagingData: PagingData;
  gettingHistory: boolean;
  addingCommunication: boolean;
  addCommDto = new AddCommunicationDto();
  currentUserId = ''
  CommunicationMethod = CommunicationMethod;
  CommunicationType = CommunicationType;
  selection: boolean;
  messageType = CommunicationMethod.App;
  loadingNewData: boolean;
  toggleHeight: boolean = false;

  constructor(private toaster: ToastService, private commService: CommunicationService, private dataService: DataFilterService,
    private eventBus: EventBusService, private router: Router,
    private appUi: AppUiService,
    private cdr: ChangeDetectorRef, public rcService: RingCentralService,
    private securityService: SecurityService, private patientsService: PatientsService, private facilityService: FacilityService) { }

  ngOnDestroy(): void {
    if (this.commService.callInterval) {
      clearInterval(this.commService.callInterval)
    }
  }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.currentUserId = this.securityService.securityObject?.appUserId;
    this.handleIncomingMessages();
    window.addEventListener('message', this.receiveMessage, false);
    if (!this.selectedGroup?.id) {
      return;
    }
    this.GetCommunicationHistory();
    this.getPatientDetail()
    this.fetchNewMessages();
    this.eventBus.on(EventTypes.CommunicationEncounterEdit).subscribe((res) => {
      this.refreshPatientMessages(res.data.patientId, res.data.patientCommunicationIds, res.data.serviceType);
    });
  }
  refreshPatientMessages(patientId: any, patientCommunicationIds: any, serviceType: TwoCModulesEnum) {
    patientCommunicationIds.forEach((commId) => {
      const filteredMessage = this.commHistory.find((message) => message.id == commId)
      filteredMessage.serviceType = serviceType;
      filteredMessage.selected = false;
    })

  }
  receiveMessage = (event) => {
    if (event.data.type === 'PatientNotificationSettingChanged') {
      const notificationSetting = event.data.mData as PatientNotificationDto;
      if (this.selectedPatient?.id == notificationSetting.patientId) {
        this.selectedPatient.telephonyCommunication = notificationSetting.telephonyCommunication
      }
    }
  }
  fetchNewMessages() {
    if (this.commService.callInterval) {
      clearInterval(this.commService.callInterval)
    }
    this.commService.callInterval = setInterval(() => {
      // this.RefreshCommunicationData();
    }, 7000);
  }
  RefreshCommunicationData() {
    this.loadingNewData = true;
    this.rcService.GenerateCasesFromMessageList(this.facilityId, this.selectedGroup?.id).subscribe(
      (res: PatientCommunicationHistoryDto[]) => {
        this.loadingNewData = false;
        // if (!res?.length) {
        //   return;
        // }
        // res.forEach(item => {
        //   item.shortCode = item.senderName?.getShortCode();
        //   item.timeStamp = moment.utc(item.timeStamp).local().format('MMM DD,\\ hh:mm a');
        // });
        // console.log(res.map(x => x.id))
        // this.AddMessaagesData({source: 'inApp', data: res})
        // this.PublishToApp(res)
      },
      (error: HttpResError) => {
        this.loadingNewData = false;
        // this.toaster.error(error.error, error.message);
      }
    );
  }

  loadGroupData(selectedGroup: PatinetCommunicationGroup) {
    this.selectedGroup = selectedGroup;
    this.getPatientDetail()
    this.GetCommunicationHistory()
  }
  handleIncomingMessages() {
    this.eventBus.on(EventTypes.NewCommunicationMessage).subscribe((res: {source: string, data: [PatientCommunicationHistoryDto]}) => {
      this.AddMessaagesData(res)
    });
  }
  AddMessaagesData(res: {source: string, data: PatientCommunicationHistoryDto[]}) {
    const messagesToAdd = res.data.filter(x => x.patientId == this.selectedGroup.id && x.senderUserId !== this.currentUserId && this.commHistory.some(y => x.id == y.id) == false)
      if (messagesToAdd?.length) {
        console.log(messagesToAdd)
        this.commHistory.push(...messagesToAdd)
        this.SelectDefaultCommunicationMethod()
        this.cdr.detectChanges();
        this.PlayAudio(2);
        this.ScrollToLastMessage();
      }
  }
  PublishToApp(res: PatientCommunicationHistoryDto[]) {
    const event = new EmitEvent();
    event.name = EventTypes.NewCommunicationMessage;
    event.value = {source: 'inApp', data: res};
    this.eventBus.emit(event);
  }

  MarkPatientGroupFlags() {
    const groupFlag = new MarkPatientGroupFlagsDto();
    groupFlag.patientId = this.selectedGroup.id
    groupFlag.following = this.selectedGroup.following
    groupFlag.critical = this.selectedGroup.critical
    this.commService.MarkPatientGroupFlags(groupFlag).subscribe(
      (res) => {

      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }

  GetCommunicationHistory() {
    this.selection = false;
    this.commHistory = [];
    this.gettingHistory = true;
    this.selectedPatient = new PatientDto();

    this.commService.GetCommunicationHistory(this.selectedGroup?.id).subscribe(
      (res: { pagingData: PagingData, results: PatientCommunicationHistoryDto[] }) => {
        this.gettingHistory = false;

        if (res.results?.length) {
          this.commHistory = res.results.reverse();
          this.commHistory.forEach(item => {
            item.shortCode = item.senderName?.getShortCode();
            item.timeStamp = moment.utc(item.timeStamp).local().format('MMM DD,\\ hh:mm a');
          });
          this.SelectDefaultCommunicationMethod()
          this.ScrollToLastMessage()
        }
        this.pagingData = res.pagingData;
      },
      (error: HttpResError) => {
        this.gettingHistory = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AddPatientCommunication() {
    if (!this.messageText.trim()) {
      return;
    }
    this.addingCommunication = true;
    this.addCommDto.message = this.removeLastLine(this.messageText)
    this.addCommDto.senderUserId = this.currentUserId
    this.addCommDto.patientId = this.selectedGroup.id;
    this.addCommDto.method = this.messageType;
    this.addCommDto.facilityId = this.facilityId;
    this.messageText = '';
    this.FillNoteText('')
    this.commService.AddPatientCommunication(this.addCommDto).subscribe(
      (res: PatientCommunicationHistoryDto) => {
        this.addingCommunication = false;
        if (res) {
          res.shortCode = res.senderName?.getShortCode();
          res.timeStamp = moment.utc(res.timeStamp).local().format('MMM DD,\\ hh:mm a');
          this.commHistory.push(res)
          this.commHistory = [...this.commHistory];
          this.SelectDefaultCommunicationMethod()
          this.ScrollToLastMessage()
          this.PlayAudio(1);
          this.PublishToApp([res]);
          this.cdr.detectChanges();
        }
      },
      (error: HttpResError) => {
        this.addingCommunication = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  removeLastLine(text: string): string {
    const regex = /\n+$/; // Regular expression to match one or more consecutive newline characters at the end of the string
    const updatedText = text.replace(regex, ''); // Replace the matched newline characters with an empty string
    return updatedText;
  }
  FillNoteText(text: string) {
    if (this.myFIeldRef?.FillValue) {
      this.myFIeldRef.FillValue(text);
    } else {
      setTimeout(() => {
        if (this.myFIeldRef?.FillValue) {
          this.myFIeldRef.FillValue(text);
        }
      }, 1000);
    }
  }
  selectMessage(item: PatientCommunicationHistoryDto) {
    if (this.selection) {
      item.selected = !item.selected
    }
  }
  CopySelectedMessages(toast = true, unattended = false) {
    let copyText = ``;
    let facilityName = this.securityService?.getClaim('FacilityName')?.claimValue
    this.commHistory.forEach(x => {
      if (x.selected) {
        const nTime = moment(x.timeStamp).format('DD MMM')
        // const nTime = moment(x.timeStamp).format('DD MMM YY,\\ hh:mm a')
        if (unattended && x.serviceType == null) {
          copyText += `${nTime} ${x.senderName}@${facilityName || ''}:  ${x.message || ''} \n`;
        }
        if (unattended == false) {
          copyText += `${nTime} ${x.senderName}@${facilityName || ''}:  ${x.message || ''} \n`;
        }
      }
    });
    navigator.clipboard.writeText(copyText);
    if (toast) {
      this.toaster.success('Selection copied');
    }
    return copyText;
  }
  OpenCCMEncounterModel() {
    const note = this.CopySelectedMessages(false, true);
    this.commHistory.forEach(element => {
      if (element.selected && element.serviceType != null) {
        element.selected = false
      }
    });
    this.commService.OpenCCMEncounterModel(this.selectedPatient, note, this.commHistory)
  }
  OpenRPMEncounterModel() {
    const note = this.CopySelectedMessages(false, true);
    this.commHistory.forEach(element => {
      if (element.selected && element.serviceType != null) {
        element.selected = false
      }
    });
    this.commService.OpenRPMEncounterModel(this.selectedPatient, note, this.commHistory)
  }
  RestoreListView() {
    this.closeCommDetails.emit(false)
  }

  ScrollToLastMessage() {
    const element = document.getElementById('chat-body-div')
    setTimeout(() => {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'auto'
      });
    }, 200);
  }
  SelectDefaultCommunicationMethod() {
    const TelephonyCommunication = this.securityService.getClaim('TelephonyCommunication')?.claimValue;
    const ChatService = this.securityService.getClaim('ChatService')?.claimValue;
    let lastMessage: PatientCommunicationHistoryDto;
    if (this.commHistory?.length) {
      lastMessage = (this.commHistory || []).reduce((prev, current) => (prev.id > current.id) ? prev : current);
    }
    if (lastMessage) {
      this.messageType = lastMessage.method;
    } else {
      this.messageType = CommunicationMethod.Telephony
    }
    if (TelephonyCommunication && this.selectedPatient?.telephonyCommunication) {
      this.messageType = CommunicationMethod.Telephony
    } else {
      this.messageType = CommunicationMethod.App
    }
    if (!ChatService && !TelephonyCommunication) {
      this.messageType = null;
    }
  }

  // 1 for send message, 2 for new Message
  PlayAudio(type: number) {
    try {
      if (type == 1) {
        const msgAudio = new Audio()
        msgAudio.src = '../../assets/sounds/pullout.MP3';
        msgAudio.load();
        msgAudio.play();
      }
      // if (type == 2) {
      //   const msgAudio = new Audio()
      //   msgAudio.src = '../../assets/sounds/readmsg.MP3';
      //   msgAudio.load();
      //   msgAudio.play();
      // }
    } catch (error) {
      console.log(error)
    }
  }
  OpenPatientSetting() {
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.TriggerGlobalIframe;
    emitObj.value = `insights/setting/sms-voice-consent/${this.selectedGroup.id}`;
    this.eventBus.emit(emitObj);
  }
  getPatientDetail() {
    this.loadingTelephonyData = true;
    this.selectedPatient = new PatientDto();

    this.patientsService.getPatientDetail(this.selectedGroup.id).subscribe(
      (res: any) => {
        this.loadingTelephonyData = false;
        if (res) {
          this.selectedPatient = res;
          if (this.selectedPatient?.telephonyCommunication) {
            // this.GetPatientTelephonyData()
          } else {
          }
          this.SelectDefaultCommunicationMethod();
        }
        this.ScrollToLastMessage();
      },
      (error: HttpResError) => {
        this.loadingTelephonyData = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  // OpenMessageView() {
  //   this.rcService.sendSms(this.selectedPatient.homePhone || this.selectedPatient.personNumber || this.selectedPatient.primaryPhoneNumber);
  // }
  OpenConverSation() {
    this.rcService.OpenConverSation(this.selectedPatient.homePhone || this.selectedPatient.personNumber || this.selectedPatient.primaryPhoneNumber);
  }
  OpenCallView() {
    this.rcService.startCall(this.selectedPatient.homePhone || this.selectedPatient.personNumber || this.selectedPatient.primaryPhoneNumber);
  }
  OpenPatientDetail() {
    // this.router.navigateByUrl("/admin/patient/" + this.selectedGroup.id + "/summary");
    this.router
        .navigateByUrl("/", { skipLocationChange: true })
        .then((value) => {
          this.router.navigateByUrl("/admin/patient/" + this.selectedGroup.id + "/summary");
        });
  }
  changeSelection() {
    if(this.selection) {
      this.selection = false;
      this.commHistory.forEach(msg => {
        msg.selected = false;
      });
    } else {
      this.selection = true
    }
  }
  toggleHeightF(){
    this.toggleHeight = !this.toggleHeight
  }
  ConfirmChangeFlag() {
    // const modalDto = new LazyModalDto();
    // modalDto.Title = 'Communication Flag';
    // modalDto.Text =
    //   `Do you want to mark selected communications as ${'unRead'}?`;
    // modalDto.callBack = this.ChangePatientsCommunicationFlags;
    // // modalDto.rejectCallBack = this.rejectCallBack;
    // modalDto.data = 'unRead';
    // this.appUi.openLazyConfrimModal(modalDto);
    this.ChangePatientsCommunicationFlags('unRead')
  }

  ChangePatientsCommunicationFlags = (action: string) => {
    const ChangeCommunicationFlagsObj = new ChangeCommunicationFlagsDto();
    ChangeCommunicationFlagsObj.patientUserIds = [this.selectedPatient.userId]
    ChangeCommunicationFlagsObj.unRead = true
    this.commService.ChangePatientsCommunicationFlags(ChangeCommunicationFlagsObj).subscribe(
      (res) => {
        this.toaster.success(`Communication flag applied`)

      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
}
