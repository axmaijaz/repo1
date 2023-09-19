import { Injectable } from '@angular/core';
import {
  AccountState,
  AppUserAuth,
  ChnagePasswordDto,
  Send2FTokenDto
} from 'src/app/model/security/app-user.auth';
import { AppUser } from 'src/app/model/security/app-user';
import { Observable, of, Subject } from 'rxjs';
import { tap, map, filter, retry, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpErrorHandlerService } from 'src/app/shared/http-handler/http-error-handler.service';
import { AppUserClaim } from 'src/app/model/security/app-user-claim';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SendPhoneNoVerificationDto, VerifyPhoneNumberDto } from 'src/app/model/Facility/facility.model';
import moment from 'moment';
import { EmitEvent, EventBusService, EventTypes } from '../event-bus.service';
import { AppUiService } from '../app-ui.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { BrandingService } from '../branding.service';

const helper = new JwtHelperService();

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  appVersion = '30.0005.00';
  baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  securityObject: AppUserAuth = new AppUserAuth();

  public RequestStopChat = new Subject();
  private http2: HttpClient;
  constructor(
    private http: HttpClient,
    private handler: HttpBackend,
    private router: Router,
    private eventBus: EventBusService,
    private httpErrorService: HttpErrorHandlerService
  ) {
    this.http2 = new HttpClient(handler);
  }

  login(entity: AppUser): Observable<AppUserAuth> {
    // Initialize security object
    this.resetSecurityObject();

    return this.http
      .post<AppUserAuth>(this.baseUrl + 'Account/token2', entity, httpOptions)
      .pipe(
        tap(resp => {
          // Use object assign to update the current object
          // NOTE: Don't create a new AppUserAuth object
          //       because that destroys all references to object
          Object.assign(this.securityObject, resp);
          // Store into local storage
          if (!this.securityObject.is2faRequired || (this.securityObject.is2faRequired === true && this.securityObject.loginCount < 6)) {
            const tempObj = resp as any;
            this.updateToken(tempObj);
          }
          console.log('Refresh Login Time ' + moment().format('MMM DD YYYY,\\ h:mm:ss a'))
          // LogRocket.init(environment.logrocket);
          // LogRocket.startNewSession();
          // LogRocket.identify(this.securityObject.fullName, {
          //   name: this.securityObject.fullName,
          //   email: this.securityObject.userName,
          //   // Add your own custom user variables here, ie:
          //   // subscriptionType: 'pro'
          // });
        }),
        catchError(this.httpErrorService.handleHttpError)
      );
  }
  // Could use as method every time user token updated or new login
  softUpdateToken(data: AppUserAuth) {
    // this.resetSecurityObject();
    Object.assign(this.securityObject, data);
    // Store into local storage
    localStorage.setItem('bearerToken', this.securityObject.bearerToken);
    localStorage.setItem('securityData', JSON.stringify(this.securityObject));
    const timeStamp = moment().format('YYYY-MM-DD');
    localStorage.setItem('timeStamp', timeStamp);
    // window.location.reload();
    // this.EmitEventForLogIn();
  }
  updateToken(data: AppUserAuth) {
    this.resetSecurityObject();
    Object.assign(this.securityObject, data);
    // Store into local storage
    localStorage.setItem('bearerToken', this.securityObject.bearerToken);
    localStorage.setItem('securityData', JSON.stringify(this.securityObject));
    const timeStamp = moment().format('YYYY-MM-DD');
    localStorage.setItem('timeStamp', timeStamp);
    // window.location.reload();
    this.EmitEventForLogIn();
  }

  logout(): void {
    // console.log('Refresh Logout Time ' + moment().format('MMM DD YYYY,\\ h:mm:ss a'))
    this.resetSecurityObject();
    // this.router.navigateByUrl('/login');
    this.RequestStopChat.next();
    // this.ClearBranding();
    this.EmitEventForLogout();
  }
  EmitEventForLogIn() {
    const event = new EmitEvent();
    event.name = EventTypes.LoginLogout;
    event.value = AccountState.LoggedIn;
    this.eventBus.emit(event);
  }
  EmitEventForLogout() {
    const event = new EmitEvent();
    event.name = EventTypes.LoginLogout;
    event.value = AccountState.LoggedOut;
    this.eventBus.emit(event);
  }
  isAccessTokenExpired(token?: string): boolean {
    if (this.isLoggedIn()) {
      const RefrExpMin = moment.utc(this.securityObject.expiration).local().diff(moment(), 'minutes')
      if (RefrExpMin < 2) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    // if (this.isLoggedIn()) {
    //   return helper.isTokenExpired(this.securityObject.bearerToken);
    // } else {
    //   return false;
    // }
  }
  isRefreshTokenExpired(token?: string): boolean {
    if (this.isLoggedIn()) {
      const RefrExpMin = moment.utc(this.securityObject.refreshTokenExpiration).local().diff(moment(), 'minutes')
      if (RefrExpMin < 2) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  GetTokensExpiry() {
    if (this.isLoggedIn()) {
      const AccExp = moment.utc(this.securityObject.expiration).local().format('MMM DD YYYY,\\ h:mm:ss a');
      const RefrExp = moment.utc(this.securityObject.refreshTokenExpiration).local().format('MMM DD YYYY,\\ h:mm:ss a');
      const AccessExpMin = moment.utc(this.securityObject.expiration).local().diff(moment(), 'minutes')
      const RefrExpMin = moment.utc(this.securityObject.refreshTokenExpiration).local().diff(moment(), 'minutes')
      return `Access Token: ${AccExp} Min:  ${AccessExpMin} Refresh Token: ${RefrExp}   Min: ${RefrExpMin}`
    } else {
      return '';
    }
  }
  isLoggedIn(): boolean {
    if (this.securityObject && this.securityObject.isAuthenticated === true) {
      return true;
    } else {
      return false;
    }
  }

  resetSecurityObject(): void {
    // this.securityObject.userName = '';
    // this.securityObject.bearerToken = '';
    // this.securityObject.isAuthenticated = false;
    // this.securityObject.claims = [];
    this.securityObject = new AppUserAuth();

    localStorage.removeItem('bearerToken');
    localStorage.removeItem('securityData');
    localStorage.removeItem('timeStamp');
    localStorage.removeItem('CanceledDownloadItems');
  }
  // This method can be called a couple of different ways
  // *hasClaim="'claimType'"  // Assumes claimValue is true
  // *hasClaim="'claimType:value'"  // Compares claimValue to value
  // *hasClaim="['claimType1','claimType2:value','claimType3']"
  hasClaim(claimType: any, claimValue?: any) {
    let ret = false;
    // See if an array of values was passed in.
    if (typeof claimType === 'string') {
      ret = this.isClaimValid(claimType, claimValue);
    } else {
      const claims: string[] = claimType;
      if (claims) {
        for (let index = 0; index < claims.length; index++) {
          ret = this.isClaimValid(claims[index]);
          // If one is successful, then let them in
          if (ret) {
            break;
          }
        }
      }
    }

    return ret;
  }

  private isClaimValid(claimType: string, claimValue?: string): boolean {
    let ret = false;
    let auth: AppUserAuth = null;

    // Retrieve security object
    auth = this.securityObject;
    if (auth) {
      // See if the claim type has a value
      // *hasClaim="'claimType:value'"
      if (claimType.indexOf(':') >= 0) {
        const words: string[] = claimType.split(':');
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      } else {
        claimType = claimType.toLowerCase();
        // Either get the claim value, or assume 'true'
        claimValue = claimValue ? claimValue : 'true';
      }
      // Attempt to find the claim
      ret =
        auth.claims.find(
          c =>
            c.claimType.toLowerCase() === claimType &&
            c.claimValue === claimValue
        ) != null;
    }

    return ret;
  }

  getClaim(claimType: string, claimValue?: string) {
    let claim: AppUserClaim;
    let auth: AppUserAuth = null;

    // Retrieve security object
    auth = this.securityObject;
    if (auth) {
      // See if the claim type has a value
      // *hasClaim="'claimType:value'"
      if (claimType.indexOf(':') >= 0) {
        const words: string[] = claimType.split(':');
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      } else {
        claimType = claimType.toLowerCase();
        // Either get the claim value, or assume 'true'
        claimValue = claimValue ? claimValue : 'true';
      }
      // Attempt to find the claim
      claim = auth.claims.find(c => c.claimType.toLowerCase() === claimType);
      // claim = auth.claims.find(c => c.claimType.toLowerCase() === claimType && c.claimValue === claimValue);
    }

    return claim;
  }

  updateClaim(claimType: string, claimValue: string): boolean {
    let auth: AppUserAuth = null;
    auth = this.securityObject;
    if (claimType && claimValue) {
      const claim = auth.claims.find(
        c => c.claimType.toLowerCase() === claimType
        // && c.claimValue === claimValue
      );
      if (claim) {
        auth.claims.find(
          c => c.claimType.toLowerCase() === claimType
          // && c.claimValue === claimValue
        ).claimValue = claimValue;
        return true;
      }
      return false;
    }
  }

  checkUserName(userName: string) {
    return this.http
      .get(
        this.baseUrl + 'Account/CheckUserNameAvailable?username=' + userName,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetHangFireToken() {
    return this.http
      .post(
        this.baseUrl + 'Account/hangfireToken', {} ,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  checkORGUserName(userName: string, organizationId: number) {
    return this.http
      .get(
        this.baseUrl +
          'Account/CheckOrgUserNameAvailable?username=' +
          userName +
          '&orgId=' +
          organizationId,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ResetToken(): Promise<AppUserAuth> {
    return new Promise((resolve, reject) => {
      this.http.get(this.baseUrl + 'Account/ResetToken' , httpOptions ).pipe(catchError(this.httpErrorService.handleHttpError)).subscribe((x: AppUserAuth) => {
        this.updateToken(x);
        resolve(x)
      }, (err) => {
        reject(err)
      });
    })
  }
  RefreshToken() {
    console.log(`Refresh Token Used : ${this.securityObject.refreshToken}` );
    const previousList = JSON.parse(localStorage.getItem('2cRT')) || [];
    const RefrExp = moment.utc(this.securityObject.refreshTokenExpiration).local().format('MMM DD YYYY,\\ h:mm:ss a');
    previousList.push(`Token ${this.securityObject.refreshToken} Used Time: ${moment().format('MMM DD,\\ h:mm:ss a') } ExpiryTime: ${RefrExp}`)
    localStorage.setItem('2cRT' , JSON.stringify(previousList) ) ;
    return this.http2.post(this.baseUrl + `Account/RefreshToken?refreshToken=${this.securityObject.refreshToken}`, {} , httpOptions ).pipe(tap((resp: AppUserAuth) => {
      this.softUpdateToken(resp);
      console.log('Refresh Refresh Time ' + moment().format('MMM DD YYYY,\\ h:mm:ss a'))
      catchError(this.httpErrorService.handleHttpError)
    }));
  }
  GetTokenByUserId(userId: string) {
    return new Promise<AppUserAuth>((resolve, reject) => {
      this.http.post(this.baseUrl + `Account/GetTokenByUserId/${userId}`, {} , httpOptions ).pipe(catchError(this.httpErrorService.handleHttpError)).subscribe((x: AppUserAuth) => {
        resolve(x)
      }, (err) => {
        reject(err)
      });
    })
  }
  changePassword(chnagePasswordDto: ChnagePasswordDto) {
    return this.http
      .post(
        this.baseUrl + 'Account/ChangePassword',
        chnagePasswordDto,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendForgetEmail(userName: string, sendBy: string) {
    const data = {
      userName: userName,
      sendBy: sendBy
    };
    return this.http
      .post(this.baseUrl + 'Account/ForgotPassword', data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  VerifyResetPasswordCode(userName: string, code: string) {
    const data = {
      userName: userName,
      code: code
    };
    return this.http
      .post(this.baseUrl + 'Account/VerifyResetPasswordCode', data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ResetPassword(data: any) {
    return this.http
      .post(this.baseUrl + 'Account/ResetPassword', data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SendPhoneNoVerificationToken(data: SendPhoneNoVerificationDto) {
    return this.http
      .post(this.baseUrl + `Account/SendPhoneNoVerificationToken`, data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  UpdatePatientPhoneNo(PatientId: number, PhoneNumber: string) {
    return this.http
      .put(this.baseUrl + `Patients/ChangePhoneNo?PatientId=${PatientId}&PhoneNumber=${PhoneNumber}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetPhoneNumber(data) {
    return this.http
      .post(this.baseUrl + 'Account/SetPhoneNumber', data, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  sendVerifyEmail(userName: string, email: string) {
    return this.http
      .post(this.baseUrl + `Account/SendVerificationEmail?Username=${userName}&Email=${email}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  VerifyPhoneNumber(data: VerifyPhoneNumberDto) {
    return this.http
      .post(this.baseUrl + `Account/VerifyPhoneNumber`, data , httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RegisterAuthenticator(code: string, key: string) {
    return this.http
      .post(this.baseUrl + `Account/RegisterAuthenticator?Code=${code}&AuthenticatorKey=${key}`, {} , httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  RegisterAuthenticatorWithToken(code: string, key: string, token: string , ReturnToken: boolean) {
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization:  token
      })
    };
    return this.http
      .post(this.baseUrl + `Account/RegisterAuthenticator?Code=${code}&AuthenticatorKey=${key}&ReturnToken=true`, {} , httpOptions1)
      .pipe(
        tap(resp => {
          // Use object assign to update the current object
          // NOTE: Don't create a new AppUserAuth object
          //       because that destroys all references to object
          Object.assign(this.securityObject, resp);
          const tempObj = resp as any;
          this.updateToken(tempObj);
          // LogRocket.init(environment.logrocket);
          // LogRocket.startNewSession();
          // LogRocket.identify(this.securityObject.fullName, {
          //   name: this.securityObject.fullName,
          //   email: this.securityObject.userName,
          //   // Add your own custom user variables here, ie:
          //   // subscriptionType: 'pro'
          // });
        }),
        catchError(this.httpErrorService.handleHttpError)
      );
  }
  Send2FToken(obj: Send2FTokenDto, token: string) {
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization:  'Bearer ' + token
      })
    };
    return this.http
      .post(this.baseUrl + `Account/Send2FToken`, obj , httpOptions1)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  Disable2FA() {
    return this.http
      .post(this.baseUrl + `Account/Disable2FA`, {} , httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  Enable2FA() {
    return this.http
      .post(this.baseUrl + `Account/Enable2FA`, {} , httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  ReconfigureAuthenticator(code: string, token: string) {
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization:  token
      })
    };
    return this.http.post(this.baseUrl + `Account/ReconfigureAuthenticator/${code}`, {} , httpOptions1)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  LoginWith2fa(code: string, token: string) {
    const httpOptions1 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization:  token
      })
    };
    return this.http
      .post(this.baseUrl + `Account/LoginWith2fa?TwoFactorCode=${code}&RememberMachine=true&RememberMe=true`, {} , httpOptions1)
      .pipe(
        tap(resp => {
          // Use object assign to update the current object
          // NOTE: Don't create a new AppUserAuth object
          //       because that destroys all references to object
          Object.assign(this.securityObject, resp);
          // Store into local storage
          const tempObj = resp as any;
          this.updateToken(tempObj);
          // LogRocket.init(environment.logrocket);
          // LogRocket.startNewSession();
          // LogRocket.identify(this.securityObject.fullName, {
          //   name: this.securityObject.fullName,
          //   email: this.securityObject.userName,
          //   // Add your own custom user variables here, ie:
          //   // subscriptionType: 'pro'
          // });
        }),
        catchError(this.httpErrorService.handleHttpError)
      );
  }
  GetAuthenticatorKey(userName: string) {
    return this.http
      .get(this.baseUrl + `Account/GetAuthenticatorKey?userName=${userName}` , httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetUserAuthDetails(userId: string) {
    return this.http
      .get(this.baseUrl + `Account/GetUserAuthDetails/${userId}` , httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }


}
