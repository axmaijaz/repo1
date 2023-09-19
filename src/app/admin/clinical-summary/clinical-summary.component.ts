import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: 'app-clinical-summary',
  templateUrl: './clinical-summary.component.html',
  styleUrls: ['./clinical-summary.component.scss']
})
export class ClinicalSummaryComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  PatientId: number;
  SummaryText = '';
  isLoading: boolean;
  constructor(
    private patientService: PatientsService, private route: ActivatedRoute, private toaster: ToastService) { }

  ngOnInit() {
    this.getClinicalSummary();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  getClinicalSummary() {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
      if (!this.PatientId) {
        this.PatientId = +this.route.pathFromRoot[2].children[0].snapshot.paramMap.get('id');
      }
    if (this.PatientId) {
      this.isLoading = true;
      this.subs.sink = this.patientService.getClinicalSummary(this.PatientId).subscribe((res: any) => {
        this.SummaryText = res;
        this.isLoading = false;
      }, error => {
        this.toaster.error(error.message, error.error || error.error);
      });
    }
  }
  addSummary() {
    if (this.PatientId) {
      this.isLoading = true;
      this.subs.sink = this.patientService.addUpdateClinicalSummary(this.SummaryText, this.PatientId).subscribe((res: any) => {
        this.isLoading = false;
        this.toaster.success('Clinical Summary Update Successfully');
      }, error => {
        this.isLoading = false;
        this.toaster.error(error.message, error.error || error.error);
      });
    }
  }

}
