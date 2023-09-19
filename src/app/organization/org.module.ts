import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationsComponent } from './organizations/organizations.component';
import { FacilityComponent } from './facility/facility.component';
import { FacilitUsersComponent } from './facility-users/facility-users.component';

import { OrgRoutingModule } from './org-routing.module';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { SharedDirectivesModule } from '../shared/shared-directives/shared-directives.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { ServiceProjectionComponent } from './service-projection/service-projection.component';
import { BrandingComponent } from './branding/branding.component';
// import { InvoicePreviewComponent } from '../accounts/invoice-preview/invoice-preview.component';
import { FileDragNDropDirective } from './file-drag-n-drop.directive';

export let options: Partial<IConfig> | (() => Partial<IConfig>) = {};
@NgModule({
  declarations: [OrganizationsComponent, FacilityComponent, FacilitUsersComponent, ServiceProjectionComponent, BrandingComponent,FileDragNDropDirective],
  imports: [
    CommonModule,
    NgxMaskModule.forRoot(options),
    OrgRoutingModule,
    // SharedModule
    MdbSharedModule,
    NgSelectModule,
    FormsModule,
    NgxDatatableModule,
    SharedDirectivesModule,
    DpDatePickerModule
  ]
})
export class OrgModule { }
