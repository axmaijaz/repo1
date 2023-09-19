import { Directive, EventEmitter } from '@angular/core';
import { EffectAllowed } from 'ngx-drag-drop';
export type DndDragImageOffsetFunction = ( event: DragEvent, dragImage: Element ) => { x: number, y: number };

@Directive({
  selector: '[dndDraggable]'
})
export class DndDraggableDirective {
  constructor() {}
  // the data attached to the drag
  dndDraggable: any;

  // the allowed drop effect
  dndEffectAllowed: EffectAllowed;

  // optionally set the type of dragged data to restrict dropping on compatible dropzones
  dndType?: string;

  // conditionally disable the draggability
  dndDisableIf: boolean;
  dndDisableDragIf: boolean;

  // set a custom class that is applied while dragging
  dndDraggingClass = 'dndDragging';

  // set a custom class that is applied to only the src element while dragging
  dndDraggingSourceClass = 'dndDraggingSource';

  // set the class that is applied when draggable is disabled by [dndDisableIf]
  dndDraggableDisabledClass = 'dndDraggableDisabled';

  // enables to set a function for calculating custom dragimage offset
  dndDragImageOffsetFunction: DndDragImageOffsetFunction;

  // emits on drag start
  readonly dndStart: EventEmitter<DragEvent>;

  // emits on drag
  readonly dndDrag: EventEmitter<DragEvent>;

  // emits on drag end
  readonly dndEnd: EventEmitter<DragEvent>;

  // emits when the dragged item has been dropped with effect "move"
  readonly dndMoved: EventEmitter<DragEvent>;

  // emits when the dragged item has been dropped with effect "copy"
  readonly dndCopied: EventEmitter<DragEvent>;

  // emits when the dragged item has been dropped with effect "link"
  readonly dndLinked: EventEmitter<DragEvent>;

  // emits when the drag is canceled
  readonly dndCanceled: EventEmitter<DragEvent>;
}
