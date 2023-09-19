import { Component, OnInit, OnDestroy } from '@angular/core';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: "app-emergency-plan",
  templateUrl: "./emergency-plan.component.html",
  styleUrls: ["./emergency-plan.component.scss"]
})
export class EmergencyPlanComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  PatientId: number;
  EmergencyPLanText = "";
  isLoading: boolean;
  constructor(
    private patientService: PatientsService,
    private route: ActivatedRoute,
    private toaster: ToastService
  ) {}

  ngOnInit() {
    this.getEmergencyPlan();
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  getEmergencyPlan() {
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    if (!this.PatientId) {
      this.PatientId = +this.route.pathFromRoot[2].children[0].snapshot.paramMap.get(
        "id"
      );
    }
    if (this.PatientId) {
      this.isLoading = true;
     this.subs.sink = this.patientService.getEmergencyPlan(this.PatientId).subscribe(
        (res: any) => {
          this.EmergencyPLanText = res;
          this.isLoading = false;
        },
        err => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
    }
  }
  addEmergencyPlan() {
    if (this.PatientId) {
      this.isLoading = true;
      this.subs.sink = this.patientService
        .addUpdateEmergencyPlan(this.EmergencyPLanText, this.PatientId)
        .subscribe(
          (res: any) => {
            this.isLoading = false;
            this.toaster.success("Emergency Plan text Update Successfully");
          },
          err => {
            this.isLoading = false;
            this.toaster.error(err.message, err.error || err.error);
          }
        );
    }
  }
}
