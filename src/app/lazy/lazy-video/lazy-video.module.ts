import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoCallingComponent } from './video-calling/video-calling.component';
import { AngularDraggableModule } from 'angular2-draggable';

@NgModule({
  declarations: [VideoCallingComponent],
  imports: [
    CommonModule,
    AngularDraggableModule
  ],
  entryComponents: [VideoCallingComponent]
})
export class LazyVideoModule {
  // Define entry property to access entry component in loader service
  static entry = VideoCallingComponent;
 }
