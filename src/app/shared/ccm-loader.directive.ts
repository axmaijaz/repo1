import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCcmLoader]'
})
export class CcmLoaderDirective {

  constructor(el: ElementRef) {

    if (el && el.nativeElement && el.nativeElement.parentElement) {
      el.nativeElement.parentElement.style.position = 'relative';
    }

    // console.log(el);
 }

}
