import { EventEmitter, TemplateRef, ElementRef, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { TabsetComponent } from './tabset.component';
import * as ɵngcc0 from '@angular/core';
export declare class TabDirective implements OnInit, OnDestroy {
    tabset: TabsetComponent;
    el: ElementRef;
    private renderer;
    type: string;
    /** tab header text */
    heading: string;
    /** if true tab can not be activated */
    disabled: boolean;
    private _disabled;
    /** if true tab can be removable, additional button will appear */
    removable: boolean;
    /** if set, will be added to the tab's class atribute */
    customClass: string;
    tabOrder: number;
    /** tab active state toggle */
    active: boolean;
    /** fired when tab became active, $event:Tab equals to selected instance of Tab component */
    select: EventEmitter<TabDirective>;
    /** fired when tab became inactive, $event:Tab equals to deselected instance of Tab component */
    deselect: EventEmitter<TabDirective>;
    /** fired before tab will be removed */
    removed: EventEmitter<TabDirective>;
    addClass: boolean;
    test: boolean;
    headingRef: TemplateRef<any>;
    private _active;
    isBrowser: any;
    constructor(platformId: string, tabset: TabsetComponent, el: ElementRef, renderer: Renderer2);
    ngOnInit(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TabDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<TabDirective, "mdb-tab, [mdbTab]", never, { "disabled": "disabled"; "active": "active"; "removable": "removable"; "type": "type"; "heading": "heading"; "customClass": "customClass"; "tabOrder": "tabOrder"; }, { "select": "select"; "deselect": "deselect"; "removed": "removed"; }, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJ0YWIuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUErQkEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIFRlbXBsYXRlUmVmLCBFbGVtZW50UmVmLCBPbkluaXQsIE9uRGVzdHJveSwgUmVuZGVyZXIyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBUYWJzZXRDb21wb25lbnQgfSBmcm9tICcuL3RhYnNldC5jb21wb25lbnQnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgVGFiRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHRhYnNldDogVGFic2V0Q29tcG9uZW50O1xuICAgIGVsOiBFbGVtZW50UmVmO1xuICAgIHByaXZhdGUgcmVuZGVyZXI7XG4gICAgdHlwZTogc3RyaW5nO1xuICAgIC8qKiB0YWIgaGVhZGVyIHRleHQgKi9cbiAgICBoZWFkaW5nOiBzdHJpbmc7XG4gICAgLyoqIGlmIHRydWUgdGFiIGNhbiBub3QgYmUgYWN0aXZhdGVkICovXG4gICAgZGlzYWJsZWQ6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfZGlzYWJsZWQ7XG4gICAgLyoqIGlmIHRydWUgdGFiIGNhbiBiZSByZW1vdmFibGUsIGFkZGl0aW9uYWwgYnV0dG9uIHdpbGwgYXBwZWFyICovXG4gICAgcmVtb3ZhYmxlOiBib29sZWFuO1xuICAgIC8qKiBpZiBzZXQsIHdpbGwgYmUgYWRkZWQgdG8gdGhlIHRhYidzIGNsYXNzIGF0cmlidXRlICovXG4gICAgY3VzdG9tQ2xhc3M6IHN0cmluZztcbiAgICB0YWJPcmRlcjogbnVtYmVyO1xuICAgIC8qKiB0YWIgYWN0aXZlIHN0YXRlIHRvZ2dsZSAqL1xuICAgIGFjdGl2ZTogYm9vbGVhbjtcbiAgICAvKiogZmlyZWQgd2hlbiB0YWIgYmVjYW1lIGFjdGl2ZSwgJGV2ZW50OlRhYiBlcXVhbHMgdG8gc2VsZWN0ZWQgaW5zdGFuY2Ugb2YgVGFiIGNvbXBvbmVudCAqL1xuICAgIHNlbGVjdDogRXZlbnRFbWl0dGVyPFRhYkRpcmVjdGl2ZT47XG4gICAgLyoqIGZpcmVkIHdoZW4gdGFiIGJlY2FtZSBpbmFjdGl2ZSwgJGV2ZW50OlRhYiBlcXVhbHMgdG8gZGVzZWxlY3RlZCBpbnN0YW5jZSBvZiBUYWIgY29tcG9uZW50ICovXG4gICAgZGVzZWxlY3Q6IEV2ZW50RW1pdHRlcjxUYWJEaXJlY3RpdmU+O1xuICAgIC8qKiBmaXJlZCBiZWZvcmUgdGFiIHdpbGwgYmUgcmVtb3ZlZCAqL1xuICAgIHJlbW92ZWQ6IEV2ZW50RW1pdHRlcjxUYWJEaXJlY3RpdmU+O1xuICAgIGFkZENsYXNzOiBib29sZWFuO1xuICAgIHRlc3Q6IGJvb2xlYW47XG4gICAgaGVhZGluZ1JlZjogVGVtcGxhdGVSZWY8YW55PjtcbiAgICBwcml2YXRlIF9hY3RpdmU7XG4gICAgaXNCcm93c2VyOiBhbnk7XG4gICAgY29uc3RydWN0b3IocGxhdGZvcm1JZDogc3RyaW5nLCB0YWJzZXQ6IFRhYnNldENvbXBvbmVudCwgZWw6IEVsZW1lbnRSZWYsIHJlbmRlcmVyOiBSZW5kZXJlcjIpO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==