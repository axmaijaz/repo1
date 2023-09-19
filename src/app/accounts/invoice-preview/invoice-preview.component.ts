import { AppDataService } from 'src/app/core/app-data.service';
import { InvoiceForListDto } from './../../model/Accounts/accounts.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { AppUiService } from 'src/app/core/app-ui.service';
import { BillingService } from 'src/app/core/billing.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { EncounterClaimsdto, InvoicePreviewDto, InvoicePreviewFilteredDto } from 'src/app/model/Accounts/invoice.model';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { CCMBillDto, EncounterClaimType } from 'src/app/model/bills.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { SubSink } from 'src/app/SubSink';
import { Location } from '@angular/common';
import { GetInvoiceDetailByDevice, GetInvoiceDetailByDeviceDto } from 'src/app/model/Accounts/billing.model';
import { InvoiceCategoryByDevice } from 'src/app/Enums/billing.enum';
import moment from 'moment';

@Component({
  selector: 'app-invoice-preview',
  templateUrl: './invoice-preview.component.html',
  styleUrls: ['./invoice-preview.component.scss']
})
export class InvoicePreviewComponent implements OnInit, OnDestroy {
  @ViewChild("invoiceDetailsByDevice") invoiceDetailsByDevice: ModalDirective;
  invoicePreviewData = new InvoicePreviewDto();
  invoiceDetailByDeviceDto = new GetInvoiceDetailByDeviceDto();
  invoiceDetailsList = new Array<GetInvoiceDetailByDevice>();
  invoiceCategoryByDeviceEnum = InvoiceCategoryByDevice;
  facilityId: number;
  isLoadingPreview: boolean;
  private subs = new SubSink();
  EncounterClaimTypeEnum = EncounterClaimType;
  displayInvoiceObj: InvoicePreviewFilteredDto[] = [];
  generatingInvoice: boolean;
  displayInvoiceObj1: InvoicePreviewFilteredDto[];
  isLoadinginvoicesList: boolean;
  invoicesList: InvoiceForListDto[];
  loadingInvoicesDetails: boolean;
  selectedInvoiceId: number;
  invoiceEncounterClaimsList: CCMBillDto[];
  listOfYears = [];
  monthId = new Date().getMonth() + 1;
  yearId = new Date().getFullYear();
  activeViewType = 0;
  disableGenerateInvoice = true;
  startDate= '';
  endDate = '';
  selectedInvoice= new InvoiceForListDto();
  constructor(private billingService: BillingService, private filterData: DataFilterService, private route: ActivatedRoute, private appUi: AppUiService,
    private location: Location, private appDataService: AppDataService,
    private router: Router, private toaster: ToastService, private securityService: SecurityService, private facilityService: FacilityService) { }

