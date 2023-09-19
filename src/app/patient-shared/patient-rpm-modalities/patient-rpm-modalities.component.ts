import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import moment from 'moment';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { AppDataService } from 'src/app/core/app-data.service';
import { AppUiService } from 'src/app/core/app-ui.service';
import { EventBusService } from 'src/app/core/event-bus.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ActivityDataDto, AlertsNew, BGDeviceDataDto, BPDeviceDataDto, CareGapsReadingsForRPMDto, DeletePatientDeviceDto, PHDeviceDto, PulseOximetryDataDto, RPMCopyDto, RPMDeviceListDtoNew, RPMEncounterDto, SetIsBleEnabled, SetupRPMDeviceParamsDto, SetupRPMDeviceResponseDto, WeightDataDto } from 'src/app/model/rpm.model';
import { ToastService } from 'ng-uikit-pro-standard';
import { SmartMeterService } from 'src/app/core/smart-meter.service';
import { ValidateSMResponseDto } from 'src/app/model/smartMeter.model';
import { RpmService } from 'src/app/core/rpm.service';
import Chart from 'chart.js';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { ClonerService } from 'src/app/core/cloner.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { PatientDto } from 'src/app/model/Patient/patient.model';
import { RPMServiceType } from 'src/app/Enums/rpm.enum';
import { IDatePickerConfig, ECalendarValue } from 'ng2-date-picker';
import { DexcomDashboardComponent } from './../../dexcom/dexcom-dashboard/dexcom-dashboard.component';
import { DatePipe } from '@angular/common';
import FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import { PatientNotificationDto } from 'src/app/model/Patient/patient-notification-model';
import { RingCentralService } from 'src/app/core/RingCentral/ring-central.service';

@Component({
  selector: 'app-patient-rpm-modalities',
  templateUrl: './patient-rpm-modalities.component.html',
  styleUrls: ['./patient-rpm-modalities.component.scss']
})
export class PatientRpmModalitiesComponent implements OnInit {

  @ViewChild('dexcomCompRef') dexcomCompRef: DexcomDashboardComponent;
  patientId: number;
  patientData = new PatientDto();
  selectedModalityCode = '';
  selectedDeviceType: string;
  rpmEncounterTime: string;
  rpmEncounterList = new Array<RPMEncounterDto>();
  devicesList = new Array<RPMDeviceListDtoNew>();
  modalityAlertConfObj = new AlertsNew();
  isLoading = false;
  validatingDevice: boolean;
  savingModalityAlert: boolean;
  gettingPDevices: boolean;
  gettingBpData: boolean;
  gettingWTData: boolean;
  gettingBGData: boolean;
  gettingCarePlan: boolean;

  bloodGlucoseStatistics = [];
  bloodPressureStatistics = [];
  weightStatistics = [];

  isBpDevice = false;
  isWtDevice = false;
  isPoDevice = false;
  isBgDevice = false;
  isAtDevice = false;
  encounterMinutes: number;
  bpReadingDayCount: number;
  wtReadingDayCount: any;

  rpmModalitEnumList: { modalityName: any; modalityCode: string; }[];
  isModalityLogsLoading: boolean;

  deletePatientDeviceDto = new DeletePatientDeviceDto();

  rpmDeviceResponseDto = new SetupRPMDeviceResponseDto();
  rpmDeviceParamsDto = new SetupRPMDeviceParamsDto();
  phDeviceDto = new Array<PHDeviceDto>();
  rpmCopyDataObj: RPMCopyDto;

  alreadySetupModality: boolean;
  includeEncounters: boolean;
  bgReadingDayCount: any;
  isBluetoothEnabled: boolean;
  setIsBleEnabledDto = new SetIsBleEnabled();


  selectedDevice = new RPMDeviceListDtoNew();

  patientDevicesDataList = new Array<{
    chartType: string;
    deviceObj: RPMDeviceListDtoNew;
    deviceData: any;
  }>();

  PatientTestData = new Array<BPDeviceDataDto>();

  rpmMonthId: number = new Date().getMonth() + 1;
  yearNum: number = new Date().getFullYear();

  listOfYears = this.appDataService.listOfYears;
  RPMServiceTypeEnum = RPMServiceType;


