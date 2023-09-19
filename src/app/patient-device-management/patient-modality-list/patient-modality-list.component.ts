import { RpmService } from 'src/app/core/rpm.service';
import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { ToastService, ModalDirective } from 'ng-uikit-pro-standard';
import { SecurityService } from 'src/app/core/security/security.service';
import { DeviceManagementService } from 'src/app/core/device-management.service';
import { ActivatedRoute } from '@angular/router';
import * as RTCMultiConnection from 'rtcmulticonnection';
import { AppUiService } from 'src/app/core/app-ui.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { UserType } from 'src/app/Enums/UserType.enum';
import { AwsService } from 'src/app/core/aws/aws.service';
import * as moment from 'moment';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { Threshold, ModalityDto } from 'src/app/model/rpm.model';
import { RecordDeviceReadingFromImageDto } from 'src/app/rpm/device-data-sync/device-data-sync.component';
@Component({
  selector: 'app-patient-modality-list',
  templateUrl: './patient-modality-list.component.html',
  styleUrls: ['./patient-modality-list.component.scss']
})
export class PatientModalityListComponent implements OnInit, OnDestroy {
  @ViewChild('cameraPLayer') videoPlayer: ElementRef;
  @ViewChild('imgCanvas') imgCanvas: ElementRef;
  @ViewChild('output1') iosImage: ElementRef;
  @ViewChild('imageCaptureMOdal') imageCaptureMOdal: ModalDirective;
  @ViewChild('IosImageModal') IosImageModal: ModalDirective;
  modalityList = new Array<{ id: number; name: string; code: string }>();
  myStreamObj: MediaStream;
  connection = new RTCMultiConnection(null, {
    useDefaultDevices: true
  });
  currentImage: any;
  displayImage: any;
  PatientId: number;
  ModalityId: number;
  uploadModalityInfo: string;
  weightIn = "pound";
  tempWeightValue: number;
  savingData: boolean;

