import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import * as RTCMultiConnection from 'rtcmulticonnection';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { HttpResError } from 'src/app/model/common/http-response-error.js';
import { IClassSession, IStreamEvent, AVCallDto, CallActionEnum, AvChattViewEnum } from 'src/app/model/chat/chat.model';
import { PubnubChatService } from 'src/app/core/pubnub-chat.service';
import { VideoCallingService } from 'src/app/core/video-calling.service';
import { ToastService } from 'ng-uikit-pro-standard';

@Component({
  selector: 'app-video-calling',
  templateUrl: './video-calling.component.html',
  styleUrls: ['./video-calling.component.scss']
})
export class VideoCallingComponent implements OnInit, OnDestroy {
  viewType: AvChattViewEnum;
  connection = new RTCMultiConnection(null, {
    useDefaultDevices: true
  });
  @ViewChild('screenShareDiv') SharedScreenDiv: ElementRef;
  inBounds = true;
  modalHeader = 'Video Call';
  isCaller: boolean;
  zIndex = '2000';
  position = {x: 50, y: 50};
  myBounds: HTMLElement;
  edge = {
    top: true,
    bottom: true,
    left: true,
    right: true
  };
  activeUserList: string[] = [];
  screenViewMainObject: IClassSession = null;
  localmainObject: IClassSession = null;
  otherVideoObjects: IClassSession[] = [];
  onGoingCallDto = new AVCallDto();
  iceServersList = [];

  constructor(private securityService: SecurityService, private cdtr: ChangeDetectorRef, private pubnubService: PubnubChatService, private callingService: VideoCallingService,
    private toaster: ToastService) {
    this.pubnubService.avCallSubject.subscribe((data: AVCallDto) => {
      // this.someOneISCalling(data);
      this.AvNewSignal(data);
    });
    this.getIceServers();
  }

