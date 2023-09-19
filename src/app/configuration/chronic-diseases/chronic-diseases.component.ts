import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { HttpResError } from "src/app/model/common/http-response-error";
import {
  ChronicDiseaseDto,
  ChronicIcd10CodeDto,
  DiagnosisDto,
  DiseaseOnServicesDto,
  SelectChronicDiseaseDto,
  UpdateChronicDiseaseDto,
} from "src/app/model/Patient/patient.model";
import { SubSink } from "src/app/SubSink";
let that;
@Component({
  selector: "app-chronic-diseases",
  templateUrl: "./chronic-diseases.component.html",
  styleUrls: ["./chronic-diseases.component.scss"],
})
export class ChronicDiseasesComponent implements OnInit {
  @ViewChild("AddChronicConditionModal") AddChronicConditionModal: ModalDirective;
  private subs = new SubSink();
  IsLoading: boolean;
  isLoading: boolean;
  updateChronicDiseaseDto = new UpdateChronicDiseaseDto();
  rows: any;
  facilityList: any;
  selectItem = new SelectChronicDiseaseDto();
  tempRows: any;
  chronicDiseasesList = new Array<ChronicIcd10CodeDto>();
  selectedChronicDisease = new ChronicDiseaseDto();
  addEditChronicCondition = new ChronicIcd10CodeDto();
  addNewIcdCodeDto = new ChronicIcd10CodeDto();
  isLoadingChronicConditions: boolean;
  diseaseOnServicesDto = new DiseaseOnServicesDto();
  searchWatch = new Subject<string>();
  LoadingData: boolean;
  diagnose = new DiagnosisDto();
  searchParam = '';
  chronicDiseasesByUrl = new Array<{ code: string; detail: string }>();
  selectedCronicDisease = {
    code: "",
    detail: "",
  };
  isIcdCodeExist: boolean;
  constructor(
    private patientsService: PatientsService,
    private toaster: ToastService
  ) {}

  ngOnInit() {
    this.GetChronicDiseases();
    this.SearchObserver();
  }
  GetChronicDiseases() {
    this.patientsService.getChronicConditions().subscribe(
      (res: any) => {
        console.log(res);
        this.rows = res;
        this.tempRows = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  updateChronicCondition(row) {
    this.updateChronicDiseaseDto.id = row.id;
    this.updateChronicDiseaseDto.isOnCcm = row.isOnCcm;
    this.updateChronicDiseaseDto.isOnRpm = row.isOnRpm;
    this.patientsService
      .UpdateChronicDisease(this.updateChronicDiseaseDto)
      .subscribe(
        (res: any) => {
          this.toaster.success("Chronic Condition Updated.");
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
  }
  filterChronicCondition(event) {
    const val = event.target.value.toLowerCase();
    const temp = this.tempRows.filter((chronicCondition) => {
      return (
        chronicCondition.algorithm.toLocaleLowerCase().indexOf(val) !== -1 ||
        !val
      );
    });
    this.rows = temp;
  }
  getChronicDiseaseCodes(id) {
    this.chronicDiseasesList = new Array<ChronicIcd10CodeDto>();
    this.isLoadingChronicConditions = true;
    this.patientsService.GetChronicDiseaseCodes(id).subscribe(
      (res: any) => {
        this.chronicDiseasesList = res;
        this.isLoadingChronicConditions = false;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
        this.isLoadingChronicConditions = false;
      }
    );
  }
  addNewIcdCode() {
    this.addNewIcdCodeDto.icdCode = this.selectedCronicDisease.code;
    this.addNewIcdCodeDto.detail = this.selectedCronicDisease.detail;
    this.addNewIcdCodeDto.algorithm = this.selectedChronicDisease.algorithm;
    this.addNewIcdCodeDto.chronicConditionId = this.selectedChronicDisease.id;
    this.patientsService.addNewIcdCode(this.addNewIcdCodeDto).subscribe(
      (res: any) => {
        this.toaster.success("New ICD Code added.");
        this.AddChronicConditionModal.hide();
        this.getChronicDiseaseCodes(this.selectedChronicDisease.id);
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  deleteChronicCondition(id) {
    this.patientsService.RemoveIcdCode(id).subscribe(
      (res: any) => {
        this.toaster.success("Chronic Condition Deleted.");
        this.getChronicDiseaseCodes(this.selectedChronicDisease.id);
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  IsDiseaseOnServices(code) {
    this.patientsService.IsDiseaseOnServices(code).subscribe(
      (res: DiseaseOnServicesDto) => {
        this.diseaseOnServicesDto = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  diseaseSelected(item: any) {
    // this.diagnoseForm.get('isOnCcm').setValue(false);
    // this.diagnoseForm.get('isOnRpm').setValue(false);
    // this.showRMPCheckedWarning = false;
    if (item) {
      this.diagnose.icdCode = item.code;
      this.diagnose.description = item.detail;
      this.checkIcdCodeExist();
      this.IsDiseaseOnServices(item.code);
    }
  }
  checkIcdCodeExist() {
    this.isIcdCodeExist = false;
    if (this.diagnose.icdCode) {
      // this.addICDCodeDto.chronicConditionId = this.diagnose.icdCode;
      this.patientsService.CheckIcdCodeExist(this.diagnose.icdCode).subscribe(
        (res: boolean) => {
          this.isIcdCodeExist = res;
          if (res) {
            // this.toaster.warning("Already marked as chronic disease");
          }
        },
        (error: HttpResError) => {
          this.isIcdCodeExist = false;
          this.toaster.error(error.error, error.message);
        }
      );
    }
  }
  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      this.searchParam = x;
      this.getClinicalTableDiseases();
    });
  }
  getClinicalTableDiseases() {
    this.LoadingData = true;
    this.chronicDiseasesByUrl = new Array<{ code: string; detail: string }>();
    this.subs.sink = this.patientsService
      .getCLinicalDiseases(this.searchParam)
      .subscribe(
        (res: any) => {
          this.LoadingData = false;
          res[3].forEach(item => {
            this.chronicDiseasesByUrl.push({ code: item[0], detail: item[1] });
          });
          if (
            this.chronicDiseasesByUrl &&
            this.chronicDiseasesByUrl.length === 1
          ) {
            this.selectedCronicDisease = this.chronicDiseasesByUrl[0];
            this.diseaseSelected(this.selectedCronicDisease);
          } else if (this.chronicDiseasesByUrl && this.chronicDiseasesByUrl.length > 0 && this.selectItem && this.selectItem.icdCode) {
            this.chronicDiseasesByUrl.forEach(x => {
              const sCode = this.selectItem.icdCode.replace('.', '');
              const searchCode = x.code.replace('.', '');
              if (sCode.toLowerCase() === searchCode.toLowerCase()) {
                this.selectedCronicDisease = x;
              }
            });
          }
          // console.log(this.chronicDiseasesByUrl);
        },
        err => {
          this.LoadingData = false;
          // console.log(err);
        }
      );
  }
  resetSelectedChronicDisease(){
    this.selectedCronicDisease = {
      code: "",
      detail: "",
    };
    this.addNewIcdCodeDto = new ChronicIcd10CodeDto();
  }
}
