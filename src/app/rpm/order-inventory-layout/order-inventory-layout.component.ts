import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ng-uikit-pro-standard';
import { SmartMeterService } from 'src/app/core/smart-meter.service';

@Component({
  selector: 'app-order-inventory-layout',
  templateUrl: './order-inventory-layout.component.html',
  styleUrls: ['./order-inventory-layout.component.scss']
})
export class OrderInventoryLayoutComponent implements OnInit , AfterViewInit{
  @ViewChild("orderTabs") orderTabs: TabsetComponent;
  selectedTab = 0;
  deviceRequestId: number;
  constructor(private smartMeterService: SmartMeterService, private route:ActivatedRoute ) { }

  ngOnInit(): void {
    this.deviceRequestId =  +this.route.snapshot.queryParamMap.get('requestId');
  }
  ngAfterViewInit(){
    this.selectedTab =  +this.route.snapshot.queryParamMap.get('tab');
    this.orderTabs.setActiveTab(this.selectedTab);
  }
}
