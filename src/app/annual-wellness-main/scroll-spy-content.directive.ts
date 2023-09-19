import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output
} from '@angular/core';
import { ChildActivationEnd } from '@angular/router';

@Directive({
  selector: '[appScrollSpyContent]'
})
export class ScrollSpyContentDirective {

  @Input('appScrollSpyContent') public target;
  private _currentContent: string;
  @Input() public sscCurrentContent: string;
  @Output() public sscCurrentContentChange = new EventEmitter<string>();
  @Input() public sscDirection: 'row' | 'colmun' = 'row';

  constructor(private _element: ElementRef) { }


  @HostListener('window:scroll', ['$event'])
  onScroll = (event) => {

  // let items =  Array.from(this._element.nativeElement.children);

    let nowContent = Array.from<any>(this._element.nativeElement.children)
      .filter(child => this.target === child.tagName)
      .reverse()
      .find(child => this.sscDirection === 'row' ?
        (child.offsetTop - event.target.offsetTop) <= event.target.scrollTop :
        (child.offsetLeft - event.target.offsetLeft - 500) <= event.target.scrollLeft
      );
      console.log(nowContent);
    if (!nowContent) { return; }

    if (nowContent.id !== this._currentContent) {
      this._currentContent = nowContent.id;
      this.sscCurrentContentChange.emit(this._currentContent);
    }

    // console.log("top Offset", child.offsetTop);
  }
}
