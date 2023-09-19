import { ElementRef, OnInit, Renderer2, SimpleChanges, OnChanges } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class MdbBtnDirective implements OnInit, OnChanges {
    private el;
    private renderer;
    color: string;
    rounded: boolean;
    gradient: string;
    outline: boolean;
    flat: boolean;
    size: string;
    block: boolean;
    floating: boolean;
    simpleChange: string;
    simpleChangeValue: string;
    private colorClass;
    private gradientClass;
    private outlineClass;
    private flatClass;
    private roundedClass;
    private sizeClass;
    private blockClass;
    private floatingClass;
    constructor(el: ElementRef, renderer: Renderer2);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    initClasses(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbBtnDirective, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdbBtnDirective, "[mdbBtn]", never, { "color": "color"; "rounded": "rounded"; "gradient": "gradient"; "outline": "outline"; "flat": "flat"; "size": "size"; "block": "block"; "floating": "floating"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9ucy5kaXJlY3RpdmUuZC50cyIsInNvdXJjZXMiOlsiYnV0dG9ucy5kaXJlY3RpdmUuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiwgT25Jbml0LCBSZW5kZXJlcjIsIFNpbXBsZUNoYW5nZXMsIE9uQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTWRiQnRuRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xuICAgIHByaXZhdGUgZWw7XG4gICAgcHJpdmF0ZSByZW5kZXJlcjtcbiAgICBjb2xvcjogc3RyaW5nO1xuICAgIHJvdW5kZWQ6IGJvb2xlYW47XG4gICAgZ3JhZGllbnQ6IHN0cmluZztcbiAgICBvdXRsaW5lOiBib29sZWFuO1xuICAgIGZsYXQ6IGJvb2xlYW47XG4gICAgc2l6ZTogc3RyaW5nO1xuICAgIGJsb2NrOiBib29sZWFuO1xuICAgIGZsb2F0aW5nOiBib29sZWFuO1xuICAgIHNpbXBsZUNoYW5nZTogc3RyaW5nO1xuICAgIHNpbXBsZUNoYW5nZVZhbHVlOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSBjb2xvckNsYXNzO1xuICAgIHByaXZhdGUgZ3JhZGllbnRDbGFzcztcbiAgICBwcml2YXRlIG91dGxpbmVDbGFzcztcbiAgICBwcml2YXRlIGZsYXRDbGFzcztcbiAgICBwcml2YXRlIHJvdW5kZWRDbGFzcztcbiAgICBwcml2YXRlIHNpemVDbGFzcztcbiAgICBwcml2YXRlIGJsb2NrQ2xhc3M7XG4gICAgcHJpdmF0ZSBmbG9hdGluZ0NsYXNzO1xuICAgIGNvbnN0cnVjdG9yKGVsOiBFbGVtZW50UmVmLCByZW5kZXJlcjogUmVuZGVyZXIyKTtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkO1xuICAgIGluaXRDbGFzc2VzKCk6IHZvaWQ7XG59XG4iXX0=