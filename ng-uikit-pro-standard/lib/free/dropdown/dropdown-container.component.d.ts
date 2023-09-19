import { OnDestroy } from '@angular/core';
import { BsDropdownState } from './dropdown.state';
import * as ɵngcc0 from '@angular/core';
export declare class BsDropdownContainerComponent implements OnDestroy {
    private _state;
    isOpen: boolean;
    display: string;
    position: string;
    readonly direction: 'down' | 'up';
    private _subscription;
    constructor(_state: BsDropdownState);
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<BsDropdownContainerComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<BsDropdownContainerComponent, "mdb-dropdown-container", never, {}, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJvcGRvd24tY29udGFpbmVyLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJkcm9wZG93bi1jb250YWluZXIuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUVBOzs7Ozs7Ozs7OztBQVNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCc0Ryb3Bkb3duU3RhdGUgfSBmcm9tICcuL2Ryb3Bkb3duLnN0YXRlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIEJzRHJvcGRvd25Db250YWluZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICAgIHByaXZhdGUgX3N0YXRlO1xuICAgIGlzT3BlbjogYm9vbGVhbjtcbiAgICBkaXNwbGF5OiBzdHJpbmc7XG4gICAgcG9zaXRpb246IHN0cmluZztcbiAgICByZWFkb25seSBkaXJlY3Rpb246ICdkb3duJyB8ICd1cCc7XG4gICAgcHJpdmF0ZSBfc3Vic2NyaXB0aW9uO1xuICAgIGNvbnN0cnVjdG9yKF9zdGF0ZTogQnNEcm9wZG93blN0YXRlKTtcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xufVxuIl19