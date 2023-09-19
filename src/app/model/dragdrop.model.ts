import { DropEffect } from 'ngx-drag-drop';

export interface DndDropEvent {
  // the original drag event
  event: DragEvent;

  // the actual drop effect
  dropEffect: DropEffect;

  // true if the drag did not origin from a [dndDraggable]
  isExternal: boolean;

  // the data set on the [dndDraggable] that started the drag
  // for external drags use the event property which contains the original drop event as this will be undefined
  data?: any;

  // the index where the draggable was dropped in a dropzone
  // set only when using a placeholder
  index?: number;

  // if the dndType input on dndDraggable was set
  // it will be transported here
  type?: any;
}
