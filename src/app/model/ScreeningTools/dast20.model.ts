export class Dast20QuestionsDto {
    qText: string;
    prop: string;
  }
export class Dast20QuestionsData {
    static questions: Dast20QuestionsDto[] = [
      { prop: 'haveYouUserOtherDrugs' , qText: 'Have you used drugs other than those required for medical reasons?'},
      { prop: 'haveYouAbusedPrescriptionDrugs' , qText: 'Have you abused prescription drugs?'},
      { prop: 'abusedMoreThanOneDrug' , qText: 'Do you abuse more than one drug at a time?' },
      { prop: 'getThroughWeekWithOutUsingDrugs' , qText: 'Can you get through the week without using drugs? ' },
      { prop: 'ableToStopUsingDrugs' , qText: 'Are you always able to stop using drugs when you want to? ' },
      { prop: 'blackoutsOrFlashbacks' , qText: 'Have you had "blackouts" or "flashbacks" as a result of drug use?' },
      { prop: 'feelBadAboutDrugsUse' , qText: 'Do you ever feel bad or guilty about your drug use?'},
      { prop: 'spouseComplainAboutDrugs' , qText: 'Does your spouse (or parents) ever complain about your involvement with drugs?'},
      { prop: 'drugsCreateProblemsWithYourSpouse' , qText: 'Has drug abuse created problems between you and your spouse or your parents?'},
      { prop: 'lostFriendsForDrugUsage' , qText: 'Have you lost friends because of your use of drugs?' },
      { prop: 'neglectedFamilyForDrugsUsage' , qText: 'Have you neglected your family because of your use of drugs?' },
      { prop: 'inTroubleAtWorkDueToDrugs' , qText: 'Have you been in trouble at work because of drug abuse?' },
      { prop: 'lostJobDueToDrugAbuse' , qText: 'Have you lost a job because of drug abuse?' },
      { prop: 'fightsUnderDrugInfluence' , qText: 'Have you gotten into fights when under the influence of drugs?' },
      { prop: 'engagedInIllegalActivities' , qText: 'Have you engaged in illegal activities in order to obtain drugs?' },
      { prop: 'arrestedForPossessingDrugs' , qText: 'Have you been arrested for possession of illegal drugs?' },
      { prop: 'experiencedWithdrawalSymptomsStoppingDrugs' , qText: 'Have you ever experienced withdrawal symptoms (felt sick) when you stopped taking drugs?' },
      { prop: 'hadMedicalProblems' , qText: 'Have you had medical problems as a result of your drug use (e.g. memory loss, hepatitis, convulsions, bleeding, etc.)?' },
      { prop: 'goneToAnyOneForHelp' , qText: 'Have you gone to anyone for help for a drug problem?' },
      { prop: 'involvedInTreatmentProgram' , qText: 'Have you been involved in a treatment program specifically related to drug use?' },
    ];
  }

export class DAST20ScreeningToolDto {
  id = 0;
  dateAdministered: string | Date = new Date();
  administratorId: number;
  administratorName: string;
  haveYouUserOtherDrugs: number;
  haveYouAbusedPrescriptionDrugs: number;
  abusedMoreThanOneDrug: number;
  getThroughWeekWithOutUsingDrugs: number;
  ableToStopUsingDrugs: number;
  blackoutsOrFlashbacks: number;
  feelBadAboutDrugsUse: number;
  spouseComplainAboutDrugs: number;
  drugsCreateProblemsWithYourSpouse: number;
  lostFriendsForDrugUsage: number;
  neglectedFamilyForDrugsUsage: number;
  inTroubleAtWorkDueToDrugs: number;
  lostJobDueToDrugAbuse: number;
  fightsUnderDrugInfluence: number;
  engagedInIllegalActivities: number;
  arrestedForPossessingDrugs: number;
  experiencedWithdrawalSymptomsStoppingDrugs: number;
  hadMedicalProblems: number;
  goneToAnyOneForHelp: number;
  involvedInTreatmentProgram: number;
  score: number;
  result: string;
  note: string;
  patientId: number;
}
export enum DAST20ScreeningToolEnum {
    No = 0,
    Yes = 1
}

