import { SpeechToTextService } from './../../core/Tools/speech-to-text.service';
import { AllergiesComponent } from './../../patient-shared/allergies/allergies.component';
import { MedicationComponent } from './../../admin/patient/medication/medication.component';
import { MedicationDto, AllergyDto } from './../../model/Patient/patient.model';
import { DiagnoseComponent } from './../../admin/patient/diagnose/diagnose.component';
import { ClonerService } from 'src/app/core/cloner.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BBCCDAObj } from 'src/app/model/bb-ccda.model';
import { DiagnosisDto, PatientDto } from 'src/app/model/Patient/patient.model';
import { DiagnoseStatus } from 'src/app/Enums/ccm.enum';
import * as moment from 'moment';
@Component({
  selector: 'app-bb-ccda',
  templateUrl: './bb-ccda.component.html',
  styleUrls: ['./bb-ccda.component.scss']
})
export class BBCCDAComponent implements OnInit {
  @ViewChild('diagnoseCompRef') diagnoseCompRef: DiagnoseComponent;
  @ViewChild('medicationCompRef') medicationCompRef: MedicationComponent;
  @ViewChild('allergiesCompRef') allergiesCompRef: AllergiesComponent;
  selectedCategory = 'Diagnosis';
  ccdDocumentText = '';
  displayJson: string;
  displayJsonObj: string;
  myBBJs: any;
  blueButtonObj: BBCCDAObj.BBResource;
  diagnoseStatusEnum = DiagnoseStatus;
  appDiagnosisList: DiagnosisDto[] = [];
  appMedicationsList: MedicationDto[] = [];
  appAllergiesList: AllergyDto[] = [];
  loading2CItem = true;
  loadingBBItem = true;
  patinetDetails = new PatientDto();
  constructor(private toaster: ToastService, private cloner: ClonerService,private specchToText: SpeechToTextService) { }

  ngOnInit(): void {
    this.myBBJs = window['BlueButton'];
    // this.specchToText.initSpeechRecognition();
  }
  async CopyJsonData() {
    const result = await navigator.clipboard.writeText(this.displayJsonObj);
    this.toaster.success('Data copied');
  }
  GetJsonFromXml() {
    this.displayJson = '';
    this.displayJsonObj = '';
    this.blueButtonObj = {} as BBCCDAObj.BBResource;
    let result;
    try {
     result = this.myBBJs(this.ccdDocumentText) as BBCCDAObj.BBResource;
    } catch (error) {
      this.toaster.warning('Insert valid CCDA');
      this.ccdDocumentText = '';
      return;
    }
    if (result.type === 'ccda') {
      this.blueButtonObj = result as BBCCDAObj.BBResource;
      this.displayJsonObj = JSON.stringify(result);
      // this.displayJson = this.syntaxHighlight(result);
    } else {
      this.toaster.warning('Insert valid CCDA');
    }
  }
  categoryChanged() {
    this.loading2CItem = true;
  }
  DiagnoseDataUpdated(event: DiagnosisDto[]) {
    this.appDiagnosisList = this.cloner.deepClone(event);
    this.loading2CItem = false;
  }
  MedicationDataUpdated(event: MedicationDto[]) {
    this.appMedicationsList = this.cloner.deepClone(event);
    this.loading2CItem = false;
  }
  AllergiesDataUpdated(event: AllergyDto[]) {
    this.appAllergiesList = this.cloner.deepClone(event);
    this.loading2CItem = false;
  }
  OpenAddNewDiagnose(item: BBCCDAObj.Problem) {
    const newDiagnose = new DiagnosisDto();
    newDiagnose.icdCode = item.code;
    if (item.date_range?.start) {
      newDiagnose.diagnosisDate = moment(item.date_range?.start).format('YYYY-MM-DD');
    }
    if (item.date_range?.end) {
      newDiagnose.resolvedDate = moment(item.date_range?.end).format('YYYY-MM-DD');
    }
    newDiagnose.note = item.comment || '';
    newDiagnose.description = item.name || '';
    this.diagnoseCompRef.ExternalAddNew(newDiagnose);
  }
  OpenAddNewMedication(item: BBCCDAObj.Medication) {
    const newMedication = new MedicationDto();
    newMedication.medicationName = item.product?.name;
    if (item.date_range?.start) {
      newMedication.startDate = moment(item.date_range?.start).format('YYYY-MM-DD');
    }
    if (item.date_range?.end) {
      newMedication.stopDate = moment(item.date_range?.end).format('YYYY-MM-DD');
    }
    newMedication.dose = item.dose_quantity?.value + ' ' + item.dose_quantity?.unit || '';
    newMedication.status =  '';
    this.medicationCompRef.ExternalAddRequest(newMedication);
  }
  OpenAddNewAllergy(item: BBCCDAObj.Allergy) {
    const newAllergy = new AllergyDto();
    newAllergy.agent = item.allergen?.name;
    if (item.date_range?.start) {
      newAllergy.date = moment(item.date_range?.start).format('YYYY-MM-DD');
    }
    // if (item.date_range?.end) {
    //   newAllergy.stopDate = moment(item.date_range?.end).format('YYYY-MM-DD');
    // }
    newAllergy.reaction = item.reaction?.code + ' ' + item.reaction?.name || '';
    this.allergiesCompRef.ExternalAddRequest(newAllergy);
  }
  OpenEditDiagnose(diagnose: DiagnosisDto) {
    this.diagnoseCompRef.ExternalRequestEdit(diagnose);
  }
  OpenEditMedication(medication: MedicationDto) {
    this.medicationCompRef.ExternalRequestEdit(medication);
  }
  OpenEditAllergy(allergy: AllergyDto) {
    this.allergiesCompRef.ExternalRequestEdit(allergy);
  }

}
