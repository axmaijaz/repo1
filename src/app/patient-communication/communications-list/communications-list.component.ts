import { Component, Input, OnInit, Output, ViewChild, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { CommunicationService } from 'src/app/core/communication.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { LazyModalDto, PagingData, RCVIewState } from 'src/app/model/AppModels/app.model';
import { FilterPatient, PatientDto } from 'src/app/model/Patient/patient.model';
import { AnonymousPatientCommunicationGroup, ChangeCommunicationFlagsDto, CommunicationMethod, CommunicationSummaryData, CommunicationType, GetCommunicationGroupParam, MarkPatientGroupFlagsDto, PatientCommunicationHistoryDto, PatinetCommunicationGroup } from 'src/app/model/PatientEngagement/communication.model';
import { PEMCaseDetailDto, PemMapNumberDto } from 'src/app/model/PatientEngagement/pem.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import 'src/app/Extensions/stringExtension'
import moment from 'moment';
import { CommunicationDetailComponent } from '../communication-detail/communication-detail.component';
import { RingCentralService } from 'src/app/core/RingCentral/ring-central.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppUiService } from 'src/app/core/app-ui.service';

@Component({
  selector: 'app-communications-list',
  templateUrl: './communications-list.component.html',
  styleUrls: ['./communications-list.component.scss']
})
export class CommunicationsListComponent implements OnInit {
  @Output() selectedGroupChanged  = new EventEmitter<PatinetCommunicationGroup>()
  @Input() insideMain = false;
  @Input() compactMode = false;
  @Input() insideSideNav = false;
  @ViewChild('detailCompRef') detailCompRef: CommunicationDetailComponent;
  fromRoute = false;
  loadingTelephonyData: boolean;
  commGroupsList: PatinetCommunicationGroup[] = [];
  anonymousCommGroupsList: AnonymousPatientCommunicationGroup[] = [];
  commGroupsListPres: PatinetCommunicationGroup[] = [];
  selectedGroup: PatinetCommunicationGroup;
  selectedPatient: PatientDto;
  sendingMessage: boolean;
  messageText: string;
  facilityId: number;
  pagingData: PagingData;
  CommunicationMethod = CommunicationMethod;
  CommunicationType = CommunicationType;
  gettingGroups: boolean;
  summaryData = new CommunicationSummaryData();
  communicationHistoryParam = new GetCommunicationGroupParam();
  AnonymousSelected = false;
  searchStr: string;
  gettingSummary: boolean;
  currentUserId: string;
  mapNumberObj = new PemMapNumberDto();
  selectedPhoneNumber: string;
  mappingNumber: boolean;
  filterPatientDto = new FilterPatient();
  searchWatch = new Subject<string>();
  anonymousGroups: { phoneNo: string; lastCommunication: AnonymousPatientCommunicationGroup ;communications: AnonymousPatientCommunicationGroup[]; }[] = [];
  rows: any[];
  isLoading: boolean;
  mapType: number;
  ChangeCommunicationFlagsObj = new ChangeCommunicationFlagsDto();
  selectedAnonymousGroup: { phoneNo: string; lastCommunication: AnonymousPatientCommunicationGroup; communications: AnonymousPatientCommunicationGroup[]; };
  allSelected: boolean;
  selectedItems: PatinetCommunicationGroup[] = [];

  constructor(private toaster: ToastService, private commService: CommunicationService, private dataService: DataFilterService,
    private eventBus: EventBusService,
    private appUi: AppUiService,
    private cdr: ChangeDetectorRef,
    private securityService: SecurityService, private patientsService: PatientsService, private facilityService: FacilityService, public rcService: RingCentralService,
    private router: Router) { }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.currentUserId = this.securityService.securityObject?.appUserId;
    this.GetCommunicationSummaryData();
    this.GetPatientGroups();
    this.handleIncomingMessages();
    this.SearchObserver();
    this.fromRoute = location.href.includes('communication')
    this.eventBus.on(EventTypes.CommunicationEncounterEdit).subscribe((res) => {
      this.refreshPatientsGroups(res.data.patientId, res.data.patientCommunicationIds);
    });
  }
  refreshPatientsGroups(patientId: any, patientCommunicationIds: any) {
    this.commGroupsList.forEach((patientGroup) => {
      if(patientGroup.lastCommunication.patientId == patientId){
        patientGroup.unAssociatedCommunication = patientGroup.unAssociatedCommunication - patientCommunicationIds?.length
      }
    })
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
  handleIncomingMessages() {
    this.eventBus.on(EventTypes.NewCommunicationMessage).subscribe((res: {source: string, data: [PatientCommunicationHistoryDto]}) => {

      res.data.forEach(message => {
        const chatGroup = this.commGroupsListPres.find(x => x.id == message.patientId)
        if (chatGroup) {
          const rowIndex = this.commGroupsListPres.indexOf(chatGroup);
          chatGroup.lastCommunication = message;
          chatGroup.unread = chatGroup.unread + 1;
          // chatGroup.lastCommunication.shortCode = message?.patientName?.getShortCode();
          const newObj = this.commGroupsListPres[rowIndex];
          this.commGroupsListPres.splice(rowIndex, 1);
          this.commGroupsListPres.unshift(newObj);
        }
        if (!chatGroup) {
          const newGroup = new PatinetCommunicationGroup();
          newGroup.id = message.patientId;
          newGroup.name = message.patientName;
          newGroup.lastCommunication = message;
          newGroup.unread = 1;
          newGroup.lastCommunication.shortCode = message?.patientName?.getShortCode();
          this.commGroupsListPres.unshift(newGroup);
        }
        this.GetCommunicationSummaryData();
        this.cdr.detectChanges();
        if (message.senderUserId !== this.currentUserId) {
          this.PlayAudio(2)
        }

      })
      this.SearchChat()
    });
  }

  selectAllDetails() {
    this.commGroupsList.forEach(obj => {
      obj.selected = this.allSelected;
    });
    this.selectedItems = this.commGroupsList.filter(x => x.selected)
  }
  selectDetail() {
    this.selectedItems = this.commGroupsList.filter(x => x.selected)
  }

  MarkPatientGroupFlags(group: PatinetCommunicationGroup) {
    const groupFlag = new MarkPatientGroupFlagsDto();
    groupFlag.patientId = group.id
    groupFlag.following = group.following
    groupFlag.critical = group.critical
    this.commService.MarkPatientGroupFlags(groupFlag).subscribe(
      (res) => {
        this.GetCommunicationSummaryData();
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }

  ConfirmChangeFlag(action: string) {
    // const modalDto = new LazyModalDto();
    // modalDto.Title = 'Communication Flag';
    // modalDto.Text =
    //   `Do you want to mark selected communications as ${action}?`;
    // modalDto.callBack = this.ChangePatientsCommunicationFlags;
    // // modalDto.rejectCallBack = this.rejectCallBack;
    // modalDto.data = action;
    // this.appUi.openLazyConfrimModal(modalDto);
    this.ChangePatientsCommunicationFlags(action);
  }

  ChangePatientsCommunicationFlags = (action: string) => {
    this.ChangeCommunicationFlagsObj = new ChangeCommunicationFlagsDto();
    this.ChangeCommunicationFlagsObj.patientUserIds = this.selectedItems.map(x => x.lastCommunication?.patientUserId);
    this.ChangeCommunicationFlagsObj[action] = true
    this.commService.ChangePatientsCommunicationFlags(this.ChangeCommunicationFlagsObj).subscribe(
      (res: number[]) => {
        this.toaster.success(`Communication flag applied`)
        this.allSelected = false;
        this.commGroupsList.forEach(y => {
          if (res.some(x => x == y.lastCommunication?.patientId) && action == 'unRead' && !y.unread ) {
            y.unread = 1
          }
          if (res.some(x => x == y.lastCommunication?.patientId) && action == 'critical') {
            y.critical = true
          }
          if (res.some(x => x == y.lastCommunication?.patientId) && action == 'following') {
            y.following = true
          }
        })
        this.commGroupsListPres.forEach(y => {
          if (res.some(x => x == y.lastCommunication?.patientId) && action == 'unRead' && !y.unread ) {
            y.unread = 1
          }
          if (res.some(x => x == y.lastCommunication?.patientId) && action == 'critical') {
            y.critical = true
          }
          if (res.some(x => x == y.lastCommunication?.patientId) && action == 'following') {
            y.following = true
          }
        })
        this.selectAllDetails();
        this.GetCommunicationSummaryData();
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetCommunicationSummaryData() {
    this.gettingSummary = true;
    this.selectedPatient = new PatientDto();

    this.commService.GetCommunicationSummaryData(this.facilityId).subscribe(
      (res: CommunicationSummaryData) => {
        this.gettingSummary = false;
        this.summaryData = res

      },
      (error: HttpResError) => {
        this.gettingSummary = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  ApplySorting(sortBy: string) {
    if (this.communicationHistoryParam.SortBy == sortBy && this.communicationHistoryParam.SortOrder == 1) {
      this.communicationHistoryParam.SortBy = ''
    } else if(this.communicationHistoryParam.SortBy != sortBy) {
      this.communicationHistoryParam.SortBy = sortBy;
      this.communicationHistoryParam.SortOrder = 0
    } else {
      this.communicationHistoryParam.SortBy = sortBy;
      this.communicationHistoryParam.SortOrder = 1
    }
    this.GetPatientGroups()
  }
  ResetGroupsData() {
    this.AnonymousSelected = false;
    this.communicationHistoryParam = new GetCommunicationGroupParam();
    this.GetPatientGroups()
  }
  GetPatientGroups() {
    this.gettingGroups = true;
    this.selectedPatient = new PatientDto();
    this.commGroupsListPres = []
    this.commGroupsList = []
    this.selectedItems = []
    this.allSelected = false
    this.commService.GetPatientGroups(this.facilityId, this.communicationHistoryParam).subscribe(
      (res: {pagingData: PagingData, results: PatinetCommunicationGroup[]}) => {
        this.gettingGroups = false;

        if (res.results?.length) {
          this.commGroupsList = res.results;
          this.commGroupsList.forEach(item => {
            if (item.lastCommunication) {
              item.lastCommunication.shortCode = item.lastCommunication?.patientName?.getShortCode();
              item.lastCommunication.timeStamp = moment.utc(item.lastCommunication.timeStamp).local().format('MMM DD,\\ hh:mm a');
            }
          });

          Object.assign(this.commGroupsListPres, this.commGroupsList);
        }
        this.pagingData = res.pagingData;
      },
      (error: HttpResError) => {
        this.gettingGroups = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SummaryFilterChanged(type: string) {
    if (type == 'UnRead') {
      this.communicationHistoryParam.UnRead = !this.communicationHistoryParam.UnRead
    }
    if (type == 'Critical') {
      this.communicationHistoryParam.Critical = !this.communicationHistoryParam.Critical
    }
    if (type == 'Following') {
      this.communicationHistoryParam.Following = !this.communicationHistoryParam.Following
    }
    this.AnonymousSelected = false;
    this.GetPatientGroups();
  }
  SearchChat() {
    Object.assign(this.commGroupsList, this.commGroupsListPres);
    if (this.searchStr) {
      this.commGroupsList = this.commGroupsListPres.filter(x =>
        x.lastCommunication.patientName?.toLocaleLowerCase().includes(this.searchStr?.toLocaleLowerCase()) ||
        x.lastCommunication.senderName?.toLocaleLowerCase().includes(this.searchStr?.toLocaleLowerCase())
        )
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
      if (type == 2) {
        const msgAudio = new Audio()
        msgAudio.src = '../../assets/sounds/readmsg.MP3';
        msgAudio.load();
        msgAudio.play();
      }
    } catch (error) {
      console.log(error)
    }
  }
  AnonymousSelectionChanged() {
    this.AnonymousSelected = !this.AnonymousSelected
    if(this.AnonymousSelected){
      this.GetAnonymousMessages();
    }
  }
  DisplayListView() {
    this.compactMode = false;
    this.selectedGroup = null;
    this.selectedGroupChanged.emit(null);
  }

  LoadGroupDetails(item: PatinetCommunicationGroup) {
    item.unread = 0;
    this.commGroupsListPres.forEach(x => {
      if (x.id == item.id) {
        x.unread = 0
      }
    })
    this.compactMode = true
    this.selectedGroup = item
    this.detailCompRef?.loadGroupData(item)
    this.selectedGroupChanged.emit(item);
    setTimeout(() => {
      this.GetCommunicationSummaryData();
    }, 2500);
  }
  GetAnonymousMessages(){
    this.commService.GetAnonymousMessages(this.facilityId).subscribe((res: AnonymousPatientCommunicationGroup[]) => {
      this.anonymousCommGroupsList = res;
      this.anonymousCommGroupsList.forEach((chat) => {
        chat.creationTime =  moment.utc(chat.creationTime).local().format('MMM DD,\\ hh:mm a');
      })
      const anonymousGroups = this.dataService.groupByProp(res, 'phoneNo') as { key: string, value: AnonymousPatientCommunicationGroup[] }[]
      const newList = []
      anonymousGroups.forEach((group) => {
        newList.push({
          phoneNo: group.value[0].phoneNo,
          lastCommunication: group.value[0],
          communications: group.value
        })
      });
      this.anonymousGroups = [...newList]

    },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      })
  }
  selectAnonymousGroup(group: { phoneNo: string; lastCommunication: AnonymousPatientCommunicationGroup ;communications: AnonymousPatientCommunicationGroup[]; }) {
    this.selectedPhoneNumber = group?.lastCommunication?.phoneNo;
    this.selectedAnonymousGroup = group;
  }
  MapPhoneNumberModelClosed(){
    this.mapType = null;
    this.selectedPatient = new PatientDto();
    this.mapNumberObj = new PemMapNumberDto();
  }
  MapNumberTOUser(modal: ModalDirective) {
    this.mapNumberObj.patientId = this.selectedPatient.id;
    if (this.mapNumberObj.primaryPhoneNumber) {
      this.mapNumberObj.countryCallingCode = this.SeparateCallingCode(this.mapNumberObj.primaryPhoneNumber).code;
      this.mapNumberObj.primaryPhoneNumber = this.SeparateCallingCode(this.mapNumberObj.primaryPhoneNumber).phone;
    }
    if (this.mapNumberObj.secondaryPhoneNumber) {
      this.mapNumberObj.countryCallingCode = this.SeparateCallingCode(this.mapNumberObj.secondaryPhoneNumber).code;
      this.mapNumberObj.secondaryPhoneNumber = this.SeparateCallingCode(this.mapNumberObj.secondaryPhoneNumber).phone;
    }

    this.mappingNumber = true;
    this.commService.MapPatientPhoneNumber(this.mapNumberObj).subscribe(
      (res: any) => {
        modal.hide();
        this.mappingNumber = false;
      },
      (error: HttpResError) => {
        this.mappingNumber = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SeparateCallingCode(phoneNumber: string) {
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

      this.mapNumberObj.primaryPhoneNumber = this.selectedPhoneNumber.toString();
      this.mapNumberObj.secondaryPhoneNumber = '';
    }
    if (type == 2) {
      // if (this.selectedPatient.primaryPhoneNumber == this.SelectedPemCase.phoneNumber) {
      //   this.toaster.warning('Same primary number can not be used as secondary number')
      //   return;
      //  }

       this.mapNumberObj.secondaryPhoneNumber = this.selectedPhoneNumber.toString();
       this.mapNumberObj.primaryPhoneNumber = '';
    }
    this.mapType = type;
  }
  RequestRcViewStateChange() {
    this.rcService.RequestRcViewStateChange(RCVIewState.expand);
  }
  OpenPatientDetail(item: PatinetCommunicationGroup) {
    this.router.navigateByUrl("/admin/patient/" + item.id + "/summary");
  }

}
