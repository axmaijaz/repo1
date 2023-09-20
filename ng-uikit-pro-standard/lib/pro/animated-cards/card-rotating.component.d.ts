import { EventEmitter, ChangeDetectorRef } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class CardRotatingComponent {
    private _cdRef;
    rotate: boolean;
    ANIMATION_TRANSITION_TIME: number;
    animationStart: EventEmitter<any>;
    animationEnd: EventEmitter<any>;
    constructor(_cdRef: ChangeDetectorRef);
    toggle(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CardRotatingComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CardRotatingComponent, "mdb-card-rotating, mdb-flipping-card", never, {}, { "animationStart": "animationStart"; "animationEnd": "animationEnd"; }, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyZC1yb3RhdGluZy5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsiY2FyZC1yb3RhdGluZy5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7Ozs7Ozs7OztBQVFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyLCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgQ2FyZFJvdGF0aW5nQ29tcG9uZW50IHtcbiAgICBwcml2YXRlIF9jZFJlZjtcbiAgICByb3RhdGU6IGJvb2xlYW47XG4gICAgQU5JTUFUSU9OX1RSQU5TSVRJT05fVElNRTogbnVtYmVyO1xuICAgIGFuaW1hdGlvblN0YXJ0OiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBhbmltYXRpb25FbmQ6IEV2ZW50RW1pdHRlcjxhbnk+O1xuICAgIGNvbnN0cnVjdG9yKF9jZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuICAgIHRvZ2dsZSgpOiB2b2lkO1xufVxuIl19