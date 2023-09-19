import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { ToastService } from 'ng-uikit-pro-standard';
import { IntellisenseService } from './../core/Tools/intellisense.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { Component, OnInit } from '@angular/core';
import { SmartPhraseListDto, TriggerIntellisenseWidgetDTO } from '../model/Tools/intellisense.model';
import { HttpResError } from '../model/common/http-response-error';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-intellisense-widget',
  templateUrl: './intellisense-widget.component.html',
  styleUrls: ['./intellisense-widget.component.scss']
})
export class IntellisenseWidgetComponent implements OnInit {
  SelectedSmartPhrase: SmartPhraseListDto;
  gettingPhrases: boolean;
  usingSMartPhrase: boolean;
  smartPhrasesList: SmartPhraseListDto[] = [];
  patientId: number;

  constructor(private securityService: SecurityService, private intellisenseService: IntellisenseService, private toaster: ToastService,
    private router: Router, private route: ActivatedRoute, private eventBus: EventBusService) {

   }

  ngOnInit(): void {
    this.GetSmartPhrases();
    this.eventBus.on(EventTypes.TriggerGlobalIntellisenseWIdget).subscribe((res: TriggerIntellisenseWidgetDTO) => {
      this.GetSmartPhrases();
      this.patientId = res.patientId;
      if (res.ViewType === 'block') {
        this.ShowIntellisenseView(res.top, res.transform);
      } else {
        this.HideIntellisenseView();
      }
    });
  }
  ShowIntellisenseView(top: string, tansform: string) {
    const globalIntellisenseView = document.getElementById('globalIntellisenseView');
    const globalIntellisenseViewStyle = globalIntellisenseView?.style;
    globalIntellisenseViewStyle.top = `${top}`;
    globalIntellisenseViewStyle.transform = `${tansform}`;
    this.ChangeIntellisenseViewState('block');
  }
  HideIntellisenseView() {
    this.ChangeIntellisenseViewState('none');
  }
  private ChangeIntellisenseViewState(viewState: string) {
    const globalIntellisenseView = document.getElementById('globalIntellisenseView')?.style;
    globalIntellisenseView.display = viewState;
    if (viewState === 'none') {
      this.SelectedSmartPhrase = new SmartPhraseListDto();
    }
    if (viewState === 'block') {
      const globalSelectForIntellisense = document.getElementById('globalSelectForIntellisense');
      const inputEle = globalSelectForIntellisense.getElementsByTagName('input') as any;
      if (inputEle && inputEle.length) {
        inputEle[0].focus();
      }
    }
  }
  GetSmartPhrases() {
    if (this.smartPhrasesList?.length) {
      return;
    }
    this.gettingPhrases = true;
    this.intellisenseService.GetSmartPhrases(this.securityService.securityObject.id).subscribe(
      (res: SmartPhraseListDto[]) => {
        this.gettingPhrases = false;
        this.smartPhrasesList = res.sort((a,b) => 0 - (a.title > b.title ? -1 : 1));
      },
      (error: HttpResError) => {
        this.gettingPhrases = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  SmartPhraseSelected() {
    this.usingSMartPhrase = true;
    this.intellisenseService.UseSmartPhrase(this.securityService.securityObject.id, this.SelectedSmartPhrase.id , this.patientId).subscribe(
      (res: any) => {
        this.usingSMartPhrase = false;
        // this.AppendTextTOEditor(res.phraseText);
        // this.smartVariablesList = res;
        this.EmitPhraseSelectedEvent(res);
      },
      (error: HttpResError) => {
        this.usingSMartPhrase = false;
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  EmitPhraseSelectedEvent(resData: any) {
    this.HideIntellisenseView();
    const event = new EmitEvent();
    event.name = EventTypes.PhraseSelectedEvent;
    event.value = resData;
    this.eventBus.emit(event);
  }

}
