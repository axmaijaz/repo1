import { DatePipe } from '@angular/common';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { BillingService } from 'src/app/core/billing.service';
import { LazyModalDto, PagingData } from 'src/app/model/AppModels/app.model';
import { CCMBillDto, EncounterClaimType } from 'src/app/model/bills.model';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { FacilityDto, FacilityType } from 'src/app/model/Facility/facility.model';
// import * as jsPDF from 'jspdf';
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { SecurityService } from "src/app/core/security/security.service";
import { UserType } from "src/app/Enums/UserType.enum";
import * as moment from "moment";
import { ChronicIcd10CodeDto } from "src/app/model/Patient/patient.model";
import { ActivatedRoute } from "@angular/router";
import { SubSink } from "src/app/SubSink";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from 'src/environments/environment';
import { EmrConnectService } from 'src/app/core/emr-connect.service';
import { AppUiService } from 'src/app/core/app-ui.service';
import { ManageExtensionService } from 'src/app/core/manage-extension.service';
import { Emr } from 'src/app/extension-manager/extensionManager.model';
import { SubmitClaimDto } from 'src/app/model/EmrConnect/emr-connect.model';
import { InvoiceForListDto } from 'src/app/model/Accounts/accounts.model';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { ClonerService } from 'src/app/core/cloner.service';

