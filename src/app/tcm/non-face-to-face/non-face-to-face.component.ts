import { Component, OnInit } from '@angular/core';
import { TcmStatusEnum, tcmStatus2Enum } from 'src/app/model/Tcm/tcm.enum';
import { ToastService } from 'ng-uikit-pro-standard';
import { SecurityService } from 'src/app/core/security/security.service';
import { TcmDataService } from 'src/app/tcm-data.service';
import { TcmStoreService } from 'src/app/core/tcm/tcm-store.service';
import { TcmEncounterDto, NonFaceToFaceDto, PatientDischargeDto, FaceToFaceDto, TcmDocumentDto } from 'src/app/model/Tcm/tcm.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { PatientsService } from 'src/app/core/Patient/patients.service';

@Component({
  selector: 'app-non-face-to-face',
  templateUrl: './non-face-to-face.component.html',
  styleUrls: ['./non-face-to-face.component.scss']
})
export class NonFaceToFaceComponent implements OnInit {
  tcmStatusEnum = tcmStatus2Enum;
  objArray = [
  {code: "K56.601", detail: "Complete intestinal obstruction, unspecified as to cause"}
 ,{code: "A53.0", detail: "Latent syphilis, unspecified as early or late"}
 ,{code: "H16.223", detail: "Keratoconjunctivitis sicca, not specified as Sjogren's, bilateral"}
  ];
  isSavingNFTF: boolean;
  searchWatch = new Subject<string>();
  searchParam: string;
  LoadingData: boolean;
  nonFaceToFace = new NonFaceToFaceDto();
  chronicDiseasesByUrl: { code: string; detail: string; }[];
  gettingTcmData: boolean;
  constructor(private toaster: ToastService, private securityService: SecurityService, private patientsService: PatientsService, private tcmData: TcmDataService, public tcmStore: TcmStoreService) { }

  ngOnInit() {
    this.SearchObserver();
    // if (!this.tcmStore.tcmData.nonFaceToFace) {
    //   this.tcmStore.tcmData.nonFaceToFace = new NonFaceToFaceDto();
    // }
    this.GetTcmById();
    this.chronicDiseasesByUrl = this.objArray;
  }
  GetTcmById() {
    this.gettingTcmData = true;
    this.tcmData.GetTcmEncounterById(this.tcmStore.tcmId).subscribe((res: TcmEncounterDto) => {
      this.gettingTcmData = false;
      if (!res.patientDischarge) {
        res.patientDischarge = new PatientDischargeDto();
      }
      if (!res.nonFaceToFace) {
        res.nonFaceToFace = new NonFaceToFaceDto();
      }
      if (!res.faceToFace) {
        res.faceToFace = new FaceToFaceDto();
      }
      if (!res.tcmDocuments) {
        res.tcmDocuments = new Array<TcmDocumentDto>();
      }
      this.tcmStore.tcmData = res;
      this.nonFaceToFace = res.nonFaceToFace;
      this.chronicDiseasesByUrl = this.nonFaceToFace.otherDiagnosesCodes.concat(this.nonFaceToFace.primaryDiagnosesCodes);
      // this.chronicDiseasesByUrl = this.nonFaceToFace.primaryDiagnosesCodes;
      this.tcmStore.tcmDataLoaded.next(true);
      // this.datecheck();
    }, (error: HttpResError) => {
      this.gettingTcmData = false;
    });
  }
  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      this.searchParam = x;
      this.getClinicalTableDiseases();
    });
  }
  AddPatientNftfData() {
    this.isSavingNFTF = true;
    this.nonFaceToFace.tcmEncounterId = this.tcmStore.tcmId;
    this.tcmData.AddEditNonFaceToFace(this.nonFaceToFace).subscribe(
        (res: TcmEncounterDto) => {
          // this.toaster.success("Added Succesfully");
          this.tcmStore.tcmData = res;
          if (res.nonFaceToFace.id) {
            this.nonFaceToFace.id = res.nonFaceToFace.id;
          }
          this.isSavingNFTF = false;
        },
        (err: HttpResError) => {
          this.isSavingNFTF = false;
          this.toaster.error(err.error);
        }
      );
  }
  getClinicalTableDiseases() {
    this.LoadingData = true;
    this.chronicDiseasesByUrl = new Array<{ code: string; detail: string }>();
    this.patientsService.getCLinicalDiseases(this.searchParam).subscribe(
      (res: any) => {
        this.LoadingData = false;
        res[3].forEach(item => {
          this.chronicDiseasesByUrl.push({ code: item[0], detail: item[1] });
        });
        // if (
        //   this.chronicDiseasesByUrl &&
        //   this.chronicDiseasesByUrl.length === 1
        // ) {
        //   this.selectedCronicDisease = this.chronicDiseasesByUrl[0];
        //   this.diseaseSelected(this.selectedCronicDisease);
        // }
        // console.log(this.chronicDiseasesByUrl);
      },
      err => {
        this.LoadingData = false;
      }
    );
  }

}
