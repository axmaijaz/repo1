import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExtensionManagerRoutingModule } from './extension-manager-routing.module';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { ExtClientsDetailComponent } from './ext-clients-detail/ext-clients-detail.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { LaucnchAppComponent } from './laucnch-app/laucnch-app.component';


@NgModule({
  declarations: [ExtClientsDetailComponent, LaucnchAppComponent],
  imports: [
    CommonModule,
    ExtensionManagerRoutingModule,
    MdbSharedModule,
    NgxDatatableModule,
    FormsModule,
    NgSelectModule
  ]
})
export class ExtensionManagerModule { }
