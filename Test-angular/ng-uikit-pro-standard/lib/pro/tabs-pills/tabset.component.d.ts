import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { TabDirective } from './tab.directive';
import { TabsetConfig } from './tabset.config';
import { WavesDirective } from '../../free/waves/waves-effect.directive';
import * as ɵngcc0 from '@angular/core';
export declare class TabsetComponent implements OnDestroy, OnInit, AfterViewInit {
    ripple: WavesDirective;
    private cdRef;
    private renderer;
    tabs: TabDirective[];
    classMap: any;
    protected isDestroyed: boolean;
    protected _vertical: boolean;
    protected _justified: boolean;
    protected _type: string;
    listGetClass: String;
    tabsGetClass: String;
    isBrowser: any;
    clazz: boolean;
    disableWaves: boolean;
    buttonClass: String;
    contentClass: String;
    tabsButtonsClass: string;
    tabsContentClass: string;
    itemsList: ElementRef;
    tabEl: any;
    showBsTab: EventEmitter<any>;
    shownBsTab: EventEmitter<any>;
    hideBsTab: EventEmitter<any>;
    hiddenBsTab: EventEmitter<any>;
    getActiveTab: EventEmitter<any>;
    /** if true tabs will be placed vertically */
    vertical: boolean;
    setActiveTab(index: number): void;
    /** if true tabs fill the container and have a consistent width */
    justified: boolean;
    /** navigation context class: 'tabs' or 'pills' */
    type: string;
    constructor(platformId: string, config: TabsetConfig, ripple: WavesDirective, cdRef: ChangeDetectorRef, renderer: Renderer2);
    click(event: any, index: any): void;
    ngOnDestroy(): void;
    getActive(): any;
    addTab(tab: TabDirective): void;
    removeTab(tab: TabDirective): void;
    protected getClosestTabIndex(index: number): number;
    protected hasAvailableTabs(index: number): boolean;
    protected setClassMap(): void;
    listGet(): void;
    tabsGet(): void;
    getActiveElement(): any;
    showActiveIndex(): void;
    private getFirstActiveTabIndex;
    private removeActiveTabs;
    initActiveTab(): void;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<TabsetComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<TabsetComponent, "mdb-tabset", never, { "disableWaves": "disableWaves"; "vertical": "vertical"; "justified": "justified"; "type": "type"; "buttonClass": "buttonClass"; "contentClass": "contentClass"; "tabsButtonsClass": "tabsButtonsClass"; "tabsContentClass": "tabsContentClass"; }, { "showBsTab": "showBsTab"; "shownBsTab": "shownBsTab"; "hideBsTab": "hideBsTab"; "hiddenBsTab": "hiddenBsTab"; "getActiveTab": "getActiveTab"; }, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFic2V0LmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJ0YWJzZXQuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbURBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgVGFiRGlyZWN0aXZlIH0gZnJvbSAnLi90YWIuZGlyZWN0aXZlJztcbmltcG9ydCB7IFRhYnNldENvbmZpZyB9IGZyb20gJy4vdGFic2V0LmNvbmZpZyc7XG5pbXBvcnQgeyBXYXZlc0RpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2ZyZWUvd2F2ZXMvd2F2ZXMtZWZmZWN0LmRpcmVjdGl2ZSc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBUYWJzZXRDb21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3ksIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgcmlwcGxlOiBXYXZlc0RpcmVjdGl2ZTtcbiAgICBwcml2YXRlIGNkUmVmO1xuICAgIHByaXZhdGUgcmVuZGVyZXI7XG4gICAgdGFiczogVGFiRGlyZWN0aXZlW107XG4gICAgY2xhc3NNYXA6IGFueTtcbiAgICBwcm90ZWN0ZWQgaXNEZXN0cm95ZWQ6IGJvb2xlYW47XG4gICAgcHJvdGVjdGVkIF92ZXJ0aWNhbDogYm9vbGVhbjtcbiAgICBwcm90ZWN0ZWQgX2p1c3RpZmllZDogYm9vbGVhbjtcbiAgICBwcm90ZWN0ZWQgX3R5cGU6IHN0cmluZztcbiAgICBsaXN0R2V0Q2xhc3M6IFN0cmluZztcbiAgICB0YWJzR2V0Q2xhc3M6IFN0cmluZztcbiAgICBpc0Jyb3dzZXI6IGFueTtcbiAgICBjbGF6ejogYm9vbGVhbjtcbiAgICBkaXNhYmxlV2F2ZXM6IGJvb2xlYW47XG4gICAgYnV0dG9uQ2xhc3M6IFN0cmluZztcbiAgICBjb250ZW50Q2xhc3M6IFN0cmluZztcbiAgICB0YWJzQnV0dG9uc0NsYXNzOiBzdHJpbmc7XG4gICAgdGFic0NvbnRlbnRDbGFzczogc3RyaW5nO1xuICAgIGl0ZW1zTGlzdDogRWxlbWVudFJlZjtcbiAgICB0YWJFbDogYW55O1xuICAgIHNob3dCc1RhYjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgc2hvd25Cc1RhYjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgaGlkZUJzVGFiOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBoaWRkZW5Cc1RhYjogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgZ2V0QWN0aXZlVGFiOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICAvKiogaWYgdHJ1ZSB0YWJzIHdpbGwgYmUgcGxhY2VkIHZlcnRpY2FsbHkgKi9cbiAgICB2ZXJ0aWNhbDogYm9vbGVhbjtcbiAgICBzZXRBY3RpdmVUYWIoaW5kZXg6IG51bWJlcik6IHZvaWQ7XG4gICAgLyoqIGlmIHRydWUgdGFicyBmaWxsIHRoZSBjb250YWluZXIgYW5kIGhhdmUgYSBjb25zaXN0ZW50IHdpZHRoICovXG4gICAganVzdGlmaWVkOiBib29sZWFuO1xuICAgIC8qKiBuYXZpZ2F0aW9uIGNvbnRleHQgY2xhc3M6ICd0YWJzJyBvciAncGlsbHMnICovXG4gICAgdHlwZTogc3RyaW5nO1xuICAgIGNvbnN0cnVjdG9yKHBsYXRmb3JtSWQ6IHN0cmluZywgY29uZmlnOiBUYWJzZXRDb25maWcsIHJpcHBsZTogV2F2ZXNEaXJlY3RpdmUsIGNkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZiwgcmVuZGVyZXI6IFJlbmRlcmVyMik7XG4gICAgY2xpY2soZXZlbnQ6IGFueSwgaW5kZXg6IGFueSk6IHZvaWQ7XG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbiAgICBnZXRBY3RpdmUoKTogYW55O1xuICAgIGFkZFRhYih0YWI6IFRhYkRpcmVjdGl2ZSk6IHZvaWQ7XG4gICAgcmVtb3ZlVGFiKHRhYjogVGFiRGlyZWN0aXZlKTogdm9pZDtcbiAgICBwcm90ZWN0ZWQgZ2V0Q2xvc2VzdFRhYkluZGV4KGluZGV4OiBudW1iZXIpOiBudW1iZXI7XG4gICAgcHJvdGVjdGVkIGhhc0F2YWlsYWJsZVRhYnMoaW5kZXg6IG51bWJlcik6IGJvb2xlYW47XG4gICAgcHJvdGVjdGVkIHNldENsYXNzTWFwKCk6IHZvaWQ7XG4gICAgbGlzdEdldCgpOiB2b2lkO1xuICAgIHRhYnNHZXQoKTogdm9pZDtcbiAgICBnZXRBY3RpdmVFbGVtZW50KCk6IGFueTtcbiAgICBzaG93QWN0aXZlSW5kZXgoKTogdm9pZDtcbiAgICBwcml2YXRlIGdldEZpcnN0QWN0aXZlVGFiSW5kZXg7XG4gICAgcHJpdmF0ZSByZW1vdmVBY3RpdmVUYWJzO1xuICAgIGluaXRBY3RpdmVUYWIoKTogdm9pZDtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkO1xufVxuIl19