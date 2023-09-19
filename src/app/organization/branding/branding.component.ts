import { Component, Input, OnInit } from '@angular/core';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import { ToastService } from 'ng-uikit-pro-standard';
import { AwsService } from 'src/app/core/aws/aws.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { getDirectChildElement } from 'ngx-drag-drop/dnd-utils';
import { AddBrandingDto } from 'src/app/model/branding.model';
import { environment } from 'src/environments/environment';
import { BrandingService } from 'src/app/core/branding.service';

@Component({
  selector: 'app-branding',
  templateUrl: './branding.component.html',
  styleUrls: ['./branding.component.scss']
})
export class BrandingComponent implements OnInit {
  @Input() facilityId: number;
  @Input() orgId: number;
  @Input() logoPath: string;

  settingIcon: boolean;
  logos: AddBrandingDto[] = [
    { id: 'logo1', height: 64, width: 64,  name: 'fav-64.png', src: '' },
    { id: 'logo2', height: 265, width: 1024,  name: 'logo-1024-265.png', src: '' },
    { id: 'logo3', height: 1024, width: 1024,  name: 'logo-1024-1024.png', src: '' },
  ]
  folderKey= '';
  selectedFile: FileList;
  selectedLogo: AddBrandingDto;
  selectedPath: string;

  constructor(private toaster: ToastService, private brandingService: BrandingService, private awsService: AwsService) { }

  ngOnInit(): void {
    if (this.logoPath) {
      this.AlreadyHasLogos();
    }
  }

  AlreadyHasLogos() {
    this.logos.forEach(logo => {
      logo.src = `https://${environment.logoAws}.s3.amazonaws.com/${this.logoPath}${logo.name}`
    });
  }
  onFileChange(file: FileList, logo: AddBrandingDto) {
    if (file && file[0]) {
      if (!file[0].name.split('.').pop().includes('png')) {
        this.toaster.warning('Logo format must be png');
        return;
      };
      var reader = new FileReader();
      if (file[0].type.match(/^image\//)) {
      }
      reader.onload = (e) => {
        logo.src = e.target.result as any;
        // Initiate the JavaScript Image object.
        let img = new Image()
        img.src = (window.URL || window.webkitURL).createObjectURL(file[0])
        img.onload = () => {
          if (img.height !== logo.height || img.width !== logo.width) {
            this.toaster.warning(`Logo resolution should be ${logo.width}x${logo.height}`)
            logo.src = null;
            return;
          }
          // var folderKey = '';
          if (this.facilityId) {
            this.folderKey = `fcl-${this.facilityId}`
          }
          if (this.orgId) {
            this.folderKey = `org-${this.orgId}`
          }
          this.selectedFile = file;
          this.selectedLogo = logo;
          this.selectedPath = `${this.folderKey}/${logo.name}`;
          // if (this.folderKey) {
          //   this.UploadLogo(logo, file, `${this.folderKey}/${logo.name}`)
          // }
          //  alert(img.width + " " + img.height);
        }
        // var folderKey = '';
        // if (this.facilityId) {
        //   folderKey = `fcl-${this.facilityId}`
        // }
        // if (this.orgId) {
        //   folderKey = `org-${this.orgId}`
        // }
        // if (folderKey) {
        //   this.UploadLogo(logo, file, `${folderKey}/${logo.name}`)
        // }
      };

      reader.readAsDataURL(file[0]);
    }
  }

  UploadLogo() {
    this.selectedLogo.uploading = true;
    const upload = this.awsService.uploadUsingSdkForProgress(this.selectedFile[0], this.selectedPath, environment.logoAws);
    upload.on('httpUploadProgress', (progress: ManagedUpload.Progress) => {
      this.selectedLogo.percentage = Math.round(progress.loaded / progress.total * 100);
    });
    upload.promise().then(
      (data) => {
        this.selectedLogo.uploading = false;
        // this.toaster.success('Document uploaded.');
        if (this.orgId) {
          this.SetOrganizationLogos()
        }

        if (this.facilityId) {
          this.SetFacilityLogos();
        }
      },
      err => {
        this.selectedLogo.uploading = false;
        this.toaster.error(err);
      }
    );
  }

  SetFacilityLogos() {
    this.settingIcon = true;
    this.brandingService.SetFacilityLogos(this.facilityId)
      .subscribe(
        (res: any) => {
          this.toaster.success('Icons uploaded successfully')
          this.settingIcon = false;
        },
        (err: HttpResError) => {
          this.toaster.error(err.message);
          this.settingIcon = false;
        }
      );
  }
  SetOrganizationLogos() {
    this.settingIcon = true;
    this.brandingService.SetOrganizationLogos(this.orgId)
      .subscribe(
        (res: any) => {
          this.toaster.success('Icons uploaded successfully')
          this.settingIcon = false;
        },
        (err: HttpResError) => {
          this.toaster.error(err.message);
          this.settingIcon = false;
        }
      );
  }



}
