import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';
import { SecurityService } from 'src/app/core/security/security.service';
import { Disease } from 'src/app/model/admin/disease.model';
import { QuestionnaireService } from 'src/app/core/questionnaire.service';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { Language } from 'src/app/model/admin/ccm.model';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: "app-patient-consent",
  templateUrl: "./patient-consent.component.html",
  styleUrls: ["./patient-consent.component.scss"]
})
export class PatientConsentComponent implements OnInit, OnDestroy {
  private subs = new SubSink();
  PatientPreferences = {
    patientId: 0,
    bestTimeToCall: null,
    preferredLanguage: ""
  };
  languageList = new Array<Language>();
  PatientId: number;
  PatientData: PatientDto;
  currentUser = new AppUserAuth();

  cronicDiseaseList = new Array<Disease>();
  selectedCronicDiseases = new Array<number>();

  constructor(
    private patientService: PatientsService,
    private toaster: ToastService,
    private securityService: SecurityService,
    private ccmDataService: CcmDataService,
    private router: Router,
    private questionService: QuestionnaireService,
    private route: ActivatedRoute
  ) {}

  public doughnut = "doughnut";
  public pie = "pie";

  public doughnutchartDatasets: Array<any> = [
    {
      data: [10, 3],
      label: "My First dataset"
    }
  ];

  public doughnutchartLabels: Array<any> = ["Time Completed", "Time Left"];

  public doughnutchartColors: Array<any> = [
    {
      backgroundColor: ["#0158d4", "#333"],
      hoverBackgroundColor: ["#0158d4", "#333"]
    }
  ];

  public chartOptions: any = {
    responsive: true,
    legend: {
      labels: {
        // This more red font property overrides the global property
        defaultFontSize: 10,
        usePointStyle: true,
        padding: 10
      },
      position: "top"
    },
    weight: 2
  };
  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    if (!this.PatientId) {
      this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get("id");
    }
    this.getPatientDetail();
    this.PatientPreferences.patientId = this.PatientId;
    this.currentUser = this.securityService.securityObject;
    this.getCronicDiseases();
    this.subs.sink = this.ccmDataService.getLanguageList().subscribe(
      (res: any) => {
        this.languageList = res;
      },
      err => {}
    );
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  getPatientDetail() {
    if (this.PatientId) {
      this.subs.sink = this.patientService
        .getPatientDetail(this.PatientId)
        .subscribe(
          (res: any) => {
            if (res) {
              this.PatientData = res;
            }
          },
          error => {}
        );
    }
  }
  getCronicDiseases() {
    this.subs.sink = this.questionService.getCCMDiseases().subscribe(
      (res: any) => {
        this.cronicDiseaseList = res;
      },
      err => {}
    );
  }
  cronicDiseaseChanged(isChecked: boolean, disease: Disease) {
    if (isChecked) {
      this.selectedCronicDiseases.push(disease.id);
    } else {
      const alreadyExist = this.selectedCronicDiseases.find(
        x => x === disease.id
      );
      if (alreadyExist) {
        const index = this.selectedCronicDiseases.indexOf(alreadyExist);
        this.selectedCronicDiseases.splice(index, 1);
      }
    }
  }
  submitPatientData() {
    this.subs.sink = this.patientService
      .AddUpdatePatientPreference(this.PatientPreferences)
      .subscribe(
        res => {
          this.router.navigate(["/admin/patient/", this.PatientId]);
          this.toaster.success("data saved successfully");
        },
        err => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }
}
