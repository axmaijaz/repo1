import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  SimpleChanges,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProviderDto, Speciality } from 'src/app/model/Provider/provider.model';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { SubSink } from 'src/app/SubSink';

@Component({
  selector: "app-add-provider",
  templateUrl: "./add-provider.component.html",
  styleUrls: ["./add-provider.component.scss"]
})
export class AddProviderComponent implements OnInit, OnChanges, OnDestroy {
  private subs = new SubSink();
  @Output() public closeModal = new EventEmitter();
  @Input() public editProviderID: number;
  providerForm: FormGroup;
  provider = new ProviderDto();
  editProvider = new ProviderDto();
  editProviderCheck = 0;
  specialities = new Array<Speciality>();
  constructor(
    private fb: FormBuilder,
    private patientService: PatientsService,
    private toaster: ToastService
  ) {}

  ngOnInit() {
    this.providerForm = this.fb.group({
      practiceId: [""],
      firstName: ["", [Validators.required]],
      lastName: [""],
      nickname: [""],
      middleName: [""],
      addressLine1: [""],
      addressLine2: [""],
      email: ["", [Validators.email]],
      city: [""],
      state: [""],
      zip: [""],
      phone: [""],
      mobilePhone: [""],
      speciality: [null],
      nationalProviderId: [""],
      otherLicenseId: [""],
      otherLicenseDescription: [""],
      stateLicenseNumber: [""],
      degree: [""],
      deaNumber: [""],
      description: [""],
      ssn: [""],
      note: [""],
      salutoryName: [""],
      hospitalAffiliations: [""]
    });
    this.subs.sink = this.patientService.getProviderSpecialities().subscribe(
      (res: any) => {
        if (res) {
          this.specialities = res;
          // this.toaster.success('Provider Added Successfully');
          Object.assign(this.providerForm.value, res);
        }
      },
      err => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.editProviderID &&
      this.editProviderID > 0 &&
      this.editProviderCheck !== this.editProviderID
    ) {
      this.editProviderCheck = this.editProviderID;
      this.getEditProvider(this.editProviderID);
    }
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
  getEditProvider(id: number) {
    this.subs.sink = this.patientService.getProviderById(id).subscribe(
      (res: any) => {
        if (res) {
          this.provider = res;
          this.providerForm.reset();
          // this.toaster.success('Provider Added Successfully');
          this.providerForm.patchValue(res);
          // Object.assign(this.providerForm.value, res);
        }
      },
      err => {
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }
  updateProvider() {
    if (this.provider && this.provider.id > 0) {
      Object.assign(this.provider, this.providerForm.value);
      this.subs.sink = this.patientService
        .editProvider(this.provider)
        .subscribe(
          (res: any) => {
            this.closeModal.emit();
            if (res) {
              this.provider = res;
              this.providerForm.reset();
              // this.toaster.success('Provider Added Successfully');
              this.providerForm.patchValue(res);
              this.toaster.success("Provider Updated Successfully");
            }
          },
          err => {
            this.provider = new ProviderDto();
            this.toaster.error(err.message, err.error || err.error);
          }
        );
    }
  }
  addProvider() {
    if (this.provider && this.provider.id === 0) {
      Object.assign(this.provider, this.providerForm.value);
      this.subs.sink = this.patientService.addProvider(this.provider).subscribe(
        (res: any) => {
          this.closeModal.emit();
          if (res) {
            this.provider = new ProviderDto();
            this.providerForm.reset();
            this.toaster.success("Provider Added Successfully");
          }
        },
        err => {
          this.provider = new ProviderDto();
          this.toaster.error(err.message, err.error || err.error);
        }
      );
    } else if (this.provider && this.provider.id > 0) {
      this.updateProvider();
    }
  }
  modalClose() {
    this.closeModal.emit();
  }
}
