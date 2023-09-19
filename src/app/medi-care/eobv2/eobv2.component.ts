import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastService, TabsetComponent, ModalDirective } from 'ng-uikit-pro-standard';
import { ActivatedRoute } from '@angular/router';
import { MedicareDataService } from 'src/app/core/medicare/medicare-data.service';
import { Location } from '@angular/common';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { EobJsonDto, EOBListDto, EobClaimDto, EobCatDto, Entry, InPatientDto, DetailDiagnoseDto, DetailProcedure, DetailCareTeam, OutPatientDto, OPLineItemDto, CarrierPatientDto, PDEPatientDto } from 'src/app/model/Medicare/eob.model';
import { DataFilterService } from 'src/app/core/data-filter.service';
@Component({
  selector: 'app-eobv2',
  templateUrl: './eobv2.component.html',
  styleUrls: ['./eobv2.component.scss']
})
export class EOBV2Component implements OnInit {

  PatientId: number;
  isLoading: boolean;
  reportData: EobJsonDto;
  eobClaimsList = new Array<EobClaimDto>();
  loadingEobData: boolean;
  lineItemsCategoryObj: EobCatDto[];
  @ViewChild('FStepTabs2') staticTabs: TabsetComponent;
  groupedData: any[];
  openedWindow: Window;
  CurrentPageNO = 0;
  carrierLength = 0;
  pdeLength = 0;
  claimsDiagnoseArr: any[];
  entryList: Entry[] = [];
  total: number;
  inPatientClaims = new Array<InPatientDto>();
  outPatientClaims = new Array<OutPatientDto>();
  carrierPatientClaims = new Array<CarrierPatientDto>();
  pdePatientClaims = new Array<PDEPatientDto>();
  selectedInPatient = new InPatientDto();
  selectedOutPatient = new OutPatientDto();
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
        this.toaster.info('Page No ' + this.CurrentPageNO + ' Data loaded, Out of ' + (this.total / 50).toFixed());
        this.GetEobJsonData();
        // return;
      } else {
      }
      this.reportData = res;
      this.reportData.entry = this.entryList;
      this.inPatientClaims = [];
      this.outPatientClaims = [];
      this.carrierPatientClaims = [];
      this.pdePatientClaims = [];
      this.carrierLength = 0;
      this.pdeLength = 0;
      this.ModifyEobData();
    }, (error: HttpResError) => {
      // this.loadingEobData = false;
      this.GetEOBCode();
      this.toaster.error(error.error , error.message);
    });
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
  ModifyEobData() {
    this.reportData.entry.forEach((entry, index) => {
      entry.resource.type.coding?.forEach(rCoding => {
        // console.log(rCoding.code + '  ' + index);
        if (rCoding.code === 'INPATIENT') {
          this.handleInPatient(entry);
        }
        if (rCoding.code === 'OUTPATIENT') {
          this.handleOutPatient(entry);
        }
        if (rCoding.code === 'CARRIER') {
          this.handleCarrierPatient(entry);
        }
        if (rCoding.code === 'PDE') {
          this.handlePDEPatient(entry);
        }
      });
    });
  }
  handlePDEPatient(entry: Entry) {
    // const facility = entry.resource.facility;
    this.pdeLength++;
    // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    // const colorCode = '#' + randomColor;
    const providersArr = new Array<DetailCareTeam>();
    entry.resource.careTeam?.forEach(team => {
      const nTeam = new DetailCareTeam();
      nTeam.name = '';
      nTeam.sequence = team.sequence;
      nTeam.system = team.provider.identifier.system;
      nTeam.value = team.provider.identifier.value;
      team.role?.coding?.forEach(tCode => {
        nTeam.display = tCode.display;
        providersArr.push(nTeam);
        // if (tCode.code === 'primary') {
        //   nOutPatient.primaryProvider = team.provider.identifier.value;
        // }
      });
    });
    entry.resource.item.forEach(item => {
      const nCarrierPatient = new PDEPatientDto();
      nCarrierPatient.colorCode = this.pdeLength % 2 === 0 ? '#fffff' : '#ffffff';
      nCarrierPatient.item = item;
      nCarrierPatient.careTeam = providersArr;
      let providerN = '';
      item.careTeamLinkId?.forEach(linkId => {
        const fProvider = nCarrierPatient.careTeam?.find(x => x.sequence === linkId);
        if (fProvider) {
          providerN += fProvider.value + ', ';
        }
      });
      nCarrierPatient.provider = providerN;
      nCarrierPatient.date = item.servicedDate;
      let serviceCodeArr = '';
      let serviceDisplayArr = '';
      item.service?.coding?.forEach(iCode => {
        serviceCodeArr += iCode.code + ', ';
        serviceDisplayArr += iCode.display + ', ';
      });
      nCarrierPatient.drugNo = serviceCodeArr;
      nCarrierPatient.drugName = serviceDisplayArr;

      let DrugAmm = '';
      let DrugAmmDisplay = '';
      item.adjudication?.forEach(adj => {
        let find = false;
        adj.category?.coding?.forEach(adjCode => {
          if (adjCode.code?.includes('tot_rx_cst_amt')) {
            find = true;
            DrugAmmDisplay += adjCode.display.toString() + ', ';
          }
        });
        if (find) {
          DrugAmm += adj.amount?.value?.toString() + ', ';
        }
      });
      nCarrierPatient.drugCost = DrugAmm + ' ' + DrugAmmDisplay;

      this.pdePatientClaims.push(nCarrierPatient);
    });
  }
  handleCarrierPatient(entry: Entry) {
    // const facility = entry.resource.facility;
    this.carrierLength++;
    // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    // const colorCode = '#' + randomColor;
    const providersArr = new Array<DetailCareTeam>();
    entry.resource.careTeam?.forEach(team => {
      const nTeam = new DetailCareTeam();
      nTeam.name = '';
      nTeam.sequence = team.sequence;
      nTeam.system = team.provider.identifier.system;
      nTeam.value = team.provider.identifier.value;
      team.role?.coding?.forEach(tCode => {
        nTeam.display = tCode.display;
        providersArr.push(nTeam);
        // if (tCode.code === 'primary') {
        //   nOutPatient.primaryProvider = team.provider.identifier.value;
        // }
      });
    });
    const diagnoseArr = new Array<DetailDiagnoseDto>();
    entry.resource.diagnosis.forEach(diag => {
      const dDiagnose = new DetailDiagnoseDto();
      dDiagnose.sequence = diag.sequence;
      diag.type?.forEach(dType => {
        dType.coding?.forEach(dCode => {
          dDiagnose.codableSystem = dCode.system;
          dDiagnose.type = dCode.code;
        });
      });
      diag.diagnosisCodeableConcept?.coding.forEach(concept => {
        dDiagnose.code = concept.code;
        dDiagnose.display = concept.display;
        diagnoseArr.push(dDiagnose);
      });
    });
    entry.resource.item.forEach(item => {
      const nCarrierPatient = new CarrierPatientDto();
      // nCarrierPatient.entry = entry;
      nCarrierPatient.item = item;
      nCarrierPatient.colorCode = this.carrierLength % 2 === 0 ? '#fffff' : '#ffffff';
      nCarrierPatient.careTeam = providersArr;
      nCarrierPatient.diagnoses = diagnoseArr;
      let providerN = '';
      item.careTeamLinkId?.forEach(linkId => {
        const fProvider = nCarrierPatient.careTeam?.find(x => x.sequence === linkId);
        if (fProvider) {
          providerN += fProvider.value + ', ';
        }
      });
      nCarrierPatient.provider = providerN;
      let diagnoseN = '';
      item.diagnosisLinkId?.forEach(linkId => {
        const fDiagnose = nCarrierPatient.diagnoses?.find(x => x.sequence === linkId);
        if (fDiagnose) {
          diagnoseN += fDiagnose.code + ' ' + fDiagnose.display + ', ';
        }
      });
      nCarrierPatient.diagnosesStr = diagnoseN;
      nCarrierPatient.date = item.servicedPeriod.start;
      let AllowedAmm = '';
      let AllowedAmmDisplay = '';
      item.adjudication?.forEach(adj => {
        let find = false;
        adj.category?.coding?.forEach(adjCode => {
          if (adjCode.code?.includes('line_alowd_chrg_amt')) {
            find = true;
            AllowedAmmDisplay += adjCode.display.toString() + ', ';
          }
        });
        if (find) {
          AllowedAmm += adj.amount?.value?.toString() + ', ';
        }
      });
      nCarrierPatient.allowedCost = AllowedAmm + ' ' + AllowedAmmDisplay;
      let serviceArr = '';
      item.service?.coding?.forEach(iCode => {
        serviceArr += iCode.code + ', ';
      });
      nCarrierPatient.serviceCode = serviceArr;
      let sCategory = '';
      item.category?.coding?.forEach(iCode => {
        sCategory += iCode.display + ', ';
      });
      nCarrierPatient.category = sCategory;
      this.carrierPatientClaims.push(nCarrierPatient);

    });
  }
  handleInPatient(entry: Entry) {
    const nInPatient = new InPatientDto();
    // const facility = entry.resource.facility;
    nInPatient.entry = entry;
    nInPatient.fromDate = entry.resource.hospitalization?.start || '';
    nInPatient.toDate = entry.resource.hospitalization?.end || '';
    nInPatient.totalCost = entry.resource.totalCost.value.toString();
    nInPatient.totalPayment = entry.resource.payment.amount.value.toString();
    let pDiagnoses = '';

    entry.resource.diagnosis.forEach(diag => {
      const dDiagnose = new DetailDiagnoseDto();
      dDiagnose.sequence = diag.sequence;
      let principle = false;
      diag.type?.forEach(dType => {
        dType.coding?.forEach(dCode => {
          if (dCode.code === 'principal') {
            principle = true;
          }
          dDiagnose.codableSystem = dCode.system;
          dDiagnose.type = dCode.code;
        });
      });
      if (principle) {
        diag.diagnosisCodeableConcept.coding.forEach(concept => {
          pDiagnoses += concept.display;
        });
      }
      diag.diagnosisCodeableConcept?.coding.forEach(concept => {
        dDiagnose.code = concept.code;
        dDiagnose.display = concept.display;
        nInPatient.diagnoses.push(dDiagnose);
      });
    });
    nInPatient.principleDiagnoses = pDiagnoses;
    entry.resource.procedure?.forEach(procedure => {
      const pNew = new DetailProcedure();
      pNew.date = procedure.date.toString() || '';
      procedure.procedureCodeableConcept?.coding?.forEach(pCode => {
        pNew.code = pCode.code;
        pNew.display = pCode.display;
        nInPatient.procedures.push(pNew);
      });
    });
    entry.resource.careTeam?.forEach(team => {
      const nTeam = new DetailCareTeam();
      nTeam.name = '';
      nTeam.sequence = team.sequence;
      nTeam.system = team.provider.identifier.system;
      nTeam.value = team.provider.identifier.value;
      team.role?.coding?.forEach(tCode => {
        nTeam.display = tCode.display;
        nInPatient.careTeam.push(nTeam);
      });
    });

    this.inPatientClaims.push(nInPatient);
  }
  handleOutPatient(entry: Entry) {
    const nOutPatient = new OutPatientDto();
    // const facility = entry.resource.facility;
    nOutPatient.entry = entry;
    nOutPatient.fromDate = entry.resource.hospitalization?.start || '';
    nOutPatient.toDate = entry.resource.hospitalization?.end || '';
    nOutPatient.totalCost = entry.resource.totalCost.value.toString();
    nOutPatient.totalPayment = entry.resource.payment.amount.value.toString();
    let pDiagnoses = '';

    entry.resource.diagnosis.forEach(diag => {
      const dDiagnose = new DetailDiagnoseDto();
      dDiagnose.sequence = diag.sequence;
      let principle = false;
      diag.type?.forEach(dType => {
        dType.coding?.forEach(dCode => {
          if (dCode.code === 'principal') {
            principle = true;
          }
          dDiagnose.codableSystem = dCode.system;
          dDiagnose.type = dCode.code;
        });
      });
      if (principle) {
        diag.diagnosisCodeableConcept.coding.forEach(concept => {
          pDiagnoses += concept.display;
        });
      }
      diag.diagnosisCodeableConcept?.coding.forEach(concept => {
        dDiagnose.code = concept.code;
        dDiagnose.display = concept.display;
        nOutPatient.diagnoses.push(dDiagnose);
      });
    });
    nOutPatient.principleDiagnoses = pDiagnoses;
    entry.resource.careTeam?.forEach(team => {
      const nTeam = new DetailCareTeam();
      nTeam.name = '';
      nTeam.sequence = team.sequence;
      nTeam.system = team.provider.identifier.system;
      nTeam.value = team.provider.identifier.value;
      team.role?.coding?.forEach(tCode => {
        nTeam.display = tCode.display;
        nOutPatient.careTeam.push(nTeam);
        if (tCode.code === 'primary') {
          nOutPatient.primaryProvider = team.provider.identifier.value;
        }
      });
    });
    entry.resource.item.forEach(item => {
      const lineItem = new OPLineItemDto();
      let providerN = '';
      item.careTeamLinkId?.forEach(linkId => {
        const fProvider = nOutPatient.careTeam?.find(x => x.sequence === linkId);
        if (fProvider) {
          providerN += fProvider.value + ', ';
        }
      });
      lineItem.provider = providerN;
      let serviceArr = '';
      item.service?.coding?.forEach(iCode => {
        serviceArr += iCode.code;
      });
      lineItem.service = serviceArr;
      let chargeAmm = '';
      let chargeAmmDisplay = '';
      item.adjudication?.forEach(adj => {
        let find = false;
        adj.category?.coding?.forEach(adjCode => {
          if (adjCode.code?.includes('rev_cntr_tot_chrg_amt')) {
            find = true;
            chargeAmmDisplay += adjCode.display.toString() + ', ';
          }
        });
        if (find) {
          chargeAmm += adj.amount?.value?.toString() + ', ';
        }
      });
      lineItem.chargeAmount = chargeAmm;
      lineItem.chargeDisplay = chargeAmmDisplay;
      let paymentAmm = '';
      let paymentAmmDisplay = '';
      item.adjudication?.forEach(adj => {
        let find = false;
        adj.category?.coding?.forEach(adjCode => {
          if (adjCode.code?.includes('rev_cntr_prvdr_pmt_amt')) {
            find = true;
            paymentAmmDisplay += adjCode.display.toString() + ', ';
          }
        });
        if (find) {
          paymentAmm += adj.amount?.value?.toString() + ', ';
        }
      });
      lineItem.paymentAmount = paymentAmm;
      lineItem.paymentDisplay = paymentAmmDisplay;
      nOutPatient.lineItems.push(lineItem);
    });

    this.outPatientClaims.push(nOutPatient);
  }
  OpenInPatientDetails(value: InPatientDto, inPatientDetailsModel: ModalDirective) {
    this.selectedInPatient = value;
    inPatientDetailsModel.show();

  }
  OpenOutPatientDetails(value: OutPatientDto, outPatientDetailsModel: ModalDirective) {
    this.selectedOutPatient = value;
    outPatientDetailsModel.show();

  }
}
