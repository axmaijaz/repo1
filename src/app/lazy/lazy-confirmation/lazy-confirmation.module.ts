import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationMOdalComponent } from './confirmation-modal/confirmation-modal.component';
import { MdbSharedModule } from 'src/app/mdb-shared/mdb-shared.module';

@NgModule({
  declarations: [ConfirmationMOdalComponent],
  imports: [
    CommonModule,
    MdbSharedModule
  ],
  entryComponents: [ConfirmationMOdalComponent]
})
export class LazyConfirmationModule {
  static entry = ConfirmationMOdalComponent;
}