  isLoading: boolean;
  recordImgData = new RecordDeviceReadingFromImageDto();
  isUpLoading: boolean;
  selectedModalityDto = new ModalityDto();
  myNav: any;
  threshold = new Threshold();
  public datePickerConfig2: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'MM-DD-YYYY',
  };

  constructor(private toaster: ToastService, private awsService: AwsService,  private appUi: AppUiService,
     private securityService: SecurityService, private route: ActivatedRoute,
      private deviceservice: DeviceManagementService, private rpmService: RpmService) { }

  ngOnInit() {
    if (this.securityService.securityObject && (this.securityService.securityObject.isAuthenticated && this.securityService.securityObject.userType === UserType.Patient)) {
      this.PatientId = this.securityService.securityObject.id;
    }
    // const PatientIde = +this.route.snapshot.paramMap.get('patientId');
    // const pMod = +this.route.snapshot.queryParams['modalityId'];
    // if (PatientIde && pMod) {
    //   this.PatientId = PatientIde;
    //   this.ModalityId = pMod;
    //   this.getALLUserMedia({id: pMod});
    // }
    this.GetModalitiesByPatientId();

  }
  ngOnDestroy(): void {
    this.destroyAllStreams();
  }
  destroyAllStreams( ) {
    if (this.videoPlayer.nativeElement.srcObject) {
      this.videoPlayer.nativeElement.srcObject.getVideoTracks().forEach((track) => {
        track.stop();
      });
      this.myStreamObj = null;
    }
  }
  GetModalitiesByPatientId() {
    this.isLoading = true;
    this.deviceservice.GetModalitiesByPatientId(this.PatientId)
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.modalityList = res;
        },
        err => {
          this.isLoading = false;
          // console.error('error');
        }
      );
  }
  getALLUserMedia(item: any, index: number) {
    const nav = navigator as any;
    if (this.appUi.iOS && this.appUi.isInStandaloneMode) {
      document.getElementById(`file-input${index}`).click();
      return;
    }
    if (this.myStreamObj) {
      this.openCameraModal(this.myStreamObj, item);
    } else {
      this.connection.getUserMedia((data: any) => {
      }, {video: { facingMode: 'environment', width: 600, height: 600  }, audio: false});
      this.connection.onstream = (data: any) => {
        this.myStreamObj = data.stream;
        this.openCameraModal(data.stream, item);
      };
    }
  }
  CheckMinMaxvalue() {
    if (
      this.recordImgData.lowPressure < 50 ||
      this.recordImgData.lowPressure > 300
    ) {
      this.recordImgData.lowPressure = null;
    }
    if (
      this.recordImgData.highPressure < 30 ||
      this.recordImgData.highPressure > 150
    ) {
      this.recordImgData.highPressure = null;
    }
    if (
      this.recordImgData.heartRate < 20 ||
      this.recordImgData.heartRate > 200
    ) {
      this.recordImgData.heartRate = null;
    }
    if (
      this.recordImgData.weightValue < 50 ||
      this.recordImgData.weightValue > 700
    ) {
      this.recordImgData.weightValue = null;
    }
    if (
      this.recordImgData.bloodOxygen < 60 ||
      this.recordImgData.bloodOxygen > 100
    ) {
      this.recordImgData.bloodOxygen = null;
    }
    if (
      this.recordImgData.bg < 20 ||
      this.recordImgData.bg > 600
    ) {
      this.recordImgData.bg = null;
    }

    // if (
    //   this.recordImgData.calories < 50 ||
    //   this.recordImgData.calories > 300
    // ) {
    //   this.threshold.activity.maxSteps = null;
    // }
    // if (
    //   this.recordImgData.distanceTraveled < 50 ||
    //   this.recordImgData.distanceTraveled > 300
    // ) {
    //   this.threshold.activity.maxSteps = null;
    // }
    // if (
    //   this.recordImgData.steps < 50 ||
    //   this.recordImgData.steps > 300
    // ) {
    //   this.threshold.activity.maxSteps = null;
    // }
  }
  selectedmodality(item: ModalityDto) {

    this.selectedModalityDto = item;
    // this.modalityId = data.modalityId;
    this.recordImgData.deviceReadingImageId = 0;
    this.recordImgData.modalityId = item.id;
    this.recordImgData.patientId = this.PatientId;
  }
  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'PWA Warning';
    modalDto.Text = 'You are running app as PWA in Ios.\n Do you want to open app in browser ?';
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.deviceservice.NavigateToMOdality(data.id, this.PatientId);
  }
  openCameraModal(stream: MediaStream, item: any) {
    this.currentImage = '';
    this.imgCanvas.nativeElement.style.display = 'none';
    this.videoPlayer.nativeElement.style.display = 'block';
    this.ModalityId = item.id;

    this.imageCaptureMOdal.show();
      this.videoPlayer.nativeElement.streamId = stream.id;
      this.videoPlayer.nativeElement.srcObject = stream;
      // this.videoPlayer.src = window.URL.createObjectURL(stream);
      this.videoPlayer.nativeElement.play();
  }
  // openDefCamera(item: any) {
  //   this.myNav = navigator as any;
  //   // this.myNav.getUserMedia  = this.myNav.getUserMedia || this.myNav.webkitGetUserMedia || this.myNav.mozGetUserMedia || this.myNav.msGetUserMedia;
  //   // const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  //   // const isInStandaloneMode = () => (window.matchMedia('(display-mode: standalone)').matches) || (this.myNav.standalone) || document.referrer.includes('android-app://');
  //   // if (iOS && isInStandaloneMode) {
  //   //   const newWindow = window.open('', '_blank');
  //   //   newWindow.location.href = 'url';
  //   //   return;
  //   // }
  //   this.myNav.getUserMedia = this.connection.getUserMedia;
  //   this.currentImage = '';
  //   this.imgCanvas.nativeElement.style.display = 'none';
  //   this.videoPlayer.nativeElement.style.display = 'block';
  //   this.ModalityId = item.id;
  //   // navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
  //   this.myNav.getUserMedia({video: { facingMode: 'environment'}}, (stream: MediaStream) => {
  //     this.toaster.success('stream found');
  //     this.imageCaptureMOdal.show();
  //     this.videoPlayer.nativeElement.streamId = stream.id;
  //     this.videoPlayer.nativeElement.srcObject = stream;
  //     // this.videoPlayer.src = window.URL.createObjectURL(stream);
  //     this.videoPlayer.nativeElement.play();
  //   }, (err: any) => {
  //     this.toaster.error(err);
  //   });
  // }
  capturePhoto() {
    this.imgCanvas.nativeElement.style.display = 'block';
    this.videoPlayer.nativeElement.style.display = 'none';
    const context = this.imgCanvas.nativeElement.getContext('2d');
    context.drawImage(this.videoPlayer.nativeElement, 0 , 0, this.videoPlayer.nativeElement.videoWidth / 2 + 20, this.videoPlayer.nativeElement.videoHeight / 2 + 20);
    this.currentImage = this.imgCanvas.nativeElement.toDataURL('image/jpeg');
  }
  uploadImage(path: string) {
    this.isUpLoading = true;
    if (this.currentImage.includes('data:image/jpeg;base64,')) {
      this.currentImage = this.currentImage.replace('data:image/jpeg;base64,', '');
    }
    this.deviceservice.SendFile(path, this.PatientId, this.ModalityId, this.uploadModalityInfo)
      .subscribe(
        x => {
          this.imageCaptureMOdal.hide();
          this.isUpLoading = false;
          this.toaster.success('Image Uploaded Successfully');
          this.ModalityId = 0;
          this.currentImage = '';
          this.uploadModalityInfo = '';
        },
        err => {
          this.isUpLoading = false;
          this.toaster.error('Error while uploading image.');
        }
      );
  }
  async uploadImageToS3() {
    this.isUpLoading = true;
    const file = await this.urltoFile(this.currentImage, 'name.jpeg');
    const path = `DeviceImages/Patient-${this.PatientId}/${moment().utc().format('YYYY-MM-DD-hh:mm-A')}.jpeg`;
    this.awsService.uploadUsingSdk(file, path).then(
      (data) => {
        this.uploadImage(path);
      },
      (err) => {
        this.toaster.error('Error while uploading image.');
      }
    );
  }

  urltoFile(url, filename) {
    return (fetch(url)
        .then(function(res) {return res.arrayBuffer(); })
        .then(function(buf) {return new File([buf], filename); })
    );
  }
  dataChanged(file: any, modalityId: number) {
    const reader = new FileReader();
    this.ModalityId = modalityId;
    const output = document.getElementById('output1') as any;
    let mfile = null;
    reader.readAsDataURL(file[0]);
    reader.onloadend = () => {
      this.currentImage = reader.result;
    };
    if (file[0].type.match(/^image\//)) {
        mfile = file[0];
    }
    if (file !== null) {
      output.src = URL.createObjectURL(mfile);
    }
    this.imgCanvas.nativeElement.style.display = 'none';
    this.videoPlayer.nativeElement.style.display = 'none';
    this.iosImage.nativeElement.style.display = 'block';
    // const context = this.imgCanvas.nativeElement.getContext('2d');
    // context.drawImage(this.iosImage.nativeElement, 0 , 0);
    // this.currentImage = this.imgCanvas.nativeElement.toDataURL('image/jpeg');
    // this.IosImageModal.show();
    this.imageCaptureMOdal.show();
  }
  uploadIosImage() {

  }
  RecordBPDeviceReading(manualEntry: ModalDirective) {
    // this.isLoading = true;
    this.savingData = true;
    this.rpmService.RecordBPDeviceReading(this.recordImgData)
      .subscribe(
        (res: any) => {
          this.toaster.success("Data Saved Successfully");
          this.recordImgData = new RecordDeviceReadingFromImageDto();
          manualEntry.hide();
          this.savingData = false;
          // this.isLoading = false;
          // this.modalityList = res;
        },
        err => {
    this.savingData = false;
    // this.isLoading = false;
          // console.error('error');
        }
      );
  }
  RecordWTDeviceReading(manualEntry: ModalDirective) {
    // this.isLoading = true;
    if (this.weightIn === "pound") {
      this.tempWeightValue = this.recordImgData.weightValue;
      let wValue = this.recordImgData.weightValue / 2.204623;
      wValue = +wValue.toFixed();
      this.recordImgData.weightValue = wValue;
    }
    this.savingData = true;
    this.rpmService.RecordWTDeviceReading(this.recordImgData)
      .subscribe(
        (res: any) => {
          this.toaster.success("Data Saved Successfully");
    this.savingData = false;
    this.recordImgData = new RecordDeviceReadingFromImageDto();
          // this.isLoading = false;
          // this.modalityList = res;
          manualEntry.hide();
        },
        err => {
    this.savingData = false;
    // this.isLoading = false;
          // console.error('error');
        }
      );
  }
  RecordPODeviceReading(manualEntry: ModalDirective) {
    this.savingData = true;
    // this.isLoading = true;
    this.rpmService.RecordPODeviceReading(this.recordImgData)
      .subscribe(
        (res: any) => {
    this.savingData = false;
    this.toaster.success("Data Saved Successfully");
    // this.isLoading = false;
          // this.modalityList = res;
          this.recordImgData = new RecordDeviceReadingFromImageDto();
          manualEntry.hide();
        },
        err => {
    this.savingData = false;
    // this.isLoading = false;
          // console.error('error');
        }
      );
  }
  RecordBGDeviceReading(manualEntry: ModalDirective) {
    // this.isLoading = true;
    this.savingData = true;
    this.rpmService.RecordBGDeviceReading(this.recordImgData)
      .subscribe(
        (res: any) => {
          // this.isLoading = false;
          // this.modalityList = res;
          this.toaster.success("Data Saved Successfully");
    this.savingData = false;
    this.recordImgData = new RecordDeviceReadingFromImageDto();
          manualEntry.hide();
        },
        err => {
    this.savingData = false;
    // this.isLoading = false;
          // console.error('error');
        }
      );
  }
  RecordATDeviceReading(manualEntry: ModalDirective) {
    // this.isLoading = true;
    this.savingData = true;
    this.rpmService.RecordATDeviceReading(this.recordImgData)
      .subscribe(
        (res: any) => {
          // this.isLoading = false;
          // this.modalityList = res;
          this.toaster.success("Data Saved Successfully");
    this.savingData = false;
    this.recordImgData = new RecordDeviceReadingFromImageDto();
          manualEntry.hide();
        },
        err => {
    this.savingData = false;
    // this.isLoading = false;
          // console.error('error');
        }
      );
  }

}
