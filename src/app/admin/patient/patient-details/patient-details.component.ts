import { PatientDto } from 'src/app/model/Patient/patient.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'src/app/SubSink';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { TwocChatService } from 'src/app/core/2c-chat.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { ChatGroupDto } from 'src/app/model/chat/chat.model';
import { EmitEvent, EventTypes, EventBusService } from 'src/app/core/event-bus.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AppDataService } from 'src/app/core/app-data.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { PatinetCommunicationGroup } from 'src/app/model/PatientEngagement/communication.model';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.scss']
})
export class PatientDetailsComponent implements OnInit {
  @Input() showEmrActionWidget = false;
  @Input() hideChatBtn = false;
  PatientData: any;
  PatientAge: number;
  PatientId: number;
  private subs = new SubSink();
  gettingChatGroup: boolean;
  @Output() patientInfoEmitter: EventEmitter<PatientDto> = new EventEmitter<PatientDto>();

  constructor(private route: ActivatedRoute,
    private patientsService: PatientsService,
    private twocChatService: TwocChatService,
    private securityService: SecurityService,
    private eventBus: EventBusService,
    private appData: AppDataService,
    private toaster: ToastService,
    ) { }

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    if (!this.PatientId) {
      this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get("id");
    }
  this.getPatientDetail();
  }
  getPatientDetail() {
    if (this.PatientId) {
      this.subs.sink = this.patientsService
        .getPatientDetail(this.PatientId)
        .subscribe(
          (res: any) => {
            if (res) {
              this.appData.summeryViewPatient = res;
              res.dateOfBirth = res.dateOfBirth.slice(0, 10);
              this.PatientData = res;
              if(this.PatientData.lastAppLaunchDate){
                this.PatientData.isActiveMobileUser = false;
                this.PatientData.lastAppLaunchDate =  moment(this.PatientData.lastAppLaunchDate).local().format('YYYY-MM-DDTHH:mm:ss.SSSS');
                const today = moment();
                var duration =today.diff(this.PatientData.lastAppLaunchDate, 'days');
                if(duration < 30){
                  this.PatientData.isActiveMobileUser = true;
                }
                this.PatientData.lastAppLaunchDate =  moment.utc(this.PatientData.lastAppLaunchDate).local().format('D MMM YY,\\ h:mm a');
              }
              if (this.PatientData.homePhone) {
                this.PatientData.homePhone = this.PatientData.homePhone.replace(
                  /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                  '($1)$2-$3'
                );
              }
              if (this.PatientData.personNumber) {
                this.PatientData.personNumber = this.PatientData.personNumber.replace(
                  /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                  '($1)$2-$3'
                );
              }
              if (this.PatientData.emergencyContactPrimaryPhoneNo) {
                this.PatientData.emergencyContactPrimaryPhoneNo = this.PatientData.emergencyContactPrimaryPhoneNo.replace(
                  /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                  '($1)$2-$3'
                );
              }
              if (this.PatientData.emergencyContactSecondaryPhoneNo) {
                this.PatientData.emergencyContactSecondaryPhoneNo = this.PatientData.emergencyContactSecondaryPhoneNo.replace(
                  /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                  '($1)$2-$3'
                );
              }
              this.PatientAge = this.calculateAge(
                this.PatientData.dateOfBirth
              );
              this.patientInfoEmitter.emit(this.PatientData);
            }
          },
          error => {
            //  console.log(error);
          }
        );
    }
  }
  public calculateAge(birthdate: any): number {
    return moment().diff(birthdate, 'years');
  }
  getChatGroup() {
    // this.gettingChatGroup = true;
    // this.subs.sink = this.twocChatService
    //   .GetPersonalChatGroup(
    //     this.securityService.securityObject.appUserId,
    //     this.PatientData.userId
    //   )
    //   .subscribe(
    //     (res: ChatGroupDto) => {
    //       this.gettingChatGroup = false;
    //       // this.router.navigateByUrl(`/chat/messages?channel=${res.channelName}`);
    //       const event = new EmitEvent();
    //       event.name = EventTypes.OpenCommunicationModal;
    //       event.value = res;
    //       this.eventBus.emit(event);
    //     },
    //     (err: HttpResError) => {
    //       this.gettingChatGroup = false;
    //       this.toaster.error(err.message, err.error || err.error);
    //     }
    //   );
    const event = new EmitEvent();
    event.name = EventTypes.OpenCommunicationModal;
    const chatGroup = new PatinetCommunicationGroup();
    chatGroup.id = this.PatientData.id;
    chatGroup.name = `${this.PatientData.firstName} ${this.PatientData.lastName}`;
    chatGroup.lastCommunication = null
    event.value = chatGroup;
    this.eventBus.emit(event);
  }

}
