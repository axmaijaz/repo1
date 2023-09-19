import { OnInit, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class MdbErrorDirective implements OnInit, OnDestroy {
    private el;
    private renderer;
    prefix: HTMLElement;
    id: string;
    errorMsg: boolean;
    messageId: string;
    textareaListenFunction: Function;
    private utils;
    constructor(el: ElementRef, renderer: Renderer2);
    private _calculateMarginTop;
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbErrorDirective, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdbErrorDirective, "mdb-error", never, { "id": "id"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3IuZGlyZWN0aXZlLmQudHMiLCJzb3VyY2VzIjpbImVycm9yLmRpcmVjdGl2ZS5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7QUFhQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9uSW5pdCwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1kYkVycm9yRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHByaXZhdGUgZWw7XG4gICAgcHJpdmF0ZSByZW5kZXJlcjtcbiAgICBwcmVmaXg6IEhUTUxFbGVtZW50O1xuICAgIGlkOiBzdHJpbmc7XG4gICAgZXJyb3JNc2c6IGJvb2xlYW47XG4gICAgbWVzc2FnZUlkOiBzdHJpbmc7XG4gICAgdGV4dGFyZWFMaXN0ZW5GdW5jdGlvbjogRnVuY3Rpb247XG4gICAgcHJpdmF0ZSB1dGlscztcbiAgICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZiwgcmVuZGVyZXI6IFJlbmRlcmVyMik7XG4gICAgcHJpdmF0ZSBfY2FsY3VsYXRlTWFyZ2luVG9wO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==