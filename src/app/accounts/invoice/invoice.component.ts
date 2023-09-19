import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { BillingService } from 'src/app/core/billing.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { PagingData } from 'src/app/model/AppModels/app.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { SubSink } from 'src/app/SubSink';
import { OrganizationDto, FacilityDto, FacilityType } from 'src/app/model/Facility/facility.model';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { InvoiceForListDto } from 'src/app/model/Accounts/accounts.model';
import { environment } from 'src/environments/environment';
import { CCMBillDto } from 'src/app/model/bills.model';
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import moment, { Moment } from 'moment';
import { DatePipe } from '@angular/common';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit, OnDestroy {
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: true,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM",
  };
  facilityList = new Array<FacilityDto>();
  selectedDate = moment().format("YYYY-MM");
  organizationList = new Array<OrganizationDto>();
  private subs = new SubSink();
  isLoading = false;
  LoadingData = false;
  currentUser: AppUserAuth = null;
  pagingData = new PagingData();
  rows: InvoiceForListDto[];
  facilityId= [];
  IsLoadingORG: boolean;
  IsLoadingFC: boolean;
  OrganizationId= 0;
  selectedInvoiceId: any;
  paymentLink = '';
  selectedRow: any;
  updatingQBPaymentStatus: boolean;
  generatingInvoice: boolean;
  ExcelData: any[];
  test: any;
  userTypeEnum = UserType;
  showInvoiceFieldsForSubVendor = true;
  monthList= new Array<Moment>();
  startDate = moment().subtract(12, 'months').format('MMM yyyy');
  endDate = moment().subtract(1, 'months').format('MMM yyyy');
  constructor(private billingService: BillingService, private router: Router, private toaster: ToastService,private datePipe: DatePipe,
     public securityService: SecurityService, private facilityService: FacilityService) { }

  ngOnInit() {
    if(this.securityService.getClaim("isSubVendorFacility")?.claimValue){
      if(this.securityService.getClaim("isSubVendor")?.claimValue){
        const tet = this.securityService.getClaim("isSubVendor").claimValue;
      }else{
      this.showInvoiceFieldsForSubVendor = false;
      }
    }
    if (this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.facilityId.push(+this.securityService.getClaim("FacilityId").claimValue)
    } else {
      this.facilityId = [''];
    }
    // this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.getInvoicesList();
    if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      this.getOrganizations();
    }
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  updateFilter(event){
    if(!event.length){
      this.billingService.presSelectedFacilities = [];
    }
    console.log(event)
    if(this.facilityId.includes('')){
      this.facilityId = this.facilityId.filter(facility => facility != '')
    }
    this.getInvoicesList()
  }
  checkFilter(currentValue){
    if(currentValue == ''){
      this.facilityId = [''];
    }
    this.getInvoicesList()
  }
  getInvoicesList() {
    if (!this.facilityId) {
      this.facilityId = [''];
      // return;
    }
    // this.pagingData.pageNumber = pageInfo.offset;
    this.isLoading = true;
    this.subs.sink = this.billingService.getInvoicesList(this.facilityId, this.OrganizationId, this.startDate,this.endDate)
    .subscribe((res: any) => {
      this.rows = res;
      this.pagingData.elementsCount = res.length;
      // this.pagingData = res.pagingData;
      // this.pagingData.pageSize = 10;
      // this.pagingData.pageNumber = res.pagingData.pageNumber - 1;
      this.isLoading = false;
    }, (err: HttpResError) => {
      this.isLoading = false;
      this.toaster.error(err.error, err.message);
    });
  }
  viewInvoiceDetail(id: number) {
    this.router.navigateByUrl(`/accounts/InvoiceDetail/${id}`);
  }
  viewInvoiceReconciliation(id: number, invoiceNumber) {
    this.router.navigate([`/accounts/invoiceReconciliation/${id}`], {
      queryParams:{invoiceNumber: invoiceNumber}
    })
    // this.router.navigateByUrl(`/accounts/invoiceReconciliation/${id}`);
  }
  PreviewInvoiceDetail(invoice: InvoiceForListDto) {
    // this.router.navigateByUrl(`/accounts/invoicePreview?invoiceId=${invoice.id}?facilityId=${invoice.facilityId}`);
    this.router.navigate(['/accounts/invoicePreview'], {queryParams: {'invoiceId': invoice.id, 'facilityId': invoice.facilityId, 'startDate': this.startDate, 'endDate': this.endDate}})
  }
  DownLoadPdf() {
    this.isLoading = true;
    this.subs.sink = this.billingService.GetDemoPdf()
    .subscribe((res: any) => {
      this.isLoading = false;
      const newWindow = window.open('', '_blank');
      const blob = new Blob([res], {
        type: 'application/zip'
      });
      const url = window.URL.createObjectURL(res);
      newWindow.location.href = url;
    }, (err: any) => {
      this.isLoading = false;
      this.toaster.error(err.error, err.message);
    });
  }
  getOrganizations() {
    this.IsLoadingORG = true;
    this.facilityService.getorganizationList().subscribe(
      (res: any) => {
        this.IsLoadingORG = false;
        this.organizationList = res;
        if(this.billingService.presSelectedOrganization){
          this.OrganizationId = this.billingService.presSelectedOrganization;
          this.getFacilitiesbyOrgId()
        }
      },
      (error: HttpResError) => {
        this.IsLoadingORG = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  // GenerateInvoice() {
  //   this.generatingInvoice = true;
  //   this.facilityService.GenerateInvoiceByFacilityId(this.facilityId).subscribe(
  //     (res: any) => {
  //       this.generatingInvoice = false;
  //       this.toaster.success('Invoice generated successfully');
  //     },
  //     (error: HttpResError) => {
  //       this.generatingInvoice = false;
  //       this.toaster.error(error.error, error.message);
  //     }
  //   );
  // }
  UpdateInvoicesPaymentStatus() {
    this.updatingQBPaymentStatus = true;
    this.billingService.UpdateInvoicesPaymentStatus(this.facilityId[0]).subscribe(
      (res: any) => {
        this.updatingQBPaymentStatus = false;
        this.toaster.success('Data synced successfully');
        this.getInvoicesList();
        // this.organizationList = res;
      },
      (error: HttpResError) => {
        this.updatingQBPaymentStatus = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SyncQbData() {

  }
  getFacilitiesbyOrgId() {
    if (this.OrganizationId == 0) {
      this.getInvoicesList();
      return
    }
    this.IsLoadingFC = true;
    this.facilityService.getFacilityByOrgId(this.OrganizationId, true).subscribe(
      (res: any) => {
        this.IsLoadingFC = false;
        if (res) {
          this.facilityList = res;
          if(this.facilityList.length == 1){
            this.facilityId = [this.facilityList[0].id];
            this.checkFilter(this.facilityId)
          }
          if(this.billingService.presSelectedFacilities && this.OrganizationId == this.billingService.presSelectedOrganization){
            this.facilityId = this.billingService.presSelectedFacilities;
            this.checkFilter(this.facilityId)
          }
        }
      },
      err => {
        this.toaster.error(err.message, err.error || err.error);
        this.IsLoadingFC = false;
      }
    );
  }
  seletedInvoice(row: any) {
    this.selectedRow = row;
    this.selectedInvoiceId = row.id;
    if (row.payInvoiceLink) {
      this.paymentLink = row.payInvoiceLink;
    }
  }
  addInvoicePaymentLink() {
    let data = {
      invoiceId: this.selectedInvoiceId,
      payInvoiceLink: this.paymentLink,
    }
    this.selectedRow.isLoading = true;
    this.billingService.AddInvoicePaymentLink(data).subscribe(
      (res: any) => {
        this.selectedRow.isLoading = false;
      this.paymentLink = '';
      this.getInvoicesList();
      },
      (error: HttpResError) => {
        this.selectedRow.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  viewLink(row: any) {
    window.open(row.payInvoiceLink , '_blank');
  }
  MakePDF(invoice: InvoiceForListDto) {
    invoice.loading = true;
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const tab = window.open(nUrl);
    this.billingService.GetEncounterClaimsPDFByInvoiceId(invoice.id).subscribe(res => {
      invoice.loading = false;
      const file = new Blob([res], { type: "application/pdf" });
      const fileURL = window.URL.createObjectURL(file);
      // this.printFile = this.sanatizer.bypassSecurityTrustResourceUrl(
      //   fileURL
      // );
      // window.open(this.printFile);
      tab.location.href = fileURL;
      },
      (err: HttpResError) => {
        invoice.loading = false;
        this.toaster.error(err.error, err.message);
    });
  }
  GetEncounterClaimsByInvoiceId(invoice: InvoiceForListDto) {
    invoice.loading = true;
    this.subs.sink = this.billingService
      .GetEncounterClaimsByInvoiceId(invoice.id)
      .subscribe(
        (res: CCMBillDto[]) => {
          const encounterClaimsData = res;
          if (encounterClaimsData.length > 0) {
            const facilityId = encounterClaimsData[0].facilityId;
            this.getFacilityDetails(facilityId, encounterClaimsData);
            setTimeout(() => {
              invoice.loading = false;
            }, 3000);
          } else {
            this.toaster.warning('Encounter claims are empty');
            invoice.loading = false;
          }
          // this.filterPdfData();
        },
        (err: HttpResError) => {
           invoice.loading = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  getFacilityDetails(fId: number, eData: CCMBillDto[]){
    this.facilityService.getFacilityDetail(fId).subscribe((res: any) => {
      this.MakeExcel(res, eData)
    },(err: HttpResError) => {
      this.toaster.error(err.error);
    })

  }
  MakeExcel(facility: FacilityDto, eData: CCMBillDto[]) {
    this.ExcelData = [];
    if(facility.facilityType == FacilityType.FQHC){
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
    this.CreateExcelData(facility, eData);
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
    if (facility.facilityName) {
      sheetName = facility.facilityName.toString();
      if (sheetName.length > 29) {
        sheetName = sheetName.substring(0, 26) + '...';
      }
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
  CreateExcelData(facility: FacilityDto, eData: CCMBillDto[]) {

    eData.forEach((item: CCMBillDto) => {
      if (item.dateOfBirth) {
        item.dateOfBirth = moment(item.dateOfBirth).format('DD-MMM-YYYY')
      }
      if (item.serviceDate) {
        item.serviceDate = moment(item.serviceDate).format('DD-MMM-YYYY')
      }
      if (item.consentDate) {
        item.consentDate = moment(item.consentDate, 'YYYY-M-DThh:mm:ss').format('DD-MMM-YYYY')
      }
      if(facility.facilityType == FacilityType.FQHC){
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
    });
  }
  checkIfNull(data: any): string {
    if (data) {
      return data.toString();
    } else {
      return '';
    }
  }
  filterByMonth(date: Moment) {
    setTimeout(() => {
      console.log(this.test)
    }, 1000);
    if(this.monthList?.length){
       const matched= this.monthList.filter((month: Moment) => moment(month).format('yyyy-mm-dd') === moment(date).format('yyyy-mm-dd'));
       if(matched.length){
        this.monthList = this.monthList.filter((month: Moment) => month != date);
        return
       }else{
         this.monthList.push(date);
         return;
        }
    }else{
      this.monthList.push(date);
    }
    console.log(this.monthList);
  }
  selectMonthRange(type){
    if(type== 'previous'){
      this.startDate = moment(this.startDate).subtract(12, 'months').format('MMM yyyy');
      this.endDate = moment(this.endDate).subtract(12, 'months').format('MMM yyyy');
      this.getInvoicesList();
    }
    if(type == 'next'){
      this.startDate = moment(this.startDate).add(12, 'months').format('MMM yyyy');
      this.endDate = moment(this.endDate).add(12, 'months').format('MMM yyyy');
      this.getInvoicesList()
    }
  }

  previewInvoiceByFacilityId(){
    this.billingService.presSelectedOrganization = this.OrganizationId;
    this.billingService.presSelectedFacilities = this.facilityId;
    this.router.navigate(['/accounts/invoicePreview'], {queryParams: {facilityId: this.facilityId, startDate: this.startDate, endDate: this.endDate}});
  }
}
