import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';

@Component({
  selector: 'app-twc-cmodals',
  templateUrl: './twc-cmodals.component.html',
  styleUrls: ['./twc-cmodals.component.scss']
})
export class TwcCModalsComponent implements OnInit {

  modalObj = new LazyModalDto();
  attemptsCount = 0;
  @ViewChild('loginAttemptWarningModal') loginAttemptWarningModal: ModalDirective;
  constructor(private eventBus: EventBusService, private securityService: SecurityService, private router: Router) {
    eventBus.on(EventTypes.OpenSharedLoginWarningModal).subscribe((res: LazyModalDto) => {
      this.modalObj = res;
      this.attemptsCount = 5 - securityService.securityObject.loginCount;
      setTimeout(() => {
        this.loginAttemptWarningModal.config = {
          backdrop: false,
          ignoreBackdropClick: true,
        };
        console.log('attemps c')
        this.loginAttemptWarningModal.show();
      }, 1000);
    });
   }

  ngOnInit() {
  }
  proceed() {
    this.loginAttemptWarningModal.hide();
    const self = this;
    // this.modalObj.callBack(this.modalObj.data);
    const callFunc = this.modalObj.callBack.bind(this);
    const mydata = this.modalObj.data;
    callFunc(mydata);
  }
  reject() {
    this.loginAttemptWarningModal.hide();
    if (this.modalObj.rejectCallBack) {
      const self = this;
      // this.modalObj.callBack(this.modalObj.data);
      const callFunc = this.modalObj.rejectCallBack.bind(this);
      const mydata = this.modalObj.data;
      callFunc(mydata);
    }
  }
  navigateToProfile() {
    this.router.navigateByUrl('/user/info')
  }
}
