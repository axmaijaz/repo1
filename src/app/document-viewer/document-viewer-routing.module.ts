import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TwoCHeaderFooterComponent } from '../public-shared/two-cheader-footer/two-cheader-footer.component';
import { PdfViewComponent } from './pdf-view/pdf-view.component';


const routes: Routes = [
  // { path: '', component:  TwoCHeaderFooterComponent,
  // children: [
  //     { path: 'pdf', component:  PdfViewComponent }
  //   ]

  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentViewerRoutingModule { }
