import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from './../../core/security/security.service';
import { AppDataService } from 'src/app/core/app-data.service';
import { LaunchModeEnum } from 'src/app/model/AppData.model';
import { AppUiService } from 'src/app/core/app-ui.service';

@Component({
  selector: 'app-laucnch-app',
  templateUrl: './laucnch-app.component.html',
  styleUrls: ['./laucnch-app.component.scss']
})
export class LaucnchAppComponent implements OnInit {
  facilityId: number;
  userId: string;
  linkUrl: string;
  reason: string;

  constructor(private route: ActivatedRoute, private appDataService: AppDataService, private appUi: AppUiService, private appData: AppDataService,
    private securityService: SecurityService, private router: Router) { }

  ngOnInit(): void {
    this.facilityId = +this.route.snapshot.queryParamMap.get('facilityId');
    this.userId = this.route.snapshot.queryParamMap.get('userId');
    this.linkUrl = this.route.snapshot.queryParamMap.get('linkUrl');
    const fromExt = this.route.snapshot.queryParamMap.get('fromExt');
    const context = this.route.snapshot.queryParamMap.get('context');
    if (context) {
      if (context == '1') {
        this.appDataService.launchMode = LaunchModeEnum.SinglePatient;
      }
      if (context == '2') {
        this.appDataService.launchMode = LaunchModeEnum.GlobalContext;
      }
    }
    console.log(this.securityService.securityObject?.appUserId + '  ' + this.userId)
    window.addEventListener('message', this.receiveMessage, false);
    const launchValid = this.isLaunchValid();
    if (launchValid) {
      this.router.navigateByUrl(this.linkUrl);
    }
    // Update App Token on Launch
    else if(fromExt) {
      const obj = {
        type: 'OnRequestLoginData',
        mData: {}
      }

      window.parent.postMessage(obj, '*');
    } else {
      setTimeout(() => {
        const obj = {
          type: 'launchAppResult',
          mData: { isValid: false, reason: this.reason}
        }

        window.parent.postMessage(obj, '*');
      }, 4000);
    }
  }
  receiveMessage = (event) => {
    if (event.data.type === 'ResponseLoginData') {
      const securityObj = JSON.parse(event.data.mData);
      this.securityService.updateToken(securityObj)
      this.router.navigateByUrl(this.linkUrl);
    }

    if (event.data.type === 'ExtensionPatientInfo') {
      console.info(event.data)
      const patientInfo = event.data.mData; // mData is object already
      // const patientInfo = JSON.parse(event.data.mData);
      this.appData.extensionPatient = patientInfo;
    }
    if (event.data.type === 'ExtensionPatientExtraInfo') {
      console.info(event.data)
      const patientInfo = event.data.mData; // mData is object already
      debugger
    }
  }

  isLaunchValid(): boolean {
    if (!this.securityService.isLoggedIn()) {
      this.reason = 'User is not logged in';
      return false;
    }
    if (this.securityService.securityObject?.appUserId !== this.userId) {
      this.reason = 'Logged in user is different in Web Portal';
      return false;
    }
    const currentFacilityId = +this.securityService.getClaim('FacilityId')?.claimValue;
    if (currentFacilityId != this.facilityId) {
      this.reason = 'Your facility is different than Web Portal';
      return false;
    }
    return true;
  }

}
