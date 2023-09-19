import { Router } from '@angular/router';
import { AccountService } from './../../core/account/account.service';
import { SecurityService } from "../../core/security/security.service";
import { FacilityService } from "../../core/facility/facility.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import {
  AppUserAuth,
  ChnagePasswordDto,
} from "src/app/model/security/app-user.auth";
import { UserType } from "src/app/Enums/UserType.enum";
import {
  CreateFacilityUserDto,
  VerifyPhoneNumberDto,
  SendPhoneNoVerificationDto,
} from "src/app/model/Facility/facility.model";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ToastService, ModalDirective } from "ng-uikit-pro-standard";
import { AppDataService } from 'src/app/core/app-data.service';
import { environment } from 'src/environments/environment';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { PatientsService } from 'src/app/core/Patient/patients.service';

@Component({
  selector: "app-facility-user-profile",
  templateUrl: "./facility-user-profile.component.html",
  styleUrls: ["./facility-user-profile.component.scss"],
})
export class FacilityUserProfileComponent implements OnInit {
  @ViewChild("verificationModal") verificationModal: ModalDirective;
  @ViewChild("editFacilityUserModal") editFacilityUserModal: ModalDirective;
  securityObject: AppUserAuth = null;
  facilityUserId: number;
  user = new CreateFacilityUserDto();
  verifyPhoneNoDto = new VerifyPhoneNumberDto();
  sendPhoneNoVerifictionDto = new SendPhoneNoVerificationDto();
  verificationUserName: string;
  changePasswordForm: FormGroup;
  isLoading = false;
  twoFactorEnabled = '';
  qrCOdeString: string;
  gettingKey: boolean;
  qrCOdeStringSave: any;
  codeString: string;
  editOption = "CInfo";
  formattedKey: any;
  disablingTwoFA: boolean;
  isLoading1: boolean;
  showQRCode = true;
  isAuthenticationSuccess = false;
  selectedUserCountryCallingCode: any;
  countryCallingCode: number;
  phoneNumberWithoutMask: any;
  phoneNo: string;
  isUpdatingFacilityUser: boolean;
  email: string;
  countriesList: any;
  constructor(
    private facilityService: FacilityService,
    private securityService: SecurityService,
    private fb: FormBuilder,
    private appData: AppDataService,
    private toaster: ToastService,
    private router: Router,
    private accountService: AccountService,
    private patientsService: PatientsService
  ) {
    this.securityObject = securityService.securityObject;
  }

