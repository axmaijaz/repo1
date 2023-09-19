import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import moment from 'moment';
import { ToastService } from 'ng-uikit-pro-standard';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { RingCentralService } from 'src/app/core/RingCentral/ring-central.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { PEMCaseDetailDto } from 'src/app/model/PatientEngagement/pem.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { RpmPatientsListDto } from 'src/app/model/rpm.model';

@Component({
  selector: 'app-patient-telephony-chat',
  templateUrl: './patient-telephony-chat.component.html',
  styleUrls: ['./patient-telephony-chat.component.scss']
})
export class PatientTelephonyChatComponent implements OnInit, OnDestroy {
  @Input() PatientUserId: string;
  loadingTelephonyData: boolean;
  pemCaseDetails: PEMCaseDetailDto[];
  selectedPatient: PatientDto;
  sendingMessage: boolean;
  messageText: string;
  loadingNewData: boolean;
  callInterval: NodeJS.Timeout;

  constructor(private toaster: ToastService, private rcService: RingCentralService, private dataService: DataFilterService,
    private eventBus: EventBusService,
    private securityService: SecurityService, private patientsService: PatientsService, private facilityService: FacilityService) { }

    ngOnDestroy(): void {
    if (this.callInterval) {
      clearInterval(this.callInterval)
    }
  }

  ngOnInit(): void {
    this.getPatientDetail();
    if (this.callInterval) {
      clearInterval(this.callInterval)
    }
    this.callInterval = setInterval(() => {
      this.RefreshPemData();
    }, 7000);
  }

  getPatientDetail() {
    this.loadingTelephonyData = true;
    this.selectedPatient = new PatientDto();

    this.patientsService.getPatientDetailByUserId(this.PatientUserId).subscribe(
      (res: any) => {
        if (res) {
          this.selectedPatient = res;
          if (this.selectedPatient?.telephonyCommunication) {
            this.GetPatientTelephonyData()
          } else {
            this.loadingTelephonyData = false;
          }
        }
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  RefreshPemData() {
    // this.loadingNewData = true;
    // this.rcService.GenerateCasesFromMessageList().subscribe(
    //   (res: PEMCaseDetailDto[]) => {
    //     this.loadingNewData = false;
    //     if (!res?.length) {
    //       return;
    //     }
    //     res.forEach((pemCaseDetail) => {
    //       if (pemCaseDetail) {
    //         pemCaseDetail.creationTime = moment.utc(pemCaseDetail.creationTime).local().format('MMM DD YY,\\ h:mm a');
    //         this.pemCaseDetails.push(pemCaseDetail)
    //       }
    //     });
    //     if (res) {
    //       this.pemCaseDetails = [...this.pemCaseDetails]
    //     }
    //   },
    //   (error: HttpResError) => {
    //     this.loadingNewData = false;
    //     // this.toaster.error(error.error, error.message);
    //   }
    // );
  }

  GetPatientTelephonyData() {
    this.loadingTelephonyData = true;
    this.rcService.GetPemMessages(this.selectedPatient.id).subscribe(
      (res: PEMCaseDetailDto[]) => {
        // if (!res?.length) {
        //   res = this.FillDummy()
        // }
        if (res?.length) {

          res = res.sort((a, b) => a.id - b.id);
        }
        this.pemCaseDetails = res;
        this.pemCaseDetails.forEach(detail => {
          detail.creationTime = moment.utc(detail.creationTime).local().format('MMM DD YY,\\ h:mm a');
        });
        this.loadingTelephonyData = false;
      },
      (error: HttpResError) => {
        this.loadingTelephonyData = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  OpenPatientSetting() {
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.TriggerGlobalIframe;
    emitObj.value = `insights/setting/sms-voice-consent/${this.selectedPatient.id}`;
    this.eventBus.emit(emitObj);
  }
  SendRCMessage() {
    this.sendingMessage = true;
    const phoneNo = (this.selectedPatient.countryCallingCode || '+1') + (this.selectedPatient?.primaryPhoneNumber || this.selectedPatient?.homePhone)
    this.rcService.SendMessageToNumber(phoneNo, this.messageText).subscribe(
      (res: any) => {
        this.toaster.success(`Message sent successfully`)
        // this.RefreshPemData();
        // this.PemResData = res;
        // this.PemResData.forEach((pemCase) => {
        //   pemCase.pemCaseDetails.forEach(detail => {
        //     detail.creationTime = moment.utc(detail.creationTime).local().format('MMM DD YY,\\ h:mm a');
        //   });
        // });
        // this.GetPemData();
        if (res) {
          res.creationTime = moment.utc(res.creationTime).local().format('MMM DD YY,\\ h:mm a');
          this.pemCaseDetails.push(res)
          this.pemCaseDetails = [...this.pemCaseDetails]
        }
          this.messageText = '';
        this.sendingMessage = false;
      },
      (error: HttpResError) => {
        this.sendingMessage = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

}
