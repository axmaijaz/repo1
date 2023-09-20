import { AfterContentInit, OnDestroy, OnInit, QueryList } from '@angular/core';
import { SBItemComponent } from './sb-item';
import { MdbAccordionService } from '../mdb-accordion.service';
import * as ɵngcc0 from '@angular/core';
export declare class SqueezeBoxComponent implements OnInit, AfterContentInit, OnDestroy {
    private accordionService;
    private itemsChanges;
    multiple: boolean;
    autoExpand: boolean;
    private _multiple;
    items: QueryList<SBItemComponent>;
    constructor(accordionService: MdbAccordionService);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<SqueezeBoxComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<SqueezeBoxComponent, "mdb-squeezebox, mdb-accordion", ["squeezebox"], { "autoExpand": "autoExpand"; "multiple": "multiple"; }, {}, ["items"], ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3F1ZWV6ZWJveC5kLnRzIiwic291cmNlcyI6WyJzcXVlZXplYm94LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFHQTs7Ozs7Ozs7Ozs7OztBQVdBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95LCBPbkluaXQsIFF1ZXJ5TGlzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgU0JJdGVtQ29tcG9uZW50IH0gZnJvbSAnLi9zYi1pdGVtJztcbmltcG9ydCB7IE1kYkFjY29yZGlvblNlcnZpY2UgfSBmcm9tICcuLi9tZGItYWNjb3JkaW9uLnNlcnZpY2UnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgU3F1ZWV6ZUJveENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgICBwcml2YXRlIGFjY29yZGlvblNlcnZpY2U7XG4gICAgcHJpdmF0ZSBpdGVtc0NoYW5nZXM7XG4gICAgbXVsdGlwbGU6IGJvb2xlYW47XG4gICAgYXV0b0V4cGFuZDogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9tdWx0aXBsZTtcbiAgICBpdGVtczogUXVlcnlMaXN0PFNCSXRlbUNvbXBvbmVudD47XG4gICAgY29uc3RydWN0b3IoYWNjb3JkaW9uU2VydmljZTogTWRiQWNjb3JkaW9uU2VydmljZSk7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZDtcbiAgICBuZ09uRGVzdHJveSgpOiB2b2lkO1xufVxuIl19