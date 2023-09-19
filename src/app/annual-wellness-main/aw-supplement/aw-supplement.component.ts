import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { SecurityService } from 'src/app/core/security/security.service';
import { AppUiService } from 'src/app/core/app-ui.service';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { Router, ActivatedRoute } from '@angular/router';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { SuperBillDto, SuperbillHoverDto } from 'src/app/model/AnnualWellness/superbill.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { Location } from '@angular/common';
import moment from 'moment';
// import * as jsPDF from 'jsPdf';
// import * as FileSaver from 'file-saver';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { AppDataService } from 'src/app/core/app-data.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { environment } from 'src/environments/environment';
import { fromEvent } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { SubSink } from 'src/app/SubSink';


@Component({
  selector: 'app-aw-supplement',
  templateUrl: './aw-supplement.component.html',
  styleUrls: ['./aw-supplement.component.scss']
})
export class AwSupplementComponent implements OnInit, AfterViewInit {
  PatientId: number;
  annualWellnessID: number;
  isBillingProvider: boolean;
  billingProviderId: number;
  superBillDto = new SuperBillDto();
  ettingAwSupplements: boolean;
  editingSuperBill: boolean;
  printingData: boolean;
  PatientData: any;
  isSyncDisabled: boolean;
  activeTitleObj = {};
  superbillHoverDto = new SuperbillHoverDto();
  @ViewChild('textarea') textarea: ElementRef;

