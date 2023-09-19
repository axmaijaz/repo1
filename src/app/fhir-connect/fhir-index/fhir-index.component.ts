import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AllergyIntolerance, Bundle, Condition, Location, MedicationRequest, Patient, Practitioner } from 'fhir/r4';
import FHIR from "fhirclient";
import Client from 'fhirclient/lib/Client';
import { ToastService } from 'ng-uikit-pro-standard';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { AppDataService } from 'src/app/core/app-data.service';
import { BrandingService } from 'src/app/core/branding.service';
import { FhirConnectService } from 'src/app/core/fhir/fhir-connect.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { LaunchModeEnum } from 'src/app/model/AppData.model';
import { FhirLoginDto } from 'src/app/model/FHIR/FHIRLogin.model';
import { DiagnosisDto, MedicationDto, PatientDto } from 'src/app/model/Patient/patient.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AppUserAuth } from 'src/app/model/security/app-user.auth';

@Component({
  selector: 'app-fhir-index',
  templateUrl: './fhir-index.component.html',
  styleUrls: ['./fhir-index.component.scss']
})
export class FhirIndexComponent implements OnInit {
  client: Client;
  practitionerId: string;
  patientId: number = 20213;
  patientEmrId: string;
  locationId: string;
  fhirUserName: string;
  locationData: Location;
  practitionerData: Practitioner;
  patientData: Patient;
  alertReason = ''

  fhirLoginObj = new FhirLoginDto();
  loggingIn: boolean;
  patientDataLoaded: boolean;
  patient = new PatientDto()
  addingPatient: boolean;
  medications: MedicationRequest[];
  allergies: AllergyIntolerance[];
  conditions: Condition[];
  authorized: boolean;

  appDiagnoses = new Array<DiagnosisDto>()
  appMedications = new Array<MedicationDto>()

  constructor(
    public brandingService: BrandingService,
    private router: Router,
    private appDataService: AppDataService,
    private patientService: PatientsService,
    private toaster: ToastService,
    private securityService: SecurityService,
    private fhirConnect: FhirConnectService) { }

  ngOnInit(): void {
    this.FhirInit();
  }

  async FhirInit() {
    this.client = await FHIR.oauth2.ready();
    this.GetRequiredData()
  }

  async GetRequiredData() {

    this.locationId = this.client.state.tokenResponse.location
    this.practitionerId = this.client.user.id
    this.fhirUserName = decodeURIComponent(this.client.state.tokenResponse.user || '');
    this.patientEmrId = this.client.patient.id;
    this.fhirLoginObj.practiceId = this.locationId;
    this.fhirLoginObj.patientEmrId = this.patientEmrId;
    this.fhirLoginObj.userName = this.fhirUserName;
    await this.GetPractitionerResource()
    this.fhirLoginObj.email = this.fhirUserName.includes('@') ? this.fhirUserName : '';
    this.fhirLoginObj.firstName = this.practitionerData.name[0]?.given.join(' ') || ''
    this.fhirLoginObj.lastName = this.practitionerData.name[0].family || '';

    this.GetLocationResource()
    this.SmartOnFhirLogin();
    await this.LoadPatientData();
    this.patientDataLoaded = true;
  }

  async LoadPatientData() {
    await Promise.all([
      this.GetPatientResource(),
      this.GetConditionResource(),
      this.GetMedicationRequestResource(),
      this.GetAllergyIntoleranceResource(),
    ])
  }

