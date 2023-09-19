import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService, TabsetComponent } from 'ng-uikit-pro-standard';
import { ActivatedRoute } from '@angular/router';
import { MedicareDataService } from 'src/app/core/medicare/medicare-data.service';
import { Location } from '@angular/common';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { EobJsonDto, EOBListDto, EobClaimDto, EobCatDto, Entry } from 'src/app/model/Medicare/eob.model';
import { stringify } from 'querystring';
import { DataFilterService } from 'src/app/core/data-filter.service';
import * as R4 from 'fhir/r4';

@Component({
  selector: 'app-medicare-eob',
  templateUrl: './medicare-eob.component.html',
  styleUrls: ['./medicare-eob.component.scss']
})
export class MedicareEobComponent implements OnInit {
  PatientId: number;
  isLoading: boolean;
  reportData: EobJsonDto;
  eobList = new Array<EOBListDto>();
  eobClaimsList = new Array<EobClaimDto>();
  loadingEobData: boolean;
  lineItemsCategoryObj: EobCatDto[];
  @ViewChild('FStepTabs2') staticTabs: TabsetComponent;
  groupedData: any[];
  openedWindow: Window;
  CurrentPageNO = 0;
  claimsDiagnoseArr: any[];
  entryList: Entry[] = [];
  total: number;
  constructor(private toaster: ToastService, private dataFilter: DataFilterService, private route: ActivatedRoute, private location: Location, private medicareService: MedicareDataService) { }

