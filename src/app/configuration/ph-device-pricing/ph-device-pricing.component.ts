import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { PhdevicePricingService } from 'src/app/core/rpm/phdevice-pricing.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { EditPHDevicePricingDto, EditTransmissionChargesDto, PHDevicePricingListDto, TransmissionChargesDto } from 'src/app/model/rpm/phdevice-pricing.model';

@Component({
  selector: 'app-ph-device-pricing',
  templateUrl: './ph-device-pricing.component.html',
  styleUrls: ['./ph-device-pricing.component.scss']
})
export class PhDevicePricingComponent implements OnInit {
  phDevicesPricingList: PHDevicePricingListDto[];
  editPHDevicePricingObj = new EditPHDevicePricingDto();
  transmissionCHargesObj = new TransmissionChargesDto();
  editTransmissionChargesObj = new EditTransmissionChargesDto();
  gettignPricing: boolean;
  savingPricing: boolean;
  facilityId: number;
  savingCharges: boolean;
  gettignCharges: boolean;

  constructor(private PHDPricing: PhdevicePricingService, private toaster: ToastService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.facilityId = +this.route.snapshot.paramMap.get("facilityId");
    if (this.facilityId) {
      this.GetPricingsByFacilityId();
      this.GetTransmissionChargesByFacilityId();
    } else {
      this.GetDefaultPricings();
      this.GetDefaultTransmissionCharges();
    }
  }

  GetDefaultPricings() {
    this.gettignPricing = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
      this.PHDPricing.GetDefaultPricings().subscribe(
        (res: PHDevicePricingListDto[]) => {
        this.gettignPricing = false;
        this.phDevicesPricingList = res.sort((x, y) => x.modality.localeCompare(y.modality));;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error || error.error);
        this.gettignPricing = false;
        // this.closeModal.emit();
      }
    );
  }
  GetPricingsByFacilityId() {
    this.gettignPricing = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
      this.PHDPricing.GetPricingsByFacilityId(this.facilityId).subscribe(
        (res: PHDevicePricingListDto[]) => {
        this.gettignPricing = false;
        this.phDevicesPricingList = res.sort((x, y) => x.modality.localeCompare(y.modality));
      },
      (error: HttpResError) => {
        this.toaster.error(error.error || error.error);
        this.gettignPricing = false;
        // this.closeModal.emit();
      }
    );
  }
  OpenEditModal(row: PHDevicePricingListDto, modal: ModalDirective) {
    this.editPHDevicePricingObj.id = row.id;
    this.editPHDevicePricingObj.installmentsCount = row.installmentsCount;
    this.editPHDevicePricingObj.price = row.price;
    this.editPHDevicePricingObj.leasePrice = row.leasePrice;
    modal.show();
    // this.editPHDevicePricingObj.transmissionCharges = row.transmissionCharges;
  }
  EditDefaultPHPricing(modal: ModalDirective) {
    this.savingPricing = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
      this.PHDPricing.EditDefaultPhDevicePricing(this.editPHDevicePricingObj).subscribe(
        (res: PHDevicePricingListDto[]) => {
          this.GetDefaultPricings();
        this.savingPricing = false;
        modal.hide();
      },
      (error: HttpResError) => {
        this.toaster.error(error.error || error.error);
        this.savingPricing = false;
        // this.closeModal.emit();
      }
    );
  }
  EditPHPricing(modal: ModalDirective) {
    this.savingPricing = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
      this.PHDPricing.EditPhDevicePricing(this.editPHDevicePricingObj).subscribe(
        (res: PHDevicePricingListDto[]) => {
          this.GetPricingsByFacilityId();
        this.savingPricing = false;
        modal.hide();
      },
      (error: HttpResError) => {
        this.toaster.error(error.error || error.error);
        this.savingPricing = false;
        // this.closeModal.emit();
      }
    );
  }
  GetDefaultTransmissionCharges() {
    this.gettignCharges = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
      this.PHDPricing.GetDefaultTransmissionCharges().subscribe(
        (res: TransmissionChargesDto) => {
        this.gettignCharges = false;
        this.transmissionCHargesObj = res;
        this.editTransmissionChargesObj.id = this.transmissionCHargesObj.id;
        this.editTransmissionChargesObj.transmissionCharges = this.transmissionCHargesObj.transmissionCharges;
        this.editTransmissionChargesObj.reactivationCharges = this.transmissionCHargesObj.reactivationCharges;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error || error.error);
        this.gettignCharges = false;
        // this.closeModal.emit();
      }
    );
  }
  GetTransmissionChargesByFacilityId() {
    this.gettignCharges = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
      this.PHDPricing.GetTransmissionChargesByFacilityId(this.facilityId).subscribe(
        (res: TransmissionChargesDto) => {
        this.gettignCharges = false;
        this.transmissionCHargesObj = res;
        this.editTransmissionChargesObj.id = this.transmissionCHargesObj.id;
        this.editTransmissionChargesObj.transmissionCharges = this.transmissionCHargesObj.transmissionCharges;
        this.editTransmissionChargesObj.reactivationCharges = this.transmissionCHargesObj.reactivationCharges;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error || error.error);
        this.gettignCharges = false;
        // this.closeModal.emit();
      }
    );
  }
  EditDefaultServiceSubscription() {
    this.savingCharges = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
      this.PHDPricing.EditDefaultTransmissionCharges(this.editTransmissionChargesObj).subscribe(
        (res: TransmissionChargesDto) => {
          this.GetDefaultTransmissionCharges();
        this.savingCharges = false;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error || error.error);
        this.savingCharges = false;
        // this.closeModal.emit();
      }
    );
  }
  EditServiceSubscription() {
    this.savingCharges = true;
    // this.patientsService.getPatientDetail(this.PatientId).subscribe(
      this.editTransmissionChargesObj.facilityId = this.facilityId;
      this.PHDPricing.EditTransmissionCharges(this.editTransmissionChargesObj).subscribe(
        (res: TransmissionChargesDto) => {
          this.GetTransmissionChargesByFacilityId();
        this.savingCharges = false;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error || error.error);
        this.savingCharges = false;
        // this.closeModal.emit();
      }
    );
  }
}
