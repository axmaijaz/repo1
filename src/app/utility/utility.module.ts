import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwoCTextAreaComponent } from './two-c-text-area/two-c-text-area.component';
import { IntellisenseWidgetComponent } from '../intellisense-widget/intellisense-widget.component';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [TwoCTextAreaComponent, IntellisenseWidgetComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    TwoCTextAreaComponent,
    IntellisenseWidgetComponent
  ]
})
export class UtilityModule { }
