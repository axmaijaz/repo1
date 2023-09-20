import { Injector, ComponentRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Overlay } from '../overlay/overlay';
import { GlobalConfig, IndividualConfig } from './toast.config';
import { ToastContainerDirective } from './toast.directive';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastRef } from './toast-ref';
import * as ɵngcc0 from '@angular/core';
export interface ActiveToast {
    toastId?: number;
    message?: string;
    portal?: ComponentRef<any>;
    toastRef?: ToastRef<any>;
    onShown?: Observable<any>;
    onHidden?: Observable<any>;
    onTap?: Observable<any>;
    onAction?: Observable<any>;
}
export declare class ToastService {
    toastConfig: GlobalConfig | any;
    private overlay;
    private _injector;
    private sanitizer;
    index: number;
    previousToastMessage: string;
    currentlyActive: number;
    toasts: ActiveToast[];
    overlayContainer: ToastContainerDirective;
    constructor(toastConfig: GlobalConfig | any, overlay: Overlay, _injector: Injector, sanitizer: DomSanitizer);
    /** show successful toast */
    show(message: string, title?: string | any, override?: IndividualConfig | any, type?: string): any;
    /** show successful toast */
    success(message: string, title?: string | any, override?: IndividualConfig): any;
    /** show error toast */
    error(message: string, title?: string | any, override?: IndividualConfig): any;
    /** show info toast */
    info(message: string, title?: string | any, override?: IndividualConfig): any;
    /** show warning toast */
    warning(message: string, title?: string | any, override?: IndividualConfig): any;
    /**
     * Remove all or a single toast by id
     */
    clear(toastId?: number): void;
    /**
     * Remove and destroy a single toast by id
     */
    remove(toastId: number): boolean;
    /**
     * Determines if toast message is already shown
     */
    isDuplicate(message: string): boolean;
    /** create a clone of global config and apply individual settings */
    private applyConfig;
    /**
     * Find toast object by id
     */
    private _findToast;
    /**
     * Creates and attaches toast data to component
     * returns null if toast is duplicate and preventDuplicates == True
     */
    private _buildNotification;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ToastService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<ToastService>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9hc3Quc2VydmljZS5kLnRzIiwic291cmNlcyI6WyJ0b2FzdC5zZXJ2aWNlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7O0FBT0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0RBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0b3IsIENvbXBvbmVudFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgT3ZlcmxheSB9IGZyb20gJy4uL292ZXJsYXkvb3ZlcmxheSc7XG5pbXBvcnQgeyBHbG9iYWxDb25maWcsIEluZGl2aWR1YWxDb25maWcgfSBmcm9tICcuL3RvYXN0LmNvbmZpZyc7XG5pbXBvcnQgeyBUb2FzdENvbnRhaW5lckRpcmVjdGl2ZSB9IGZyb20gJy4vdG9hc3QuZGlyZWN0aXZlJztcbmltcG9ydCB7IERvbVNhbml0aXplciB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgVG9hc3RSZWYgfSBmcm9tICcuL3RvYXN0LXJlZic7XG5leHBvcnQgaW50ZXJmYWNlIEFjdGl2ZVRvYXN0IHtcbiAgICB0b2FzdElkPzogbnVtYmVyO1xuICAgIG1lc3NhZ2U/OiBzdHJpbmc7XG4gICAgcG9ydGFsPzogQ29tcG9uZW50UmVmPGFueT47XG4gICAgdG9hc3RSZWY/OiBUb2FzdFJlZjxhbnk+O1xuICAgIG9uU2hvd24/OiBPYnNlcnZhYmxlPGFueT47XG4gICAgb25IaWRkZW4/OiBPYnNlcnZhYmxlPGFueT47XG4gICAgb25UYXA/OiBPYnNlcnZhYmxlPGFueT47XG4gICAgb25BY3Rpb24/OiBPYnNlcnZhYmxlPGFueT47XG59XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBUb2FzdFNlcnZpY2Uge1xuICAgIHRvYXN0Q29uZmlnOiBHbG9iYWxDb25maWcgfCBhbnk7XG4gICAgcHJpdmF0ZSBvdmVybGF5O1xuICAgIHByaXZhdGUgX2luamVjdG9yO1xuICAgIHByaXZhdGUgc2FuaXRpemVyO1xuICAgIGluZGV4OiBudW1iZXI7XG4gICAgcHJldmlvdXNUb2FzdE1lc3NhZ2U6IHN0cmluZztcbiAgICBjdXJyZW50bHlBY3RpdmU6IG51bWJlcjtcbiAgICB0b2FzdHM6IEFjdGl2ZVRvYXN0W107XG4gICAgb3ZlcmxheUNvbnRhaW5lcjogVG9hc3RDb250YWluZXJEaXJlY3RpdmU7XG4gICAgY29uc3RydWN0b3IodG9hc3RDb25maWc6IEdsb2JhbENvbmZpZyB8IGFueSwgb3ZlcmxheTogT3ZlcmxheSwgX2luamVjdG9yOiBJbmplY3Rvciwgc2FuaXRpemVyOiBEb21TYW5pdGl6ZXIpO1xuICAgIC8qKiBzaG93IHN1Y2Nlc3NmdWwgdG9hc3QgKi9cbiAgICBzaG93KG1lc3NhZ2U6IHN0cmluZywgdGl0bGU/OiBzdHJpbmcgfCBhbnksIG92ZXJyaWRlPzogSW5kaXZpZHVhbENvbmZpZyB8IGFueSwgdHlwZT86IHN0cmluZyk6IGFueTtcbiAgICAvKiogc2hvdyBzdWNjZXNzZnVsIHRvYXN0ICovXG4gICAgc3VjY2VzcyhtZXNzYWdlOiBzdHJpbmcsIHRpdGxlPzogc3RyaW5nIHwgYW55LCBvdmVycmlkZT86IEluZGl2aWR1YWxDb25maWcpOiBhbnk7XG4gICAgLyoqIHNob3cgZXJyb3IgdG9hc3QgKi9cbiAgICBlcnJvcihtZXNzYWdlOiBzdHJpbmcsIHRpdGxlPzogc3RyaW5nIHwgYW55LCBvdmVycmlkZT86IEluZGl2aWR1YWxDb25maWcpOiBhbnk7XG4gICAgLyoqIHNob3cgaW5mbyB0b2FzdCAqL1xuICAgIGluZm8obWVzc2FnZTogc3RyaW5nLCB0aXRsZT86IHN0cmluZyB8IGFueSwgb3ZlcnJpZGU/OiBJbmRpdmlkdWFsQ29uZmlnKTogYW55O1xuICAgIC8qKiBzaG93IHdhcm5pbmcgdG9hc3QgKi9cbiAgICB3YXJuaW5nKG1lc3NhZ2U6IHN0cmluZywgdGl0bGU/OiBzdHJpbmcgfCBhbnksIG92ZXJyaWRlPzogSW5kaXZpZHVhbENvbmZpZyk6IGFueTtcbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYWxsIG9yIGEgc2luZ2xlIHRvYXN0IGJ5IGlkXG4gICAgICovXG4gICAgY2xlYXIodG9hc3RJZD86IG51bWJlcik6IHZvaWQ7XG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGFuZCBkZXN0cm95IGEgc2luZ2xlIHRvYXN0IGJ5IGlkXG4gICAgICovXG4gICAgcmVtb3ZlKHRvYXN0SWQ6IG51bWJlcik6IGJvb2xlYW47XG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyBpZiB0b2FzdCBtZXNzYWdlIGlzIGFscmVhZHkgc2hvd25cbiAgICAgKi9cbiAgICBpc0R1cGxpY2F0ZShtZXNzYWdlOiBzdHJpbmcpOiBib29sZWFuO1xuICAgIC8qKiBjcmVhdGUgYSBjbG9uZSBvZiBnbG9iYWwgY29uZmlnIGFuZCBhcHBseSBpbmRpdmlkdWFsIHNldHRpbmdzICovXG4gICAgcHJpdmF0ZSBhcHBseUNvbmZpZztcbiAgICAvKipcbiAgICAgKiBGaW5kIHRvYXN0IG9iamVjdCBieSBpZFxuICAgICAqL1xuICAgIHByaXZhdGUgX2ZpbmRUb2FzdDtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuZCBhdHRhY2hlcyB0b2FzdCBkYXRhIHRvIGNvbXBvbmVudFxuICAgICAqIHJldHVybnMgbnVsbCBpZiB0b2FzdCBpcyBkdXBsaWNhdGUgYW5kIHByZXZlbnREdXBsaWNhdGVzID09IFRydWVcbiAgICAgKi9cbiAgICBwcml2YXRlIF9idWlsZE5vdGlmaWNhdGlvbjtcbn1cbiJdfQ==