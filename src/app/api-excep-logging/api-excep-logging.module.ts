import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiExcepLoggingRoutingModule } from './api-excep-logging-routing.module';
import { ExceptionListComponent } from './exception-list/exception-list.component';
import { MdbSharedModule } from '../mdb-shared/mdb-shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { PublicSharedModule } from '../public-shared/public-shared.module';
import { HangeFireComponent } from './hange-fire/hange-fire.component';
import { SharedPipesModule } from '../shared-pipes/shared-pipes.module';
import { FrontEndExceptionsComponent } from './front-end-exceptions/front-end-exceptions.component';


@NgModule({
  declarations: [ExceptionListComponent, HangeFireComponent, FrontEndExceptionsComponent],
  imports: [
    CommonModule,
    FormsModule,
    PublicSharedModule,
    MdbSharedModule,
    NgxDatatableModule,
    NgSelectModule,
    SharedPipesModule,
    ApiExcepLoggingRoutingModule
  ]
})
export class ApiExcepLoggingModule { }
