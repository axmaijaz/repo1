import { PHSFormStatus } from "src/app/Enums/health-score.enum";

export class AddEditPHSForm {
  id: number;
  title: string;
  moduleIds: any;
  chronicConditionIds = [];
  phsCareEpisodeIds = [];
  status: number;
  publishedDate: string;
  phsFormQuestions = new Array();
}
export class AddEditPHSFormQuestion {
  id: number;
  description: string;
  isMandatory: boolean;
  questionType: number;
  phsFormId: number;
  toolTip: string;
  sequenceNo: number;
}
export class AddEditPHSFormQuestionOption {
  id: number;
  text: string;
  weight: number;
  flag: string;
  phsFormQuestionId: number;
  sequenceNo: number;
  questionType: number; //extended
}
export class PHSCareEpisodes {
  id: number;
  name: string;
  shortName: string;
}
export class FilterPHSForm{
  moduleIds= [''];
  careEpisodeIds= [''];
  chronicConditionIds= [];
  searchParam= '';
}
