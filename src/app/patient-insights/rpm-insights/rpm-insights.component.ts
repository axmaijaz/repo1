import { ActivatedRoute } from '@angular/router';
import { RpmService } from './../../core/rpm.service';
import { Component, OnInit } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { RPMInsightsDataDto } from 'src/app/model/Insights/rpm-insights.model';

@Component({
  selector: 'app-rpm-insights',
  templateUrl: './rpm-insights.component.html',
  styleUrls: ['./rpm-insights.component.scss']
})
export class RpmInsightsComponent implements OnInit {
  gettingData: boolean;
  patientId!: number;
  insightsDataObj = new RPMInsightsDataDto();
  selectedModalityCode = 'BP';
  hasSomeData = false;

  constructor(private toaster: ToastService, private rpmService: RpmService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.patientId = +this.route.snapshot.paramMap.get('id');
    this.GetRPMDeviceReadingsbyPatientId();
  }
  GetRPMDeviceReadingsbyPatientId() {
    this.gettingData = true;
    this.rpmService.GetRPMDeviceReadingsbyPatientId(this.patientId).subscribe(
      (res: RPMInsightsDataDto) => {
        this.insightsDataObj = res || new RPMInsightsDataDto();
        if (this.insightsDataObj?.rpmDeviceBPReading || this.insightsDataObj?.rpmDeviceBGReading || this.insightsDataObj?.rpmDeviceWTReading) {
          this.hasSomeData = true;
        }
        this.gettingData = false;
      },
      (error: HttpResError) => {
        this.gettingData = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
}
