import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from './../../core/security/security.service';
import { BhiStatusEnum } from './../../Enums/bhi.enum';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { AppDataService } from 'src/app/core/app-data.service';
import { AppUiService } from 'src/app/core/app-ui.service';
import { BhiService } from 'src/app/core/bhi.service';
import { BhiEncounterDto, BhiEncountersListDto, BHIServiceTypeEnum } from 'src/app/model/Bhi/bhi.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { TwoCTextAreaComponent } from 'src/app/utility/two-c-text-area/two-c-text-area.component';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import moment from 'moment';

@Component({
  selector: 'app-bhi-log-history',
  templateUrl: './bhi-log-history.component.html',
  styleUrls: ['./bhi-log-history.component.scss']
})
export class BhiLogHistoryComponent implements OnInit {
  patientId: number;
  monthId: number;
  yearNum: number;
  listOfYears = [];
  IsEncounterLoading: boolean;
  bhiStatus: BhiStatusEnum;
  bhiStatusEnum = BhiStatusEnum;
  serviceType: BHIServiceTypeEnum;
  serviceTypeEnum = BHIServiceTypeEnum;
  addBhiEncounterDto = new BhiEncounterDto();
  durationtemp: number;
  
  bhiEncountersList: BhiEncountersListDto[];
  @ViewChild('durationInput') durationInput: ElementRef;
  @ViewChild('editor12') editor12: ElementRef;
  @ViewChild('myFIeldRefBHI') myFIeldRefBHI: TwoCTextAreaComponent;
  facilityUsersList = new Array<CreateFacilityUserDto>();
  psyfacilityUserList = new Array<CreateFacilityUserDto>();
  durationNO: number;
  isLoadingPayersList: boolean;
  facilityId: number;
  loadingPsy: boolean;
  bhiCareManagerId: number;
  psychiatristId: number;
  isEditingBhiEncounter: boolean;
  constructor(
    private route: ActivatedRoute,
    private appUi: AppUiService,
    private toaster: ToastService,
    private facilityService: FacilityService,
    private bhiService: BhiService,
    private securityService: SecurityService,
    private appData: AppDataService) { }

