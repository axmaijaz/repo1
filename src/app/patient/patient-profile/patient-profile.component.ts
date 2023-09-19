import { Component, OnInit, ViewChild, ElementRef, NgZone, AfterViewInit } from "@angular/core";
import { PatientsService } from "src/app/core/Patient/patients.service";
import { SecurityService } from "src/app/core/security/security.service";
import {
  ChronicIcd10CodeDto,
  PatientDto,
  EditPatientProfileDto
} from "src/app/model/Patient/patient.model";
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import {
  AppUserAuth,
  ChnagePasswordDto
} from "src/app/model/security/app-user.auth";
import { ToastService, ModalDirective } from "ng-uikit-pro-standard";
import { CcmDataService } from "src/app/core/ccm-data.service";
import { HttpResError } from "src/app/model/common/http-response-error";
import { State } from "src/app/model/AppData.model";
import { MapsAPILoader } from "@agm/core";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { SendPhoneNoVerificationDto, VerifyPhoneNumberDto } from "src/app/model/Facility/facility.model";
import { AppDataService } from "src/app/core/app-data.service";
import { PasswordValidator } from "src/app/validators/password.validator";
@Component({
  selector: "app-patient-profile",
  templateUrl: "./patient-profile.component.html",
  styleUrls: ["./patient-profile.component.scss"]
})
export class PatientProfileComponent implements OnInit, AfterViewInit {
  @ViewChild("verificationModal") verificationModal: ModalDirective;
  patientId: number;
  selectedCronicDiseases = new Array<ChronicIcd10CodeDto>();
  patientData = new PatientDto();
  nameCaption: string;
  securityObject: AppUserAuth = null;
  changePasswordForm: FormGroup;
  PatientForm: FormGroup;
  currentAddress: string;
  selectedCountry: any;
  currentCity: string;
  CareProviderInfo = new Array<any>();
  currentState: string;
  maillingAddressZipCode: number;
  zipCode: number;
  IsSameCurrentAddress = true;
  cityAndStateObj: any;
  States = new Array<State>();
  editPatientProfileDto = new EditPatientProfileDto();
  editOption = "CInfo";

  // google autocomplete library parameters
  @ViewChild("search")
  public searchElementRef: ElementRef;
  @ViewChild("searchMaillingAddress")
  public searchMaillingAddressRef: ElementRef;
  // @ViewChild("search") searchElementRef;
  // @ViewChild("searchMaillingAddress") searchMaillingAddressRef;
  @ViewChild("zipCode") zipCodeRef: ElementRef;
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
  selectAddress = "currentAddress";
  searchWatch = new Subject<string>();
  twoFactorEnabled: string;
  disablingTwoFA: boolean;
  enalblingTwoFA: boolean;

  verifyPhoneNoDto = new VerifyPhoneNumberDto();
  sendPhoneNoVerifictionDto = new SendPhoneNoVerificationDto();
  verificationUserName: string;
  qrCOdeString: string;
  gettingKey: boolean;
  qrCOdeStringSave: any;
  codeString: string;
  formattedKey: any;
  showQRCode = true;
  isAuthenticationSuccess = false;
  countriesList: any;
  isLoading: boolean;


  constructor(
    private patientService: PatientsService,
    private securityService: SecurityService,
    private fb: FormBuilder,
    private toaster: ToastService,
    private appData: AppDataService,
    private ccmDataService: CcmDataService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}

