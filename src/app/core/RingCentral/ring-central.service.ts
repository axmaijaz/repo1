import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import SDK, { AuthData } from '@ringcentral/sdk';
import Client from '@ringcentral/sdk/lib/http/Client';
import Platform, { events } from '@ringcentral/sdk/lib/platform/Platform';
import { ToastService } from 'ng-uikit-pro-standard';
import { catchError } from 'rxjs/operators';
import { RCVIewState } from 'src/app/model/AppModels/app.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { GetPemDataParams, NewCaseWithDetailDto, PemCaseEditDto, PemMapNumberDto, SendFaxDto, TransferCaseDetailDto } from 'src/app/model/PatientEngagement/pem.model';
import { AccountState } from 'src/app/model/security/app-user.auth';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { environment } from 'src/environments/environment';
import { EmitEvent, EventBusService, EventTypes } from '../event-bus.service';
import { SecurityService } from '../security/security.service';
import { RCPhoneRecordDto } from 'src/app/twoc-ring-central/rc-calls-msg/ringCentral.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};
const httpOptions1 = {
  headers: new HttpHeaders({
    'Content-Type': 'text'
  })
};
@Injectable({
  providedIn: 'root'
})
export class RingCentralService {
  rcsdk: SDK;
  platform: Platform;
  rcLoggedInSdk = false;
  rcLoggedInEmbedded = false;
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  isLoggedInEmbedded: boolean;
  client: Client;
  loginNumber: string; // "+12818639321*130"
  rcPhoneInfo: RCPhoneRecordDto[] = [];
  // let baseUrl = this.baseUrl.replace('api/', 'VMRProblemMvc');
  constructor(
    private http: HttpClient,
    private eventBus: EventBusService,
    private securityService: SecurityService,
    private toaster: ToastService,
    private httpErrorService: HttpErrorHandlerService,
  ) {
    this.WatchEventBus();
    this.subscribeRcViewEvents();
  }
  subscribeRcViewEvents() {
    window.addEventListener('message', (e) => {
      const data = e.data;
      if (data) {
        switch (data.type) {
          case 'rc-active-call-notify':
            // get call on active call updated event
            console.log(data.call);
            break;
          case 'rc-telephony-session-notify':
            // get telehony session on telephony session event
            console.log(data.telephonySession);
            break;
          case 'rc-login-status-notify':
            // get login status from widget
            console.log('rc-login-status-notify:', data.loggedIn, data.loginNumber);
            this.loginNumber = data.loginNumber
            this.isLoggedInEmbedded = data.loggedIn;
            if (this.rcPhoneInfo?.length && this.loginNumber) {
              const isNumberValid = this.rcPhoneInfo.some(x => this.loginNumber.includes(x.phoneNumber))
              if (!isNumberValid) {
                this.RcWidgetLogout();
                this.toaster.warning(`${data.loginNumber} is not a valid number for current facility`);
              }
            }
            break;
          case 'rc-call-end-notify':
            // get call on call end event
            console.log(data.call);
            break;
          case 'rc-message-updated-notify':
            // get message from widget event
            // console.log('rc-message-updated-notify:', data.message);
            // this.AddRingCentralMessage(data.message)?.subscribe()
            break;
          case 'rc-inbound-message-notify':
            // get new inbound message from widget event
            console.log('rc-inbound-message-notify:', data.message);
            break;
          case 'rc-route-changed-notify':
            // get current page route from widget
            console.log('rc-route-changed-notify:', data.path);
            break;
          default:
            break;
        }
      }
    });
  }
  WatchEventBus() {
    this.eventBus.on(EventTypes.LoginLogout).subscribe((res: AccountState) => {
      if (res === AccountState.LoggedOut) {
        this.RcWidgetLogout();
        this.RequestRcViewStateChange(RCVIewState.minimize);
        this.rcsdk?.logout();
      }
      if (res === AccountState.LoggedIn) {
        this.TryGetRcToken();
      }
    });
  }
  RequestRcViewStateChange(viewState: RCVIewState) {
    const event = new EmitEvent();
    event.name = EventTypes.ToggleRCMainView;
    event.value = viewState;
    this.eventBus.emit(event);
  }
  TryGetRcToken() {
    return;
    this.GetRcToken().subscribe(
      (res: {tokenInfo: AuthData}) => {
        // this.initRingCentral(res.tokenInfo);
      },
      (error: HttpResError) => {
        // this.toaster.error(error.error, error.message);
      }
    );
  }
  initRingCentral(res?: AuthData) {
    this.rcsdk = new SDK({
      server: SDK.server.sandbox,
      // server: 'https://platform.ringcentral.com',
      // server: 'https://platform.devtest.ringcentral.com',
      // clientId: 'KmFe0GlaSWeGFTR-sDFGyg',
      // clientSecret: 'vGMGUKvzTHqjFHGTOTtMdwDI15O1MJQfiJhv3XSyHNKA',
      'clientId': 'tpvlUlwjTK6gEl5is9VKJQ',
      'clientSecret': 'PlCyYS6XTTyiyjv8gQoMuglaO3awkqQIelA7Ba5Ta0rQ',
      redirectUri: 'https://api.healthforcehub.link/api/RingCentral/oauthredirect' // optional, but is required for Implicit Grant and Authorization Code OAuth Flows (see below)
    });
    this.platform = this.rcsdk.platform();
    this.client = this.rcsdk.client();
    if (window.location.hash || window.location.search || res) {
      // if (Token) {
      //   Token = '#access_token=' + Token + '&token_type=bearer';
      //   // Token = '?code=' + Token;
      // }
      const loginOptions = {
        access_token: res.access_token,
        endpoint_id: res.endpoint_id,
        expires_in: res.expires_in,
        scope: res.scope,
        token_type: 'bearer',
        refresh_token: res.refresh_token
      };
      // const loginOptions = this.rcsdk.parseLoginRedirect(window.location.hash || window.location.search || Token);
      this.rcsdk.login(res).then((data) => {
      // console.log('Data', loginOptions);
      // SDK.handleLoginRedirect();
        // this.read_user_calllog();
      });
    } else {
      const loginUrl = this.rcsdk.loginUrl({implicit: false}); // implicit parameter is optional, default false
      window.location.assign(loginUrl);
    }
    this.platform.on(events.loginSuccess, (response) => {
      this.rcLoggedInSdk = true;
      // this.GetAccountRcInfo();
      // this.GetCallLogs();
      // this.getPhoneNumbers();
      console.log('Logged In Rc');
    });
    // this.platform.on(events.beforeLogout, (response) => {
    this.platform.on(events.logoutSuccess, (response) => {
      this.rcLoggedInSdk = false;
      setTimeout(() => {
        if (this.securityService.isLoggedIn()) {
          this.TryGetRcToken();
        }
      }, 1000);
      console.log('Logging Out Rc');
    });
    this.platform.on(events.beforeLogout, () => {
      this.rcLoggedInSdk = false;
      setTimeout(() => {
        if (this.securityService.isLoggedIn()) {
          this.TryGetRcToken();
        }
      }, 1000);
      console.log('Logged Out');
    });
    this.client.on(this.client.events.requestError, (apiError) => {
      // console.log(apiError.originalMessage);
      // console.log(apiError.response);
      // if (apiError.response.status === 401) {
      //   if (this.securityService.isLoggedIn()) {
      //     this.rcLoggedInSdk = false;
      //     // this.TryGetRcToken();
      //   }
      // }
    });
  }

