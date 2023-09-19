export class AddEditSmartPhraseDto {
  id: number;
  title: string;
  text: string;
  userId: number;
}
export class SmartPhraseVariablesListDto {
  id: number;
  title: string;
}
export class SmartPhraseListDto {
  id: number;
  title: string;
  text: string;
  userId: number;
}
export class TriggerIntellisenseWidgetDTO {
  ViewType: string; // none, block
  top = '';
  transform = '';
  patientId: number;
}
