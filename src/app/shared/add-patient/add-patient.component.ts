import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  EventEmitter,
  Pipe,
  ChangeDetectorRef,
  OnChanges,
  OnDestroy,
  ElementRef,
  NgZone
} from "@angular/core";
import {
  FormGroup,
  FormBuilder,
  Validators,
  MaxLengthValidator
} from "@angular/forms";
import {
  PatientDto,
  ChronicIcd10CodeDto,
  AllChronicDiseaseDto
} from "src/app/model/Patient/patient.model";
import { IDatePickerConfig, ECalendarValue } from "ng2-date-picker";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { WekipediaService } from "src/app/core/wekipedia.service";
import {
  ToastService,
  IMyOptions,
  ModalDirective,
  TabsetComponent,
  MDBDatePickerComponent,
  IMyDate
} from "ng-uikit-pro-standard";
import { QuestionnaireService } from "src/app/core/questionnaire.service";
import { Disease } from "src/app/model/admin/disease.model";
import { UserType } from "src/app/Enums/UserType.enum";
import { SecurityService } from "src/app/core/security/security.service";
import { Router, ActivatedRoute } from "@angular/router";
import { HttpResError } from "src/app/model/common/http-response-error";
import { FacilityService } from "src/app/core/facility/facility.service";
// import { MDBDatePickerComponent } from './../../../typescripts/pro/date-picker/datepicker.component';
// import {IMyDate} from 'ng2-date-picker'
import {
  FacilityDto,
  CreateFacilityUserDto
} from "src/app/model/Facility/facility.model";
import { CcmDataService } from "src/app/core/ccm-data.service";
import { State } from "src/app/model/AppData.model";
import { Location, DatePipe } from "@angular/common";
import {
  UploadFile,
  UploadInput,
  UploadOutput,
  humanizeBytes
} from "ng-uikit-pro-standard";

import {
  ConsentType,
  DocumentType,
  ConsentNature
} from "src/app/Enums/filterPatient.enum";
import { Language } from "src/app/model/admin/ccm.model";
import { DomSanitizer } from "@angular/platform-browser";
import { AppDataService } from "src/app/core/app-data.service";
import { MapsAPILoader } from "@agm/core";
import { InsurancePlanDto } from 'src/app/model/pcm/payers.model';
import { InsuranceService } from 'src/app/core/insurance.service';
import moment from "moment";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { environment } from 'src/environments/environment';
// import * as moment from "moment";

@Component({
  selector: "app-add-patient",
  templateUrl: "./add-patient.component.html",
  styleUrls: ["./add-patient.component.scss"],
  providers: [DatePipe]
})
// @Pipe({name: 'safeHtml'})
export class AddPatientComponent implements OnInit, AfterViewInit {
  // [x: string]: any;
  // securityObject: AppUserAuth = null;
  zipCode: number;
  sad: number;
  isLoading = false;
  languageList = new Array<Language>();
  consentTypeEnum = ConsentType;
  consentDocument: any;
  patientConsentType: ConsentType;
  consentNature: ConsentNature;
  files: UploadFile[];
  humanizeBytes: Function;
  dragOver: boolean;
  @ViewChild("datePicker") datePicker: MDBDatePickerComponent;
  @ViewChild("ccmConsent") staticTabs: TabsetComponent;
  // @ViewChild('selectFacility') selectFacility: ModalDirective;
  PatientForm: FormGroup;
  LoadingData = false;
  allowPatientEmailEdit = true;
  patient = new PatientDto();
  patientTempData = new PatientDto();
  facilityList = new Array<FacilityDto>();
  tempChroniObj = new Array<ChronicIcd10CodeDto>();
  primaryPhoneNotAvailable = false;
  cronicDiseaseList = new Array<{ id: 0; algorithm: "" }>();
  tempcronicDiseaseList = new Array<{ id: 0; algorithm: "" }>();
  yearNow = new Date();
  setdate: any;
  isEditpatientloaded = false;
  month = this.yearNow.getMonth() + 1;
  day = this.yearNow.getDate();
  selectedChronicCondition = {
    id: 0,
    algorithm: ""
  };

