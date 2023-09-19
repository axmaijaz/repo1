import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { AppUiService } from 'src/app/core/app-ui.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { PriorAuthService } from 'src/app/core/PriorAuth/prior-auth.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { CreateFacilityUserDto } from 'src/app/model/Facility/facility.model';
import { PaCaseStep, PACaseType } from 'src/app/model/PriorAuth/prioAuth.model';
import { SubSink } from 'src/app/SubSink';
import { PcmService } from 'src/app/core/pcm/pcm.service';
import { Location } from '@angular/common';
import moment from 'moment';
import { modalConfigDefaults } from 'ng-uikit-pro-standard/lib/free/modals/modal.options';

@Component({
  selector: 'app-manage-cases',
  templateUrl: './manage-cases.component.html',
  styleUrls: ['./manage-cases.component.scss']
})
export class ManageCasesComponent implements OnInit {
  isLoading: boolean;
  rows = [];
  private subs = new SubSink();
  facilityId: number;
  caseTypesLIst: PACaseType[];
  selectedCaseType = new PACaseType();
  newStepText: string;
  editingCaseType: boolean;
  addigCasestep: boolean;
  constructor(private toaster: ToastService, private priorAuthService: PriorAuthService, private pcmService: PcmService, private location: Location,
    private appUi: AppUiService, private facilityService: FacilityService, private securityService: SecurityService) { }

  ngOnInit() {
    this.facilityId = +this.securityService.getClaim('FacilityId').claimValue;
    this.GetCaseTypesList();
  }
  goBack() {
    this.location.back();
  }
  GetCaseTypesList() {
    this.isLoading = true;
    this.subs.sink = this.priorAuthService.PACaseTypes(this.facilityId).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.caseTypesLIst = res;
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openConfirmModal(data: any, type: number) {
    const modalDto = new LazyModalDto();
    modalDto.Title = type === 1 ? 'Delete case type' : 'Delete case step';
    modalDto.Text = 'Are you sure that you want to permanently delete this item ?';
    modalDto.callBack = type === 1 ? this.DeleteCaseType : this.DeleteCaseStep;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  DeleteCaseType = (id: number) => {
    this.isLoading = true;
    this.subs.sink = this.priorAuthService.DeletePACaseTypes(id).subscribe(
      (res: any) => {
        this.caseTypesLIst = this.caseTypesLIst.filter(x => x.id !== id);
        this.toaster.success('Case Type Deleted Successfully');
        this.isLoading = false;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  DeleteCaseStep = (id: number) => {
    this.isLoading = true;
    this.subs.sink = this.priorAuthService.DeletePACaseSteps(id).subscribe(
      (res: any) => {
        this.selectedCaseType.paCaseSteps = this.selectedCaseType.paCaseSteps.filter(x => x.id !== id);
        this.toaster.success('Case Step Deleted Successfully');
        this.isLoading = false;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
        this.isLoading = false;
      }
    );
  }
  AddNewCaseType(modal: ModalDirective) {
    this.selectedCaseType = new PACaseType();
    this.selectedCaseType.facilityId = this.facilityId;
    modal.show();
  }
  AddCaseStep = () => {
    const data = new PaCaseStep();
    data.paCaseTypeId = this.selectedCaseType.id;
    data.title = this.newStepText;
    this.addigCasestep = true;
    this.subs.sink = this.priorAuthService.AddPACaseSteps(data).subscribe(
      (res: any) => {
        this.newStepText = '';
        this.addigCasestep = false;
        // this.GetCaseTypesList();
        this.selectedCaseType.paCaseSteps.push(res);
        this.toaster.success('Case Step added Successfully');
      },
      (error: HttpResError) => {
        this.addigCasestep = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AddCaseType = (modal: ModalDirective) => {
    this.editingCaseType = true;
    this.subs.sink = this.priorAuthService.AddPACaseTypes(this.selectedCaseType).subscribe(
      (res: any) => {
        this.editingCaseType = false;
        this.GetCaseTypesList();
        modal.hide();
        this.toaster.success('Case type added Successfully');
      },
      (error: HttpResError) => {
        this.editingCaseType = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  EditCaseType = (modal: ModalDirective) => {
    this.editingCaseType = false;
    this.subs.sink = this.priorAuthService.EditPACaseTypes(this.selectedCaseType).subscribe(
      (res: any) => {
        this.editingCaseType = false;
        this.GetCaseTypesList();
        modal.hide();
        this.toaster.success('Case type edit Successfully');
      },
      (error: HttpResError) => {
        this.editingCaseType = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
}
