import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { Router } from "@angular/router";
import { MrAdminService } from 'src/app/core/mr-admin.service';

@Component({
  selector: "app-manage-mr",
  templateUrl: "./manage-mr.component.html",
  styleUrls: ["./manage-mr.component.scss"]
})
export class ManageMrComponent implements OnInit {
  isCCMMR= true;
  constructor(private router: Router, public mrService: MrAdminService) {}

  ngOnInit() {}
  MRGoalsMvc() {
    let baseUrl = environment.baseUrl;
    baseUrl = baseUrl.replace("api/", "MRGoalsMvc");
    window.open(baseUrl);
  }
  MRInterventionsMvc() {
    let baseUrl = environment.baseUrl;
    baseUrl = baseUrl.replace("api/", "MRInterventionsMvc");
    window.open(baseUrl);
  }
  MRProblemsMvc() {
     let baseUrl = environment.baseUrl;
    baseUrl = baseUrl.replace("api/", "MRProblemsMvc");
    window.open(baseUrl);
  }
  MRTypesMvc() {
    let baseUrl = environment.baseUrl;
    baseUrl = baseUrl.replace("api/", "MRTypesMvc");
    window.open(baseUrl);
  }
  AssessmentTypesMvc() {
    let baseUrl = environment.baseUrl;
    baseUrl = baseUrl.replace("api/", "AssessmentTypesMvc");
    window.open(baseUrl);
  }
  AssessmentProblemsMvc() {
    let baseUrl = environment.baseUrl;
    baseUrl = baseUrl.replace("api/", "AssessmentProblemsMvc");
    window.open(baseUrl);
  }
  AssessmentQuestionsMvc() {
    let baseUrl = environment.baseUrl;
    baseUrl = baseUrl.replace("api/", "AssessmentQuestionsMvc");
    window.open(baseUrl);
  }
  IncrementMRVersion() {
    this.mrService.IncrementMRVersion().subscribe(res => {

    });
  }
  mrTypeChange(){
    this.mrService.mrTypeChanges.next();
  }
}
