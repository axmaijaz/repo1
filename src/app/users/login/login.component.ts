import { AppDataService } from './../../core/app-data.service';
import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUser } from 'src/app/model/security/app-user';
import { AppUserAuth, ChnagePasswordDto, SendMethod } from 'src/app/model/security/app-user.auth';
import { SecurityService } from 'src/app/core/security/security.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserType } from 'src/app/Enums/UserType.enum';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { PubnubChatService } from 'src/app/core/pubnub-chat.service';
import { AppUiService } from 'src/app/core/app-ui.service';
import { Location } from '@angular/common';
import { LazyLoaderService } from 'src/app/core/Lazy/lazy-loader.service';
import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { BrandingService } from 'src/app/core/branding.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('twoFactorConfModal') twoFactorConfModal: ModalDirective;
  @ViewChild('changePasswordModal') changePasswordModal: ModalDirective;
  logInForm: FormGroup;
  login = new AppUser();
  userType = UserType;
  user: AppUser = new AppUser();
  securityObject: AppUserAuth = null;
  TwoFASecurityObject: AppUserAuth = null;
  returnUrl: string;
  loggingIn: boolean;
  codeString: string;
  showSendEmailPasswordView: boolean;
  twoFactorLoginProcess: boolean;
  identifyTokenForTwoFA: string;
  sendCodeMethod: SendMethod = null;
  sendingCodeTOPatient: boolean;
  qrCOdeString: string;
  registrationInProcess: boolean;
  qrCOdeStringSave: any;
  show: boolean;
  isEmailVerified: any;
  isPhoneVerified: any;
  changePasswordForm: FormGroup;
  shortName: string;
  get logInFormValues(): AppUser {
    this.login.userName = this.logInForm.get('email').value;
    this.login.password = this.logInForm.get('password').value;
    this.login.shortName = this.shortName;

    // Object.assign(this.login, this.logInForm.value);
    return this.login;
  }
  constructor(
    private fb: FormBuilder,
    public brandingService: BrandingService,
    private eventBus: EventBusService,
    private lazyLoader: LazyLoaderService,
    private router: Router,
    private toaster: ToastService,
    private route: ActivatedRoute,
    private lazyLoaderService: LazyLoaderService,
    private chatService: PubnubChatService,
    private securityService: SecurityService,
    private spinner: NgxSpinnerService,
    private appDataService: AppDataService,
    private filterDataService: DataFilterService,

  ) {
    this.show = false;
  }
  ngOnInit() {
    if(this.securityService.isLoggedIn() === true) {
      // this.router.navigateByUrl('')
    }
    this.logInForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', Validators.required]
    });
    this.filterDataService.clearFilterData();
    this.changePasswordForm = this.fb.group({
      // userId: ['', [Validators.required, Validators.email]],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      verifyPassword: ['', Validators.required],
    });
    this.shortName = this.route.snapshot.paramMap.get('context') || '';
    if (this.shortName) {
      this.brandingService.ApplyLogosByShortName(this.shortName);
    }
  }

  ngAfterViewInit(): void {
    this.lazyLoaderService.loadModule('home').then(res => {
      // console.log('home module loaded', 'background: #222; color: #bada55');
    });
  }
  // Login() {
  //   this.router.navigateByUrl('/admin');
  // }
  Login() {
    this.spinner.show('globleSpinner');
    this.loggingIn = true;
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    this.codeString = '';
    this.showSendEmailPasswordView = false;
    // this.lazyLoaderService.loadModule('admin').then(res => {
    //   console.log('Admin module loaded', 'background: #222; color: #bada55');
    // });
    this.securityService.login(this.logInFormValues).subscribe(
      (resp: AppUserAuth) => {
        if (resp.is2faRequired === true && resp.loginCount > 5) {
          this.TwoFASecurityObject = resp;
          this.identifyTokenForTwoFA = 'Bearer ' + resp.bearerToken;
          // this.isEmailVerified =  resp.isEmailVerified;
          this.isEmailVerified =  true;
          this.isPhoneVerified = resp.isPhoneVerified;
          // this.toaster.warning('Verify your identity');
          if (resp.userType === UserType.Patient) {
            // this.showSendEmailPasswordView = true;
            this.twoFactorConfModal.show();
            this.loggingIn = false;
          } else {
            this.loggingIn = false;
            // this.showSendEmailPasswordView = true;
            this.twoFactorConfModal.show();
          }
        } else {
          this.ProceedLogin(resp);
        }
      },
      (error: HttpResError) => {
        this.loggingIn = false;
        this.spinner.hide('globleSpinner');
        this.toaster.error(error.error, error.message);
      }
    );
  }
  LoginWithTwoFA() {
    if (this.showSendEmailPasswordView && this.TwoFASecurityObject.userType === UserType.FacilityUser) {
      this.RecofigureAuthenticator();
      return;
    }
    this.twoFactorLoginProcess = true;
    this.securityService.LoginWith2fa(this.codeString, this.identifyTokenForTwoFA).subscribe(
      (res: any) => {
        this.twoFactorLoginProcess = false;
        this.twoFactorConfModal.hide();
        this.ProceedLogin(res);
        this.toaster.success('Two factor code verified');
      },
      (err) => {
        // this.isLoading = false;
        this.twoFactorLoginProcess = false;
        this.toaster.error(err.error);
      }
    );
  }
  password() {
    this.show = !this.show;
  }
  RecofigureAuthenticator() {
    this.twoFactorLoginProcess = true;
      this.securityService.ReconfigureAuthenticator(this.codeString, this.identifyTokenForTwoFA).subscribe(
        (res: any) => {
          this.codeString = '';
          this.twoFactorLoginProcess = false;
          this.showSendEmailPasswordView = false;
          this.qrCOdeString = res.authenticatorUri;
          this.qrCOdeStringSave = res.unFormattedKey;
          this.toaster.success('Code Verifed, Reconfigure Authenticator');
        },
        (err) => {
          // this.isLoading = false;
          this.twoFactorLoginProcess = false;
          this.toaster.error(err.error);
        }
      );
  }
  RegisterAuthenticator(modal: ModalDirective) {
    this.twoFactorLoginProcess = true;
    this.securityService.RegisterAuthenticatorWithToken(this.codeString, this.qrCOdeStringSave, this.identifyTokenForTwoFA ,true).subscribe(
      (res: any) => {
        this.twoFactorLoginProcess = false;
        modal.hide();
        this.ProceedLogin(res);
        this.toaster.success('Two factor authentication Re Configured');
      },
      (err) => {
        // this.isLoading = false;
        this.twoFactorLoginProcess = false;
        this.toaster.error(err.error);
      }
    );
  }
  SendCode() {
    this.sendingCodeTOPatient = true;
    const obj = {
      userId: this.TwoFASecurityObject.appUserId,
      sendMethod: this.sendCodeMethod
    };
    this.securityService.Send2FToken(obj, this.TwoFASecurityObject.bearerToken).subscribe(
      (res: any) => {
        this.toaster.success(`Verification code send to your ${this.sendCodeMethod === 0 ? 'SMS' : 'Email'}`);
        this.showSendEmailPasswordView = false;
      },
      (err) => {
        // this.isLoading = false;
        this.sendingCodeTOPatient = false;
        this.toaster.error(err.error);
      }
    );
  }
  async ProceedLogin(resp: AppUserAuth) {
    this.securityObject = resp;
    this.chatService.InitPubnubChat();
    this.chatService.InitSignalrChat();
    if (this.securityObject.userType === UserType.AppAdmin) {
      this.spinner.hide('globleSpinner');
      if (this.returnUrl) {
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.router.navigateByUrl('/dashboard');
      }
      // } else if (this.securityObject.userType === UserType.CareProvider) {
      //   if (this.returnUrl) {
      //     this.router.navigateByUrl(this.returnUrl);
      //   } else {
      //     this.router.navigateByUrl('/admin');
      //   }
    } else if (this.securityObject.userType === UserType.Patient) {
      if(this.securityObject.changePasswordRequired === true){
        this.loggingIn = false;
        this.changePasswordModal.show();
      }else{
        // if (this.returnUrl) {
        //   this.router.navigateByUrl(this.returnUrl);
        // } else {
          this.router.navigateByUrl('/patient/profile');
        // }
      }
    } else if (this.securityObject.userType === UserType.FacilityUser) {
      if (this.returnUrl) {
        this.router.navigateByUrl(this.returnUrl);
      } else {
        this.router.navigateByUrl('/home');
      }
    }
    if (this.securityObject.userType === UserType.FacilityUser && this.securityObject.loginCount < 6 && this.securityObject.is2faRequired) {
      const event = new EmitEvent();
      event.name = EventTypes.RequestForLoginAttemptElementRef;
      event.value = this.getElementRefFromAppComponent;
      this.eventBus.emit(event);
    }
    this.brandingService.ApplyBranding();
  }
  getElementRefFromAppComponent = async (elemntRef: ViewContainerRef) => {
    const loaded = await this.lazyLoader.load('lazyLoginWarning', elemntRef);
    this.openWarningMOdalReq();
  }
  openWarningMOdalReq(data?: any) {
    const event = new EmitEvent();
    event.name = EventTypes.OpenSharedLoginWarningModal;
    event.value = null;
    this.eventBus.emit(event);
  }
  goToForgetPW() {
    this.appDataService.email = this.logInForm.get('email').value;
    this.router.navigateByUrl('/forgetpassword');
  }
  changePassword() {
    const cahangePasswordObj = new ChnagePasswordDto();
    cahangePasswordObj.oldPassword = this.changePasswordForm.get(
      'oldPassword'
    ).value;
    cahangePasswordObj.newPassword = this.changePasswordForm.get(
      'newPassword'
    ).value;
    cahangePasswordObj.userId = this.securityObject.appUserId;
    this.securityService.changePassword(cahangePasswordObj).subscribe(
      (res: any) => {
        this.changePasswordForm.reset();
        this.logout();
        this.toaster.success('Password Updated Successfully');
      },
      (err: any) => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  logout() {
    this.securityService.logout();
    this.securityObject = this.securityService.securityObject;
  }
}
