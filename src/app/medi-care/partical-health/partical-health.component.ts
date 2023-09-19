import { Component, OnInit } from '@angular/core';
import { MedicareDataService } from 'src/app/core/medicare/medicare-data.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { HttpResError } from 'src/app/model/common/http-response-error';
import * as FileSaver from 'file-saver';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-partical-health',
  templateUrl: './partical-health.component.html',
  styleUrls: ['./partical-health.component.scss']
})
export class ParticalHealthComponent implements OnInit {
  isLoadingPData: boolean;
  reportData: any;
  isLoadingPXMLData: boolean;
  ssnNumber: string;
  PatientId: number;

  constructor(private medicareService: MedicareDataService, private toaster: ToastService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.PatientId = +this.route.snapshot.paramMap.get('id');
    // this.PatientId = +this.route.snapshot.queryParams['patientID'];
    // this.GetParticleHealthZip();
  }

  GetParticleHealthZip() {
    this.isLoadingPData = true;
    this.medicareService.GetParticleHealthZip(this.PatientId, this.ssnNumber).subscribe((res: any) => {
      this.isLoadingPData = false;
      console.table(res);
      FileSaver.saveAs(
        new Blob([res], { type: 'application/zip' }),
        `ParticalHealthData.zip`
      );
      this.reportData = res;
    }, (error: HttpResError) => {
      this.isLoadingPData = false;
      this.toaster.error(error.error , error.message);
    });
  }
  GetParticleHealthxml() {
    this.isLoadingPXMLData = true;
    this.medicareService.GetParticleHealthxml().subscribe((res: any) => {
      this.isLoadingPXMLData = false;
      const blb    = new Blob([res], {type: "application/xml"});
      const reader = new FileReader();

      // // This fires after the blob has been read/loaded.
      // reader.addEventListener('loadend', (e) => {
      //   const text = e.srcElement['result'];
      //   console.log(e);
      //   const textArea = document.createElement('textarea');
      //   // textArea.style.display = 'none';
      //   textArea.value = text;
      //   document.body.appendChild(textArea);
      //   textArea.select();
      //   textArea.setSelectionRange(0, 99999);
      //   document.execCommand('copy');
      //   textArea.remove();
      //   // copyDataBtn.title = 'Copied';
      //   this.toaster.success('Content Copied');
      // });

      // // Start reading the blob as text.
      // reader.readAsText(blb);















      // FileSaver.saveAs(
      //   new Blob([res], { type: 'application/xml' }),
      //   `ParticalHealthData.xml`
      // );
      // this.reportData = res;
    }, (error: HttpResError) => {
      this.isLoadingPXMLData = false;
      this.toaster.error(error.error , error.message);
    });
  }
  goIframeBack() {
    const ele = document.getElementById('partcalHealthIframe') as any;
    ele.contentWindow.history.back();
  }
  goIframeFoward() {
    const ele = document.getElementById('partcalHealthIframe') as any;
    ele.contentWindow.history.forward();
  }
}
