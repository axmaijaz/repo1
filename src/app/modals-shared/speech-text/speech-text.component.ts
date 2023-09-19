import { EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-speech-text',
  templateUrl: './speech-text.component.html',
  styleUrls: ['./speech-text.component.scss']
})
export class SpeechTextComponent implements OnInit {
  @ViewChild('speechTextEditor') speechTextEditor: ElementRef;
  loadingEditor = true;
  speechContent = '';
  editorConfObject = {
    height: 300,
    menubar: false,
    plugins: [
      ''
    ],
    contextmenu: '',
    toolbar:'',
  }
  constructor(private eventBus: EventBusService) { }

  ngOnInit(): void {
    this.eventBus.on(EventTypes.SpeechTextEvent).subscribe((res) => {
      this.speechContent += ' ' +res;
    });
  }
  insertContentIntoEditor() {
    // this.editor12.nativeElement.execCommand('mceInsertContent', false, 'sds');
  }

}
