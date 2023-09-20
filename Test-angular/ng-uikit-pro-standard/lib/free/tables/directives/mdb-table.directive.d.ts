import { AfterViewInit, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class MdbTableDirective implements OnInit, AfterViewInit {
    private el;
    private renderer;
    striped: boolean;
    bordered: boolean;
    borderless: boolean;
    hover: boolean;
    small: boolean;
    responsive: boolean;
    stickyHeader: boolean;
    stickyHeaderBgColor: string;
    stickyHeaderTextColor: string;
    constructor(el: ElementRef, renderer: Renderer2);
    private _dataSource;
    private _dataSourceChanged;
    addRow(newRow: any): void;
    addRowAfter(index: number, row: any): void;
    removeRow(index: number): void;
    rowRemoved(): Observable<boolean>;
    removeLastRow(): void;
    getDataSource(): any;
    setDataSource(data: any): void;
    dataSourceChange(): Observable<any>;
    filterLocalDataBy(searchKey: string): any;
    filterLocalDataByFields(searchKey: string, keys: string[]): any;
    filterLocalDataByMultipleFields(searchKey: string, keys?: string[]): any;
    searchLocalDataBy(searchKey: string): any;
    searchLocalDataByFields(searchKey: string, keys: string[]): any;
    searchLocalDataByMultipleFields(searchKey: string, keys?: string[]): any;
    searchDataObservable(searchKey: string): Observable<any>;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbTableDirective, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdbTableDirective, "[mdbTable]", ["mdbTable"], { "stickyHeader": "stickyHeader"; "stickyHeaderBgColor": "stickyHeaderBgColor"; "stickyHeaderTextColor": "stickyHeaderTextColor"; "striped": "striped"; "bordered": "bordered"; "borderless": "borderless"; "hover": "hover"; "small": "small"; "responsive": "responsive"; }, {}, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLXRhYmxlLmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJtZGItdGFibGUuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0NBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRWxlbWVudFJlZiwgT25Jbml0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1kYlRhYmxlRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgICBwcml2YXRlIGVsO1xuICAgIHByaXZhdGUgcmVuZGVyZXI7XG4gICAgc3RyaXBlZDogYm9vbGVhbjtcbiAgICBib3JkZXJlZDogYm9vbGVhbjtcbiAgICBib3JkZXJsZXNzOiBib29sZWFuO1xuICAgIGhvdmVyOiBib29sZWFuO1xuICAgIHNtYWxsOiBib29sZWFuO1xuICAgIHJlc3BvbnNpdmU6IGJvb2xlYW47XG4gICAgc3RpY2t5SGVhZGVyOiBib29sZWFuO1xuICAgIHN0aWNreUhlYWRlckJnQ29sb3I6IHN0cmluZztcbiAgICBzdGlja3lIZWFkZXJUZXh0Q29sb3I6IHN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZiwgcmVuZGVyZXI6IFJlbmRlcmVyMik7XG4gICAgcHJpdmF0ZSBfZGF0YVNvdXJjZTtcbiAgICBwcml2YXRlIF9kYXRhU291cmNlQ2hhbmdlZDtcbiAgICBhZGRSb3cobmV3Um93OiBhbnkpOiB2b2lkO1xuICAgIGFkZFJvd0FmdGVyKGluZGV4OiBudW1iZXIsIHJvdzogYW55KTogdm9pZDtcbiAgICByZW1vdmVSb3coaW5kZXg6IG51bWJlcik6IHZvaWQ7XG4gICAgcm93UmVtb3ZlZCgpOiBPYnNlcnZhYmxlPGJvb2xlYW4+O1xuICAgIHJlbW92ZUxhc3RSb3coKTogdm9pZDtcbiAgICBnZXREYXRhU291cmNlKCk6IGFueTtcbiAgICBzZXREYXRhU291cmNlKGRhdGE6IGFueSk6IHZvaWQ7XG4gICAgZGF0YVNvdXJjZUNoYW5nZSgpOiBPYnNlcnZhYmxlPGFueT47XG4gICAgZmlsdGVyTG9jYWxEYXRhQnkoc2VhcmNoS2V5OiBzdHJpbmcpOiBhbnk7XG4gICAgZmlsdGVyTG9jYWxEYXRhQnlGaWVsZHMoc2VhcmNoS2V5OiBzdHJpbmcsIGtleXM6IHN0cmluZ1tdKTogYW55O1xuICAgIGZpbHRlckxvY2FsRGF0YUJ5TXVsdGlwbGVGaWVsZHMoc2VhcmNoS2V5OiBzdHJpbmcsIGtleXM/OiBzdHJpbmdbXSk6IGFueTtcbiAgICBzZWFyY2hMb2NhbERhdGFCeShzZWFyY2hLZXk6IHN0cmluZyk6IGFueTtcbiAgICBzZWFyY2hMb2NhbERhdGFCeUZpZWxkcyhzZWFyY2hLZXk6IHN0cmluZywga2V5czogc3RyaW5nW10pOiBhbnk7XG4gICAgc2VhcmNoTG9jYWxEYXRhQnlNdWx0aXBsZUZpZWxkcyhzZWFyY2hLZXk6IHN0cmluZywga2V5cz86IHN0cmluZ1tdKTogYW55O1xuICAgIHNlYXJjaERhdGFPYnNlcnZhYmxlKHNlYXJjaEtleTogc3RyaW5nKTogT2JzZXJ2YWJsZTxhbnk+O1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQ7XG59XG4iXX0=