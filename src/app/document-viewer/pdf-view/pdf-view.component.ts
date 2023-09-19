import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-pdf-view',
  templateUrl: './pdf-view.component.html',
  styleUrls: ['./pdf-view.component.scss']
})
export class PdfViewComponent implements OnInit {
  @Input() documentUrl = '';
  // blob:http://localhost:4200/06b130fd-d713-4168-866b-aa46b6c3c94b
  carePlanHistoryView: any;
  constructor(private sanatizer: DomSanitizer, private cdr: ChangeDetectorRef) {

   }

  ngOnInit() {
    if (this.documentUrl) {
      this.carePlanHistoryView = this.sanatizer.bypassSecurityTrustResourceUrl(this.documentUrl);
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 1000);
    }
  }

}
