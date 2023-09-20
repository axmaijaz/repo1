import { ElementRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MDBUploaderService, UploaderOptions, UploadInput, UploadOutput } from '../classes/mdb-uploader.class';
import * as ɵngcc0 from '@angular/core';
export declare class MDBFileDropDirective implements OnInit, OnDestroy {
    private platform_id;
    private elementRef;
    uploadInput: EventEmitter<UploadInput>;
    options: UploaderOptions;
    uploadOutput: EventEmitter<UploadOutput>;
    private _destroy$;
    upload: MDBUploaderService;
    isServer: boolean;
    el: HTMLInputElement;
    constructor(platform_id: any, elementRef: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    stopEvent: (e: Event) => void;
    onDrop(e: any): void;
    onDragOver(e: Event): void;
    onDragLeave(e: Event): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MDBFileDropDirective, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MDBFileDropDirective, "[mdbFileDrop]", never, { "uploadInput": "uploadInput"; "options": "options"; }, { "uploadOutput": "uploadOutput"; }, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLWZpbGUtZHJvcC5kaXJlY3RpdmUuZC50cyIsInNvdXJjZXMiOlsibWRiLWZpbGUtZHJvcC5kaXJlY3RpdmUuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFpQkEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBNREJVcGxvYWRlclNlcnZpY2UsIFVwbG9hZGVyT3B0aW9ucywgVXBsb2FkSW5wdXQsIFVwbG9hZE91dHB1dCB9IGZyb20gJy4uL2NsYXNzZXMvbWRiLXVwbG9hZGVyLmNsYXNzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1EQkZpbGVEcm9wRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHByaXZhdGUgcGxhdGZvcm1faWQ7XG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmO1xuICAgIHVwbG9hZElucHV0OiBFdmVudEVtaXR0ZXI8VXBsb2FkSW5wdXQ+O1xuICAgIG9wdGlvbnM6IFVwbG9hZGVyT3B0aW9ucztcbiAgICB1cGxvYWRPdXRwdXQ6IEV2ZW50RW1pdHRlcjxVcGxvYWRPdXRwdXQ+O1xuICAgIHByaXZhdGUgX2Rlc3Ryb3kkO1xuICAgIHVwbG9hZDogTURCVXBsb2FkZXJTZXJ2aWNlO1xuICAgIGlzU2VydmVyOiBib29sZWFuO1xuICAgIGVsOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIGNvbnN0cnVjdG9yKHBsYXRmb3JtX2lkOiBhbnksIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpO1xuICAgIG5nT25Jbml0KCk6IHZvaWQ7XG4gICAgbmdPbkRlc3Ryb3koKTogdm9pZDtcbiAgICBzdG9wRXZlbnQ6IChlOiBFdmVudCkgPT4gdm9pZDtcbiAgICBvbkRyb3AoZTogYW55KTogdm9pZDtcbiAgICBvbkRyYWdPdmVyKGU6IEV2ZW50KTogdm9pZDtcbiAgICBvbkRyYWdMZWF2ZShlOiBFdmVudCk6IHZvaWQ7XG59XG4iXX0=