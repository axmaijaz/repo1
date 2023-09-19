import { ElementRef, OnInit, Renderer2 } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class ModalBackdropOptions {
    animate: boolean;
    constructor(options: ModalBackdropOptions);
}
/** This component will be added as background layout for modals if enabled */
export declare class ModalBackdropComponent implements OnInit {
    element: ElementRef;
    renderer: Renderer2;
    classNameBackDrop: boolean;
    isAnimated: boolean;
    isShown: boolean;
    protected _isAnimated: boolean;
    protected _isShown: boolean;
    constructor(element: ElementRef, renderer: Renderer2);
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ModalBackdropComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ModalBackdropComponent, "mdb-modal-backdrop", never, {}, {}, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWxCYWNrZHJvcC5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsibW9kYWxCYWNrZHJvcC5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVsZW1lbnRSZWYsIE9uSW5pdCwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNb2RhbEJhY2tkcm9wT3B0aW9ucyB7XG4gICAgYW5pbWF0ZTogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zOiBNb2RhbEJhY2tkcm9wT3B0aW9ucyk7XG59XG4vKiogVGhpcyBjb21wb25lbnQgd2lsbCBiZSBhZGRlZCBhcyBiYWNrZ3JvdW5kIGxheW91dCBmb3IgbW9kYWxzIGlmIGVuYWJsZWQgKi9cbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1vZGFsQmFja2Ryb3BDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIGVsZW1lbnQ6IEVsZW1lbnRSZWY7XG4gICAgcmVuZGVyZXI6IFJlbmRlcmVyMjtcbiAgICBjbGFzc05hbWVCYWNrRHJvcDogYm9vbGVhbjtcbiAgICBpc0FuaW1hdGVkOiBib29sZWFuO1xuICAgIGlzU2hvd246IGJvb2xlYW47XG4gICAgcHJvdGVjdGVkIF9pc0FuaW1hdGVkOiBib29sZWFuO1xuICAgIHByb3RlY3RlZCBfaXNTaG93bjogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3RvcihlbGVtZW50OiBFbGVtZW50UmVmLCByZW5kZXJlcjogUmVuZGVyZXIyKTtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xufVxuIl19