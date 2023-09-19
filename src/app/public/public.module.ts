import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { LoadingViewComponent } from './loading-view/loading-view.component';
import { SuccessPageComponent } from './success-page/success-page.component';


@NgModule({
  declarations: [SuccessPageComponent, LoadingViewComponent],
  imports: [
    CommonModule,
    PublicRoutingModule
  ]
})
export class PublicModule { }
