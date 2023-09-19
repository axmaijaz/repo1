import { SpeechToTextService } from './core/Tools/speech-to-text.service';
import { Component, OnInit, ViewContainerRef, ViewChild, AfterViewInit, AfterContentChecked, HostListener, ChangeDetectorRef } from '@angular/core';
import { SecurityService } from './core/security/security.service';
import { AppUiService } from './core/app-ui.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwUpdate } from '@angular/service-worker';
import { Router, NavigationStart, NavigationCancel, NavigationError, NavigationEnd, ActivatedRoute } from '@angular/router';
import { PubnubChatService } from './core/pubnub-chat.service';
// import { AppDataService } from './core/app-data.service';
import { LazyLoaderService } from './core/Lazy/lazy-loader.service';
import { VideoCallingService } from './core/video-calling.service';
import * as LogRocket from 'logrocket';
import { environment } from 'src/environments/environment';
// import { HubSateEnum } from './model/chat/chat.model';
import moment from 'moment';
import { RCVIewState } from './model/AppModels/app.model';
import { UserType } from './Enums/UserType.enum';
import { EmitEvent, EventBusService, EventTypes } from './core/event-bus.service';
import { HttpResError } from './model/common/http-response-error';
import { ToastService } from 'ng-uikit-pro-standard';
import { RpmService } from './core/rpm.service';
import { RingCentralService } from './core/RingCentral/ring-central.service';
import { AccountState } from './model/security/app-user.auth';
import { AuthActivityService } from './core/listners/auth-activity.service';
import { BrandingService } from './core/branding.service';
import { AppDataService } from './core/app-data.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']

})
export class AppComponent implements OnInit, AfterViewInit {
// globleSpinner = 'globleSpinner';
isProduction = environment.production;
showLoadingSpinner = true;
// connectionState: HubSateEnum;
// hubSateEnum = HubSateEnum;
rcVIew: RCVIewState = RCVIewState.minimize;
rcVIewEnum = RCVIewState;
colorForConnectionState = '';
passwordKey = '';
isScreenLocked = false;
unlockingProcess = false;
position = {x: 50, y: 50};
myBounds: HTMLElement;
edge = {
  top: true,
  bottom: true,
  left: true,
  right: true
};
  @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  @ViewChild('lazyConsentConfirmContainer', { read: ViewContainerRef }) lazyConsentConfirmContainer: ViewContainerRef;
  @ViewChild('lazyConfirmContainer', { read: ViewContainerRef }) lazyConfirmContainer: ViewContainerRef;
  @ViewChild('lazyAppMOdalComponent', { read: ViewContainerRef }) lazyAppMOdalComponent: ViewContainerRef;
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event) {
    this.speechToText.stop();
    return true;
  }
  constructor(private securityService: SecurityService, private appUi: AppUiService, private brandingService: BrandingService,
    private spinner: NgxSpinnerService, private lazyLoader: LazyLoaderService,
    private route: ActivatedRoute, public appData: AppDataService, private cdr: ChangeDetectorRef,
    private chatService: PubnubChatService, private eventBus: EventBusService, private toaster: ToastService, private rpmService: RpmService,
    private videoService: VideoCallingService, private rcService: RingCentralService,
    // private appUiService: AppUiService,
    private sw: SwUpdate, private speechToText: SpeechToTextService,
    private router: Router, private authActivity: AuthActivityService
    ) {
      if (this.toaster?.toastConfig) {
        this.toaster.toastConfig.maxOpened = 4;
        this.toaster.toastConfig.preventDuplicates = true;
      }
      this.tryLockScreen();
      // event call when click on browser tab
      document.addEventListener('visibilitychange', (event) => {
        this.tryLockScreen();
        // const isExpired = securityService.isRefreshTokenExpired();
        const isExpired = securityService.isAccessTokenExpired();
        if (isExpired) {
          router.navigateByUrl('/login', {queryParams: {reason: 'Refresh Token Expired'}});
          securityService.logout();
        } else {
          const timeStamp = localStorage.getItem('timeStamp');
          if (timeStamp) {
            const todayDate = moment().format('YYYY-MM-DD');
            const proceedUpdate = moment(timeStamp).isBefore(todayDate);
            if (proceedUpdate) {
              securityService.ResetToken();
            }
          }
          this.authActivity.FacilityChangeCheck();
          const facilityId = +this.securityService.getClaim("FacilityId")?.claimValue;
          if(facilityId){
            this.authActivity.GetFacilityActiveState(facilityId).subscribe((res: boolean) => {
              if(res == false){
                this.securityService.logout();
              }
            }, (err: HttpResError) => {
              this.toaster.error(err.error);
            })
          }
        }
        // if (document.hidden){
        //     console.log("Browser tab is hidden")
        // } else {
        //     console.log("Browser tab is visible")
        // }
      });
      onkeydown = onkeydown = (event) => {
        if (window.location.href.includes('login')) {
          return;
        }
        if (event.ctrlKey && event.key === 'l' && !localStorage.getItem('screenLocked')) {
          event.stopPropagation();
          event.preventDefault();
          localStorage.setItem('screenLocked', 'true');
          this.tryLockScreen();
        }
        if (event.ctrlKey && event.key === '2') {
          event.stopPropagation();
          event.preventDefault();
          const appToken = securityService.securityObject?.bearerToken;
          if (appToken) {
            navigator.clipboard.writeText('Bearer ' + appToken);
            this.toaster.info('Token copied');
          }
        }
        if (event.ctrlKey && event.altKey && event.key === '3') {
          event.stopPropagation();
          event.preventDefault();
          const hasSwitchLocal = localStorage.getItem('switchLocal') ? true : false;
          if (hasSwitchLocal) {
            localStorage.removeItem('switchLocal');
            this.toaster.info('Live environment enabled');
          } else {
            localStorage.setItem('switchLocal', 'true');
            this.toaster.info('Local environment enabled');
          }
          location.reload();
        }
        if ((event.ctrlKey && event.code == 'F5') || (event.metaKey && event.code == 'KeyR')) {
          localStorage.setItem('refreshTokenRequest', 'yes')
        }
      };
      this.authActivity.CheckForRefreshTokenRequest()
  }

  ngOnInit(): void {
    this.myBounds = document.getElementById('myBoundsId') as HTMLElement;
    this.brandingService.ApplyDefaultDefault();
    const securityObjectstring = localStorage.getItem('securityData');
    if (securityObjectstring) {
      this.securityService.securityObject = JSON.parse(securityObjectstring);
      this.chatService.InitPubnubChat();
      this.chatService.InitSignalrChat();
      this.brandingService.ApplyBranding();
      this.rcService.TryGetRcToken();
      this.appUi.SavePageLoadActions()
      this.speechToText.init();
      // setTimeout(() => {
      //   this.speechToText.start();
      // }, 1000);
    }

    // this.sw.available.subscribe(event => {
    //   if (confirm('New Update is Available, do you want to update?')) {
    //     // window.location.href = window.location.href;
    //     // window.applicationCache.
    //     this.sw.activateUpdate().then(() => window.location.reload(true));
    //   }
    // });
    this.ReadyToLoadCalling();
    this.ReadyToLoadConfirmation();
    this.ReadyToLoadConsentConfirmation();
    // this.WatchHubConnectionState();
    this.WatchEventBus();
    this.initializeRc();
  }
  ngAfterViewInit(): void {


    this.appUi.AppLoading.asObservable().subscribe((r: boolean) => {
      if (Boolean(r)) {
        if (r === true) {
          this.showLoadingSpinner = true;
          // this.spinner.show('globleSpinner');
        } else {
          // this.spinner.hide('globleSpinner');
          this.showLoadingSpinner = false;
        }
      } else {
        // this.spinner.hide('globleSpinner');
        this.showLoadingSpinner = false;
      }
      this.cdr.detectChanges();
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {

        // this.spinner.show('globleSpinner');
        this.showLoadingSpinner = true;

      } else if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        // this.spinner.hide('globleSpinner');
        this.showLoadingSpinner = false;
      }
      this.cdr.detectChanges();
    });
    this.loadConfirmation();
    this.loadConsentConfirmation();
    // this.embedRingCentral();
  }
  // embedRingCentral() {
  //   const rcs = document.createElement('script');
  //   rcs.src = 'https://ringcentral.github.io/ringcentral-embeddable/adapter.js';
  //   const rcs0 = document.getElementsByTagName('script')[0];
  //   rcs0.parentNode.insertBefore(rcs, rcs0);
  // }
  // ngAfterContentChecked(): void {
  //   if (this.securityService.securityObject.isAuthenticated) {
  //     // LogRocket.init(environment.logrocket);
  //     // LogRocket.identify(this.securityService.securityObject.fullName, {
  //     //   name: this.securityService.securityObject.fullName,
  //     //   email: this.securityService.securityObject.userName,
  //     //   // Add your own custom user variables here, ie:
  //     //   // subscriptionType: 'pro'
  //     // });
  //     this.embedRingCentral();
  //   }
  // }
  ReadyToLoadCalling() {
    this.videoService.loadCallingSubject.subscribe((val: boolean) => {
      this.loadVideo();
    });
  }
  ReadyToLoadConfirmation() {
    this.appUi.lazyConfirmationSubject.subscribe((val: boolean) => {
      this.loadConfirmation();
    });
  }
  async loadVideo(): Promise<boolean> {
    this.container.clear();
    const res = await this.lazyLoader.load('lazyVideo', this.container).then(() => {
      this.videoService.isCallingComponentLoaded = true;
      this.videoService.isCallingComponentLoadedSubject.next(true);
    });
    return true;
  }
  ReadyToLoadConsentConfirmation() {
    this.appUi.lazyConsentConfirmationSubject.subscribe((val: boolean) => {
      this.loadConsentConfirmation();
    });
  }
  async loadConsentConfirmation(): Promise<boolean> {
    this.lazyConsentConfirmContainer.clear();
    const res = await this.lazyLoader.load('lazyConsentModal', this.lazyConsentConfirmContainer).then(() => {
      this.appUi.isLazyConsentLoaded = true;
    });
    return true;
  }
  async loadConfirmation(): Promise<boolean> {
    this.lazyConfirmContainer.clear();
    const res = await this.lazyLoader.load('lazyConfirm', this.lazyConfirmContainer).then(() => {
      this.appUi.isLazyConfirmationLoaded = true;
    });
    return true;
  }
  // WatchHubConnectionState() {
  //   this.chatService.hubConnectionStateSUbject.asObservable().subscribe((stateVal: HubSateEnum) => {
  //     this.connectionState = stateVal;
  //     if (location.href?.includes('insights') || location.href?.includes('customUrl')) {
  //       this.connectionState = null;
  //     }
  //     if (stateVal === HubSateEnum.Connected) {
  //       this.colorForConnectionState = 'state-success';
  //     }
  //     if (stateVal === HubSateEnum['Re Connecting']) {
  //       this.colorForConnectionState = 'state-warning';
  //     }
  //     if (stateVal === HubSateEnum.Disconnected || stateVal === HubSateEnum['Connection Error']) {
  //       this.colorForConnectionState = 'state-danger';
  //     }
  //   });
  // }
  WatchEventBus() {
    this.eventBus.on(EventTypes.ScreenLocked).subscribe((res) => {
      this.tryLockScreen();
    });
    this.eventBus.on(EventTypes.LoginLogout).subscribe((res: AccountState) => {
      if (res === AccountState.LoggedOut) {
        // setTimeout(() => {
        //   this.rcVIew = this.rcVIewEnum.hidden;
        // }, 2000);
      } else if (res === AccountState.LoggedIn) {
        this.initializeRc();
      }
    });
    this.eventBus.on(EventTypes.ToggleRCMainView).subscribe((res: RCVIewState) => {
      this.rcVIew = res;
    });
    this.eventBus.on(EventTypes.RequestForLoginAttemptElementRef).subscribe((res: any) => {
      this.lazyAppMOdalComponent.clear();
      const callFunc = res.bind(this);
      const mydata = this.lazyAppMOdalComponent;
      callFunc(mydata);
    });
  }
  tryLockScreen() {
    const isPatientForm = window.location.href.includes('awForm/awPatient');
    this.isScreenLocked = (localStorage.getItem('screenLocked') && !isPatientForm) ? true : false;
    if (this.isScreenLocked) {
      setTimeout(() => {
        const element = document.getElementById('passwordKeyRef');
        element.focus();
      }, 500);
    }
  }
  validateUser() {
    this.unlockingProcess = true;
    this.rpmService.validateUser(this.securityService.securityObject.appUserId, this.passwordKey)
    .subscribe(
      (res: boolean) => {
        if (res) {
          this.isScreenLocked = false;
          localStorage.removeItem('screenLocked');
          this.toaster.success('Application unlocked');
        } else {
          this.toaster.warning('Password is not verified');
        }
        this.passwordKey = '';
        this.unlockingProcess = false;
      },
      (error: HttpResError) => {
        this.unlockingProcess = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  initializeRc() {
    const facilityId = +this.securityService.getClaim('FacilityId')?.claimValue;
    if (!facilityId) {
      return;
    }
    this.rcService.GetPhoneNumberInfo(facilityId).subscribe(
      (res: any) => {
        if (res?.records?.length) {
          this.rcService.rcPhoneInfo = res.records || [];
          // this.rcVIew = (this.securityService.securityObject.userType === UserType.FacilityUser) ? this.rcVIewEnum.minimize : 3;
        } else {
          this.rcVIew = this.rcVIewEnum.minimize;
        }
      },
      (error: HttpResError) => {
        this.rcVIew = this.rcVIewEnum.minimize;
        // this.toaster.error(error.error, error.message);
      }
    );
  }
  ClearExtensionPatient() {
    this.appData.extensionPatient = null;
    // if (this.appData.extensionPatient.id == this.appData.summeryViewPatient.id) {
    // }
  }

}