  chronicDependentDiseases = new Array<ChronicIcd10CodeDto>();
  addICDCodeDto = new ChronicIcd10CodeDto();
  selectedCronicDiseases = new Array<ChronicIcd10CodeDto>();
  States = new Array<State>();
  public DisplayDate;
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: "YYYY-MM-DD"
  };
  public monthPickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr
  };
  public myDatePickerOptions: IMyOptions = {
    minYear: 1900,
    maxYear: 2020,
    closeAfterSelect: true,
    dateFormat: "mm-dd-yyyy"
    // const year = this.yearNow.getFullYear() - 60;
    //   const month = this.yearNow.getMonth() + 1;
    //   const day = this.yearNow.getDate();
    //   this.PatientForm.get('dateOfBirth').setValue(year + '-' + month + '-' + day);

    // startDate:
    // this.yearNow.getFullYear() -
    // 60 +
    // "-" +
    // (this.yearNow.getMonth() + 1) +
    // "-" +
    // this.yearNow.getDate()
    // 2000 - 10 - 4,
    // ariaLabelPrevYear:2020
  };
  public myDate: IMyDate = {
    year: this.yearNow.getFullYear() - 60,
    month: this.yearNow.getMonth() + 1,
    day: this.yearNow.getDate()
  };
  // SameAsCurrentAddress: boolean;
  selectedDate = new Date();
  objectURLStrAW: string;
  @ViewChild('viewPdfModal') viewPdfModal: ModalDirective;
  FacilityUserId: number;
  facilityId: number;
  userId: string;
  BillingProviderId: number;
  BIllingProviderList = new Array<CreateFacilityUserDto>();
  @ViewChild("selectFacilityModal") selectFacilityModal: ModalDirective;
  @ViewChild("FacilityModal") FacilityModal: ModalDirective;
  emailinvalid: boolean;
  patientId: number;
  onlineConsetCheckbox: any;
  consentModal: any;
  termsPolicy = false;
  IsSameCurrentAddress = true;
  emrExist: boolean;
  disableSelectFacility: boolean;
  OrganizationId: number;
  uploadFileName: string;
  uploadFileUrl: string;
  setActive: number;
  cityAndStateObj: any;
  show: boolean;
  currentAddress: string;
  currentCity: string;
  currentState: string;
  maillingAddressZipCode: number;
  consentTaken: false;
  // setPassword = 2C#ealth;
  physicianName: string;
  isAddingNewPatient = false;
  isUpdatingPatient = false;
  PatientName: string;
  Signature: "";
  Date = "12-23-2019";
  language = "";
  selectAddress = "currentAddress";
  // securityObject: AppUserAuth = null;
  UserFullName: string;
  // physicianhtml = `<span>${this.Physician}</span>`

  @ViewChild("search")
  public searchElementRef: ElementRef;
  @ViewChild("searchMaillingAddress")
  public searchMaillingAddressRef: ElementRef;
  @ViewChild("zipCode") zipCodeRef: ElementRef;
  // google autocomplete library parameters
  title: string = "AGM project";
  latitude: number;
  longitude: number;
  zoom: number;
  autocomplete: any;
  autocomplete2: any;
  address: string;
  TempZipCode: number;
  private geoCoder;
  allowPatientEdit: boolean;
  latlng: any;
  street_number: any;
  street_number2: string;
  isLoadingPayersList: boolean;
  insurancePLanList: InsurancePlanDto[];
  PatientPreserve: PatientDto;
  isIcdCodeExist = true;

  searchWatch = new Subject<string>();
  searchParam = "";
  filteredChronicDiseaseList = new Array<ChronicIcd10CodeDto>();
  tempSearchChroniObj = new ChronicIcd10CodeDto();
  countriesList: any;

  dateDefaultMonth = ''; // '05.2017' moment().;
  isSameUserName: boolean = true;

  userNameErrorMsg= '';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private facilityService: FacilityService,
    private insuranceService: InsuranceService,
    private ccmDataService: CcmDataService,
    private securityService: SecurityService,
    private toaster: ToastService,
    private location: Location,
    private patientService: PatientsService,
    private questionService: QuestionnaireService,
    private wikiService: WekipediaService,
    public datePipe: DatePipe,
    private appData: AppDataService,
    private sanitizer: DomSanitizer,
    // private changeDetect: ChangeDetectorRef
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
    this.files = [];
    this.humanizeBytes = humanizeBytes;
    this.show = false;
  }

  ngOnInit() {
    this.dateDefaultMonth =  moment().subtract(60, 'years').format('MM.YYYY'); // `0${this.yearNow.getMonth() + 1}.${this.yearNow.getFullYear() - 62}`
    // this.UserFullName = this.securityObject.fullName;
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.OrganizationId = +this.securityService.getClaim("OrganizationId")
        .claimValue;
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
    } else {
      this.OrganizationId = 0;
    }
    this.patientId = +this.route.snapshot.paramMap.get("id");
    this.UserFullName = this.securityService.securityObject.fullName;
    if (this.patientId) {
      this.isEditpatientloaded = true;
      //  this.FacilityModal.show();
      this.patientService.getPatientDetail(this.patientId).subscribe(
        (res: any) => {
          if (res) {
            this.PatientPreserve = res;
            res.dateOfBirth = moment(
              res.dateOfBirth, "YYYY-MM-DD"
            ).format("MM-DD-YYYY");
            /// for enable email
            if (
              res.email &&
              this.securityService.securityObject.userType !== UserType.Patient
            ) {
              this.allowPatientEmailEdit = false;
            }
            this.patientTempData = res;
            this.BillingProviderId = this.patientTempData.billingProviderId;
            const patientfacilityid = this.patientTempData.facilityId;
            this.PatientForm.patchValue(res);
            this.PatientForm.get("nickname").setValue(res.nickname);
            if (!this.PatientForm.controls.password.value) {
              this.PatientForm.get("password").setValue("TTeesstt--991122.");
            }

            // if (
            //   !this.patientTempData.facilityId ||
            //   !this.patientTempData.billingProviderId
            // ) {
            //   this.FacilityModal.show();
            // }

            if (this.setActive) {
              // let tabsss=   this.staticTabs
            }
            this.facilityId = res.facilityId;
            this.billingProviderId(this.facilityId);
            this.userId = res.userId;
            this.BillingProviderId = res.billingProviderId;
            this.isEditpatientloaded = false;
            this.appData.summeryViewPatient = res;
          }
        },
        error => {}
      );
      this.patientService.getPatientsChronicDiseases(this.patientId).subscribe(
        (res: any) => {
          if (res) {
            Object.assign(this.selectedCronicDiseases, res);
          }
        },
        error => {}
      );
    }
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser
    ) {
      this.FacilityUserId = this.securityService.securityObject.id;
    } else {
      this.FacilityUserId = 0;
    }
    // this.yearNow.getMonth() + 1 + "." + (this.yearNow.getFullYear() - 60);
    const selectedDate =
    (this.yearNow.getMonth() + 1) +
      "-" +
      this.yearNow.getDate()  +
      "-" +
      (this.yearNow.getFullYear() -
      60);


    this.PatientForm = this.fb.group({
      id: [0],
      firstName: ["", [Validators.required]],
      patientEmrId: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      nickname: [""],
      middleName: [""],
      currentAddress: [""],
      countryCallingCode: ["1",],
      // ccmStatus: [""],
      // rpmStatus: [""],
      // ccmMonthlyStatus: [""],
      // enrollmentStatus: [""],
      // profileStatus: [""],
      mailingAddress: [""],
      maillingAddressState: [""],
      maillingAddressCity: [""],
      maillingAddressZipCode: [""],
      // mallingAddress:[''],
      insuranceNumber: [""],
      secondaryInsuranceNumber: [""],
      medicareNumber: [""],
      planAYear: [""],
      bestTimeToCall: [""],
      preferredLanguage: ["", [Validators.required]],
      planAMonth: [""],
      dateAssigned: [""],
      planBYear: [""],
      planBMonth: [""],
      emergencyContactName: [""],
      emergencyContactRelationship: [""],
      emergencyContactPrimaryPhoneNo: ["", [Validators.required]],
      emergencyContactSecondaryPhoneNo: [""],
      email: ["", [Validators.email]],
      // email: ["", [Validators.required]],
      userName: ["", [Validators.required]],
      password: ["", [Validators.required]],
      city: [""],
      state: [""],
      careFacilitatorName: [""],
      careFacilitatorId: [null],
      insurancePlanId : [null],
      secondaryInsurancePlanId : [null],
      ccmNotBillable: [false],
      zip: ["", [Validators.maxLength(5)]],
      country: [""],
      homePhone: [""],
      // dateOfBirth: [selectedDate, [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      sex: ["", [Validators.required]],
      socialSecurityNumber: [""],
      personNumber: [""],
      medicalRecordNumber: [""],
      otherIdNumber: [""]
    });
    console.log('2nd elment', this.searchMaillingAddressRef);
    this.PatientForm.get("maillingAddressZipCode").valueChanges.subscribe(
      (res: number) => {
        this.maillingAddressZipCode = res;
      }
    );
    this.PatientForm.get("zip").valueChanges.subscribe(
      (res: number) => (this.zipCode = res)
    );
    this.PatientForm.get("currentAddress").valueChanges.subscribe(
      (res: any) => {
        this.currentAddress = res;
      }
    );
    this.PatientForm.get("city").valueChanges.subscribe((res: any) => {
      this.currentCity = res;
    });
    this.PatientForm.get("state").valueChanges.subscribe((res: any) => {
      this.currentState = res;
    });
    // this.PatientForm.get('dateOfBirth').reset();
    this.getFacilityList();
    this.getCronicDiseases();
    this.getStatesList();
    this.GetInsurancePlansByFacilityId();
    this.SearchObserver();
    this.setActive = +this.route.snapshot.queryParamMap.get("setActive");

    this.PatientForm.get("country").valueChanges.subscribe(val => {
      this.wikiSearch(val);
    });
    this.ccmDataService.getLanguageList().subscribe(
      (res: any) => {
        this.languageList = res;
      },
      err => {}
    );
    // this.setdate();
    this.PatientForm.get("password").setValue("2C#ealth");
    // this.PatientForm.get("dateOfBirth").setValue(this.setdate);
    // this.setdate =
    //   this.yearNow.getMonth() + 1 + "." + (this.yearNow.getFullYear() - 60);
    // this.PatientForm.get("dateOfBirth").setValue(this.setdate);
    // this.PatientForm.get('preferredLanguage').valueChanges.subscribe(val => {

    //   this.PatientForm.get('preferredLanguage').setValue(val);
    // });
    this.PatientForm.get("preferredLanguage").setValue(this.language);
    //// google api places
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder();
      this.googleApi();
    });
    this.GetAllCountries();
  }
  GetAllCountries(){
    this.patientService.GetAllCountries().subscribe((res: any) => {
      this.countriesList = res;
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
googleApi() {
  if (this.selectAddress === "currentAddress") {
    this.autocomplete = new google.maps.places.Autocomplete(
     this.searchElementRef.nativeElement,
     {
       types: ["address"],
       componentRestrictions: { country: "us" }
     }
   );
   console.log('1nd elment', this.searchElementRef);
   }

     this.autocomplete2 = new google.maps.places.Autocomplete(
      this.searchMaillingAddressRef.nativeElement,
      {
        types: ["address"],
        componentRestrictions: { country: "us" }
      }
    );
    console.log('2nd elment', this.searchMaillingAddressRef);

   this.autocomplete.addListener("place_changed", () => {
     this.ngZone.run(() => {
       // get the place result
       // tslint:disable-next-line:prefer-const
       let place: google.maps.places.PlaceResult = this.autocomplete.getPlace();
       // verify result
       if (this.selectAddress === "currentAddress") {
         this.PatientForm.get("zip").setValue("");
         this.street_number = '';
       }
      //  if (this.selectAddress === "mailingAddress") {
      //   this.street_number2 = '';
      //   this.PatientForm.get("maillingAddressZipCode").setValue("");
      //  }
       console.log("my place", place);
       if (place.geometry === undefined || place.geometry === null) {
         return;
       }
       this.latitude = place.geometry.location.lat();
       this.longitude = place.geometry.location.lng();
       place.address_components.forEach(addr => {
         console.log("addr", addr);
         addr.types.forEach(typ => {
           if (this.selectAddress === "currentAddress") {
             if (typ === "postal_code") {
               this.PatientForm.get("zip").setValue(addr.long_name);
             } else if (typ === "route") {
               this.PatientForm.get("currentAddress").setValue(
                 addr.long_name
               );
             }else if (typ === "street_number") {
               this.street_number = addr.long_name;
              }
              else if (typ === "neighborhood") {
             } else if (typ === "locality") {
               this.PatientForm.get("city").setValue(addr.long_name);
             } else if (typ === "administrative_area_level_1") {
               this.PatientForm.get("state").setValue(addr.short_name);
             }
           }
          //  if (this.selectAddress === "mailingAddress") {
          //    if (typ === "postal_code") {
          //      this.PatientForm.get("maillingAddressZipCode").setValue(addr.long_name);
          //    } else if (typ === "route") {
          //      this.PatientForm.get("mailingAddress").setValue(
          //        addr.long_name
          //      )
          //    } else if (typ === "street_number") {
          //     this.street_number2 = addr.long_name;
          //    }else if (typ === "neighborhood") {
          //    } else if (typ === "locality") {
          //      this.PatientForm.get("maillingAddressCity").setValue(addr.long_name);
          //    } else if (typ === "administrative_area_level_1") {
          //      this.PatientForm.get("maillingAddressState").setValue(addr.short_name);
          //    }
          //  }

         });
       });

       if (this.selectAddress === "currentAddress") {
        if (this.street_number) {
          this.PatientForm.get("currentAddress").setValue(this.street_number + ' ' + this.PatientForm.get("currentAddress").value);
         }
          if (!this.PatientForm.get("zip").value) {
           this.geocodeLatLng(this.latitude, this.longitude);
           setTimeout(() => {
             this.assignAddressValue();
           }, 1000);
         }
       }
      //  if (this.selectAddress === "mailingAddress") {
      //   if (this.street_number2) {
      //     this.PatientForm.get("mailingAddress").setValue(this.street_number2 + ' ' + this.PatientForm.get("mailingAddress").value);
      //    }
      //   if (!this.PatientForm.get("maillingAddressZipCode").value) {
      //      this.geocodeLatLng(this.latitude, this.longitude);
      //      setTimeout(() => {
      //        this.assignAddressValue();
      //      }, 1000);
      //    }
      //  }

       //  this.facilityinfoForm
       //    .get("latitude")
       //    .patchValue(place.geometry.location.lat());
       //  this.facilityinfoForm
       //    .get("longitude")
       //    .patchValue(place.geometry.location.lng());
       //  this.facilityinfoForm
       //    .get("placeId")
       //    .patchValue(place.place_id);
     });
   });

   this.autocomplete2.addListener("place_changed", () => {
    this.ngZone.run(() => {
      // get the place result
      // tslint:disable-next-line:prefer-const
      let place: google.maps.places.PlaceResult = this.autocomplete2.getPlace();
      // verify result
      // if (this.selectAddress === "currentAddress") {
      //   this.PatientForm.get("zip").setValue("");
      // }
      if (this.selectAddress === "mailingAddress") {
        this.street_number2 = '';
        this.PatientForm.get("maillingAddressZipCode").setValue("");
      }
      console.log("my place", place);
      if (place.geometry === undefined || place.geometry === null) {
        return;
      }
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();
      place.address_components.forEach(addr => {
        console.log("addr", addr);
        addr.types.forEach(typ => {
          // if (this.selectAddress === "currentAddress") {
          //   if (typ === "postal_code") {
          //     this.PatientForm.get("zip").setValue(addr.long_name);
          //   } else if (typ === "route") {
          //     this.PatientForm.get("currentAddress").setValue(
          //       addr.long_name
          //     );
          //   } else if (typ === "neighborhood") {
          //   } else if (typ === "locality") {
          //     this.PatientForm.get("city").setValue(addr.long_name);
          //   } else if (typ === "administrative_area_level_1") {
          //     this.PatientForm.get("state").setValue(addr.short_name);
          //   }
          // }
          if (this.selectAddress === "mailingAddress") {
            if (typ === "postal_code") {
              this.PatientForm.get("maillingAddressZipCode").setValue(addr.long_name);
            } else if (typ === "route") {
              this.PatientForm.get("mailingAddress").setValue(
                addr.long_name
              );
            }  else if (typ === "street_number") {
              this.street_number2 = addr.long_name;
             }else if (typ === "neighborhood") {
            } else if (typ === "locality") {
              this.PatientForm.get("maillingAddressCity").setValue(addr.long_name);
            } else if (typ === "administrative_area_level_1") {
              this.PatientForm.get("maillingAddressState").setValue(addr.short_name);
            }
          }
        });
      });
      // if (this.selectAddress === "currentAddress") {
      //   if (!this.PatientForm.get("zip").value) {
      //     this.geocodeLatLng(this.latitude, this.longitude);
      //     setTimeout(() => {
      //       this.assignAddressValue();
      //     }, 1000);
      //   }
      // }
      if (this.selectAddress === "mailingAddress") {
        if (this.street_number2) {
          this.PatientForm.get("mailingAddress").setValue(this.street_number2 + ' ' + this.PatientForm.get("mailingAddress").value);
         }
        if (!this.PatientForm.get("maillingAddressZipCode").value) {
          this.geocodeLatLng(this.latitude, this.longitude);
          setTimeout(() => {
            this.assignAddressValue();
          }, 1000);
        }
      }
      //  this.facilityinfoForm
      //    .get("latitude")
      //    .patchValue(place.geometry.location.lat());
      //  this.facilityinfoForm
      //    .get("longitude")
      //    .patchValue(place.geometry.location.lng());
      //  this.facilityinfoForm
      //    .get("placeId")
      //    .patchValue(place.place_id);
    });
  });

}
GetInsurancePlansByFacilityId() {
  this.isLoadingPayersList = true;
  this.insuranceService.GetInsurancePlansByFacilityId(this.facilityId).subscribe(
    (res: InsurancePlanDto[]) => {
      this.insurancePLanList = res;
      this.isLoadingPayersList = false;
    },
    (error: HttpResError) => {
      this.isLoadingPayersList = false;
      this.toaster.error(error.error, error.message);
    }
  );
}
  geocodeLatLng(lat, lng) {
    // get zip code from latitude and longitude
    this.geoCoder = new google.maps.Geocoder();
    this.latlng = new google.maps.LatLng(lat, lng);
    // let placess: google.maps.Place.autocomplete;
    this.geoCoder.geocode(
      {
        location: {
          lat: lat,
          lng: lng
        }
      },
      (results, status) => {
        console.log("hjbgfsdfnhc", results);
        if (status === "OK") {
          if (results[0]) {
            results[0].address_components.forEach(element => {
              element.types.forEach(typ => {
                if (typ === "postal_code") {
                  this.TempZipCode = element.long_name;
                  console.log("function onmy", this.TempZipCode);
                  // this.assignAddressValue();
                  this.zipCodeRef.nativeElement.value = element.long_name;
                  // this.addresses.controls[this.searchElementRef.nativeElement].get('zip')
                  // .patchValue(element.long_name);
                }
              });
            });
            // alert(city + ' ' + state + ' ' + country)
          } else {
            console.log("No results found");
          }
        } else {
          console.log("GeoCoder failed due to: " + status);
        }
        // this.decomposeAddressComponents(results);
      }
    );
  }
  assignAddressValue() {
    if (this.selectAddress === "currentAddress") {
      this.PatientForm.get("zip").setValue(this.TempZipCode);
    }
    if (this.selectAddress === "mailingAddress") {
    this.PatientForm.get("maillingAddressZipCode").setValue(this.TempZipCode);
    }
  }
  // onInputFocusBlur() {

  //   if (!this.PatientForm.controls.dateOfBirth.value) {
  //     const year = this.yearNow.getFullYear() - 60;
  //     const month = this.yearNow.getMonth() + 1;
  //     const day = this.yearNow.getDate();
  //     this.PatientForm.get('dateOfBirth').setValue(year + '-' + month + '-' + day);
  //     this.changeDetect.markForCheck();
  //     // this.PatientForm.get('dateOfBirth').setValue(null);
  //   }

  // }
  password() {
    this.show = !this.show;
  }
  ngAfterViewInit() {
    if (
      this.securityService.securityObject.userType === UserType.FacilityUser &&
      !this.patientId &&
      this.securityService.hasClaim("isLocumCareProvider")
    ) {
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
      this.getBillingProviders();
      // this.selectFacilityModal.show();
    } else if (
      this.securityService.securityObject.userType === UserType.FacilityUser &&
      !this.patientId
    ) {
      this.disableSelectFacility = true;
      this.facilityId = +this.securityService.getClaim("FacilityId").claimValue;
      this.getBillingProviders();
      // this.selectFacilityModal.show();
    }
    if (this.setActive && this.staticTabs) {
      this.staticTabs.tabs[2].disabled = false;
      this.staticTabs.setActiveTab(3);
    }
    // setTimeout(() => this.datePicker.onUserDateInput("2017-10-13"), 0);
    // this.PatientForm.get('email').
  }
  getFacilityList() {
    this.LoadingData = true;
    this.facilityService.getFacilityByOrgId(this.OrganizationId).subscribe(
      (res: any) => {
        this.facilityList = res;
        this.LoadingData = false;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  addNewIcdCode(selectIcdModal: ModalDirective) {
    // this.LoadingData = true;
    this.addICDCodeDto.chronicConditionId = this.selectedChronicCondition.id;
    this.patientService.addNewIcdCode(this.addICDCodeDto).subscribe(
      (res: ChronicIcd10CodeDto[]) => {
        // let chronics = this.tempChroniObj;
        // this.tempChroniObj = new Array<ChronicIcd10CodeDto>();
        this.chronicDependentDiseases = [...res];
        let data = res.find(x => x.icdCode === this.addICDCodeDto.icdCode);
        // this.tempChroniObj = [];
        this.tempChroniObj.push(data);
        const selectedTemp = [];
        Object.assign(selectedTemp, this.tempChroniObj);
        this.tempChroniObj = [];
        selectedTemp.forEach(element => {
          const data1 = this.chronicDependentDiseases.find(x => x.id === element.id);
          if (data1) {
            this.tempChroniObj = [...this.tempChroniObj, data1];
          }
        });
        this.chronicDiseaseChanged(data, 1);
        this.addICDCodeDto = new ChronicIcd10CodeDto();
        selectIcdModal.hide();
        // this.facilityList = res;
        // this.LoadingData = false;
      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  }
  checkIcdCodeExist() {
    this.isIcdCodeExist = true;
    if (this.addICDCodeDto.icdCode) {
    this.addICDCodeDto.chronicConditionId = this.selectedChronicCondition.id;
    this.patientService.CheckIcdCodeExist(this.addICDCodeDto.icdCode).subscribe(
      (res: boolean) => {
        this.isIcdCodeExist = res;
        if(res) {
          this.toaster.warning("This ICD code already exist");
        }
      },
      (error: HttpResError) => {
        this.isIcdCodeExist = true;
        this.toaster.error(error.error, error.message);
      }
    );
    }
  }



  navigateBack() {
    if (
      !this.patientId ||
      (this.patientTempData && this.patientTempData["profileStatus"] === false)
    ) {
      this.location.back();
      return;
    }
    if (this.patientId) {
      this.router.navigateByUrl(
        "/admin/patient/" + this.patientId + "/summary"
      );
    }
  }

  getBillingProviders() {
    this.LoadingData = true;
    this.facilityService
      .getBillingProvidersByFacilityId(this.facilityId)
      .subscribe(
        (res: any) => {
          if (res) {
            this.BIllingProviderList = res;
          }
          this.LoadingData = false;
        },
        error => {}
      );
  }

  getStatesList() {
    this.ccmDataService.getStates().subscribe(
      (res: any) => {
        this.States = res;
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  getCityAndState() {
    this.PatientForm.controls.state.reset();
    this.PatientForm.controls.city.reset();
    if (this.PatientForm.controls.zip) {
      this.ccmDataService.getCityAndStates(this.zipCode).subscribe(
        (res: any) => {
          this.cityAndStateObj = res;
          if (this.cityAndStateObj.state) {
            const data = this.States.find(
              ob => ob.code === this.cityAndStateObj.state
            );
            this.PatientForm.get("state").setValue(data.code);
            this.PatientForm.get("city").setValue(this.cityAndStateObj.city);
          } else {
            this.toaster.warning("Zip Code not found!");
          }
        },
        (error: HttpResError) => {
          this.toaster.error(error.message, error.error || error.error);
        }
      );
    }
  }
  getMaillingCityAndState() {
    this.PatientForm.controls.maillingAddressState.reset();
    this.PatientForm.controls.maillingAddressCity.reset();
    if (this.PatientForm.controls.maillingAddressZipCode) {
      this.ccmDataService
        .getCityAndStates(this.maillingAddressZipCode)
        .subscribe(
          (res: any) => {
            this.cityAndStateObj = res;
            if (this.cityAndStateObj.state) {
              const data = this.States.find(
                ob => ob.code === this.cityAndStateObj.state
              );
              this.PatientForm.get("maillingAddressState").setValue(data.code);
              this.PatientForm.get("maillingAddressCity").setValue(
                this.cityAndStateObj.city
              );
            } else {
              this.toaster.warning("Zip Code not found!");
            }
          },
          (error: HttpResError) => {
            this.toaster.error(error.message, error.error || error.error);
          }
        );
    }
  }
  AssignCurrentAdrValue(isSameCurrentAddress: boolean) {
    this.IsSameCurrentAddress = !this.IsSameCurrentAddress;
    if (this.IsSameCurrentAddress) {
      this.PatientForm.get("mailingAddress").setValue(this.currentAddress);
      this.PatientForm.get("maillingAddressState").setValue(this.currentState);
      this.PatientForm.get("maillingAddressZipCode").setValue(this.zipCode);
      this.PatientForm.get("maillingAddressCity").setValue(this.currentCity);
    } else {
      this.PatientForm.get("mailingAddress").setValue("");
      this.PatientForm.get("maillingAddressState").setValue("");
      this.PatientForm.get("maillingAddressZipCode").setValue("");
      this.PatientForm.get("maillingAddressCity").setValue("");
    }
  }
  FillUserNameUserName(isSameCurrentAddress: boolean) {
    if (isSameCurrentAddress) {
      this.isSameUserName = false;
      this.PatientForm.get("userName").setValue(
        this.PatientForm.get("email").value
      );
    } else {
      this.PatientForm.get("userName").setValue("");
      this.isSameUserName = true;
    }
  }

  addPatient(skipDisease: boolean) {
    this.isAddingNewPatient = true;
    if (this.IsSameCurrentAddress) {
      this.PatientForm.get("mailingAddress").setValue(this.currentAddress);
      this.PatientForm.get("maillingAddressState").setValue(this.currentState);
      this.PatientForm.get("maillingAddressZipCode").setValue(this.zipCode);
      this.PatientForm.get("maillingAddressCity").setValue(this.currentCity);
    }
    Object.assign(this.patient, this.PatientForm.value);

    this.patient.chronicDiagnosesIds = new Array<number>();
    if (this.selectedCronicDiseases.length > 0) {
      this.selectedCronicDiseases.forEach(element => {
        this.patient.chronicDiagnosesIds.push(element.id);
      });
    }
    this.patient.facilityId = this.facilityId;
    this.patient.billingProviderId = this.BillingProviderId;
    this.patient.dateOfBirth = moment(
      this.patient.dateOfBirth, "MM-DD-YYYY"
    ).format("YYYY-MM-DD");
    this.patientService.addPatient(this.patient, this.FacilityUserId).subscribe(
      (res: any) => {
        this.physicianName = res.billingProviderName;
        this.PatientName = res.firstName + " " + res.lastName;
        this.isAddingNewPatient = false;
        this.patientId = res.id;
        this.toaster.success("Patient Added Successfully");
        if (
          res.email &&
          this.securityService.securityObject.userType !== UserType.Patient
        ) {
          this.allowPatientEmailEdit = false;
        }
        this.allowPatientEdit = true;
        this.patient.id = res.id;
        // this.patient = new PatientDto();
        // this.PatientForm.reset();
        // admin / consentdoc / 9;
        if (res.id && this.consentTaken) {
          this.router.navigateByUrl("admin/consentdoc/" + res.id);
        } else if(this.patientId) {
          this.router.navigateByUrl(`admin/patient/${res.id}/summary`);
        }else{
          this.goBack();
        }
        // this.staticTabs.tabs[3].disabled = false;
        // this.staticTabs.setActiveTab(4);
        // if (res && !skipDisease) {
        //   this.router.navigate(['/admin/patientConsent/', res.id]);
        // } else {
        // this.router.navigateByUrl('/admin/patients');
        // }
      },
      (error: HttpResError) => {
        this.isAddingNewPatient = false;
        this.toaster.error(error.error, error.error);
        // console.log(error);
      }
    );
  }
  goBack() {
    this.location.back();
  }
  getCronicDiseases() {
    this.patientService.getChronicConditions().subscribe(
      (res: any) => {
        this.cronicDiseaseList = res;
        this.tempcronicDiseaseList = res;
      },
      err => {}
    );
  }

  getDependentDiseases(id: number) {
    this.LoadingData = true;
    this.tempChroniObj = new Array<ChronicIcd10CodeDto>();
    this.patientService.getChronicDependentDiseases(id).subscribe(
      (res: any) => {
        this.LoadingData = false;
        this.chronicDependentDiseases = res;
        if (this.selectedCronicDiseases.length > 0) {
          this.selectedCronicDiseases.forEach(element => {
            const data = this.chronicDependentDiseases.find(
              x => x.id === element.id && x.chronicConditionId === id
            );
            if (data) {
              this.tempChroniObj = [...this.tempChroniObj, data];
            }
          });
        }
        if (this.tempSearchChroniObj) {
          const data23 = this.chronicDependentDiseases.find(
            x => x.icdCode === this.tempSearchChroniObj.icdCode
          );
          if (data23) {
            this.tempChroniObj = [...this.tempChroniObj, data23];
          }
        }
      },
      err => {
        this.LoadingData = false;
      }
    );
  }

  SearchObserver() {
    this.searchWatch.pipe(debounceTime(1000)).subscribe(x => {
      this.searchParam = x;
      if (this.searchParam) {
        this.GetFilteredChronicDiseases();
      }
    });
  }
GetFilteredChronicDiseases() {
    this.LoadingData = true;
    this.patientService.getFilteredChronicDiseases(this.searchParam).subscribe(
      (res: any) => {
        console.log(res);
        this.LoadingData = false;
        this.filteredChronicDiseaseList = res;
      },
      err => {
      this.LoadingData = false;
      }
    );
  }
  assignCondition(item: ChronicIcd10CodeDto) {
    if (item) {
      // let i = item.length - 1;
      this.getDependentDiseases(item.chronicConditionId);
      this.chronicDiseaseChanged(item, 1);
      this.cronicDiseaseList = new Array<{ id: 0; algorithm: "" }>();
      this.cronicDiseaseList = this.tempcronicDiseaseList;
          const data1 = this.cronicDiseaseList.find(x => x.id === item.chronicConditionId);
          if (data1) {
            this.selectedChronicCondition = data1;
          }
            // this.selectedChronicCondition = [...this.selectedChronicCondition, data1];

    } else {
      this.selectedChronicCondition = { id: 0, algorithm: ""};
    }
  }

  wikiSearch(searchParm: string) {
    this.wikiService.wikiSearch(searchParm).subscribe(data => {
      const dtaa = data;
    });
  }

  facilityChanged(facilityId: any) {
    if (facilityId) {
      this.facilityId = facilityId;
      this.BillingProviderId = null;
    } else {
      this.facilityId = 0;
      this.BIllingProviderList = new Array<CreateFacilityUserDto>();
    }
  }
  billingProviderId(facilityId: any) {
    this.LoadingData = true;
    this.facilityService.getBillingProvidersByFacilityId(facilityId).subscribe(
      (res: any) => {
        if (res) {
          this.BIllingProviderList = res;
        }
        this.LoadingData = false;
      },
      error => {}
    );
  }
  editPatient() {
    this.isUpdatingPatient = true;
    if (this.IsSameCurrentAddress) {
      this.PatientForm.get("mailingAddress").setValue(this.currentAddress);
      this.PatientForm.get("maillingAddressState").setValue(this.currentState);
      this.PatientForm.get("maillingAddressZipCode").setValue(this.zipCode);
      this.PatientForm.get("maillingAddressCity").setValue(this.currentCity);
    }
    let SaveObj = new PatientDto();
    if (this.PatientPreserve) {
      SaveObj = {...this.PatientPreserve, ...this.PatientForm.value};
    }
    // Object.assign(this.patient, this.PatientForm.value);
    // this.patient.chronicDiseasesIds = new Array<number>();
    // if (this.selectedCronicDiseases.length > 0) {
    //   this.selectedCronicDiseases.forEach(element => {
    //     this.patient.chronicDiseasesIds.push(element.id);
    //   });
    // }
    // if (this.patient.password === "TTeesstt--991122.") {
    //   this.patient.password = "";
    // }

    SaveObj.facilityId = this.facilityId;
    // this.facilityChanged(this.facilityId);
    SaveObj.userId = this.userId;
    SaveObj.billingProviderId = this.BillingProviderId;
    // this.patient.facilityId = this.facilityId;
    // // this.facilityChanged(this.facilityId);
    // this.patient.userId = this.userId;
    // this.patient.billingProviderId = this.BillingProviderId;
    SaveObj.dateOfBirth = moment(
      SaveObj.dateOfBirth, "MM-DD-YYYY"
    ).format("YYYY-MM-DD");
    this.patientService.editPatient(SaveObj).subscribe(
      (res: any) => {
        this.isUpdatingPatient = false;
        this.toaster.success("Patient Updated Successfully");
        // this.router.navigate(['/home/page']);
        this.navigateBack();
        this.patient = new PatientDto();
        this.PatientForm.reset();
      },
      (error: HttpResError) => {
        this.isUpdatingPatient = false;
        this.toaster.error(error.error, error.error);
        // console.log(error);
      }
    );
    const selectedCronicDiseases = new Array<number>();
    if (this.selectedCronicDiseases.length > 0) {
      this.selectedCronicDiseases.forEach(element => {
        selectedCronicDiseases.push(element.id);
      });
    }
    // this.patientService
    //   .UpdatePatientChronicDiseases(selectedCronicDiseases, this.patientId)
    //   .subscribe(
    //     (res: any) => {
    //       // this.PatientData.chronicDiseasesIds = this.selectedCronicDiseases;
    //       this.navigateBack();
    //       this.toaster.success("data saved successfully");
    //     },
    //     error => {
    //       this.toaster.error(error.message, error.error || error.error);
    //     }
    //   );
  }

  checkAvailibility(email: string) {
    this.userNameErrorMsg = '';
    this.emailinvalid = false;
    if (email && !this.patientId) {
      this.securityService.checkUserName(email).subscribe((res: boolean) => {
        if (res) {
          this.emailinvalid = false;
        } else {
          this.emailinvalid = true;
          // window.alert('Email address Already exist');
        }
      }, (err: HttpResError) => {
        if(err.status == 400){
          this.userNameErrorMsg = err.error;
        }else{
          this.toaster.error(err.error);
        }
      });
    }
  }
  checkEMRAvailibility(patientEmrId: string) {
    if (patientEmrId && !this.patientId) {
      this.patientService
        .checkEmrAvailability(patientEmrId, this.facilityId)
        .subscribe((res: boolean) => {
          if (res) {
            this.emrExist = true;
          } else {
            this.emrExist = false;
            // window.alert('Email address Already exist');
          }
        });
    }
  }

  chronicDiseaseChanged(item: ChronicIcd10CodeDto, isAdd: number) {
    if (isAdd === 1) {
      this.selectedCronicDiseases.push(item);
    } else if (isAdd === 0) {
      this.selectedCronicDiseases.splice(
        this.selectedCronicDiseases.findIndex(
          res => res.id === item["value"].id
        ),
        1
      );
    } else if (isAdd === 2) {
      this.selectedCronicDiseases.forEach(element => {
        const index = this.selectedCronicDiseases.findIndex(
          res => res.chronicConditionId === item.chronicConditionId
        );
        if (index >= 0) {
          this.selectedCronicDiseases.splice(index, 1);
          if (this.tempChroniObj.length > 0) {
            const tempArr = this.tempChroniObj.filter(
              x => x.chronicConditionId === item.chronicConditionId
            );
            if (tempArr.length > 0) {
              this.tempChroniObj = new Array<ChronicIcd10CodeDto>();
            }
          }
        }
      });
    }
  }

  startUpload(): void {
    if (this.patientConsentType !== 1) {
      this.patientService
        .AddCCMConsent(
          this.files[0],
          this.patientId,
          this.patientConsentType,
          this.Signature,
          (this.consentNature = 0)
        )
        .subscribe(
          res => {
            this.toaster.success("Patient Consent Taken.");
            this.router.navigate(["/admin/patient/", this.patientId]);
          },
          err => {
            // this.preLoader = 0;
            this.toaster.error(err.error, err.message);
          }
        );
    } else {
      this.router.navigate(["/admin/patient/", this.patientId]);
    }
  }
  uploadWrittenDoc(): void {
    this.isLoading = true;
    this.patientService
      .UploadCcmConsent(
        this.files[0],
        this.patientId,
        this.patientConsentType,
        (this.consentNature = 0),
        this.files[0].name,
      )
      .subscribe(
        res => {
          this.uploadFileUrl = res.fileURL;
          this.uploadFileName = this.files[0].name;
          this.isLoading = false;
          this.toaster.success("Patient Consent Taken.");
          // this.router.navigate(["/admin/patient/", this.patientId]);
        },
        err => {
          // this.preLoader = 0;
          this.isLoading = false;
          this.uploadFileName = "";
          this.toaster.error(err.error, err.message);
        }
      );
  }
  DeleteWrittenDoc() {
    if (this.uploadFileUrl) {
      this.patientService.DeleteWrittenDocument(this.uploadFileUrl).subscribe(
        res => {
          this.uploadFileUrl = "";
          this.uploadFileName = "";
          this.files[0].name = "";
          // this.patientConsentType = null;
          this.toaster.success("Delete Consent Taken.");
          // this.router.navigate(["/admin/patient/", this.patientId]);
        },
        err => {
          // this.preLoader = 0;
          this.uploadFileName = "";
          this.toaster.error(err.error, err.message);
        }
      );
    }
  }
  onUploadOutput(output: any): void {
    this.isLoading = true;
    if (output.target.files[0]) {
      this.files[0] = output.target.files[0];
    }

    // if (output.type === 'allAddedToQueue') {
    // } else if (output.type === 'addedToQueue') {
    //   this.files.push(output.file); // add file to array when added
    // } else if (output.type === 'uploading') {
    //   // update current data in files array for uploading file
    //   const index = this.files.findIndex(file => file.id === output.file.id);
    //   this.files[index] = output.file;
    // } else if (output.type === 'removed') {
    //   // remove file from array when removed
    //   this.files = this.files.filter((file: UploadFile) => file !== output.file);
    // } else if (output.type === 'dragOver') {
    //   this.dragOver = true;
    // } else if (output.type === 'dragOut') {
    // } else if (output.type === 'drop') {
    //   this.dragOver = false;
    // }
  }
  consentTypeChanged($event, consentType: ConsentType) {
    this.patientConsentType = consentType;
    if (consentType === ConsentType.Online) {
      if ($event.checked) {
      }
    }
    if (consentType === ConsentType.Written) {
    }
    if (consentType === ConsentType.Verbal) {
    }
  }
  transform(style) {
    return this.sanitizer.bypassSecurityTrustHtml(style);
    // return this.sanitizer.bypassSecurityTrustStyle(style);
    // return this.sanitizer.bypassSecurityTrustXxx(style); - see docs
  }
  getonlineCCMConsentDoc() {
    this.patientService
      .getDocumentContent(
        DocumentType.CcmConsentDoc,
        this.PatientName,
        this.physicianName
      )
      .subscribe(
        (res: any) => {
          // document.getElementById('consentDocument').innerHTML = res;
          // this.consentDocument = res;
          this.consentDocument = this.sanitizer.bypassSecurityTrustHtml(res);
          // this.consentDocument.toString();
        },
        err => {
          // this.preLoader = 0;
          this.toaster.error(err.error, err.message);
        }
      );
  }
  getPublicUrl(url: string) {
    // const importantStuff = window.open("", "_blank");
    let nUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl:  environment.baseUrl;
    nUrl =  environment.appUrl;
    nUrl = nUrl + 'success/loading';
    const importantStuff = window.open(nUrl);
    this.ccmDataService.getPublicPath(url).subscribe(
      (res: any) => {
        // importantStuff.location.href = res;
        if (url.toLocaleLowerCase().includes('.pdf')) {
          fetch(res).then(async (fdata: any) => {
            const slknasl = await fdata.blob();
            const blob = new Blob([slknasl], { type: 'application/pdf' });
            const objectURL = URL.createObjectURL(blob);
            importantStuff.close();
            this.objectURLStrAW = objectURL;
            this.viewPdfModal.show();
            // importantStuff.location.href = objectURL;
            // window.open(objectURL, '_blank');
          });
        } else {
          // window.open(res, "_blank");
          importantStuff.location.href = res;
          // setTimeout(() => {
          //   importantStuff.close();
          // }, 2000);
        }
      },
      err => {
        // this.preLoader = 0;
        this.toaster.error(err.error, err.message);
      }
    );
  }
  // MakePDF() {
  //   const elementHandler = {
  //     '#ignorePDF': function (element, renderer) {
  //       return true;
  //     }
  //   };
  //   const doc = new jsPDF({
  //     orientation: 'portrait',
  //     format: 'letter'
  //   });

  //   doc.fromHTML(document.getElementById('onlineConset'), 15, 15, {
  //     'width': 180, 'elementHandlers': elementHandler
  //   });
  //   ;
  //   doc.save('test.pdf');
  // }
  appenDsignature() {
    const sjd = document.getElementsByClassName("signature");
    sjd[0].innerHTML = "<span>" + this.Signature + "</span>";
    sjd[1].innerHTML = "<span>" + this.Signature + "</span>";
  }
  MakePDF() {
    let popupWinindow;
    let innerContents = document.getElementById("onlineConset").innerHTML;
    popupWinindow = window.open(
      "",
      "_blank",
      "width=865,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no,resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes"
    );
    popupWinindow.document.open();
    popupWinindow.document.write(
      '<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' +
        innerContents +
        "</html>"
    );
    popupWinindow.document.close();
    // const signature = "My Signature";
    // const docHead = document.head.outerHTML;
    // const printContents = document.getElementById("onlineConset").outerHTML;
    // const winAttr =
    //   "location=yes, statusbar=no, menubar=no, titlebar=no, toolbar=no,dependent=no, width=865, height=600, resizable=yes, screenX=200, screenY=200, personalbar=no, scrollbars=yes";

    // const newWin = window.open("", "_blank", winAttr);
    // const writeDoc = newWin.document;
    // writeDoc.open();
    // writeDoc.write(
    //   "<!doctype html><html>" +
    //     docHead +
    //     '<body onLoad="window.print()" style="background:none">' +
    //     printContents +
    //     "</body></html>"
    // );
    // writeDoc.close();
    // // newWin.focus();
    // newWin.print();
  }
  maillingAddress(value: any) {
    // $event.returnValue.valueOf();
  }
  changePrimaryPhoneAvailability(){
    if(this.primaryPhoneNotAvailable == false){
      this.PatientForm.controls['homePhone'].enable();
    }else {
      this.PatientForm.controls['homePhone'].disable();
    }
  }
}
