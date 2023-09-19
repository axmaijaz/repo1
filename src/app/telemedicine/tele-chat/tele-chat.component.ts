import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IMyOptions, ToastService } from 'ng-uikit-pro-standard';
import { TelemedicineService } from 'src/app/core/telemedicine.service';
import { Location } from '@angular/common';
import { SubSink } from 'src/app/SubSink';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { SecurityService } from 'src/app/core/security/security.service';
import {
  TmEncounterDto,
  SentTMEncounterDto,
  TmEncounterStatus,
} from 'src/app/model/TeleMedicine/telemedicine.model';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { NgForm } from '@angular/forms';
import { PubnubChatService } from 'src/app/core/pubnub-chat.service';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { FacilityService } from 'src/app/core/facility/facility.service';
// import { PubNubAngular } from "pubnub-angular2";
import { Page, PagingData } from 'src/app/model/AppModels/app.model';
// import { startTimeRange } from '@angular/core/src/profile/wtf_impl';
import { UserType } from 'src/app/Enums/UserType.enum';
import { PatientsService } from 'src/app/core/Patient/patients.service';
@Component({
  selector: 'app-tele-chat',
  templateUrl: './tele-chat.component.html',
  styleUrls: ['./tele-chat.component.scss'],
})
export class TeleChatComponent implements OnInit, AfterViewInit {
  @ViewChild('f') form: NgForm;
  sendTmEncounterObj = new SentTMEncounterDto();
  rows = new Array<TmEncounterDto>();
  existEmail: boolean;
  existPhone: boolean;
  tmEncounterStatusEnum = TmEncounterStatus;
  BIllingProviderList: any;
  pubnub: any;