  @ViewChild('dxCodes') dxCodes: ElementRef;
  @ViewChild('notes') notes: ElementRef;
  // @ViewChild('dxCodes') dxCodes: ElementRef;
  private subs = new SubSink();
  public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'minimal-dark',
    scrollInertia: 0
  };

  gapsData: string;
  printingDataHM: boolean;
  activeTabId: number;
  objectURLStr: any;
  objectURLStrAW: any;
  constructor(private location: Location, private patientsService: PatientsService, private securityService: SecurityService, private eventBus: EventBusService,
     private appUi: AppUiService, private toaster: ToastService, private router: Router, private route: ActivatedRoute, private awService: AwService,
     private appDataService: AppDataService) { }

  ngOnInit() {
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    this.annualWellnessID = +this.route.pathFromRoot[3].snapshot.paramMap.get('awId');
    if (this.securityService.hasClaim('IsBillingProvider')) {
      this.isBillingProvider = true;
      this.billingProviderId = this.securityService.securityObject.id;
    }
    this.gertPatientData();
    this.GetAWEncounterPatientTabById();
    this.GetSuperbillHoverData(this.annualWellnessID);
    this.eventBus.on(EventTypes.GapsDataChanged).subscribe((res) => {
      this.GetSuperbillHoverData(this.annualWellnessID);
      this.GetAWEncounterPatientTabById();
    });
    this.eventBus.on(EventTypes.AwSyncingCheckbox).subscribe((res) => {
      // this.GetAWEncounterPatientTabById();
      // this.isSyncDisabled = res;
      if (res) {
       this.superBillDto.gapsData = res;
      }
    });
    this.GetIsSyncFromAnnualWellness(this.annualWellnessID);
  }
  ngAfterViewInit() {
    this.textarea.nativeElement.focus();
    this.subs.sink = fromEvent(this.dxCodes.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000)
      )
      .subscribe((text: string) => {
        this.EditSuperBill();
      });
    this.subs.sink = fromEvent(this.notes.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(1000)
      )
      .subscribe((text: string) => {
        this.EditSuperBill();
      });
    this.subs.sink = fromEvent(this.textarea.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        debounceTime(500)
      )
      .subscribe((text: string) => {
        this.EditSuperBill();
      });
  }
  ngOnDestroy() {
   this.subs.unsubscribe();
  }
  GetSuperbillHoverData(annualWellnessID) {
    this.awService.GetSuperbillHoverData(annualWellnessID).subscribe(
      (res: SuperbillHoverDto) => {
        this.superbillHoverDto = res;
        // this.toaster.success("");
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetIsSyncFromAnnualWellness(annualWellnessID) {
    this.awService.GetIsSyncFromAnnualWellness(annualWellnessID).subscribe(
      (res: boolean) => {
        this.isSyncDisabled = res;
        // this.toaster.success("");
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  gertPatientData() {
    if (this.PatientId) {
      this.patientsService
        .getPatientDetail(this.PatientId)
        .subscribe(
          (res: any) => {
            if (res) {
              this.PatientData = res;
             }
          },
          error => {
            // console.log(error);
          }
        );
    }
  }
  saveTempGapsData() {
    if (this.isSyncDisabled) {
      this.appDataService.awGapsData = this.superBillDto.gapsData;
    }
  }
  GetAWEncounterPatientTabById() {
    this.ettingAwSupplements = true;
    this.awService.GetSuperBill(this.annualWellnessID).subscribe((res: SuperBillDto) => {
      this.ettingAwSupplements = false;
      this.superBillDto = res;
      this.gapsData = res.gapsData;
      if (this.appDataService.awGapsData && this.isSyncDisabled) {
        this.superBillDto.gapsData = this.appDataService.awGapsData;
      }
      setTimeout(() => {
        this.GetTitleState();
      }, 1000);
    }, (res: HttpResError) => {
      this.ettingAwSupplements = false;
      this.toaster.error(res.error, res.message);
    });
  }
  EditSuperBill() {
    this.editingSuperBill = true;
    this.awService.EditSuperBill(this.superBillDto).subscribe((res: SuperBillDto) => {
      this.editingSuperBill = false;
      this.superBillDto = res;
    }, (res: HttpResError) => {
      this.editingSuperBill = false;
      this.toaster.error(res.error, res.message);
    });
  }
  navigateBack() {
    this.location.back();
  }
  PrintData(modal?: ModalDirective) {
    this.printingDataHM = true;
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    // const importantStuff = window.open(nUrl);
    this.awService.GetSuperBillPdf(this.annualWellnessID).subscribe(res => {
    this.printingDataHM = false;
    const file = new Blob([res], { type: 'application/pdf' });
    const fileURL = window.URL.createObjectURL(file);
    this.objectURLStr = fileURL;
    // importantStuff.location.href = fileURL;
    if (!modal.isShown) {
      this.activeTabId = 1;
      modal.show();
    }
    // FileSaver.saveAs(
    //   new Blob([res], { type: 'application/pdf' }),
    //   `${this.appDataService.summeryViewPatient.firstName.charAt(0)}${this.appDataService.summeryViewPatient.lastName.charAt(0)}-(${this.appDataService.summeryViewPatient.patientEmrId})-SuperBill.pdf`
    // );
    },
    (err: HttpResError) => {
      this.printingDataHM = false;
      this.toaster.error(err.error, err.message);
    });
}
DownLoadPdf(modal?: ModalDirective) {
  this.printingData = true;
  let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
  nUrl =  environment.appUrl;
  nUrl = nUrl + 'success/loading';
  // const importantStuff = window.open(nUrl);
  setTimeout(() => {
    const btn = document.getElementById('superBillBtn');
    if (btn) {
      btn.click();
    }
  }, 100);
  this.awService
    .GetAnnualWellnessPdf(this.annualWellnessID)
    .subscribe(
      (res: any) => {
        const file = new Blob([res], { type: 'application/pdf' });
        const fileURL = window.URL.createObjectURL(file);
        // importantStuff.location.href = fileURL;
        this.objectURLStrAW = fileURL;
        if (!modal.isShown) {
          this.activeTabId = 2;
          modal.show();
        }
      // FileSaver.saveAs(
      //     new Blob([res], { type: 'application/pdf' }),
      //     `${this.appDataService.summeryViewPatient.firstName.charAt(0)}${this.appDataService.summeryViewPatient.lastName.charAt(0)}-(${this.appDataService.summeryViewPatient.patientEmrId})-Annual-wellness.pdf`
      //   );
        this.printingData = false;
      },
      (err: any) => {
        this.printingData = false;
        this.toaster.error(err.error, err.message);
      }
    );
}
openConfirmModal() {
  const modalDto = new LazyModalDto();
  modalDto.Title = 'Refresh Gaps Data';
  modalDto.Text = 'Changes you made in Gaps Data may be lost, Do you want to refresh ?';
  modalDto.callBack = this.RefreshGapsData;
    // modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  RefreshGapsData = () => {
    this.awService.RefreshGapsData(this.annualWellnessID).subscribe(
      (res: any) => {
        if (res) {
          this.superBillDto.gapsData = res.gapsData;
         }
         this.toaster.success('Gaps data refreshed');
        // this.isSyncDisabled = res;
        // this.EmitEventForGapDataChange();
        // this.toaster.success("");
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  // PrintData() {
  //   // this.printingData = true;
  //   // const w = window.open();
  //   const mywindow = window.open('', 'PRINT', 'height=400,width=600');

  //   mywindow.document.write('<html><head><title>' + document.title + '</title>');
  //   mywindow.document.write(`<style>@page{size:letter portrait;margin:0mm 0mm 0mm 0mm}*{font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
  //   "Helvetica Neue", sans-serif;font-size:10px}strong{font-weight:500}#supplement-table table.supplement{padding:0}table.sup-sec tr:not(:last-child)
  // td{border-bottom:1px solid #c4c4c4}table.sup-sec td.check-cell{text-align:center}table.sup-sec tr td:not(:first-child){border-left:1px solid #c4c4c4}table.sup-sec{border:1px solid #c4c4c4;margin:5px 0;
  // border-spacing:0;border-collapse:separate}table.sup-sec tr{border-bottom:1px solid #c4c4c4}td.title{background-color:#eaeaea}.sup-sec-sub{border-spacing:0;border-collapse:separate}.check-cell label{font-size:12px;line-height:2}
  // @media print{td.cell-code,td.check-cell{width:40px;text-align:center}}</style>`);
  //   mywindow.document.write('</head><body >');
  //   mywindow.document.write('<h1>' + document.title + '</h1>');
  //   mywindow.document.write(document.getElementById('supplement-table').innerHTML);
  //   mywindow.document.write('</body></html>');
  // //   mywindow.document.write('<html><head><title>' + document.title  + '</title>');
  // //   mywindow.document.write('</head><body >');
  // //   mywindow.document.write('<h1>' + document.title  + '</h1>');
  // //   mywindow.document.write(document.getElementById('supplement-table').innerHTML);
  // //   mywindow.document.write('</body></html>');

  //   mywindow.document.close(); // necessary for IE >= 10
  //   mywindow.focus(); // necessary for IE >= 10*/

  //   mywindow.print();
  //   // mywindow.close();
  //   // w.document.write(document.getElementById('supplement-table').innerHTML);
  //   // w.print();
  //   // w.close();
  //   // const elementHandler = {
  //   //   '#ignorePDF': function (element, renderer) {
  //   //     return true;
  //   //   }
  //   // };
  //   // const doc = new jsPDF({
  //   //   orientation: 'portrait',
  //   //   format: 'letter'
  //   // });

  //   // doc.fromHTML(document.getElementById('supplement-table'), 15, 15, {
  //   //   'width': 180, 'elementHandlers': elementHandler
  //   // });
  //   // this.printingData = true;
  //   // doc.save('SuperBill.pdf');
  // }
  copyData(data: string) {
    const textArea = document.createElement('textarea');
    // textArea.style.display = 'none';
    textArea.value = data;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    document.execCommand('copy');
    textArea.remove();
    this.toaster.success('Content Copied');
  }
  GetTitleState() {
    this.appDataService.GetAppState(`SB${this.annualWellnessID}`).subscribe((x: any) => {
      if (x && x.value) {
        this.activeTitleObj = JSON.parse(x.value);
      } else {
        this.activeTitleObj = {};
      }
    });
  }
  SetTitleState(title: string) {
    let result = 1;
    if (this.activeTitleObj[title] === 1 || !this.activeTitleObj[title]) {
      result = 2;
    }
    if (this.activeTitleObj[title] === 2) {
      result = 3;
    }
    if (this.activeTitleObj[title] === 3) {
      result = 1;
    }
    this.activeTitleObj[title] = result;
    this.activeTitleObj['updatedOn'] = moment().format('YYYY-MM-DD');
    // preserveSBObjects[this.annualWellnessID] = this.activeTitleObj;
    // localStorage.setItem('preserveSBObjects', JSON.stringify(preserveSBObjects));
    this.saveAppState();
  }
  saveAppState() {
    this.appDataService.AddUpdateAppState(`SB${this.annualWellnessID}`, JSON.stringify(this.activeTitleObj) ).subscribe(x => {

    });
  }
}
