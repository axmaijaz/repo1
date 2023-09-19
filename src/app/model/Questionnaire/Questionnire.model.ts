import { QuestionType } from 'src/app/Enums/questionType.enum';

export class QuestionnaireDto {
  id = 0;
  question = '';
  questionOrder = 0;
  questionType: QuestionType = 1;
  diseaseListIds = new Array<number>();
  questionOptions = '';
  questionCategoryId: number;
  category = '';
  questionCatName = '';
  carePlanTemplateId = 0;
  cpQuestionOptions = new Array<CpQuestionOptions>();
}
export class CpQuestionnaireDto {
  id = 0;
  question = '';
  questionType: QuestionType = 1;
  diseaseListIds = new Array<number>();
  questionCategoryId = 1;
  category = '';
  questionCatName = '';
  cpQuestionOptions = new Array<CpQuestionOptions>();
  carePlanTemplaeId = 0;
}
export class QuestionCategoryDto {
  id = 0;
  name = '';
  order = 0;
  section = '';
}
export class CarePlanTemplate {
  id = 0;
  patientId = 0;
  carePlanQuestionnaires = new Array<QuestionnaireDto>();
}

export class CcmServiceType {
  id = 0;
  name = '';
}

export class CarePlanViewModel {
  key: any;
  order: number;
  parentId: number;
  value: Array<any>;
}
export class CarePlanata {
  key: TemplateRecord;
}
export class CpQuestionOptions {
  id = 0;
  text = '';
}
export class TemplateRecord {
  id = 0;
  carePlanTemplateId = 0;
  carePlanFieldId = 0;            // Questionnaire or CategoryId or ...
  fieldType: FieldType;
  answer = '0';
  optionsSelected = new Array<number>();
  isChanged = false;
}
export enum FieldType {
  Question = 1,
  Category = 2,
  Disease = 3
}
