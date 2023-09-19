import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { CustomeListService } from 'src/app/core/custome-list.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { FilterPatient } from 'src/app/model/Patient/patient.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AddEditCustomListDto, AssignPatientsToCustomListDto, RemovePatientsToCustomListDto } from 'src/app/model/custome-list.model';

@Component({
  selector: 'app-custom-list-for-patient-lists',
  templateUrl: './custom-list-for-patient-lists.component.html',
  styleUrls: ['./custom-list-for-patient-lists.component.scss']
})
export class CustomListForPatientListsComponent implements OnInit {
  @Output() selectedCustomList = new EventEmitter();
  @Output() deselectRows = new EventEmitter();
  selected = [];
  facilityUserId= 0;
  CustomListDto = new Array<any>();
  filterPatientDto = new FilterPatient();
  addingPatientToCustomList: boolean;
  addPatientInCustmListDto = new AssignPatientsToCustomListDto();
  removePatientInCustmListDto = new RemovePatientsToCustomListDto();
  isDeletingPatientFromCustomList: boolean;
  selectedCustomListIDs= [];
  selectedCList: any;

  constructor(private customListService: CustomeListService, private securityService: SecurityService, private toaster: ToastService) { }

  ngOnInit(): void {
    this.facilityUserId = this.securityService.securityObject.id;
    this.GetCustomListsByFacilityUserId();
  }
  GetCustomListsByFacilityUserId() {
    // this.isLoadingPayersList = true;
    this.customListService
      .GetCustomListsByFacilityUserId(this.facilityUserId)
      .subscribe(
        (res: any) => {
          res.customListsDto.forEach((cList) =>{
            cList['selected'] = false;
          })
          this.CustomListDto = res.customListsDto;
        },
        (error: HttpResError) => {
          // this.isLoadingPayersList = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  filterPatients(customListId){
    this.selectedCustomList.emit(customListId);
    this.selectedCList = this.CustomListDto.find(cuList => cuList.id == customListId);
  }
  AddPatientsToList() {
    this.addingPatientToCustomList = true;
    this.addPatientInCustmListDto.patientIds = new Array<number>();
    this.selected.forEach((element) => {
      if(element?.patientId){
        this.addPatientInCustmListDto.patientIds.push(element.patientId);
      }else{
        this.addPatientInCustmListDto.patientIds.push(element.id);
      }
    });
    this.addPatientInCustmListDto.customListIds = this.selectedCustomListIDs;
    this.customListService
      .AddPatientsToList(this.addPatientInCustmListDto)
      .subscribe(
        (res) => {
          this.toaster.success("Patients Added Successfully");
          this.addingPatientToCustomList = false;
          this.selectedCustomListIDs = [];
          this.deselectRows.emit();
          this.selected = [];
          this.CustomListDto.forEach((cList) =>{
            cList.selected = false;
          })
        },
        (error: HttpResError) => {
          // this.isLoadingPayersList = false;
          this.toaster.error(error.error, error.message);
          this.addingPatientToCustomList = false;
        }
      );
  }
  removePatientsFromList() {
    this.isDeletingPatientFromCustomList = true;
    this.removePatientInCustmListDto.patientIds = [];
    this.removePatientInCustmListDto.customListId = this.filterPatientDto.customListId;
    if(this.selectedCList.facilityUserId != this.securityService.securityObject.id){
      this.toaster.warning('You are not authorized to edit the list');
      this.isDeletingPatientFromCustomList = false;
    }else{
      this.selected.forEach((element) => {
        if(element?.patientId){
          this.removePatientInCustmListDto.patientIds.push(element.patientId);
        }else{
          this.removePatientInCustmListDto.patientIds.push(element.id);
        }
      });
      // this.removePatientInCustmListDto.patientIds = this.selected;
      this.customListService
        .RemovePatientsFromList(this.removePatientInCustmListDto)
        .subscribe(
          (res: any) => {
            this.deselectRows.emit();
            this.selectedCustomList.emit(this.filterPatientDto.customListId);
            this.toaster.success("Patients Removed Successfully");
            this.selected = []
            this.isDeletingPatientFromCustomList = false;
          },
          (err: HttpResError) => {
            this.toaster.error(err.error);
            this.isDeletingPatientFromCustomList = false;
          }
        );
    }
    }
    selectCustomListID(customList){
      const value = this.selectedCustomListIDs.find(cList => cList.id == customList.id);
      if(value){
        //splice
        value.selected = false;
        this.selectedCustomListIDs = this.selectedCustomListIDs.filter(cList => cList.id != customList.id);
      }else{
        customList.selected = true;
        this.selectedCustomListIDs.push(customList.id)
      }
    }
}
