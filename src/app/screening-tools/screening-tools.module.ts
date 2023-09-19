import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ScreeningToolsRoutingModule } from "./screening-tools-routing.module";
import { Gad7Component } from "./gad7/gad7.component";
import { Dast20Component } from "./dast20/dast20.component";
import { WsasComponent } from "./wsas/wsas.component";
import { Phq9Component } from "./phq9/phq9.component";
import { DpDatePickerModule } from "ng2-date-picker";
import { FormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { MdbSharedModule } from "../mdb-shared/mdb-shared.module";
import { AllScreeningToolsComponent } from "./all-screening-tools/all-screening-tools.component";
import { SharedPipesModule } from "../shared-pipes/shared-pipes.module";

@NgModule({
  declarations: [
    Gad7Component,
    Dast20Component,
    WsasComponent,
    Phq9Component,
    AllScreeningToolsComponent,
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    MdbSharedModule,
    FormsModule,
    DpDatePickerModule,
    ScreeningToolsRoutingModule,
    SharedPipesModule
  ],
  exports: [
    AllScreeningToolsComponent,
    Gad7Component,
    Dast20Component,
    WsasComponent,
    Phq9Component,
  ],
})
export class ScreeningToolsModule {}