  ngOnInit() {
    this.PatientId = +this.route.snapshot.queryParams['patientID'];
    this.GetEobJsonData();
  }
  navigateBack() {
    this.location.back();
  }
  getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) { return null; }
    if (!results[2]) { return ''; }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  GetEobJsonData() {
    this.loadingEobData = true;
    this.medicareService.GetEobJsonData(this.PatientId, this.CurrentPageNO * 50).subscribe((res: EobJsonDto) => {
      this.loadingEobData = false;
      this.total = res.total;
      // console.table(res);
      const self = this.getParameterByName('startIndex', res.link.find(x => x.relation === 'self').url);
      const last = this.getParameterByName('startIndex', res.link.find(x => x.relation === 'last').url);
      // console.log(self + last);
      this.entryList = [...this.entryList, ...res.entry];
      if (self !== last) {
        this.CurrentPageNO++;
        this.toaster.info('Page No ' + this.CurrentPageNO + ' Data loaded');
        this.GetEobJsonData();
        return;
      } else {
        // this.entryList = [...this.entryList, ...res.entry];
      }
      this.eobList = [];
      this.reportData = res;
      this.reportData.entry = this.entryList;
      this.reportData.entry.forEach((entry) => {
        const claimTempDto = new EobClaimDto();
        const tempEobList = new Array<EOBListDto>();
        claimTempDto.claimAmount = entry.resource.payment?.amount?.value.toString();
        claimTempDto.claimStartDate = entry.resource.billablePeriod?.start;
        claimTempDto.claimEndDate = entry.resource.billablePeriod?.end;
        claimTempDto.claimId = entry.resource.id;
        let codesStr = '';
        entry.resource.diagnosis?.forEach(diagnose => {
          diagnose.diagnosisCodeableConcept?.coding.forEach(dCOd => {
            codesStr +=  dCOd.code + ' ' + dCOd.display + ' ,';
          });
        });
        claimTempDto.diagnoseCodes = codesStr;
        entry.resource.item.forEach(item => {
          const eobItem = new EOBListDto();
          /// Date
          eobItem.dateOfService.startDate = item.servicedPeriod?.start;
          eobItem.dateOfService.endDate = item.servicedPeriod?.end;
          /// procedure
          let codesStr1 = '';
          item.service?.coding.forEach(code => {
            codesStr1 += code.code + ' ,';
          });
          eobItem.procedureCode_Desc = codesStr1;
          /// MOdifier
          let modifierStr = '';
          if (item.modifier) {
            item.modifier.forEach(modifier => {
              modifier.coding.forEach(mcoding => {
                modifierStr += mcoding.code + ' ,';
              });
            });
          }
          eobItem.modifier_Desc = modifierStr;
          /// Quantity
          eobItem.quantityBuildUnits = item.quantity.value.toString();
          /// Submitted + Allowed
          if (item.adjudication) {
            item.adjudication.forEach(adj => {
              adj.category.coding.forEach(ajdCOding => {
                if (!adj.amount) {
                  return;
                }
                if (!adj.amount.value) {
                  adj.amount.value = 0;
                }
                if (ajdCOding.code === 'https://bluebutton.cms.gov/resources/variables/line_sbmtd_chrg_amt') {
                  eobItem.submittedAmountCharges = adj.amount.value.toString();
                }
                if (ajdCOding.code === 'https://bluebutton.cms.gov/resources/variables/line_alowd_chrg_amt') {
                  eobItem.allowedAmount = adj.amount.value.toString();
                }
              });
              eobItem.non_Covered = (+eobItem.submittedAmountCharges - +eobItem.allowedAmount).toString();
            });
          } else {
            eobItem.submittedAmountCharges = '';
            eobItem.allowedAmount = '';
            eobItem.non_Covered = '';
          }
          /// place
          let place = '';
          if (item.locationCodeableConcept) {
            item.locationCodeableConcept.coding.forEach(catCOde => {
              place += catCOde.code + ' ' + catCOde.display + ' ,';
            });
          }
          eobItem.placeOfService = place;
          /// type
          let type = '';
          if (item.category) {
            item.category.coding.forEach(catCOde => {
              type += catCOde.code + ' ' + catCOde.display + ' ,';
            });
          }
          eobItem.typeOfService = type;
          tempEobList.push(eobItem);
          this.eobList.push(eobItem);
        });
        claimTempDto.detailItems = tempEobList;
        this.eobClaimsList.push(claimTempDto);
      });
      this.CategoriesLineItems();
      this.filterDiagnoses();
      console.log(JSON.stringify(this.reportData));
    }, (error: HttpResError) => {
      // this.loadingEobData = false;
      this.GetEOBCode();
      this.toaster.error(error.error , error.message);
    });
  }
  filterDiagnoses() {
    const diagnoseArr = [];
    this.reportData.entry.forEach((entry) => {
      entry.resource.diagnosis?.forEach(diagnose => {
        diagnose.diagnosisCodeableConcept?.coding.forEach(dCOd => {
            const obj = {
              code: dCOd.code,
              display: dCOd.display
            };
            diagnoseArr.push(obj);
        });
      });
    });
    this.claimsDiagnoseArr = diagnoseArr;
  }
  CategoriesLineItems() {
    this.lineItemsCategoryObj = [];
    this.eobList.forEach(lineItem => {
      if (lineItem.procedureCode_Desc && lineItem.procedureCode_Desc.split(',').length > 0) {
        const icdCodes = lineItem.procedureCode_Desc.split(',').filter(i => i);
        icdCodes.forEach(code => {
          code = code.trim();
          if (code === '99201' || code === '99202' || code === '99203' || code === '99204' || code === '99205' || code === '99206' || code === '99207' || code === '99208'
          || code === '99209' || code === '99210' || code === '99211' || code === '99212' || code === '99213' || code === '99214' || code === '99215') {
            const catObj = {
              category: 'Office Visit',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '99281' || code === '99282' || code === '99283' || code === '99284' || code === '99285' || code === '99286' || code === '99287' || code === '99288') {
            const catObj = {
              category: 'Emergency Room Visit ',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '99221' || code === '99222' || code === '99223' || code === '99224' || code === '99225' || code === '99226') {
            const catObj = {
              category: 'Hospitalization : In-patient',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '99234' || code === '99235' || code === '99236') {
            const catObj = {
              category: 'Hospitalization : Out-patient',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else
          // Folowing CPT codes are related to Prevtenive Care
          if (code === 'G0442' || code === 'G0443') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Alcohol Misuse Screening & Counseling (NCD 210.8)',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '82947' || code === '82950' || code === '82951') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Diabetes Screening',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0446') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Intensive Behavioral Therapy (IBT) for Cardiovascular Disease (CVD)',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0009') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Pneumococcal Vaccine & Administration',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0101') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Screening Pelvic Examinations (includes a clinical breast examination) ',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0438' || code === 'G0439' || code === 'G0468') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Annual Wellness Visit (AWV)',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '99497' || code === '99498') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Advance Care Planning',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0108' || code === 'G0109') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Diabetes Self-Management Training (DSMT)',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0447' || code === 'G0473') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Intensive Behavioral Therapy (IBT) for Obesity',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '76706') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Ultrasound Screening for Abdominal Aortic Aneurysm (AAA)',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '0554T' || code === '0555T' || code === '0556T' || code === '0557T' || code === '0558T' || code === '76977' || code === '77078' || code === '77080' || code === '77081' || code === '77085' || code === 'G0130') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Bone Mass Measurements',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0117' || code === 'G0118') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Glaucoma Screening',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0008') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Influenza Virus Vaccine & Administration',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0102' || code === 'G0103') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Prostate Cancer Screening',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '80061') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Cardiovascular Disease Screening Tests',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0499') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Hepatitis B Virus (HBV) Screening',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0402' || code === 'G0403' || code === 'G0404' || code === 'G0405' || code === 'G0468') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Initial Preventive Physical Examination (IPPE)',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '81528' || code === '82270' || code === 'G0104' || code === 'G0105' || code === 'G0106' || code === 'G0120' || code === 'G0121' || code === 'G0328') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Colorectal Cancer Screening',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0010') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Hepatitis B Virus (HBV) Vaccine & Administration',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0296' || code === 'G0297') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Lung Cancer Screening Counseling and Annual Screening for Lung Cancer With Low Dose Computed Tomography (LDCT)',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '99406' || code === '99407') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Counseling to Prevent Tobacco Use',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0472') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Hepatitis C Virus (HCV) Screening',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '97802' || code === '97803' || code === '97804' || code === 'G0270' || code === 'G0271') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Medical Nutrition Therapy (MNT)',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '77063' || code === '77067') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Screening Mammography',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G0444') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Depression Screening',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === '80081' || code === 'G0432' || code === 'G0433' || code === 'G0435' || code === 'G0475') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Human Immunodeficiency Virus (HIV) Screening',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else if (code === 'G9873' || code === 'G9874' || code === 'G9875' || code === 'G9876' || code === 'G9877' || code === 'G9878' || code === 'G9879' || code === 'G9880'
            || code === 'G9881' || code === 'G9882' || code === 'G9883' || code === 'G9884' || code === 'G9885' || code === 'G9890' || code === 'G9891') {
            const catObj = {
              parent: 'Preventive Care',
              category: 'Medicare Diabetes Prevention Program Expanded Model',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          } else {
            const catObj = {
              category: 'Others',
              eobItem: lineItem
            };
            this.lineItemsCategoryObj.push(catObj);
          }
        });
      }
    });
    this.groupedData = [];
    // const osdna = this.dataFilter.ArrayGroupByChildObject(this.lineItemsCategoryObj, 'category');
    // const osdna34 = this.dataFilter.distictArrayByProperty(this.lineItemsCategoryObj, 'category');
    const tempArr = this.dataFilter.ArrayGroupBy(this.lineItemsCategoryObj, 'category');
    let i = null;
    tempArr.forEach((element, index) => {
      if (element.key === 'Others') {
        i = index;
      }
    });
    if (i || i === 0) {
      const tempObj = tempArr[i];
      tempArr.splice(i, 1);
      tempArr.push(tempObj);
    }
    this.groupedData = tempArr;
    setTimeout(() => {
      this.staticTabs.setActiveTab(1);
    }, 300);
  }

  GetEOBCode() {
    this.loadingEobData = true;
    this.medicareService.GetEobCode(this.PatientId).subscribe((res: any) => {
      this.loadingEobData = false;
      this.GetPatientConsent(res);
    }, (error: HttpResError) => {
      this.loadingEobData = false;
      this.toaster.error(error.error , error.message);
    });
  }
  GetPatientConsent(url: string) {
    // this.openedWindow = window.open(url, '_blank');
    if (url.includes('http://localhost:5000')) {
      // url = url.replace('http://localhost:5000', 'https://api.healthforcehub.link');
    }
    this.openedWindow = window.open( url, 'Snopzer', 'left=20,top=20,width=500,height=500,toolbar=1,resizable=0' );
    this.openedWindow.addEventListener('message', eve => {
      // this.checkIfDeviceConsentTaken();
    });
    window.addEventListener('message', eve => {
      if (eve.data.type === 'refreshEob') {
      }
      // this.checkIfDeviceConsentTaken();
    });
  }
}
