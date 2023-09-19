import { BillingService } from 'src/app/core/billing.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AddEditCptChargesDto } from 'src/app/model/Accounts/accounts.model';
import { SubSink } from 'src/app/SubSink';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { CptCategoriesLookupDto, SubCategory } from 'src/app/model/Accounts/billing.model';

@Component({
  selector: 'app-cpt-configration',
  templateUrl: './cpt-configration.component.html',
  styleUrls: ['./cpt-configration.component.scss']
})
export class CptConfigrationComponent implements OnInit {
  @ViewChild("addCptModal") addCptModal: ModalDirective;
  addEditCptChargesDto = new AddEditCptChargesDto();
  cptCargesList = new Array<AddEditCptChargesDto>();
  private subs = new SubSink();
  isLoading: boolean;
  isLoadingLookup: boolean;
  cptCategoriesLookupData = new Array<CptCategoriesLookupDto>();
  selectedSubCategories: SubCategory[];
  constructor(
    private location: Location,
    private appUi: AppUiService,
    private billingService: BillingService,
    private toaster: ToastService,
  ) { }

  ngOnInit(): void {
  this.getDefaultCPTCharges();
  this.GetCptCategoriesLookup();
  }

  getDefaultCPTCharges() {
      this.isLoading = true;
      // this.patientsService.getPatientDetail(this.PatientId).subscribe(
      this.subs.sink = this.billingService.getDefaultCPTCharges().subscribe(
        (res: any) => {
          this.isLoading = false;
          this.cptCargesList = new Array<AddEditCptChargesDto>();
          if (res && res.length >= 0) {
            this.cptCargesList = res;
          }
        },
        (error: HttpResError) => {
          this.toaster.error(error.error);
          this.isLoading = false;
          // this.closeModal.emit();
        }
      );
  }
  GetCptCategoriesLookup() {
      this.isLoadingLookup = true;
      // this.patientsService.getPatientDetail(this.PatientId).subscribe(
      this.subs.sink = this.billingService.GetCptCategoriesLookup().subscribe(
        (res: CptCategoriesLookupDto[]) => {
          this.isLoadingLookup = false;
          this.cptCategoriesLookupData = res;

        },
        (error: HttpResError) => {
          this.toaster.error(error.error);
          this.isLoadingLookup = false;
          // this.closeModal.emit();
        }
      );
  }
  filterSubCategory(catShortName: string) {
    if (!catShortName) {

    }
    this.selectedSubCategories = this.cptCategoriesLookupData.find(x => x.catShortName === catShortName).subCategories;
  }
  openEditCptModal(row: AddEditCptChargesDto) {
    Object.assign(this.addEditCptChargesDto, row);
    if (this.cptCategoriesLookupData && this.cptCategoriesLookupData.length) {
      // this.addEditCptChargesDto.category = this.cptCategoriesLookupData[0].catShortName;
      if(!row.category){
        this.filterSubCategory(this.cptCategoriesLookupData[0].catShortName);
      } else{
        this.filterSubCategory(row.category);
      }
    } else {
      this.toaster.info('No categories found');
    }
  }

  addDefaultCPTCharges() {
    this.isLoading = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
    this.subs.sink = this.billingService.addDefaultCPTCharges(this.addEditCptChargesDto).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.addCptModal.hide();
        this.addEditCptChargesDto = new AddEditCptChargesDto();
       this.getDefaultCPTCharges();
      },
      (error: HttpResError) => {
        this.isLoading = false;
        this.toaster.error(error.error);
        // this.closeModal.emit();
      }
    );
}
// getDefaultCPTChargesById(id: number) {
//   // this.isLoading = true;
//   // this.patientsService.getPatientDetail(this.PatientId).subscribe(
//   this.subs.sink = this.billingService.getDefaultCPTChargesById(id).subscribe(
//     (res: any) => {
//       // this.isLoading = false;
//       // if (res && res.length >= 0) {
//         this.addEditCptChargesDto = res;
//       // }
//     },
//     (error: HttpResError) => {
//       this.toaster.error(error.error);
//       // this.closeModal.emit();
//     }
//   );
// }
editDefaultCPTCharge() {
  this.isLoading = true;
  // this.patientsService.getPatientDetail(this.PatientId).subscribe(
  this.subs.sink = this.billingService.editDefaultCPTCharge(this.addEditCptChargesDto).subscribe(
    (res: any) => {
      this.isLoading = false;
      this.addCptModal.hide();
        this.addEditCptChargesDto = new AddEditCptChargesDto();
        this.getDefaultCPTCharges();
        // this.cptCargesList = res;
    },
    (error: HttpResError) => {
      this.isLoading = false;
      this.toaster.error(error.error);
      // this.closeModal.emit();
    }
  );
}
deleteDefaultCPTCharge(id: number) {
  this.isLoading = true;
  // this.patientsService.getPatientDetail(this.PatientId).subscribe(
  this.subs.sink = this.billingService.deleteDefaultCPTCharge(id).subscribe(
    (res: any) => {
      this.isLoading = false;
      this.getDefaultCPTCharges();
      },
    (error: HttpResError) => {
      this.isLoading = false;
      this.toaster.error(error.error);
      // this.closeModal.emit();
    }
  );
}
reset() {
  this.addEditCptChargesDto = new AddEditCptChargesDto();
}
openConfirmModal(data: any) {
  const modalDto = new LazyModalDto();
  modalDto.Title = "Delete CPT Code";
  modalDto.Text = "Are you sure that you want to permanently delete CPT code.";
  modalDto.callBack = this.callBack;
  modalDto.data = data;
  this.appUi.openLazyConfrimModal(modalDto);
}
callBack = (data: any) => {
  this.deleteDefaultCPTCharge(data);
};
  goBack() {
    this.location.back();
  }

}
