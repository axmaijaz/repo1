import { AfterContentInit, ElementRef, EventEmitter, Renderer2, QueryList, OnDestroy } from '@angular/core';
import { MdbOptionComponent } from './mdb-option.component';
import { ISelectedOption } from '../interfaces/selected-option.interface';
import { Observable } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class MdbAutoCompleterComponent implements AfterContentInit, OnDestroy {
    private renderer;
    private el;
    textNoResults: string;
    clearButton: boolean;
    clearButtonTabIndex: number;
    appendToBody: boolean;
    disabled: boolean;
    visibleOptions: number;
    _visibleOptions: number;
    optionHeight: any;
    _optionHeight: number;
    dropdownHeight: number;
    _dropdownHeight: number;
    displayValue: ((value: any) => string) | null;
    select: EventEmitter<{
        text: string;
        element: any;
    }>;
    selected: EventEmitter<{
        text: string;
        element: any;
    }>;
    optionList: Array<any>;
    mdbOptions: QueryList<MdbOptionComponent>;
    dropdown: ElementRef;
    noResultsEl: ElementRef;
    private _destroy;
    private utils;
    origin: ElementRef;
    parameters: {
        left: number;
        top: number;
        width: number;
        bottom: number;
        inputHeight: number;
    };
    private _isDropdownOpen;
    private _allItems;
    private _isOpen;
    private _selectedItemIndex;
    private _selectedItem;
    private _selectedItemChanged;
    private _isBrowser;
    constructor(renderer: Renderer2, el: ElementRef, platformId: string);
    private _listenToOptionClick;
    private _handleOptionClick;
    setSelectedItem(item: ISelectedOption): void;
    getSelectedItem(): ISelectedOption;
    selectedItemChanged(): Observable<any>;
    isOpen(): boolean;
    _calculatePosition(): void;
    private _calculateAppendPosition;
    show(): void;
    hide(): void;
    isDropdownOpen(): Observable<any>;
    removeHighlight(index: number): void;
    highlightRow(index: number): void;
    navigateUsingKeyboard(event: any): void;
    moveHighlightedIntoView(type: string): void;
    updatePosition(parameters: {
        left: number;
        top: number;
        width: number;
        bottom: number;
    }): void;
    appendDropdown(): void;
    setSingleOptionHeight(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbAutoCompleterComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdbAutoCompleterComponent, "mdb-auto-completer", ["mdbAutoCompleter"], { "clearButton": "clearButton"; "clearButtonTabIndex": "clearButtonTabIndex"; "visibleOptions": "visibleOptions"; "optionHeight": "optionHeight"; "dropdownHeight": "dropdownHeight"; "textNoResults": "textNoResults"; "appendToBody": "appendToBody"; "disabled": "disabled"; "displayValue": "displayValue"; }, { "select": "select"; "selected": "selected"; }, ["optionList", "mdbOptions"], ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLWF1dG8tY29tcGxldGVyLmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJtZGItYXV0by1jb21wbGV0ZXIuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNFQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyQ29udGVudEluaXQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgUmVuZGVyZXIyLCBRdWVyeUxpc3QsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWRiT3B0aW9uQ29tcG9uZW50IH0gZnJvbSAnLi9tZGItb3B0aW9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJU2VsZWN0ZWRPcHRpb24gfSBmcm9tICcuLi9pbnRlcmZhY2VzL3NlbGVjdGVkLW9wdGlvbi5pbnRlcmZhY2UnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTWRiQXV0b0NvbXBsZXRlckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gICAgcHJpdmF0ZSByZW5kZXJlcjtcbiAgICBwcml2YXRlIGVsO1xuICAgIHRleHROb1Jlc3VsdHM6IHN0cmluZztcbiAgICBjbGVhckJ1dHRvbjogYm9vbGVhbjtcbiAgICBjbGVhckJ1dHRvblRhYkluZGV4OiBudW1iZXI7XG4gICAgYXBwZW5kVG9Cb2R5OiBib29sZWFuO1xuICAgIGRpc2FibGVkOiBib29sZWFuO1xuICAgIHZpc2libGVPcHRpb25zOiBudW1iZXI7XG4gICAgX3Zpc2libGVPcHRpb25zOiBudW1iZXI7XG4gICAgb3B0aW9uSGVpZ2h0OiBhbnk7XG4gICAgX29wdGlvbkhlaWdodDogbnVtYmVyO1xuICAgIGRyb3Bkb3duSGVpZ2h0OiBudW1iZXI7XG4gICAgX2Ryb3Bkb3duSGVpZ2h0OiBudW1iZXI7XG4gICAgZGlzcGxheVZhbHVlOiAoKHZhbHVlOiBhbnkpID0+IHN0cmluZykgfCBudWxsO1xuICAgIHNlbGVjdDogRXZlbnRFbWl0dGVyPHtcbiAgICAgICAgdGV4dDogc3RyaW5nO1xuICAgICAgICBlbGVtZW50OiBhbnk7XG4gICAgfT47XG4gICAgc2VsZWN0ZWQ6IEV2ZW50RW1pdHRlcjx7XG4gICAgICAgIHRleHQ6IHN0cmluZztcbiAgICAgICAgZWxlbWVudDogYW55O1xuICAgIH0+O1xuICAgIG9wdGlvbkxpc3Q6IEFycmF5PGFueT47XG4gICAgbWRiT3B0aW9uczogUXVlcnlMaXN0PE1kYk9wdGlvbkNvbXBvbmVudD47XG4gICAgZHJvcGRvd246IEVsZW1lbnRSZWY7XG4gICAgbm9SZXN1bHRzRWw6IEVsZW1lbnRSZWY7XG4gICAgcHJpdmF0ZSBfZGVzdHJveTtcbiAgICBwcml2YXRlIHV0aWxzO1xuICAgIG9yaWdpbjogRWxlbWVudFJlZjtcbiAgICBwYXJhbWV0ZXJzOiB7XG4gICAgICAgIGxlZnQ6IG51bWJlcjtcbiAgICAgICAgdG9wOiBudW1iZXI7XG4gICAgICAgIHdpZHRoOiBudW1iZXI7XG4gICAgICAgIGJvdHRvbTogbnVtYmVyO1xuICAgICAgICBpbnB1dEhlaWdodDogbnVtYmVyO1xuICAgIH07XG4gICAgcHJpdmF0ZSBfaXNEcm9wZG93bk9wZW47XG4gICAgcHJpdmF0ZSBfYWxsSXRlbXM7XG4gICAgcHJpdmF0ZSBfaXNPcGVuO1xuICAgIHByaXZhdGUgX3NlbGVjdGVkSXRlbUluZGV4O1xuICAgIHByaXZhdGUgX3NlbGVjdGVkSXRlbTtcbiAgICBwcml2YXRlIF9zZWxlY3RlZEl0ZW1DaGFuZ2VkO1xuICAgIHByaXZhdGUgX2lzQnJvd3NlcjtcbiAgICBjb25zdHJ1Y3RvcihyZW5kZXJlcjogUmVuZGVyZXIyLCBlbDogRWxlbWVudFJlZiwgcGxhdGZvcm1JZDogc3RyaW5nKTtcbiAgICBwcml2YXRlIF9saXN0ZW5Ub09wdGlvbkNsaWNrO1xuICAgIHByaXZhdGUgX2hhbmRsZU9wdGlvbkNsaWNrO1xuICAgIHNldFNlbGVjdGVkSXRlbShpdGVtOiBJU2VsZWN0ZWRPcHRpb24pOiB2b2lkO1xuICAgIGdldFNlbGVjdGVkSXRlbSgpOiBJU2VsZWN0ZWRPcHRpb247XG4gICAgc2VsZWN0ZWRJdGVtQ2hhbmdlZCgpOiBPYnNlcnZhYmxlPGFueT47XG4gICAgaXNPcGVuKCk6IGJvb2xlYW47XG4gICAgX2NhbGN1bGF0ZVBvc2l0aW9uKCk6IHZvaWQ7XG4gICAgcHJpdmF0ZSBfY2FsY3VsYXRlQXBwZW5kUG9zaXRpb247XG4gICAgc2hvdygpOiB2b2lkO1xuICAgIGhpZGUoKTogdm9pZDtcbiAgICBpc0Ryb3Bkb3duT3BlbigpOiBPYnNlcnZhYmxlPGFueT47XG4gICAgcmVtb3ZlSGlnaGxpZ2h0KGluZGV4OiBudW1iZXIpOiB2b2lkO1xuICAgIGhpZ2hsaWdodFJvdyhpbmRleDogbnVtYmVyKTogdm9pZDtcbiAgICBuYXZpZ2F0ZVVzaW5nS2V5Ym9hcmQoZXZlbnQ6IGFueSk6IHZvaWQ7XG4gICAgbW92ZUhpZ2hsaWdodGVkSW50b1ZpZXcodHlwZTogc3RyaW5nKTogdm9pZDtcbiAgICB1cGRhdGVQb3NpdGlvbihwYXJhbWV0ZXJzOiB7XG4gICAgICAgIGxlZnQ6IG51bWJlcjtcbiAgICAgICAgdG9wOiBudW1iZXI7XG4gICAgICAgIHdpZHRoOiBudW1iZXI7XG4gICAgICAgIGJvdHRvbTogbnVtYmVyO1xuICAgIH0pOiB2b2lkO1xuICAgIGFwcGVuZERyb3Bkb3duKCk6IHZvaWQ7XG4gICAgc2V0U2luZ2xlT3B0aW9uSGVpZ2h0KCk6IHZvaWQ7XG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQ7XG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbn1cbiJdfQ==