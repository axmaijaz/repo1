import { EmitEvent, EventBusService, EventTypes } from './../event-bus.service';
import { Injectable } from '@angular/core';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechToTextService {
  // root.SpeechRecognition ||
  // root.webkitSpeechRecognition ||
  // root.mozSpeechRecognition ||
  // root.msSpeechRecognition ||
  // root.oSpeechRecognition;

  recognition: any;
  isStoppedSpeechRecog = false;

  constructor(private eventBus: EventBusService) { }

  init() {
    const SpeechRecognition = window['SpeechRecognition'] || window['webkitSpeechRecognition'] || window['mozSpeechRecognition'] || window['msSpeechRecognition'] || window['oSpeechRecognition'];
    this.recognition = new SpeechRecognition();
    this.recognition.interimResults = false;
    this.recognition.continuous = true;
    this.recognition.lang = 'en-US';

    this.recognition.addEventListener('result', (event) => {
      const current = event.resultIndex;

      // Get a transcript of what was said.
      const transcript = event.results[current][0].transcript;

      // Add the current transcript to the contents of our Note.
      // There is a weird bug on mobile, where everything is repeated twice.
      // There is no official solution so far so we have to handle an edge case.
      const mobileRepeatBug = (current === 1 && transcript === event.results[0][0].transcript);

      if (!mobileRepeatBug) {
        // console.log(transcript);
        this.EmitSpeechText(transcript);
      }
    });
  }

  start() {
    this.isStoppedSpeechRecog = false;
    this.recognition.start();
    console.log('Speech recognition started')
    this.recognition.removeEventListener('end', this.SpeechEndListner);
    this.recognition.addEventListener('end', this.SpeechEndListner);
  }
  SpeechEndListner = (condition) => {
    if (this.isStoppedSpeechRecog) {
      this.recognition.stop();
      console.log('End speech recognition');
    } else {
      // this.wordConcat()
      this.recognition.stop();

      ///* This can be started automatically by uncommenting the below code *////
      
      // setTimeout(() => {
      //   this.recognition.start();
      // }, 500);
    }
  };
  stop() {
    this.isStoppedSpeechRecog = true;
    // this.wordConcat()
    this.recognition.stop();
    console.log('End speech recognition')
  }

  EmitSpeechText = (voiceText: string) => {
    const event = new EmitEvent();
    event.name = EventTypes.SpeechTextEvent;
    event.value = voiceText;
    this.eventBus.emit(event);
  }
  ReadOutLoud(message) {
    const speech = new SpeechSynthesisUtterance();
    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  }
}
