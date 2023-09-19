import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ToastService } from 'ng-uikit-pro-standard';
import { Router, ActivatedRoute } from '@angular/router';
import { AwService } from 'src/app/core/annualWellness/aw.service';
import { Location } from '@angular/common';
import { AWPatienttabEncounterDto, AWSectionDto, AWQuestionDto } from 'src/app/model/AnnualWellness/aw.model';
import { HttpResError } from 'src/app/model/common/http-response-error';



@Component({
  selector: 'app-aw-patient-tab',
  templateUrl: './aw-patient-tab.component.html',
  styleUrls: ['./aw-patient-tab.component.scss']
})
export class AwPatientTabComponent implements OnInit {
  annualWellnessID: number;
  PatientId: number;
  awEncounterPTabQuestions: AWPatienttabEncounterDto;
  pTabDataObj = {};
  isLoadingPTABData: boolean;
  data: any;
  InstrumentalActivitiesObj = {};
  // HelpAvailableObj = {};
  DailyLivingObj = {};
  currentMenuId = 'section1';
  currentSection = 'section1';
  isPatientForm = false;
  disableRiskSection = false;
  isPainScreening = false;

  constructor(@Inject(DOCUMENT) document, private location: Location, private toaster: ToastService, private router: Router, private route: ActivatedRoute, private awService: AwService) {
    this.isPatientForm = route.snapshot.data['patientForm'];
  }


  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    if (window.pageYOffset > 500) {
      const element = document.getElementById('scorll-spy');
      if (!element) {
        return;
      }
      element.classList.add('sticky-scroll-spy');
    } else {
      const element = document.getElementById('scorll-spy');
      if (!element) {
        return;
      }
      element.classList.remove('sticky-scroll-spy');
    }
    const activeIds = [];
    for (let index = 1; index < 10; index++) {
      let cIndex = index;
      if (!this.isPainScreening && index === 7) {
        cIndex = 8;
      }
      if (this.isScrolledIntoView(`section${cIndex}`)) {
        activeIds.push(`section${cIndex}`);
      }
    }
    this.currentSection = activeIds.length > 0 ? activeIds[0] : this.currentSection;
  }


  // onSectionChange(sectionId: string) {
  //   this.currentSection = sectionId;
  // }
  // scrollTo(section) {
  //   document.querySelector('#' + section).scrollIntoView({ behavior: 'smooth'});
  // }

  ngOnInit() {
    this.PatientId = +this.route.pathFromRoot[2].snapshot.paramMap.get('id');
    this.annualWellnessID = +this.route.pathFromRoot[2].snapshot.paramMap.get('awId');
    if (!this.PatientId) {
      this.PatientId = +this.route.pathFromRoot[3].snapshot.paramMap.get('id');
      this.annualWellnessID = +this.route.pathFromRoot[3].snapshot.paramMap.get('awId');
    }
    this.GetAWEncounterPatientTabById();
  }
  GetAWEncounterPatientTabById() {
    this.isLoadingPTABData = true;
    this.awService.GetAWEncounterPatientTabById(this.annualWellnessID).subscribe((res: AWPatienttabEncounterDto) => {
      this.awEncounterPTabQuestions = res;
      // console.log('res', res);
      this.awEncounterPTabQuestions.awSections.forEach((section: AWSectionDto) => {
        section.awQuestions.forEach((question: AWQuestionDto) => {
          this.pTabDataObj[question.shortDesc] = {};
          this.pTabDataObj[question.shortDesc]['question'] = question;
          this.pTabDataObj[question.shortDesc]['answer'] = question.response;
          this.pTabDataObj[question.shortDesc]['section'] = section;
          if (question.shortDesc === 'InstrumentalActivities') {
            if (question.response) {
              const selectedOptions = question.response.split(',');
              selectedOptions.forEach(element => {
                if (element) {
                  this.InstrumentalActivitiesObj[element] = true;
                }
              });
            }
          }
          // if (question.shortDesc === 'HelpAvailable') {
          //   if (question.response) {
          //     const selectedOptions = question.response.split(',');
          //     selectedOptions.forEach(element => {
          //       if (element) {
          //         this.HelpAvailableObj[element] = true;
          //       }
          //     });
          //   }
          // }
          if (question.shortDesc === 'DailyLiving') {
            if (question.response) {
              const selectedOptions = question.response.split(',');
              selectedOptions.forEach(element => {
                if (element) {
                  this.DailyLivingObj[element] = true;
                }
              });
            }
          }
        });
        if (section.description === 'Pain Screening') {
          this.isPainScreening = true;
        }
      });
      // console.log('data', this.pTabDataObj);
      if (this.awEncounterPTabQuestions.bmi && this.awEncounterPTabQuestions.bmi < 30 ) {
        this.disableRiskSection = true;
      }
      if (!this.pTabDataObj['PainMang']) {
        this.pTabDataObj['PainMang'] = {};
      }
      if (!this.pTabDataObj['PrescribedMed']) {
        this.pTabDataObj['PrescribedMed'] = {};
      }
      if (!this.pTabDataObj['PainLevel']) {
        this.pTabDataObj['PainLevel'] = {};
      }
      if (this.pTabDataObj['PainMang'].answer == "true") {
        this.pTabDataObj['PainMang'].answer = true;
      } else if (this.pTabDataObj['PainMang'].answer == "false") {
        this.pTabDataObj['PainMang'].answer = false;
      }
      if (this.pTabDataObj['PrescribedMed'].answer == "true") {
        this.pTabDataObj['PrescribedMed'].answer = true;
      } else if (this.pTabDataObj['PrescribedMed'].answer == "false") {
        this.pTabDataObj['PrescribedMed'].answer = false;
      }
      this.isLoadingPTABData = false;
    },
      (err: HttpResError) => {
        // this.isLoadingPTABData = false;
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      });
  }
  saveQuestion(data: { question: AWQuestionDto, answer: string, section: AWSectionDto }, desc: string) {
    if (!data.question || !data.question.id) {
      data.question = new AWQuestionDto();
      data.question.id = 0;
    }
    const obj = { questionId: data.question.id, response: data.answer, shortDesc: desc, awEncounterId: this.annualWellnessID };
    this.awService.EditAWQuestion(obj).subscribe((res: AWPatienttabEncounterDto) => {

    },
      (err: HttpResError) => {
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      });
  }
  editStaffNote(awSectionId: number, sNote: string) {
    // this.data.sectionId = sectionId;
    // this.data.note = note;
    const obj = { sectionId: awSectionId, note: sNote };
    this.awService.EditStaffNote(obj).subscribe((res: any) => {

    },
      (err: HttpResError) => {
        // this.isCreatingEncounter = false;
        this.toaster.error(err.error, err.message);
      });
  }
  saveInstrumentalActivitiesObj() {
    let answer = '';
    Object.keys(this.InstrumentalActivitiesObj).forEach((value, index, obj) => {
      if (this.InstrumentalActivitiesObj[value]) {
        answer += value + ',';
      }
    });
    this.pTabDataObj['InstrumentalActivities'].answer = answer;
    this.saveQuestion(this.pTabDataObj['InstrumentalActivities'], 'InstrumentalActivities');
  }
  // saveHelpAvailableObj() {
  //   let answer = '';
  //   Object.keys(this.HelpAvailableObj).forEach((value, index, obj) => {
  //     if (this.HelpAvailableObj[value]) {
  //       answer += value + ',';
  //     }
  //   });
  //   this.pTabDataObj['HelpAvailable'].answer = answer;
  //   this.saveQuestion(this.pTabDataObj['HelpAvailable'], 'HelpAvailable');
  // }
  NoneCheckedInstrument() {
    if (this.InstrumentalActivitiesObj['None']) {
      Object.keys(this.InstrumentalActivitiesObj).forEach((value, index, obj) => {
        if (value === 'None') {
          return;
        }
        this.InstrumentalActivitiesObj[value] = false;
      });
    }
    this.saveInstrumentalActivitiesObj();
  }
  NoneCheckedDailyLiving() {
    if (this.DailyLivingObj['None']) {
      Object.keys(this.DailyLivingObj).forEach((value, index, obj) => {
        if (value === 'None') {
          return;
        }
        this.DailyLivingObj[value] = false;
      });
    }
    this.saveDailyLivingObj();
  }
  saveDailyLivingObj() {
    let answer = '';
    Object.keys(this.DailyLivingObj).forEach((value, index, obj) => {
      if (this.DailyLivingObj[value]) {
        answer += value + ',';
      }
    });
    this.pTabDataObj['DailyLiving'].answer = answer;
    this.saveQuestion(this.pTabDataObj['DailyLiving'], 'DailyLiving');
  }
  isScrolledIntoView(elementId: string) {
      const elem = document.getElementById(elementId);
      const docViewTop = $(window).scrollTop();
      const docViewBottom = docViewTop + $(window).height();

      const elemTop = $(elem).offset().top;
      const elemBottom = elemTop + $(elem).height();

      return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
  }
}
