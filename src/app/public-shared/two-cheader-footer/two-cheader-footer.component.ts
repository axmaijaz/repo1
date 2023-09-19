import { Component, OnInit } from '@angular/core';
import { BrandingService } from 'src/app/core/branding.service';

@Component({
  selector: 'app-two-cheader-footer',
  templateUrl: './two-cheader-footer.component.html',
  styleUrls: ['./two-cheader-footer.component.scss']
})
export class TwoCHeaderFooterComponent implements OnInit {

  constructor(public brandingService: BrandingService,) { }

  ngOnInit() {
  }

}
