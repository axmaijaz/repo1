import { Directive, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appIsOutside]'
})
export class IsOutsideDirective {
  constructor(private elementRef: ElementRef) { }

  @Output()
  public appIsOutside = new EventEmitter();

  // watch for click events
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    if (this.elementRef) {
      // const clickedInside = this.elementRef.nativeElement.contains(targetElement) ||
      // targetElement.classList.contains('open-button');
      const clickedInside = this.elementRef.nativeElement.contains(targetElement);
      // see if clicked element is the target element OR the button
      if (!clickedInside) {
        this.appIsOutside.emit(true);
      }
    }
  }
}
