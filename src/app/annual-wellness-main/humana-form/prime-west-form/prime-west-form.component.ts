import { EditorModule } from '@tinymce/tinymce-angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { Clipboard } from '@angular/cdk/clipboard';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { GetPWReportDto, UpdatePWReportDto } from 'src/app/model/AnnualWellness/aw.model';
declare var tinymce: any;
@Component({
  selector: 'app-prime-west-form',
  templateUrl: './prime-west-form.component.html',
  styleUrls: ['./prime-west-form.component.scss']
})
export class PrimeWestFormComponent implements OnInit {
  @ViewChild ('editor12') editor12;
  loadingEditor = true;
  loadingEditor1 = true;
  pwFormData = '';
  PreviousPWFormData = '';
  gettingFormData: boolean;
  PatientId: number;
  annualWellnessID: number;
  updateFormData: boolean;
  isPreviousFormData: boolean;
  getPWReportDto = new GetPWReportDto();
  updatePWReportDto = new UpdatePWReportDto();
  constructor(private awService: AwService, private securityService: SecurityService,private clipboard: Clipboard, private route: ActivatedRoute,
    private appUi: AppUiService, private toaster: ToastService) { }

  ngOnInit() {
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    this.annualWellnessID = +this.route.pathFromRoot[3].snapshot.paramMap.get('awId');
    this.GetPrimeWestFormData();
  }
  UpdatePWReport() {
    this.updatePWReportDto.report = this.getPWReportDto.report;
    this.updatePWReportDto.awEncounterId = this.annualWellnessID;
    this.awService.UpdatePWReport(this.updatePWReportDto).subscribe((res: any) => {
      // this.pwFormData = res;
      this.gettingFormData = false;
      // this.superBillDto = res;
    }, (res: HttpResError) => {
      this.gettingFormData = false;
      this.toaster.error(res.error, res.message);
    });
  }
  GetPrimeWestFormData() {
    this.gettingFormData = true;
    // const result = this.cloneService.deepClone<HumanaResDto>(this.humanaResObj);
    this.awService.GetPWReport(this.annualWellnessID).subscribe((res: GetPWReportDto) => {
      // this.pwFormData = res;
      this.getPWReportDto = res;
      this.gettingFormData = false;
      // this.superBillDto = res;
    }, (res: HttpResError) => {
      this.gettingFormData = false;
      this.toaster.error(res.error, res.message);
    });
  }
  RefreshPWReport() {
    this.updateFormData = true;
    this.gettingFormData = true;
    // const result = this.cloneService.deepClone<HumanaResDto>(this.humanaResObj);
    this.awService.RefreshPWReport(this.annualWellnessID).subscribe((res: GetPWReportDto) => {
      this.getPWReportDto = res;
      this.updateFormData = false;
      this.gettingFormData = false;
      this.GetPreviousPWReport();
      // this.superBillDto = res;
    }, (res: HttpResError) => {
      this.updateFormData = false;
      this.gettingFormData = false;
      this.toaster.error(res.error, res.message);
    });
  }
  GetPreviousPWReport() {
    if (this.isPreviousFormData) {
      // this.isPreviousFormData = true;
      // const result = this.cloneService.deepClone<HumanaResDto>(this.humanaResObj);
      this.awService.GetPreviousPWReport(this.annualWellnessID).subscribe((res: any) => {
        this.PreviousPWFormData = res;
        // this.isPreviousFormData = false;
        // this.superBillDto = res;
      }, (res: HttpResError) => {
        // this.isPreviousFormData = false;
        this.toaster.error(res.error, res.message);
      });
    }
  }
  copyPWform() {
    tinymce.activeEditor.selection.select(tinymce.activeEditor.getBody());
    tinymce.activeEditor.execCommand( "Copy" );
  //   let mydoc = document;
  //  const div = mydoc.createElement('div');
  //  // div.style.display = 'none';
  //  // const data: string = text;
  //  div.innerHTML = this.pwFormData;
  //  mydoc.body.appendChild(div);
  //  const text = div.innerText;
  //  div.remove();
  //  this.clipboard.copy(this.pwFormData);
   this.toaster.success('Content Copied');
 }
 openConfirmModal() {
  const modalDto = new LazyModalDto();
  modalDto.Title = "Update from AW";
  modalDto.Text = "This will reset all the changes, you have made. Do you want to continue?";
  modalDto.callBack = this.callBack;
  // modalDto.data = data;
  this.appUi.openLazyConfrimModal(modalDto);
}
callBack = (data: any) => {
  this.RefreshPWReport();
}
}
