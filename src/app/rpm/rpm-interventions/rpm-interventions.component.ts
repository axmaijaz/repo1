import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { ToastService } from 'ng-uikit-pro-standard';
import { ECalendarValue, IDatePickerConfig } from 'ng2-date-picker';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { RpmService } from 'src/app/core/rpm.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { MRGoalStatus, MRInterventionStatus } from 'src/app/model/MonthlyReview/mReview.enum';
import { MRGoal, MRProblem, MRType } from 'src/app/model/MonthlyReview/mReview.model';
import { RpmMRGoals, RpmMRInterventions, RpmMrProblem, RpmMRType } from 'src/app/model/MonthlyReview/rpmMReview.model';
import { PatientRpmComponent } from '../patient-rpm/patient-rpm.component';

@Component({
  selector: 'app-rpm-interventions',
  templateUrl: './rpm-interventions.component.html',
  styleUrls: ['./rpm-interventions.component.scss']
})
export class RpmInterventionsComponent implements OnInit {
  @ViewChild("listItems", { read: ElementRef })
  public listItems: ElementRef<any>;
  @Output() onRpmNoteUpdate = new EventEmitter();
  public datePickerConfig: IDatePickerConfig = {
    allowMultiSelect: false,
    returnedValueType: ECalendarValue.StringArr,
    format: 'YYYY-MM-DD hh:mm A',
    appendTo: "body",
  };
  mrTypeList: RpmMRType[];
  selectedmrType: number;
  isLoadingProblems = false;
  mrProblemsList= new Array<RpmMrProblem>();
  displayGoalsList: RpmMRGoals[];
  tempDisplayGoalsList: RpmMRGoals[];
  mRInterventionStatusEnum = MRInterventionStatus;
  mRInterventionStatusList = this.dataFilterService.getEnumAsList(MRInterventionStatus);
  mRGoalStatusList = this.dataFilterService.getEnumAsList(MRGoalStatus);
  PatientId: number;
  constructor(private rpmService: RpmService, private toaster: ToastService, private route: ActivatedRoute, private dataFilterService: DataFilterService) { }

  ngOnInit(): void {
    // this.PatientId = +this.route.snapshot.paramMap.get("id");
    this.getRpmMRTypes();
  }

  getRpmMRTypes(){
    this.rpmService.GetRpmMRTypes().subscribe((res: any) => {
      this.mrTypeList = res;
      this.selectedmrType = this.mrTypeList[0].id;
      this.assignProblemsByTypeId(this.mrTypeList[0].id)

      // let tempArr = [];
      // this.mrTypeList.forEach((type) => {
      //   type.rpmMRProblems.forEach((item) => {
      //     item["active"] = false;
      //     tempArr = [...tempArr, ...item.rpmMRGoals];
      //   })
      // });
      // this.displayGoalsList = tempArr;
      // this.tempDisplayGoalsList = tempArr;
      // this.isLoadingProblems = false;
      // this.sortDisplayGOalsByActiveInterventions();
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }

  assignProblemsByTypeId(id){
    const searchedType = this.mrTypeList.find((type: RpmMRType) => type.id == id);
    this.mrProblemsList = searchedType.rpmMRProblems;
     let tempArr = [];
        searchedType.rpmMRProblems.forEach((item) => {
          item["active"] = false;
          tempArr = [...tempArr, ...item.rpmMRGoals];
        })
    this.displayGoalsList = tempArr;
    this.tempDisplayGoalsList = tempArr;
  }

  // GetMRProblemsByTypeId(typeId: number) {
  // sortDisplayGOalsByActiveInterventions() {
  //   this.displayGoalsList?.sort((y) => {
  //     const hasActiveInterv = y.rpmMRInterventions.find(
  //       (interv) => interv.status === MRInterventionStatus.Active
  //     );
  //     if (hasActiveInterv) {
  //       return -1;
  //     }
  //   });
  //   this.displayGoalsList?.forEach((x) => {
  //     x.mrPatientInterventions?.sort((y) => {
  //       if (y.status === MRInterventionStatus.Active) {
  //         return -1;
  //       }
  //     });
  //   });
  // }
  scrollLeft() {
    this.listItems.nativeElement.firstChild.scrollLeft -= 150;
  }

  scrollRight() {
    this.listItems.nativeElement.firstChild.scrollLeft += 150;
  }
  editIntervention(intrv, gIndex){
    if (intrv.status !== MRInterventionStatus["Not Started"]) {
      const currentDate = moment().format("YYYY-MM-DD");
      intrv.interventionDate = currentDate;
    }
  }
  InterventionNoteCHanged(interv, gIndex){

  }
  InterventionStatusCHanged(intrv: RpmMRInterventions, gIndex?: number){
    if (intrv.status && intrv.status === MRInterventionStatus.Active) {
      this.appendTextToRpmNotes(intrv.encounterStatement)
    }
  }
  appendTextToRpmNotes(eData: string) {
    this.onRpmNoteUpdate.emit(eData || '')
  }
  editGoal(goal){

  }
}
