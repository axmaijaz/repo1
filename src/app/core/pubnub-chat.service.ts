import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { UserType } from 'src/app/Enums/UserType.enum';
import {
  MsgNotification,
  AddChatDto,
  AVCallDto,
  PublishConfirmationDto,
  HubSateEnum,
  ChatParticipientDtoSignalR
} from '../model/chat/chat.model';
import { SecurityService } from './security/security.service';
import { PubNubAngular } from 'pubnub-angular2';
import { TwocChatService } from './2c-chat.service';
import { HttpResError } from '../model/common/http-response-error';
import { VideoCallingService } from './video-calling.service';
import * as signalR from '@microsoft/signalr';
import { ToastService } from 'ng-uikit-pro-standard';
import { options } from '../shared/shared.module';
import { HubConnectionState, IHttpConnectionOptions } from '@microsoft/signalr';
import { TMStatusChangedDto } from '../model/TeleMedicine/telemedicine.model';
import { AppUserAuth } from '../model/security/app-user.auth';
import { Router } from '@angular/router';
import { PublishDownloadLogsProgressModel } from '../model/socket.model';
import { AwsService } from './aws/aws.service';
import { EmitEvent, EventBusService, EventTypes } from './event-bus.service';
import { AthenaClaimDocResponseDto } from '../model/EmrConnect/emr-connect.model';
import { PatientCommunicationHistoryDto } from '../model/PatientEngagement/communication.model';
import moment from 'moment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PubnubChatService {
  private hubConnection: signalR.HubConnection;
  channel = '';
  hubConnectionStateSUbject = new Subject<HubSateEnum>();
  public chatChannelsUserPresence = new Subject<{
    action: string;
    channel: string;
    uuid: string;
  }>();
  chatChannelsList: string[] = [];
  chatViewwdChannelsList: string[] = [];
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl : environment.baseUrl;
  // public set SessionPlansuserlistPresence (userPresence: {action: string, channel: string, uuid: string}) {
  //   this._sessionPlansuserlistPresence.push(userPresence);
  // }
  public MessageNotifySubject = new Subject();
  public MessageViewdSubject = new Subject<PublishConfirmationDto>();
  public AppNotification = new Subject();
  public TMEncounterRequest = new Subject();
  public TMEncounterStatusChanged = new Subject<TMStatusChangedDto>();
  public confimMsgResp = new Subject();
  public RpmAlertDataChanged = new Subject();
  public messageSubject = new Subject();
  public signalRConnected = new Subject<boolean>();
  public participientEmail = null;
  public avCallSubject = new Subject<AVCallDto>();
  tmPatientId: number;
  signalAlreadyRConnected: boolean;
  intervalId: any;
  tmtoken: string;
  constructor(
    public pubnub: PubNubAngular,
    private toaster: ToastService,
    private httpClient: HttpClient,
    private twoCChat: TwocChatService,
    private callingService: VideoCallingService,
    private securityService: SecurityService,
    private router: Router,
    private eventBus: EventBusService
  ) {
    this.pubnub.init({
      publishKey: environment.PublishKey,
      subscribeKey: environment.SubscribeKey
    });
    securityService.RequestStopChat.subscribe(val => {
      this.stopChat();
    });
  }
  InitPubnubChat() {
    return;
  }
  async InitSignalrChat() {
    // if (!environment.production) {
    //   return;
    // }
    if (window.location.href.includes('teleCare/vCall')) {
      return;
    }
    await this.StartHUbConnection();
    this.subscribeSignalrMessages();
    // this.OnSocketClose();
  }
  async StartHUbConnection() {
    let baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl : environment.baseUrl;
    baseUrl = baseUrl.replace('api/', 'chatHub');
    let token = this.securityService.securityObject.bearerToken;
    if (this.securityService.securityObject?.userType !== UserType.Patient) {
      const secObj = await this.securityService.GetHangFireToken().toPromise();
      if (secObj) {
        token = secObj['bearerToken'];
      }
    }
    // 3 line change
    if (this.hubConnection && this.hubConnection.connectionId) {
      this.hubConnection?.stop();
    }
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(baseUrl, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .configureLogging({
        log: function (logLevel, message) {
          // console.log(new Date().toISOString() + ": " + message);
        }
      })
      .build();

    await this.hubConnection
      .start()
      .then(() => {
        this.signalAlreadyRConnected = true;
        this.signalRConnected.next(true);
        this.SubscribeGroupsByUserId();
        console.log('Connection started');
        this.SubscribeConnectionEvents();
        this.updateHubConnectionState(HubSateEnum.Connected);
      })
      .catch(err => {
        // setTimeout(() => {
        //   this.InitSignalrChat();
        // }, 2000);

        this.handleDisconnect();
        console.log('Error while starting connection: ' + err);
        this.updateHubConnectionState(HubSateEnum['Connection Error']);
      });
  }
  async CloseConnection() {
    await this.hubConnection?.stop();
  }
  async SubscribeGroupsByUserId() {
    if (!this.securityService.isLoggedIn() || this.securityService.securityObject.userType == UserType.AppAdmin) {
      return
    }
    const result1 = await this.hubConnection
      .invoke(
        'SubscribeGroupsByUserId',
        this.securityService.securityObject.appUserId
      )
      .catch(err => console.error(err));
    // this.sendMessageToGroup(this.channel, 'I am Online');
    // this.hubConnection.invoke('AddToGroup', this.channel)
    //   .catch(err => console.error(err));
    this.hubConnection.invoke('AddToGroup', `${this.securityService.securityObject.userName}`)
    if (this.securityService.securityObject.userType == UserType.FacilityUser) {
      const facilityId = +this.securityService.getClaim("FacilityId")?.claimValue;
      this.hubConnection.invoke('AddToGroup', `${facilityId}-oncommunication`)
    }
    if (this.securityService.securityObject.userType == UserType.Patient) {
    }
  }
  async addToSignalrGroup(groupName: string) {
    const result = await this.hubConnection
      .invoke('AddToGroup', groupName)
      .catch(err => console.error(err));
  }
  async sendMessageToGroup(groupName: string, message: any) {
    await this.hubConnection
      .invoke('SendMessage', groupName, message)
      .catch(err => { console.log(err); this.toaster.error('Unable to publish message !'); });
  }
  async invokeSignalrMethod(methodName: string, data?: any) {
    if (data || data === 0) {
      return await this.hubConnection
        .invoke(methodName, data)
        .catch(err => { this.toaster.error(err); return []; });
    } else {
      return await this.hubConnection
        .invoke(methodName)
        .catch(err => { this.toaster.error(err); return []; });
    }
  }
  async MarkChatGroupViewed(chatGroupId: number, userId: string) {
    return await this.hubConnection
        .invoke('MarkChatGroupViewed', chatGroupId, userId)
        .catch(err => { this.toaster.error(err); return false; });
  }
  async SendVideoChatMessage(methodName: string, data: AVCallDto, userName: string) {
    return await this.hubConnection
      .invoke(methodName, data, userName)
      .catch(err => { this.toaster.error(err); return []; });
  }
  subscribeSignalrMessages = () => {
    this.hubConnection.on('OnTokenRevoked', data => {
      this.securityService.logout();
      setTimeout(() => {
        location.reload();
      }, 500);
      // this.router.navigateByUrl('/login');
    });
    this.hubConnection.on('OnDownloadLogsProgress', (data: PublishDownloadLogsProgressModel) => {
      const result = localStorage.getItem('CanceledDownloadItems')
      if (result?.includes(data.key)) {
        return;
      }
      if (data.downloadReady) {
        // const fileUrl = this.aws.GetSignedUrl(data.url);
        window.open(data.publicUrl);
      }
      const event = new EmitEvent();
      event.name = EventTypes.OnGoingDowloadsProgress;
      event.value = data;
      this.eventBus.emit(event);
    });
    this.hubConnection.on('ReceiveMessage', data => {
    });
    this.hubConnection.on('OnStopConnectionRequest', data => {
      this.CloseConnection();
    });
    this.hubConnection.on('OnAppNotifications', (data: any) => {
      this.AppNotification.next(data);
    });
    this.hubConnection.on('OnHistoryViewedConfirmation', (data: any) => {
      this.confimMsgResp.next(data);
    });
    this.hubConnection.on('OnRpmAlertDataChanged', (data: any) => {
      this.RpmAlertDataChanged.next();
    });
    this.hubConnection.on(`OnPemCasesRecieved`, (data: any) => {
      // console.log(data)
      const event = new EmitEvent();
      event.name = EventTypes.RCSMSEvent;
      event.value = data;
      this.eventBus.emit(event)
    });
    this.hubConnection.on(`OnUploadClaimDocProgress`, (data: AthenaClaimDocResponseDto[]) => {
      console.log(data)
      const event = new EmitEvent();
      event.name = EventTypes.OnUploadClaimDocProgress;
      event.value = data;
      this.eventBus.emit(event)
    });
    this.hubConnection.on('OnBarcodeRecieved', (data: any) => {
      // console.log('Reading Received ' + data);
      const event = new EmitEvent();
      event.name = EventTypes.DeviceScanResult;
      event.value = data;
      this.eventBus.emit(event)
    });
    this.hubConnection.on('OnTmPatientOnlineStatusChanged', (data: any) => {
      this.TMEncounterRequest.next(data);
    });
    this.hubConnection.on('OnTmEncounterStatusChanged', (data: TMStatusChangedDto) => {
      this.TMEncounterStatusChanged.next(data);
    });
    this.hubConnection.on('OnVideoChat', (avCallDto: AVCallDto | any) => {
      // console.log('subscribed data rxd');
      if (this.callingService.isCallingComponentLoaded) {
        this.avCallSubject.next(avCallDto.message);
      } else {
        this.callingService.loadCallingComponent();
        this.callingService.isCallingComponentLoadedSubject.subscribe(
          (val: boolean) => {
            this.avCallSubject.next(avCallDto.message);
          }
        );
      }
      // this.VideoChatRequest.next(response);
    });
    this.hubConnection.on('OnChatMessageReceived', (data: any) => {

      if (data.senderUserId !== this.securityService.securityObject.appUserId) {
        const messageNotify = new MsgNotification();
        messageNotify.senderEmail = data.senderUserName;
        messageNotify.count = 1;
        messageNotify.chatGroupId = data.chatGroupId;
        this.messageSubject.next(data);
        this.MessageNotifySubject.next(messageNotify);
      }
    });
    this.hubConnection.on('OnChatRequest', (data: any) => {
      this.SubscribeGroupsByUserId();
    });
    this.hubConnection.on('OnChatViewed', (data: string) => {

      const viewedCOnfirmationDto = JSON.parse(data) as  PublishConfirmationDto;
      this.MessageViewdSubject.next(viewedCOnfirmationDto);
    });
    this.hubConnection.on('OnPatientCommunicationReceived', (data: PatientCommunicationHistoryDto) => {
      // new Message
      console.log(`Message Received`)
      const event = new EmitEvent();
      event.name = EventTypes.NewCommunicationMessage;
      data.timeStamp = moment.utc(data.timeStamp).local().format('MMM DD,\\ hh:mm a');
      data.shortCode = data.senderName?.getShortCode();
      event.value = {source: 'signalR', data: [data]};
      this.eventBus.emit(event);

    });
  }
  SubscribeConnectionEvents() {
    this.hubConnection.onreconnecting((data) => {
      this.updateHubConnectionState(HubSateEnum['Re Connecting']);
      // if (this.tmPatientId) {
      //   return;
      // }
      // 5 line change
      setTimeout(() => {
        if (this.hubConnection.state !== HubConnectionState.Connected && this.hubConnection.state !== HubConnectionState.Connecting) {
          this.handleDisconnect();
        }
      }, 4000);
    });
    this.hubConnection.onreconnecting((data) => {
      this.updateHubConnectionState(HubSateEnum['Re Connecting']);
    });
    this.hubConnection.onreconnected((data) => {
      this.updateHubConnectionState(HubSateEnum.Connected);
      this.SubscribeGroupsByUserId();
    });
    this.hubConnection.onclose((data) => {
      this.updateHubConnectionState(HubSateEnum.Disconnected);
      setTimeout(() => {
        if (this.hubConnection.state === HubConnectionState.Disconnected) {
          this.handleDisconnect();
        }
      }, 2000);
    });
  }
  updateHubConnectionState(value: HubSateEnum) {
    this.hubConnectionStateSUbject.next(value);
    if (this.hubConnection.state === HubConnectionState.Connected) {
      clearInterval(this.intervalId);
      console.log(`${this.intervalId} interval Cleared, Because connected`);
      this.intervalId = null;
    }
  }
  async initTelemedicine(tmPatientId: number, tmtoken: string) {
    this.tmPatientId = tmPatientId;
    this.tmtoken = tmtoken;
    let baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl : environment.baseUrl;
    baseUrl = baseUrl.replace('api/', 'chatHub');
    // baseUrl += `?tmPatientId=${tmPatientId}`;
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl(baseUrl, {
      accessTokenFactory: () => tmtoken
    })
      .withAutomaticReconnect()
      .configureLogging({
        log: function (logLevel, message) {
          // console.log(new Date().toISOString() + ": " + message);
        }
      })
      .build();

    await this.hubConnection
      .start()
      .then(() => {
        this.signalAlreadyRConnected = true;
        this.signalRConnected.next(true);
        this.invokeSignalrMethod('TmPatientConnectedAsync', this.tmPatientId);
        this.hubConnection.on('OnPing', () => {
          this.invokeSignalrMethod('RespondToPing');
        });
        this.hubConnection.on('OnStopConnectionRequest', data => {
          this.CloseConnection();
        });
        console.log('Connection started');
        this.SubscribeConnectionEvents();
        this.updateHubConnectionState(HubSateEnum.Connected);
      })
      .catch(err => {
        // setTimeout(() => {
        //   if (!this.signalAlreadyRConnected) {
        //     this.initTelemedicine(this.tmPatientId, tmtoken);
        //   }
        // }, 5000);
        this.handleDisconnect();
        this.updateHubConnectionState(HubSateEnum['Connection Error']);
        console.log('Error while starting connection: ' + err);
      });
    // this.pubnub.setUUID(tmPatientId.toString());
    // this.pubnub.subscribe({
    //   channels: ['teleMedicine'],
    //   triggerEvents: true,
    //   withPresence: true // this is only for to finding which user are online
    // });
  }
  handleDisconnect() {
    if (this.intervalId) {
      console.log(`Interval ${this.intervalId} returned`);
      return;
    }
    this.intervalId = setInterval(async () => {
      if (this.hubConnection.state !== HubConnectionState.Connected) {
        // if (this.hubConnection.state !== HubConnectionState.Disconnecting) { await this.hubConnection.stop(); }
        if (this.hubConnection.state !== HubConnectionState.Connecting) {
          if (this.tmPatientId && this.tmtoken) {
            await this.initTelemedicine(this.tmPatientId , this.tmtoken);
          }
          if (!this.tmPatientId && !this.tmtoken && this.securityService.isLoggedIn()) {
            // await this.InitSignalrChat();
            if (this.hubConnection.state === HubConnectionState.Disconnected) {
              await this.hubConnection.start();
              this.SubscribeGroupsByUserId();
            }
          }
        }
      }
      if (this.hubConnection.state === HubConnectionState.Connected) {
        this.updateHubConnectionState(HubSateEnum.Connected);
      }
    }, 5000);
    console.log(`${this.intervalId} interval Added`);
  }
  destroyTmSignalRConnection() {
    console.log('Diconnection socket....');
    this.CloseConnection();
    this.tmPatientDisconnected();
    // confirm('Do you want to close ?');
    // this.pubnub.unsubscribe({ channels: ['teleMedicine'] });
  }
  tmPatientDisconnected() {
    return this.httpClient.post(this.baseUrl + 'Telemedicine/TmPatientDisconnected/' + this.tmPatientId, {}, httpOptions
    );
  }
  GetTmPatientToken(tmPatientId: number) {
    return this.httpClient.get(this.baseUrl + `Telemedicine/GetTmPatientToken/${tmPatientId}`, httpOptions
    );
  }
  stopChat() {
    // this.pubnub.unsubscribeAll();
    // this.pubnub.unsubscribe(this.pubnub); not working
    this.CloseConnection();
    return;
    this.pubnub.unsubscribe({ channels: [...this.chatChannelsList] });
    this.pubnub.unsubscribe({ channels: [...this.chatViewwdChannelsList] });
    this.pubnub.unsubscribe({
      channels: [
        this.channel,
        this.channel + '-AppNotifications',
        this.channel + '-TmPatientOnlineStatusChanged',
        this.channel + '-chatRequest',
        this.channel + '-Confirmation',
        this.channel + '-HistoryViewedConfirmation',
        this.channel + '-VideoChat'
      ]
    });
  }
  subscribeChannel() {
    this.pubnub.subscribe({
      channels: [
        this.channel,
        this.channel + '-AppNotifications',
        this.channel + '-TmPatientOnlineStatusChanged',
        this.channel + '-chatRequest',
        this.channel + '-Confirmation',
        this.channel + '-HistoryViewedConfirmation',
        this.channel + '-VideoChat'
      ],
      triggerEvents: true,
      withPresence: true // this is only for to finding which user are online
    });
  }

  // getPresenceOfSessionPlanUsers(callback: (presence) => void) {
  //   this.pubnub.getPresence([...this.sessionPlanchannelsname] , (presence) => {
  //     callback(presence);
  //   });
  // }
  sendMessage(chat: AddChatDto) {
    return this.httpClient.post(this.baseUrl + 'Chat', chat, httpOptions);
  }
  getListOfChats(currentUserEmail): any {
    return this.httpClient.get(
      this.baseUrl +
      'Chat/GetChatUserList?currentUserEmail=' +
      currentUserEmail,
      httpOptions
    );
  }
  getIceServers() {
    return this.httpClient.get(
      this.baseUrl + 'TeleMedicine/GenerateToken',
      httpOptions
    );
  }
  subscribeChatChannels() {
    this.chatChannelsList = [];
    this.chatViewwdChannelsList = [];
    this.twoCChat
      .GetChatChannelsByUserId(this.securityService.securityObject.appUserId)
      .subscribe(
        (res: any) => {
          if (res.channels.length > 0) {
            this.chatChannelsList = res.channels;
            const arrr = [...this.chatChannelsList];
            this.pubnub.subscribe({
              channels: arrr,
              triggerEvents: true,
              withPresence: true
            });
            this.getChatChannelsMessages();
          }
          if (res.channelsViewed.length > 0) {
            this.chatViewwdChannelsList = res.channelsViewed;
            this.pubnub.subscribe({
              channels: [...this.chatViewwdChannelsList],
              triggerEvents: true,
              withPresence: true
            });
            this.getChatChannelsViewedConfirmation();
          }
        },
        (err: HttpResError) => {
          console.error(err);
        }
      );
  }
  getChatChannelsMessages() {
    this.pubnub.getMessage(this.chatChannelsList, response => {
      if (
        response.message.senderUserId !==
        this.securityService.securityObject.appUserId
      ) {
        const messageNotify = new MsgNotification();
        messageNotify.senderEmail = response.message.senderUserName;
        messageNotify.count = 1;
        this.messageSubject.next(response.message);
        this.MessageNotifySubject.next(messageNotify);
      }
    });
  }
  getChatChannelsViewedConfirmation() {
    this.pubnub.getMessage(this.chatViewwdChannelsList, response => {
      let viewedCOnfirmationDto = new PublishConfirmationDto();
      viewedCOnfirmationDto = response;
      this.MessageViewdSubject.next(viewedCOnfirmationDto);
    });
  }
  getChatHistory(userId: string, chatGroupId: number, page: number) {
    return this.httpClient.get(
      this.baseUrl +
      'Chat/GetPagedPrivateChatHistory?userId=' +
      userId +
      '&chatGroupId=' +
      chatGroupId +
      '&pageNumber=' +
      page,
      httpOptions
    );
  }
  MarkChatGroupAsRead(chatId: number) {
    const data = {
      applicationUserId: this.securityService.securityObject.appUserId,
      chatGroupId: chatId
    };
    return this.httpClient.post(
      this.baseUrl + 'Chat/MarkChatViewed',
      data,
      httpOptions
    );
  }
  GetChatGroupViewedBy(chatGroupId: number) {
    return this.httpClient.get(
      this.baseUrl + `Chat/GetChatGroupViewedBy/${chatGroupId}`,
      httpOptions
    );
  }
  getMessageNotificationHistory(appUserId) {
    return this.httpClient.get(
      this.baseUrl + 'Chat/GetChatNotificationsHistory?appUserId=' + appUserId,
      httpOptions
    );
  }
  getChatGroupByPatientId(patientId: string) {
    return this.httpClient.get(
      this.baseUrl + `Chat/GetChatGroupByPatientId/${patientId}`,
      httpOptions
    );
  }
  getNotificationHistory(userName: string, type?: string, filter?: string) {
    return this.httpClient.get(
      this.baseUrl +
      `Notifications/GetAppNotificationsHistory?userName=${userName}&type=${type}&filter=${filter}`,
      httpOptions
    );
  }
  markNotificationAsRead(
    userName: string,
    notificationType: string,
    id: number
  ) {
    const data = {
      id: id,
      userName: userName,
      notificationType: notificationType
    };
    return this.httpClient.post(
      this.baseUrl + 'Notifications/MarkNotificationsAsRead',
      data,
      httpOptions
    );
  }
  sendFile(sender, reciever, file, title) {
    const formdata = new FormData();
    formdata.append('Title', title);
    formdata.append('DocumentFile', file);
    formdata.append('SenderEmail', sender);
    formdata.append('RecipientEmail', reciever);
    // const httpfileOption = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/form-data'
    //   })
    // };
    return this.httpClient.post(
      this.baseUrl + 'Chat/SendDocument?DocumentFile=' + file,
      formdata
    );
  }
  async getActivePatients() {
    // return new Promise((resolve, reject) => {
    //   this.pubnub.hereNow(
    //     {
    //       channels: ['teleMedicine'],
    //       includeUUIDs: true,
    //       includeState: true
    //     },
    //     function(status, response) {
    //       resolve(response);
    //       // return response;
    //       // handle status, response
    //     }
    //   );
    // });
    if (this.signalAlreadyRConnected) {
      const myresult = await this.invokeSignalrMethod('GetTmPatientsPresenceWithTime', 0);
      console.log(myresult);
      return myresult;
    } else {
      setTimeout(async () => {
        const myresult = await this.invokeSignalrMethod('GetTmPatientsPresenceWithTime', 0);
        console.log(myresult);
        return myresult;
      }, 2000);
    }
  }
  getPresence(channel: string): Promise<any> {
    // this.pubnub.getPresence(this.channel + '-VideoChat', function(pse) {
    //   console.log(pse);
    // });
    // this.pubnub.getPresence(this.channel + '-VideoChat-pnpres', function(pse) {
    //   console.log(pse);
    // });
    return new Promise((resolve, reject) => {
      this.pubnub.hereNow(
        {
          channels: [channel + '-VideoChat']
        },
        function (status, response) {
          resolve(response);
          // return response;
          // handle status, response
        }
      );
    });
    //  this.pubnub.hereNow(
    //   {
    //     channels: [channel + '-VideoChat']
    //   },
    //   function(status, response) {
    //     return response;
    //     // handle status, response
    //   }
    // );
  }
}
