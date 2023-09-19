import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { FacilityDto } from 'src/app/model/Facility/facility.model';

@Component({
  selector: 'app-single-facility-conf-layout',
  templateUrl: './single-facility-conf-layout.component.html',
  styleUrls: ['./single-facility-conf-layout.component.scss']
})
export class SingleFacilityConfLayoutComponent implements OnInit {
  facilityId: number;
  orgId: number;
  facilityDto: FacilityDto;

  constructor(private toaster: ToastService, private location: Location, private facilityService: FacilityService) { }

  ngOnInit(): void {
    // this.facilityId = +this.route.snapshot.paramMap.get("facilityId");
    const pathname = location.pathname;
    pathname.split('/').forEach(x => {
      const pId = +x;
      let isForFacility = false;
      // In URL first parameter should be facility ID
      if (pId && !this.facilityId) {
        this.facilityId = pId;
        isForFacility = true;
      }
      // In URL first parameter should be Organization ID
      if (pId && !this.orgId && !isForFacility) {
        this.orgId = pId;
      }
    });
    if (!this.orgId) {
      this.getFacilityById();
    }
  }
  getFacilityById() {
    this.facilityService
      .getFacilityDetail(this.facilityId)
      .subscribe(
        (res: FacilityDto) => {
          this.facilityDto = res;
          this.orgId = this.facilityDto.organizationId;
          this.facilityService.isFacilitySubVendor = this.facilityDto.isSubVendor;
        },
        (error: HttpResError) => {
          this.toaster.error(error.error);
        }
      );
  }
  navigateBack() {
    this.location.back();
  }
}
