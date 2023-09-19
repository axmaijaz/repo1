import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdbSharedModule } from 'src/app/mdb-shared/mdb-shared.module';
import { LazyConsentModalComponent } from './lazy-consent-modal.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
  declarations: [LazyConsentModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    DpDatePickerModule,
    MdbSharedModule,
    EditorModule
  ],
  entryComponents: [LazyConsentModalComponent]
})
export class LazyConsentModalModule {
  static entry = LazyConsentModalComponent;
}
