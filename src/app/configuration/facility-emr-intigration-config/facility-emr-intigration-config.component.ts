import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { ManageExtensionService } from 'src/app/core/manage-extension.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { Emr } from 'src/app/extension-manager/extensionManager.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { FacilityFormsDto, FacilityDto, EditFacilityIntegrationConfigDto } from 'src/app/model/Facility/facility.model';
import { EmrConnectService } from 'src/app/core/emr-connect.service';
import { AthenaPracticeListDto } from 'src/app/model/EmrConnect/emr-connect.model';

@Component({
  selector: 'app-facility-emr-intigration-config',
  templateUrl: './facility-emr-intigration-config.component.html',
  styleUrls: ['./facility-emr-intigration-config.component.scss']
})
export class FacilityEmrIntigrationConfigComponent implements OnInit {
  facilityId: number;
  facilityData = new FacilityDto();
  editFacilityIntegrationConfigObj = new EditFacilityIntegrationConfigDto();
  loading = false;
  emrList= new Array<Emr>();
  facilityEMR: Emr;
  savingConf: boolean;
  getPracticeDetail: boolean;
  practiceInfo = new AthenaPracticeListDto();
  validPractice: boolean;


  constructor(private facilityService: FacilityService,
    private route: ActivatedRoute,
    private extService: ManageExtensionService,
    private emrConnect: EmrConnectService,
    private toaster: ToastService,) { }

  ngOnInit(): void {
    this.facilityId = +this.route.snapshot.paramMap.get("facilityId");
    this.GetEmrList();
    // this.getFacilityDetail(this.facilityId);
  }
  GetEmrList(){
    this.loading = true;
    this.extService.GetEmrList().subscribe((res: any) => {
      this.emrList = res;
      this.getFacilityDetail(this.facilityId);
    }, (err: HttpResError) => {
      this.loading = false;
      this.toaster.error(err.error);
    })
  }
  GetPracticeInfo(){
    this.validPractice = false;
    this.practiceInfo = new AthenaPracticeListDto()
    this.getPracticeDetail = true;
    this.emrConnect.GetPracticeInfo(this.facilityId , this.editFacilityIntegrationConfigObj.practiceEmrId).subscribe((res: AthenaPracticeListDto) => {
      this.practiceInfo = res;
      this.getPracticeDetail = false;
      if (this.practiceInfo.totalcount) {
        this.validPractice = true;
      }
    }, (err: HttpResError) => {
      this.getPracticeDetail = false;
      this.toaster.error(err.error);
      this.validPractice = false;
    })
  }
  getFacilityDetail(id: number) {
    this.loading = true;
    this.facilityService.getFacilityDetail(id).subscribe(
      (res: FacilityDto) => {
        this.loading = false;
        this.facilityData = res;
        this.editFacilityIntegrationConfigObj.integrationEnabled = this.facilityData.integrationEnabled;
        this.editFacilityIntegrationConfigObj.scrapingEnabled = this.facilityData.scrapingEnabled;
        this.editFacilityIntegrationConfigObj.practiceEmrId = this.facilityData.practiceEmrId;
        this.editFacilityIntegrationConfigObj.claimSubmission = this.facilityData.claimSubmission;
        this.editFacilityIntegrationConfigObj.clinicalDocumentSubmission = this.facilityData.clinicalDocumentSubmission;
        this.editFacilityIntegrationConfigObj.canSetCcmEnrollmentStatus = this.facilityData.canSetCcmEnrollmentStatus;
        this.editFacilityIntegrationConfigObj.vitalsSubmission = this.facilityData.vitalsSubmission;
        this.facilityEMR = this.emrList.find(x => x.id == res.emrId);
        if (res.practiceEmrId) {
          this.GetPracticeInfo()
        }
      },
      (error: HttpResError) => {
        this.loading = false;
        // this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  IntigrationEnabledChanged() {
    if (this.editFacilityIntegrationConfigObj.integrationEnabled) {
      return;
    }
    this.editFacilityIntegrationConfigObj.claimSubmission = false;
    this.editFacilityIntegrationConfigObj.clinicalDocumentSubmission = false;
    this.editFacilityIntegrationConfigObj.scrapingEnabled = false;
    this.editFacilityIntegrationConfigObj.canSetCcmEnrollmentStatus = false;
    this.editFacilityIntegrationConfigObj.vitalsSubmission = false;
    this.editFacilityIntegrationConfigObj.practiceEmrId = '';
    this.validPractice = false;
  }
  EditFacilityIntegrationConfig() {
    this.savingConf = true;
    this.editFacilityIntegrationConfigObj.facilityId = this.facilityId;
    this.facilityService.EditFacilityIntegrationConfig(this.editFacilityIntegrationConfigObj).subscribe(
      (res) => {
        this.savingConf = false;
        this.toaster.success(`Configuration saved successfully`);
      },
      (error: HttpResError) => {
        this.savingConf = false;
        // this.IsLoading = true;
        this.toaster.error(error.error, error.message);
      }
    );
  }
}
