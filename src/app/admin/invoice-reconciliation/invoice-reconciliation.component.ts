import { DatePipe } from "@angular/common";
import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from "@angular/core";
import { HttpResError } from "src/app/model/common/http-response-error";
import { BillingService } from "src/app/core/billing.service";
import { PagingData } from "src/app/model/AppModels/app.model";
import { CCMBillDto } from "src/app/model/bills.model";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { FacilityService } from "src/app/core/facility/facility.service";
import {
  FacilityDto,
  FacilityType,
} from "src/app/model/Facility/facility.model";
import { SecurityService } from "src/app/core/security/security.service";
import { UserType } from "src/app/Enums/UserType.enum";
import * as moment from "moment";
import { ChronicIcd10CodeDto } from "src/app/model/Patient/patient.model";
import { ActivatedRoute } from "@angular/router";
import { SubSink } from "src/app/SubSink";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { DomSanitizer } from "@angular/platform-browser";
import { environment } from "src/environments/environment";
import { AddEditCptChargesDto } from "src/app/model/Accounts/accounts.model";
import { DataFilterService } from "src/app/core/data-filter.service";
import { DatatableComponent } from "@swimlane/ngx-datatable";
import * as XLSX from "xlsx";
import {
  InvoiceCaseStatus,
  InvoicePatientResponseType,
  InvoicePaymentMode,
  PaymentStatus,
} from "src/app/Enums/billing.enum";
import {
  EncounterClaim,
  FilterInvoice,
} from "src/app/model/Accounts/invoice.model";
import FileSaver from "file-saver";

@Component({
  selector: "app-invoice-reconciliation",
  templateUrl: "./invoice-reconciliation.component.html",
  styleUrls: ["./invoice-reconciliation.component.scss"],
})
export class InvoiceReconciliationComponent implements OnInit {
  @ViewChild("encounterClaimsModal") encounterClaimsModal: ModalDirective;

  paymentEnumList = this.filterDataService.getEnumAsList(InvoicePaymentMode);
  caseStatusEnumList = this.filterDataService.getEnumAsList(InvoiceCaseStatus);
  paymentStatusEnumList = this.filterDataService.getEnumAsList(PaymentStatus);
  patientResponseTypeEnumList = this.filterDataService.getEnumAsList(
    InvoicePatientResponseType
  );
  InvoiceCaseStatusEnum = InvoiceCaseStatus;
  invoicePatientResponseTypeEnum = InvoicePatientResponseType;
  paymentStatusEnum = PaymentStatus;
  pageSize= 10;

  filterInvoiceDto = new FilterInvoice();
  selectedDateRange: any;
  daterange: {};
  showAssignDateField = true;
  encounterClaimDto = new EncounterClaim();

  ExcelData: any[];
  private subs = new SubSink();
  isLoading = false;
  displayFQHCProp = false;
  reportGeneratedTime = new Date();
  rows = new Array<CCMBillDto>();
  temp = new Array<CCMBillDto>();
  PrintData = new Array<CCMBillDto>();
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
  facility = new FacilityDto();
  cptCargesList: AddEditCptChargesDto[];
  public options: any = {
    locale: {
      format: "MM-DD-YYYY",
      cancelLabel: "Clear",
      // displayFormat: 'DD-MM-YYYY'
    },
    alwaysShowCalendars: false,
  };

  @ViewChild(DatatableComponent) table: DatatableComponent;
  isUpdatingEncounterClaim: boolean;
  invoiceNumber: number;

  constructor(
    private sanatizer: DomSanitizer,
    private billingService: BillingService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private filterDataService: DataFilterService,
    private toaster: ToastService,
    private securityService: SecurityService,
    private facilityService: FacilityService
  ) {}

  ngAfterViewInit() {
    this.cellOverflowVisible();
    const rightRowCells = document.getElementsByClassName(
      "datatable-row-right"
    );
    rightRowCells[0].setAttribute(
      "style",
      "transform: translate3d(-17px, 0px, 0px)"
    );
  }

  private cellOverflowVisible() {
    const cells = document.getElementsByClassName(
      "datatable-body-cell overflow-visible"
    );
    for (let i = 0, len = cells.length; i < len; i++) {
      cells[i].setAttribute("style", "overflow: visible !important");
    }
  }

