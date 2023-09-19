import { AppDataService } from 'src/app/core/app-data.service';
import { SecurityService } from './../../core/security/security.service';
import { FacilityService } from './../../core/facility/facility.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { CustomeListService } from 'src/app/core/custome-list.service';
import { EmitEvent, EventTypes, EventBusService } from 'src/app/core/event-bus.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { UserType } from 'src/app/Enums/UserType.enum';
import { AssignPatientsToCustomListDto, HeadersDto, RemovePatientsToCustomListDto } from 'src/app/model/custome-list.model';
import { Location } from "@angular/common";
import { CcmMonthlyStatus } from 'src/app/Enums/filterPatient.enum';
import { TcmStatusEnum } from 'src/app/model/Tcm/tcm.enum';
import { PcmEncounterStatus } from 'src/app/model/pcm/pcm.model';
import { SelectionType } from '@swimlane/ngx-datatable';
import { AppUiService } from 'src/app/core/app-ui.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';

@Component({
  selector: 'app-custom-patients-list',
  templateUrl: './custom-patients-list.component.html',
  styleUrls: ['./custom-patients-list.component.scss']
})
export class CustomPatientsListComponent implements OnInit {
  @ViewChild('clickOnRow') clickOnRow: ModalDirective;
  headersDto = new HeadersDto();
  listId = 0;
  rows: any;
  isLoading: boolean;
  CareProvidersList = new Array<CreateFacilityUserDto>();
  facilityId = 0;
  showTasks: boolean;
  showNotes: boolean;
  name: string;
  ccmMonthlyStatusEnum = CcmMonthlyStatus;
  tcmStatusEnum = TcmStatusEnum;
  pcmEncounterStatus = PcmEncounterStatus;
  rowId: any;
  gridCheckAll: boolean = false;
  selected = [];
  SelectionType = SelectionType;
  removePatientInCustmListDto = new RemovePatientsToCustomListDto();
  creatorId: number;

  constructor(private route: ActivatedRoute, private customListService: CustomeListService, private toaster: ToastService,
    private location: Location, private appUi: AppUiService, private appDataService: AppDataService,
    private router: Router,private eventBusService: EventBusService, private facilityService: FacilityService, private securityService: SecurityService) { }

  ngOnInit() {
    if (this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    }
    this.listId = +this.route.snapshot.paramMap.get("id");
    this.creatorId = +this.route.snapshot.queryParamMap.get('creatorId');
    this.route.params.subscribe((routeParams: any) => {

    //  this.route.pathFromRoot[1].params.subscribe(routeParams => {
      this.listId = routeParams.id;
      this.getCustomListDataById();
    });
    this.eventBusService.on(EventTypes.RefreshCustomList).subscribe((res) => {

      const tempCustomList = this.appDataService.CustomListDto.find(
        list => list.id == this.listId
      );

      if (tempCustomList && !res) {
        this.getCustomListDataById();
      }
      });
    // this.getCustomListDataById();
    this.getCareProviders();
  }
  EmitEventForRefreshCustomListModal() {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = EventTypes.RefreshCustomList;
    event.value = true;
    this.eventBusService.emit(event);
  }
  onClickRow(row) {
    // this.patientsService.getPatientDetail(row)

    this.rowId = row.id;
    if (row.profileStatus) {
      this.router.navigate(['/admin/patient/', row.id]);
    } else {
      this.clickOnRow.show();
      // this.router.navigate(['/admin/addPatient/'+ row.id);
      // this.router.navigate(['/admin/addPatient/', row.id]);
    }
  }
  gridAllRowsCheckBoxChecked(e) {
    if (this.creatorId && this.creatorId !== this.securityService.securityObject.id) {
      this.toaster.warning('You are not authorized to edit the list');
      this.rows.forEach((data: any) => {
        data.checked = false;
      });
      return;
    }
    this.rows.forEach((data: any) => {
      data.checked = e.target.checked;
    });
    if (e.target.checked) {
      this.selected = [];
      Object.assign(this.selected, this.rows);
    } else {
      this.selected = [];
    }
  }
  addRequiredData() {
    // this.router.navigateByUrl('/admin/addPatient/'+ this.rowId, {state: {filters:this.filterPatientDto}});
    this.router.navigate(['/admin/addPatient/' + this.rowId]
    // , {
    //   state: this.filterPatientDto,
    // }
    );
  }
  rowCheckBoxChecked(e, row) {
    if (this.creatorId && this.creatorId !== this.securityService.securityObject.id) {
      this.toaster.warning('You are not authorized to edit the list');
      e.target.checked = false;
      return;
    }
    this.gridCheckAll = false;
    // this.profileStatus = row.profileStatus;
    if (e.target.checked) {
      this.selected.push(row);
    } else {
      const index = this.selected.findIndex((x) => x.id === row.id);
      this.selected.splice(index, 1);
    }
  }
  getCareProviders() {
    if (!this.facilityId) {
      this.facilityId = 0;
    }
    this.facilityService
      .GetCareProvidersByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.CareProvidersList = res;
          }
        },
        (error) => {}
      );
  }
  removePatientsFromList() {
    this.removePatientInCustmListDto.patientIds = [];
    this.removePatientInCustmListDto.customListId = this.listId;
    this.selected.forEach((element) => {
      this.removePatientInCustmListDto.patientIds.push(element.id);
    });
    // this.removePatientInCustmListDto.patientIds = this.selected;
    this.customListService
      .RemovePatientsFromList(this.removePatientInCustmListDto)
      .subscribe(
        (res: any) => {
          this.EmitEventForRefreshCustomListModal();
         this.getCustomListDataById() ;
        },
        (error) => {}
      );
  }
  openConfirmModal() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Remove Patients";
    modalDto.Text = `Are you sure to remove selected patients from ${this.name}`;
    modalDto.callBack = this.callBack;
    // modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.removePatientsFromList();
  }
  navigateBack() {
    this.location.back();
  }
  getCustomListDataById() {
    this.isLoading = true;
    this.selected = [];
    this.selected.length = 0;
    this.customListService.GetCustomListData(this.listId).subscribe(
      (res: any) => {
        this.name = res.name;
        this.showNotes = res.showNotes;
        this.showTasks = res.showTasks;
        this.headersDto = res.headersData;
       this.rows = res.customListDataDto;
       this.isLoading = false;
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openPatientNote(row) {
    const event = new EmitEvent();
    event.name = EventTypes.OpenPatientNote;
    event.value = row.id;
    this.eventBusService.emit(event);
  }
  onActivate(event: any) {
    if (event.type === "click") {
      // id: number = +event.row.id;
    }
  }
}
