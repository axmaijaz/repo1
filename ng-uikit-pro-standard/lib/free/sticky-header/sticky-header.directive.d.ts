import { AfterViewInit, ElementRef, EventEmitter, Renderer2, OnDestroy } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class StickyHeaderDirective implements AfterViewInit, OnDestroy {
    private _renderer;
    private _el;
    animationDuration: number;
    transitionEnd: EventEmitter<{
        state: string;
    }>;
    private _destroy$;
    private scrollDown$;
    private scrollUp$;
    constructor(_renderer: Renderer2, _el: ElementRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<StickyHeaderDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<StickyHeaderDirective, "[mdbStickyHeader]", ["mdbStickyHeader"], { "animationDuration": "animationDuration"; }, { "transitionEnd": "transitionEnd"; }, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RpY2t5LWhlYWRlci5kaXJlY3RpdmUuZC50cyIsInNvdXJjZXMiOlsic3RpY2t5LWhlYWRlci5kaXJlY3RpdmUuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7O0FBYUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlclZpZXdJbml0LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIFJlbmRlcmVyMiwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBTdGlja3lIZWFkZXJEaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAgIHByaXZhdGUgX3JlbmRlcmVyO1xuICAgIHByaXZhdGUgX2VsO1xuICAgIGFuaW1hdGlvbkR1cmF0aW9uOiBudW1iZXI7XG4gICAgdHJhbnNpdGlvbkVuZDogRXZlbnRFbWl0dGVyPHtcbiAgICAgICAgc3RhdGU6IHN0cmluZztcbiAgICB9PjtcbiAgICBwcml2YXRlIF9kZXN0cm95JDtcbiAgICBwcml2YXRlIHNjcm9sbERvd24kO1xuICAgIHByaXZhdGUgc2Nyb2xsVXAkO1xuICAgIGNvbnN0cnVjdG9yKF9yZW5kZXJlcjogUmVuZGVyZXIyLCBfZWw6IEVsZW1lbnRSZWYpO1xuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG59XG4iXX0=