  async SendRCMessage(to: string, message: string) {
    const body1 = {
      'to': [{'phoneNumber': to}],
      'from': {'phoneNumber': '+14707951749'},
      'text': `${message}`
    };
    const result = await this.rcsdk.post('/restapi/v1.0/account/~/extension/~/sms', body1)
    return result.json()
    // .then(async (resp) => {
      // const jsonObj = await resp.json();
      // for (const record of jsonObj.records) {
      //   console.log('Call type: ' + record.type);
      // }
    // }).catch((err) => {
      // this.toaster.error(err.Error);
    // });
  }
  getPhoneNumbers() {
    // this.rcsdk.get('/restapi/v1.0/account/~/extension/~/phone-number').then(async (resp) => {
      // this.rcsdk.get('/restapi/v1.0/account/~/a2p-sms/messages').then(async (resp) => {
      this.rcsdk.get('/restapi/v1.0/account/~/extension/~/message-store', {
        messageType: ['SMS'],
        dateFrom: '2020-05-25'
      }).then(async (resp) => {
      const jsonObj = await resp.json();
      // for (const record of jsonObj.records) {
      //   console.log('Call type: ' + record.type);
      // }
    }).catch((err) => {
      // this.toaster.error(err.Error);
    });
  }
  GetCallLogs() {
      this.rcsdk.get('/restapi/v1.0/account/~/extension/~/call-log', {
        dateFrom: '2020-05-25'
      }).then(async (resp) => {
      const jsonObj = await resp.json();
      console.log(jsonObj);
      // this.callLogsData = jsonObj;
      // for (const record of jsonObj.records) {
      //   console.log('Call type: ' + record.type);
      // }
    }).catch((err) => {
      // this.toaster.error(err.Error);
    });
    // this.rcsdk.get(`/restapi/v1.0/account/~/telephony/sessions/s-4808b068c6e54abdb30b28897c4bd46b`).then(async (resp) => {
    // const jsonObj = await resp.json();
    // console.log(jsonObj);
    // // this.callLogsData = jsonObj;
    // // for (const record of jsonObj.records) {
    // //   console.log('Call type: ' + record.type);
    // // }
    // }).catch((err) => {
    //   // this.toaster.error(err.Error);
    // });
    // const body1 = {
    //   'to': [{'phoneNumber': '+14244275704'}],
    //   'from': {'phoneNumber': '+14242994194}'},
    //   'text': 'Test SMS message from Platform server'
    // };
    // this.rcsdk.post(`/restapi/v1.0/account/~/extension/~/sms`, body1).then(async (resp) => {
    // const jsonObj = await resp.json();
    // console.log(jsonObj);
    // // this.callLogsData = jsonObj;
    // // for (const record of jsonObj.records) {
    // //   console.log('Call type: ' + record.type);
    // // }
    // }).catch((err) => {
    //   // this.toaster.error(err.Error);
    // });
    // const body2 = {
    //   'to': [{'extensionId': '689187005'}, {'extensionNumber': '101'}],
    //   // replyOn: 1,
    //   // 'from': {'extensionId': '283954004'},
    //   'text': 'Hello!'
    //  };
    // this.rcsdk.post(`/restapi/v1.0/account/~/extension/~/company-pager`, body2).then(async (resp) => {
    // const jsonObj = await resp.json();
    // console.log(jsonObj);
    // // this.callLogsData = jsonObj;
    // // for (const record of jsonObj.records) {
    // //   console.log('Call type: ' + record.type);
    // // }
    // }).catch((err) => {
    //   // this.toaster.error(err.Error);
    // });
    this.rcsdk.get(`/restapi/v1.0/account/~/extension/~/presence`).then(async (resp) => {
    const jsonObj = await resp.json();
    console.log(jsonObj);
    // this.callLogsData = jsonObj;
    // for (const record of jsonObj.records) {
    //   console.log('Call type: ' + record.type);
    // }
    }).catch((err) => {
      // this.toaster.error(err.Error);
    });
    // const sadsa = {
    //   'userStatus': 'Available',
    //   'dndStatus': 'TakeAllCalls',
    //   'message': 'Available till 7 pm',
    //   'allowSeeMyPresence': true,
    //   'ringOnMonitoredCall': true,
    //   'pickUpCallsOnHold': true
    // };
    // this.rcsdk.put(`/restapi/v1.0/account/~/extension/~/presence`, sadsa).then(async (resp) => {
    // const jsonObj = await resp.json();
    // console.log(jsonObj);
    // // this.callLogsData = jsonObj;
    // // for (const record of jsonObj.records) {
    // //   console.log('Call type: ' + record.type);
    // // }
    // }).catch((err) => {
    //   // this.toaster.error(err.Error);
    // });
  }
  async GetAccountRcInfo() {
    // account/199237031/extension/62553311031
    console.log(await this.platform.loggedIn());
      this.platform.get('/restapi/v1.0/account/~').then(async (resp) => {
      const jsonObj = await resp.json();
      // this.callLogsData = jsonObj;
      console.log(jsonObj);
      // for (const record of jsonObj.records) {
      //   console.log('Call type: ' + record.type);
      // }
    }).catch((err) => {
      // this.toaster.error(err.Error);
    });
  }
  async GetRCPhoneInfo() {
    // account/199237031/extension/62553311031
    // console.log(await this.rcsdk.platform().auth().accessTokenValid());
    // console.log(await this.platform.loggedIn());
    //  this.platform.refresh()
      // await this.rcsdk.refresh()
      this.rcsdk.get('/restapi/v1.0/account/~/extension/~/phone-number').then(async (resp) => {
      const jsonObj = await resp.json();
      // this.callLogsData = jsonObj;
      console.log(jsonObj);
      // for (const record of jsonObj.records) {
      //   console.log('Call type: ' + record.type);
      // }
    }).catch((err) => {
      // this.toaster.error(err.Error);
    });
  }
  async GetAttachmentDoc(resourceUrl: string) {
    // console.log(await this.platform.loggedIn());
    console.log(await this.rcsdk.platform().auth().accessTokenValid());
    const response = await this.platform.get(resourceUrl);
    return await response.blob();
    // .then((res) => {
    //     return res.blob(); // or arrayBuffer(), we are accessing WhatWG Fetch's Response
    // }).then((blob ) => {
    //     const img = document.createElement('img');
    //     img.src = URL.createObjectURL(blob);
    //     document.getElementById('container').appendChild(img);
    // });
  }
  CreateFileUrl(resourceUrl: string) {
    return this.rcsdk.createUrl(resourceUrl, {addServer: true, addToken: true} as any);
  }
  RcWidgetLogout () {
    if (!document.querySelector('#rc-widget-adapter-frame')) {
      return;
    }
    document.querySelector('#rc-widget-adapter-frame')['contentWindow'].postMessage({
      type: 'rc-adapter-logout'
    }, '*');
  }
  /**
   * Change Navigation in RC View.
   *
   * @param path Possible options: '/meeting', '/dialer', '/history', '/settings', '/messages'
  */
  NaviGateTO (path: string) {
    this.RequestRcViewStateChange(RCVIewState.expand);
    if (!this.isLoggedInEmbedded) {
      this.toaster.warning('Not logged in embedded view');
    }
    if (!document.querySelector('#rc-widget-adapter-frame')) {
      return;
    }
    document.querySelector('#rc-widget-adapter-frame')['contentWindow'].postMessage({
      type: 'rc-adapter-navigate-to',
      path: path, // '/meeting', '/dialer', '//history', '/settings'
    }, '*');
  }
  startCall (number: string) {
    this.RequestRcViewStateChange(RCVIewState.expand);
    if (!this.isLoggedInEmbedded) {
      this.toaster.warning('Not logged in embedded view');
    }
    if (!document.querySelector('#rc-widget-adapter-frame')) {
      return;
    }
    document.querySelector('#rc-widget-adapter-frame')['contentWindow'].postMessage({
      type: 'rc-adapter-new-call',
      phoneNumber: `${number}`, // +14244275704
      toCall: true,
    }, '*');
  }
  sendSms(number: string, text?: string) {
    this.RequestRcViewStateChange(RCVIewState.expand);
    if (!this.isLoggedInEmbedded) {
      this.toaster.warning('Not logged in embedded view');
    }
    if (!document.querySelector('#rc-widget-adapter-frame')) {
      return;
    }
    document.querySelector('#rc-widget-adapter-frame')['contentWindow'].postMessage({
      type: 'rc-adapter-new-sms',
      phoneNumber: `${number}`, // +14244275704
      text: `${text || ''}`,
    }, '*');
  }
  OpenConverSation(number: string, text?: string) {
    this.RequestRcViewStateChange(RCVIewState.expand);
    if (!this.isLoggedInEmbedded) {
      this.toaster.warning('Not logged in embedded view');
    }
    if (!document.querySelector('#rc-widget-adapter-frame')) {
      return;
    }
    this.NaviGateTO('/messages');
    setTimeout(() => {
      document.querySelector('#rc-widget-adapter-frame')['contentWindow'].postMessage({
        type: 'rc-adapter-new-sms',
        phoneNumber: `${number}`, // +14244275704
        conversation: true,
        text: `${text || ''}`,
      }, '*');
    }, 500);
  }
  GetRcToken() {
    return this.http.get(this.baseUrl + `RingCentral/GetToken` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAuthCode() {
    return this.http.get(this.baseUrl + `RingCentral/GetAuthCode` , {responseType: 'text'}).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetAccountInfo() {
    return this.http.get(this.baseUrl + `RingCentral/GetAccountInfo` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPhoneNumberInfo(facilityId: number) {
    return this.http.get(this.baseUrl + `RingCentral/GetPhoneInfo/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetRcConfigDetails(facilityId: number) {
    return this.http.get(this.baseUrl + `RingCentral/GetRcConfigDetails/${facilityId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  DeleteRCTokenById(rId: number) {
    return this.http.delete(this.baseUrl + `RingCentral/DeleteRCTokenById/${rId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPemData(filterParams: GetPemDataParams) {
    return this.http.post(this.baseUrl + `Pem/GetPemData`, filterParams , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPemMessages(patientId: number) {
    return this.http.get(this.baseUrl + `Pem/GetPemMessages/${patientId}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ChangePrimaryPhoneNo(facilityId: number, phone: string) {
    const obj = {
      "facilityId": facilityId,
      "primarySenderNumber": phone
    }
    return this.http.put(this.baseUrl + `RingCentral/ChangePrimaryPhoneNo/${facilityId}`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendMessage(pemCaseId: number, messageText: string) {
    const obj = {
      "pemCaseId": pemCaseId,
      "messageText": messageText
    }
    return this.http.post(this.baseUrl + `RingCentral/SendMessage`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendMessageToNumber(phoneNumber: string, messageText: string) {
    const obj = {
      "phoneNumber": phoneNumber,
      "messageText": messageText
    }
    return this.http.post(this.baseUrl + `RingCentral/SendMessageToNumber`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  // GenerateCasesFromMessageList() {
  //   return this.http.get(this.baseUrl + `Pem/GenerateCasesFromMessageList` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  // }
  GenerateCasesFromMessageList(facilityId: number, patientId = 0) {
    return this.http.get(this.baseUrl + `RingCentral/GenerateCasesFromMessageList/${facilityId}?patientId=${patientId || 0}` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  AddRingCentralMessage = (mData: object) => {
    const facilityId = +this.securityService.getClaim("FacilityId")?.claimValue;
    const senderUserId = this.securityService.securityObject?.appUserId || '';
    if (!facilityId || !senderUserId) {
      return;
    }
    return this.http.post(this.baseUrl + `RingCentral/AddRingCentralMessage/${facilityId}?senderUserId=${senderUserId}`, mData , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetPemCasesByUserId(userId: string) {
    return this.http.get(this.baseUrl + `Pem/GetPemCasesByUserId/${userId}?pemCaseStatus=-1` , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  MapUserPhoneNumber(obj: PemMapNumberDto) {
    return this.http.post(this.baseUrl + `Pem/MapUserPhoneNumberByPatientId`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  TransferDetailsToOtherCase(obj: TransferCaseDetailDto) {
    return this.http.put(this.baseUrl + `Pem/TransferCaseDetails`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  NewCaseWithTransfer(obj: NewCaseWithDetailDto) {
    return this.http.put(this.baseUrl + `Pem/NewCaseWithTransfer`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  EditPemCase(obj: PemCaseEditDto) {
    return this.http.put(this.baseUrl + `Pem/EditCase`, obj , httpOptions).pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendFax(data: SendFaxDto) {
    const formdata = new FormData();
    formdata.append('CoverPageText', data.CoverPageText);
    formdata.append('RecipientPhoneNumber', data.RecipientPhoneNumber);
    formdata.append('FileName', data.FileName);
    formdata.append('ContentType', data.ContentType);
    if (data.Files) {
      for (var i = 0; i < data.Files.length; i++) {
        formdata.append('Files', data.Files[i]);
    }
    }
    // formdata.append('Files', data.files);
    return this.http.post(this.baseUrl + `Pem/SendFax`, formdata );
    // return this.http.post(`https://a73469d9c7bb.ngrok.io/api/` + `Pem/SendFax`, formdata );
  }
}
