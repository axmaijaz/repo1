import { AfterViewInit, ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, QueryList, Renderer2 } from '@angular/core';
import { SlideComponent } from './slide.component';
import { CarouselConfig } from './carousel.config';
import * as ɵngcc0 from '@angular/core';
export declare enum Direction {
    UNKNOWN = 0,
    NEXT = 1,
    PREV = 2
}
/**
 * Base element to create carousel
 */
export declare class CarouselComponent implements OnDestroy, AfterViewInit {
    protected el: ElementRef;
    private cdRef;
    private renderer;
    SWIPE_ACTION: {
        LEFT: string;
        RIGHT: string;
    };
    _slidesList: QueryList<SlideComponent>;
    readonly slides: SlideComponent[];
    private _destroy$;
    protected currentInterval: any;
    protected isPlaying: boolean;
    protected destroyed: boolean;
    protected animationEnd: boolean;
    protected _currentActiveSlide: number;
    protected carouselIndicators: any;
    isBrowser: any;
    noWrap: boolean;
    noPause: boolean;
    isControls: boolean;
    keyboard: boolean;
    class: String;
    type: String;
    animation: String;
    activeSlideIndex: number;
    activeSlideChange: EventEmitter<any>;
    activeSlide: number;
    protected _interval: number;
    checkNavigation(): boolean;
    checkDots(): boolean;
    getImg(slide: any): any;
    interval: number;
    readonly isBs4: boolean;
    constructor(config: CarouselConfig, el: ElementRef, platformId: string, cdRef: ChangeDetectorRef, renderer: Renderer2);
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
    swipe(action?: string): void;
    nextSlide(force?: boolean): void;
    previousSlide(force?: boolean): void;
    protected fadeAnimation(goToIndex: number, direction?: any): void;
    protected slideAnimation(goToIndex: number, direction: any): void;
    selectSlide(index: number): void;
    play(): void;
    pause(): void;
    getCurrentSlideIndex(): number;
    isLast(index: number): boolean;
    private findNextSlideIndex;
    private _select;
    private restartTimer;
    private resetTimer;
    protected hasClass(el: any, className: any): any;
    protected classAdd(el: any, className: any): void;
    protected removeClass(el: any, className: any): void;
    keyboardControl(event: KeyboardEvent): void;
    focus(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<CarouselComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<CarouselComponent, "mdb-carousel", never, { "isControls": "isControls"; "class": "class"; "type": "type"; "animation": "animation"; "activeSlide": "activeSlide"; "interval": "interval"; "noWrap": "noWrap"; "noPause": "noPause"; "keyboard": "keyboard"; "activeSlideIndex": "activeSlideIndex"; }, { "activeSlideChange": "activeSlideChange"; }, ["_slidesList"], ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbImNhcm91c2VsLmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBR0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdFQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFmdGVyVmlld0luaXQsIENoYW5nZURldGVjdG9yUmVmLCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgUXVlcnlMaXN0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFNsaWRlQ29tcG9uZW50IH0gZnJvbSAnLi9zbGlkZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ2Fyb3VzZWxDb25maWcgfSBmcm9tICcuL2Nhcm91c2VsLmNvbmZpZyc7XG5leHBvcnQgZGVjbGFyZSBlbnVtIERpcmVjdGlvbiB7XG4gICAgVU5LTk9XTiA9IDAsXG4gICAgTkVYVCA9IDEsXG4gICAgUFJFViA9IDJcbn1cbi8qKlxuICogQmFzZSBlbGVtZW50IHRvIGNyZWF0ZSBjYXJvdXNlbFxuICovXG5leHBvcnQgZGVjbGFyZSBjbGFzcyBDYXJvdXNlbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XG4gICAgcHJvdGVjdGVkIGVsOiBFbGVtZW50UmVmO1xuICAgIHByaXZhdGUgY2RSZWY7XG4gICAgcHJpdmF0ZSByZW5kZXJlcjtcbiAgICBTV0lQRV9BQ1RJT046IHtcbiAgICAgICAgTEVGVDogc3RyaW5nO1xuICAgICAgICBSSUdIVDogc3RyaW5nO1xuICAgIH07XG4gICAgX3NsaWRlc0xpc3Q6IFF1ZXJ5TGlzdDxTbGlkZUNvbXBvbmVudD47XG4gICAgcmVhZG9ubHkgc2xpZGVzOiBTbGlkZUNvbXBvbmVudFtdO1xuICAgIHByaXZhdGUgX2Rlc3Ryb3kkO1xuICAgIHByb3RlY3RlZCBjdXJyZW50SW50ZXJ2YWw6IGFueTtcbiAgICBwcm90ZWN0ZWQgaXNQbGF5aW5nOiBib29sZWFuO1xuICAgIHByb3RlY3RlZCBkZXN0cm95ZWQ6IGJvb2xlYW47XG4gICAgcHJvdGVjdGVkIGFuaW1hdGlvbkVuZDogYm9vbGVhbjtcbiAgICBwcm90ZWN0ZWQgX2N1cnJlbnRBY3RpdmVTbGlkZTogbnVtYmVyO1xuICAgIHByb3RlY3RlZCBjYXJvdXNlbEluZGljYXRvcnM6IGFueTtcbiAgICBpc0Jyb3dzZXI6IGFueTtcbiAgICBub1dyYXA6IGJvb2xlYW47XG4gICAgbm9QYXVzZTogYm9vbGVhbjtcbiAgICBpc0NvbnRyb2xzOiBib29sZWFuO1xuICAgIGtleWJvYXJkOiBib29sZWFuO1xuICAgIGNsYXNzOiBTdHJpbmc7XG4gICAgdHlwZTogU3RyaW5nO1xuICAgIGFuaW1hdGlvbjogU3RyaW5nO1xuICAgIGFjdGl2ZVNsaWRlSW5kZXg6IG51bWJlcjtcbiAgICBhY3RpdmVTbGlkZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgYWN0aXZlU2xpZGU6IG51bWJlcjtcbiAgICBwcm90ZWN0ZWQgX2ludGVydmFsOiBudW1iZXI7XG4gICAgY2hlY2tOYXZpZ2F0aW9uKCk6IGJvb2xlYW47XG4gICAgY2hlY2tEb3RzKCk6IGJvb2xlYW47XG4gICAgZ2V0SW1nKHNsaWRlOiBhbnkpOiBhbnk7XG4gICAgaW50ZXJ2YWw6IG51bWJlcjtcbiAgICByZWFkb25seSBpc0JzNDogYm9vbGVhbjtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWc6IENhcm91c2VsQ29uZmlnLCBlbDogRWxlbWVudFJlZiwgcGxhdGZvcm1JZDogc3RyaW5nLCBjZFJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHJlbmRlcmVyOiBSZW5kZXJlcjIpO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG4gICAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQ7XG4gICAgc3dpcGUoYWN0aW9uPzogc3RyaW5nKTogdm9pZDtcbiAgICBuZXh0U2xpZGUoZm9yY2U/OiBib29sZWFuKTogdm9pZDtcbiAgICBwcmV2aW91c1NsaWRlKGZvcmNlPzogYm9vbGVhbik6IHZvaWQ7XG4gICAgcHJvdGVjdGVkIGZhZGVBbmltYXRpb24oZ29Ub0luZGV4OiBudW1iZXIsIGRpcmVjdGlvbj86IGFueSk6IHZvaWQ7XG4gICAgcHJvdGVjdGVkIHNsaWRlQW5pbWF0aW9uKGdvVG9JbmRleDogbnVtYmVyLCBkaXJlY3Rpb246IGFueSk6IHZvaWQ7XG4gICAgc2VsZWN0U2xpZGUoaW5kZXg6IG51bWJlcik6IHZvaWQ7XG4gICAgcGxheSgpOiB2b2lkO1xuICAgIHBhdXNlKCk6IHZvaWQ7XG4gICAgZ2V0Q3VycmVudFNsaWRlSW5kZXgoKTogbnVtYmVyO1xuICAgIGlzTGFzdChpbmRleDogbnVtYmVyKTogYm9vbGVhbjtcbiAgICBwcml2YXRlIGZpbmROZXh0U2xpZGVJbmRleDtcbiAgICBwcml2YXRlIF9zZWxlY3Q7XG4gICAgcHJpdmF0ZSByZXN0YXJ0VGltZXI7XG4gICAgcHJpdmF0ZSByZXNldFRpbWVyO1xuICAgIHByb3RlY3RlZCBoYXNDbGFzcyhlbDogYW55LCBjbGFzc05hbWU6IGFueSk6IGFueTtcbiAgICBwcm90ZWN0ZWQgY2xhc3NBZGQoZWw6IGFueSwgY2xhc3NOYW1lOiBhbnkpOiB2b2lkO1xuICAgIHByb3RlY3RlZCByZW1vdmVDbGFzcyhlbDogYW55LCBjbGFzc05hbWU6IGFueSk6IHZvaWQ7XG4gICAga2V5Ym9hcmRDb250cm9sKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZDtcbiAgICBmb2N1cygpOiB2b2lkO1xufVxuIl19