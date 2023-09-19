import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { PcmMeasureDataObj, PCMEncounterDto, AddEditCounselingDto, CloseEncounterDto, PcmEncounterType, PcmEncounterStatus, AddendumNoteDto } from 'src/app/model/pcm/pcm.model';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AMScreeningDto } from 'src/app/model/pcm/pcm-alcohol.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { AwService } from 'src/app/core/annualWellness/aw.service';

@Component({
  selector: 'app-pcm-encounter-list',
  templateUrl: './pcm-encounter-list.component.html',
  styleUrls: ['./pcm-encounter-list.component.scss']
})
export class PcmEncounterListComponent implements OnInit {
  measuresListDto = new Array<PcmMeasureDataObj>();
  pCMEncountersList = new Array<PCMEncounterDto>();
  PatientId: number;
  isCreatingScreening: boolean;
  isCreatingDPScreening: boolean;
  isCreatingAMCounselling: boolean;
  isCreatingDPCounselling: boolean;
  addEditCounselingDto = new AddEditCounselingDto();
  counselling = '';
  PcmEncounterTypeEnum = PcmEncounterType;
  pcmEncounterStatus = PcmEncounterStatus;
  closePcmEncounterObj = new CloseEncounterDto();
  closingEncounter: boolean;
  selectedEncounter: PCMEncounterDto;
  isCreatingAWEncounter: boolean;
  addendumNoteDto = new AddendumNoteDto();
  isAddendum: boolean;
  constructor (private location: Location, private toaster: ToastService, private pcmService: PcmService,
    private route: ActivatedRoute, private router: Router, private awService: AwService) { }

