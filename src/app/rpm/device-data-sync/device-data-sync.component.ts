import { Component, OnInit } from "@angular/core";
import { DeviceManagementService } from "src/app/core/device-management.service";
import { ToastService } from "ng-uikit-pro-standard";
// import { find } from "cfb/types";
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import * as moment from 'moment';

@Component({
  selector: "app-device-data-sync",
  templateUrl: "./device-data-sync.component.html",
  styleUrls: ["./device-data-sync.component.scss"]
})
export class DeviceDataSyncComponent implements OnInit {
  unRecordImgDto = new Array<UnRecordImageDto>();
  modalityId: number;
  index = 0;
  weightIn = "pound";
  tempWeightValue: number;
  firstIndexData = new UnRecordImageDto();
  // BpDataDto= new RecordBPDeviceReadingFromImageDto();
  // weightDataDto= new RecordWTDeviceReadingFromImageDto();
  recordImgData = new RecordDeviceReadingFromImageDto();
  // pulseDataDto = new RecordPODeviceReadingFromImageDto();
  // blooGlucosDataDto = new RecordBGDeviceReadingFromImageDto();
  // ActivityDataDto = new RecordATDeviceReadingFromImageDto();
  image = "";
  savingData: boolean;
  isLoadingImages: boolean;
  constructor(
    private deviceManagementService: DeviceManagementService,
    private toaster: ToastService,
    private appUi: AppUiService
  ) {}
  public scrollbarOptionsTimeline = {
    axis: "x",
    theme: "dark-3",
    scrollInertia: 2,
    scrollButtons: { enable: true },
    autoHideScrollbar: false,
    scrollbarPosition: "inside",

  };

  ngOnInit() {
    this.getUnRecordImage();
  }
  getUnRecordImage() {
    this.isLoadingImages = true;
    this.deviceManagementService.GetUnRecordedImg(0).subscribe((res: any) => {
      // res.dateCreated = res.dateCreated.slice(0,10);
      this.isLoadingImages = false;
      res.forEach(element => {
        element.dateCreated = moment.utc(element.dateCreated).local().format('D MMM YY,\\ h:mm a');
      });
      this.unRecordImgDto = res;
      this.SaveImageData();
    }, (err: HttpResError) => {
      this.isLoadingImages = false;
      this.toaster.error(err.error);
    });
  }
  GetModalityId(data: UnRecordImageDto, index: number) {
    // this.recordImgData = new RecordDeviceReadingFromImageDto();
    this.modalityId = data.modalityId;
    this.recordImgData.deviceReadingImageId = data.id;
    this.recordImgData.modalityId = data.modalityId;
    this.recordImgData.patientId = data.patientId;
    // this.recordImgData.info = data.info;
    this.image = data.publicImageUrl;
    this.index = index;
    this.recordImgData.dinnerSituation = '';
    if (this.unRecordImgDto[this.index].modalityCode === 'BG') {
      this.recordImgData.dinnerSituation = this.unRecordImgDto[this.index].info || '';
    }
  }
  // SaveDeviceData() {

  //   this.deviceManagementService.RecordDeviceReadingFromImage(this.recordImgData).subscribe(res => {
  //     this.toaster.success("Data Saved Successfully");
  //     this.unRecordImgDto = this.unRecordImgDto.filter(d => d.id !== this.recordImgData.deviceReadingImageId);
  //     // this.recordImgData = new RecordDeviceReadingFromImageDto();

