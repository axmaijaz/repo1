export class Gad7QuestionsDto {
  qText: string;
  prop: string;
}
export class Gad7QuestionsData {
  static questions: Gad7QuestionsDto[] = [
    { prop: 'feelingNervousAnxiousOnEdge', qText: 'Feeling nervous, anxious, or on edge' },
    { prop: 'notAbleToControlWorrying', qText: 'Not being able to stop or control worrying' },
    { prop: 'worryAboutDifferentThings', qText: 'Worrying too much about different things' },
    { prop: 'troubleRelaxing', qText: 'Trouble relaxing' },
    { prop: 'beingRestlessToSitStill', qText: `Being so restless that it's hard to sit still` },
    { prop: 'becomingEasyAnnoyed', qText: 'Becoming easily annoyed or irritable' },
    { prop: 'feelingAfraidOfSomeThingAwfull', qText: 'Feeling afraid as if something awful might happen' },
  ];
}
export class GAD7ScreeningToolDto {
  id = 0;
  dateAdministered: string | Date = new Date();
  administratorId: number;
  administratorName: string;
  howDifficultAnyStatedProblemHasMadeWorkForYou: number;
  feelingNervousAnxiousOnEdge: number;
  notAbleToControlWorrying: number;
  worryAboutDifferentThings: number;
  troubleRelaxing: number;
  beingRestlessToSitStill: number;
  becomingEasyAnnoyed: number;
  feelingAfraidOfSomeThingAwfull: number;
  score: number;
  result: string;
  note: string;
  patientId: number;
}
export enum GAD7ScreeningToolEnum {
  NotAtAllSure = 0,
  SeveralDays = 1,
  OverHalfTheDays = 2,
  NearlyEveryDay = 3,
}
