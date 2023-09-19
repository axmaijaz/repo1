import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwcCModalsComponent } from './twc-cmodals/twc-cmodals.component';
import { MdbSharedModule } from 'src/app/mdb-shared/mdb-shared.module';



@NgModule({
  declarations: [TwcCModalsComponent],
  imports: [
    CommonModule,
    MdbSharedModule
  ],
  entryComponents: [TwcCModalsComponent]
})
export class LazyAppModalsModule {
  static entry = TwcCModalsComponent;
 }