  //     // this.unRecordImgDto[this.index + 1];
  //     this.SaveImageData();
  //     // this.modalityId = 0;
  //   }, error => {
  //     this.toaster.error('Data not save');
  //   });
  // }
  saveBPDataFromImage() {
    this.savingData = true;
    this.deviceManagementService
      .RecordBPDeviceReadingFromImage(this.recordImgData)
      .subscribe(
        res => {
          this.savingData = false;
          this.toaster.success("Data Saved Successfully");
          this.unRecordImgDto = this.unRecordImgDto.filter(
            d => d.id !== this.recordImgData.deviceReadingImageId
          );
          this.recordImgData = new RecordDeviceReadingFromImageDto();

          // this.unRecordImgDto[this.index + 1];
          this.SaveImageData();
          // this.modalityId = 0;
        },
        error => {
          this.savingData = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  saveWeightDataFromImage() {
      if (this.weightIn === "pound") {
        this.tempWeightValue = this.recordImgData.weightValue;
        let wValue = this.recordImgData.weightValue / 2.204623;
        wValue = +wValue.toFixed();
        this.recordImgData.weightValue = wValue;
      }
      this.savingData = true;
    this.deviceManagementService
      .RecordWTDeviceReadingFromImage(this.recordImgData)
      .subscribe(
        res => {
          this.savingData = false;
          this.toaster.success("Data Saved Successfully");
          this.unRecordImgDto = this.unRecordImgDto.filter(
            d => d.id !== this.recordImgData.deviceReadingImageId
          );
          this.recordImgData = new RecordDeviceReadingFromImageDto();

          // this.unRecordImgDto[this.index + 1];
          this.SaveImageData();
          // this.modalityId = 0;
        },
        error => {
          this.savingData = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  savePulseDataFromImage() {
    this.savingData = true;
    this.deviceManagementService
      .RecordPODeviceReadingFromImage(this.recordImgData)
      .subscribe(
        res => {
          this.savingData = false;
          this.toaster.success("Data Saved Successfully");
          this.unRecordImgDto = this.unRecordImgDto.filter(
            d => d.id !== this.recordImgData.deviceReadingImageId
          );
          this.recordImgData = new RecordDeviceReadingFromImageDto();

          // this.unRecordImgDto[this.index + 1];
          this.SaveImageData();
          // this.modalityId = 0;
        },
        error => {
          this.savingData = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  saveBloodGlucosFromImage() {
    this.savingData = true;
    this.deviceManagementService
      .RecordBGDeviceReadingFromImage(this.recordImgData)
      .subscribe(
        res => {
          this.savingData = false;
          this.toaster.success("Data Saved Successfully");
          this.unRecordImgDto = this.unRecordImgDto.filter(
            d => d.id !== this.recordImgData.deviceReadingImageId
          );
          this.recordImgData = new RecordDeviceReadingFromImageDto();

          // this.unRecordImgDto[this.index + 1];
          this.SaveImageData();
          // this.modalityId = 0;
        },
        error => {
          this.savingData = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  saveActivityFromImage() {
    this.savingData = true;
    this.deviceManagementService
      .RecordATDeviceReadingFromImage(this.recordImgData)
      .subscribe(
        res => {
          this.savingData = false;
          this.toaster.success("Data Saved Successfully");
          this.unRecordImgDto = this.unRecordImgDto.filter(
            d => d.id !== this.recordImgData.deviceReadingImageId
          );
          this.recordImgData = new RecordDeviceReadingFromImageDto();

          // this.unRecordImgDto[this.index + 1];
          this.SaveImageData();
          // this.modalityId = 0;
        },
        error => {
          this.savingData = false;
          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  SaveImageData() {
    if (this.index >= 0 && this.unRecordImgDto.length !== this.index) {
      this.modalityId = this.unRecordImgDto[this.index].modalityId;
      this.recordImgData.deviceReadingImageId = this.unRecordImgDto[
        this.index
      ].id;
      this.recordImgData.modalityId = this.unRecordImgDto[
        this.index
      ].modalityId;
      this.recordImgData.patientId = this.unRecordImgDto[this.index].patientId;
      // this.recordImgData.info = this.unRecordImgDto[this.index].info;
      this.image = this.unRecordImgDto[this.index].publicImageUrl;
    } else {
      if (!this.unRecordImgDto.length) {
        return;
      }
      this.index = this.index - 1;
      this.modalityId = this.unRecordImgDto[this.index].modalityId;
      this.recordImgData.deviceReadingImageId = this.unRecordImgDto[
        this.index
      ].id;
      this.recordImgData.modalityId = this.unRecordImgDto[
        this.index
      ].modalityId;
      this.recordImgData.patientId = this.unRecordImgDto[this.index].patientId;
      // this.recordImgData.info = this.unRecordImgDto[this.index].info;
      this.image = this.unRecordImgDto[this.index].publicImageUrl;
    }
    this.recordImgData.dinnerSituation = '';
    if (this.unRecordImgDto[this.index].modalityCode === 'BG') {
      this.recordImgData.dinnerSituation = this.unRecordImgDto[this.index].info || '';
    }
  }
  // weightConvertPoundTokg() {
  //   if (this.recordImgData.weightValue) {
  //     if (this.weightIn === "pound") {
  //       this.tempWeightValue = this.recordImgData.weightValue;
  //       this.recordImgData.weightValue =
  //         this.recordImgData.weightValue / 2.204623;
  //     } else if ( this.tempWeightValue === this.recordImgData.weightValue ) {
  //       // this.recordImgData.weightValue = this.tempWeightValue;
  //       return;
  //     } else if (this.weightIn === "kg") {
  //       this.recordImgData.weightValue = this.tempWeightValue;
  //     }
  //   }
  // }
  deleteUnRecordedImg(imgId: number) {
     const deleteImg = new DeleteRecordedImageDto();
      deleteImg.deviceReadingImageId = imgId;
    this.deviceManagementService.DeleteRecordedImage(deleteImg).subscribe(
      res => {
        this.toaster.success("Delete Image Successfully");
        this.getUnRecordImage();
      },
      error => {
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Delete Image';
    modalDto.Text = 'Do you want to delete this image ?';
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.deleteUnRecordedImg(data);
  }
}
export class UnRecordImageDto {
  index: number;
  id = 0;
  dateCreated: string;
  imageUrl: string;
  publicImageUrl: string;
  info: string;
  patientId = 0;
  modalityId: number;
  modalityCode: string;
}
export class DeleteRecordedImageDto {
         deviceReadingImageId = 0;
       }
export class RecordDeviceReadingFromImageDto {
  deviceReadingImageId = 0;
  modalityId: number;
  patientId: number;
  lowPressure: number;
  highPressure: number;
  heartRate: number;
  weightValue: number;
  bloodOxygen: number;
  bg: number;
  dinnerSituation = "";
  calories: number;
  distanceTraveled: number;
  steps: number;
}
// export class RecordBPDeviceReadingFromImageDto {
//   deviceReadingImageId= 0;
//   modalityId: number;
//   patientId: number;
//   lowPressure: number;
//   highPressure: number;
//   heartRate: number;
// }
// export class RecordWTDeviceReadingFromImageDto {
//   deviceReadingImageId= 0;
//   modalityId: number;
//   patientId: number;
//   weightValue: number;
// }
// export class RecordPODeviceReadingFromImageDto {
//   deviceReadingImageId= 0;
//   modalityId:number;
//   patientId:number;
//   bloodOxygen:number;
//   heartRate:number;
// }
// export class RecordBGDeviceReadingFromImageDto {
//   deviceReadingImageId= 0;
//   modalityId:number;
//   patientId:number;
//   bg:number;
//   dinnerSituation: '';
// }
// export class RecordATDeviceReadingFromImageDto{
//   deviceReadingImageId= 0;
//   modalityId:number;
//   patientId:number;
//   calories:number;
//   distanceTraveled:number;
//   steps: number;
// }