@Component({
  selector: 'app-ccm-billing',
  templateUrl: './ccm-billing.component.html',
  styleUrls: ['./ccm-billing.component.scss'],
})
export class CcmBillingComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("claimDocumentsModal") claimDocumentsModal: ModalDirective;
  private subs = new SubSink();
  isLoading = false;
  displayFQHCProp = false;
  reportGeneratedTime = new Date();
  rows = new Array<CCMBillDto>();
  rowsCopy = new Array<CCMBillDto>();
  PrintData = new Array<CCMBillDto>();
  // ExcelData = new Array<{
  //   'Patient Name': string;
  //   'FQHC Code': string;
  //   'Date Of Birth': string;
  //   'CPT Code': string;
  //   'Units': string;
  //   'ICD-10 Code': string;
  //   'Time Completed': string;
  //   'Billing Provider': string;
  //   'Service Date': string;
  // }>();
  ExcelData = new Array();
  ExcelSheetName = '';
  pagingData = new PagingData();
  facilityList = new Array<FacilityDto>();
  LoadingData: boolean;
  facilityId = 0;
  BillingMonth = 8;
  organizationId: number;
  invoiceId: number;
  facilityName: string;
  ispLoading = false;
  searchWatch = new Subject<string>();
  isSpinner: boolean;
  printFile: any;
  facility= new FacilityDto();
  UploadingFinancialClaim: boolean;
  loadingEmr: boolean;
  emrList: Emr[] = [];
  facilityEMR: Emr;
  EncounterClaimTypeEnum = EncounterClaimType;
  InvoiceDetails: InvoiceForListDto;
  serviceTypeFilter: number[] = []

  gridCheckAll = false;
  claimsIds: number[] = [];
  claimSubmitActionType = '';
  submitToEmr: boolean;
  submissionDetails: { claims: number; documents: number; };
  EncounterClaimTypeArr = this.filterData.getEnumAsList(EncounterClaimType);

  constructor(
    private sanatizer: DomSanitizer,
    private billingService: BillingService,
    private emrConnect: EmrConnectService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private toaster: ToastService,
    private extService: ManageExtensionService,
    private filterData: DataFilterService,
    private appUi: AppUiService,
    private cloner: ClonerService,
    private securityService: SecurityService,
    private facilityService: FacilityService
  ) {}

  ngAfterViewInit() {
    this.cellOverflowVisible();
    const rightRowCells = document.getElementsByClassName(
      'datatable-row-right'
    );
    rightRowCells[0].setAttribute(
      'style',
      'transform: translate3d(-17px, 0px, 0px)'
    );
  }

  private cellOverflowVisible() {
    const cells = document.getElementsByClassName(
      'datatable-body-cell overflow-visible'
    );
    for (let i = 0, len = cells.length; i < len; i++) {
      cells[i].setAttribute('style', 'overflow: visible !important');
    }



  }

  ngOnInit() {
    this.invoiceId = +this.route.snapshot.paramMap.get('id');
    this.checkUserType();
    this.getFacilityList();
    this.setPage({ offset: 0 });
    this.FQHCCheck();
    this.GetEmrList();
    this.GetInvoiceById();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  GetEmrList(){
    this.loadingEmr = true;
    this.extService.GetEmrList().subscribe((res: any) => {
      this.emrList = res;
      this.loadingEmr = false;
      this.getFacilityDetails();
    }, (err: HttpResError) => {
      this.loadingEmr = false;
      this.toaster.error(err.error);
    })
  }
  FQHCCheck() {
    const facilityType = this.securityService.getClaim('FacilityType')?.claimValue;
    if (facilityType === 'Traditional' && this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.displayFQHCProp = false;
    } else {
      this.displayFQHCProp = true;
    }
  }
  gridAllRowsCheckBoxChecked(e) {
    this.rows.forEach((data) => {
      if (data.encounterClaimType==EncounterClaimType.CCM || data.encounterClaimType==EncounterClaimType.RPM) {
        data.checked = e.target.checked;
      } else {
        data.checked = false;
      }
    });
    // if (e.target.checked) {
    //   this.selected = [];
    //   Object.assign(this.selected, this.rows);
    // } else {
    //   this.selected = [];
    // }
    this.EvaluateClaimSelection()
  }
  rowCheckBoxChecked(e, row) {
    this.gridCheckAll = false;
    // if (e.target.checked) {
    //   this.selected.push(row);
    // } else {
    //   const index = this.selected.findIndex(
    //     (x) => x.patientId === row.patientId
    //   );
    //   this.selected.splice(index, 1);
    // }
    this.EvaluateClaimSelection()
  }

  EvaluateClaimSelection() {
    this.claimsIds = this.rows.filter(x => x.checked == true).map(x => x.id)
    this.submissionDetails = {
      claims: 0,
      documents: 0
    }
    this.submissionDetails.claims = this.rows.filter(x =>x.checked && !x.emrClaimSubmitted ).length
    this.submissionDetails.documents = this.rows.filter(x =>x.checked && !x.emrDocumentSubmitted ).length
  }
  getFacilityList() {
    this.LoadingData = true;
    if (this.organizationId) {
      this.subs.sink = this.facilityService
        .getFacilityByOrgId(this.organizationId)
        .subscribe(
          // this.facilityService.getFacilityList().subscribe(
          (res: any) => {
            this.facilityList = res;
            this.LoadingData = false;
          },
          (error: HttpResError) => {
            this.toaster.error(error.error, error.message);
          }
        );
    } else {
      // this.facilityService.getFacilityByOrgId(this.organizationId).subscribe(
      this.subs.sink = this.facilityService.getFacilityList().subscribe(
        (res: any) => {
          this.facilityList = res;
          this.LoadingData = false;
        },
        (error: HttpResError) => {
          this.toaster.error(error.error, error.message);
        }
      );
    }
  }

  getFacilityDetails() {
    if (!this.facilityId) {
      return;
    }
    this.facilityService.getFacilityDetail(this.facilityId).subscribe(
      (res: FacilityDto) => {
        this.facility = res;
        this.facility.integrationEnabled
        this.facilityEMR = this.emrList.find(x => x.id == res.emrId);
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  SubmitClaimToEmr() {
    if (!this.facilityId) {
      return;
    }

    const claimSubmission = this.claimSubmitActionType == 'claim' || this.claimSubmitActionType == 'both'
    const docSubmission = this.claimSubmitActionType == 'doc' || this.claimSubmitActionType == 'both'
    this.submitToEmr = true;
    setTimeout(() => {
      this.claimsIds = [];
      this.submissionDetails = {claims: 0, documents: 0}
      this.claimSubmitActionType = '';
      this.claimDocumentsModal.hide()
      this.submitToEmr = false;
      this.rows.forEach(x => x.checked = false)
      this.toaster.info(`Claims are being processed , Review the progress`)
    }, 2000);
    this.emrConnect.UploadFinancialClaims( this.invoiceId ,this.facilityId, docSubmission ,claimSubmission, this.claimsIds).subscribe(
      (res: FacilityDto) => {
        this.claimsIds = [];
        this.submissionDetails = {claims: 0, documents: 0}
        this.claimSubmitActionType = '';
        // this.claimDocumentsModal.hide()
        this.submitToEmr = false;
        // this.setPage({ offset: 0 });
      },
      (err: HttpResError) => {
        this.submitToEmr = false;
        // this.toaster.error(err.error);
      }
    );
  }
  GetInvoiceById() {
    this.billingService.GetInvoiceById(this.invoiceId).subscribe(
      (res: InvoiceForListDto) => {
        this.InvoiceDetails = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  filterBills() {
    if (this.facilityId) {
      this.setPage({ offset: 0 }, 10);
    } else {
      this.checkUserType();
    }
  }
  checkUserType() {
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.organizationId = +this.securityService.getClaim('OrganizationId')
        .claimValue;
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    } else {
      this.organizationId = 0;
      this.facilityId = 0;
    }
  }

  FilterClaims() {
    if (!this.serviceTypeFilter.length) {
      this.serviceTypeFilter = [];
      this.rows = this.cloner.deepClone(this.rowsCopy);
      return
    }
    this.rows = this.rowsCopy.filter(x => this.serviceTypeFilter.includes(x.encounterClaimType))
  }

  setPage(pageInfo, pageSize?: number) {
    this.pagingData.pageNumber = pageInfo.offset;
    this.isLoading = true;
    console.log(this.invoiceId)
    this.subs.sink = this.billingService
      .GetEncounterClaimsByInvoiceId(this.invoiceId)
      .subscribe(
        (res: any) => {
          this.rows = res;
          this.rowsCopy = this.cloner.deepClone(res);
          if (this.rows.length > 0) {
            this.facilityName = this.rows[0].facilityName;
            const facilityId = this.rows[0].facilityId;
            if(facilityId){
              this.facilityId = facilityId;
              this.getFacilityDetails();
            }
          }
          this.PrintData = res;
          this.PrintData = this.PrintData.sort((a, b) => {
            if(a.patientName.toLowerCase() < b.patientName.toLocaleLowerCase()) { return -1; }
            return 0;
          })
          this.pagingData.elementsCount = res.length;
          // this.pagingData.pageSize = 10;
          // this.pagingData.pageNumber = res.pagingData.pageNumber - 1;
          this.isLoading = false;
          // this.filterPdfData();
        },
        (err: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  filterPdfData() {
    // this.isLoading = true;
    this.reportGeneratedTime = new Date();
    this.subs.sink = this.billingService
      .GetEncounterClaimsByInvoiceId(3)
      .subscribe(
        (res: any) => {
          this.PrintData = res.billsList;
          // this.isLoading = false;
        },
        (err: HttpResError) => {
          // this.isLoading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }

  // MakePDF() {
  //   const elementHandler = {
  //     '#ignorePDF': function (element, renderer) {
  //       return true;
  //     }
  //   };
  //   const doc = new jsPDF({
  //     orientation: 'portrait',
  //     format: 'letter'
  //   });

  //   doc.fromHTML(document.getElementById('onlineConset'), 15, 15, {
  //     'width': 180, 'elementHandlers': elementHandler
  //   });
  //   doc.save('test.pdf');
  // }
  // createPdfWithTimeOut() {
  //   this.isSpinner = true;
  //   this.ispLoading = true;
  //   setTimeout(() => {
  //     this.MakePDF();
  //   }, 500);
  // }
  // MakePDF() {
  //   const docHead = document.head.outerHTML;
  //   // const printContents = document.getElementById('onlineConset').outerHTML;
  //   // const winAttr =
  //   //   'location=yes, statusbar=no, menubar=no, titlebar=no, toolbar=no,dependent=no, width=865, height=600, resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes';

  //   //   const newWin = window.open('', '_blank');
  //   //   newWin.document.write(
  //   //     '<!doctype html><html>' +
  //   //       docHead +
  //   //       '<body onLoad="window.print()" style="background:none">' +
  //   //       printContents +
  //   //       '</body></html>'
  //   //   );
  //   //   newWin.document.open();

  //   let popupWinindow;
  //   let printContents = document.getElementById("onlineConset").outerHTML;
  //   popupWinindow = window.open(
  //     "",
  //     "_blank",
  //     "width=865,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes"
  //   );
  //   popupWinindow.document.open();
  //   popupWinindow.document.write(
  //     "<!doctype html><html>" +
  //       docHead +
  //       '<body onLoad="window.print()" style="background:none">' +
  //       printContents +
  //       "</body></html>"
  //   );
  //   popupWinindow.document.close();
  //   // const newWin = window.open('', '_blank', winAttr);
  //   // const writeDoc = newWin.document;
  //   // writeDoc.open();
  //   // newWin.focus();
  //   // newWin.print();
  //   // newWin.close();
  //   this.ispLoading = false;
  // }
  MakePDF() {
      this.isSpinner = true;
      let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
      nUrl =  environment.appUrl;
      nUrl = nUrl + 'success/loading';
      const tab = window.open(nUrl);
    this.billingService.GetEncounterClaimsPDFByInvoiceId(this.invoiceId).subscribe(res => {
      this.isSpinner = false;
      const file = new Blob([res], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(file);
      // this.printFile = this.sanatizer.bypassSecurityTrustResourceUrl(
      //   fileURL
      // );
      // window.open(this.printFile);
      tab.location.href = fileURL;
      },
      (err: HttpResError) => {
        this.isSpinner = false;
        this.toaster.error(err.error, err.message);
      });
  }
  MakeExcel() {
    if(this.facility.facilityType == FacilityType.FQHC){
      this.ExcelData = new Array<{
        'Patient EMR Id': string;
        'Patient Name': string;
        'FQHC Code': string;
        'Date Of Birth': string;
        'CPT Code': string;
        'Units': string;
        'ICD-10 Code': string;
        'Time Completed': string;
        'Billing Provider': string;
        'Consent Date': string;
        'Revoke Date': string;
        'Service Date': string;
        // 'Facility Name': string;
      }>();
    } else{
      this.ExcelData = new Array<{
        'Patient EMR Id': string;
        'Patient Name': string;
        'Date Of Birth': string;
        'CPT Code': string;
        'Units': string;
        'ICD-10 Code': string;
        'Time Completed': string;
        'Billing Provider': string;
        'Consent Date': string;
        'Revoke Date': string;
        'Service Date': string;
        // 'Facility Name': string;
      }>();
    }
    this.CreateExcelData();
    const myHeader = [
      'ID',
      'Bill Number',
      'Emr Id',
      'CPT Code',
      'Chronic Disease',
      'Service Month',
      'CCM Time',
      'Billing State',
      'Care Provider',
      'Patient Id',
      'Patient Name',
      'Facility Id',
      'Facility Name',
    ];
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: 'SheetJS Tutorial',
      Subject: 'Test',
      Author: 'Sohaib Javid',
      CreatedDate: new Date(),
      Company: 'Prmier Solutions',
    };
    let sheetName = 'CCM Invoice';
    if (this.ExcelSheetName) {
      sheetName = this.ExcelSheetName;
    }
    wb.SheetNames.push(sheetName);
    const ws_data = [['hello', 'world']];
    // const ws = XLSX.utils.aoa_to_sheet(ws_data);
    const ws = XLSX.utils.json_to_sheet<any>(this.ExcelData, {
      // header: myHeader,
      skipHeader: false,
    });
    const wscols = [
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];
    ws['!cols'] = wscols;
    wb.Sheets[sheetName] = ws;
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    // const wbout = XLSX.write(wb, {bookType: 'xlsx',  type: 'binary'});
    function s2ab(s: any) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        // tslint:disable-next-line: no-bitwise
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }
    const FileName = moment().format('YYYY-MM-DD hh:mm A');
    FileSaver.saveAs(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
      'CCM Billing ' + FileName + '.xlsx'
    );
  }
  CreateExcelData() {
    this.PrintData.forEach((item: CCMBillDto) => {
      if (item.dateOfBirth) {
        item.dateOfBirth =moment(item.dateOfBirth).format('DD-MMM-YYYY')
      }
      if (item.serviceDate) {
        item.serviceDate =moment(item.serviceDate).format('DD-MMM-YYYY')
      }
      if (item.consentDate) {
        item.consentDate = moment(item.consentDate, 'YYYY-M-DThh:mm:ss').format('DD-MMM-YYYY')
      }
      if(this.facility.facilityType == FacilityType.FQHC){
        this.ExcelData.push({
          'Patient EMR Id': this.checkIfNull(item.patientEmrId),
          'Patient Name': this.checkIfNull(item.patientName),
          'FQHC Code': this.checkIfNull(item.fqhcCode),
          'Date Of Birth': this.checkIfNull(item.dateOfBirth),
          'CPT Code': this.checkIfNull(item.cptCode),
          'Units': this.checkIfNull(item.units),

          'ICD-10 Code': this.checkIfNull(item.icd10Code),
          'Time Completed': this.checkIfNull(item.timeCompleted),
          'Service Date': this.checkIfNull(item.serviceDate),
          'Billing Provider': this.checkIfNull(item.billingProviderName),
          'Consent Date': this.checkIfNull(item.consentDate),
          'Revoke Date': this.checkIfNull(item.revokeDate),
          // 'Facility Name': this.checkIfNull(item.facilityName)
        });
      }else{
        this.ExcelData.push({
          'Patient EMR Id': this.checkIfNull(item.patientEmrId),
          'Patient Name': this.checkIfNull(item.patientName),
          'Date Of Birth': this.checkIfNull(item.dateOfBirth),
          'CPT Code': this.checkIfNull(item.cptCode),
          'Units': this.checkIfNull(item.units),

          'ICD-10 Code': this.checkIfNull(item.icd10Code),
          'Time Completed': this.checkIfNull(item.timeCompleted),
          'Service Date': this.checkIfNull(item.serviceDate),
          'Billing Provider': this.checkIfNull(item.billingProviderName),
          'Consent Date': this.checkIfNull(item.consentDate),
          'Revoke Date': this.checkIfNull(item.revokeDate),
          // 'Facility Name': this.checkIfNull(item.facilityName)
        });
      }
      if (item.facilityName) {
        this.ExcelSheetName = item.facilityName.toString();
        if (this.ExcelSheetName.length > 29) {
          this.ExcelSheetName = this.ExcelSheetName.substring(0, 26) + '...';
        }
      }
    });
  }
  checkIfNull(data: any): string {
    if (data) {
      return data.toString();
    } else {
      return '';
    }
  }
  getIcd10Codes(data: Array<ChronicIcd10CodeDto>): string {
    if (data.length > 0) {
      let str = '';
      data.forEach((item) => {
        if (item.icdCode) {
          str += item.icdCode + ' , ';
        }
      });
      return str;
    } else {
      return '';
    }
  }
  openConfirmModal(row: CCMBillDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Generate Claim";
    modalDto.Text = "Are you sure to generate Claim?";
    modalDto.callBack = this.UploadFinancialClaim;
    modalDto.data = row;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  UploadFinancialClaim = (row: CCMBillDto) => {
    const calimObj = new SubmitClaimDto();
    calimObj.patientId = row.patientId;
    calimObj.claimType = row.encounterClaimType;
    calimObj.monthId = this.InvoiceDetails.monthId;
    calimObj.yearId = this.InvoiceDetails.yearId;
    row.loading = true;
    this.emrConnect.UploadFinancialClaim(row.patientId, calimObj)
      .subscribe(
        (res: any) => {
          row.loading = false;
          this.toaster.success(`Claim generated successfully`);
        },
        (err: HttpResError) => {
          this.toaster.error( err.error, err.message);
          row.loading = false;
        }
      );
  }
  openConfirmDocumentModal(row: CCMBillDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Submit Document";
    modalDto.Text = "Are you sure to submit Document?";
    modalDto.callBack = this.UploadFinancialClaimDocument;
    modalDto.data = row;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  UploadFinancialClaimDocument = (row: CCMBillDto) => {
    const calimObj = new SubmitClaimDto();
    calimObj.patientId = row.patientId;
    calimObj.claimType = row.encounterClaimType;
    calimObj.monthId = this.InvoiceDetails.monthId;
    calimObj.yearId = this.InvoiceDetails.yearId;
    row.loading = true;
    this.emrConnect.UploadFinancialClaimDocument(row.patientId, calimObj)
      .subscribe(
        (res: any) => {
          row.loading = false;
          this.toaster.success(`Claim Document submitted successfully`);
        },
        (err: HttpResError) => {
          this.toaster.error( err.error, err.message);
          row.loading = false;
        }
      );
  }
}
