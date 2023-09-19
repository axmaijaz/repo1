import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentViewerRoutingModule } from './document-viewer-routing.module';
import { PdfViewComponent } from './pdf-view/pdf-view.component';
import { PublicSharedModule } from '../public-shared/public-shared.module';


@NgModule({
  declarations: [PdfViewComponent],
  imports: [
    CommonModule,
    PublicSharedModule,
    DocumentViewerRoutingModule
  ],
  exports: [
    PdfViewComponent
  ]
})
export class DocumentViewerModule { }