  ngOnInit(): void {
    this.listOfYears = this.appData.listOfYears;
    this.monthId = this.appData.currentMonth;
    this.yearNum = this.appData.currentYear;
    this.listOfYears = this.appData.listOfYears;
    this.patientId = +this.route.snapshot.paramMap.get("id");
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.bhiCareManagerId = +this.route.snapshot.queryParamMap.get('bhiCareManagerId');
    this.psychiatristId = +this.route.snapshot.queryParamMap.get('psychiatristId');
    this.bhiStatus = +this.route.snapshot.queryParamMap.get('bhiStatus');
    if (this.bhiStatus === this.bhiStatusEnum['Active G-BHI']) {
      this.addBhiEncounterDto.cptCode = '99484';
    }
    this.getBhiEncountersByPatientId();
    this.getFacilityUsers();
    this.getPsyFacilityUsers();
  }
  getBhiEncountersByPatientId() {
    this.IsEncounterLoading = true;
    this.bhiService.GetBhiEncountersByPatientId(this.patientId, this.monthId, this.yearNum).subscribe(
      (res: any) => {
        this.bhiEncountersList = res.bhiEncountersList;
        this.IsEncounterLoading = false;
        if (this.bhiStatus === this.bhiStatusEnum['Active G-BHI']) {
          this.addBhiEncounterDto.cptCode = '99484';
          return;
        }
        if (this.bhiEncountersList.length > 0) {
          this.addBhiEncounterDto.cptCode = '99493';
        } else {
          this.addBhiEncounterDto.cptCode = '99492';
        }
      },
      (error: HttpResError) => {
       this.IsEncounterLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  OnCloseEditEncounter() {
    // if (!this.tempAddEncounter.endTime) {
    //   this.tempAddEncounter.endTime = '';
    // }
    // this.durationInput.nativeElement.value = +this.durationtemp;
    // Object.assign(this.addBhiEncounterDto, this.tempAddEncounter);
  }
  OpenEditBhiEncounter(encounter: BhiEncountersListDto, modal: ModalDirective) {
    // Object.assign(this.tempAddEncounter, this.addBhiEncounterDto);
    this.addBhiEncounterDto = new BhiEncounterDto();
    this.addBhiEncounterDto.id = encounter.id;
    this.addBhiEncounterDto.encounterDate = encounter.encounterDate;
    this.addBhiEncounterDto.startTime = encounter.startTime;
    this.addBhiEncounterDto.endTime = encounter.endTime;
    this.addBhiEncounterDto.bhiCareManagerId = encounter.bhiCareManagerId;
    this.addBhiEncounterDto.psychiatristId = encounter.psychiatristId;
    this.addBhiEncounterDto.patientId = encounter.patientId;
    this.addBhiEncounterDto.cptCode = encounter.cptCode;
    this.addBhiEncounterDto.bhiServiceTypeId = encounter.bhiServiceType;
    this.addBhiEncounterDto.gbhiPsychiatrist = encounter.gbhiPsychiatrist;
    this.addBhiEncounterDto.bhiCareCoordinatorId = encounter.bhiCareCoordinatorId;
    this.addBhiEncounterDto.isProviderEncounter = encounter.isProviderEncounter;
    this.addBhiEncounterDto.note = encounter.note;
    this.durationtemp = +this.durationInput.nativeElement.value;
    modal.show();
    const du  = +encounter.duration.split(':')[1];
    this.durationNO = +du;
    this.FillNoteText(this.addBhiEncounterDto.note);
  }
  FillNoteText(text: string) {
    if (this.myFIeldRefBHI?.FillValue) {
      this.myFIeldRefBHI.FillValue(text || '');
    } else {
      setTimeout(() => {
        if (this.myFIeldRefBHI?.FillValue) {
          this.myFIeldRefBHI.FillValue(text || '');
        }
      }, 1000);
    }
  }
  getPsyFacilityUsers() {
    const roleName =  'Psychiatrist';
    this.loadingPsy = true;
    this.bhiService.GetFacilityUsers(this.facilityId, roleName).subscribe(
      (res: []) => {
        this.psyfacilityUserList = res;
        if (this.psychiatristId) {
        this.addBhiEncounterDto.psychiatristId = this.psychiatristId;
        }
        this.loadingPsy = false;
      },
      (error: HttpResError) => {
        this.loadingPsy = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  getFacilityUsers() {
    // let roleName = "PRCM Care Manager";
    this.isLoadingPayersList = true;
    this.facilityService.getFacilityUserList(this.facilityId).subscribe(
      (res: []) => {
        this.facilityUsersList = res;
        this.isLoadingPayersList = false;
      },
      (error: HttpResError) => {
        this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  editBhiEncounter(modal: ModalDirective) {
    this.isEditingBhiEncounter = true;
    if (this.bhiStatus == 4) {
      this.addBhiEncounterDto.psychiatristId = null;
     } else {
       this.addBhiEncounterDto.gbhiPsychiatrist = '';
     }
    this.bhiService.EditBhiEncounter(this.addBhiEncounterDto).subscribe(
      (res: any) => {
       //  this.psyfacilityUserList = res;
       this.resetEncounterForm();
       this.toaster.success('Encounter edited successfully');
       this.OnCloseEditEncounter();
       modal.hide();
       this.isEditingBhiEncounter = false;
       this.getBhiEncountersByPatientId();
      },
      (error: HttpResError) => {
       this.isEditingBhiEncounter = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  resetEncounterForm() {
    this.addBhiEncounterDto = new BhiEncounterDto();
    const date = moment().format('hh:mm');
    this.addBhiEncounterDto.startTime = date;
    const date1 = moment().format('YYYY-MM-DD');
    this.addBhiEncounterDto.encounterDate = date1;
    if (this.psychiatristId) {
      this.addBhiEncounterDto.psychiatristId = this.psychiatristId;
    }
    if (this.bhiCareManagerId) {
    this.addBhiEncounterDto.bhiCareManagerId = this.bhiCareManagerId;
    }
    this.durationNO = null;
    this.FillNoteText(this.addBhiEncounterDto.note);
  }
}
