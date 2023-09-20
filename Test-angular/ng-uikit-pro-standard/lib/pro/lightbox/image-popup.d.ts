import { ElementRef, EventEmitter, OnInit, Renderer2 } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class ImageModalComponent implements OnInit {
    element: ElementRef;
    renderer: Renderer2;
    _element: any;
    opened: boolean;
    imgSrc: string;
    currentImageIndex: number;
    loading: boolean;
    showRepeat: boolean;
    openModalWindow: any;
    caption: string;
    isMobile: any;
    clicked: any;
    isBrowser: any;
    zoomed: string;
    SWIPE_ACTION: {
        LEFT: string;
        RIGHT: string;
    };
    modalImages: any;
    imagePointer: number;
    fullscreen: boolean;
    zoom: boolean;
    smooth: boolean;
    type: String;
    galleryImg: ElementRef;
    galleryDescription: ElementRef;
    cancelEvent: EventEmitter<any>;
    constructor(platformId: string, element: ElementRef, renderer: Renderer2);
    toggleZoomed(): void;
    toggleRestart(): void;
    ngOnInit(): void;
    closeGallery(): void;
    prevImage(): void;
    nextImage(): void;
    openGallery(index: any): void;
    fullScreen(): any;
    readonly is_iPhone_or_iPod: boolean | undefined;
    keyboardControl(event: KeyboardEvent): void;
    swipe(action?: String): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<ImageModalComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<ImageModalComponent, "mdb-image-modal", never, { "smooth": "smooth"; "zoom": "zoom"; "modalImages": "modalImages"; "imagePointer": "imagePointer"; "fullscreen": "fullscreen"; "type": "type"; }, { "cancelEvent": "cancelEvent"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtcG9wdXAuZC50cyIsInNvdXJjZXMiOlsiaW1hZ2UtcG9wdXAuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0NBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkluaXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgSW1hZ2VNb2RhbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gICAgZWxlbWVudDogRWxlbWVudFJlZjtcbiAgICByZW5kZXJlcjogUmVuZGVyZXIyO1xuICAgIF9lbGVtZW50OiBhbnk7XG4gICAgb3BlbmVkOiBib29sZWFuO1xuICAgIGltZ1NyYzogc3RyaW5nO1xuICAgIGN1cnJlbnRJbWFnZUluZGV4OiBudW1iZXI7XG4gICAgbG9hZGluZzogYm9vbGVhbjtcbiAgICBzaG93UmVwZWF0OiBib29sZWFuO1xuICAgIG9wZW5Nb2RhbFdpbmRvdzogYW55O1xuICAgIGNhcHRpb246IHN0cmluZztcbiAgICBpc01vYmlsZTogYW55O1xuICAgIGNsaWNrZWQ6IGFueTtcbiAgICBpc0Jyb3dzZXI6IGFueTtcbiAgICB6b29tZWQ6IHN0cmluZztcbiAgICBTV0lQRV9BQ1RJT046IHtcbiAgICAgICAgTEVGVDogc3RyaW5nO1xuICAgICAgICBSSUdIVDogc3RyaW5nO1xuICAgIH07XG4gICAgbW9kYWxJbWFnZXM6IGFueTtcbiAgICBpbWFnZVBvaW50ZXI6IG51bWJlcjtcbiAgICBmdWxsc2NyZWVuOiBib29sZWFuO1xuICAgIHpvb206IGJvb2xlYW47XG4gICAgc21vb3RoOiBib29sZWFuO1xuICAgIHR5cGU6IFN0cmluZztcbiAgICBnYWxsZXJ5SW1nOiBFbGVtZW50UmVmO1xuICAgIGdhbGxlcnlEZXNjcmlwdGlvbjogRWxlbWVudFJlZjtcbiAgICBjYW5jZWxFdmVudDogRXZlbnRFbWl0dGVyPGFueT47XG4gICAgY29uc3RydWN0b3IocGxhdGZvcm1JZDogc3RyaW5nLCBlbGVtZW50OiBFbGVtZW50UmVmLCByZW5kZXJlcjogUmVuZGVyZXIyKTtcbiAgICB0b2dnbGVab29tZWQoKTogdm9pZDtcbiAgICB0b2dnbGVSZXN0YXJ0KCk6IHZvaWQ7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICBjbG9zZUdhbGxlcnkoKTogdm9pZDtcbiAgICBwcmV2SW1hZ2UoKTogdm9pZDtcbiAgICBuZXh0SW1hZ2UoKTogdm9pZDtcbiAgICBvcGVuR2FsbGVyeShpbmRleDogYW55KTogdm9pZDtcbiAgICBmdWxsU2NyZWVuKCk6IGFueTtcbiAgICByZWFkb25seSBpc19pUGhvbmVfb3JfaVBvZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgICBrZXlib2FyZENvbnRyb2woZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkO1xuICAgIHN3aXBlKGFjdGlvbj86IFN0cmluZyk6IHZvaWQ7XG59XG4iXX0=