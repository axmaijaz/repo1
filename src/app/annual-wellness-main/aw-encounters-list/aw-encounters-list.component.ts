import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService } from 'ng-uikit-pro-standard';
import { AWEncounterListDto } from 'src/app/model/AnnualWellness/aw.model';

@Component({
  selector: 'app-aw-encounters-list',
  templateUrl: './aw-encounters-list.component.html',
  styleUrls: ['./aw-encounters-list.component.scss']
})
export class AwEncountersListComponent implements OnInit {
  PatientId: number;
  isCreatingEncounter: boolean;
  awEncountersList: AWEncounterListDto[];
  annualWellnessID: number;

  constructor(private location: Location, private toaster: ToastService , private router: Router, private route: ActivatedRoute, private awService: AwService) { }

  ngOnInit() {
    this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
    this.GetAWEncountersByPatientId();
  }
  GetAWEncountersByPatientId() {
    this.awService.GetAWEncountersByPatientId(this.PatientId).subscribe( (res: Array<AWEncounterListDto>) => {
      this.awEncountersList = res;
    });
  }
  goBack() {
    this.location.back();
  }
  AddAWEncounter() {
    this.isCreatingEncounter = true;
    this.awService.AddAWEncounter(this.PatientId).subscribe((res: number) => {
      this.isCreatingEncounter = false;
      this.router.navigateByUrl(`/annualWellness/AWMain/${this.PatientId}/${res}/awPatient`);
    },
    (err: HttpResError) => {
      this.isCreatingEncounter = false;
      this.toaster.error(err.error, err.message);
    });
  }
  ProceedNavigation(row: AWEncounterListDto) {
    this.router.navigateByUrl(`/annualWellness/AWMain/${this.PatientId}/${row.id}/awPatient`);
  }
}
