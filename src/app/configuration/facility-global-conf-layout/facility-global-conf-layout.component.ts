import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facility-global-conf-layout',
  templateUrl: './facility-global-conf-layout.component.html',
  styleUrls: ['./facility-global-conf-layout.component.scss']
})
export class FacilityGlobalConfLayoutComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit(): void {
  }
  navigateBack() {
    this.location.back();
  }
}
