import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TwoCHeaderFooterComponent } from './two-cheader-footer/two-cheader-footer.component';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';
import { PatientTelephonyChatComponent } from './patient-telephony-chat/patient-telephony-chat.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TwoCHeaderFooterComponent, PageNotFoundComponent, PatientTelephonyChatComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    TwoCHeaderFooterComponent, PageNotFoundComponent, PatientTelephonyChatComponent
  ]
})
export class PublicSharedModule { }
