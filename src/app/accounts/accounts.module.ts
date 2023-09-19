import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountsRoutingModule } from './accounts-routing.module';
import { InvoiceComponent } from './invoice/invoice.component';
import { CcmBillingComponent } from '../admin/ccm-billing/ccm-billing.component';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { InvoicesDashboardComponent } from './invoices-dashboard/invoices-dashboard.component';
import { DatepickerModule } from 'ng-uikit-pro-standard';
import { SharedModule } from '../shared/shared.module';
import { DpDatePickerModule } from 'ng2-date-picker';
// import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';

@NgModule({
  declarations: [
    CcmBillingComponent, InvoiceComponent, InvoicesDashboardComponent],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    MdbSharedModule,
    SharedPipesModule,
    NgxDatatableModule,
    SharedDirectivesModule,
    NgSelectModule,
    FormsModule,
    DatepickerModule,
    DpDatePickerModule
  ]
})
export class AccountsModule { }