  ngOnInit() {
    if (this.securityObject.userType === UserType.FacilityUser) {
      this.facilityUserId = this.securityObject.id;
    }
    this.changePasswordForm = this.fb.group({
      // userId: ['', [Validators.required, Validators.email]],
      oldPassword: ["", Validators.required],
      newPassword: ["", Validators.required],
      verifyPassword: ["", Validators.required],
    });
    this.getFacilityUserByFacilityUserId();
    this.GetUserAuthDetails();
    this.GetAllCountries();
  }
  getFacilityUserByFacilityUserId() {
    this.isLoading = false;
    this.facilityService.getFacilityUserById(this.facilityUserId).subscribe(
      (res: any) => {
        if (res) {
          this.isLoading = true;
          if (res.phoneNo) {
            this.phoneNumberWithoutMask = res.phoneNo;
            res.phoneNo = res.phoneNo.replace(
              /^(\d{0,3})(\d{0,3})(\d{0,4})/,
              "($1)$2-$3"
            );
            res.organization.contactNumber = res.organization.contactNumber.replace(
              /^(\d{0,3})(\d{0,3})(\d{0,4})/,
              "($1)$2-$3"
            );
          }
          this.countryCallingCode = res.countryCallingCode;
          this.user = res;
          console.log(res);
        }
      },
      (error) => {
        this.isLoading = true;
        this.toaster.error(error.error);
      }
    );
  }
  changePassword() {
    const cahangePasswordObj = new ChnagePasswordDto();
    cahangePasswordObj.oldPassword = this.changePasswordForm.get(
      "oldPassword"
    ).value;
    cahangePasswordObj.newPassword = this.changePasswordForm.get(
      "newPassword"
    ).value;
    cahangePasswordObj.userId = this.securityObject.appUserId;
    this.securityService.changePassword(cahangePasswordObj).subscribe(
      (res: any) => {
        this.changePasswordForm.reset();
        this.toaster.success("Password Updated Successfully");
      },
      (error: any) => {
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  sendPhoneNoVerificationToken(row: any) {
    // this.isLoading = true;
    this.verificationUserName = row.firstName + " " + row.lastName;
    this.sendPhoneNoVerifictionDto.phoneNumber = this.phoneNumberWithoutMask;
    this.sendPhoneNoVerifictionDto.userName = row.userName;
    this.sendPhoneNoVerifictionDto.countryCallingCode = row.countryCallingCode;
    this.selectedUserCountryCallingCode = row.countryCallingCode;
    if(!this.sendPhoneNoVerifictionDto.countryCallingCode){
      this.toaster.error('Facility user country calling code not selected')
    }else{
      this.verificationModal.show();
      this.securityService
        .SendPhoneNoVerificationToken(this.sendPhoneNoVerifictionDto)
        .subscribe(
          (res: any) => {
            // this.isLoading = false;
            // this.loadFacilityUsers();
            // this.toaster.success("Facility User deleted successfully");
          },
          (err) => {
            // this.isLoading = false;
            this.toaster.error(err.error);
          }
        );
    }
  }
  get2FAInfoPdf() {
    // this.isLoading1 = true;
    // this.accountService
    //   .Get2FAInfoPdf()
    //   .subscribe(
    //     (res: any) => {
    //       this.isLoading1 = false;
    //     var win = window.open(res, "_blank");
    //     win.focus();
    //     },
    //     (err) => {
    //       this.isLoading1 = false;
    //       this.toaster.error(err.error);
    //     }
    //   );
      if (environment.production == true) {
        var url = "https://api.2chealthsolutions.com/Info2FA.pdf";
        var win = window.open(url, "_blank");
        win.focus();
       } else {
        var url1 = "https://api.healthforcehub.link/Info2FA.pdf";
        var win = window.open(url1, "_blank");
        win.focus();
       }
  }
  sendVerifyEmail(row) {
    const userName = row.userName;
    const email = row.email;
    // this.isLoading = false;
    this.securityService.sendVerifyEmail(userName, email).subscribe(
      (res: any) => {
        // this.isLoading = false;
        this.toaster.success("Verification email sent !");
      },
      (err) => {
        // this.isLoading = false;
        this.toaster.error(err.error);
      }
    );
  }
  verifyPhoneNumber() {
    this.verifyPhoneNoDto.userName = this.sendPhoneNoVerifictionDto.userName;
    this.securityService.VerifyPhoneNumber(this.verifyPhoneNoDto).subscribe(
      (res: any) => {
        // this.isLoading = false;
        this.verificationModal.hide();
        // this.loadFacilityUsers();
        this.toaster.success("Phone No Verified successfully");
        this.sendPhoneNoVerifictionDto = new SendPhoneNoVerificationDto();
        this.verifyPhoneNoDto = new VerifyPhoneNumberDto();
        this.getFacilityUserByFacilityUserId();
      },
      (err) => {
        // this.isLoading = false;
        this.toaster.error(err.error);
      }
    );
  }
  navigateOnPlaystore() {
    var url = 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en';
    var win = window.open(url, '_blank');
      // win.opener = null;
      win.focus();
  }
  navigateOnTwoCHealth() {
    var url = 'https://play.google.com/store/apps/details?id=twochealthcare.io&hl=en';
    var win = window.open(url, '_blank');
      // win.opener = null;
      win.focus();
  }
  navigateOnTwoCHealthIphone() {
    var url = 'https://apps.apple.com/us/app/2c-health-care/id1572782591?uo=4';
    var win = window.open(url, '_blank');
      // win.opener = null;
      win.focus();
  }
  navigateOnTwoCHealthExtenstion() {
    var url = 'https://chrome.google.com/webstore/detail/2c-health-solutions/cmgaffjhdblbbaniiiohnbbgbdbdoahm';
    var win = window.open(url, '_blank');
      // win.opener = null;
      win.focus();
  }
  navigateOnIStore() {
    var url = 'https://apps.apple.com/us/app/google-authenticator/id388497605';
    var win = window.open(url, '_blank');
      // win.opener = null;
      win.focus();
  }
  GetUserAuthDetails() {
    this.securityService.GetUserAuthDetails(this.securityObject.appUserId).subscribe(
      (res: any) => {
        if (res.twoFactorEnabled) {
          this.twoFactorEnabled = 'Yes';
        } else {
          this.twoFactorEnabled = 'No';
        }
      },
      (err) => {
        // this.isLoading = false;
        this.gettingKey = false;
        this.toaster.error(err.error);
      }
    );
  }
  GetAuthenticatorKey(modal: ModalDirective) {
    this.gettingKey = true;
    modal.show();
    this.securityService.GetAuthenticatorKey(this.securityObject.userName).subscribe(
      (res: any) => {
        this.gettingKey = false;
        this.qrCOdeString = res.authenticatorUri;
        this.formattedKey = res.sharedKey;
        this.qrCOdeStringSave = res.unFormattedKey;
      },
      (err) => {
        // this.isLoading = false;
        this.gettingKey = false;
        this.toaster.error(err.error);
      }
    );
  }
  RegisterAuthenticator(modal: ModalDirective) {
    this.gettingKey = true;
    modal.show();
    this.securityService.RegisterAuthenticator(this.codeString, this.qrCOdeStringSave).subscribe(
      (res: any) => {
        // modal.hide();
        this.getFacilityUserByFacilityUserId();
        this.gettingKey = false;
        this.isAuthenticationSuccess = true;
        this.twoFactorEnabled = 'Yes';
        this.appData.TwoFactorEnabled = 'Yes';
        this.toaster.success('Two factor authentication enabled');
      },
      (err) => {
        // this.isLoading = false;
        this.gettingKey = false;
        this.toaster.error(err.error);
      }
    );
  }
  DisableTwoFactorAuthentication() {
    this.disablingTwoFA = true;
    this.securityService.Disable2FA().subscribe(
      (res: any) => {
        this.disablingTwoFA = false;
        this.user.twoFactorEnabled = false;
        this.twoFactorEnabled = 'No';
        this.appData.TwoFactorEnabled = 'No';
        this.toaster.warning('Two factor authentication disabled');
      },
      (err) => {
        // this.isLoading = false;
        this.disablingTwoFA = false;
        this.toaster.error(err.error);
      }
    );
  }
  editFacilityUser() {
    this.isUpdatingFacilityUser = true;
    this.user.countryCallingCode = this.countryCallingCode.toString();
    this.user.phoneNo = this.phoneNo;
    this.user.email = this.email;
    this.facilityService.editFacilityUSer(this.user).subscribe((res: any) => {
      this.toaster.success('Contact Information Updated');
      this.getFacilityUserByFacilityUserId();
      this.editFacilityUserModal.hide();
    this.isUpdatingFacilityUser = false;
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    this.isUpdatingFacilityUser = false;
    })
  }
  GetAllCountries() {
    this.patientsService.GetAllCountries().subscribe(
      (res: any) => {
        this.countriesList = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
}
