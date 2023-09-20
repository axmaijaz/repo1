import { ElementRef, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { MDBUploaderService, UploadOutput } from '../classes/mdb-uploader.class';
import { UploaderOptions } from '../classes/mdb-uploader.class';
import * as ɵngcc0 from '@angular/core';
export declare class MDBFileSelectDirective implements OnInit, OnDestroy {
    private platform_id;
    private elementRef;
    uploadInput: EventEmitter<any>;
    options: UploaderOptions;
    uploadOutput: EventEmitter<UploadOutput>;
    private _destroy$;
    upload: MDBUploaderService;
    isServer: boolean;
    el: HTMLInputElement | any;
    constructor(platform_id: any, elementRef: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    fileListener: () => void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MDBFileSelectDirective, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MDBFileSelectDirective, "[mdbFileSelect]", never, { "uploadInput": "uploadInput"; "options": "options"; }, { "uploadOutput": "uploadOutput"; }, never, ["*"]>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLWZpbGUtc2VsZWN0LmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJtZGItZmlsZS1zZWxlY3QuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFHQTs7Ozs7Ozs7Ozs7Ozs7OztBQWNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIE9uRGVzdHJveSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTURCVXBsb2FkZXJTZXJ2aWNlLCBVcGxvYWRPdXRwdXQgfSBmcm9tICcuLi9jbGFzc2VzL21kYi11cGxvYWRlci5jbGFzcyc7XG5pbXBvcnQgeyBVcGxvYWRlck9wdGlvbnMgfSBmcm9tICcuLi9jbGFzc2VzL21kYi11cGxvYWRlci5jbGFzcyc7XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNREJGaWxlU2VsZWN0RGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICAgIHByaXZhdGUgcGxhdGZvcm1faWQ7XG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmO1xuICAgIHVwbG9hZElucHV0OiBFdmVudEVtaXR0ZXI8YW55PjtcbiAgICBvcHRpb25zOiBVcGxvYWRlck9wdGlvbnM7XG4gICAgdXBsb2FkT3V0cHV0OiBFdmVudEVtaXR0ZXI8VXBsb2FkT3V0cHV0PjtcbiAgICBwcml2YXRlIF9kZXN0cm95JDtcbiAgICB1cGxvYWQ6IE1EQlVwbG9hZGVyU2VydmljZTtcbiAgICBpc1NlcnZlcjogYm9vbGVhbjtcbiAgICBlbDogSFRNTElucHV0RWxlbWVudCB8IGFueTtcbiAgICBjb25zdHJ1Y3RvcihwbGF0Zm9ybV9pZDogYW55LCBlbGVtZW50UmVmOiBFbGVtZW50UmVmKTtcbiAgICBuZ09uSW5pdCgpOiB2b2lkO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG4gICAgZmlsZUxpc3RlbmVyOiAoKSA9PiB2b2lkO1xufVxuIl19