  public myDatePickerOptions: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD',
    opens: "right",
    drops: "down"

  };
  isLoading: boolean;
  private subs = new SubSink();
  bProviderId: number;
  selectedBP: number;
  @ViewChild('table') table;
  page = new Page();
  temPageNumber: any;
  facilityId: number;
  patientsList: any;
  selectedPatient: any;
  constructor(
    private toaster: ToastService,
    private pubNub: PubnubChatService,
    private securityService: SecurityService,
    private location: Location,
    private teleMedicineService: TelemedicineService,
    private facilityService: FacilityService,
    private patientService: PatientsService,
  ) {}

  ngOnInit() {
    if (this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    }
    this.subscribeNewTm();
    this.bProviderId = this.securityService.securityObject.id;
    this.selectedBP = this.bProviderId;
    // this.bp = 10;
    this.GetTmEncountersByBillingProviderId();
    this.getBillingProvidersByFacilityId();

    this.subs.sink = this.pubNub.signalRConnected
      .asObservable()
      .subscribe((val: boolean) => {
        this.getActivePatients();
      });
  }
  ngAfterViewInit() {
    this.getPatientsByFacilityId();
    // this.table.bodyComponent.updatePage = function(direction: string): void {
    //   let offset = this.indexes.first / this.pageSize;
    //   if (direction === "up") {
    //     offset = Math.ceil(offset);
    //   } else if (direction === "down") {
    //     offset = Math.floor(offset);
    //   }
    //   if (direction !== undefined && !isNaN(offset)) {
    //     this.page.emit({ offset });
    //   }
    // };
    this.incrementTimer();
  }
  GetTmEncountersByBillingProviderId() {
    // this.pagingData.pageNumber = pageInfo.offset;
    this.setPage({ offset: 0 });
  }
  setPage(pageInfo) {
    console.log('pageinfo', pageInfo);
    this.isLoading = true;
    this.page.pageNumber = pageInfo.offset;
    this.isLoading = true;
    this.subs.sink = this.teleMedicineService
      .GetTmEncountersByBillingProviderId(this.securityService.securityObject.id, 1, 500)
      .subscribe(
        (res: any) => {
          res.filter((data) => {
            data.startedTime = moment.utc(data.startedTime).local().format('h:mm a');
            if (data.startedTime === 'Invalid date') {
              data.startedTime = '';
            }
            // .utc(data.startedTime)
            // .local()
            // .format("h:mm a");
            // res.push(data);
          });
          this.rows = res;
          // this.page.pageNumber = Math.ceil(res.length/ 50);
          // this.page.size = res.pagingData.pageSize;
          this.page.totalElements = res.length;
          // this.page.totalPages =  Math.ceil(res.length/ 50);
          // this.rows = res.tmEncounters;
          // this.page.size = 50;
          // this.page.pageNumber = res.pagingData.pageNumber - 1;
          this.isLoading = false;
          if (this.pubNub.signalAlreadyRConnected) {
            this.getActivePatients();
          }
          // this.rows = [];
          // this.rows = [...res];
          // this.pagingData.elementsCount = res.length;
          // this.pagingData = res.pagingData;
          // this.pagingData.pageSize = 10;
          // this.pagingData.pageNumber = res.pagingData.pageNumber - 1;
        },
        (err: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }

  subscribeNewTm() {
    this.pubNub.TMEncounterRequest.asObservable().subscribe((data: any) => {
      // this.toaster.success('Patient Join Chat' + data);
      let itemIndex = 0;
      this.rows.forEach((item, index) => {
        if (data.tmPatientId === item.tmPatientId && data.status) {
          item['live'] = true;
          item['timer'] = '00:00:00';
          itemIndex = index;
        } else if (data.tmPatientId === item.tmPatientId && !data.status) {
          item['live'] = false;
          item['timer'] = null;
        }
      });
      if (itemIndex) {
        const newObj = this.rows[itemIndex];
        this.rows.splice(itemIndex, 1);
        this.rows.unshift(newObj);
      }
      this.rows = [...this.rows];
    });
    this.pubNub.TMEncounterStatusChanged.asObservable().subscribe(data => {
      this.rows.forEach((item, index) => {
        if (data.encounterId === item.id) {
          item.status = data.status;
        }
      });
    });
  }

  getActivePatients() {
    this.pubNub.getActivePatients().then((response: any[]) => {
      if (!response || !Array.isArray(response)) {
        response = [];
      }
      if (response.length < 1) {
        // receiver.postMessage(obj, '*');
      } else {
        const arr = [];
        response.forEach((data: {patientId: number, time: string}) => {
          let itemIndex = 0;
          this.rows.forEach((item, index) => {
            if (data.patientId  === item.tmPatientId) {
              item['live'] = true;
              itemIndex = index;
              try {
                const startTime = moment(moment.utc(data.time).local().format('YYYY-MM-DD HH:mm:ss'));
                const currentTime = moment(moment().format('YYYY-MM-DD HH:mm:ss'));
                const calculateDuration = moment.duration(currentTime.diff(startTime));
                const hh = calculateDuration.hours().toString().length > 1 ? calculateDuration.hours() : '0' + calculateDuration.hours();
                const mm = calculateDuration.minutes().toString().length > 1 ? calculateDuration.minutes() : '0' + calculateDuration.minutes();
                const ss = calculateDuration.seconds().toString().length > 1 ? calculateDuration.seconds() : '0' + calculateDuration.seconds();
                const tValue = hh + ':' + mm + ':' + ss;
                item['timer'] = tValue;
              } catch (error) {
                this.toaster.error(error);
              }
            }
          });
          if (itemIndex) {
            const newObj = this.rows[itemIndex];
            this.rows.splice(itemIndex, 1);
            this.rows.unshift(newObj);
          }
        });
        // this.incrementTimer();
        this.rows = [...this.rows];
      }
    });
  }

  navigateBack() {
    this.location.back();
  }
  incrementTimer() {
    setInterval(() => {
      const ActivePatients = this.rows.filter(p => p['live'] === true);
      const ArrLengh = ActivePatients.length;
      for (let index = 0; index < ArrLengh; index++) {
        const encounter = ActivePatients[index];
        const time = encounter['timer'];
        if (!time) {
          return;
        }
        const timeArr = time.split(':');
        let hours = +timeArr[0];
        let minutes = +timeArr[1];
        let seconds = +timeArr[2];
        seconds++;
        if (seconds === 60) {
          minutes++;
          seconds = 0;
          if (minutes === 60) {
            hours++;
            minutes = 0;
            if (hours === 24) {
              hours = 0;
            }
          }
        }
        const hh = hours.toString().length > 1 ? hours : '0' + hours.toString();
        const ss = seconds.toString().length > 1 ? seconds : '0' + seconds.toString();
        const mm = minutes.toString().length > 1 ? minutes : '0' + minutes.toString();
        encounter['timer'] = hh + ':' + mm + ':' + ss;
      }
    }, 1000);
  }

  getBillingProvidersByFacilityId() {
    this.facilityService.getBillingProviderByFacilityId(this.facilityId).subscribe(
      (res: any) => {
        this.BIllingProviderList = res;
      },
      (err: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }

  SendTMEncounterToNewPatient(sendTmRequestModal) {
    this.isLoading = true;
    this.sendTmEncounterObj.billingProviderId = this.selectedBP;
    this.subs.sink = this.teleMedicineService
      .SendTMRToNewPatient(this.sendTmEncounterObj)
      .subscribe(
        (res: any) => {
          sendTmRequestModal.hide();
          this.toaster.success('New chat is genrated');
          this.resetSendTmObject();
          this.GetTmEncountersByBillingProviderId();
          this.isLoading = false;
        },
        (err: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  checkExistEmail() {
    this.teleMedicineService
      .CheckTmPatientExistEmail(this.sendTmEncounterObj.email)
      .subscribe((res: any) => {
        this.existEmail = res;
      });
  }
  checkExistPhone() {
    this.teleMedicineService
      .CheckTmPatientExistsPhone(this.sendTmEncounterObj.phoneNumber)
      .subscribe((res: any) => {
        this.existPhone = res;
      });
  }
  resetSendTmObject() {
    this.sendTmEncounterObj = new SentTMEncounterDto();
    this.form.reset();
    this.form.controls.bP.setValue(this.bProviderId);
    this.existEmail = false;
    this.existPhone = false;
    this.selectedPatient = null;
    this.assignBP();
  }
  assignBP() {
    let bp = this.BIllingProviderList.find(bp => bp.id == this.bProviderId)
    if (bp) {
      this.selectedBP = bp.id;
    } else {
      this.selectedBP = null;
    }
  }
  sendTMRToExistingPatient(row: any) {
    let rowData = new SentTMEncounterDto();
    var nameSeprate = row.patientFullName.split(' ', 2);
    rowData.email = row.patientEmail;
    rowData.dob = row.dob;
    rowData.phoneNumber = row.patientPhoneNumber;
    rowData.firstName = nameSeprate[0];
    rowData.lastName = nameSeprate[1];
    rowData.billingProviderId = this.bProviderId;
    this.subs.sink = this.teleMedicineService
      .SendTMRToNewPatient(rowData)
      .subscribe(
        (res) => {
          this.GetTmEncountersByBillingProviderId();
          this.toaster.success('New video chat is genrated');
        },
        (err: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  async GotoCall(data: TmEncounterDto) {
    const isonline = await this.pubNub.invokeSignalrMethod('PingTmPatient', data.tmPatientId);
    if (!isonline) {
      this.toaster.warning('Patient is offline');
      return;
    }
    let url = '';
    //  url = "http://localhost:4200/teleCare/vCall";
    if (environment.production) {
      url = 'https://app.2chealthsolutions.com/teleCare/vCall';
    } else {
      url = `${environment.appUrl}teleCare/vCall`;
    }
    url += `?roomId=${data.id}&isCaller=false&bpId=${data.facilityUserId}&patientId=${data.tmPatientId}`;
    const myW = window.open(url, '_blank');
  }
  getPatientsByFacilityId() {
    this.patientService.GetPatientsByFacilityId(this.facilityId).subscribe(
      (res: any) => {
        this.patientsList = res;
      },
      (err: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  setValues() {
    if (this.selectedPatient) {
      if(this.selectedPatient.dateOfBirth) {
        this.selectedPatient.dateOfBirth = moment(this.selectedPatient.dateOfBirth).format('YYYY-MM-DD');
      }
      this.sendTmEncounterObj.email = this.selectedPatient.email;
      this.sendTmEncounterObj.firstName = this.selectedPatient.firstName;
      this.sendTmEncounterObj.lastName = this.selectedPatient.lastName;
      this.sendTmEncounterObj.dob = this.selectedPatient.dateOfBirth;
      this.sendTmEncounterObj.phoneNumber = this.selectedPatient.primaryPhoneNumber;
      this.bProviderId = this.selectedPatient.billingProviderId;
      if (this.bProviderId) {
        this.assignBP();
      }
    }
  }
}