  ngOnInit() {
    const invNum = +this.route.snapshot.queryParams.invoiceNumber;
    if (invNum) {
      this.invoiceNumber = invNum;
    }
    this.invoiceId = +this.route.snapshot.paramMap.get("id");
    this.checkUserType();
    this.getFacilityList();
    this.setPage();
    this.FQHCCheck();
    this.getDefaultCPTCharges();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  FQHCCheck() {
    const facilityType =
      this.securityService.getClaim("FacilityType")?.claimValue;
    if (
      facilityType === "Traditional" &&
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.displayFQHCProp = false;
    } else {
      this.displayFQHCProp = true;
    }
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
  getFacilityDetails(id) {
    this.facilityService.getFacilityDetail(id).subscribe(
      (res: any) => {
        this.facility = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error, err.message);
      }
    );
  }
  filterBills() {
    if (this.facilityId) {
      this.setPage();
    } else {
      this.checkUserType();
    }
  }
  checkUserType() {
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.organizationId =
        +this.securityService.getClaim("OrganizationId").claimValue;
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    } else {
      this.organizationId = 0;
      this.facilityId = 0;
    }
  }
  setPage() {
    // this.pagingData.pageNumber = pageInfo.offset;
    this.isLoading = true;
    // this.filterInvoiceDto.invoiceId = this.invoiceId;
    this.subs.sink = this.billingService
      .GetEncounterClaimsByInvoiceId(this.invoiceId, this.filterInvoiceDto)
      .subscribe(
        (res: any) => {
          this.rows = res;
          this.temp = res;
          console.log(this.rows);
          if (this.rows.length > 0) {
            this.facilityName = this.rows[0].facilityName;
            const facilityId = this.rows[0].facilityId;
            if (facilityId) {
              this.getFacilityDetails(facilityId);
            }
          }
          this.PrintData = res;
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
  // filterPdfData() {
  //   // this.isLoading = true;
  //   this.reportGeneratedTime = new Date();
  //   this.subs.sink = this.billingService
  //     .GetEncounterClaimsByInvoiceId(3)
  //     .subscribe(
  //       (res: any) => {
  //         this.PrintData = res.billsList;
  //         console.log(this.PrintData)
  //         // this.isLoading = false;
  //       },
  //       (err: HttpResError) => {
  //         // this.isLoading = false;
  //         this.toaster.error(err.error, err.message);
  //       }
  //     );
  // }

  checkIfNull(data: any): string {
    if (data) {
      return data.toString();
    } else if(data == 0){
      return "0"
    } 
    else {
      return "";
    }
  }
  getIcd10Codes(data: Array<ChronicIcd10CodeDto>): string {
    if (data.length > 0) {
      let str = "";
      data.forEach((item) => {
        if (item.icdCode) {
          str += item.icdCode + " , ";
        }
      });
      return str;
    } else {
      return "";
    }
  }
  getDefaultCPTCharges() {
    this.isLoading = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    this.subs.sink = this.billingService.getDefaultCPTCharges().subscribe(
      (res: any) => {
        this.isLoading = false;
        this.cptCargesList = new Array<AddEditCptChargesDto>();
        if (res && res.length >= 0) {
          this.cptCargesList = res;
          console.log(this.cptCargesList);
        }
      },
      (error: HttpResError) => {
        this.toaster.error(error.error);
        this.isLoading = false;
        // this.closeModal.emit();
      }
    );
  }
  clearDate() {
    this.daterange = {};
    this.selectedDateRange = [];
    this.filterInvoiceDto.serviceStartDate = "";
    this.filterInvoiceDto.serviceEndDate = "";
    // this.picker.datePicker.setStartDate();
    // this.picker.datePicker.setEndDate();
  }
  selectedDate(value: any, datepicker?: any) {
    // datepicker.start = value.start;
    // datepicker.end = value.end;
    this.filterInvoiceDto.serviceStartDate = value.start.format("YYYY-MM-DD");
    this.filterInvoiceDto.serviceEndDate = value.end.format("YYYY-MM-DD");
    // this.daterange.label = value.label;
  }
  clearDatePickerSelection() {
    this.showAssignDateField = false;
    setTimeout(() => {
      this.showAssignDateField = true;
    }, 300);
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.temp.filter(function (d) {
      return (
        d.patientName.toLowerCase().indexOf(val) !== -1 ||
        d.patientEmrId.toLowerCase().indexOf(val) !== -1 ||
        d.cptCode.toLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    console.log(temp);
    this.rows = temp;
    this.table.offset = 0;
  }
  resetFilters() {
    this.filterInvoiceDto = new FilterInvoice();
    this.clearDate();
    this.clearDatePickerSelection();
    this.setPage();
  }
  clearEncounterClaimValues() {
    this.encounterClaimDto = new EncounterClaim();
  }
  updateEncounterClaim() {
    this.isUpdatingEncounterClaim = true;
    this.encounterClaimDto.secondaryInsurancePayment = this.encounterClaimDto.secondaryInsurancePayment || 0;
    this.encounterClaimDto.primaryInsurancePayment = this.encounterClaimDto.primaryInsurancePayment || 0;
    this.encounterClaimDto.patientPayment = this.encounterClaimDto.patientPayment || 0;
    this.encounterClaimDto.totalPayment = this.encounterClaimDto.primaryInsurancePayment + this.encounterClaimDto.secondaryInsurancePayment + this.encounterClaimDto.patientPayment;
    this.billingService.UpdateEncounterClaim(this.encounterClaimDto).subscribe(
      (res: any) => {
        this.toaster.success("Encounter Claim Updated");
        this.isUpdatingEncounterClaim = false;
        this.encounterClaimsModal.hide();
        this.setPage();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
        this.isUpdatingEncounterClaim = false;
      }
    );
  }
  assignEncounterClaimValues(encounterClaim) {
    Object.assign(this.encounterClaimDto, encounterClaim);
    this.encounterClaimsModal.show();
  }
  filterCptCode(currentValue) {
    if (!currentValue) {
      this.filterInvoiceDto.cptCode = [""];
    }
    if (currentValue === "") {
      this.filterInvoiceDto.cptCode = [""];
    }
    if (
      !this.filterInvoiceDto.cptCode ||
      !this.filterInvoiceDto.cptCode.length
    ) {
      this.filterInvoiceDto.cptCode = [""];
    }
    if (this.filterInvoiceDto.cptCode.length > 1) {
      this.filterInvoiceDto.cptCode = this.filterInvoiceDto.cptCode.filter(
        (x) => x !== ""
      );
    }
  }
  fillCptCodeFilterValue() {
    if (
      !this.filterInvoiceDto.cptCode ||
      !this.filterInvoiceDto.cptCode.length
    ) {
      this.filterInvoiceDto.cptCode = [""];
    }
  }
  filterPayment(currentValue) {
    if (currentValue == null) {
      this.filterInvoiceDto.paymentMode = [-1];
    }
    if (currentValue === -1) {
      this.filterInvoiceDto.paymentMode = [-1];
    }
    if (
      !this.filterInvoiceDto.paymentMode ||
      !this.filterInvoiceDto.paymentMode.length
    ) {
      this.filterInvoiceDto.paymentMode = [-1];
    }
    if (this.filterInvoiceDto.paymentMode.length) {
      this.filterInvoiceDto.paymentMode =
        this.filterInvoiceDto.paymentMode.filter((x) => x !== -1);
    }
  }
  fillPaymentFilterValue() {
    if (
      !this.filterInvoiceDto.paymentMode ||
      !this.filterInvoiceDto.paymentMode.length
    ) {
      this.filterInvoiceDto.paymentMode = [-1];
    }
  }
  MakeExcel() {
    this.ExcelData = [];
      this.ExcelData = new Array<{
        'Name': string;
        'Patient EMR Id': string;
        'Cpt Code': string;
        'Service Date': string;
        'Case Status': string;
        'Primary Insurance Payment': string;
        'Secondary Insurance Payment': string;
        'Patient Payment': string;
        'Total Payment': string;
        'Patient Response Type': string;
        'Payment Status': string;
        'Comments': string;
      }>();

    this.CreateExcelData(this.rows);
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: 'SheetJS Tutorial',
      Subject: 'Test',
      Author: 'Talha Ikram',
      CreatedDate: new Date(),
      Company: 'Premier Solutions',
    };
    let sheetName = 'Invoice Reconciliation';
    // if (facility.facilityName) {
    //   sheetName = facility.facilityName.toString();
    //   if (sheetName.length > 29) {
    //     sheetName = sheetName.substring(0, 26) + '...';
    //   }
    // }
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
      'Invoice Reconciliation ' + FileName + '.xlsx'
    );
  }
  CreateExcelData(eData: CCMBillDto[]) {

    eData.forEach((item: CCMBillDto) => {
      if (item.dateOfBirth) {
        item.dateOfBirth = moment(item.dateOfBirth).format('DD-MMM-YYYY')
      }
      if (item.serviceDate) {
        item.serviceDate = moment(item.serviceDate).format('DD-MMM-YYYY')
      }
      if (item.caseStatus >=0) {
        item.caseStatusStr = this.InvoiceCaseStatusEnum[item.caseStatus];
      }
      if (item.patientResponseType >=0) {
        item.patientResponseTypeStr = this.invoicePatientResponseTypeEnum[item.patientResponseType];
      }
      if (item.paymentStatus >=0) {
        item.paymentStatusStr = this.paymentStatusEnum[item.paymentStatus];
      }

        this.ExcelData.push({
          'Name': this.checkIfNull(item.patientName),
          'Patient EMR Id': this.checkIfNull(item.patientEmrId),
          'Cpt Code': this.checkIfNull(item.cptCode),
          'Service Date': this.checkIfNull(item.serviceDate),
          'Case Status': this.checkIfNull(item.caseStatusStr),
          'Primary Insurance Payment': '$' + this.checkIfNull(item.primaryInsurancePayment),
          'Secondary Insurance Payment': '$' + this.checkIfNull(item.secondaryInsurancePayment),

          'Patient Payment': '$' + this.checkIfNull(item.patientPayment),
          'Total Payment': '$' + this.checkIfNull(item.totalPayment),
          'Patient Response Type': this.checkIfNull(item.patientResponseTypeStr),
          'Payment Status': this.checkIfNull(item.paymentStatusStr),
          'Comments': this.checkIfNull(item.comments),
        });
    });
  }
  sortCallback(sortInfo) {
    console.log(sortInfo)
  }
}