  ngOnInit() {
    this.PatientId = +this.route.snapshot.paramMap.get("id");
    this.GetPCMEncountersByPatientId();
  }
  GetPCMEncountersByPatientId() {
    this.pcmService.GetPCMEncountersByPatientId(this.PatientId).subscribe( (res: Array<PCMEncounterDto>) => {
      this.pCMEncountersList = [];
      this.pCMEncountersList = [...res];
    });
  }
  goBack() {
    this.location.back();
  }
  AddAMScreening() {
    this.isCreatingScreening = true;
    this.pcmService.AddAMScreening(this.PatientId).subscribe((res: AMScreeningDto) => {
      this.isCreatingScreening = false;
      this.router.navigateByUrl(`/pcm/pcmAlcohol/${this.PatientId}/alcoholScreening/${res.id}`);
    },
    (err: HttpResError) => {
      this.isCreatingScreening = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddDepressionScreening() {
    this.isCreatingDPScreening = true;
    this.pcmService.AddDPScreening(this.PatientId).subscribe((res: AMScreeningDto) => {
      this.isCreatingDPScreening = false;
      this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionScreening/${res.id}`);
    },
    (err: HttpResError) => {
      this.isCreatingDPScreening = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddDepressionCounselling() {
    this.isCreatingDPCounselling = true;
    this.pcmService.AddDepressionCounseling(this.PatientId).subscribe((res: any) => {
      this.isCreatingDPCounselling = false;
      this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionCounselling/${res.id}`);
    },
    (err: HttpResError) => {
      this.isCreatingDPCounselling = false;
      this.toaster.error(err.error, err.message);
    });
  }
  ClosePcmEncounter(modal: ModalDirective) {
    this.closingEncounter = true;
    this.closePcmEncounterObj.id = this.selectedEncounter.encounterId;
    this.closePcmEncounterObj.measure = this.selectedEncounter.measureCode;
    this.closePcmEncounterObj.encounterType = this.selectedEncounter.encounterType;
    this.awService.ClosePcmEncounter(this.closePcmEncounterObj).subscribe((res: any) => {
      this.closingEncounter = false;
      this.toaster.success('Encounter closed successfully');
      this.GetPCMEncountersByPatientId();
      modal.hide();
    },
    (err: HttpResError) => {
      this.closingEncounter = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddAWEncounter() {
    this.isCreatingAWEncounter = true;
    this.awService.AddAWEncounter(this.PatientId).subscribe((res: number) => {
      this.isCreatingAWEncounter = false;
      this.router.navigateByUrl(`/annualWellness/AWMain/${this.PatientId}/${res}/awPatient`);
    },
    (err: HttpResError) => {
      this.isCreatingAWEncounter = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddEditCounseling() {
    this.isCreatingAMCounselling = true;
    if (this.counselling === 'AM') {
      this.addEditCounselingDto.patientId = this.PatientId;
      this.addEditCounselingDto.measureCode = 'AM';
      this.addEditCounselingDto.cptCode = 'G0443';
    } else if (this.counselling === 'DP') {
      this.addEditCounselingDto.patientId = this.PatientId;
      this.addEditCounselingDto.measureCode = 'DP';
      this.addEditCounselingDto.cptCode = 'G0444';
    }
    // this.addEditCounselingDto
    this.pcmService.AddEditCounseling(this.addEditCounselingDto).subscribe((res: any) => {
      this.isCreatingAMCounselling = false;
      if (this.counselling === 'AM') {
        this.router.navigateByUrl(`/pcm/pcmAlcohol/${this.PatientId}/alcoholCounselling/${res.id}`);
      } else if (this.counselling === 'DP') {
        this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionCounselling/${res.id}`);
      }

    },
    (err: HttpResError) => {
      this.isCreatingAMCounselling = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddAnnualWellnessAddendum(addendumModal: ModalDirective) {
    // this.addEditCounselingDto
    this.isAddendum = true;
    this.awService.AddAnnualWellnessAddendum(this.selectedEncounter.encounterId).subscribe((res: any) => {
    this.isAddendum = false;
    addendumModal.hide();
    this.ProceedNavigation(this.selectedEncounter);
    },
    (err: HttpResError) => {
    this.isAddendum = false;
    // this.isCreatingAMCounselling = false;
      this.toaster.error(err.error, err.message);
    });
  }
  AddEditAddendumNote(addendumModal: ModalDirective) {
    // this.addEditCounselingDto
    this.addendumNoteDto.awEncounterId = this.selectedEncounter.encounterId;
    this.addendumNoteDto.addendumNote = this.selectedEncounter.addendumNote;
    this.addendumNoteDto.addendumSignature = this.selectedEncounter.addendumSignature;
    this.isAddendum = true;
    this.awService.AddEditAddendumNote(this.addendumNoteDto).subscribe((res: any) => {
    this.isAddendum = false;
    this.GetPCMEncountersByPatientId();
    addendumModal.hide();
    this.toaster.success('Addendum Completed Successfully');
    },
    (err: HttpResError) => {
    this.isAddendum = false;
    // this.isCreatingAMCounselling = false;
      this.toaster.error(err.error, err.message);
    });
  }
  ProceedNavigation(item: PCMEncounterDto) {
    if (item.encounterType === PcmEncounterType['Annuall Wellness']) {
      this.router.navigateByUrl(`/annualWellness/AWMain/${this.PatientId}/${item.encounterId}/awPatient`);
      return;
    }
    if (item.encounterType === PcmEncounterType.Screening) {
      if (item.measureCode === 'AM') {
        this.router.navigateByUrl(`/pcm/pcmAlcohol/${this.PatientId}/alcoholScreening/${item.encounterId}`);
      } else if (item.measureCode === 'DP') {
        this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionScreening/${item.encounterId}`);
      }
    } else {
      if (item.measureCode === 'AM') {
        this.router.navigateByUrl(`/pcm/pcmAlcohol/${this.PatientId}/alcoholCounselling/${item.encounterId}`);
      } else if (item.measureCode === 'DP') {
        this.router.navigateByUrl(`/pcm/pcmDepression/${this.PatientId}/depressionCounselling/${item.encounterId}`);
      }
    }
  }
}
