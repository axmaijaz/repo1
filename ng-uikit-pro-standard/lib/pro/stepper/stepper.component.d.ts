import { QueryList, AfterContentInit, ElementRef, AfterViewInit, Renderer2, AfterContentChecked, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MdbStepComponent } from './step.component';
import { WavesDirective } from '../../free/waves/waves-effect.directive';
import { Observable, Subject } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class StepChangeEvent {
    activeStep: MdbStepComponent;
    activeStepIndex: number;
    previousStep: MdbStepComponent;
    previousStepIndex: number;
}
export declare class MdbStepperComponent implements AfterContentInit, AfterViewInit, AfterContentChecked, OnDestroy {
    ripple: WavesDirective;
    private _renderer;
    private _cdRef;
    steps: QueryList<MdbStepComponent>;
    stepTitles: QueryList<ElementRef>;
    stepContents: QueryList<ElementRef>;
    container: ElementRef;
    linear: boolean;
    disableWaves: boolean;
    vertical: boolean;
    private _vertical;
    stepChange: EventEmitter<StepChangeEvent>;
    constructor(ripple: WavesDirective, _renderer: Renderer2, _cdRef: ChangeDetectorRef, platformId: string);
    private _destroy;
    isBrowser: boolean;
    horizontal: boolean;
    activeStepIndex: number;
    private _activeStepIndex;
    private _activeStep;
    private stepTextContent;
    stepChangeSubject: Subject<any>;
    stepChange$: Observable<any>;
    getStepChange$(): Observable<any>;
    onClick(index: number, event: any): void;
    private _isStepValid;
    getAnimationState(index: number): string;
    private _getStepByIndex;
    next(): void;
    previous(): void;
    submit(): void;
    setNewActiveStep(index: number): void;
    private _markCurrentAsDone;
    private _markCurrentAsWrong;
    private _markStepControlsAsDirty;
    private _removeStepValidationClasses;
    private _isNewStepLinear;
    private _setActiveStep;
    private _removeCurrentActiveStep;
    resetAll(): void;
    private _updateHorizontalStepperHeight;
    private _initStepperVariation;
    ngAfterViewInit(): void;
    ngAfterContentInit(): void;
    ngAfterContentChecked(): void;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbStepperComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdbStepperComponent, "mdb-stepper", ["mdbStepper"], { "linear": "linear"; "disableWaves": "disableWaves"; "vertical": "vertical"; }, { "stepChange": "stepChange"; }, ["steps"], never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RlcHBlci5jb21wb25lbnQuZC50cyIsInNvdXJjZXMiOlsic3RlcHBlci5jb21wb25lbnQuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0RBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUXVlcnlMaXN0LCBBZnRlckNvbnRlbnRJbml0LCBFbGVtZW50UmVmLCBBZnRlclZpZXdJbml0LCBSZW5kZXJlcjIsIEFmdGVyQ29udGVudENoZWNrZWQsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBDaGFuZ2VEZXRlY3RvclJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTWRiU3RlcENvbXBvbmVudCB9IGZyb20gJy4vc3RlcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgV2F2ZXNEaXJlY3RpdmUgfSBmcm9tICcuLi8uLi9mcmVlL3dhdmVzL3dhdmVzLWVmZmVjdC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgU3RlcENoYW5nZUV2ZW50IHtcbiAgICBhY3RpdmVTdGVwOiBNZGJTdGVwQ29tcG9uZW50O1xuICAgIGFjdGl2ZVN0ZXBJbmRleDogbnVtYmVyO1xuICAgIHByZXZpb3VzU3RlcDogTWRiU3RlcENvbXBvbmVudDtcbiAgICBwcmV2aW91c1N0ZXBJbmRleDogbnVtYmVyO1xufVxuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTWRiU3RlcHBlckNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIEFmdGVyVmlld0luaXQsIEFmdGVyQ29udGVudENoZWNrZWQsIE9uRGVzdHJveSB7XG4gICAgcmlwcGxlOiBXYXZlc0RpcmVjdGl2ZTtcbiAgICBwcml2YXRlIF9yZW5kZXJlcjtcbiAgICBwcml2YXRlIF9jZFJlZjtcbiAgICBzdGVwczogUXVlcnlMaXN0PE1kYlN0ZXBDb21wb25lbnQ+O1xuICAgIHN0ZXBUaXRsZXM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcbiAgICBzdGVwQ29udGVudHM6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcbiAgICBjb250YWluZXI6IEVsZW1lbnRSZWY7XG4gICAgbGluZWFyOiBib29sZWFuO1xuICAgIGRpc2FibGVXYXZlczogYm9vbGVhbjtcbiAgICB2ZXJ0aWNhbDogYm9vbGVhbjtcbiAgICBwcml2YXRlIF92ZXJ0aWNhbDtcbiAgICBzdGVwQ2hhbmdlOiBFdmVudEVtaXR0ZXI8U3RlcENoYW5nZUV2ZW50PjtcbiAgICBjb25zdHJ1Y3RvcihyaXBwbGU6IFdhdmVzRGlyZWN0aXZlLCBfcmVuZGVyZXI6IFJlbmRlcmVyMiwgX2NkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZiwgcGxhdGZvcm1JZDogc3RyaW5nKTtcbiAgICBwcml2YXRlIF9kZXN0cm95O1xuICAgIGlzQnJvd3NlcjogYm9vbGVhbjtcbiAgICBob3Jpem9udGFsOiBib29sZWFuO1xuICAgIGFjdGl2ZVN0ZXBJbmRleDogbnVtYmVyO1xuICAgIHByaXZhdGUgX2FjdGl2ZVN0ZXBJbmRleDtcbiAgICBwcml2YXRlIF9hY3RpdmVTdGVwO1xuICAgIHByaXZhdGUgc3RlcFRleHRDb250ZW50O1xuICAgIHN0ZXBDaGFuZ2VTdWJqZWN0OiBTdWJqZWN0PGFueT47XG4gICAgc3RlcENoYW5nZSQ6IE9ic2VydmFibGU8YW55PjtcbiAgICBnZXRTdGVwQ2hhbmdlJCgpOiBPYnNlcnZhYmxlPGFueT47XG4gICAgb25DbGljayhpbmRleDogbnVtYmVyLCBldmVudDogYW55KTogdm9pZDtcbiAgICBwcml2YXRlIF9pc1N0ZXBWYWxpZDtcbiAgICBnZXRBbmltYXRpb25TdGF0ZShpbmRleDogbnVtYmVyKTogc3RyaW5nO1xuICAgIHByaXZhdGUgX2dldFN0ZXBCeUluZGV4O1xuICAgIG5leHQoKTogdm9pZDtcbiAgICBwcmV2aW91cygpOiB2b2lkO1xuICAgIHN1Ym1pdCgpOiB2b2lkO1xuICAgIHNldE5ld0FjdGl2ZVN0ZXAoaW5kZXg6IG51bWJlcik6IHZvaWQ7XG4gICAgcHJpdmF0ZSBfbWFya0N1cnJlbnRBc0RvbmU7XG4gICAgcHJpdmF0ZSBfbWFya0N1cnJlbnRBc1dyb25nO1xuICAgIHByaXZhdGUgX21hcmtTdGVwQ29udHJvbHNBc0RpcnR5O1xuICAgIHByaXZhdGUgX3JlbW92ZVN0ZXBWYWxpZGF0aW9uQ2xhc3NlcztcbiAgICBwcml2YXRlIF9pc05ld1N0ZXBMaW5lYXI7XG4gICAgcHJpdmF0ZSBfc2V0QWN0aXZlU3RlcDtcbiAgICBwcml2YXRlIF9yZW1vdmVDdXJyZW50QWN0aXZlU3RlcDtcbiAgICByZXNldEFsbCgpOiB2b2lkO1xuICAgIHByaXZhdGUgX3VwZGF0ZUhvcml6b250YWxTdGVwcGVySGVpZ2h0O1xuICAgIHByaXZhdGUgX2luaXRTdGVwcGVyVmFyaWF0aW9uO1xuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkO1xuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkO1xuICAgIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpOiB2b2lkO1xuICAgIG5nT25EZXN0cm95KCk6IHZvaWQ7XG59XG4iXX0=