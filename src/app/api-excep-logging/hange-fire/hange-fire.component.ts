import { Component, OnInit } from '@angular/core';
import { ApiExceptionsService } from 'src/app/core/Exceptions/api-exceptions.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { SecurityService } from 'src/app/core/security/security.service';

@Component({
  selector: 'app-hange-fire',
  templateUrl: './hange-fire.component.html',
  styleUrls: ['./hange-fire.component.scss']
})
export class HangeFireComponent implements OnInit {
  isLoading = true;
  hangFireUrl: any;
  hangFireHtml: any;
  constructor(private securityService: SecurityService, private toaster: ToastService, private sanatizer: DomSanitizer) { }

  ngOnInit(): void {
    this.TryApi();
  }
  TryApi() {
    const baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl :  environment.baseUrl;
    const data_url = baseUrl.replace('api/', 'hangfire') + `?access_token=${this.securityService.securityObject.bearerToken}`;
    // this.hangFireUrl = this.sanatizer.bypassSecurityTrustResourceUrl(data_url);
    window.open(data_url, '_blank');
    // this.isLoading = true;
    // this.exceptionService.GetHangFire()
    //   .subscribe(
    //     (res: any) => {
    //       // this.hangFireHtml = this.sanatizer.bypassSecurityTrustHtml(res);
    //       // setTimeout(() => {
    //       //   const elementI = document.querySelector('#hangFireIframeUrl') as any;
    //       //   elementI.contentWindow.document.body.innerHTML = this.hangFireHtml;
    //       //   this.isLoading = false;
    //       // }, 2000);

    //       // const myBlob = new Blob([res], {type: 'plain/html'});
    //       const data_url = URL.createObjectURL(res);
    //       this.hangFireUrl = this.sanatizer.bypassSecurityTrustResourceUrl(data_url);
    //       // this.toaster.success('Take a back seat', 'Everything is working fine.');
    //         this.isLoading = false;
    //     },
    //     (error: HttpResError) => {
    //       this.isLoading = false;
    //       this.toaster.error(error.message, error.error);
    //     }
    //   );
  }

}
