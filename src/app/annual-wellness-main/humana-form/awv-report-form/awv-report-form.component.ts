import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { AppUiService } from 'src/app/core/app-ui.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { Clipboard } from '@angular/cdk/clipboard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { GetAWReportDto, UpdateAWReportDto } from 'src/app/model/AnnualWellness/aw.model';
declare var tinymce: any;

@Component({
  selector: 'app-awv-report-form',
  templateUrl: './awv-report-form.component.html',
  styleUrls: ['./awv-report-form.component.scss']
})
export class AwvReportFormComponent implements OnInit {
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
  getAWReportDto = new GetAWReportDto();
  updateAWReportDto = new UpdateAWReportDto();
  constructor(private awService: AwService, private securityService: SecurityService,private clipboard: Clipboard, private route: ActivatedRoute,
    private appUi: AppUiService, private toaster: ToastService) { }

  ngOnInit() {
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    this.annualWellnessID = +this.route.pathFromRoot[3].snapshot.paramMap.get('awId');
    this.GetAWReportFormData();
  }
  UpdateAWReport() {
    this.updateAWReportDto.report = this.getAWReportDto.report;
    this.updateAWReportDto.awEncounterId = this.annualWellnessID;
    this.awService.UpdateAWReport(this.updateAWReportDto).subscribe((res: any) => {
      // this.pwFormData = res;
      this.gettingFormData = false;
      // this.superBillDto = res;
    }, (res: HttpResError) => {
      this.gettingFormData = false;
      this.toaster.error(res.error, res.message);
    });
  }
  GetAWReportFormData() {
    this.gettingFormData = true;
    // const result = this.cloneService.deepClone<HumanaResDto>(this.humanaResObj);
    this.awService.GetAWReport(this.annualWellnessID).subscribe((res: GetAWReportDto) => {
      // this.pwFormData = res;
      this.getAWReportDto = res;
      this.gettingFormData = false;
      // this.superBillDto = res;
    }, (res: HttpResError) => {
      this.gettingFormData = false;
      this.toaster.error(res.error, res.message);
    });
  }
  RefreshAWReport() {
    this.updateFormData = true;
    this.gettingFormData = true;
    // const result = this.cloneService.deepClone<HumanaResDto>(this.humanaResObj);
    this.awService.RefreshAWReport(this.annualWellnessID).subscribe((res: GetAWReportDto) => {
      this.getAWReportDto = res;
      this.updateFormData = false;
      this.gettingFormData = false;
      this.GetPreviousAWReport();
      // this.superBillDto = res;
    }, (res: HttpResError) => {
      this.updateFormData = false;
      this.gettingFormData = false;
      this.toaster.error(res.error, res.message);
    });
  }
  GetPreviousAWReport() {
    if (this.isPreviousFormData) {
      // this.isPreviousFormData = true;
      // const result = this.cloneService.deepClone<HumanaResDto>(this.humanaResObj);
      this.awService.GetPreviousAWReport(this.annualWellnessID).subscribe((res: any) => {
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
  this.RefreshAWReport();
}
}

