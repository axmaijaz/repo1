import { DataFilterService } from 'src/app/core/data-filter.service';
import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from 'src/app/core/security/security.service';
import { PubnubChatService } from 'src/app/core/pubnub-chat.service';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import {
  ChatDto,
  MsgNotification,
  AddChatDto,
  ChatGroupDto,
  AVCallDto,
  CallActionEnum,
  SearchedChatUsersDto,
  ChatUserDto,
  PublishConfirmationDto,
  ChatHistoryResponseDto,
  ChatParticipientDto,
  ChatTypeEnum,
  ChatViewType
} from 'src/app/model/chat/chat.model';
import { takeWhile, debounceTime, map } from 'rxjs/operators';
import { Location } from '@angular/common';
import { TwocChatService } from 'src/app/core/2c-chat.service';
import { EventBusService, EventTypes, EmitEvent } from 'src/app/core/event-bus.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { AppUiService } from 'src/app/core/app-ui.service';
import { VideoCallingService } from 'src/app/core/video-calling.service';
import { Subject, fromEvent } from 'rxjs';
import { HttpResError } from 'src/app/model/common/http-response-error';
import moment from 'moment';
import { AwsService } from 'src/app/core/aws/aws.service';
import { AudioRecorderService, AudioRecordingIntervalState, ErrorCase, OutputFormat } from 'src/app/core/Tools/audio-recorder.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { environment } from 'src/environments/environment';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { PatientsService } from 'src/app/core/Patient/patients.service';
@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.scss']
})
export class MessagingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('chatModal') chatModal: ModalDirective;
  @ViewChild('SelectUserforCallModal') SelectUserforCallModal: ModalDirective;
  userListTobSelectForVideo = new Array<ChatUserDto>();

  public scrollbarOptions = {
    axis: 'y',
    theme: 'dark-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: true
  };

  viewMode: ChatViewType = ChatViewType.Chat;
  ChatViewTypeEnum = ChatViewType;
  UserTypeForSearchChat = 1;
  page = 1;
  id = -1;
  showSearchSearchUserView = false;
  readMsgaudio = new Audio();
  msgaudio = new Audio();
  currentUserAppId = '';
  searchParam = '';
  searchGroupsTitle = '';
  activeGroupTypeCheck = 'currentFacility';
  securityObject: AppUserAuth;
  UserList = new Array<ChatGroupDto>();
  HistoryList = new Array<ChatDto>();
  ActiveChatGroup = new ChatGroupDto();
  aLive = true;
  LoadingchatHistory: boolean;
  LoadingUserList: boolean;
  messageText: string;
  IsPatientLogin: any;
  Show2cChatMOdal = false;
  ShowChatList: boolean;
  facilityId: number;
  searchWatch = new Subject<string>();
  searchedChatUserList = new Array<SearchedChatUsersDto>();
  searchingChatUsers: boolean;
  enableSelection: boolean;
  ActiveChatGroupParticipants: ChatParticipientDto[] = [];
  unreadChats: ChatGroupDto[];
  isUnreadChats= false;
  allChats: ChatGroupDto[];

  ChatTypeEnumObj = ChatTypeEnum;
  audioRecordingObj = {isRecording: false, paused: true, seconds: 0,timer: '', interval: null, pitchArr: [],
  milliSeconds: 0, milliSecondTime: null
  };
  TelephonyPatinetId: string;
  selectedPatient: PatientDto;
  constructor(
    private router: Router,
    private securityService: SecurityService,
    private chatService: PubnubChatService,
    private TwocHatService: TwocChatService,
    private callingService: VideoCallingService,
    private toaster: ToastService,
    private appui: AppUiService,
    private filterDataService: DataFilterService,
    public location: Location,
    public awsService: AwsService,
    private audioRecordingService: AudioRecorderService,
    private sanitizer: DomSanitizer,
    private patientsService: PatientsService,
    private eventBus: EventBusService
  ) {
    this.securityObject = securityService.securityObject;
    this.currentUserAppId = this.securityObject.appUserId;
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    const top = event.target.scrollTop;
    if (top === 0) {
      this.loadMoreMessages();
    }
  }
  ngOnInit() {
     this.IsPatientLogin = this.securityObject.userType;
     this.securityObject = this.securityService.securityObject;
    this.currentUserAppId = this.securityObject.appUserId;
    this.chatSubscribe();
    this.getChatList();
    this.SearchObserver();
    this.securityService.getClaim('FacilityId')
      ? (this.facilityId = +this.securityService.getClaim('FacilityId')
          .claimValue)
      : (this.facilityId = 0);
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.audioRecordingService.recorderError.subscribe((x: ErrorCase) => {
      this.toaster.warning(`${ErrorCase[x]}`)
    })
    this.audioRecordingService.pitchEmitter.subscribe((x: number) => {
      if (!this.audioRecordingObj.isRecording || this.audioRecordingObj.paused) {
        return;
      }
      // console.log(x)
      var height = (x / 100);
      if (height > 20) {
        height = 20;
      }
      if (!height) {
        height = 2
      }
      const ch = height.toFixed();
      this.audioRecordingObj.pitchArr.push(ch);
    })
    this.eventBus
      .on(EventTypes.Open2cChatModal)
      .subscribe((res: any | ChatGroupDto) => {
        this.TelephonyPatinetId = null;
        this.viewMode = ChatViewType.Chat
        this.appui.chatShown = true;
        this.Show2cChatMOdal = true;
        this.securityObject = this.securityService.securityObject;
        this.currentUserAppId = this.securityObject.appUserId;
        if (this.securityObject.userType === UserType.Patient) {
          this.ShowChatList = false;
          this.page = 1;
          this.HistoryList = [];
          if (this.UserList.length > 0) {
            this.ActiveChatGroup = this.UserList[0];
            this.getuserChatHistory(
              this.ActiveChatGroup.id,
              this.page
            );
          } else {
            this.ActiveChatGroup = new ChatGroupDto();
            this.getPatientChatGroup();
          }
          this.chatModal.config = {
            backdrop: false,
            ignoreBackdropClick: false
          };
          // this.chatModal.show();
          return;
        }
        this.ShowChatList = true;
        if (res) {
          this.ActiveChatGroup = res;
          // this.UserList.find(x => x.id === res.id).unreadMsgCount = 0;
          this.ShowChatList = false;
          this.getuserChatHistory(this.ActiveChatGroup.id, 1);
          if (res.viewMode) {
            setTimeout(() => {
              this.viewMode = res.viewMode
            }, 500);
          }
        }
        this.chatModal.config = { backdrop: false, ignoreBackdropClick: false };
        // this.chatModal.show();
      });
      this.eventBus
      .on(EventTypes.Close2cChatModal)
      .subscribe((res: any) => {
        this.appui.chatShown = false;
        this.resetActiveCHatGroup();
        this.getChatList();
        this.searchGroupsTitle=''
      })
      this.filterDataService.listenChangesinArray(this.UserList, this.GroupsDataChanged);
  }
  ngOnDestroy(): void {
    this.aLive = false;
    this.abortRecording();
  }
  ngAfterViewInit(): void {
    this.checkForPageLoadActions();
  }
  checkForPageLoadActions() {
    if(this.appui.pageLoadActions?.includes('ChatWindow')) {
      const patientUserId = this.appui.pageLoadActions.split('VV')[1];
      this.getChatGroup(patientUserId)
    }
  }
  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      if (x) {
        this.searchChatUsers(x);
      }
    });
    // fromEvent(this.chatUSerSearchInput.nativeElement, 'keyup')
    //   .pipe(
    //     // get value
    //     map((event: any) => {
    //       return event.target.value;
    //     }),
    //     debounceTime(2000)
    //     // subscription for response
    //   )
    //   .subscribe((text: string) => {
    //     this.searchChatUsers(text);
    //   });
  }

  GroupsDataChanged = () => {
    console.log('User List Data changed');
  }
  getPatientChatGroup() {
    this.chatService
      .getChatGroupByPatientId(this.securityObject.appUserId)
      .subscribe((res: ChatGroupDto) => {
        this.ActiveChatGroup = res;
        this.getuserChatHistory(this.ActiveChatGroup.id, this.page);
        this.UserList.push(this.ActiveChatGroup);
        this.UserList = [...this.UserList];
      });
  }
  chatSubscribe() {
    this.readMsgaudio.src = '../../../assets/sounds/readmsg.MP3';
    this.readMsgaudio.load();
    this.readMsgaudio.muted = true;
    this.msgaudio.src = '../../../assets/sounds/pullout.MP3';
    this.msgaudio.load();
    this.msgaudio.muted = true;
    this.chatService.MessageViewdSubject.asObservable()
      .pipe(takeWhile(() => this.aLive))
      .subscribe((msgResp: PublishConfirmationDto) => {
        // this.latestMessageSent.emit(msgResp);
        if (msgResp.chatGroupId === this.ActiveChatGroup.id) {
          this.ActiveChatGroupParticipants = [];
          msgResp.participients.forEach((x) => {
            const newPart = new ChatParticipientDto();
            newPart.userId = x.UserId;
            newPart.email = x.Email;
            newPart.fullName = x.FullName;
            newPart.shortName = x.ShortName;
            newPart.readIndex = x.ReadIndex;
            this.ActiveChatGroupParticipants.push(newPart);
          });
          this.FillChatReadStates();
        }
      });
    this.chatService.messageSubject
      .asObservable()
      .pipe(takeWhile(() => this.aLive))
      .subscribe((msg: ChatDto) => {
        if (msg.channelName === this.ActiveChatGroup.channelName) {
          msg.timeStamp = new Date(msg.timeStamp);
          if (msg.chatType == ChatTypeEnum.Audio) {
            if (!msg.linkUrl.includes('http')) {
              msg.linkUrl = this.awsService.GetSignedUrl(msg.linkUrl, environment.bucketMediaAws)
            }
          }
          if (msg.data) {
            msg.timeLine = {}
            const seconds = ((+msg.data) % 1000) > 0 ? (+((+msg.data) / 1000)) : ((+msg.data) / 1000);
            // const totalTime = moment("2022-01-01").startOf('day').seconds(seconds).format('mm:ss');

            msg.timeLine['displayTime'] = moment("2022-01-01").startOf('day').seconds(seconds).format('mm:ss');
          }
          this.HistoryList.push(msg);
          this.HistoryList = [...this.HistoryList];
          // this.playSound();
          setTimeout(() => {
            this.scrollToBottom();
            this.readMsgaudio.muted = false;
            this.readMsgaudio.play();
          }, 500);
          // this.chatService
          //   .MarkChatGroupAsRead(this.ActiveChatGroup.id)
          //   .subscribe(d => {});
          this.chatService.MarkChatGroupViewed(this.ActiveChatGroup.id, this.securityObject.appUserId);
        } else {
          let find = true;
          let msgIndex = 0;
          for (let i = 0; i < this.UserList.length; i++) {
            if (this.UserList[i].channelName === msg.channelName) {
              this.UserList[i].unreadMsgCount =
                this.UserList[i].unreadMsgCount + 1;
              find = false;
              msgIndex = i;
            }
          }
          if (!find) {
            const newObj = this.UserList[msgIndex];
            this.UserList.splice(msgIndex, 1);
            newObj.lastMessage = msg.message;
            newObj.lastMessageTime = moment().format('MMM DD, YYYY, h:mm a');
            this.UserList.unshift(newObj);
          }
          if (find) {
            const newChatUser = new ChatGroupDto();
            newChatUser.title = msg.senderName;
            newChatUser.lastMessage = msg.message;
            newChatUser.unreadMsgCount = 1;
            newChatUser.lastMessageTime = moment().format('MMM DD, YYYY, h:mm a');
            this.UserList.unshift(newChatUser);
          }
          this.UserList = [...this.UserList];
        }
      });
  }
  sendMessagebefore(messageText){

    if(messageText === undefined || messageText.trim() === '' ){
      console.log(messageText ,"hello")
    }else{
      this.sendMessage();
    }
  }
  sendMessage(chatType = ChatTypeEnum.Text, linkUrl = '', data = '') {
    const chatDto = new AddChatDto();
    chatDto.senderUserId = this.currentUserAppId;
    chatDto.chatGroupId = this.ActiveChatGroup.id;
    chatDto.message = linkUrl ? 'audio' : this.messageText;
    chatDto.linkUrl = linkUrl;
    chatDto.chatType = chatType;
    chatDto.data = data;
    this.HistoryList.push({
      senderUserId: this.currentUserAppId,
      id: null,
      timeToken: '',
      chatType: chatType,
      timeStamp: new Date().toUTCString(),
      viewedByAll: false,
      sentToAll: false,
      selected: false,
      linkUrl: linkUrl,
      channelName: this.ActiveChatGroup.channelName,
      message: linkUrl ? 'audio' : this.messageText,
      chatGroupId: this.ActiveChatGroup.id,
      senderName: '',
      data: data,
      participients: [],
      timeLine: {}
    });
    this.HistoryList = [...this.HistoryList];
    this.messageText = '';
    this.chatService.sendMessage(chatDto).subscribe((res: ChatDto) => {
      res.timeStamp = new Date(res.timeStamp);
      res.senderName = res.senderName || this.securityObject.fullName;
      if (res.chatType == ChatTypeEnum.Audio) {
        if (!res.linkUrl.includes('http')) {
          res.linkUrl = this.awsService.GetSignedUrl(res.linkUrl, environment.bucketMediaAws)
        }
      }
      if (res.data) {
        res.timeLine = {}
        const seconds = ((+res.data) % 1000) > 0 ? (+((+res.data) / 1000)) : ((+res.data) / 1000);
        const totalTime = moment("2022-01-01").startOf('day').seconds(seconds).format('mm:ss');

        res.timeLine['displayTime'] = moment("2022-01-01").startOf('day').seconds(seconds).format('mm:ss');
      }
      this.HistoryList.splice(
        this.HistoryList.findIndex(mg => mg.id === null),
        1,
        res
      );
      this.HistoryList = [...this.HistoryList];
      this.msgaudio.muted = false;
      this.msgaudio.play();
      this.scrollToBottom();
    });
  }
  getChatList() {
    this.LoadingUserList = true;
    // this.chatService.getListOfChats(this.currentUserAppId).subscribe(
    this.TwocHatService.GetChatGroupsByUserId(this.currentUserAppId).subscribe(
      chats => {
        this.unreadChats = chats.filter((chat) => chat.unreadMsgCount > 0);
        this.LoadingUserList = false;
        this.allChats = chats;
        this.UserList = chats;
        this.UserList.forEach(user => {
         user.lastMessageTime = moment.utc(user.lastMessageTime).local().format('MMM DD, YYYY, h:mm a');
        });
        if (this.UserList.length > 0) {
          // this.ActiveChatGroup = this.UserList[0];
          // this.getuserChatHistory(this.ActiveChatGroup.channelName, this.page);
        } else {
          this.ActiveChatGroup = new ChatGroupDto();
        }
      },
      err => {
        this.LoadingUserList = false;
      }
      );
    }
  resetActiveCHatGroup() {
    this.TelephonyPatinetId = ''
    this.ActiveChatGroup = new ChatGroupDto();
  }
  fileSending($event) {
    const file = $event.target.files[0];
    // name
    if (file) {
      this.id = this.id - 1;
      const chatDto = new AddChatDto();
      chatDto.senderUserId = this.currentUserAppId;
      chatDto.chatGroupId = this.ActiveChatGroup.id;
      chatDto.message = 'Please Wait While the File is Being Sent ...';
      this.HistoryList.push({
        senderUserId: chatDto.senderUserId,
        id: this.id,
        timeToken: '',
        chatType: ChatTypeEnum.Text,
        timeStamp: new Date().toUTCString(),
        viewedByAll: false,
        sentToAll: false,
        selected: false,
        linkUrl: '',
        data: '',
        chatGroupId: this.ActiveChatGroup.id,
        channelName: this.ActiveChatGroup.channelName,
        senderName: this.securityService.securityObject.fullName,
        message: chatDto.message,
        participients: [],
        timeLine: {}
      });
      this.HistoryList = [...this.HistoryList];
      const filename = file.name;
      this.chatService
        .sendFile(
          this.currentUserAppId,
          this.ActiveChatGroup.channelName,
          file,
          filename
        )
        .subscribe((res: any) => {
          const index = this.HistoryList.findIndex(x => x.id === this.id);
          res.timeStamp = new Date(res.timeStamp);
          this.HistoryList[index] = res;
        });
    }
  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
  loadMoreMessages() {
    if (this.HistoryList.length > 0) {
      this.page = this.page + 1;
      this.getuserChatHistory(this.ActiveChatGroup.id, this.page);
    }
  }
  getuserChatHistory(chatGroupId: number, pageNO?: number) {
    if (!pageNO || pageNO === 1) {
      pageNO = 1;
      this.page = 1;
      this.HistoryList = new Array<ChatDto>();
    }
    if (this.ActiveChatGroup.unreadMsgCount > 0) {
      this.RemoveChatNotification(this.ActiveChatGroup.id);
      this.UserList.forEach(x => {
        if (x.id === this.ActiveChatGroup.id) {
          x.unreadMsgCount = 0;
        }
      });
    }

    this.FillPatientIdForTelephony();
    this.FillPatientIfGroupIsForPatient();
    // this.chatGroupChannelName = channelName;
    this.LoadingchatHistory = true;
    this.chatService
      .getChatHistory(this.currentUserAppId, this.ActiveChatGroup.id, pageNO)
      .pipe(takeWhile(() => this.aLive))
      .subscribe(
        (responseObj: ChatHistoryResponseDto) => {
          const his = responseObj.chats;
          this.ActiveChatGroupParticipants = responseObj.participients;
          his.map(h => (h.timeStamp = new Date(h.timeStamp + 'Z')));
          his.forEach(item => {
            this.HistoryList.unshift(item);
          });
          // this.HistoryList.sort((a, b) => {
          //   a.timeStamp = new Date(a.timeStamp);
          //   b.timeStamp = new Date(b.timeStamp);
          //   return a.timeStamp - b.timeStamp;
          // });
          this.HistoryList.forEach(a => (a.timeStamp = new Date(a.timeStamp)));
          this.FillChatReadStates();
          if (this.page === 1) {
            setTimeout(() => {
              this.scrollToBottom();
            }, 600);
          } else if (this.page > 1) {
            setTimeout(() => {
              this.myScrollContainer.nativeElement.scrollTop = 15;
            }, 600);
          }
          this.LoadingchatHistory = false;
          this.fillAudioUrls();
        },
        (err: HttpResError) => {
          this.LoadingchatHistory = false;
          this.toaster.error(err.error, err.message);
        }
      );
    // this.MarkChatGroupAsRead(this.ActiveChatGroup);
    this.getLastViewedList(this.ActiveChatGroup);
  }
  FillPatientIfGroupIsForPatient() {
    if (this.page !== 1 && !this.ActiveChatGroup || !this.ActiveChatGroup.participants?.length) {
      return;
    }
    const participent = this.ActiveChatGroup.participants.find(x => x.userType == UserType.Patient);
    this.selectedPatient = new PatientDto();

    this.patientsService.getPatientDetailByUserId(participent.appUserId).subscribe(
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
  FillPatientIdForTelephony() {
    this.TelephonyPatinetId = null;
    if (this.page === 1) {
      this.viewMode = ChatViewType.Chat;
    }
    const TelephonyCommunication = this.securityService.getClaim('TelephonyCommunication')?.claimValue;
    if (!TelephonyCommunication) {
      this.viewMode = ChatViewType.Chat;
      return;
    }
    if (this.page !== 1 && !this.ActiveChatGroup || !this.ActiveChatGroup.participants?.length) {
      return;
    }
    const participent = this.ActiveChatGroup.participants.find(x => x.userType == UserType.Patient);
    if (participent) {
      this.TelephonyPatinetId = participent.appUserId;
    }
  }
  fillAudioUrls() {
    this.HistoryList.forEach(x => {
      if (x.chatType == ChatTypeEnum.Audio) {
        // this.awsService.getPublicPath(x.linkUrl).subscribe(x => {
        //   console.log(x)
        // })
        if (!x.linkUrl.includes('http')) {
          x.linkUrl = this.awsService.GetSignedUrl(x.linkUrl, environment.bucketMediaAws)

        }
        if (x.data) {
          x.timeLine = {}
          const seconds = ((+x.data) % 1000) > 0 ? (+((+x.data) / 1000)) : ((+x.data) / 1000);
          x.timeLine['displayTime'] = moment("2022-01-01").startOf('day').seconds(seconds).format('mm:ss');
        }
        // console.log(x.linkUrl)
      }
    })
  }
  FillChatReadStates() {
    this.HistoryList.forEach(x => {
      x.participients = [];
    });
    if (this.ActiveChatGroupParticipants && this.ActiveChatGroupParticipants.length) {
      this.ActiveChatGroupParticipants.forEach(part => {
        const messageInfo = this.HistoryList.find(x => x.id === part.readIndex);
        if (messageInfo) {
          messageInfo.participients.push(part);
        }
      });
    }
    this.HistoryList = [...this.HistoryList];
  }
  RemoveChatNotification(id: number) {
    const event = new EmitEvent();
    event.name = EventTypes.RemoveChatNotif;
    event.value = id;
    this.eventBus.emit(event);
  }
  identify(index?, message?) {
    // if (this.page > 1) {
    //   setTimeout(() => {
    //     this.myScrollContainer.nativeElement.scrollTop = 1;
    //   }, 2000);
    // }
  }

  goBack() {
    this.location.back();
  }
  selectUserForCall(chatData: ChatGroupDto) {
    if (this.securityService.securityObject.userType === 5) {
      chatData.participants = chatData.participants.filter(x => {
        return x.userType === 1;
      });
    }
    if (chatData.participants.length <= 2) {
      const participent = chatData.participants.find(
        itm => itm.userName !== this.securityObject.userName
      );
      this.makeCall(participent);
    } else {
      const participents = chatData.participants.filter(
        itm => itm.userName !== this.securityObject.userName
      );
      this.userListTobSelectForVideo = participents;
      this.SelectUserforCallModal.show();
    }
  }
  makeCall(participent: ChatUserDto) {
    const avCallDto: AVCallDto = {
      callerName: this.securityObject.fullName,
      callerUserName: this.securityObject.userName,
      participentName: participent.name,
      participentUserName: participent.userName,
      roomId: this.securityObject.fullName,
      actionType: CallActionEnum.AVCall
    };
    this.callingService.makeNewCall(avCallDto);
  }
  searchChatUsers(searchStr: string) {
    if (!searchStr) {
      searchStr = '';
    }
    this.searchingChatUsers = true;
    this.TwocHatService.SearchChatUsers(
      this.securityObject.appUserId,
      this.facilityId,
      searchStr,
      this.UserTypeForSearchChat
    ).subscribe(
      res => {
        this.searchingChatUsers = false;
        this.searchedChatUserList = res;
      },
      err => {
        this.searchingChatUsers = false;
        this.toaster.show('error searching data');
      }
    );
  }
  changed(searchStr: string) {
    if (!searchStr) {
      this.searchedChatUserList = new Array<SearchedChatUsersDto>();
      return;
    }
    this.searchWatch.next(searchStr);
  }
  getChatGroup(userId: string) {
    this.LoadingchatHistory = true;
    this.searchedChatUserList = new Array<SearchedChatUsersDto>();
    this.searchParam = '';
    this.TwocHatService.GetPersonalChatGroup(
      this.securityService.securityObject.appUserId,
      userId
    ).subscribe(
      (res: ChatGroupDto) => {
        // this.LoadingchatHistory = false;
        this.ActiveChatGroup = res;
        this.ShowChatList = false;
        this.getuserChatHistory(res.id, 1);
      },
      (err: HttpResError) => {
        this.LoadingchatHistory = false;
        this.ShowChatList = true;
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  MarkChatGroupAsRead(chatGroup: ChatGroupDto) {
    this.chatService
      .MarkChatGroupAsRead(this.ActiveChatGroup.id)
      .subscribe(d => {});
  }
  getLastViewedList(chatGroup: ChatGroupDto) {
    // this.chatService
    //   .GetChatGroupViewedBy(this.ActiveChatGroup.id)
    //   .subscribe(res => {});
  }
  SwitchSelection() {
    this.enableSelection = !this.enableSelection;
    this.HistoryList.forEach(x => x.selected = false);
  }
  onRightClick(event: MouseEvent) {
    return false;
  }
  CopySelected() {
    let copyText = ``;
    let facilityName = this.securityService?.getClaim('FacilityName')?.claimValue
    this.HistoryList.forEach(x => {
      if (x.selected) {
        const nTime = moment(x.timeStamp).format('DD MMM YY')
        // const nTime = moment(x.timeStamp).format('DD MMM YY,\\ hh:mm a')
        copyText += `${nTime} ${x.senderName}@${facilityName || ''} : ${x.message || ''} \n`;
      }
    });
    navigator.clipboard.writeText(copyText);
    this.toaster.success('Selection copied');
  }
  CopyTOBottom(item: ChatDto) {
    let copyText = ``;
    let facilityName = this.securityService?.getClaim('FacilityName')?.claimValue
    const newItems = this.HistoryList?.filter((x, i) => item.id === x.id || x.id > item.id);
    newItems?.forEach(x => {
        // const nTime = moment(x.timeStamp).format('DD MMM YY,\\ hh:mm a');
        // copyText += `${nTime} ${x.senderName} : ${x.message || ''} \n`;
        const nTime = moment(x.timeStamp).format('DD MMM YY')
        // const nTime = moment(x.timeStamp).format('DD MMM YY,\\ hh:mm a')
        copyText += `${nTime} ${x.senderName}@${facilityName || ''} : ${x.message || ''} \n`;
    });
    if (copyText) {
      navigator.clipboard.writeText(copyText);
      this.toaster.success(`Messages copied`);
    }
  }
  loadUnreadChats(){
    if(!this.isUnreadChats){
      this.UserList = this.unreadChats;
      this.isUnreadChats = true;
    }else{
     this.UserList = this.allChats;
     this.isUnreadChats = false;
    }
  }
  startRecording() {
    if (!this.audioRecordingObj.isRecording) {
      this.audioRecordingObj.isRecording = true;
      this.audioRecordingService.startRecording();
    }
    this.SetAudioIntervalState(AudioRecordingIntervalState.Start)
  }
  pauseRecording() {
    if (this.audioRecordingObj.isRecording) {
      this.audioRecordingService.pause();
    }
    this.SetAudioIntervalState(AudioRecordingIntervalState.Pause)
  }
  resumeRecording() {
    if (this.audioRecordingObj.isRecording) {
      this.audioRecordingService.resume();
    }
    this.SetAudioIntervalState(AudioRecordingIntervalState.Start)
  }

  abortRecording() {
    if (this.audioRecordingObj.isRecording) {
      this.audioRecordingObj.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
    this.SetAudioIntervalState(AudioRecordingIntervalState.Stop)
  }

  async stopRecording(OutputFormat: OutputFormat) {
    if (this.audioRecordingObj.isRecording) {
      this.audioRecordingObj.isRecording = false;
      this.SetAudioIntervalState(AudioRecordingIntervalState.Stop)
      return await this.audioRecordingService.stopRecording(OutputFormat);
    }
    this.SetAudioIntervalState(AudioRecordingIntervalState.Stop)
  }

  SetAudioIntervalState(state: AudioRecordingIntervalState) {
    if (state == AudioRecordingIntervalState.Start) {
      clearInterval(this.audioRecordingObj.interval)
      this.audioRecordingObj.milliSecondTime = moment();
      // this.audioRecordingObj.timer = moment(this.audioRecordingObj.seconds || 0, 's').format('mm:ss')
      this.audioRecordingObj.timer = moment("2022-01-01").startOf('day').seconds(this.audioRecordingObj.seconds || 0).format('mm:ss');
      this.audioRecordingObj.paused = false;
      this.audioRecordingObj.interval = setInterval(() => {
        this.audioRecordingObj.seconds++;
        this.audioRecordingObj.timer = moment("2022-01-01").startOf('day').seconds(this.audioRecordingObj.seconds).format('mm:ss');
      }, 1000);

    }
    if (state == AudioRecordingIntervalState.Pause) {
      clearInterval(this.audioRecordingObj.interval)
      if (this.audioRecordingObj.milliSecondTime) {
        this.audioRecordingObj.milliSeconds = (this.audioRecordingObj.milliSeconds || 0) + moment().diff(moment(this.audioRecordingObj.milliSecondTime))
      }
      this.audioRecordingObj.milliSecondTime = null;
      this.audioRecordingObj.paused = true;
    }
    if (state == AudioRecordingIntervalState.Stop) {
      clearInterval(this.audioRecordingObj.interval)
      this.audioRecordingObj = {isRecording: false,paused: true, seconds: 0,timer: '', interval: null, pitchArr: [],milliSeconds: 0, milliSecondTime: null};
    }
  }

  clearRecordedData() {
    // this.blobUrl = null;
  }
  async SendAudioMessage() {
    var fileName = `${moment().format('YYYY-MM-DD-HH:mm:ss')}.aac`
    const filePath = `voice-message/${fileName}`;
    const seconds = this.audioRecordingObj.seconds;
    if (this.audioRecordingObj.milliSecondTime) {
      this.audioRecordingObj.milliSeconds = (this.audioRecordingObj.milliSeconds || 0) + moment().diff(moment(this.audioRecordingObj.milliSecondTime))
      this.audioRecordingObj.milliSeconds = this.audioRecordingObj.milliSeconds - 300;
    }
    const milliSeconds = this.audioRecordingObj.milliSeconds;
    console.log(seconds + ' Data         ' + milliSeconds)
    const blob = (await this.stopRecording(OutputFormat.WEBM_BLOB)) as Blob;
    // const link = document.createElement("a");
    // link.href = result || '';
    // link.download = fileName;
    // link.click();
    const file = this.audioRecordingService.blobToFile( blob, fileName , seconds) as File;
    const Metadata: AWS.S3.Metadata = {author: 'Premier Solutions', duration: seconds.toString()}
    const formData = new FormData();
    //inpFile is they key, the second parameter is the data to be send
    formData.append(fileName, blob);
    const upload = this.awsService.uploadUsingSdkForProgress(blob, filePath, environment.bucketMediaAws, 'binary/octet-stream', Metadata);
    upload.on('httpUploadProgress', (progress: ManagedUpload.Progress) => {
      const percentage = Math.round(progress.loaded / progress.total * 100);
    });
    upload.promise().then(
      (data) => {
        // this.toaster.success(`Audio message submitted`)
        this.sendMessage(ChatTypeEnum.Audio, filePath, milliSeconds.toString())
      },
      err => {
        // this.selectedLogo.uploading = false;
        this.toaster.error(err);
      }
    );
  }
  OnplayAudio(id: number) {
    const elements = document.querySelectorAll<HTMLAudioElement>("[id*='messageaudio']");
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];
      if (!element.id.includes(id.toString())) {
        element.pause();
      }

    }
  }

  PlayBackTimeUpdated( msg: ChatDto) {
    const element = document.getElementById(`${msg.id}messageaudio`) as HTMLAudioElement;
    if (element?.currentTime && msg.data) {
      if (!msg.timeLine) {
        msg.timeLine = {}
      }
      const seconds = ((+msg.data) % 1000) > 0 ? (+((+msg.data) / 1000)) : ((+msg.data) / 1000);
      const totalTime = moment("2022-01-01").startOf('day').seconds(seconds).format('mm:ss');
      const currentTime = moment("2022-01-01").startOf('day').seconds(element.currentTime).format('mm:ss');
      msg.timeLine['displayTime'] = `${currentTime} / ${totalTime}`
    }
  }

}
