import { ElementRef, Renderer2, AfterViewInit, AfterViewChecked } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class MdbInput implements AfterViewChecked, AfterViewInit {
    private el;
    private _renderer;
    elLabel: ElementRef | any;
    elIcon: Element | any;
    focusCheckbox: boolean;
    focusRadio: boolean;
    isBrowser: any;
    isClicked: boolean;
    element: any;
    constructor(el: ElementRef, _renderer: Renderer2, platformId: string);
    onfocus(): void;
    onblur(): void;
    onchange(): void;
    onkeydown(event: any): void;
    oncut(): void;
    onpaste(): void;
    ondrop(): void;
    ngAfterViewInit(): void;
    ngAfterViewChecked(): void;
    resize(): void;
    delayedResize(): void;
    initComponent(): void;
    private checkValue;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbInput, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MdbInput, "[mdbInput]", never, { "focusCheckbox": "focusCheckbox"; "focusRadio": "focusRadio"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQuZGlyZWN0aXZlLmQudHMiLCJzb3VyY2VzIjpbImlucHV0LmRpcmVjdGl2ZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIFJlbmRlcmVyMiwgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJWaWV3Q2hlY2tlZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTWRiSW5wdXQgaW1wbGVtZW50cyBBZnRlclZpZXdDaGVja2VkLCBBZnRlclZpZXdJbml0IHtcbiAgICBwcml2YXRlIGVsO1xuICAgIHByaXZhdGUgX3JlbmRlcmVyO1xuICAgIGVsTGFiZWw6IEVsZW1lbnRSZWYgfCBhbnk7XG4gICAgZWxJY29uOiBFbGVtZW50IHwgYW55O1xuICAgIGZvY3VzQ2hlY2tib3g6IGJvb2xlYW47XG4gICAgZm9jdXNSYWRpbzogYm9vbGVhbjtcbiAgICBpc0Jyb3dzZXI6IGFueTtcbiAgICBpc0NsaWNrZWQ6IGJvb2xlYW47XG4gICAgZWxlbWVudDogYW55O1xuICAgIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmLCBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgcGxhdGZvcm1JZDogc3RyaW5nKTtcbiAgICBvbmZvY3VzKCk6IHZvaWQ7XG4gICAgb25ibHVyKCk6IHZvaWQ7XG4gICAgb25jaGFuZ2UoKTogdm9pZDtcbiAgICBvbmtleWRvd24oZXZlbnQ6IGFueSk6IHZvaWQ7XG4gICAgb25jdXQoKTogdm9pZDtcbiAgICBvbnBhc3RlKCk6IHZvaWQ7XG4gICAgb25kcm9wKCk6IHZvaWQ7XG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQ7XG4gICAgbmdBZnRlclZpZXdDaGVja2VkKCk6IHZvaWQ7XG4gICAgcmVzaXplKCk6IHZvaWQ7XG4gICAgZGVsYXllZFJlc2l6ZSgpOiB2b2lkO1xuICAgIGluaXRDb21wb25lbnQoKTogdm9pZDtcbiAgICBwcml2YXRlIGNoZWNrVmFsdWU7XG59XG4iXX0=