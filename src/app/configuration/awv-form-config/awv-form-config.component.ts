import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { FacilityFormsDto } from 'src/app/model/Facility/facility.model';

@Component({
  selector: 'app-awv-form-config',
  templateUrl: './awv-form-config.component.html',
  styleUrls: ['./awv-form-config.component.scss']
})
export class AwvFormConfigComponent implements OnInit {
  facilityId: number;
  
  facilityFormsDto = new FacilityFormsDto();

  constructor(private facilityService: FacilityService,
    private route: ActivatedRoute,
    private securityService: SecurityService,
    private toaster: ToastService,) { }

  ngOnInit(): void {
    this.facilityId = +this.route.snapshot.paramMap.get("facilityId");
    this.GetFacilityForms(this.facilityId)
  }
  GetFacilityForms(id: number) {
    this.facilityFormsDto = new FacilityFormsDto();
    this.facilityService.GetFacilityForms(id).subscribe(
      (res: FacilityFormsDto) => {
        this.facilityFormsDto = res;
      },
      (error: HttpResError) => {
        // this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AddFacilityForms() {
    this.facilityService
      .AddFacilityForms(this.facilityId, this.facilityFormsDto)
      .subscribe(
        (res: any) => {
          // this.emrList = res;
          this.toaster.success('Data saved successfully');
        },
        (error: HttpResError) => {
          // this.IsLoading = true;
          this.toaster.error(error.error, error.message);
        }
      );
  }
}
