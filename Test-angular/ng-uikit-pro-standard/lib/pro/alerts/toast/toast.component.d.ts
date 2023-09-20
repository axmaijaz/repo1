import { ApplicationRef, OnDestroy } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { GlobalConfig, ToastPackage } from './toast.config';
import * as ɵngcc0 from '@angular/core';
export declare class ToastComponent implements OnDestroy {
    toastPackage: ToastPackage;
    protected appRef: ApplicationRef;
    message: string | SafeHtml;
    title: string;
    options: GlobalConfig;
    /** width of progress bar */
    width: number;
    state: string;
    /** a combination of toast type and options.toastClass */
    toastClasses: string;
    /** controls animation */
    readonly animationParams: {
        value: string;
        params: {
            opacity: number | undefined;
        };
    };
    opacity: number | undefined;
    timeout: any;
    intervalId: any;
    hideTime: number;
    sub: Subscription;
    sub1: Subscription;
    protected toastService: any;
    constructor(toastPackage: ToastPackage, appRef: ApplicationRef);
    ngOnDestroy(): void;
    /**
     * activates toast and sets timeout
     */
    activateToast(): void;
    /**
     * updates progress bar width
     */
    updateProgress(): void;
    /**
     * tells toastrService to remove this toast after animation time
     */
    remove(): void;
    onActionClick(): void;
    tapToast(): void;
    stickAround(): void;
    delayedHideToast(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ToastComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ToastComponent, "mdb-toast-component", never, {}, {}, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3QuY29tcG9uZW50LmQudHMiLCJzb3VyY2VzIjpbInRvYXN0LmNvbXBvbmVudC5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBsaWNhdGlvblJlZiwgT25EZXN0cm95IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBTYWZlSHRtbCB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBHbG9iYWxDb25maWcsIFRvYXN0UGFja2FnZSB9IGZyb20gJy4vdG9hc3QuY29uZmlnJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIFRvYXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgICB0b2FzdFBhY2thZ2U6IFRvYXN0UGFja2FnZTtcbiAgICBwcm90ZWN0ZWQgYXBwUmVmOiBBcHBsaWNhdGlvblJlZjtcbiAgICBtZXNzYWdlOiBzdHJpbmcgfCBTYWZlSHRtbDtcbiAgICB0aXRsZTogc3RyaW5nO1xuICAgIG9wdGlvbnM6IEdsb2JhbENvbmZpZztcbiAgICAvKiogd2lkdGggb2YgcHJvZ3Jlc3MgYmFyICovXG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBzdGF0ZTogc3RyaW5nO1xuICAgIC8qKiBhIGNvbWJpbmF0aW9uIG9mIHRvYXN0IHR5cGUgYW5kIG9wdGlvbnMudG9hc3RDbGFzcyAqL1xuICAgIHRvYXN0Q2xhc3Nlczogc3RyaW5nO1xuICAgIC8qKiBjb250cm9scyBhbmltYXRpb24gKi9cbiAgICByZWFkb25seSBhbmltYXRpb25QYXJhbXM6IHtcbiAgICAgICAgdmFsdWU6IHN0cmluZztcbiAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICBvcGFjaXR5OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBvcGFjaXR5OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gICAgdGltZW91dDogYW55O1xuICAgIGludGVydmFsSWQ6IGFueTtcbiAgICBoaWRlVGltZTogbnVtYmVyO1xuICAgIHN1YjogU3Vic2NyaXB0aW9uO1xuICAgIHN1YjE6IFN1YnNjcmlwdGlvbjtcbiAgICBwcm90ZWN0ZWQgdG9hc3RTZXJ2aWNlOiBhbnk7XG4gICAgY29uc3RydWN0b3IodG9hc3RQYWNrYWdlOiBUb2FzdFBhY2thZ2UsIGFwcFJlZjogQXBwbGljYXRpb25SZWYpO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogYWN0aXZhdGVzIHRvYXN0IGFuZCBzZXRzIHRpbWVvdXRcbiAgICAgKi9cbiAgICBhY3RpdmF0ZVRvYXN0KCk6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogdXBkYXRlcyBwcm9ncmVzcyBiYXIgd2lkdGhcbiAgICAgKi9cbiAgICB1cGRhdGVQcm9ncmVzcygpOiB2b2lkO1xuICAgIC8qKlxuICAgICAqIHRlbGxzIHRvYXN0clNlcnZpY2UgdG8gcmVtb3ZlIHRoaXMgdG9hc3QgYWZ0ZXIgYW5pbWF0aW9uIHRpbWVcbiAgICAgKi9cbiAgICByZW1vdmUoKTogdm9pZDtcbiAgICBvbkFjdGlvbkNsaWNrKCk6IHZvaWQ7XG4gICAgdGFwVG9hc3QoKTogdm9pZDtcbiAgICBzdGlja0Fyb3VuZCgpOiB2b2lkO1xuICAgIGRlbGF5ZWRIaWRlVG9hc3QoKTogdm9pZDtcbn1cbiJdfQ==