import { OnInit, ChangeDetectorRef } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class ScrollSpyLinkDirective implements OnInit {
    private cdRef;
    private document;
    scrollIntoView: boolean;
    private _scrollIntoView;
    section: HTMLElement;
    private _section;
    private _id;
    constructor(cdRef: ChangeDetectorRef, document: any);
    id: string;
    active: boolean;
    onClick(): void;
    detectChanges(): void;
    assignSectionToId(): void;
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ScrollSpyLinkDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<ScrollSpyLinkDirective, "[mdbScrollSpyLink]", never, { "scrollIntoView": "scrollIntoView"; "id": "mdbScrollSpyLink"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsLXNweS1saW5rLmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJzY3JvbGwtc3B5LWxpbmsuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPbkluaXQsIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBTY3JvbGxTcHlMaW5rRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIGNkUmVmO1xuICAgIHByaXZhdGUgZG9jdW1lbnQ7XG4gICAgc2Nyb2xsSW50b1ZpZXc6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfc2Nyb2xsSW50b1ZpZXc7XG4gICAgc2VjdGlvbjogSFRNTEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBfc2VjdGlvbjtcbiAgICBwcml2YXRlIF9pZDtcbiAgICBjb25zdHJ1Y3RvcihjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsIGRvY3VtZW50OiBhbnkpO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgYWN0aXZlOiBib29sZWFuO1xuICAgIG9uQ2xpY2soKTogdm9pZDtcbiAgICBkZXRlY3RDaGFuZ2VzKCk6IHZvaWQ7XG4gICAgYXNzaWduU2VjdGlvblRvSWQoKTogdm9pZDtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xufVxuIl19