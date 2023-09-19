import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { UserType } from "src/app/Enums/UserType.enum";
import { AppUserClaim } from "src/app/model/security/app-user-claim";
import { AppUserAuth } from "src/app/model/security/app-user.auth";
import { HttpErrorHandlerService } from "src/app/shared/http-handler/http-error-handler.service";
import { environment } from "src/environments/environment";
import { SecurityService } from "../security/security.service";
import { AppUiService } from "../../core/app-ui.service";

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: "root",
})
export class AuthActivityService {
  private baseUrl = localStorage.getItem("switchLocal")
    ? environment.localBaseUrl
    : environment.baseUrl;
  constructor(
    private securityService: SecurityService,
    private appUiService: AppUiService,
    private router: Router,
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService
  ) {}

  GetFacilityActiveState(facilityId) {
    return this.http
      .get(
        this.baseUrl + `Facility/GetFacilityActiveState?facilityId=${facilityId}`,
        httpOptions
      )
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  async CheckForRefreshTokenRequest() {
    const requestExist = localStorage.getItem("refreshTokenRequest");
    if (requestExist && localStorage.getItem("securityData")) {
      localStorage.removeItem("refreshTokenRequest");
      this.appUiService.showAppLoader();
      await this.securityService.ResetToken();
      location.reload();
      // const currentUrl = this.router.url;
      // await this.router.navigateByUrl("/", { skipLocationChange: true });
      // this.router.navigate([currentUrl]);
    }
  }
  FacilityChangeCheck() {
    const isLoggedIn = this.securityService.isLoggedIn();
    const localSecurityData = localStorage.getItem("securityData")
      ? (JSON.parse(localStorage.getItem("securityData")) as AppUserAuth)
      : null;
    if (isLoggedIn && localSecurityData) {
      const activeSecurityData = this.securityService.securityObject;

      // Check if user is different
      if (localSecurityData.appUserId !== activeSecurityData.appUserId) {
        this.updateTokenAndNAvigate(localSecurityData);
        return;
      }

      // Check if Current Facility Changed
      const localFacility = +this.getClaim(localSecurityData, "FacilityId")
        ?.claimValue;
      const activeFacility = +this.getClaim(activeSecurityData, "FacilityId")
        ?.claimValue;
      if (localFacility !== activeFacility) {
        this.updateTokenAndNAvigate(localSecurityData);
        return;
      }
    }

    // Check if user logged out in other tab
    if (!localSecurityData) {
      console.log(" Check if no user ");
      this.securityService.logout();
      if (!location.href.includes("login")) {
        this.router.navigateByUrl("/login");
      }
      return;
    }

    // Check if user login in other tab
    if (localSecurityData && !isLoggedIn) {
      this.updateTokenAndNAvigate(localSecurityData);
      return;
    }
  }
  private async updateTokenAndNAvigate(securityObj: AppUserAuth) {
    this.securityService.updateToken(securityObj);
    if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      await this.router.navigateByUrl("/dashboard");
    } else if (
      this.securityService.securityObject.userType === UserType.Patient
    ) {
      await this.router.navigateByUrl(
        "/patient/profile"
      );
    } else if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      await this.router.navigateByUrl("/home");
    }
    location.reload();
  }
  private getClaim(
    securityObj: AppUserAuth,
    claimType: string,
    claimValue?: string
  ) {
    let claim: AppUserClaim;
    let auth: AppUserAuth = null;

    // Retrieve security object
    auth = securityObj;
    if (auth) {
      // See if the claim type has a value
      // *hasClaim="'claimType:value'"
      if (claimType.indexOf(":") >= 0) {
        const words: string[] = claimType.split(":");
        claimType = words[0].toLowerCase();
        claimValue = words[1];
      } else {
        claimType = claimType.toLowerCase();
        // Either get the claim value, or assume 'true'
        claimValue = claimValue ? claimValue : "true";
      }
      // Attempt to find the claim
      claim = auth.claims.find((c) => c.claimType.toLowerCase() === claimType);
      // claim = auth.claims.find(c => c.claimType.toLowerCase() === claimType && c.claimValue === claimValue);
    }
    return claim;
  }
}
