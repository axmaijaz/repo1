export class WasaQuestionsDto {
    prop: string;
    qText: string;
  }
export class WasaQuestionsData {
    static questions: WasaQuestionsDto[] = [
      { prop: 'myAbilityToWorkIsImpaired', qText: 'Because of my (problem) my ability to work is impaired' },
      { prop: 'myHomeManagementIsImpaired', qText: 'Because of my (problem) my home management (cleaning, tidying, shopping, cooking, looking after home or children, paying bills) is impaired. ' },
      { prop: 'mySocialActivitiesAreImpaired', qText: 'Because of my (problem) my social leisure activities (with other people e.g. parties, bars, clubs, outings, visits, dating, home entertaining) are impaired.' },
      { prop: 'myPrivateActivitiesAreImpaired', qText: 'Because of my (problem), my private leisure activities (done alone, such as reading, gardening, collecting, sewing, walking alone) are impaired. ' },
      { prop: 'myRelationShipsWithOthersAreImpaired', qText: 'Because of my (problem) my ability to form and maintain close relationships with others, including those I live with, is impaired.  ' },
    ];
  }

export class WSASScreeningToolDto {
    id = 0;
    dateAdministered: string | Date = new Date();
    administratorId: number;
    administratorName: string;
    isYourClientRetired: number;
    myAbilityToWorkIsImpaired: number;
    myHomeManagementIsImpaired: number;
    mySocialActivitiesAreImpaired: number;
    myPrivateActivitiesAreImpaired: number;
    myRelationShipsWithOthersAreImpaired: number;
    score: number;
    result: string;
    note: string;
    patientId: number;
}
