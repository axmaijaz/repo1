import { ElementRef, Renderer2, ChangeDetectorRef, EventEmitter } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class CardRevealComponent {
    private _r;
    private _cdRef;
    cardReveal: ElementRef;
    cardFront: ElementRef;
    cardOverflow: ElementRef;
    animationStart: EventEmitter<any>;
    animationEnd: EventEmitter<any>;
    socials: any;
    show: boolean;
    onWindowResize(): void;
    constructor(_r: Renderer2, _cdRef: ChangeDetectorRef);
    toggle(): void;
    onAnimationStart(): void;
    onAnimationDone(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CardRevealComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CardRevealComponent, "mdb-card-reveal", never, {}, { "animationStart": "animationStart"; "animationEnd": "animationEnd"; }, never, [".card-front", ".card-reveal"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC1yZXZlYWwuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImNhcmQtcmV2ZWFsLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQWVBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiwgUmVuZGVyZXIyLCBDaGFuZ2VEZXRlY3RvclJlZiwgRXZlbnRFbWl0dGVyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBDYXJkUmV2ZWFsQ29tcG9uZW50IHtcbiAgICBwcml2YXRlIF9yO1xuICAgIHByaXZhdGUgX2NkUmVmO1xuICAgIGNhcmRSZXZlYWw6IEVsZW1lbnRSZWY7XG4gICAgY2FyZEZyb250OiBFbGVtZW50UmVmO1xuICAgIGNhcmRPdmVyZmxvdzogRWxlbWVudFJlZjtcbiAgICBhbmltYXRpb25TdGFydDogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgYW5pbWF0aW9uRW5kOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBzb2NpYWxzOiBhbnk7XG4gICAgc2hvdzogYm9vbGVhbjtcbiAgICBvbldpbmRvd1Jlc2l6ZSgpOiB2b2lkO1xuICAgIGNvbnN0cnVjdG9yKF9yOiBSZW5kZXJlcjIsIF9jZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuICAgIHRvZ2dsZSgpOiB2b2lkO1xuICAgIG9uQW5pbWF0aW9uU3RhcnQoKTogdm9pZDtcbiAgICBvbkFuaW1hdGlvbkRvbmUoKTogdm9pZDtcbn1cbiJdfQ==