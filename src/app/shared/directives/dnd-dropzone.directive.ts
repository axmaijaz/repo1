import { Directive, EventEmitter } from '@angular/core';
import { EffectAllowed, DndDropEvent } from 'ngx-drag-drop';

@Directive({
  selector: '[dndDropzone]'
})
export class DndDropzoneDirective {
  constructor() {}
  // optionally restrict the allowed types
  dndDropzone?: string[];

  // set the allowed drop effect
  dndEffectAllowed: EffectAllowed;

  // conditionally disable the dropzone
  dndDisableIf: boolean;
  dndDisableDropIf: boolean;

  // if draggables that are not [dndDraggable] are allowed to be dropped
  // set to true if dragged text, images or files should be handled
  dndAllowExternal: boolean;

  // if its a horizontal list this influences how the placeholder position
  // is calculated
  dndHorizontal: boolean;

  // set the class applied to the dropzone
  // when a draggable is dragged over it
  dndDragoverClass = 'dndDragover';

  // set the class applied to the dropzone
  // when the dropzone is disabled by [dndDisableIf]
  dndDropzoneDisabledClass = 'dndDropzoneDisabled';

  // emits when a draggable is dragged over the dropzone
  readonly dndDragover: EventEmitter<DragEvent>;

  // emits on successful drop
  readonly dndDrop: EventEmitter<DndDropEvent>;
}
