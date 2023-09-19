import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserType } from '../Enums/UserType.enum';
import { HttpErrorHandlerService } from '../shared/http-handler/http-error-handler.service';
import { SecurityService } from './security/security.service';
import { ActivatedRoute } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};

@Injectable({
  providedIn: 'root'
})
export class BrandingService {
  logoPath = `https://${environment.logoAws}.s3.amazonaws.com/2chealth/`;;
  appTitle = `2C Health Solutions`;
  appColors =  {primaryColor: '#4eb048', secondaryColor: '#1d3d71', sideNavBarColor: '#2b373d'}
  private baseUrl = localStorage.getItem("switchLocal")
    ? environment.localBaseUrl
    : environment.baseUrl;
  constructor(
    private http: HttpClient,
    private httpErrorService: HttpErrorHandlerService,
    private securityService: SecurityService,
    private route: ActivatedRoute,
    private title: Title, @Inject(DOCUMENT) private _doc: Document
  ) {}
  ApplyDefaultDefault() {
    const {title, logoPath } = JSON.parse(localStorage.getItem('branding') || '{}')
    this.logoPath = logoPath || this.logoPath;
    this.appTitle = title || this.title;
    this.SetTitle(title)
    this.setFavicon();
    this.setThemeColor()
  }

  ApplyBranding() {
    if (!this.securityService.isLoggedIn()) {
      return;
    }
    let title = '2C Health Solutions';
    if (this.securityService.securityObject?.userType === UserType.Patient) {
      title = this.securityService.getClaim('FacilityName')?.claimValue || this.securityService.securityObject.fullName;
    }
    if (this.securityService.securityObject?.userType === UserType.FacilityUser) {
      title = this.securityService.getClaim('FacilityName')?.claimValue || title;
    }
    this.logoPath = `https://${environment.logoAws}.s3.amazonaws.com/${this.securityService.securityObject.logosPath}`;
    this.appColors.primaryColor = this.securityService.securityObject?.primaryColor || this.appColors.primaryColor;
    this.appColors.secondaryColor = this.securityService.securityObject?.secondaryColor || this.appColors.secondaryColor;
    this.appColors.sideNavBarColor = this.securityService.securityObject?.sideNavBarColor || this.appColors.sideNavBarColor;

    this.SetTitle(title)
    this.setFavicon()
    this.setThemeColor()
    localStorage.setItem('branding', JSON.stringify({title: title, logoPath: this.logoPath, primaryColor: this.appColors.primaryColor, secondaryColor: this.appColors.secondaryColor, sideNavBarColor: this.appColors.sideNavBarColor}));
    this.checkForPreview();
  }
  checkForPreview() {
    const applyPreview = this.getParameterByName('applyPreview');
    if (applyPreview) {
      const primaryColor = '#' + this.getParameterByName('primaryColor');
      const secondaryColor = '#' + this.getParameterByName('secondaryColor');
      const sideNavBarColor = '#' + this.getParameterByName('sideNavBarColor');
      this.ApplyPreviewTheme(primaryColor,secondaryColor,sideNavBarColor)
    }
  }
  getParameterByName(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var url = window.location.href.replace(new RegExp('#', 'g'), '');
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  SetTitle(titleStr: string) {
    this.title.setTitle(titleStr);
  }

  setFavicon() {
    this._doc.getElementById('appFavicon').setAttribute('href', `${this.logoPath}fav-64.png`);
  }

  setThemeColor() {
    document.documentElement.style.setProperty("--dynamic-colour", this.appColors.primaryColor)
    document.documentElement.style.setProperty("--dynamic-secondary-colour", this.appColors.secondaryColor)
    document.documentElement.style.setProperty("--dynamic-sidenav", this.appColors.sideNavBarColor)
  }


  CheckShortNameAvailable(shortName: string, orgId?: number, facilityId?: number) {
    var qParam = '';
    if(orgId) {
      qParam = `&orgId=${orgId}`
    }
    if(facilityId) {
      qParam = `&facilityId=${facilityId}`
    }
    return this.http
      .get(this.baseUrl + `Facility/CheckShortNameAvailable?shortName=${shortName}${qParam}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  GetThemeByShortName(shortName: string) {
    return this.http
      .get(this.baseUrl + `Facility/GetThemeByShortName?shortName=${shortName}`, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetFacilityLogos(facilityId: number) {
    return this.http
      .put(this.baseUrl + `Facility/SetFacilityLogos/${facilityId}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetOrganizationLogos(orgID: number) {
    return this.http
      .put(this.baseUrl + `Facility/SetOrganizationLogos/${orgID}`, {}, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetFacilityTheme(facilityId: number, pColor: string, sColor: string, sideNav: string) {
    const bObj = {
      "primaryColor": pColor,
      "secondaryColor": sColor,
      "sideNavBarColor": sideNav,
    }
    return this.http
      .put(this.baseUrl + `Facility/SetFacilityTheme/${facilityId}`, bObj, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }
  SetOrganizationTheme(orgID: number, pColor: string, sColor: string, sideColor:string) {
    const bObj = {
      "primaryColor": pColor,
      "secondaryColor": sColor,
      "sideNavBarColor":sideColor,
    }
    return this.http
      .put(this.baseUrl + `Facility/SetOrganizationTheme/${orgID}`, bObj, httpOptions)
      .pipe(catchError(this.httpErrorService.handleHttpError));
  }

  ApplyLogosByShortName(shortName: string) {
    this.GetThemeByShortName(shortName).subscribe((data: {logoPath: string, title: string, primaryColor: string, secondaryColor: string, sideNavBarColor:string}) => {
      this.appTitle = data.title;
      this.logoPath = `https://${environment.logoAws}.s3.amazonaws.com/${data.logoPath}`;
      this.appColors.primaryColor = data.primaryColor;
      this.appColors.secondaryColor = data.secondaryColor;
      this.appColors.sideNavBarColor = data.sideNavBarColor;
      this.SetTitle(data.title);
      this.setFavicon();
      this.setThemeColor()
    }, () => {

    })
  }

  ApplyPreviewTheme(primaryColor: string, secondaryColor: string, sideNavBarColor: string) {
    this.appColors =  {primaryColor, secondaryColor, sideNavBarColor}
    this.setThemeColor();
  }
}
