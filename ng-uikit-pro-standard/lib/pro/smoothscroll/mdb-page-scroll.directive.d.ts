import { EventEmitter, OnDestroy, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { PageScrollService } from './mdb-page-scroll.service';
import { EasingLogic } from './mdb-page-scroll.config';
import * as ɵngcc0 from '@angular/core';
export declare class PageScrollDirective implements OnChanges, OnDestroy {
    private pageScrollService;
    private router;
    routerLink: any;
    href: string;
    pageScrollHorizontal: boolean | any;
    pageScrollOffset: number | any;
    pageScrollDuration: number | any;
    pageScrollSpeed: number | any;
    pageScrollEasing: EasingLogic | any;
    pageScrollInterruptible: boolean;
    pageScrollAdjustHash: boolean;
    pageScroll: string | any;
    pageScrollFinish: EventEmitter<boolean>;
    private pageScrollInstance;
    private document;
    constructor(pageScrollService: PageScrollService, router: Router, document: any);
    ngOnChanges(): void;
    ngOnDestroy(): void;
    private generatePageScrollInstance;
    private pushRouterState;
    private scroll;
    handleClick(): boolean;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<PageScrollDirective, [null, { optional: true; }, null]>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<PageScrollDirective, "[mdbPageScroll]", never, { "pageScrollHorizontal": "pageScrollHorizontal"; "pageScrollOffset": "pageScrollOffset"; "pageScrollDuration": "pageScrollDuration"; "pageScrollSpeed": "pageScrollSpeed"; "pageScrollEasing": "pageScrollEasing"; "pageScrollAdjustHash": "pageScrollAdjustHash"; "pageScroll": "pageScroll"; "routerLink": "routerLink"; "href": "href"; "pageScrollInterruptible": "pageScrollInterruptible"; }, { "pageScrollFinish": "pageScrollFinish"; }, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLXBhZ2Utc2Nyb2xsLmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJtZGItcGFnZS1zY3JvbGwuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF1QkEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25DaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUGFnZVNjcm9sbFNlcnZpY2UgfSBmcm9tICcuL21kYi1wYWdlLXNjcm9sbC5zZXJ2aWNlJztcbmltcG9ydCB7IEVhc2luZ0xvZ2ljIH0gZnJvbSAnLi9tZGItcGFnZS1zY3JvbGwuY29uZmlnJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIFBhZ2VTY3JvbGxEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gICAgcHJpdmF0ZSBwYWdlU2Nyb2xsU2VydmljZTtcbiAgICBwcml2YXRlIHJvdXRlcjtcbiAgICByb3V0ZXJMaW5rOiBhbnk7XG4gICAgaHJlZjogc3RyaW5nO1xuICAgIHBhZ2VTY3JvbGxIb3Jpem9udGFsOiBib29sZWFuIHwgYW55O1xuICAgIHBhZ2VTY3JvbGxPZmZzZXQ6IG51bWJlciB8IGFueTtcbiAgICBwYWdlU2Nyb2xsRHVyYXRpb246IG51bWJlciB8IGFueTtcbiAgICBwYWdlU2Nyb2xsU3BlZWQ6IG51bWJlciB8IGFueTtcbiAgICBwYWdlU2Nyb2xsRWFzaW5nOiBFYXNpbmdMb2dpYyB8IGFueTtcbiAgICBwYWdlU2Nyb2xsSW50ZXJydXB0aWJsZTogYm9vbGVhbjtcbiAgICBwYWdlU2Nyb2xsQWRqdXN0SGFzaDogYm9vbGVhbjtcbiAgICBwYWdlU2Nyb2xsOiBzdHJpbmcgfCBhbnk7XG4gICAgcGFnZVNjcm9sbEZpbmlzaDogRXZlbnRFbWl0dGVyPGJvb2xlYW4+O1xuICAgIHByaXZhdGUgcGFnZVNjcm9sbEluc3RhbmNlO1xuICAgIHByaXZhdGUgZG9jdW1lbnQ7XG4gICAgY29uc3RydWN0b3IocGFnZVNjcm9sbFNlcnZpY2U6IFBhZ2VTY3JvbGxTZXJ2aWNlLCByb3V0ZXI6IFJvdXRlciwgZG9jdW1lbnQ6IGFueSk7XG4gICAgbmdPbkNoYW5nZXMoKTogdm9pZDtcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xuICAgIHByaXZhdGUgZ2VuZXJhdGVQYWdlU2Nyb2xsSW5zdGFuY2U7XG4gICAgcHJpdmF0ZSBwdXNoUm91dGVyU3RhdGU7XG4gICAgcHJpdmF0ZSBzY3JvbGw7XG4gICAgaGFuZGxlQ2xpY2soKTogYm9vbGVhbjtcbn1cbiJdfQ==