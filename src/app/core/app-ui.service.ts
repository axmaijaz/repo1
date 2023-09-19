import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { CCMQualityCheckMOdalDto } from '../model/admin/ccm.model';
import { AnnouncementListDto, LazyModalDto, VerifyModalDto } from '../model/AppModels/app.model';
import { RpmPatientsListDto, RPMQualityCheckModalDto } from '../model/rpm.model';
import { FacilityService } from './facility/facility.service';

@Injectable({
  providedIn: 'root'
})
export class AppUiService {
  public AppLoading = new Subject<boolean>();
  public showSideNav = new Subject<boolean>();
  public lazyConfirmationSubject = new Subject<boolean>();
  // public patientTasklazyConfirmationSubject = new Subject<boolean>();
  public showConfirmationSubject = new Subject<LazyModalDto>();
  public showVerifyProviderModalSubject = new Subject<VerifyModalDto>();
  public showPatientTaskSubject = new Subject<boolean>();
  public isLazyConfirmationLoaded: boolean;
  public isPatientTaskModuleLoaded: boolean;
  public iOS: boolean;
  public isInStandaloneMode: boolean;

  public lazyConsentConfirmationSubject = new Subject<boolean>();
  public showConsentConfirmationSubject = new Subject<LazyModalDto>();
  public isLazyConsentLoaded: boolean;
  public loadPatientConsents = new Subject();
  openCCMQualityCheckModal = new Subject<CCMQualityCheckMOdalDto>();
  openRPMQualityCheckModal = new Subject<RPMQualityCheckModalDto>();
  hideModalitiesDetails = new Subject();
  chatShown: boolean;
  appAnnouncementsList: AnnouncementListDto[];

  pageLoadActions: string;

  constructor() {
    const nav = navigator as any;
    this.iOS = (/iPad|iPhone|iPod/.test(navigator.platform) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) && !(<any>window).MSStream;
    this.isInStandaloneMode = (window.matchMedia('(display-mode: standalone)').matches) || (nav.standalone) || document.referrer.includes('android-app://');
  }
  showAppLoader() {
    this.AppLoading.next(true);
  }
  hideAppLoader() {
    this.AppLoading.next(false);
  }
  showAppSideNav() {
    this.showSideNav.next(true);
  }
  hideAppSideNav() {
    this.showSideNav.next(false);
  }
  openLazyConfrimModal(modalDto: LazyModalDto) {
    if (this.isLazyConfirmationLoaded) {
      this.showConfirmationSubject.next(modalDto);
    } else {
      this.lazyConfirmationSubject.next();
    }
  }
  openLazyConsentModal(modalDto: LazyModalDto) {
    if (this.isLazyConsentLoaded) {
      this.showConsentConfirmationSubject.next(modalDto);
    } else {
      this.lazyConsentConfirmationSubject.next();
    }
  }
  openVerifyProviderMOdal(modalDto: VerifyModalDto) {
      this.showVerifyProviderModalSubject.next(modalDto);
  }
  SavePageLoadActions() {
    const value = this.getParameterByName('PageLoadActions')
    if (value) {
      this.pageLoadActions = value;
    }
  }

  private getParameterByName(name) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    var url = window.location.href.replace(new RegExp('#', 'g'), '');
    var results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

}