  ngOnInit() {
    this.myBounds = document.getElementById('myBoundsId') as HTMLElement;
    // this.securityService.securityObject.userType === UserType.FacilityUser ? this.open = true : this.open = false;
    // this.initWebRtc();
    this.getReadyToMakeNewCall();
  }
  getIceServers() {
    this.pubnubService.getIceServers().subscribe((res: any) => {
      this.iceServersList = res.ice_servers;
    });
  }
  ngOnDestroy() {
    if (this.viewType === AvChattViewEnum.callISActive) {
      this.endOngoingCall();
    }
    this.leaveRoomAndCloseModal();
  }
  getReadyToMakeNewCall() {
    this.callingService.newCallReqSubject.subscribe((data: AVCallDto) => {
      this.makeCall(data);
    });
  }
  initWebRtc(callParams: AVCallDto) {
    console.log(this.iceServersList);
    this.connection.socketURL = 'https://muazkhan.com:9001/';
    // this.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
    this.connection.extra.userFullName = this.securityService.securityObject.fullName;
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
    this.connection.enableFileSharing = true;
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
    // [
    //   {
    //     urls: [
    //       'stun:webrtcweb.com:7788',
    //       'stun:webrtcweb.com:7788?transport=udp'
    //     ],
    //     username: 'muazkh',
    //     credential: 'muazkh'
    //   },
    //   {
    //     urls: [
    //       'turn:webrtcweb.com:7788',
    //       'turn:webrtcweb.com:4455?transport=udp',
    //       'turn:webrtcweb.com:8877?transport=udp',
    //       'turn:webrtcweb.com:8877?transport=tcp'
    //     ],
    //     username: 'muazkh',
    //     credential: 'muazkh'
    //   },
    //   {
    //     urls: [
    //       'stun:stun.l.google.com:19302',
    //       'stun:stun1.l.google.com:19302',
    //       'stun:stun2.l.google.com:19302',
    //       'stun:stun.l.google.com:19302?transport=udp'
    //     ]
    //   }
    // ];
    this.connection.userid = this.securityService.securityObject.fullName;
    this.connection.sdpConstraints.mandatory = {
      OfferToReceiveAudio: true,
      OfferToReceiveVideo: true
    };
    this.connection.onUserStatusChanged = (event) => {
      let names: string[] = [];
      this.connection.getAllParticipants().forEach((pid) => {
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
    this.connection.onerror = (e) => {
      alert(e);
    };
    this.connection.onopen = (event) => {
      console.log('Connection iS Open');
    };
    this.connection.onclose = this.connection.onerror = this.connection.onleave = (event) => {
      this.connection.onUserStatusChanged(event);
    };
    this.connection.onmessage = (event) => {
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
      if (event.data.voiceData) {
          const { userid, isaudio } = event.data.voiceData;
          const mainuserid = this.connection.streamEvents.selectFirst({ userid: userid }).stream;
          if (userid === this.connection.userid) {
              if (isaudio) {
                  mainuserid.mute('voice');
              } else {
                  mainuserid.unmute('voice');
              }
          }
      }
      if (event.data.videoData) {
          const { userid, isvideo } = event.data.voiceData;
          const mainuserid = this.connection.streamEvents.selectFirst({ userid: userid }).stream;
          if (userid === this.connection.userid) {
              if (isvideo) {
                  mainuserid.mute('video');
              } else {
                  mainuserid.unmute('video');
              }
          }
      }
    };
  // extra code
    this.connection.onstream = (event) => {
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
        if (this.localmainObject && (this.localmainObject.streamId === event.stream.id)) {
            this.localmainObject = null;
            return;
        }
        if (this.screenViewMainObject && (this.screenViewMainObject.streamId === event.stream.id)) {
            this.screenViewMainObject = null;
            return;
        }
        const index = this.otherVideoObjects.findIndex(vd => vd.streamId === event.stream.id);
        if (index >= 0) {
            this.otherVideoObjects.splice(index, 1);
        }
    };
    this.connection.onmute = (e) => {
        if (!e.mediaElement) {
            return;
        }
        if (e.muteType === 'both' || e.muteType === 'video') {
            e.mediaElement.srcObject = null;
            e.mediaElement.pause();
            e.mediaElement.poster = e.snapshot || 'https://cdn.webrtc-experiment.com/images/muted.png';
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
    this.connection.onunmute = (e) => {
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
            e.mediaElement.muted = false;
            if (this.localmainObject.userId === e.userid) {
                this.localmainObject.isAudio = true;
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
    if (this.isCaller === true ) {
      this.connection.extra.roomOwner = true;
      this.connection.open(callParams.roomId, (isRoomOpened, roomid, error) => {
          if (error) {
              if (error === this.connection.errors.ROOM_NOT_AVAILABLE) {
                  alert('Someone already created this room. Please either join or create a separate room.');
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
                  alert('This room does not exist. Please either create it or wait for moderator to enter in the room.');
                  return;
              }
              if (error === this.connection.errors.ROOM_FULL) {
                  alert('Room is full.');
                  return;
              }
              if (error === this.connection.errors.INVALID_PASSWORD) {
                  this.connection.password = prompt('Please enter room password.') || '';
                  if (!this.connection.password.length) {
                      alert('Invalid password.');
                      return;
                  }
                  // tslint:disable-next-line:no-shadowed-variable
                  this.connection.join(callParams.roomId, (isRoomJoined, roomid, error) => {
                      if (error) {
                          alert(error);
                      }
                  });
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
    if (this.connection.peers[userid] && this.connection.peers[userid].extra.userFullName) {
        _userFullName = this.connection.peers[userid].extra.userFullName;
    }
    return _userFullName;
  }
  toggleFullScreen(htmlElement) {
    if (htmlElement.requestFullscreen) {
      htmlElement.requestFullscreen();
    } else if (htmlElement.mozRequestFullScreen) {
      htmlElement.mozRequestFullScreen();
    } else if (htmlElement.webkitRequestFullscreen) {
      htmlElement.webkitRequestFullscreen();
    } else if (htmlElement.msRequestFullscreen) {
      htmlElement.msRequestFullscreen();
    }
  }
  leaveRoomAndCloseModal() {
    this.callingService.ActiveOnAnotherCall = false;
    this.viewType = null;
    this.isCaller = null;
    // if (confirm('Do You Want To Leave Room')) {
         // disconnect with all users
        this.connection.getAllParticipants().forEach((pid) => {
            this.connection.disconnectWith(pid);
        });

        // stop all local cameras
        this.connection.attachStreams.forEach((localStream) => {
            localStream.stop();
        });

        // close socket.io connection
        this.connection.closeSocket();
    //     window.close();
    // }
  }
  muteOrUnmuteMainDivVoice(userId, isAudio) {
    if (true) {
        const mainuserid = this.connection.streamEvents.selectFirst({ userid: userId }).stream;
        if (mainuserid.type === 'local') {
            if (isAudio) {
                mainuserid.mute('voice');
            } else {
                mainuserid.unmute('voice');
            }
        } else {
            this.connection.send({ voiceData: { userid: userId, isaudio: isAudio } });
        }
    } else {
        alert('UnAuthorize Action');
    }
    // this.mainDivVideo.nativeElement.captureStream().getAudioTracks()[0].enabled = this.mainDivVoice;
    // this.connection.send({
    //     mainVideoStreamVoice: this.mainDivVoice
    // });
  }
  muteOrUnmuteMainDivVideo(userId, isVideo) {
    if (this.isCaller === true) {
          const mainuserid = this.connection.streamEvents.selectFirst({ userid: userId }).stream;
          if (mainuserid.type === 'local') {
              if (isVideo) {
                  mainuserid.mute('video');
              } else {
                  mainuserid.unmute('video');
              }
          } else {
              this.connection.send({ videoData: { userid: userId, isvideo: isVideo } });
          }
      } else {
          alert('UnAuthorize Action');
      }
  }
  async makeCall(CallDto: AVCallDto) {
    const isOnline = await this.pubnubService.invokeSignalrMethod('PingUser', CallDto.participentUserName);
    if (isOnline === true) {
      this.onGoingCallDto = CallDto;
      this.isCaller = true;
      this.viewType = AvChattViewEnum.callingOther;
      this.pubnubService.SendVideoChatMessage('PublishAVChatMessage', this.onGoingCallDto, this.onGoingCallDto.participentName);
      this.initWebRtc(CallDto);
      this.callingService.ActiveOnAnotherCall = true;
    } else {
      this.toaster.info(`Can't make a Call .This User is currently offline`);
    }
    // this.pubnubService.getPresence(CallDto.participentUserName).then(
    //   resp => {
    //     // Success
    //     if (resp && resp.totalOccupancy > 0) {
    //       this.onGoingCallDto = CallDto;
    //       this.isCaller = true;
    //       this.viewType = AvChattViewEnum.callingOther;
    //       this.pubnubService.publishPubnubMessage(this.onGoingCallDto.participentUserName + '-VideoChat', this.onGoingCallDto);
    //       this.initWebRtc(CallDto);
    //       this.callingService.ActiveOnAnotherCall = true;
    //     } else {
    //       this.toaster.info(`Can't make a Call .This User is currently offline`);
    //     }
    //   },
    //   msg => {
    //     this.toaster.error(msg);
    //   }
    // );
  }

  AvNewSignal(sData: AVCallDto) {
    this.onGoingCallDto = sData;
    if (sData.actionType === CallActionEnum.AVCall) {
      this.viewType = AvChattViewEnum.someOneCallingMe;
    } else if (sData.actionType === CallActionEnum.Received) {
      this.viewType = AvChattViewEnum.callISActive;
    } else if (sData.actionType === CallActionEnum.Declined) {
      this.leaveRoomAndCloseModal();
      this.toaster.warning('Call Declined by Participent');
    } else if (sData.actionType === CallActionEnum.OnAnotherCall) {
      this.toaster.warning('User is busy on another call');
      this.leaveRoomAndCloseModal();
    } else if (sData.actionType === CallActionEnum.Dropped) {
      this.toaster.warning('Call Dropped');
      this.leaveRoomAndCloseModal();
    }
  }
  endOngoingCall() {
    this.onGoingCallDto.actionType = CallActionEnum.Dropped;
    // this.pubnubService.publishPubnubMessage(this.getParticipentUserName() + '-VideoChat', this.onGoingCallDto);
    this.pubnubService.SendVideoChatMessage('PublishAVChatMessage', this.onGoingCallDto, this.getParticipentUserName());
    this.leaveRoomAndCloseModal();
    this.callingService.ActiveOnAnotherCall = false;
  }
  DeclineCall() {
    this.isCaller = false;
    this.onGoingCallDto.actionType = CallActionEnum.Declined;
    // this.pubnubService.publishPubnubMessage(this.getParticipentUserName() + '-VideoChat', this.onGoingCallDto);
    this.pubnubService.SendVideoChatMessage('PublishAVChatMessage', this.onGoingCallDto, this.getParticipentUserName());
    this.leaveRoomAndCloseModal();
    this.callingService.ActiveOnAnotherCall = false;
  }
  getParticipentUserName(): string {
    if (this.isCaller) {
      return this.onGoingCallDto.participentUserName;
    } else {
      return this.onGoingCallDto.callerUserName;
    }
  }
  receiveOngoingCall() {
    this.isCaller = false;
    this.initWebRtc(this.onGoingCallDto);
    this.viewType = AvChattViewEnum.callISActive;
    this.onGoingCallDto.actionType = CallActionEnum.Received;
    // this.pubnubService.publishPubnubMessage(this.onGoingCallDto.callerUserName + '-VideoChat', this.onGoingCallDto);
    this.pubnubService.SendVideoChatMessage('PublishAVChatMessage', this.onGoingCallDto, this.onGoingCallDto.callerUserName);
    this.callingService.ActiveOnAnotherCall = true;
  }
}
