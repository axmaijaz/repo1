import { ElementRef, OnInit, Renderer2 } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class FixedButtonCaptionDirective implements OnInit {
    private renderer;
    private el;
    caption: string;
    collapseButtonActivator: any;
    private paragraphEl;
    constructor(renderer: Renderer2, el: ElementRef);
    ngOnInit(): void;
    createCaptionElement(): void;
    showCaption(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<FixedButtonCaptionDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<FixedButtonCaptionDirective, "[mdbFixedCaption]", never, { "caption": "mdbFixedCaption"; "collapseButtonActivator": "collapseButton"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4ZWQtY2FwdGlvbi5kaXJlY3RpdmUuZC50cyIsInNvdXJjZXMiOlsiZml4ZWQtY2FwdGlvbi5kaXJlY3RpdmUuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7O0FBVUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBPbkluaXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgRml4ZWRCdXR0b25DYXB0aW9uRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIHJlbmRlcmVyO1xuICAgIHByaXZhdGUgZWw7XG4gICAgY2FwdGlvbjogc3RyaW5nO1xuICAgIGNvbGxhcHNlQnV0dG9uQWN0aXZhdG9yOiBhbnk7XG4gICAgcHJpdmF0ZSBwYXJhZ3JhcGhFbDtcbiAgICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogUmVuZGVyZXIyLCBlbDogRWxlbWVudFJlZik7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICBjcmVhdGVDYXB0aW9uRWxlbWVudCgpOiB2b2lkO1xuICAgIHNob3dDYXB0aW9uKCk6IHZvaWQ7XG59XG4iXX0=