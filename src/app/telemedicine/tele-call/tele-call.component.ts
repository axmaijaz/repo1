import {
  Component,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
  HostListener,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef
} from '@angular/core';
import * as RTCMultiConnection from 'rtcmulticonnection';
import { IClassSession, IStreamEvent } from 'src/app/model/chat/chat.model';
import { PubnubChatService } from 'src/app/core/pubnub-chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TelemedicineService } from 'src/app/core/telemedicine.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { SubSink } from 'src/app/SubSink';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { UserType } from 'src/app/Enums/UserType.enum';
import { SecurityService } from 'src/app/core/security/security.service';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { NgForm } from '@angular/forms';
import { submitTmEncounterData, TmViewState } from 'src/app/model/TeleMedicine/telemedicine.model';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import moment from 'moment';
import { environment } from 'src/environments/environment';
// import { CounterComponent } from "src/app/counter.component";

@Component({
  selector: 'app-tele-call',
  templateUrl: './tele-call.component.html',
  styleUrls: ['./tele-call.component.scss']
})
export class TeleCallComponent implements OnInit, OnDestroy {
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD h:mm:ss a'
  };
  @ViewChild("f") form: NgForm;
  private subs = new SubSink();
  currentUser: AppUserAuth = null;
  isCounter = false;
  billingProviderList = new Array<CreateFacilityUserDto>();
  connection = new RTCMultiConnection(null, {
    useDefaultDevices: true
  });
  billingProvider: number;
  roomId: any;
  activeUserList: string[] = [];
  localmainObject: IClassSession = null;
  otherVideoObjects: IClassSession[] = [];
  isCaller: boolean;
  encounterData = new submitTmEncounterData();
  onlineStatusEnum = OnlineStatus;
  iceServersList = [];
  note = '';
  tmViewState: TmViewState = 0;
  tmViewStateEnum = TmViewState;
  roomDetail = {
    patientName: '',
    providerName: ''
  };
  @ViewChild('oneItem') oneItem: any;
  @ViewChildren('count') count: QueryList<any>;
  // @ViewChild('counter', {read:CounterComponent})
  // private counter: CounterComponent;
  @ViewChild('submitEncounterModal') submitEncounterModal: ModalDirective;
  facilityId: number;
  @ViewChild('otherStreams') otherStreams: ElementRef;
  @ViewChild('myStram') myStram: ElementRef;
  durationError: boolean;
  checkDuration = false;
  getNoteText: string;
  TmPatientId: any;
  baseUrl = environment.baseUrl;
  TeleCallobj = new TeleCallDto();
  errorMessage: any;
  mediaInfo: any;
  tmToken: string;
  @HostListener("window:beforeunload", ["$event"])
  beforeUnloadHander(event) {
    navigator.sendBeacon(this.baseUrl + 'Telemedicine/TmPatientDisconnected/' + this.TmPatientId, );
    // confirm('clode')
    // this.pubnubService.destroyTmSignalRConnection();
    // return false;
  }
  constructor(
    private toaster: ToastService,
    private cdtr: ChangeDetectorRef,
    private teleMedicineService: TelemedicineService,
    private pubnubService: PubnubChatService,
    private route: ActivatedRoute,
    private router: Router,
    private elRef: ElementRef,
    private facilityService: FacilityService,
    private securityService: SecurityService
  ) {}

  ngOnInit() {
    this.roomId = +this.route.snapshot.queryParams['roomId'];
    this.TmPatientId = +this.route.snapshot.queryParams['patientId'];
    const bpId = +this.route.snapshot.queryParams['bpId'];
    // this.facilityId = +this.route.snapshot.queryParams['bpId'];
    this.isCaller =
      this.route.snapshot.queryParams['isCaller'] &&
      this.route.snapshot.queryParams['isCaller'] === 'true';

    if (this.roomId) {
      // tslint:disable-next-line: no-use-before-declare
      const obj = new TeleCallDto();
      obj.roomId = this.roomId;
      if (this.isCaller) {
        obj.currentUserName = this.TmPatientId.toString();
      } else {
        obj.currentUserName = bpId.toString();
      }
      this.TeleCallobj = obj;
      this.pubnubService.getIceServers().subscribe((res: any) => {
        this.iceServersList = res.ice_servers;
        if (this.isCaller) {
          this.pubnubService.GetTmPatientToken(this.TmPatientId).subscribe((token: any) => {
            this.tmToken = token;
            this.initWebRtc(obj);
          }, (err: HttpResError) => {
            this.toaster.error(err.error);
          });
        } else {
          this.initWebRtc(obj);
        }
      });


      // if (this.isCaller) {
      //   this.initTMChat(this.roomId, this.onlineStatusEnum.Online);
      //   // this.pubnubService.initTelemedicine(this.roomId);
      // } else {
      //   this.startTmEncounter();
      // }
      this.getRoomDetail(this.roomId);
    }
    // this.endTmEncounter();
    if (!this.isCaller) {
      this.getBillingProviders();
    }
  }
  ngOnDestroy() {
    // this.initTMChat(this.roomId, this.onlineStatusEnum.OffLine);

    this.pubnubService.destroyTmSignalRConnection();
  }
  DetectMediaDevices() {
    return new Promise((resolve, reject) => {
      this.connection.DetectRTC.load(() => {
        resolve(this.connection.DetectRTC);
      });
    });
  }
  getRoomDetail(roomId: number) {
    this.teleMedicineService.GetRoomData(roomId).subscribe(
      (res: any) => {
        this.roomDetail = res;
      },
      (err: HttpResError) => {
        // this.isLoading = false;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  informBackend() {
    if (this.isCaller) {
      // this.initTMChat(this.roomId, this.onlineStatusEnum.Online);
      this.pubnubService.initTelemedicine(this.TmPatientId, this.tmToken);
    } else {
      this.startTmEncounter();
    }
  }
  // initTMChat(roomId: number, onlineStatus: number) {
  //   this.teleMedicineService
  //     .InitTmChatAndNotifyBP(roomId, onlineStatus)
  //     .subscribe(
  //       res => {
  //       this.pubnubService.initTelemedicine(this.roomId);
  //       },
  //       (err: HttpResError) => {
  //         // this.isLoading = false;
  //         this.toaster.error(err.error, err.message);
  //       }
  //     );
  // }
  startTmEncounter() {
    this.teleMedicineService.startTmEncounter(this.roomId).subscribe(res =>{});
  }
  getBillingProviders() {
    this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.subs.sink = this.facilityService
      .getBillingProviderByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.billingProviderList = res;
          }
        },
        error => {}
      );
  }
  retryConnection() {
    this.connection = new RTCMultiConnection(null, {
      useDefaultDevices: true
    });
    this.tmViewState = this.tmViewStateEnum.loading;
    this.initWebRtc(this.TeleCallobj);
  }
  initWebRtc(callParams: TeleCallDto) {
    this.connection.socketURL = 'https://muazkhan.com:9001/';
    // this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    this.connection.extra.userFullName = callParams.currentUserName;
    /// make this room public
    this.connection.publicRoomIdentifier = 'classRooms'; // this.params.publicRoomIdentifier;
    this.connection.socketMessageEvent = callParams.roomId; // this.params.sessionid;
    // keep room opened even if owner leaves
    this.connection.autoCloseEntireSession = true;
    // https://www.rtcmulticonnection.org/docs/maxParticipantsAllowed/
    this.connection.maxParticipantsAllowed = 10;
    // set value 2 for one-to-one connection
    // connection.maxParticipantsAllowed = 2;
    this.connection.chunkSize = 16000;
    this.connection.enableFileSharing = false;
    this.connection.autoSaveToDisk = false;
    this.connection.socketOptions['max reconnection attempts'] = 100;
    this.connection.session = {
      audio: true,
      video: true,
      data: true
    };
    this.connection.mediaConstraints = {
      audio: true,
      video: true
    };
    this.connection.iceServers = this.iceServersList;
    // this.connection.iceServers = [
    //   {
    //     "credential": null,
    //     "username": null,
    //     "url": "stun:global.stun.twilio.com:3478?transport=udp",
    //     "urls": "stun:global.stun.twilio.com:3478?transport=udp"
    //   },
    //   {
    //     "credential": "vBdWSE8sAMpi0Q2JQtUG+CPRjTuMQUvQNYNidWE62Po=",
    //     "username": "827e9e8dd0aada75c8b449780c2947b683d3c462897d77e040b945bb73d96421",
    //     "url": "turn:global.turn.twilio.com:3478?transport=udp",
    //     "urls": "turn:global.turn.twilio.com:3478?transport=udp"
    //   },
    //   {
    //     "credential": "vBdWSE8sAMpi0Q2JQtUG+CPRjTuMQUvQNYNidWE62Po=",
    //     "username": "827e9e8dd0aada75c8b449780c2947b683d3c462897d77e040b945bb73d96421",
    //     "url": "turn:global.turn.twilio.com:3478?transport=tcp",
    //     "urls": "turn:global.turn.twilio.com:3478?transport=tcp"
    //   },
    //   {
    //     "credential": "vBdWSE8sAMpi0Q2JQtUG+CPRjTuMQUvQNYNidWE62Po=",
    //     "username": "827e9e8dd0aada75c8b449780c2947b683d3c462897d77e040b945bb73d96421",
    //     "url": "turn:global.turn.twilio.com:443?transport=tcp",
    //     "urls": "turn:global.turn.twilio.com:443?transport=tcp"
    //   }
    // ];
    this.connection.userid = callParams.currentUserName;
    this.connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    };
    this.connection.onUserStatusChanged = event => {
      let names: string[] = [];
      this.connection.getAllParticipants().forEach(pid => {
        names.push(this.getFullName(pid));
      });
      if (!names.length) {
        names = ['Only You'];
      } else {
        names = [this.connection.extra.userFullName || 'You'].concat(names);
      }
      this.activeUserList = names;
      // this.UserStatusChanged.nativeElement.appendChild('<b>Active users:</b> ' + names.join(', '));
    };
    this.connection.onerror = e => {
      alert(e);
    };
    this.connection.onopen = event => {
      console.log('Connection iS Open');
    };
    this.connection.onclose = this.connection.onerror = this.connection.onleave = event => {
      this.connection.onUserStatusChanged(event);
    };
    this.connection.onmessage = event => {
      if (event.data.typing === true) {
        return;
      }
      if (event.data.typing === false) {
        return;
      }
      if (event.data.chatMessage) {
        return;
      }
      if (event.data.messageRecieved) {
        return;
      }
      if (event.data.callEnded) {
        this.toaster.warning('Session ended by Provider');
        this.isCounter = true;
        setTimeout(() => {
          window.location.href = 'https://2chealthsolutions.com';
          // window.close();
        }, 6000);
      }
      if (event.data.voiceData) {
        const { userid, isAudio } = event.data.voiceData;
        const mainuserid = this.connection.streamEvents.selectFirst({
          userid: userid
        }).stream;
        if (userid === this.connection.userid) {
          if (isAudio) {
            // mainuserid.mute('voice');
            this.localmainObject.isAudio = false;
            this.localmainObject.srcObject.getAudioTracks()[0].enabled = false;
          } else {
            this.localmainObject.isAudio = true;
            this.localmainObject.srcObject.getAudioTracks()[0].enabled = true;
            // mainuserid.unmute('voice');
          }
        }
      }
      if (event.data.videoData) {
        const { userid, isvideo } = event.data.videoData;
        const mainuserid = this.connection.streamEvents.selectFirst({
          userid: userid
        }).stream;
        if (userid === this.connection.userid) {
          if (isvideo) {
            // mainuserid.mute('video');
            this.localmainObject.isVideo = false;
            this.localmainObject.srcObject.getVideoTracks()[0].enabled = false;
          } else {
            // mainuserid.unmute('video');
            this.localmainObject.isVideo = true;
            this.localmainObject.srcObject.getVideoTracks()[0].enabled = true;
          }
        }
      }
    };
    this.connection.onMediaError = async (data) => {
      this.errorMessage = data;
      this.mediaInfo = await this.DetectMediaDevices();
      this.tmViewState = this.tmViewStateEnum.error;
      const jhsjd = '';
    };
    // extra code
    this.connection.onstream = event => {
      // if (event.stream.isScreen && !event.stream.canvasStream) {
      //     this.screenViewMainObject = {
      //         isAudio: false,
      //         streamId: event.streamid,
      //         srcObject: event.stream,
      //         isVideo: true,
      //         userId: event.userid
      //     };
      // } else
      if (event.type === 'local') {
        this.localmainObject = {
          isAudio: true,
          streamId: event.streamid,
          srcObject: event.stream,
          isVideo: true,
          userId: event.userid
        };
        this.tmViewState = this.tmViewStateEnum.success;
        this.informBackend();
        if (event.type === 'local') {
          //   this.mainDivVideo.nativeElement.muted = true;
          //   this.mainDivVideo.nativeElement.volume = 0;
        }
      } else {
        const newStreamObject: IClassSession = {
          userId: event.userid,
          srcObject: event.stream,
          isAudio: true,
          isVideo: true,
          streamId: event.streamid
        };
        this.otherVideoObjects.push(newStreamObject);
      }
      this.cdtr.detectChanges();
      this.connection.onUserStatusChanged(event);
    };
    this.connection.onstreamended = (event: IStreamEvent) => {
      if (
        this.localmainObject &&
        this.localmainObject.streamId === event.stream.id
      ) {
        this.localmainObject = null;
        return;
      }
      // if (this.screenViewMainObject && (this.screenViewMainObject.streamId === event.stream.id)) {
      //     this.screenViewMainObject = null;
      //     return;
      // }
      const index = this.otherVideoObjects.findIndex(
        vd => vd.streamId === event.stream.id
      );
      if (index >= 0) {
        this.otherVideoObjects.splice(index, 1);
      }
    };
    this.connection.onmute = e => {
      if (!e.mediaElement) {
        return;
      }
      if (e.muteType === 'both' || e.muteType === 'video') {
        e.mediaElement.srcObject = null;
        e.mediaElement.pause();
        e.mediaElement.poster =
          e.snapshot || 'https://cdn.webrtc-experiment.com/images/muted.png';
        if (this.localmainObject.userId === e.userid) {
          this.localmainObject.isVideo = false;
        } else {
          this.otherVideoObjects.forEach(othr => {
            if (othr.userId === e.userid) {
              othr.isVideo = false;
            }
          });
        }
      } else if (e.muteType === 'voice') {
        e.mediaElement.muted = true;
        if (this.localmainObject.userId === e.userid) {
          this.localmainObject.isAudio = false;
          const audioStream = e.stream.getAudioTracks()[0];
          audioStream.enabled = false;
        } else {
          this.otherVideoObjects.forEach(othr => {
            if (othr.userId === e.userid) {
              othr.isAudio = false;
            }
          });
        }
        // const trgtdiv: any = document.getElementById(e.userid);
        // trgtdiv.muted = true;
      }
    };
    this.connection.onunmute = e => {
      if (!e.mediaElement) {
        return;
      }
      if (e.unmuteType === 'both' || e.unmuteType === 'video') {
        e.mediaElement.poster = null;
        e.mediaElement.srcObject = e.stream;
        e.mediaElement.play();
        if (this.localmainObject.userId === e.userid) {
          this.localmainObject.isVideo = true;
        } else {
          this.otherVideoObjects.forEach(othr => {
            if (othr.userId === e.userid) {
              othr.isVideo = true;
            }
          });
        }
      } else if (e.unmuteType === 'voice') {
        // e.mediaElement.muted = false;
        if (this.localmainObject.userId === e.userid) {
          this.localmainObject.isAudio = true;
          const audioStream = e.stream.getAudioTracks()[0];
          audioStream.enabled = true;
        } else {
          this.otherVideoObjects.forEach(othr => {
            if (othr.userId === e.userid) {
              othr.isAudio = true;
            }
          });
        }
        // const trgtdiv: any = document.getElementById(e.userid);
        // trgtdiv.muted = false;
      }
    };
    // if (!!this.params.password) {
    //   this.connection.password = this.params.password;
    // }
    if (this.isCaller === true) {
      this.connection.extra.roomOwner = true;
      this.connection.open(callParams.roomId, (isRoomOpened, roomid, error) => {
        if (error) {
          if (error === this.connection.errors.ROOM_NOT_AVAILABLE) {
            alert(
              'Someone already created this room. Please either join or create a separate room.'
            );
            return;
          }
          alert(error);
        }
        this.connection.socket.on('disconnect', () => {
          //   location.reload();
          console.log('Socket Disconnected');
        });
        this.connection.socket.on('reconnect', () => {
          console.log('Socket Reconnected');
          // this.connnection.open();
          if (this.isCaller === true) {
            this.connection.open(callParams.roomId);
            setTimeout(() => {
              this.connection.renegotiate();
            }, 2000);
          }
        });
      });
    } else {
      this.connection.join(callParams.roomId, (isRoomJoined, roomid, error) => {
        if (error) {
          if (error === this.connection.errors.ROOM_NOT_AVAILABLE) {
            alert(
              'This room does not exist. Please either create it or wait for moderator to enter in the room.'
            );
            return;
          }
          if (error === this.connection.errors.ROOM_FULL) {
            alert('Room is full.');
            return;
          }
          if (error === this.connection.errors.INVALID_PASSWORD) {
            this.connection.password =
              prompt('Please enter room password.') || '';
            if (!this.connection.password.length) {
              alert('Invalid password.');
              return;
            }
            // tslint:disable-next-line:no-shadowed-variable
            this.connection.join(
              callParams.roomId,
              (isRoomJoined, roomid, error) => {
                if (error) {
                  alert(error);
                }
              }
            );
            return;
          }
          alert(error);
        }
        this.connection.socket.on('disconnect', () => {
          //   location.reload();
          console.log('Socket Disconnected');
          // alert('Socket Disconnected Please Refresh the Page');
        });
        this.connection.socket.on('reconnect', () => {
          console.log('Socket Reconnected');
          if (this.isCaller === false) {
            this.connection.rejoin(callParams.roomId);
            setTimeout(() => {
              this.connection.renegotiate();
            }, 2000);
          }
        });
      });
    }
  }
  getFullName(userid) {
    let _userFullName = userid;
    if (
      this.connection.peers[userid] &&
      this.connection.peers[userid].extra.userFullName
    ) {
      _userFullName = this.connection.peers[userid].extra.userFullName;
    }
    return _userFullName;
  }
  muteOrUnmuteMainDivVoice(userId, isAudio) {
    // if (true) {
      const mainuserid = this.connection.streamEvents.selectFirst({
        userid: userId
      }).stream;
      if (mainuserid.type === 'local') {
        if (isAudio) {
          // mainuserid.mute('voice');
          this.localmainObject.isAudio = false;
          this.localmainObject.srcObject.getAudioTracks()[0].enabled = false;
          if (this.otherVideoObjects.length > 0) {
            this.connection.send({
              patientMicState: { userid: this.otherVideoObjects[0].userId, isAudioOn: false }
            });
          }
        } else {
          this.localmainObject.isAudio = true;
          this.localmainObject.srcObject.getAudioTracks()[0].enabled = true;
          if (this.otherVideoObjects.length > 0) {
            this.connection.send({
              patientMicState: { userid: this.otherVideoObjects[0].userId, isAudioOn: true }
            });
          }
          // mainuserid.unmute('voice');
        }
      } else {
        this.connection.send({
          voiceData: { userid: userId, isaudio: isAudio }
        });
      }
    //  else {
    //   alert("UnAuthorize Action");
    // }
    // this.mainDivVideo.nativeElement.captureStream().getAudioTracks()[0].enabled = this.mainDivVoice;
    // this.connection.send({
    //     mainVideoStreamVoice: this.mainDivVoice
    // });
  }
  muteOrUnmuteMainDivVideo(userId, isVideo) {
    // if (this.isCaller === true) {
      const mainuserid = this.connection.streamEvents.selectFirst({
        userid: userId
      }).stream;
      if (mainuserid.type === 'local') {
        if (isVideo) {
          this.localmainObject.isVideo = false;
          this.localmainObject.srcObject.getVideoTracks()[0].enabled = false;
          if (this.otherVideoObjects.length > 0) {
            this.connection.send({
              patientCamState: { userid: this.otherVideoObjects[0].userId, isvideoOn: false }
            });
          }
          // mainuserid.mute('video');
        } else {
          this.localmainObject.isVideo = true;
          this.localmainObject.srcObject.getVideoTracks()[0].enabled = true;
          if (this.otherVideoObjects.length > 0) {
            this.connection.send({
              patientCamState: { userid: this.otherVideoObjects[0].userId, isvideoOn: true }
            });
          }
          // mainuserid.unmute('video');
        }
      } else {
        this.connection.send({
          videoData: { userid: userId, isvideo: isVideo }
        });
      }
    // } else {
    //   alert('UnAuthorize Action');
    // }
  }
  endOngoingCall() {
    // this.onGoingCallDto.actionType = CallActionEnum.Dropped;
    // this.pubnubService.publishPubnubMessage(this.getParticipentUserName() + '-VideoChat', this.onGoingCallDto);
    // this.leaveRoomAndCloseModal();
    // this.callingService.ActiveOnAnotherCall = false;
    if (confirm('Do you want to end this call?')) {
      this.destroyStreams();
      if (!this.isCaller) {
        this.connection.send({
          callEnded: true
        });
      }
      // const myWindow = window.open('', '_self', '');
      // myWindow.document.write('');
      // myWindow.close();
      // this.closeWindow();
      window.location.href = 'https://2chealthsolutions.com';
    }
  }
  closeWindow() {
    this.isCounter = true;
    setTimeout(() => {
      window.close();
    }, 6000);
  }
  calculateDuration() {
    if(this.checkDuration) {
    const startTime = moment(this.encounterData.startedTime, 'YYYY-MM-DD h:mm:ss a');
    const endTime = moment(this.encounterData.completedTime, 'YYYY-MM-DD h:mm:ss a');
    const calculateDuration = moment.duration(endTime.diff(startTime));
    const res = startTime.isBefore(endTime);
    if (res === false) {
    // this.durationError = true;
    this.toaster.warning('Start time must before end time');
    return;
    }
    const hh = calculateDuration.hours().toString().length > 1 ? calculateDuration.hours() : '0' + calculateDuration.hours();
    const mm = calculateDuration.minutes().toString().length > 1 ? calculateDuration.minutes() : '0' + calculateDuration.minutes();
    const ss = calculateDuration.seconds().toString().length > 1 ? calculateDuration.seconds() : '0' + calculateDuration.seconds();
    this.encounterData.encounterDuration = hh + ':' + mm + ':' + ss;
  }
}

  endTmEncounter() {
    this.teleMedicineService
      .endTMEncounter(this.roomId)
      .subscribe((res: submitTmEncounterData) => {
       res.startedTime = moment.utc(res.startedTime).local().format('YYYY-MM-DD h:mm:ss a');
       res.completedTime = moment.utc(res.completedTime).local().format('YYYY-MM-DD h:mm:ss a');
        this.encounterData = res;
      },
      (err: HttpResError) => {
        // this.isLoading = false;
        this.toaster.error(err.error, err.message);
      });
  }
  submitTMEncounter() {
    this.encounterData.encounterId = this.roomId;
    this.encounterData.completedTime =  moment.utc(moment(this.encounterData.completedTime, 'YYYY-MM-DD h:mm:ss a')).format('YYYY-MM-DD HH:mm:ssZ');
    this.encounterData.startedTime =  moment.utc(moment(this.encounterData.startedTime, 'YYYY-MM-DD h:mm:ss a')).format('YYYY-MM-DD HH:mm:ssZ');
    this.teleMedicineService
      .submitTMEncounter(this.encounterData)
      .subscribe(
        (res: any) => {
          this.submitEncounterModal.hide();
          this.isCounter = true;
          this.connection.send({
            callEnded: true
          });
          setTimeout(() => {
            // window.close();
            window.location.href = 'https://2chealthsolutions.com';
          }, 1000);
          // this.animateCount();
          // this.counter.startAt = 5;
          // this.counter.counterState.subscribe((msg)=>{
          //   if(msg==='COMPLETE') {
          //     // this.counterState = 'counter has stopped';
          //     window.close();
          //   }
          // });

        },
        (err: HttpResError) => {
          // this.isLoading = false;
          this.toaster.error(err.error, err.message);
        });
  }

  animateCount() {
    let _this = this;
    let single = this.oneItem.nativeElement.innerHTML;
    this.counterFunc(single, this.oneItem, 7000);

    this.count.forEach(item => {
      if (item) {
        _this.counterFunc(item.nativeElement.innerHTML, item, 2000);
      }
    });
  }

  counterFunc(end: number, element: any, duration: number) {
    let range, current: number, step, timer;

    range = end - 0;
    current = 0;
    step = Math.abs(Math.floor(duration / range));

    timer = setInterval(() => {
      current += 1;
      element.nativeElement.textContent = current;
      if (current === end) {
        clearInterval(timer);
      }
    }, step);

  }
  destroyStreams() {
    if (this.otherStreams && this.otherStreams.nativeElement.srcObject) {
      this.otherStreams.nativeElement.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    }
    if (this.myStram && this.myStram.nativeElement.srcObject) {
      this.myStram.nativeElement.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
    }
  }
  editEncounterNote() {
    if (this.note) {
      this.teleMedicineService.editEncounterNote(this.roomId , this.note).subscribe(res => {
      this.toaster.success('Added note Succesfully');
      }, (err: HttpResError) => {
        this.toaster.error(err.error, err.message);
      });
    }
  }
  getEncounterNote() {
    this.teleMedicineService.getEncounterNote(this.roomId).subscribe((res: string) => {
      this.getNoteText = res;
      }, (err: HttpResError) => {
        this.toaster.error(err.error, err.message);
      });
  }
}
class TeleCallDto {
  roomId: string;
  currentUserName: string;
}
export enum OnlineStatus {
  OffLine = 0,
  Online = 1
}
