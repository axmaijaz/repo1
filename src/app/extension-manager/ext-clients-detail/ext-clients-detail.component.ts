import { AppUiService } from 'src/app/core/app-ui.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Emr, ExtClient } from '../extensionManager.model';
import { SubSink } from 'src/app/SubSink';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { ManageExtensionService } from 'src/app/core/manage-extension.service';
import { Location } from '@angular/common';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-ext-clients-detail',
  templateUrl: './ext-clients-detail.component.html',
  styleUrls: ['./ext-clients-detail.component.scss']
})
export class ExtClientsDetailComponent implements OnInit, OnDestroy {
  addEditExtDto = new ExtClient();
  private subs = new SubSink();
  isLoadingExtensionClients: boolean;
  clientsList: ExtClient[];
  isSavingExtensionClient: boolean;
  isDeletingExtensionClients: boolean;
  getAll = false;
  addEditEmrDto = new Emr();
  emrList= new Array<Emr>();
  isSavingEmr: boolean;

  constructor(private toaster: ToastService, private extService: ManageExtensionService, private location: Location, private appUi: AppUiService) { }

  ngOnInit(): void {
    this.GetExtensionUrls();
    this.GetEmrList();
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
  GetExtensionUrls() {
    this.isLoadingExtensionClients = true;
    this.subs.sink = this.extService.GetAllExtClients(this.getAll).subscribe(
      (res: ExtClient[]) => {
        this.isLoadingExtensionClients = false;
        this.clientsList = res;
      },
      (error: HttpResError) => {
        this.isLoadingExtensionClients = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetEmrList(){
    this.extService.GetEmrList().subscribe((res: any) => {
      this.emrList = res;
    }, (err: HttpErrorResponse) => {
      this.toaster.error(err.error);
    })
  }
  AddEditEmrList(modal: ModalDirective){
    this.isSavingEmr = true;
    this.extService.AddEditEmrList(this.addEditEmrDto).subscribe((res: any) => {
      this.toaster.success('Emr Updated Successfully');
      this.GetEmrList();
      this.isSavingEmr = false;
      modal.hide();
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
      this.isSavingEmr = false;
    })
  }
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Delete Extension CLient";
    modalDto.Text = "Are you sure that you want to delete Extension CLient.";
    modalDto.callBack = this.DeleteExtClient;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  DeleteExtClient = (data: ExtClient) => {
    data['isDeletingExtensionClients'] = true;
    this.subs.sink = this.extService.DeleteExtClient(data.id).subscribe(
      (res: ExtClient[]) => {
        data['isDeletingExtensionClients'] = false;
        this.GetExtensionUrls();
      },
      (error: HttpResError) => {
        data['isDeletingExtensionClients'] = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  goBack() {
    this.location.back();
  }
  AddEditExtClient(modal: ModalDirective) {
    if (!this.addEditExtDto.id) {
      this.addEditExtDto.id = 0;
    }
    this.isSavingExtensionClient = true;
    this.subs.sink = this.extService.AddEditExtClient(this.addEditExtDto).subscribe(
      (res: any) => {
        this.isSavingExtensionClient = false;
        // this.clientsList = res;
        modal.hide();
        this.GetExtensionUrls();
        this.toaster.success('Data saved successfully');
      },
      (error: HttpResError) => {
        this.isSavingExtensionClient = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openEditClientModel(row: ExtClient, modal: ModalDirective) {
    this.addEditExtDto = row;
    modal.show();
  }
  openEditEmrModel(row: Emr, modal: ModalDirective) {
    this.addEditEmrDto = row;
    modal.show();
  }clearEmrModalData(){
    this.addEditEmrDto = new Emr();
  }

  IntigrationFieldChanged() {
    if (!this.addEditEmrDto?.isIntegrated) {
      this.addEditEmrDto.claimSubmission = false;
      this.addEditEmrDto.clinicalDocumentSubmission = false;
      this.addEditEmrDto.canSetCcmEnrollmentStatus = false;
    }
  }
}
