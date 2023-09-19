import { ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class MdbSuccessDirective implements OnInit, OnDestroy {
    private el;
    private renderer;
    prefix: HTMLElement;
    id: string;
    successMsg: boolean;
    messageId: string;
    textareaListenFunction: Function;
    private utils;
    constructor(el: ElementRef, renderer: Renderer2);
    private _calculateMarginTop;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbSuccessDirective, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdbSuccessDirective, "mdb-success", never, { "id": "id"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VjY2Vzcy5kaXJlY3RpdmUuZC50cyIsInNvdXJjZXMiOlsic3VjY2Vzcy5kaXJlY3RpdmUuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FBYUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBSZW5kZXJlcjIsIE9uSW5pdCwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNZGJTdWNjZXNzRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHByaXZhdGUgZWw7XG4gICAgcHJpdmF0ZSByZW5kZXJlcjtcbiAgICBwcmVmaXg6IEhUTUxFbGVtZW50O1xuICAgIGlkOiBzdHJpbmc7XG4gICAgc3VjY2Vzc01zZzogYm9vbGVhbjtcbiAgICBtZXNzYWdlSWQ6IHN0cmluZztcbiAgICB0ZXh0YXJlYUxpc3RlbkZ1bmN0aW9uOiBGdW5jdGlvbjtcbiAgICBwcml2YXRlIHV0aWxzO1xuICAgIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmLCByZW5kZXJlcjogUmVuZGVyZXIyKTtcbiAgICBwcml2YXRlIF9jYWxjdWxhdGVNYXJnaW5Ub3A7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xufVxuIl19