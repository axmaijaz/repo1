import { ComponentRef, TemplateRef, EventEmitter, RendererFactory2 } from '@angular/core';
import { ComponentLoaderFactory } from '../utils/component-loader/component-loader.factory';
import { ModalBackdropComponent } from './modalBackdrop.component';
import { MDBModalRef, ModalOptions } from './modal.options';
import * as ɵngcc0 from '@angular/core';
export declare class MDBModalService {
    private clf;
    config: ModalOptions;
    private renderer;
    private vcr;
    private el;
    open: EventEmitter<any>;
    opened: EventEmitter<any>;
    close: EventEmitter<any>;
    closed: EventEmitter<any>;
    protected isBodyOverflowing: boolean;
    protected originalBodyPadding: number;
    protected scrollbarWidth: number;
    protected backdropRef: ComponentRef<ModalBackdropComponent> | any;
    private _backdropLoader;
    private modalsCount;
    private lastDismissReason;
    private loaders;
    constructor(rendererFactory: RendererFactory2, clf: ComponentLoaderFactory);
    /** Shows a modal */
    show(content: string | TemplateRef<any> | any, config?: any): MDBModalRef;
    hide(level: number): void;
    _showBackdrop(): void;
    _hideBackdrop(): void;
    _showModal(content: any): MDBModalRef;
    _hideModal(level: number): void;
    getModalsCount(): number;
    setDismissReason(reason: string): void;
    protected removeBackdrop(): void;
    /** AFTER PR MERGE MODAL.COMPONENT WILL BE USING THIS CODE*/
    /** Scroll bar tricks */
    /** @internal */
    checkScrollbar(): void;
    setScrollbar(): void;
    private resetScrollbar;
    private getScrollbarWidth;
    private _createLoaders;
    private removeLoaders;
    private copyEvent;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MDBModalService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<MDBModalService>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuc2VydmljZS5kLnRzIiwic291cmNlcyI6WyJtb2RhbC5zZXJ2aWNlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7O0FBSUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50UmVmLCBUZW1wbGF0ZVJlZiwgRXZlbnRFbWl0dGVyLCBSZW5kZXJlckZhY3RvcnkyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21wb25lbnRMb2FkZXJGYWN0b3J5IH0gZnJvbSAnLi4vdXRpbHMvY29tcG9uZW50LWxvYWRlci9jb21wb25lbnQtbG9hZGVyLmZhY3RvcnknO1xuaW1wb3J0IHsgTW9kYWxCYWNrZHJvcENvbXBvbmVudCB9IGZyb20gJy4vbW9kYWxCYWNrZHJvcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTURCTW9kYWxSZWYsIE1vZGFsT3B0aW9ucyB9IGZyb20gJy4vbW9kYWwub3B0aW9ucyc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNREJNb2RhbFNlcnZpY2Uge1xuICAgIHByaXZhdGUgY2xmO1xuICAgIGNvbmZpZzogTW9kYWxPcHRpb25zO1xuICAgIHByaXZhdGUgcmVuZGVyZXI7XG4gICAgcHJpdmF0ZSB2Y3I7XG4gICAgcHJpdmF0ZSBlbDtcbiAgICBvcGVuOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBvcGVuZWQ6IEV2ZW50RW1pdHRlcjxhbnk+O1xuICAgIGNsb3NlOiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBjbG9zZWQ6IEV2ZW50RW1pdHRlcjxhbnk+O1xuICAgIHByb3RlY3RlZCBpc0JvZHlPdmVyZmxvd2luZzogYm9vbGVhbjtcbiAgICBwcm90ZWN0ZWQgb3JpZ2luYWxCb2R5UGFkZGluZzogbnVtYmVyO1xuICAgIHByb3RlY3RlZCBzY3JvbGxiYXJXaWR0aDogbnVtYmVyO1xuICAgIHByb3RlY3RlZCBiYWNrZHJvcFJlZjogQ29tcG9uZW50UmVmPE1vZGFsQmFja2Ryb3BDb21wb25lbnQ+IHwgYW55O1xuICAgIHByaXZhdGUgX2JhY2tkcm9wTG9hZGVyO1xuICAgIHByaXZhdGUgbW9kYWxzQ291bnQ7XG4gICAgcHJpdmF0ZSBsYXN0RGlzbWlzc1JlYXNvbjtcbiAgICBwcml2YXRlIGxvYWRlcnM7XG4gICAgY29uc3RydWN0b3IocmVuZGVyZXJGYWN0b3J5OiBSZW5kZXJlckZhY3RvcnkyLCBjbGY6IENvbXBvbmVudExvYWRlckZhY3RvcnkpO1xuICAgIC8qKiBTaG93cyBhIG1vZGFsICovXG4gICAgc2hvdyhjb250ZW50OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjxhbnk+IHwgYW55LCBjb25maWc/OiBhbnkpOiBNREJNb2RhbFJlZjtcbiAgICBoaWRlKGxldmVsOiBudW1iZXIpOiB2b2lkO1xuICAgIF9zaG93QmFja2Ryb3AoKTogdm9pZDtcbiAgICBfaGlkZUJhY2tkcm9wKCk6IHZvaWQ7XG4gICAgX3Nob3dNb2RhbChjb250ZW50OiBhbnkpOiBNREJNb2RhbFJlZjtcbiAgICBfaGlkZU1vZGFsKGxldmVsOiBudW1iZXIpOiB2b2lkO1xuICAgIGdldE1vZGFsc0NvdW50KCk6IG51bWJlcjtcbiAgICBzZXREaXNtaXNzUmVhc29uKHJlYXNvbjogc3RyaW5nKTogdm9pZDtcbiAgICBwcm90ZWN0ZWQgcmVtb3ZlQmFja2Ryb3AoKTogdm9pZDtcbiAgICAvKiogQUZURVIgUFIgTUVSR0UgTU9EQUwuQ09NUE9ORU5UIFdJTEwgQkUgVVNJTkcgVEhJUyBDT0RFKi9cbiAgICAvKiogU2Nyb2xsIGJhciB0cmlja3MgKi9cbiAgICAvKiogQGludGVybmFsICovXG4gICAgY2hlY2tTY3JvbGxiYXIoKTogdm9pZDtcbiAgICBzZXRTY3JvbGxiYXIoKTogdm9pZDtcbiAgICBwcml2YXRlIHJlc2V0U2Nyb2xsYmFyO1xuICAgIHByaXZhdGUgZ2V0U2Nyb2xsYmFyV2lkdGg7XG4gICAgcHJpdmF0ZSBfY3JlYXRlTG9hZGVycztcbiAgICBwcml2YXRlIHJlbW92ZUxvYWRlcnM7XG4gICAgcHJpdmF0ZSBjb3B5RXZlbnQ7XG59XG4iXX0=