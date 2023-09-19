import { OnInit, EventEmitter, QueryList, ChangeDetectorRef } from '@angular/core';
import { FixedButtonCaptionDirective } from '../buttons/fixed-caption.directive';
import * as ɵngcc0 from '@angular/core';
export declare class CollapseComponent implements OnInit {
    private _cdRef;
    captions: QueryList<FixedButtonCaptionDirective>;
    isCollapsed: boolean;
    showBsCollapse: EventEmitter<any>;
    shownBsCollapse: EventEmitter<any>;
    hideBsCollapse: EventEmitter<any>;
    hiddenBsCollapse: EventEmitter<any>;
    collapsed: EventEmitter<any>;
    expanded: EventEmitter<any>;
    constructor(_cdRef: ChangeDetectorRef);
    expandAnimationState: string;
    overflow: string;
    onExpandBodyDone(event: any): void;
    showCaptions(): void;
    toggle(): void;
    show(): void;
    hide(): void;
    initializeCollapseState(): void;
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CollapseComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CollapseComponent, "[mdbCollapse]", ["bs-collapse"], { "isCollapsed": "isCollapsed"; }, { "showBsCollapse": "showBsCollapse"; "shownBsCollapse": "shownBsCollapse"; "hideBsCollapse": "hideBsCollapse"; "hiddenBsCollapse": "hiddenBsCollapse"; "collapsed": "collapsed"; "expanded": "expanded"; }, ["captions"], ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29sbGFwc2UuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImNvbGxhcHNlLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9uSW5pdCwgRXZlbnRFbWl0dGVyLCBRdWVyeUxpc3QsIENoYW5nZURldGVjdG9yUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGaXhlZEJ1dHRvbkNhcHRpb25EaXJlY3RpdmUgfSBmcm9tICcuLi9idXR0b25zL2ZpeGVkLWNhcHRpb24uZGlyZWN0aXZlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIENvbGxhcHNlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBwcml2YXRlIF9jZFJlZjtcbiAgICBjYXB0aW9uczogUXVlcnlMaXN0PEZpeGVkQnV0dG9uQ2FwdGlvbkRpcmVjdGl2ZT47XG4gICAgaXNDb2xsYXBzZWQ6IGJvb2xlYW47XG4gICAgc2hvd0JzQ29sbGFwc2U6IEV2ZW50RW1pdHRlcjxhbnk+O1xuICAgIHNob3duQnNDb2xsYXBzZTogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgaGlkZUJzQ29sbGFwc2U6IEV2ZW50RW1pdHRlcjxhbnk+O1xuICAgIGhpZGRlbkJzQ29sbGFwc2U6IEV2ZW50RW1pdHRlcjxhbnk+O1xuICAgIGNvbGxhcHNlZDogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgZXhwYW5kZWQ6IEV2ZW50RW1pdHRlcjxhbnk+O1xuICAgIGNvbnN0cnVjdG9yKF9jZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYpO1xuICAgIGV4cGFuZEFuaW1hdGlvblN0YXRlOiBzdHJpbmc7XG4gICAgb3ZlcmZsb3c6IHN0cmluZztcbiAgICBvbkV4cGFuZEJvZHlEb25lKGV2ZW50OiBhbnkpOiB2b2lkO1xuICAgIHNob3dDYXB0aW9ucygpOiB2b2lkO1xuICAgIHRvZ2dsZSgpOiB2b2lkO1xuICAgIHNob3coKTogdm9pZDtcbiAgICBoaWRlKCk6IHZvaWQ7XG4gICAgaW5pdGlhbGl6ZUNvbGxhcHNlU3RhdGUoKTogdm9pZDtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xufVxuIl19