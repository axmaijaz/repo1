import { AfterContentInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SBItemBodyComponent } from './sb-item.body';
import { MdbAccordionService } from '../mdb-accordion.service';
import * as ɵngcc0 from '@angular/core';
export declare class SBItemComponent implements AfterViewInit, AfterContentInit {
    private accordionService;
    private _cdRef;
    collapsed: boolean;
    customClass: string;
    autoExpand: boolean;
    idModifier: number;
    body: SBItemBodyComponent;
    constructor(accordionService: MdbAccordionService, _cdRef: ChangeDetectorRef);
    ngAfterViewInit(): void;
    ngAfterContentInit(): void;
    toggle(collapsed: boolean): void;
    applyToggle(collapsed: boolean): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<SBItemComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<SBItemComponent, "mdb-item, mdb-accordion-item", ["sbItem"], { "collapsed": "collapsed"; "customClass": "customClass"; }, {}, ["body"], ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ItaXRlbS5kLnRzIiwic291cmNlcyI6WyJzYi1pdGVtLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7O0FBYUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU0JJdGVtQm9keUNvbXBvbmVudCB9IGZyb20gJy4vc2ItaXRlbS5ib2R5JztcbmltcG9ydCB7IE1kYkFjY29yZGlvblNlcnZpY2UgfSBmcm9tICcuLi9tZGItYWNjb3JkaW9uLnNlcnZpY2UnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgU0JJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJDb250ZW50SW5pdCB7XG4gICAgcHJpdmF0ZSBhY2NvcmRpb25TZXJ2aWNlO1xuICAgIHByaXZhdGUgX2NkUmVmO1xuICAgIGNvbGxhcHNlZDogYm9vbGVhbjtcbiAgICBjdXN0b21DbGFzczogc3RyaW5nO1xuICAgIGF1dG9FeHBhbmQ6IGJvb2xlYW47XG4gICAgaWRNb2RpZmllcjogbnVtYmVyO1xuICAgIGJvZHk6IFNCSXRlbUJvZHlDb21wb25lbnQ7XG4gICAgY29uc3RydWN0b3IoYWNjb3JkaW9uU2VydmljZTogTWRiQWNjb3JkaW9uU2VydmljZSwgX2NkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZik7XG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQ7XG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQ7XG4gICAgdG9nZ2xlKGNvbGxhcHNlZDogYm9vbGVhbik6IHZvaWQ7XG4gICAgYXBwbHlUb2dnbGUoY29sbGFwc2VkOiBib29sZWFuKTogdm9pZDtcbn1cbiJdfQ==