  async GetPatientResource() {
    this.patientData = await this.client.request<Patient>(`Patient/${this.patientEmrId}`, {
      // resolveReferences: [
      //   'AllergyIntolerance',
      //   'MedicationRequest',
      //   'Immunization',
      //   'AllergyIntolerance'
      // ],
      // graph: true
    })
    this.mapPatientValues();
    // this.client.request(this.patientData.generalPractitioner[0].reference)
  }
  async GetConditionResource() {
    const bundle = await this.client.patient.request<Bundle>(`Condition`)
    this.conditions = bundle.entry.filter(x => x.resource?.resourceType == 'Condition').map(x => x.resource) as Condition[];
    this.FillDiagnoses()

  }
  async GetMedicationRequestResource() {// Get MedicationRequests for the selected patient
    const bundle = await this.client.patient.request<Bundle>("MedicationRequest", {
      // resolveReferences: ["medicationReference"],
      // graph: true
    })
    this.medications = bundle.entry.filter(x => x.resource?.resourceType == 'MedicationRequest').map(x => x.resource) as MedicationRequest[];
    this.FillMedications();
  }
  async GetAllergyIntoleranceResource() {
    const bundle = await this.client.patient.request<Bundle>(`AllergyIntolerance`)
    this.allergies = bundle.entry.filter(x => x.resource?.resourceType == 'AllergyIntolerance').map(x => x.resource) as AllergyIntolerance[];
  }
  async GetLocationResource() {
    this.locationData = await this.client.request<Location>(`Location/${this.client.state.tokenResponse.location}`, {
      resolveReferences: [
        // "managingOrganization"
      ]
    })
  }

  async GetPractitionerResource() {
    this.practitionerData = await this.client.request<Practitioner>(`Practitioner/${this.practitionerId}`)
  }

  SmartOnFhirLogin() {
    this.loggingIn = true;
    this.fhirConnect.SmartOnFhirLogin(this.fhirLoginObj)
      .subscribe(
        (res: { patientId: number, appUserAuth: AppUserAuth }) => {
          if (res.appUserAuth) {
            this.authorized = true;
            this.securityService.updateToken(res.appUserAuth)
          }
          if (res.patientId) {
            this.router.navigateByUrl(`/insights/embedded/summary/${res.patientId}`)
          } else if (this.fhirLoginObj.patientEmrId) {
            this.alertReason = 'Patient is not registered in 2C Health';
          } else {
            // this.alertReason = 'Please re-launch 2C App afetr selecting patient';
            // this.alertReason = 'Please enter Emr id to load patient';
            this.appDataService.launchMode = LaunchModeEnum.GlobalContext;
            this.router.navigateByUrl("/dashboard")
          }
          this.loggingIn = false;
        },
        (err: HttpResError) => {
          this.loggingIn = false;
          this.toaster.error(err.error, err.message);
        }
      );
  }

  RegisterPatientIn2C() {
    if (!this.alertReason || !this.patientDataLoaded) {
      return;
    }
    this.addingPatient = true;
    console.log(this.patient)
    return
    this.patientService.addPatient(this.patient, this.securityService.securityObject.id).subscribe(
      (res: PatientDto) => {
        this.router.navigateByUrl(`/insights/embedded/summary/${res.id}`)

        this.addingPatient = false;
      },
      (error: HttpResError) => {
        this.addingPatient = false;
        this.toaster.error(error.error, error.error);
        // console.log(error);
      }
    );
  }
  mapPatientValues() {
    if (this.patientData.name && this.patientData.name[0] && this.patientData.name[0]?.given) {
      this.patient.firstName = this.patientData.name[0]?.given[0];
    }
    if (this.patientData.name && this.patientData.name[0] && this.patientData.name[0]?.family) {
      this.patient.lastName = this.patientData.name[0]?.family;
    }
    this.patient.dateOfBirth = this.patientData.birthDate;
    if (this.patientData && this.patientData.telecom?.length) {
      const phone = this.patientData.telecom.find(x => x.system == 'phone');
      if (phone) {
        this.patient.homePhone = phone.value?.replace(/\D/g, "")
      }
    }
    this.patient.patientEmrId = this.patientData.id;
    this.patient.facilityId = +this.securityService.getClaim('FacilityId')?.claimValue;
    this.patient.userName = `${this.patient.facilityId}-${this.patientData.id}`;
    this.patient.password = `2C#ealth`
    const email = this.patientData.telecom?.find(x => x.system == 'email')
    if (email) {
      this.patient.userName = email.value
      this.patient.email = email.value
    }
    if (this.patientData.gender && this.patientData.gender.toLowerCase() == 'female') {
      this.patient.sex = 'female'
    }
    if (this.patientData.gender && this.patientData.gender.toLowerCase() == 'male') {
      this.patient.sex = 'male'
    }
    if (this.patientData.address?.length) {
      this.patient.city = this.patientData.address[0].city
      this.patient.state = this.patientData.address[0].state
      this.patient.zip = this.patientData.address[0].postalCode
      this.patient.currentAddress = this.patientData.address[0].line[0] || ''
    }
  }
  FillDiagnoses() {
    this.appDiagnoses = [];
    this.conditions.forEach(condition => {
      if (!condition.code.coding.some(x => x.system.includes('icd-10'))) {
        return;
      }
      const newDiagnose = new DiagnosisDto()
      newDiagnose.patientId = this.patientId;
      const dCode = condition.code.coding.find(x => x.system.includes('icd-10'));
      newDiagnose.icdCode = dCode.code;
      newDiagnose.icdCodeSystem = dCode.system;
      newDiagnose.description = condition.code.text;
      newDiagnose.diagnosisDate = condition.onsetPeriod?.start || null;
      newDiagnose.resolvedDate = condition.onsetPeriod?.end || null;
      newDiagnose.note = condition.note?.[0].text || '';
      this.appDiagnoses.push(newDiagnose)
    });
    console.log(this.appDiagnoses)
    this.AddMultipleDiagnosis()
  }

