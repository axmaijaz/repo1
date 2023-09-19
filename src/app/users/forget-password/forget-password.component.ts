import { AppDataService } from './../../core/app-data.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppUser } from 'src/app/model/security/app-user';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { SecurityService } from 'src/app/core/security/security.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserType } from 'src/app/Enums/UserType.enum';
import { ToastService } from 'ng-uikit-pro-standard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AccountService } from 'src/app/core/account/account.service';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { BrandingService } from 'src/app/core/branding.service';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('userName1') userName1: ElementRef;
  successAlertMessage = '';
  errorAlertMessage = '';
  userName = '';
  userId = '';
  resetCode = '';
  verificationCode = '';
  verificationCodeView = false;
  isPhoneVerified = false;
  isEmailVerified = false;
  sendCodeMethod: string;
  resetPassForm: FormGroup;
  user: AppUser = new AppUser();
  securityObject: AppUserAuth = null;
  sendingCode: boolean;
  cUserName: string;
  verifingCode: boolean;
  constructor(
    public brandingService: BrandingService,private fb: FormBuilder, private router: Router,
     private toaster: ToastService, private route: ActivatedRoute, private appDataService: AppDataService,
    private securityService: SecurityService, private spinner: NgxSpinnerService, public location: Location, private accountService: AccountService ) { }
  ngOnInit() {
    this.userId = this.route.snapshot.queryParamMap.get('userid');
    this.resetCode = this.route.snapshot.queryParamMap.get('code');
    this.resetPassForm = this.fb.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
    this.userName = this.appDataService.email;
    if (this.userName) {
      this.isSMSOrEmailVerified()
    }
    this.TryLogout();
  }
  TryLogout() {
    if(this.securityService?.isLoggedIn()) {
      this.securityService.logout();
    }
  }
  ngAfterViewInit() {
    fromEvent(this.userName1.nativeElement, 'keyup')
    .pipe(
      map((event: any) => {
        return event.target.value;
      }),
      debounceTime(1000)
    )
    .subscribe((text: string) => {
      this.isSMSOrEmailVerified();
    });
  }
  ngOnDestroy() {
     this.appDataService.email = '';
  }
  // Login() {
  //   this.router.navigateByUrl('/admin');
  // }
  forgetEmail() {
    this.sendingCode = true;
    this.cUserName = this.userName;
    this.securityService.SendForgetEmail(this.userName, this.sendCodeMethod).subscribe((res: any) => {
      this.errorAlertMessage = '';
      this.sendCodeMethod = '';
      this.successAlertMessage = res;
      this.verificationCodeView = true;
      // this.userName = '';
      this.sendingCode = false;
    }, (err: any) => {
      this.sendingCode = false;
      this.successAlertMessage = '';
      this.errorAlertMessage = err.error;
      this.userName = '';
    });
  }
  resetPassword() {
    const data = {
      userName: this.cUserName,
      password: this.resetPassForm.get('password').value,
      confirmPassword: this.resetPassForm.get('confirmPassword').value,
      code: this.resetCode
    };
    this.securityService.ResetPassword(data).subscribe((res: any) => {
      this.errorAlertMessage = '';
      this.successAlertMessage = res;
      this.userName = '';
      this.router.navigateByUrl('/login');
      this.toaster.success('Password Changed Successfully');
      // this.router.navigateByUrl('/login');
    }, (err: any) => {
      this.successAlertMessage = '';
      this.errorAlertMessage = err.error;
      this.userName = '';
    });
  }
  VerifyUserCode() {
    this.verifingCode = true;
    this.securityService.VerifyResetPasswordCode(this.cUserName, this.verificationCode).subscribe((res: any) => {
      if (res) {
        this.errorAlertMessage = '';
        this.successAlertMessage = 'Code verified';
        this.resetCode = this.verificationCode;
        this.userName = '';
        // this.router.navigateByUrl('/login');
      } else {
        this.successAlertMessage = '';
        this.errorAlertMessage = 'Code not verified';
      }
      this.verificationCode = '';
      this.verifingCode = false;
    }, (err: any) => {
      this.verifingCode = false;
      this.successAlertMessage = '';
      this.errorAlertMessage = err.error;
      this.userName = '';
      this.verifingCode = false;
    });
  }
  isSMSOrEmailVerified() {
    if (!this.userName) {
      return;
    }
    // this.verifingCode = true;
    this.sendCodeMethod = '';
    this.isEmailVerified = false;
    this.accountService.IsSMSOrEmailVerified(this.userName).subscribe((res: any) => {
      // this.isEmailVerified = res.verifiedEmail;
      this.isEmailVerified = true;
      this.isPhoneVerified = res.verifiedSMS;
    }, (err: any) => {
      this.isEmailVerified = false;
      this.isPhoneVerified = false;
      this.toaster.error(err.error);
    });
  }

  goBack() {
    this.location.back();
  }
  resetView() {
    this.verificationCode = '';
    this.successAlertMessage = '';
    this.errorAlertMessage = '';
    this.verificationCodeView = false;
    this.isEmailVerified = false;
      this.isPhoneVerified = false;
  }

}
