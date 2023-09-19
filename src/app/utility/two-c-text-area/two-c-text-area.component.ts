import { SpeechToTextService } from './../../core/Tools/speech-to-text.service';
import { EventBusService } from 'src/app/core/event-bus.service';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { EmitEvent, EventTypes } from 'src/app/core/event-bus.service';
import { TriggerIntellisenseWidgetDTO } from 'src/app/model/Tools/intellisense.model';

@Component({
  selector: 'app-two-c-text-area',
  templateUrl: './two-c-text-area.component.html',
  styleUrls: ['./two-c-text-area.component.scss']
})
export class TwoCTextAreaComponent implements OnInit {
  typedElement: HTMLElement;
  selectionAnchorOffset: number;
  @Input() id!: string;
  @Input() height = '50px';
  @Input() value!: string;
  @Input() PatientId!: number;
  @Input() isChatArea= false;
  @Output() valueChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() EnterPressedEmitter: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('TCFieldRef') TCFieldRef: ElementRef<HTMLDivElement>;
  speechState = false;
  speechtypedElement: HTMLElement;
  SpeechSelectionAnchorOffset: number;
  constructor(private eventBus: EventBusService, private speechToText: SpeechToTextService) { }

  ngOnInit(): void {
    // this.speechToText.initSpeechRecognition();
    this.eventBus.on(EventTypes.PhraseSelectedEvent).subscribe((res) => {
      this.FillSelectedPhraseText(res);
    });
    this.eventBus.on(EventTypes.SpeechTextEvent).subscribe((res) => {
      if (this.speechState) {
        this.FillSpeechText(res);
      }
    });
    // this.speechToText.initSpeechRecognition();
  }
  triggerPopOverCheck(eData: any) {
    setTimeout(() => {
    }, 500);
    this.triggerPopOverCheckDElayed(eData);
  }
  triggerPopOverCheckDElayed(eData: any) {
    this.value = eData.target.innerText;
    this.valueChanged.emit(this.value);
    const wSelection = window.getSelection();
    const typedNode = wSelection.anchorNode;
    this.typedElement = typedNode.parentElement;
    const cursorDetail = wSelection.getRangeAt(0).getBoundingClientRect();
    // const cursorDetail = document.body.getBoundingClientRect();
    if(this.isChatArea){
      var topp = (cursorDetail.y + document.documentElement.scrollTop) / 2 ;
      var result = topp + (topp * 20 / 100);
      var top = `${result}px`;
    }else{
      var top = `${cursorDetail.y + document.documentElement.scrollTop + 15}px`;
    }
    // rpmIntellisenseViewStyle.left = `${editorElementRect.x + cursorDetail.x + 10}px`;
    const transform = `translate(${ cursorDetail.x }px , 0px)`;
    const newText = this.typedElement.innerText;
    const lastTwoAreDots = newText[wSelection.anchorOffset - 1] === '.' && newText[wSelection.anchorOffset - 2] === '.';
    let previousThirdIndexIsDot = false;
    if (wSelection.anchorOffset > 2) {
      previousThirdIndexIsDot = lastTwoAreDots && newText[wSelection.anchorOffset - 3] === '.';
    }
    const dataVal = new TriggerIntellisenseWidgetDTO();
    if (wSelection.anchorOffset > 1 && lastTwoAreDots && !previousThirdIndexIsDot) {
      dataVal.ViewType = 'block';
      dataVal.top = top;
      dataVal.transform = transform;
      this.selectionAnchorOffset = wSelection.anchorOffset;
      this.TriggerGlobalIntellisenseWIdget(dataVal);
    } else {
      dataVal.ViewType = 'none';
      this.TriggerGlobalIntellisenseWIdget(dataVal);
    }
  }
  TriggerGlobalIntellisenseWIdget(eData: TriggerIntellisenseWidgetDTO) {
    const event = new EmitEvent();
    eData.patientId = this.PatientId;
    event.name = EventTypes.TriggerGlobalIntellisenseWIdget;
    event.value = eData;
    this.eventBus.emit(event);
  }
  FillSpeechText(speechText: string) {
    if (this.speechtypedElement && ( this.SpeechSelectionAnchorOffset || this.SpeechSelectionAnchorOffset == 0)) {
      let previousText = this.speechtypedElement.innerText;
      // previousText = previousText.substring(0, this.selectionAnchorOffset - 1) + '' + previousText.substring((this.selectionAnchorOffset - 1) + 1);
      // const newText = previousText.substring(0, this.selectionAnchorOffset - 2) + speechText + '' + previousText.substring((this.selectionAnchorOffset - 2) + 1);
      const newText = previousText?.substring(0, this.selectionAnchorOffset) + speechText + previousText?.substring(this.selectionAnchorOffset);
      // console.log(this.selectionAnchorOffset + ' ' + newText);
      this.speechtypedElement.innerText = newText;
      this.value = this.TCFieldRef.nativeElement.innerText;
      this.speechtypedElement.focus();
      const range = document.createRange();
      range.selectNodeContents(this.speechtypedElement);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      this.value += speechText;
      this.FillValue(this.value);
    }
    this.valueChanged.emit(this.value);
  }
  CheckCaretPosition() {
    const wSelection = window.getSelection();
    const typedNode = wSelection.anchorNode;
    this.speechtypedElement = typedNode?.parentElement;
    this.SpeechSelectionAnchorOffset = wSelection.anchorOffset;
  }
  FillSelectedPhraseText = (resData: any) => {
    const phraseText = resData.phraseText;
    let previousText = this.typedElement?.innerText;
    previousText = previousText?.substring(0, this.selectionAnchorOffset - 1) + '' + previousText?.substring((this.selectionAnchorOffset - 1) + 1);
    const newText = previousText?.substring(0, this.selectionAnchorOffset - 2) + phraseText + '' + previousText?.substring((this.selectionAnchorOffset - 2) + 1);
    this.value = newText;
    if (this.typedElement) {
      this.typedElement.innerText = newText;
      this.typedElement.focus();
    }
    const range = document.createRange();
    range.selectNodeContents(this.typedElement);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    // sel.extend(range.startContainer, this.selectionAnchorOffset);
    this.valueChanged.emit(this.value);
  }
  FillValue(text: string) {
    if (this.TCFieldRef.nativeElement) {
      this.TCFieldRef.nativeElement.innerText = text;
    } else {
      setTimeout(() => {
        if (this.TCFieldRef.nativeElement) {
          this.TCFieldRef.nativeElement.innerText = text;
        }
      }, 1000);
    }
  }
  startSpeech() {
    this.speechState = true;
    // this.speechToText.initSpeechRecognition();
  }
  stopSpeech() {
    this.speechState = false;
    // this.speechToText.stopRecognition();
  }
  FocusChanged(event) {
  }
  EnterPressed() {
    this.EnterPressedEmitter.emit(this.value)
  }
}