  public chartDatasets: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' }
  ];
  public DeviceBarChartData: Array<{
    data: Array<number>;
    label: string;
  }> = [];
  public onlyDatePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD'
  };
  public DeviceBarChartLabels: Array<string> = [];
  public chartLabels: Array<any> = [
    'Red',
    'Blue',
    'Yellow',
    'Green',
    'Purple',
    'Orange'
  ];

  public chartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }
  ];
  public scrollbarOptionsTimeline = {
    axis: 'y',
    theme: 'dark-3',
    scrollInertia: 2,
    scrollButtons: { enable: true },
    scrollbarPosition: 'outside',
  };
  public linechartColors: Array<any> = [
    {
      backgroundColor: 'rgba(78, 176, 72, 0)',
      borderColor: 'rgba(78, 176, 72, .5)',
      borderWidth: 2,
      lineTension: 0
    },
    {
      backgroundColor: 'rgba(13, 71, 161, 0)',
      borderColor: 'rgba(13, 71, 161, .5)',
      borderWidth: 2,
      lineTension: 0
    },
    {
      backgroundColor: 'rgba(255, 99, 132, 0)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 2,
      lineTension: 0
    },
    {
      backgroundColor: 'rgba(54, 162, 235, 0)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      lineTension: 0
    }
  ];

  public chartOptions: ChartOptions = {

    responsive: true,
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            min: 0
            // max: 160,
            // stepSize: 10
          }
        }
      ]
    },
    plugins: {
      datalabels: {
        display: false,
        anchor: 'end',
        align: 'bottom',
        clamp: true
      }
    }
  };



  public donutchartType = 'doughnut';

  public donutchartDatasets: Array<any> = [
    { data: [300, 50, 100, 40, 120], label: 'My First dataset' }
  ];


  public donutchartOptions: ChartOptions = {
    responsive: true,
      maintainAspectRatio: false,
      cutoutPercentage: 85,
      tooltips: {
        bodyFontSize: 10,
      },
    animation: {
      duration: 0,
    }
  };
  public donutchartColors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1', '#FFC870', '#A8B3C5', '#616774'],
      borderWidth: 2,
    }
  ];

  weightDataList = new Array<WeightDataDto>();
  BPDeviceDataList = new Array<BPDeviceDataDto>();
  pulseOximetryDataList = new Array<PulseOximetryDataDto>();
  activityDataList = new Array<ActivityDataDto>();
  BGDeviceDataList = new Array<BGDeviceDataDto>();
  bgCHartData: { key: string; value: any; }[];
  alreadyPendingBillingMsg: string;
  rpmCarePlan: string;
  copyDataStr: string;
  gettingRPMCopyData: boolean;
  isLoadingRpmModalityStatistics: boolean;
  careGapsReadingsForRPMDto = new CareGapsReadingsForRPMDto();
  hideModalitiesDetail = false;
  isLoadingPatientConfig: boolean;
  PatientNotifSetting = new PatientNotificationDto();

  constructor(
    private eventBus: EventBusService,
    private appUi: AppUiService,
    private route: ActivatedRoute,
    private smartMeter: SmartMeterService,
    private rpmService: RpmService,
    private dataFilterService: DataFilterService,
    private cloneService: ClonerService,
    private toaster: ToastService,
    private router: Router,
    private patientsService: PatientsService,
    public rcService: RingCentralService,
    private ccmService: CcmDataService,
    private appDataService: AppDataService,) {

      this.rpmModalitEnumList = this.rpmService.modalitiesList;
    }

  ngOnInit(): void {
    this.appUi.hideModalitiesDetails.subscribe((res: any) => {
      this.hideModalitiesDetail = true;
    })
    this.patientId = +this.route.snapshot.paramMap.get('id');
    if (!this.patientId) {
      this.patientId = +this.route.pathFromRoot[3].snapshot.paramMap.get("id");
    }
    if (this.patientId) {
      this.LoadPatientRPMData(this.patientId);
    }
    this.isBleEnabled();
  }

  LoadPatientRPMData(patientId: number) {
    this.patientId = patientId;
    this.getPatientDetail();
    this.GetModalityLogsByPatientId();
    this.GetPHDevicesByPatientId();
    this.GetRPMCarePlan();
    this.getRpmModalityStatistics();
    this.GetCareGapReadingsForRPM();
    this.GetPatientNotificationConfig()
  }


  serialNumberChanged() {
    if (this.rpmDeviceResponseDto.isIotDevice) {
      this.rpmDeviceResponseDto.macAddress = '';
      this.rpmDeviceResponseDto.model = '';
    }
  }
  ValidateSerial() {
    if (!this.rpmDeviceResponseDto.isIotDevice) {
      return;
    }
    this.validatingDevice = true;
    this.smartMeter
    .ValidateDevice(this.rpmDeviceResponseDto.serialNo)
    .subscribe(
      (res: ValidateSMResponseDto) => {
        if (res && res.is_valid) {
          this.rpmDeviceResponseDto.model = res.device_model;
          this.rpmDeviceResponseDto.macAddress = res.imei;
          this.toaster.success('Serial number verified');
        } else {
          this.rpmDeviceResponseDto.macAddress = '';
          this.rpmDeviceResponseDto.model = '';
          this.toaster.warning('Serial number not verified');
        }
        this.validatingDevice = false;
      },
      (error: HttpResError) => {
          this.validatingDevice = false;
          this.toaster.error(error.message || error.error, error.error);
        }
      );
  }
  SetupRPMDevice(modalityAlertModal11: ModalDirective) {
    this.rpmDeviceParamsDto.patientId = this.patientId;
    this.rpmDeviceParamsDto.deviceType = this.selectedDeviceType;
    this.rpmDeviceParamsDto.cpt99453 = this.rpmDeviceResponseDto.cpT99453;
    this.rpmDeviceParamsDto.installationDate = this.rpmDeviceResponseDto.installationDate;
    this.rpmDeviceParamsDto.model = this.rpmDeviceResponseDto.model;
    this.rpmDeviceParamsDto.serialNo = this.rpmDeviceResponseDto.serialNo;
    this.rpmDeviceParamsDto.macAddress = this.rpmDeviceResponseDto.macAddress;
    this.rpmDeviceParamsDto.id = this.rpmDeviceResponseDto.id;
    this.rpmDeviceParamsDto.isIotDevice = this.rpmDeviceResponseDto.isIotDevice;
      this.rpmService
        .SetupRPMDevice(this.rpmDeviceParamsDto)
        .subscribe(
          res => {
            modalityAlertModal11.hide();
            this.toaster.success('Added Successfully');
            if (this.rpmDeviceParamsDto.isIotDevice) {
              this.GetPHDevicesByPatientId();
            }
            this.rpmDeviceParamsDto = new SetupRPMDeviceParamsDto();
            // this.rpmEncounterList = res;
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
          }
        );
  }
  createCustomChart() {
    if (!document.getElementById('examChart')) {
      return;
    }
    const ctx = document.getElementById('examChart')['getContext']('2d');
    const bgChartDataSet = [];
    this.bgCHartData.forEach((ele, index) => {
      const dObj = { label: ele.key, data: [],
          // fill: false,
          backgroundColor: this.chartColors[0].backgroundColor[index],
          borderColor: this.chartColors[0].borderColor[index],
          // borderColor: [
          //   'rgba(255,99,132,1)',
          //   'rgba(54, 162, 235, 1)',
          //   'rgba(255, 206, 86, 1)',
          //   'rgba(75, 192, 192, 1)',
          //   'rgba(153, 102, 255, 1)',
          //   'rgba(255, 159, 64, 1)'
          // ],
          borderWidth: 1
          };
      ele.value.forEach(item => {
        dObj.data.push({t: moment(item.measurementDate).format('YYYY-MM-DD hh:mm A'), y: item.bg});
      });
      bgChartDataSet.push(dObj);
    });
    const moments = this.BGDeviceDataList.map(d => moment(d.measurementDate));
    const minDate  = moment.min(moments).subtract(30, 'minutes').format('YYYY-MM-DD hh:mm:ss A');
    const maxDate  = moment.max(moments).add(30, 'minutes').format('YYYY-MM-DD hh:mm:ss A');
    const maxVal = Math.max(...this.BGDeviceDataList.map(d => d.bg)) + 2 ;
    // const maxDate  = new Date(Math.max.apply(null, this.BGDeviceDataList.map(function(e) {
    //   return new Date(e.measurementDate);
    // })));
    let labelsArr = [minDate, maxDate];
    let dataSetsList: ChartDataSets[] = bgChartDataSet;
    if (this.selectedModalityCode === 'BG') {
      const graphData = this.patientDevicesDataList.find(x => x.deviceObj.modality === 'BG');
      if (graphData) {
        labelsArr = graphData.deviceData.labels;
        dataSetsList = graphData.deviceData.data;
      }
    }
    const bkjbk = new Chart( ctx , {
      plugins: [],
      type: 'line',
      data: {
        // labels: [new Date('2020-1-15 13:3').toLocaleString(), new Date('2020-3-25 13:2').toLocaleString(), new Date('2020-12-25 14:12').toLocaleString()],
        labels: labelsArr,
        datasets: dataSetsList
        // [
        //   {
        //   label: 'Demo',
        //   data: [{
        //       t: new Date('2015-3-15 13:3'),
        //       y: 12
        //     },
        //     {
        //       t: new Date('2015-3-25 13:2'),
        //       y: 21
        //     },
        //     {
        //       t: new Date('2015-2-25 14:12'),
        //       y: 32
        //     }
        //   ],
        //   backgroundColor: [
        //     'rgba(255, 99, 132, 0.2)',
        //     'rgba(54, 162, 235, 0.2)',
        //     'rgba(255, 206, 86, 0.2)',
        //     'rgba(75, 192, 192, 0.2)',
        //     'rgba(153, 102, 255, 0.2)',
        //     'rgba(255, 159, 64, 0.2)'
        //   ],
        //   borderColor: [
        //     'rgba(255,99,132,1)',
        //     'rgba(54, 162, 235, 1)',
        //     'rgba(255, 206, 86, 1)',
        //     'rgba(75, 192, 192, 1)',
        //     'rgba(153, 102, 255, 1)',
        //     'rgba(255, 159, 64, 1)'
        //   ],
        //   borderWidth: 1
        //   }
        // ]
      },
      options: {
        spanGaps: true,
        // scale: {
        //   pointLabels: {
        //     // callback: function(data) {
        //     //   // return '';
        //     // }
        //   }
        // },
        scales: {
          yAxes: [{
            ticks: {
              max: maxVal
            }
          }],
          // xAxes: [{
          //   type: 'time',
          //   time: {
          //     displayFormats: {
          //       'millisecond': 'D MMM YY,\\ h:mm a',
          //       'second': 'D MMM YY,\\ h:mm a',
          //       'minute': 'D MMM YY,\\ h:mm a',
          //       'hour': 'D MMM YY,\\ h:mm a',
          //       'day': 'D MMM YY,\\ h:mm a',
          //       'week': 'D MMM YY,\\ h:mm a',
          //       'month': 'D MMM YY,\\ h:mm a',
          //       'quarter': 'D MMM YY,\\ h:mm a',
          //       'year': 'D MMM YY,\\ h:mm a',
          //    }
          //   }
          // }]
        }
      }
    });
  }
  GetActivityDeviceDatabyPatientId(device: RPMDeviceListDtoNew) {
    this.rpmService
      .GetActivityDeviceDatabyPatientId(
        this.patientId,
        this.rpmMonthId,
        this.yearNum,
      )
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.activityDataList = res;
          if (res) {
            const steps = new Array<number>();
            const calories = new Array<number>();
            const tempLabels = new Array<string>();
            const tempArr = new Array<any>();
            if (res && res.length > 0) {
              res.forEach((element: any, index: number) => {
                // tempLabels.push((index + 1).toString());
                tempLabels.push(
                  // moment(element.measurementDate).format('D MMM YY,\\ h:mm a')
                  moment.utc(element.measurementDate).local().format('D MMM YY,\\ h:mm a')
                );
                steps.push(element.steps);
                calories.push(element.calories);
              });
              tempArr.push({ data: steps, label: 'Steps' });
              tempArr.push({ data: calories, label: 'Calories' });
            }
            this.patientDevicesDataList.push({
              chartType: 'line',
              deviceObj: device,
              deviceData: {
                labels: tempLabels,
                data: tempArr
              }
            });
          }
          // console.log(this.devicesList);
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
  }
  deviceStatusChanged(checked: boolean, item: RPMDeviceListDtoNew) {
    this.isLoading = true;
    this.rpmService
      .UpdatePatientDeviceStatus(this.patientId, item.id, checked)
      .subscribe(
        res => {
          if (checked) {
            this.toaster.success('Device is activated successfully');
            // this.patientDevicesDataList =this.patientDevicesDataList.filter(device => device.deviceObj.id !== item.id );
            // this.patientDevicesDataList.filter(device => device.deviceObj.id.)
          } else {
            this.toaster.warning('Device is deactivated');
            // this.patientDevicesDataList =this.patientDevicesDataList.filter(device => device.deviceObj.id !== item.id );
          }

          //     this.getBillingProviders();

          // this.getLogsByPatientAndMonthId();
          this.patientDevicesDataList = new Array<{
            chartType: string;
            deviceObj: RPMDeviceListDtoNew;
            deviceData: any;
          }>();
          // this.getDevicesByPatientId();
          this.GetPHDevicesByPatientId();
          // console.log(this.devicesList);
        },
        (error: HttpResError) => {
          this.isLoading = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }

  openConfirmModal(data: any) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Delete Device';
    modalDto.Text = 'Do you want to remove this device ?';
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.DeletePatientDevice(data);
  }
  DeletePatientDevice(patientDeviceId) {
    // if (window.confirm('Do you want to remove this device ?')) {
      this.isLoading = true;
      this.deletePatientDeviceDto.cPatientDeviceId = patientDeviceId;
      this.rpmService
        .DeletePatientDevice(this.deletePatientDeviceDto)
        .subscribe(
          res => {
            this.patientDevicesDataList = new Array<{
            chartType: string;
            deviceObj: RPMDeviceListDtoNew;
            deviceData: any;
          }>();
            // this.getDevicesByPatientId();
            this.GetPHDevicesByPatientId();
            this.toaster.success('Device deleted successfully');
          },
          (error: HttpResError) => {
            this.isLoading = false;
            this.toaster.error(error.message, error.error);
          }
        );
    // }
  }

  GetRPMDeviceConfiguration(deviceType: string) {
    this.selectedDeviceType = deviceType;
    this.rpmDeviceResponseDto = new SetupRPMDeviceResponseDto();
      this.rpmService
        .GetRPMDeviceConfiguration(this.patientId, deviceType)
        .subscribe(
          (res: SetupRPMDeviceResponseDto ) => {
            this.rpmDeviceResponseDto = res;
            if (this.rpmDeviceResponseDto.installationDate == '0001-01-01T00:00:00') {
              this.rpmDeviceResponseDto.installationDate = null;
            }else{
              this.rpmDeviceResponseDto.installationDate = moment(this.rpmDeviceResponseDto.installationDate).format('MMM DD, YYYY');
            }
            if (this.rpmDeviceResponseDto.serialNo && this.rpmDeviceResponseDto.model && this.rpmDeviceResponseDto.installationDate) {
              this.alreadySetupModality = true;
            } else {
              this.alreadySetupModality = false;
            }
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error);
          }
        );
  }

  GetModalityLogsByPatientId() {
    this.isModalityLogsLoading = true;
    if (this.patientId && this.rpmMonthId && this.yearNum) {
      this.rpmService
      .GetModalityLogsByPatientId(this.patientId, this.rpmMonthId, this.yearNum)
      .subscribe(
        (res: PHDeviceDto[]) => {
            this.isModalityLogsLoading = false;
            this.phDeviceDto = res;
          },
          (error: HttpResError) => {
            this.isModalityLogsLoading = false;
            this.toaster.error(error.message, error.error);
          }
        );
    }
  }
  deviceClicked(item: RPMDeviceListDtoNew, modal: ModalDirective) {
    Object.assign(this.selectedDevice, item);
    this.rpmService.GetThreshholdData(this.patientId, this.selectedDevice.modality).subscribe((res: any) => {
        // modal.hide();this.isLoading = false;
        if (!res) {

          res = {};
          if (this.selectedModalityCode === 'BP') {
            res.minDiastolic = 60;
            res.minSystolic = 100;
            res.maxDiastolic = 90;
            res.maxSystolic = 180;
          } else if (this.selectedModalityCode === 'BG') {
            res.minGlucose = 80;
            res.maxGlucose = 200;
          }
        }
        if (this.selectedModalityCode === 'BP') {
          this.modalityAlertConfObj.threshold.bloodPressure = res;
        }
        if (this.selectedModalityCode === 'WT') {
          this.modalityAlertConfObj.threshold.weight = res;
        }
        if (this.selectedModalityCode === 'PO') {
          this.modalityAlertConfObj.threshold.pulse = res;
        }
        if (this.selectedModalityCode === 'BG') {
          this.modalityAlertConfObj.threshold.bloodGlucose = res;
        }
        if (this.selectedModalityCode === 'AT') {
          this.modalityAlertConfObj.threshold.activity = res;
        }
        if (res.dataTimeOut) {
          this.modalityAlertConfObj.notify.timeUnit = 'hours';
          this.modalityAlertConfObj.notify.timeLapse = res.dataTimeOut ? res.dataTimeOut : 2;
        } else {
          this.modalityAlertConfObj.notify.timeUnit = 'days';
          this.modalityAlertConfObj.notify.timeLapse = 2;
        }
        // this.toaster.success('Data Saved Successfully');
        modal.show();
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        this.toaster.error(err.message, err.error || err.error);
      }
    );
  }

  CheckMinMaxvalue() {
    if (
      this.modalityAlertConfObj.threshold.bloodPressure.minSystolic >=
      this.modalityAlertConfObj.threshold.bloodPressure.maxSystolic
    ) {
      this.modalityAlertConfObj.threshold.bloodPressure.minSystolic = null;
    }
    if (
      this.modalityAlertConfObj.threshold.bloodPressure.minDiastolic >=
      this.modalityAlertConfObj.threshold.bloodPressure.maxDiastolic
    ) {
      this.modalityAlertConfObj.threshold.bloodPressure.minDiastolic = null;
    }
    if (
      this.modalityAlertConfObj.threshold.weight.minWeight >=
      this.modalityAlertConfObj.threshold.weight.maxWeight
    ) {
      this.modalityAlertConfObj.threshold.weight.maxWeight = null;
    }
    if (
      this.modalityAlertConfObj.threshold.pulse.minBloodOxygen >=
      this.modalityAlertConfObj.threshold.pulse.maxBloodOxygen
    ) {
      this.modalityAlertConfObj.threshold.pulse.maxBloodOxygen = null;
    }
    if (
      this.modalityAlertConfObj.threshold.bloodGlucose.minGlucose >=
      this.modalityAlertConfObj.threshold.bloodGlucose.maxGlucose
    ) {
      this.modalityAlertConfObj.threshold.bloodGlucose.maxGlucose = null;
    }
    if (
      this.modalityAlertConfObj.threshold.activity.minSteps >=
      this.modalityAlertConfObj.threshold.activity.maxSteps
    ) {
      this.modalityAlertConfObj.threshold.activity.maxSteps = null;
    }
  }
  getDeviceDisplayData() {
    this.patientDevicesDataList = [];
    if (this.devicesList && this.devicesList.length) {
      if (!this.selectedModalityCode) {
        setTimeout(() => {
          // this.selectedModalityCode = this.devicesList[0].modality;
          const configureDevice = this.devicesList.find((device) => device.id || device.lastReading)
          if(configureDevice){
            this.selectedModalityCode = configureDevice.modality;
            this.selectGraph();
          }
        }, 2000);
      }
      this.devicesList.forEach((device: RPMDeviceListDtoNew) => {
        // if (device.isGraphDisplay) {
          if ( device.modality === 'BP') {
            this.GetBPDeviceDisplayData(device);
          } else if (device.modality === 'WT') {
            this.GetWeightDeviceDatabyPatientId(device);
          } else if (device.modality === 'PO') {
            this.GetPulseDeviceDatabyPatientId(device);
          } else if (device.modality === 'BG') {
            this.GetBloodGlucoseDeviceDatabyPatientId(device);
          } else if (device.modality === 'AT') {
            this.GetActivityDeviceDatabyPatientId(device);
          }
        // }
      });
    }
    this.getRpmEncounterTime();
  }
  GetBPDeviceDisplayData(device: RPMDeviceListDtoNew) {
    this.gettingBpData = true;
    this.rpmService
      .GetBPDisplayData(
        this.patientId,
        this.rpmMonthId,
        this.yearNum,
      )
      .subscribe(
        (res: BPDeviceDataDto[]) => {
          if (res) {
            res.forEach(element => {
              element.measurementDate = moment(element.measurementDate).format('D MMM YY,\\ h:mm a');
            });
            this.bpReadingDayCount = res.map(x => x.measurementDate).map(x => moment(x).format('YYYY-MM-DD')).filter((item, i, ar) => ar.indexOf(item) === i).length;
            // res = this.dataFilterService.distictArrayByProperty(res, 'measurementDate');
            // above code distinct reading on the basis of date time
          }
          this.BPDeviceDataList = this.cloneService.deepClone(res);
          if (res) {
            this.PatientTestData = res.reverse();
            const highPressure = new Array<number>();
            const lowPressure = new Array<number>();
            const heartRate = new Array<number>();
            const bpl = new Array<number>();
            const tempLabels = new Array<string>();
            if (this.PatientTestData && this.PatientTestData.length > 0) {
              this.PatientTestData.forEach(
                (element: BPDeviceDataDto, index: number) => {
                  // tempLabels.push((index + 1).toString());
                  tempLabels.push(
                    // moment.utc(element.measurementDate).local().format('D MMM YY,\\ h:mm a')
                    element.measurementDate
                  );
                  highPressure.push(element.highPressure);
                  lowPressure.push(element.lowPressure);
                  heartRate.push(element.heartRate);
                  bpl.push(element.bpl);
                }
              );
              const tempArr = new Array<any>();
              tempArr.push({ data: highPressure, label: 'Systoliac' });
              tempArr.push({ data: lowPressure, label: 'Diastolic' });
              // tempArr.push({ data: heartRate, label: 'Heart Rate' });
              // tempArr.push({ data: bpl, label: 'BPL' });
              this.DeviceBarChartLabels = tempLabels;
              this.DeviceBarChartData = tempArr;
            }
            this.patientDevicesDataList.push({
              chartType: 'line',
              deviceObj: device,
              deviceData: {
                labels: this.DeviceBarChartLabels,
                data: this.DeviceBarChartData
              }
            });
          }
          this.gettingBpData = false;
          // this.toaster.success('data saved successfully.');
        },
        err => {
          this.gettingBpData = false;
          this.toaster.error(err.message, err.error || err.error);
          return null;
        }
      );
  }
  GetWeightDeviceDatabyPatientId(device: RPMDeviceListDtoNew) {
    this.gettingWTData = true;
    this.rpmService
      .GetWeightDeviceDatabyPatientId(
        this.patientId,
        this.rpmMonthId,
        this.yearNum,
      )
      .subscribe(
        (res: any) => {
          if (res) {
            res.forEach(element => {
              element.measurementDate = moment(element.measurementDate).format('D MMM YY,\\ h:mm a');
            });
            this.wtReadingDayCount = res.map(x => x.measurementDate).map(x => moment(x).format('YYYY-MM-DD')).filter((item, i, ar) => ar.indexOf(item) === i).length;
            res = this.dataFilterService.distictArrayByProperty(res, 'measurementDate');
          }
          this.weightDataList = res;
          if (res) {
            const muscaleValue = new Array<number>();
            const waterValue = new Array<number>();
            const weightValue = new Array<number>();
            const tempLabels = new Array<string>();
            const tempArr = new Array<any>();
            if (res && res.length > 0) {
              res.forEach((element: any, index: number) => {
                // tempLabels.push((index + 1).toString());
                tempLabels.push(
                  // moment(element.measurementDate).format('D MMM YY,\\ h:mm a')
                  // moment.utc(element.measurementDate).local().format('D MMM YY,\\ h:mm a')
                  element.measurementDate
                );
                muscaleValue.push(element.muscaleValue);
                waterValue.push(element.waterValue);
                weightValue.push(element.weightValue);
              });
              // tempArr.push({ data: muscaleValue, label: 'Muscale Value' });
              // tempArr.push({ data: waterValue, label: 'Water Value' });
              tempArr.push({ data: weightValue, label: 'Weight Value' });
            }
            this.patientDevicesDataList.push({
              chartType: 'bar',
              deviceObj: device,
              deviceData: {
                labels: tempLabels,
                data: tempArr
              }
            });
          }
          this.gettingWTData = false;
          // console.log(this.devicesList);
        },
        (error: HttpResError) => {
          this.gettingWTData = false;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GetPulseDeviceDatabyPatientId(device: RPMDeviceListDtoNew) {
    this.rpmService
      .GetPulseDeviceDatabyPatientId(
        this.patientId,
        this.rpmMonthId,
        this.yearNum,
      )
      .subscribe(
        (res: any) => {
          this.isLoading = false;
          this.pulseOximetryDataList = res;
          if (res) {
            const bloodOxygen = new Array<number>();
            const heartRate = new Array<number>();
            const tempLabels = new Array<string>();
            const tempArr = new Array<any>();
            if (res && res.length > 0) {
              res.forEach((element: any, index: number) => {
                // tempLabels.push((index + 1).toString());
                tempLabels.push(
                  // moment(element.measurementDate).format('D MMM YY,\\ h:mm a')
                  moment.utc(element.measurementDate).local().format('D MMM YY,\\ h:mm a')
                );
                bloodOxygen.push(element.bloodOxygen);
                heartRate.push(element.heartRate);
              });
              tempArr.push({ data: bloodOxygen, label: 'Blood Oxygen' });
              tempArr.push({ data: heartRate, label: 'Heart Rate' });
            }
            this.patientDevicesDataList.push({
              chartType: 'horizontalBar',
              deviceObj: device,
              deviceData: {
                labels: tempLabels,
                data: tempArr
              }
            });
          }
          // console.log(this.devicesList);
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
  }
  GetBloodGlucoseDeviceDatabyPatientId(device: RPMDeviceListDtoNew) {
    this.gettingBGData = true;
    this.rpmService
      .GetBloodGlucoseDeviceDatabyPatientId(
        this.patientId,
        this.rpmMonthId,
        this.yearNum,
      )
      .subscribe(
        (res: any) => {
          if (res) {
            res = res.reverse();
            res.forEach(element1 => {
              element1.measurementDate = moment(element1.measurementDate).format('D MMM YY,\\ h:mm a');
            });
            this.bgReadingDayCount = res.map(x => x.measurementDate).map(x => moment(x).format('YYYY-MM-DD')).filter((item, i, ar) => ar.indexOf(item) === i).length;
            res = this.dataFilterService.distictArrayByProperty(res, 'measurementDate');
          }
          this.BGDeviceDataList = res;
          if (res) {
            const bloodGlucose = new Array<number>();
            const dinnerSituation = new Array<number>();
            const tempArr = new Array<ChartDataSets>();
            let tempLabels = new Array<string>();
            const rData = this.dataFilterService.groupByProp(this.BGDeviceDataList, 'dinnerSituation');
            this.BGDeviceDataList = this.BGDeviceDataList.reverse();
            this.bgCHartData = rData;
            if (res && res.length > 0) {
              rData.forEach((item: any, index: number) => {
                // tempLabels.push((index + 1).toString());
                item.value.forEach((element2: BGDeviceDataDto) => {
                  // const xLabelFormat = moment(element2.measurementDate, 'D MMM YY,\\ h:mm a').format('D MMM \\ h:mm a');
                  tempLabels.push(
                    // moment.utc(element2.measurementDate).local().format('D MMM YY,\\ h:mm a')
                    // moment(element2.measurementDate).format('D MMM YY,\\ h:mm a')
                    element2.measurementDate
                  );
                });
                // tempArr.push({ data: item.value.map((x: BGDeviceDataDto) => x.bg), label: item.key });
              });
            }
            tempLabels = tempLabels.sort((left, right) => {
              const ssd = moment(left, 'D MMM YY,\\ h:mm a').diff(moment(right, 'D MMM YY,\\ h:mm a'));
              return ssd;
            });
            rData.forEach((item, index) => {
              const dataSet: ChartDataSets = {};
              dataSet.label = item.key;
              dataSet.data = [];
              dataSet.backgroundColor =  this.chartColors[0].backgroundColor[index];
              dataSet.borderColor = this.chartColors[0].borderColor[index];
              dataSet.borderWidth = 1;
              tempLabels.forEach(element3 => {
                const currentDate = element3;
                element3 = moment(element3, 'D MMM YY,\\ h:mm a').format('D MMM \\ h:mm a');
                  const existDate = item.value.find((row: BGDeviceDataDto) => row.measurementDate === currentDate);
                  if (existDate) {
                    dataSet.data.push(existDate.bg);
                  } else {
                    dataSet.data.push(null);
                  }
              });
              tempArr.push(dataSet);
            });

            this.patientDevicesDataList.push({
              chartType: 'horizontalBar',
              deviceObj: device,
              deviceData:
              // [
                {
                  labels: tempLabels,
                  data: tempArr
                }
              // ]
            });
          }
          this.gettingBGData = false;
          // console.log(this.devicesList);
          this.selectGraph();
        },
        (error: HttpResError) => {
          this.gettingBGData = true;
          this.toaster.error(error.message, error.error);
        }
      );
  }
  selectGraph() {
    if (this.selectedModalityCode === 'CGM') {
      // this.router.navigateByUrl(`/rpm/PatientRpm/${this.patientId}/dexcom/dexcomDashboard`);
      setTimeout(() => {
        this.dexcomCompRef.InitDexcom(this.patientId)
        this.dexcomCompRef.updateDateRange()
      }, 300);
      return;
    }
    // this.router.navigateByUrl(`/rpm/PatientRpm/${this.patientId}`);
    if (this.selectedModalityCode === 'BG') {
      setTimeout(() => {
        this.createCustomChart();
      }, 400);
    }
  }
  Open4GDeviceModal(modal: ModalDirective) {
    this.rpmDeviceResponseDto = new SetupRPMDeviceResponseDto();
    this.rpmDeviceResponseDto.installationDate = moment().format('YYYY-MM-DD');
    this.rpmDeviceResponseDto.isIotDevice = true;
    this.alreadySetupModality = false;
    this.CheckUnbilledDeviceConfigClaim();
    modal.show();
  };

  GetPHDevicesByPatientId() {
    this.isLoading = true;
    this.rpmService.GetPHDevicesDataByPatientId(this.patientId).subscribe(
      (res: any) => {
          // modal.hide();this.isLoading = false;
          this.devicesList = res;
          this.getDeviceDisplayData();
          // console.log(this.devicesList);
          if (this.devicesList) {
            this.devicesList.forEach((device: RPMDeviceListDtoNew) => {
              if (device.modality) {
                if (device.modality === 'BP') {
                  device.modalityName = 'Blood Pressure';
                  if (device.id) {
                    this.isBpDevice = true;
                  }
                }
                if (device.modality === 'WT') {
                  device.modalityName = 'Weight';
                  if (device.id) {
                    this.isWtDevice = true;
                  }
                }
                if (device.modality === 'PO') {
                  device.modalityName = 'Pulse Oximetry';
                  if (device.id) {
                    this.isPoDevice = true;
                  }
                }
                if (device.modality === 'BG') {
                  device.modalityName = 'Blood Glucose';
                  if (device.id) {
                    this.isBgDevice = true;
                  }
                }
                if (device.modality === 'AT') {
                  device.modalityName = 'Activity';
                  if (device.id) {
                    this.isAtDevice = true;
                  }
                }
              }
            });
          }
          // this.toaster.success('Data Saved Successfully');
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }

  SavePateintModalityAlertData(modal: ModalDirective) {
    this.savingModalityAlert = true;
    this.rpmService.SavePateintModalityAlertData(this.patientId, this.selectedDevice.modality, this.modalityAlertConfObj).subscribe(
      (res: any) => {
          modal.hide();
          this.toaster.success('Data Saved Successfully');
          this.savingModalityAlert = false;
        },
        (err) => {
          this.savingModalityAlert = false;
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }

  clearAlertObj() {
    this.modalityAlertConfObj = new AlertsNew();
  }

  getRpmEncounterTime() {
    const monthId = this.rpmMonthId;
    this.ccmService
      .GetRpmEncountersDurationByPatientId(this.patientId, monthId, this.yearNum)
      .subscribe(
        (res: any) => {
          if (res) {
            this.rpmEncounterTime = res.duration;
            const a = this.rpmEncounterTime.split(':'); // split it at the colons
            // minutes are worth 60 seconds. Hours are worth 60 minutes.
            this.encounterMinutes = moment.duration(this.rpmEncounterTime).asMinutes();
          } else {
            this.encounterMinutes = 0;
            this.rpmEncounterTime = '00:00:00';
          }
          // this.toaster.success('Data Updated Successfully');
        },
        (err) => {
          this.encounterMinutes = 0;
          this.rpmEncounterTime = '00:00:00';
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }


  CopyModalitiesData() {
    this.gettingRPMCopyData = true;
    this.rpmService.GetRPMEncountersAndReadingsForCopy(
      this.patientId,
      this.rpmMonthId,
      this.yearNum).subscribe(
      (res: RPMCopyDto) => {
        this.rpmCopyDataObj = res;
        const mydoc = document;
        const div = mydoc.createElement('div');
        // div.style.display = 'none';
        // const data: string = text;
        div.innerHTML = this.rpmCarePlan;
        mydoc.body.appendChild(div);
        const text = div.innerText;
        div.remove();
        this.copyDataStr = ``;
        this.copyDataStr += `Patient Name: ${this.patientData.fullName}\n`;
        this.copyDataStr += `Date of Birth: ${moment(this.patientData.dateOfBirth).format('MM-DD-YYYY')}\n`;
        this.copyDataStr += `Age: ${moment().diff(this.patientData.dateOfBirth, 'years')}\n`;
        this.copyDataStr += `\n-------------- Treatment Plan ------------------\n`;
        this.copyDataStr += text + '\n';
        if (this.selectedModalityCode === 'BP') {
          this.includeBpDataForCopy();
        }
        if (this.selectedModalityCode === 'BG') {
          this.includeBGDataForCopy();
        }
        if (this.selectedModalityCode === 'CGM') {
          this.includeCGMDataForCopy();
        }
        if (this.includeEncounters) {
          this.includeEncounterLogs();
        }
        this.executeCopyCommand();
        this.gettingRPMCopyData = false;
      },
      (error: HttpResError) => {
        this.gettingRPMCopyData = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  executeCopyCommand() {
    const textArea = document.createElement('textarea');
    // textArea.style.display = 'none';
    textArea.value = this.copyDataStr;
    document.body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999);
    document.execCommand('copy');
    textArea.remove();
    this.toaster.success('Content Copied');
  }
  includeBpDataForCopy() {
    if (this.rpmCopyDataObj && this.rpmCopyDataObj.bloodPressureList) {
      this.copyDataStr += `\n-------------Blood Pressure Data----------------\n`;
      this.rpmCopyDataObj.bloodPressureList.forEach(item => {
        const time = moment(item.measurementDate).format('MM-DD-YYYY,\\ h:mm a');
        this.copyDataStr += `  ${time} ${item.highPressure}/${item.lowPressure} mmHg ${item.heartRate} beats/min \n`;
      });
    }
  }
  includeBGDataForCopy() {
    if (this.rpmCopyDataObj && this.rpmCopyDataObj.bloodGlucoseList) {
      this.copyDataStr += `\n-------------Blood Glucose Data----------------\n`;
      this.rpmCopyDataObj.bloodGlucoseList.forEach(item => {
        const time = moment(item.measurementDate).format('MM-DD-YYYY,\\ h:mm a');
        this.copyDataStr += `  ${time} ${item.bg} mg/dl \n`;
      });
    }
  }
  includeCGMDataForCopy() {
    this.copyDataStr += `\n-------------CONTINUOUS GLUCOSE (AVG)----------------\n`;
    if (this.rpmCopyDataObj && this.rpmCopyDataObj.cgmpPerDayAvgList) {
      this.rpmCopyDataObj.cgmpPerDayAvgList.forEach(item => {
        // const time = moment(item.measurementDate).format('MM-DD-YYYY,\\ h:mm a');
        this.copyDataStr += `  ${item.date} ${item.avg} mg/dl \n`;
      });
      // this.copyDataStr += ` ${moment().month(this.rpmMonthId).format('MMM')} ${this.yearNum} ` + this.rpmCopyDataObj.cgmAvg + `\n`;
    }
  }
  includeEncounterLogs() {
    if (this.rpmCopyDataObj && this.rpmCopyDataObj.rpmEncounters) {
      this.copyDataStr += `\n-------------RPM Encounter Logs----------------\n`;
      this.rpmCopyDataObj.rpmEncounters.forEach(log => {
        // tslint:disable-next-line: max-line-length
        this.copyDataStr += `Service Type : ${this.RPMServiceTypeEnum[log.rpmServiceType]}\n Created By : ${ log.facilityUserName} \n Date : ${ moment(log.encounterDate).format('D MMM YY,\\ h:mm a')} , Start Time: ${ log.startTime}, End Time : ${ log.endTime} \n Duration : ${ log.duration} \n`;
        this.copyDataStr += `Note: ${log.note} \n`;
      });
    }
  }

  CheckUnbilledDeviceConfigClaim() {
    this.rpmService
      .CheckUnbilledDeviceConfigClaim(this.patientId)
      .subscribe(
        (res: any) => {
          this.alreadyPendingBillingMsg = res.message;
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error);
        }
      );
  }

  GetRPMCarePlan() {
    // this.userManagerService.getGetCareProviderList().subscribe(
    // this.facilityService.getFacilityUserList(this.facilityId).subscribe(
    this.rpmService.GetRpmCarePlan(this.patientId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.rpmCarePlan = res.carePlan ;
          }
        },
        (error: HttpResError) => {
          // this.loadingPsy = false;
          this.toaster.error(error.error, error.message);
        }
      );
  }
  getPatientDetail() {
    if (this.patientId) {
      this.patientsService
        .getPatientDetail(this.patientId)
        .subscribe(
          (res: any) => {
            if (res) {
              this.patientData = res;
            }
          },
          error => {
            //  console.log(error);
          }
        );
    }
  }

  getRpmModalityStatistics(){
    this.isLoadingRpmModalityStatistics = true;
    this.rpmService.getRpmModalityStatistics(this.patientId).subscribe(
      (res: any) => {
        this.bloodPressureStatistics = res.bloodPressureStatistics;
        this.bloodGlucoseStatistics = res.bloodGlucoseStatistics;
        this.weightStatistics = res.weightStatistics;
        this.isLoadingRpmModalityStatistics = false;
      }, (err: HttpResError) =>{
        this.toaster.error(err.error);
        this.isLoadingRpmModalityStatistics = false;
      }
    )
  }
  GetCareGapReadingsForRPM() {
    this.rpmService.GetCareGapReadingsForRPM(this.patientId).subscribe(
      (res: any) => {
        let date = new Date('2021-04-01');
        if (res.bmi.lastReadingDate) {
          res.bmi.NoOfMonth = this.Noofmonths(res.bmi.lastReadingDate, date);
        }
        if (res.a1C.lastReadingDate) {
          res.a1C.NoOfMonth = this.Noofmonths(res.a1C.lastReadingDate, date);
        }
        if (res.dn.lastReadingDate) {
          res.dn.NoOfMonth = this.Noofmonths(res.dn.lastReadingDate, date);
        }
        if (res.ld.lastReadingDate) {
          res.ld.NoOfMonth = this.Noofmonths(res.ld.lastReadingDate, date);
        }
        if (res.de.lastReadingDate) {
          res.de.NoOfMonth = this.Noofmonths(res.de.lastReadingDate, date);
        }
        if (res.bmi.value) {
          res.bmi.valueInNumber = Number(res.bmi.value);
          // (Math.round(res.bmi.valueInNumber * 10) / 10).toFixed(1);
          // res.bmi.valueInNumber = Number(res.bmi.valueInNumber);
          res.bmi.valueInNumber = Math.round(res.bmi.valueInNumber);
          // res.bmi.valueInNumber = Number(res.bmi.valueInNumber);
        }
        if (res.a1C.value) {
          res.a1C.valueInNumber = Number(res.a1C.value);
          res.a1C.valueInNumber = Number((Math.round(res.a1C.valueInNumber * 10) / 10).toFixed(1));
          // res.a1C.valueInNumber = Number(res.a1C.valueInNumber);
        }
        if (res.dn.value) {
          res.dn.valueInNumber = Number(res.dn.value);
          // Math.round(res.dn.valueInNumber * 10) / 10;
          // res.dn.valueInNumber = Number(res.dn.valueInNumber);
          // Math.ceil(res.dn.valueInNumber);
          res.dn.valueInNumber = Math.round(res.dn.valueInNumber);
        }
        if (res.ld.value) {
          res.ld.valueInNumber = Number(res.ld.value);
          res.ld.valueInNumber = Math.round(res.ld.valueInNumber);
          // Math.round(res.ld.valueInNumber * 10) / 10;
          // res.ld.valueInNumber = Number(res.ld.valueInNumber);
          // Math.ceil(res.ld.valueInNumber);
        }
        this.careGapsReadingsForRPMDto = res;
        },
        (err) => {
          this.toaster.error(err.message, err.error || err.error);
        }
      );
  }

  Noofmonths(date1, date2) {
    let readingDate = new Date(Date.parse(date1));
    let Nomonths;
    Nomonths = (date2.getFullYear() - readingDate.getFullYear()) * 12;
    Nomonths -= readingDate.getMonth() + 1;
    Nomonths += date2.getMonth() + 1; // we should add + 1 to get correct month number
    return Nomonths <= 0 ? 0 : Nomonths;
  }
  isBleEnabled(){
    this.rpmService.IsBleEnabled(this.patientId).subscribe((res: any) => {
      this.isBluetoothEnabled = res;
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
  setIsBleEnabled(){
    this.setIsBleEnabledDto.enable = this.isBluetoothEnabled;
    this.setIsBleEnabledDto.patientId = this.patientId;
    this.rpmService.SetIsBleEnabled(this.setIsBleEnabledDto).subscribe((res: any) => {
      if(this.isBluetoothEnabled){
        this.toaster.success('Bluetooth Enabled.')
      }else{
        this.toaster.success('Bluetooth Disabled.')
      }
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
  checkBluetooth(){
    var state = '';
    if(this.isBluetoothEnabled){
      state = 'Enable'
    }else{
      state = 'Disable'
    }
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Confirmation';
    modalDto.Text = `Are you sure you want to ${state} the bluetooth?`;
    modalDto.callBack = this.callBackBhi;
    modalDto.rejectCallBack = this.rejectCallBackBhi;
    this.appUi.openLazyConfrimModal(modalDto);
    }
  rejectCallBackBhi = () => {
    if(this.isBluetoothEnabled){
      this.isBluetoothEnabled = false;
    }else{
      this.isBluetoothEnabled = true;
    }
    }
  callBackBhi = (row) => {
    this.setIsBleEnabled();
    }
    downloadCarePlan(){
      this.gettingCarePlan = true;
      let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
      nUrl =  environment.appUrl;
      nUrl = nUrl + 'success/loading';
      const importantStuff = window.open(nUrl);
      this.rpmService.DownloadRPMCarePlanPdfByPatientId(this.patientId).subscribe(
        (res: any) => {
          const file = new Blob([res], { type: 'application/pdf' });
          const fileURL = window.URL.createObjectURL(file);
          importantStuff.location.href = fileURL;
          // FileSaver.saveAs(
          //   new Blob([res], { type: "application/pdf" }),
          //   "RPMCarePlan.pdf"
          // );
          this.gettingCarePlan = false;
        },
        (error: HttpResError) => {
          this.toaster.error(error.error, error.message);
          this.gettingCarePlan = false;
        }
   ) }

   GetPatientNotificationConfig() {
    this.isLoadingPatientConfig = true;
    this.patientsService.GetPatientNotificationConfig(this.patientId).subscribe(
      (res: PatientNotificationDto) => {
        this.isLoadingPatientConfig = false;
        if (res) {
          this.PatientNotifSetting = res;
          this.PatientNotifSetting.disableProviderSmsAlert = !this.PatientNotifSetting.disableProviderSmsAlert
          // const hours = this.PatientNotifSetting?.notificationTime?.hour;
          // const minutes = this.PatientNotifSetting?.notificationTime?.minute;
          // this.notificationTime = `${hours}:${minutes}`;
        }
      },
      (error: HttpResError) => {
        this.isLoadingPatientConfig = false;
        this.toaster.error(error.message, error.error);
      }
    );
  }
  EditPatientProviderSmsAlertConfig() {
    this.patientsService.EditPatientProviderSmsAlertConfig(this.patientId, !this.PatientNotifSetting.disableProviderSmsAlert).subscribe(
      (res: PatientNotificationDto) => {

      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
      }
    );
  }
}
