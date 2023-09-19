import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {LoginOptions, SDK} from '@ringcentral/sdk';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { RingCentralService } from 'src/app/core/RingCentral/ring-central.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { GetPemDataParams, NewCaseWithDetailDto, PEMCaseDetailDto, PEMCaseDto, PemCaseEditDto, PemCaseQueryType, PemCaseStatus, PemMapNumberDto, SendFaxDto, TransferCaseDetailDto } from 'src/app/model/PatientEngagement/pem.model';
import { RCCallDto } from './rcCallLogs.model';
import { RingCentralMessagesDto } from './ringCentral.model';
import * as moment from 'moment';
import { FilterPatient, PatientDto } from 'src/app/model/Patient/patient.model';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { SecurityService } from 'src/app/core/security/security.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { fromEvent, Subject } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { EventBusService, EventTypes } from 'src/app/core/event-bus.service';

@Component({
  selector: 'app-rc-calls-msg',
  templateUrl: './rc-calls-msg.component.html',
  styleUrls: ['./rc-calls-msg.component.scss']
})
export class RcCallsMsgComponent implements OnInit, AfterViewInit {
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MM-DD-YYYY',
  };
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MM-DD-YYYY'
  };
  messagesData: RingCentralMessagesDto;
  @ViewChild('searchPatientELe12') searchPatient: ElementRef;
  callLogsData: RCCallDto;
  rows = new Array<PatientDto>();

  gettingToken: boolean;
  PemResData: PEMCaseDto[] = [];
  pemCasesByUserId: PEMCaseDto[] = [];
  facilityUserList: CreateFacilityUserDto[];
  caseQueryEnumArr = this.dataService.getEnumAsList(PemCaseQueryType);
  caseStatusEnumArr = this.dataService.getEnumAsList(PemCaseStatus);
  SelectedPemCase = new PEMCaseDto();
  pemCaseEditObj = new PemCaseEditDto();
  sendFaxObj = new SendFaxDto();
  loadingCases: boolean;
  PemCaseQueryTypeEnum = PemCaseQueryType;
  PemCaseStatusEnum = PemCaseStatus;
  openDetailId: number;
  mapNumberObj = new PemMapNumberDto();
  transferCaseDetailObj = new TransferCaseDetailDto();
  filterPatientDto = new FilterPatient();
  facilityId: number;
  isLoading: boolean;
  mappingNumber: boolean;
  selectedPatient = new PatientDto();
  editingPemCase: boolean;
  gettingCasesByUSer: boolean;
  transferingDetails: boolean;
  newCaseWithDetailObj = new NewCaseWithDetailDto();
  pemFilterParamsObj = new GetPemDataParams();
  creatingNEwCase: boolean;
  filesArr = new Array<File>();
  sendingFax: boolean;
  messageText: string;
  sendingMessage: boolean;
  searchWatch = new Subject<string>();
  constructor(private toaster: ToastService, private rcService: RingCentralService, private dataService: DataFilterService,
    private eventBus: EventBusService,
    private securityService: SecurityService, private patientsService: PatientsService, private facilityService: FacilityService) { }

  ngOnInit() {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.RefreshPemData();
    this.getFacilityUsersList();
    // this.GetPemData();
    const button = document.getElementById('sakdjnaslkj');
    // button.addEventListener('pointerup', (event) => {
    //   // Call navigator.bluetooth.requestDevice
    //   this.connectToBlueToothDevice();
    //   this.getDeviceData();
    // });
    this.SearchObserver();
    this.eventBus.on(EventTypes.RCSMSEvent).subscribe((res) => {
      this.RefreshPemData();
    });
  }
  ngAfterViewInit() {
    // fromEvent(this.searchPatient.nativeElement, 'keyup')
    //   .pipe(
    //     map((event: any) => {
    //       return event.target.value;
    //     }),
    //     debounceTime(1000)
    //   )
    //   .subscribe((text: string) => {
    //     this.getFilterPatientsList2();
    // });
  }
  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      this.filterPatientDto.SearchParam = x;
      if (!this.filterPatientDto.SearchParam) {
        // this.filterPatientId = null;
        // this.GetIssuedDevices();
        return;
      }
      this.getFilterPatientsList2();
    });
  }
  RefreshPemData() {
    // this.loadingCases = true;
    // this.rcService.GenerateCasesFromMessageList().subscribe(
    //   (res: any) => {
    //     this.GetPemData();
    //     // this.loadingCases = false;
    //   },
    //   (error: HttpResError) => {
    //     this.loadingCases = false;
    //     this.toaster.error(error.error, error.message);
    //   }
    // );
  }
  GetPemData() {
    const fPDto = new GetPemDataParams();
    for (const filterProp in this.pemFilterParamsObj) {
      if (
        this.pemFilterParamsObj[filterProp] === null ||
        this.pemFilterParamsObj[filterProp] === undefined
      ) {
        this.pemFilterParamsObj[filterProp] = fPDto[filterProp];
        // this.pemFilterParamsObj[filterProp] = 0;
      }
    }
    this.loadingCases = true;
    this.rcService.GetPemData(this.pemFilterParamsObj).subscribe(
      (res: PEMCaseDto[]) => {
        this.PemResData = res;
        this.PemResData.forEach((pemCase) => {
          pemCase.pemCaseDetails.forEach(detail => {
            detail.creationTime = moment.utc(detail.creationTime).local().format('MMM DD YY,\\ h:mm a');
          });
        });
        if (!this.SelectedPemCase?.id && this.PemResData?.length) {
          this.SelectCase(this.PemResData[0])
        } else if (this.SelectedPemCase?.id && this.PemResData?.length) {
          const currentCase = this.PemResData.find(x => x.id == this.SelectedPemCase.id)
          this.SelectCase(currentCase)
        }
        this.loadingCases = false;
      },
      (error: HttpResError) => {
        this.loadingCases = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SelectCase(item: PEMCaseDto) {
    item.pemCaseDetails = item.pemCaseDetails.sort((left, right) => {
      const ssd = moment(left.creationTime, "MMM DD YY,\\ h:mm a").diff(
        moment(right.creationTime, "MMM DD YY,\\ h:mm a")
      );
      return ssd;
    });
    Object.assign(this.SelectedPemCase, item)
    this.ScrollToEnd();
  }
  ResetPemFilterObj() {
    this.pemFilterParamsObj = new GetPemDataParams();
    this.GetPemData();
  }
  EditPemCase(modal: ModalDirective) {
    this.editingPemCase = true;
    this.rcService.EditPemCase(this.pemCaseEditObj).subscribe(
      (res: any) => {
        modal.hide();
        this.RefreshPemData();
        // this.PemResData = res;
        // this.PemResData.forEach((pemCase) => {
        //   pemCase.pemCaseDetails.forEach(detail => {
        //     detail.creationTime = moment.utc(detail.creationTime).local().format('MMM DD YY,\\ h:mm a');
        //   });
        // });
        this.editingPemCase = false;
      },
      (error: HttpResError) => {
        this.editingPemCase = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  onUploadOutput(event) {
    if (event.target.files[0].size > 26214400) {
      this.toaster.warning('file size is more than 25 MB');
      return;
    }
    // this.file = event.target.files[0];
    this.filesArr.push(event.target.files[0]);
    this.sendFaxObj.Files = this.filesArr;
    // this.bhiUploadDocObj.title = this.file.name;
   }
   popFile(doc: any) {
    this.filesArr = this.filesArr.filter(file => {
     return file.name !== doc.name && file.lastModified !== doc.lastModified;
     });
     this.sendFaxObj.Files = this.filesArr;
   }
  SendFax(modal: ModalDirective) {
    this.sendFaxObj.ContentType = 'application/docx';
    this.sendFaxObj.CoverPageText = 'CoverPageText';
    this.sendFaxObj.FileName = 'AnyName';
    this.sendFaxObj.RecipientPhoneNumber = this.SelectedPemCase.phoneNumber;
    // this.sendFaxObj.Files = [file];
    this.sendingFax = true;
    this.rcService.SendFax(this.sendFaxObj).subscribe(
      (res: any) => {
        this.filesArr = [];
        this.sendFaxObj = new SendFaxDto();
        this.toaster.success('Data sent successfully');
        modal.hide();
        this.RefreshPemData();
        // this.PemResData = res;
        // this.PemResData.forEach((pemCase) => {
        //   pemCase.pemCaseDetails.forEach(detail => {
        //     detail.creationTime = moment.utc(detail.creationTime).local().format('MMM DD YY,\\ h:mm a');
        //   });
        // });
        this.sendingFax = false;
      },
      (error: HttpResError) => {
        this.sendingFax = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

  // async SendRCMessage() {
  //   const result = await this.rcService.SendRCMessage(this.SelectedPemCase?.phoneNumber, this.messageText) ;
  //   const caseDetail = new PEMCaseDetailDto()
  //   result['creationTime'] = moment.utc(result['creationTime']).local().format('MMM DD YY,\\ h:mm a');
  //   Object.assign(caseDetail , result)
  //   this.SelectedPemCase?.pemCaseDetails.push(caseDetail)
  //   this.messageText = '';
  // }
  SendRCMessage() {
    this.sendingMessage = true;
    this.rcService.SendMessage(this.SelectedPemCase?.id, this.messageText).subscribe(
      (res: any) => {
        this.toaster.success(`Message sent successfully`)
        this.RefreshPemData();
        // this.PemResData = res;
        // this.PemResData.forEach((pemCase) => {
        //   pemCase.pemCaseDetails.forEach(detail => {
        //     detail.creationTime = moment.utc(detail.creationTime).local().format('MMM DD YY,\\ h:mm a');
        //   });
        // });
        // this.GetPemData();
          this.messageText = '';
        this.sendingMessage = false;
      },
      (error: HttpResError) => {
        this.sendingMessage = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  OpenMessageView(item: PEMCaseDto) {
    this.rcService.sendSms(item.phoneNumber);
  }
  OpenConverSation(item: PEMCaseDto) {
    this.rcService.OpenConverSation(item.phoneNumber);
  }
  OpenCallView(item: PEMCaseDto) {
    this.rcService.startCall(item.phoneNumber);
  }
  OpenMapNumberModal(item: PEMCaseDto, modal: ModalDirective) {
    Object.assign(this.SelectedPemCase, item);
    // this.mapNumberObj.appUserPhoneNumberId = this.SelectedPemCase.phoneNumbers[0].id;
    // this.mapNumberObj.appUserId = '';
    modal.show();
  }
  getFilterPatientsList2() {
    const fPDto = new FilterPatient();
    this.rows = [];
    for (const filterProp in this.filterPatientDto) {
      if (
        this.filterPatientDto[filterProp] === null ||
        this.filterPatientDto[filterProp] === undefined
      ) {
        this.filterPatientDto[filterProp] = fPDto[filterProp];
        // this.FilterPatientDto[filterProp] = 0;
      }
    }
    this.isLoading = true;
    // this.isLoadingPayersList = true;
    this.filterPatientDto.FacilityUserId = 0;
    // FacilityId = 0
    this.filterPatientDto.CareProviderId = 0;
    this.filterPatientDto.FacilityId = this.facilityId;
    this.filterPatientDto.PageNumber = 1;
    this.filterPatientDto.PageSize = 15;

    this.patientsService.getFilterPatientsList2(this.filterPatientDto).subscribe(
      (res: any) => {
        // this.mapNumberObj.appUserId = '';
        this.isLoading = false;
        this.rows = res.patientsList;
      },
      (error: HttpResError) => {
        this.isLoading = false;
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  changePatientPhone(type: number) {
    if (type == 1) {
      // if (this.selectedPatient.secondaryPhoneNumber == this.SelectedPemCase.phoneNumber) {
      //  this.toaster.warning('Same primary number can not be used as secondary number')
      //  return;
      // }

      this.mapNumberObj.primaryPhoneNumber = this.SelectedPemCase.phoneNumber;
      this.mapNumberObj.secondaryPhoneNumber = '';
    }
    if (type == 2) {
      // if (this.selectedPatient.primaryPhoneNumber == this.SelectedPemCase.phoneNumber) {
      //   this.toaster.warning('Same primary number can not be used as secondary number')
      //   return;
      //  }

       this.mapNumberObj.secondaryPhoneNumber = this.SelectedPemCase.phoneNumber;
       this.mapNumberObj.primaryPhoneNumber = '';
    }
  }
  SeperateCallingCode(phoneNumber: string) {
    let callingCode = '+1';
    if (phoneNumber.startsWith('+92')) {
      callingCode = '+92'
    } else if (phoneNumber.startsWith('+1')) {
      callingCode = '+1'
    } {
      var ph = phoneNumber.substring(phoneNumber.length - 10)
      callingCode = phoneNumber.replace(ph, '');
    }
    var withoutCode = phoneNumber.substring(phoneNumber.length - 10)
    return { code: callingCode, phone: withoutCode};
  }
  MapNumberTOUser(modal: ModalDirective) {
    this.mapNumberObj.patientId = this.selectedPatient.id;
    if (this.mapNumberObj.primaryPhoneNumber) {
      this.mapNumberObj.countryCallingCode = this.SeperateCallingCode(this.mapNumberObj.primaryPhoneNumber).code;
      this.mapNumberObj.primaryPhoneNumber = this.SeperateCallingCode(this.mapNumberObj.primaryPhoneNumber).phone;
    }
    if (this.mapNumberObj.secondaryPhoneNumber) {
      this.mapNumberObj.countryCallingCode = this.SeperateCallingCode(this.mapNumberObj.secondaryPhoneNumber).code;
      this.mapNumberObj.secondaryPhoneNumber = this.SeperateCallingCode(this.mapNumberObj.secondaryPhoneNumber).phone;
    }

    this.mappingNumber = true;
    this.rcService.MapUserPhoneNumber(this.mapNumberObj).subscribe(
      (res: any) => {
        modal.hide();
        this.RefreshPemData();
        this.mappingNumber = false;
      },
      (error: HttpResError) => {
        this.mappingNumber = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  MapPhoneNumberModelClosed() {
    this.selectedPatient = new PatientDto();
    this.mapNumberObj = new PemMapNumberDto();
  }
  TransferDetailsToOtherCase(modal: ModalDirective) {
    this.transferingDetails = true;
    this.rcService.TransferDetailsToOtherCase(this.transferCaseDetailObj).subscribe(
      (res: any) => {
        modal.hide();
        this.RefreshPemData();
        this.transferingDetails = false;
      },
      (error: HttpResError) => {
        this.transferingDetails = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  CreateNewCase(modal: ModalDirective) {
    this.creatingNEwCase = true;
    this.rcService.NewCaseWithTransfer(this.newCaseWithDetailObj).subscribe(
      (res: any) => {
        modal.hide();
        this.RefreshPemData();
        this.creatingNEwCase = false;
      },
      (error: HttpResError) => {
        this.creatingNEwCase = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getFacilityUsersList() {
    this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      (res: any) => {
        this.facilityUserList = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetAttachmentDetails(message: PEMCaseDetailDto) {
    // this.rcService.GetAccountRcInfo();
    // return;
    let isExecuted = false;
    if (message.attachments.length > 0) {
      message.attachments.forEach( async attach => {
        if (attach.type === 'Text' || isExecuted) {
          return;
        }
        isExecuted = true;
        const blobContent = await  this.rcService.GetAttachmentDoc(attach.uri);
        const docUrl = window.URL.createObjectURL(blobContent);
        window.open(docUrl);
        // const docUrl = this.rcService.CreateFileUrl(attach.uri);
        // window.open(docUrl);
      });
    }
  }

  // async read_user_calllog() {
  //   try {
  //     const resp = await this.platform.get('/account/~/extension/~/call-log');
  //     const jsonObj = await resp.json();
  //     for (const record of jsonObj.records) {
  //       console.log('Call type: ' + record.type);
  //     }
  //   } catch (e) {
  //     console.log(e.message);
  //   }
  // }
  assignEditPemCaseData(item: PEMCaseDto) {
    this.pemCaseEditObj = new PemCaseEditDto();
    this.pemCaseEditObj.id = item.id;
    this.pemCaseEditObj.userId = item.patientUserId;
    this.pemCaseEditObj.pemCaseStatus = item.pemCaseStatus;
    this.pemCaseEditObj.pemCaseQueryType = item.pemCaseQueryType;
    this.pemCaseEditObj.note = item.note;
    this.pemCaseEditObj.assignedToId = item.assignedToId;
    // this.pemCaseEditObj.closedDate = item.closedDate;
    this.pemCaseEditObj.caseManagerId = item.caseManagerId;
    this.pemCaseEditObj.closedById = item.closedById;
    this.pemCaseEditObj.department = item.department;
    this.pemCaseEditObj.facilityId = this.facilityId;
    // this.pemCaseEditObj.closedDate = moment(this.pemCaseEditObj.closedDate).format('MM-DD-YYYY');
  }
  getPatientDetail() {
    this.selectedPatient = new PatientDto();
    if (!this.SelectedPemCase.patientUserId) {
      return;
    }
    this.patientsService.getPatientDetailByUserId(this.SelectedPemCase.patientUserId).subscribe(
        (res: any) => {
          if (res) {
            this.selectedPatient = res;
          }
        },
        (error: HttpResError) => {
          this.toaster.error(error.error, error.message);
        }
      );
  }
  GetPemCasesByUserId(userId: string) {
    this.gettingCasesByUSer = true;
    this.rcService.GetPemCasesByUserId(userId).subscribe(
      (res: any) => {
        this.gettingCasesByUSer = false;
        if (res) {
          this.pemCasesByUserId = res;
        }
      },
      (error: HttpResError) => {
          this.gettingCasesByUSer = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  TransferCaseDetails(item: PEMCaseDto, modal: ModalDirective) {
    const isSelected = item.pemCaseDetails.find(x => x['selected'] === true);
    if (!isSelected) {
      this.toaster.warning('Please select case detail to transfer');
      return;
    }
    this.transferCaseDetailObj = new TransferCaseDetailDto();
    this.GetPemCasesByUserId(item.patientUserId);
    this.transferCaseDetailObj.ringCentralMessageIds = item.pemCaseDetails.filter(x => x['selected']).map(x => {
        return x.ringCentralId;
    });
    modal.show();
  }
  OpenNewCaseModal(item: PEMCaseDto, modal: ModalDirective) {
    const isSelected = item.pemCaseDetails.find(x => x['selected'] === true);
    if (!isSelected) {
      this.toaster.warning('Please select case detail to create new case');
      return;
    }
    this.newCaseWithDetailObj = new NewCaseWithDetailDto();
    // this.GetPemCasesByUserId(item.patientUserId);
    this.newCaseWithDetailObj.sourceCaseId = item.id;
    this.newCaseWithDetailObj.ringCentralMessageIds = item.pemCaseDetails.filter(x => x['selected']).map(x => {
        return x.ringCentralId;
    });
    modal.show();
  }
  toggleDetailsChanged(item: PEMCaseDto) {

  }
  selectAllDetails(item: PEMCaseDto) {
    item.pemCaseDetails.forEach(obj => {
      obj['selected'] = item['allSelected'];
    });
  }
  selectDetail(item: PEMCaseDto, checked: boolean) {
    if (!checked) {
      item['allSelected'] = false;
    }
    if (checked) {
      item['allSelected'] = !(item.pemCaseDetails.find(x => !x['selected']));
    }
  }
  connectToBlueToothDevice() {
    // navigator['bluetooth'].requestDevice({ filters: [{ services: ['battery_service'] }] })
    navigator['bluetooth'].requestDevice({acceptAllDevices: true})
    .then(device => device.gatt.connect())
    .then(server => {
      // Getting Battery Service…
      return server.getPrimaryService('battery_service');
    })
    .then(service => {
      // Getting Battery Level Characteristic…
      return service.getCharacteristic('battery_level');
    })
    .then(characteristic => {
      // Reading Battery Level…
      return characteristic.readValue();
    })
    .catch(error => { console.error(error); });
    // navigator['bluetooth'].requestDevice({ filters: [{ services: ['0000180a-0000-1000-8000-00805f9b34fb'] }] })
    // // navigator['bluetooth'].requestDevice({acceptAllDevices: true})
    // .then(device => device.gatt.connect())
    // .then(server => {
    //   // Getting Battery Service…
    //   return server.getPrimaryService('0000180a-0000-1000-8000-00805f9b34fb');
    // })
    // .then(service => {
    //   // Getting Battery Level Characteristic…
    //   return service.getCharacteristic('00002a23-0000-1000-8000-00805f9b34fb');
    // })
    // .then(characteristic => {
    //   // Reading Battery Level…
    //  characteristic.readValue().then(data => {
    //    console.log(data);
    //  });
    // })
    // .catch(error => { console.error(error); });
  }
  getDeviceData() {
    navigator['bluetooth'].requestDevice({
      // filters: [...] <- Prefer filters to save energy & show relevant devices.
         acceptAllDevices: true,
        //  optionalServices: optionalServices
        })
     .then(device => {
       console.log('Connecting to GATT Server...');
       return device.gatt.connect();
     })
     .then(server => {
       // Note that we could also get all services that match a specific UUID by
       // passing it to getPrimaryServices().
       console.log('Getting Services...');
       return server.getPrimaryServices();
     })
     .then(services => {
       console.log('Getting Characteristics...');
       let queue = Promise.resolve();
       services.forEach(service => {
         queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
           console.log('> Service: ' + service.uuid);
           characteristics.forEach(characteristic => {
             console.log('>> Characteristic: ' + characteristic.uuid + ' ' +
                 this.getSupportedProperties(characteristic));
           });
         }));
       });
       return queue;
     })
     .catch(error => {
       console.log('Argh! ' + error);
     });
  }
  getSupportedProperties(characteristic) {
    let supportedProperties = [];
    for (const p in characteristic.properties) {
      if (characteristic.properties[p] === true) {
        supportedProperties.push(p.toUpperCase());
      }
    }
    return '[' + supportedProperties.join(', ') + ']';
  }
  ScrollToEnd() {
    var objDiv = document.getElementById("messageListDiv");
    if (objDiv) {
      objDiv.scrollTop = objDiv?.scrollHeight;
    }
    setTimeout(() => {
      var objDiv = document.getElementById("messageListDiv");
      objDiv.scrollTop = objDiv.scrollHeight;

    }, 300);
  }
}
