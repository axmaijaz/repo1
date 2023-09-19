export class PhqQuestionsDto {
  prop: string;
  qText: string;
  optionSet: number;
}
export class PhqQuestionsData {
  static questions: PhqQuestionsDto[] = [
    {
      optionSet: 1,
      prop: "littleInterestInDoingThings",
      qText: "Little interest or pleasure in doing things",
    },
    {
      optionSet: 1,
      prop: "feelingDownDepressed",
      qText: "Feeling down, depressed, or hopeless",
    },
    {
      optionSet: 1,
      prop: "troubleFallingOrStayingAsleep",
      qText: "Trouble falling or staying asleep, or sleeping too much",
    },
    {
      optionSet: 1,
      prop: "feelingTiredLittleEnergy",
      qText: "Feeling tired or having little energy",
    },
    {
      optionSet: 1,
      prop: "poorAppetiteOrOverEating",
      qText: "Poor appetite or overeating",
    },
    {
      optionSet: 1,
      prop: "feelingBadAboutYourSelf",
      qText:
        "Feeling bad about yourself or that you are a failure or have let yourself or your family down",
    },
    {
      optionSet: 1,
      prop: "troubleConcentratingOnThings",
      qText:
        "Trouble concentrating on things, such as reading the newspaper or watching television",
    },
    {
      optionSet: 1,
      prop: "movingOrSleepingSlowly",
      qText:
        "Moving or speaking so slowly that other people could have noticed. Or the opposite being so fidgety or restless that you have been moving around a lot more than usual",
    },
    {
      optionSet: 1,
      prop: "thoughtsBetterOffDead",
      qText:
        "Thoughts that you would be better off dead, or of hurting yourself",
    },
    {
      optionSet: 2,
      prop: "checkedOffAnyProblems",
      qText:
        "If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
    },
  ];
}
export class PHQScreeningToolDto {
  id = 0;
  dateAdministered: string | Date = new Date();
  administratorId: number;
  administratorName: string;
  littleInterestInDoingThings: PHQScreeningToolEnum1;
  feelingDownDepressed: PHQScreeningToolEnum1;
  troubleFallingOrStayingAsleep: PHQScreeningToolEnum1;
  feelingTiredLittleEnergy: PHQScreeningToolEnum1;
  poorAppetiteOrOverEating: PHQScreeningToolEnum1;
  feelingBadAboutYourSelf: PHQScreeningToolEnum1;
  troubleConcentratingOnThings: PHQScreeningToolEnum1;
  movingOrSleepingSlowly: PHQScreeningToolEnum1;
  thoughtsBetterOffDead: PHQScreeningToolEnum1;
  checkedOffAnyProblems: PHQScreeningToolEnum2;
  score: number;
  result: string;
  note: string;
  patientId: number;
}

export enum PHQScreeningToolEnum1 {
  NotAtAll = 0,
  SeveralDays = 1,
  MoreThanHalfTheDays = 2,
  NearlyEveryDay = 3,
}

export enum PHQScreeningToolEnum2 {
  NotDifficultAtAll = 0,
  SomeWhatDifficult = 1,
  VeryDifficult = 2,
  NearlyEveryDay = 3,
}
export class CheckPatientDeviceExistsDto {
  patientId: number;
  modalityCode: string;
}
