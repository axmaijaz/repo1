import { Component, OnInit } from '@angular/core';
import { BrandingService } from 'src/app/core/branding.service';
import { SecurityService } from 'src/app/core/security/security.service';

@Component({
  selector: 'app-patient-setting-layout',
  templateUrl: './patient-setting-layout.component.html',
  styleUrls: ['./patient-setting-layout.component.scss']
})
export class PatientSettingLayoutComponent implements OnInit {
  facilityId: number;
  PatientId: number;

  constructor(private securityService: SecurityService, public brandingService: BrandingService) { }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    // this.GetQuickViewConfigByFacilityId();
    const pathname = location.pathname;
    pathname.split('/').forEach(x => {
      const pId = +x;
      if (pId) {
        this.PatientId = pId;
      }
    });
  }

}