  ngOnInit() {

    this.changePasswordForm = this.fb.group({
      // userId: ['', [Validators.required, Validators.email]],
      oldPassword: ["", Validators.required],
      newPassword: ["",  Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(20), PasswordValidator.cannotContainSpace])],
      verifyPassword: ["", Validators.required]
    });
    this.patientId = this.securityService.securityObject.id;
    this.GetAllCountries();
    setTimeout(() => {
      this.getPatientDetail();
      this.getNameCaption();
      this.getCareProviderInfoByPatientId();
    }, 400);
    this.PatientForm = this.fb.group({
      patientId: [0],
      currentAddress: ["", [Validators.required]],

      mailingAddress: [""],
      maillingAddressState: [""],
      maillingAddressCity: [""],
      maillingAddressZipCode: [""],
      emergencyContactName: [""],
      emergencyContactRelationship: [""],
      emergencyContactPrimaryPhoneNo: ["", [Validators.required]],
      emergencyContactSecondaryPhoneNo: [""],
      email: ["", [Validators.email]],
      city: [""],
      state: [""],
      zip: ["", [Validators.required, Validators.maxLength(5)]],
      primaryPhoneNo: ["", [Validators.required]],
      secondaryContactNo: [""],
      countryCallingCode: [""],
    });
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
    this.getStatesList();
     //// google api places
    this.GetUserAuthDetails();
  }
  GetAllCountries(){
    this.patientService.GetAllCountries().subscribe((res: any) => {
      this.countriesList = res;
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
  google() {
        this.mapsAPILoader.load().then(() => {
          this.geoCoder = new google.maps.Geocoder();
            this.googleApi();
        });
  }
  ngAfterViewInit() {
    // this.mapsAPILoader.load().then(() => {
    //   this.geoCoder = new google.maps.Geocoder();
    //     this.googleApi();
    // });
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
    //  console.log('1nd elment', this.searchElementRef);
     }

       this.autocomplete2 = new google.maps.places.Autocomplete(
        this.searchMaillingAddressRef.nativeElement,
        {
          types: ["address"],
          componentRestrictions: { country: "us" }
        }
      );
      // console.log('2nd elment', this.searchMaillingAddressRef);

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
  getNameCaption() {
    const fullName = this.securityService.securityObject.fullName.split(" ");
    if (fullName.length === 2) {
      this.nameCaption = fullName[0].slice(0, 1) + fullName[1].slice(0, 1);
    } else {
      this.nameCaption = fullName[0].slice(0, 2);
    }
  }
  getPatientDetail() {
    if (this.patientId) {
      //  this.FacilityModal.show();
      this.patientService.getPatientDetail(this.patientId).subscribe(
        (res: any) => {
          if (res) {
            // this.sendPhoneNoVerifictionDto.phoneNumber = res.homePhone;
            this.PatientForm.patchValue(res);
            if(!res.countryCallingCode){
              const country =  this.countriesList.filter((country) => country.callingCode == "1");
              this.selectedCountry = country[3];
            }else if(res.countryCallingCode == "1"){
              const country =  this.countriesList.filter((country) => country.callingCode == "1");
              this.selectedCountry = country[3];
            }
            else{
            const country =  this.countriesList.filter((country) => country.callingCode == res.countryCallingCode);
            this.selectedCountry = country[0];
            }
            this.PatientForm.get("primaryPhoneNo").setValue(res.homePhone);
            this.PatientForm.get("secondaryContactNo").setValue(
              res.personNumber
            );
            this.patientData = res;
            if (this.patientData.homePhone) {
              this.patientData.maskedHomePhone = this.patientData.homePhone.replace(
                /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                "($1)$2-$3"
              );
            }
            if (this.patientData.emergencyContactPrimaryPhoneNo) {
              this.patientData.emergencyContactPrimaryPhoneNo = this.patientData.emergencyContactPrimaryPhoneNo.replace(
                /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                "($1)$2-$3"
              );
            }
            if (this.patientData.personNumber) {
              this.patientData.personNumber = this.patientData.personNumber.replace(
                /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                "($1)$2-$3"
              );
            }
            if (this.patientData.emergencyContactSecondaryPhoneNo) {
              this.patientData.emergencyContactSecondaryPhoneNo = this.patientData.emergencyContactSecondaryPhoneNo.replace(
                /^(\d{0,3})(\d{0,3})(\d{0,4})/,
                "($1)$2-$3"
              );
            }
          }
        },
        error => {
        }
      );
      this.patientService.getPatientsChronicDiseases(this.patientId).subscribe(
        (res: any) => {
          if (res) {
            Object.assign(this.selectedCronicDiseases, res);
          }
        },
        error => {
        }
      );
    }
  }
  getCareProviderInfoByPatientId() {
    this.patientService.getPatientCareProviers(this.patientId).subscribe(
      (res: any) => {
        if (res) {
          this.CareProviderInfo = res;
        }
      },
      error => {
      }
    );
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
  changePassword() {
    const cahangePasswordObj = new ChnagePasswordDto();
    cahangePasswordObj.oldPassword = this.changePasswordForm.get(
      "oldPassword"
    ).value;
    cahangePasswordObj.newPassword = this.changePasswordForm.get(
      "newPassword"
    ).value;
    cahangePasswordObj.userId = this.securityService.securityObject.appUserId.toString();
    this.securityService.changePassword(cahangePasswordObj).subscribe(
      (res: any) => {
        this.changePasswordForm.reset();
        this.toaster.success("Password Updated Successfully");
      },
      (error: any) => {
        this.toaster.error(error.message, error.error || error.error);
      }
    );
  }
  editCotactInformation() {
    Object.assign(this.editPatientProfileDto, this.PatientForm.value);
    this.editPatientProfileDto.patientId = this.patientId;
    this.editPatientProfileDto.countryCallingCode = "1";
    this.patientService
      .EditPatientProfile(this.editPatientProfileDto)
      .subscribe(
        (res: any) => {
          this.toaster.success("Your profile is updated");
          this.getPatientDetail();
        },
        (error: HttpResError) => {

          this.toaster.error(error.message, error.error || error.error);
        }
      );
  }
  GetUserAuthDetails() {
    this.securityService.GetUserAuthDetails(this.securityService.securityObject.appUserId).subscribe(
      (res: any) => {
        if (res.twoFactorEnabled) {
          this.twoFactorEnabled = 'Yes';
        } else {
          this.twoFactorEnabled = 'No';
        }
      },
      (err) => {
        this.gettingKey = false;
        this.toaster.error(err.error);
      }
    );
  }
  GetAuthenticatorKey(modal: ModalDirective) {
    this.gettingKey = true;
    modal.show();
    this.securityService.GetAuthenticatorKey(this.securityService.securityObject.userName).subscribe(
      (res: any) => {
        this.gettingKey = false;
        this.qrCOdeString = res.authenticatorUri;
        this.formattedKey = res.sharedKey;
        this.qrCOdeStringSave = res.unFormattedKey;
      },
      (err) => {
        // this.isLoading = false;
        this.gettingKey = false;
        this.toaster.error(err.error);
      }
    );
  }
  navigateOnPlaystore() {
    var url = 'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en';
    var win = window.open(url, '_blank');
      // win.opener = null;
      win.focus();
  }
  navigateOnIStore() {
    var url = 'https://apps.apple.com/us/app/google-authenticator/id388497605';
    var win = window.open(url, '_blank');
      // win.opener = null;
      win.focus();
  }
  RegisterAuthenticator(modal: ModalDirective) {
    this.gettingKey = true;
    modal.show();
    this.securityService.RegisterAuthenticator(this.codeString, this.qrCOdeStringSave).subscribe(
      (res: any) => {
        // modal.hide();
        this.getPatientDetail();
        this.gettingKey = false;
        this.isAuthenticationSuccess = true;
        this.twoFactorEnabled = 'Yes';
        this.appData.TwoFactorEnabled = 'Yes';
        this.toaster.success('Two factor authentication enabled');
      },
      (err) => {
        // this.isLoading = false;
        this.gettingKey = false;
        this.toaster.error(err.error);
      }
    );
  }
  EnableTwoFactorAuthentication() {
    this.enalblingTwoFA = true;
    this.securityService.Enable2FA().subscribe(
      (res: any) => {
        this.enalblingTwoFA = false;
        this.twoFactorEnabled = 'Yes';
        this.toaster.warning('Two factor authentication enabled');
      },
      (err) => {
        // this.isLoading = false;
        this.enalblingTwoFA = false;
        this.toaster.error(err.error);
      }
    );
  }
  DisbleTwoFactorAuthentication() {
    this.disablingTwoFA = true;
    this.securityService.Disable2FA().subscribe(
      (res: any) => {
        this.disablingTwoFA = false;
        this.twoFactorEnabled = 'No';
        this.toaster.warning('Two factor authentication disabled');
      },
      (err) => {
        // this.isLoading = false;
        this.disablingTwoFA = false;
        this.toaster.error(err.error);
      }
    );
  }
  sendPhoneNoVerificationToken(row: any) {
    // this.isLoading = true;
    this.verificationUserName = row.firstName + " " + row.lastName;
    this.sendPhoneNoVerifictionDto.phoneNumber = row.homePhone;
    this.sendPhoneNoVerifictionDto.maskPhoneNumber = row.maskedHomePhone;
    this.sendPhoneNoVerifictionDto.userName = row.userName;
    this.sendPhoneNoVerifictionDto.countryCallingCode = row.countryCallingCode;
    this.securityService
      .SendPhoneNoVerificationToken(this.sendPhoneNoVerifictionDto)
      .subscribe(
        (res: any) => {
          // this.isLoading = false;
          // this.loadFacilityUsers();
          // this.toaster.success("Facility User deleted successfully");
        },
        (err) => {
          // this.isLoading = false;
          this.toaster.error(err.error);
        }
      );
  }
  verifyPhoneNumber() {
    this.verifyPhoneNoDto.userName = this.sendPhoneNoVerifictionDto.userName;
    this.securityService.VerifyPhoneNumber(this.verifyPhoneNoDto).subscribe(
      (res: any) => {
        // this.isLoading = false;
        this.verificationModal.hide();
        // this.loadFacilityUsers();
        this.toaster.success("Phone No Verified successfully");
        this.getPatientDetail();
        this.sendPhoneNoVerifictionDto = new SendPhoneNoVerificationDto();
        this.verifyPhoneNoDto = new VerifyPhoneNumberDto();
      },
      (err) => {
        // this.isLoading = false;
        this.toaster.error(err.error);
      }
    );
  }
  sendVerifyEmail() {
    const userName = this.patientData.userName;
    const email = this.patientData.email;
    this.isLoading = false;
    this.securityService.sendVerifyEmail(userName, email).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.toaster.success("Verification email sent !");
      },
      (err) => {
        this.isLoading = false;
        this.toaster.error(err.error);
      }
    );
  }
}