  ngOnInit() {
    this.listOfYears = this.appDataService.listOfYears;
    this.facilityId = +this.route.snapshot.paramMap.get('facilityId');
    this.startDate = this.route.snapshot.queryParamMap.get('startDate');
    this.endDate = this.route.snapshot.queryParamMap.get('endDate');
    this.facilityId = +this.route.snapshot.queryParamMap.get('facilityId');
    const invoiceId = +this.route.snapshot.queryParamMap.get('invoiceId');
    if (!this.facilityId) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    }
    if (!invoiceId) {
      this.PreviewInvoiceByFacilityId();
    }
    this.getInvoicesList(invoiceId);
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  GenerateInvoice() {
    this.generatingInvoice = true;
    this.billingService.GenerateInvoiceByFacilityId(this.facilityId, this.monthId, this.yearId).subscribe(
      (res: any) => {
        this.generatingInvoice = false;
        this.toaster.success('Invoice generated successfully');
      },
      (error: HttpResError) => {
        this.generatingInvoice = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

  openConfirmModal() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Generate Invoice";
    modalDto.Text = "Are you sure to generate Invoice?";
    modalDto.callBack = this.callBack;
    // modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.GenerateInvoice();
  }
  navigateBack() {
    this.location.back();
  }
  invoiceSelectionChanged() {
    if (this.selectedInvoiceId === -1) {
      this.PreviewInvoiceByFacilityId();
    } else {
      this.GetEncounterClaimsByInvoiceId();
    }
  }

  PreviewInvoiceByFacilityId() {
    if (!this.facilityId) {
      this.facilityId = 0;
      // return;
    }
    if (!this.monthId || !this.yearId) {
      return;
    }
    // this.pagingData.pageNumber = pageInfo.offset;
    this.isLoadingPreview = true;
    this.activeViewType = 1;
    this.displayInvoiceObj1 = [];
    this.displayInvoiceObj = [];
    this.disableGenerateInvoice = true;
    this.selectedInvoiceId = null;
    this.subs.sink = this.billingService.PreviewInvoiceByFacilityId(this.facilityId, this.monthId, this.yearId)
    .subscribe((res: InvoicePreviewDto) => {
      this.invoicePreviewData = res;
      this.GenerateWidgetsData();
      this.isLoadingPreview = false;
      this.disableGenerateInvoice = false;
    }, (err: HttpResError) => {
      this.isLoadingPreview = false;
      this.toaster.error(err.error || err.error, err.message);
    });
  }
  getInvoicesList(invoiceId?: number) {
    if (!this.facilityId) {
      this.facilityId = 0;
      // return;
    }
    // this.pagingData.pageNumber = pageInfo.offset;
    this.isLoadinginvoicesList = true;
    this.startDate = moment(this.startDate, 'MMM yyyy').format('YYYY-MM-DD');
    this.endDate = moment(this.endDate, 'MMM yyyy').format('YYYY-MM-DD');
    let facilityIds = [];
    if(this.facilityId){
      facilityIds = [this.facilityId]
    }
    this.subs.sink = this.billingService.getInvoicesList(facilityIds, 0, this.startDate, this.endDate)
    .subscribe((res: any) => {
      this.invoicesList = res;
      // this.pagingData.elementsCount = res.length;
      // this.pagingData = res.pagingData;
      // this.pagingData.pageSize = 10;
      // this.pagingData.pageNumber = res.pagingData.pageNumber - 1;
      const selectedInvoice = this.invoicesList.find((invoice: any)=> invoice.id === invoiceId);
      if(selectedInvoice && selectedInvoice.id){
        this.yearId = selectedInvoice.yearId;
        this.monthId = selectedInvoice.monthId;
      }
      this.isLoadinginvoicesList = false;
      if (invoiceId) {
        this.selectedInvoiceId = invoiceId;
        this.GetEncounterClaimsByInvoiceId();
      }
    }, (err: HttpResError) => {
      this.isLoadinginvoicesList = false;
      this.toaster.error(err.error || err.error, err.message);
    });
  }
  GetEncounterClaimsByInvoiceId() {
    if (!this.selectedInvoiceId) {
      return;
    }
    this.loadingInvoicesDetails = true;
    this.displayInvoiceObj1 = [];
    this.displayInvoiceObj = [];
    this.activeViewType = 2;
    this.monthId = null;
    this.subs.sink = this.billingService
      .GetEncounterClaimsByInvoiceId(this.selectedInvoiceId)
      .subscribe(
        (res: any) => {
          this.invoiceEncounterClaimsList = res;
          const selectedInvoices = this.invoicesList.find(x => x.id === this.selectedInvoiceId);
          this.invoicePreviewData.encounterClaimsDto = this.invoiceEncounterClaimsList as any;
          this.invoicePreviewData.invoiceTotal = selectedInvoices.invoiceTotal;
          this.invoicePreviewData.installmentsCount = selectedInvoices.installmentsCount;
          this.invoicePreviewData.installmentsAmount = selectedInvoices.installmentsAmount;
          this.invoicePreviewData.transmissionChargesCount = selectedInvoices.transmissionChargesCount;
          this.invoicePreviewData.transmissionCharges = selectedInvoices.transmissionCharges;
          this.invoicePreviewData.reActivatedDevicesCount = selectedInvoices.reActivatedDevicesCount;
          this.invoicePreviewData.reActivationCharges = selectedInvoices.reActivationCharges;

          this.invoicePreviewData.fixedMonthlyCharge = selectedInvoices.fixedMonthlyCharge;
          this.GenerateWidgetsData();
          this.loadingInvoicesDetails = false;
          // this.filterPdfData();
        },
        (err: HttpResError) => {
          this.loadingInvoicesDetails = false;
          this.toaster.error(err.error || err.error, err.message);
        }
      );
  }
  GenerateWidgetsData() {
    this.invoicePreviewData?.encounterClaimsDto?.forEach((element) => {
      if (!element.category) {
        element.category = 'Others';
      }
    });
    this.displayInvoiceObj = this.filterData.groupByProp(this.invoicePreviewData?.encounterClaimsDto, 'category') as InvoicePreviewFilteredDto[];
    this.displayInvoiceObj?.forEach(element => {
      let amount = 0;
      element.value.forEach(x => {
        amount = (x.facilityPaymentAmount * x.units) + amount;
      });
      element.moduleTotal = amount;
    });
    this.displayInvoiceObj1 = this.filterData.groupByProp(this.invoicePreviewData?.encounterClaimsDto, 'cptCode') as InvoicePreviewFilteredDto[];
    this.displayInvoiceObj1?.forEach(element => {
      let amount = 0;
      element.value?.forEach(x => {
        amount = (x.facilityPaymentAmount * x.units) + amount;
        element['unitPrice'] = x.facilityPaymentAmount;
      });
      element.moduleTotal = amount;
    });
    if(this.selectedInvoiceId){
      const invoice = this.invoicesList.find((invoice: InvoiceForListDto) => invoice.id == this.selectedInvoiceId)
         this.monthId = invoice.monthId;
    }
  }
  getInvoiceDetailByDevice(){
    // var slt = this.invoicesList.filter((invoice:InvoiceForListDto) => invoice.id === this.selectedInvoiceId);
    //     this.selectedInvoice = slt[0];
    this.invoiceDetailByDeviceDto.month = this.monthId;
    this.invoiceDetailByDeviceDto.year = this.yearId;
    if(this.invoiceDetailByDeviceDto.month && this.invoiceDetailByDeviceDto.year){
      if(this.facilityId == 0){
        const selectedInv = this.invoicesList.filter((inv: InvoiceForListDto) =>   inv.id == this.selectedInvoiceId);
        this.invoiceDetailByDeviceDto.facilityId = selectedInv[0].facilityId;
      }else{
        this.invoiceDetailByDeviceDto.facilityId = this.facilityId;
      }
      this.billingService.getInvoiceDetailByDevice(this.invoiceDetailByDeviceDto).subscribe((res: any)=> {
        this.invoiceDetailsList = res;
        this.invoiceDetailsByDevice.show();
      },(err:HttpResError) => {
        this.toaster.error(err.error);
      })
    }
    }
}
