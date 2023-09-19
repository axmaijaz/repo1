import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MedicareDataService } from 'src/app/core/medicare/medicare-data.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { BlueButtonReportDto } from 'src/app/model/Medicare/medicare.model';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: 'app-eob',
  templateUrl: './eob.component.html',
  styleUrls: ['./eob.component.scss']
})
export class EOBComponent implements OnInit {
  isLoading: boolean;
  rows = [];
  reportData = new BlueButtonReportDto();
  code: any;
  PatientId: number;
  private subs = new SubSink();
  constructor(private toaster: ToastService, private route: ActivatedRoute, private location: Location, private medicareService: MedicareDataService) { }

  ngOnInit() {
    // this.PatientId = +this.route.snapshot.paramMap.get('id');
    this.code = this.route.snapshot.queryParams['code'];
    this.PatientId = this.route.snapshot.queryParams['patientID'];
    if (!this.PatientId) {
      this.PatientId = this.route.snapshot.queryParams['state'];
    }
    // if (this.code) {
      // this.router.navigateByUrl('admin/bluebutton');
      this.getMedicareData(this.code);
    // }
  }
  navigateBack() {
    this.location.back();
  }
  getMedicareData(code: string) {
    this.isLoading = true;
    this.medicareService.getBlueButtonPatientData(code, this.PatientId).subscribe((res: BlueButtonReportDto) => {
      this.isLoading = false;
      console.table(res);
      this.reportData = res;
    }, (error: HttpResError) => {
      this.isLoading = false;
      this.toaster.error(error.error , error.message);
    });
  }
}