  FillMedications() {
    this.appMedications = [];
    // Extract relevant data from each MedicationRequest resource
    this.medications.forEach((medicationRequest) => {
      const newMedication = new MedicationDto()
      newMedication.id = 0;
      newMedication.patientId = this.patientId;
      newMedication.medicationName = medicationRequest.medicationReference.display || '';
      newMedication.frequency = medicationRequest.dosageInstruction?.[0]?.timing?.repeat?.frequency?.toString() ?? '';
      newMedication.dose = medicationRequest.dosageInstruction?.[0]?.doseAndRate?.[0]?.doseQuantity?.value?.toString() ?? '';
      newMedication.startDate = medicationRequest.authoredOn ?? '';
      newMedication.stopDate = medicationRequest.dosageInstruction?.[0]?.timing?.event?.[0] ?? '';
      newMedication.status = medicationRequest.status;
      // newMedication.patientId =  medicationRequest.subject?.reference?.split('/')?.[1] ?? '',
      this.appMedications.push(newMedication)
    });
    console.log(this.appMedications)
    this.AddMultipleMedications()
  }

  AddMultipleDiagnosis() {
    this.patientService
      .AddMultipleDiagnosis(this.patientId, this.appDiagnoses)
      .subscribe(
        (res: any) => {

        }, (error: HttpResError) => {
          this.toaster.error(error.error, error.error);
          // console.log(error);
        })
  }
  AddMultipleMedications() {
    this.patientService
      .AddMultipleMedications(this.patientId, this.appMedications)
      .subscribe(
        (res: any) => {

        }, (error: HttpResError) => {
          this.toaster.error(error.error, error.error);
          // console.log(error);
        })
  }
  fillSessionInfo() {
    var smartKey = sessionStorage.getItem('SMART_KEY')
    smartKey = smartKey.replace(/"/g, '');
    var sessionStr = sessionStorage.getItem(smartKey)
    var sessionObj = JSON.parse(sessionStr);
    sessionObj.codeChallenge = localStorage.getItem('sj-challenge').replace(/"/g, '')
    sessionObj.codeVerifier = localStorage.getItem('sj-verifier').replace(/"/g, '')
    sessionObj.codeChallengeMethods = [localStorage.getItem('sj-method').replace(/"/g, '')]
    sessionStorage.setItem(smartKey, JSON.stringify(sessionObj))
  }

}
