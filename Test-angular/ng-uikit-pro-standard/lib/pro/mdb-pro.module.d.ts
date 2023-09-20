import { ModuleWithProviders } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
import * as ɵngcc1 from './animated-cards/animated-cards.module';
import * as ɵngcc2 from './chips/chips.module';
import * as ɵngcc3 from './progressbars/index';
import * as ɵngcc4 from './tabs-pills/tabset.module';
import * as ɵngcc5 from './material-select/select.module';
import * as ɵngcc6 from './date-picker/datepicker.module';
import * as ɵngcc7 from './time-picker/timepicker.module';
import * as ɵngcc8 from './lightbox/light-box.module';
import * as ɵngcc9 from './sidenav/sidenav.module';
import * as ɵngcc10 from './easy-charts/chart-simple.module';
import * as ɵngcc11 from './accordion/index';
import * as ɵngcc12 from './sticky-content/sticky-content.module';
import * as ɵngcc13 from './smoothscroll/mdb-page-scroll.module';
import * as ɵngcc14 from './inputs/char-counter.module';
import * as ɵngcc15 from './scroll-spy/scroll-spy.module';
import * as ɵngcc16 from './auto-format/auto-format.module';
import * as ɵngcc17 from './range/range.module';
import * as ɵngcc18 from './auto-completer/auto-completer.module';
import * as ɵngcc19 from './stepper/stepper.module';
import * as ɵngcc20 from './tree-view/tree-view.module';
import * as ɵngcc21 from './file-input/module/mdb-uploader.module';
export { MdbTreeModule, MdbTreeComponent } from './tree-view/index';
export { MdbStepperComponent, MdbStepComponent, StepperModule } from './stepper/index';
export { MdbAutoCompleterComponent, MdbOptionComponent, MdbAutoCompleterDirective, AutoCompleterModule, MdbAutoCompleterOptionDirective, } from './auto-completer/index';
export { RangeModule, MdbRangeInputComponent } from './range/index';
export { AutoFormatModule, MdbDateFormatDirective, MdbCreditCardDirective, MdbCvvDirective, } from './auto-format/index';
export { ScrollSpyModule, ScrollSpyDirective, ScrollSpyWindowDirective, ScrollSpyElementDirective, ScrollSpyLinkDirective, ScrollSpyService, } from './scroll-spy/index';
export { AnimatedCardsModule, CardRotatingComponent, CardRevealComponent, } from './animated-cards/index';
export { ProgressbarComponent, ProgressbarConfigComponent, ProgressbarModule, ProgressBars, ProgressDirective, ProgressSpinnerComponent, BarComponent, } from './progressbars/index';
export { MaterialChipsComponent, ChipsModule } from './chips/index';
export { TabDirective, TabHeadingDirective, TabsetComponent, TabsetConfig, TabsModule, NgTranscludeDirective, } from './tabs-pills/index';
export { MDBSpinningPreloader } from './preloader/preloader.service';
export { SelectModule, Diacritics, Option, OptionList, IOption, SELECT_VALUE_ACCESSOR, SelectComponent, SelectDropdownComponent, } from './material-select/index';
export { MDBDatePickerComponent, DatepickerModule, IMyCalendarDay, IMyCalendarViewChanged, IMyDate, IMyDateModel, IMyDateRange, IMyDayLabels, IMyInputAutoFill, IMyInputFieldChanged, IMyInputFocusBlur, IMyLocales, IMyMarkedDate, IMyMarkedDates, IMyMonth, IMyMonthLabels, IMyOptions, IMyWeek, IMyWeekday, InputAutoFillDirective, MYDP_VALUE_ACCESSOR, UtilService, LocaleService, FocusDirective, } from './date-picker/index';
export { TimePickerModule, ClockPickerComponent } from './time-picker/index';
export { LightBoxModule, ImageModalComponent } from './lightbox/index';
export { SidenavComponent, SidenavModule } from './sidenav/index';
export { ChartSimpleModule, EasyPieChartComponent, SimpleChartComponent, } from './easy-charts/index';
export { SBItemComponent, SBItemBodyComponent, SBItemHeadComponent, SqueezeBoxComponent, AccordionModule, } from './accordion/index';
export { MdbStickyDirective, StickyContentModule } from './sticky-content/index';
export { SmoothscrollModule, PageScrollDirective, PageScrollConfig, PageScrollingViews, PageScrollInstance, PageScrollService, PageScrollTarget, PageScrollUtilService, EasingLogic, } from './smoothscroll/index';
export { CharCounterDirective, CharCounterModule } from './inputs/index';
export { MDBFileDropDirective, MDBFileSelectDirective, FileInputModule, MDBUploaderService, UploadFile, UploadOutput, UploadInput, humanizeBytes, } from './file-input/index';
export declare class MDBRootModulePro {
    static ɵmod: ɵngcc0.ɵɵNgModuleDefWithMeta<MDBRootModulePro, never, [typeof ɵngcc1.AnimatedCardsModule, typeof ɵngcc2.ChipsModule, typeof ɵngcc3.PreloadersModule, typeof ɵngcc4.TabsModule, typeof ɵngcc5.SelectModule, typeof ɵngcc6.DatepickerModule, typeof ɵngcc7.TimePickerModule, typeof ɵngcc8.LightBoxModule, typeof ɵngcc9.SidenavModule, typeof ɵngcc10.ChartSimpleModule, typeof ɵngcc11.AccordionModule, typeof ɵngcc12.StickyContentModule, typeof ɵngcc13.SmoothscrollModule, typeof ɵngcc14.CharCounterModule, typeof ɵngcc15.ScrollSpyModule, typeof ɵngcc16.AutoFormatModule, typeof ɵngcc17.RangeModule, typeof ɵngcc18.AutoCompleterModule, typeof ɵngcc19.StepperModule, typeof ɵngcc20.MdbTreeModule], [typeof ɵngcc1.AnimatedCardsModule, typeof ɵngcc21.FileInputModule, typeof ɵngcc2.ChipsModule, typeof ɵngcc3.ProgressBars, typeof ɵngcc4.TabsModule, typeof ɵngcc5.SelectModule, typeof ɵngcc6.DatepickerModule, typeof ɵngcc7.TimePickerModule, typeof ɵngcc8.LightBoxModule, typeof ɵngcc9.SidenavModule, typeof ɵngcc10.ChartSimpleModule, typeof ɵngcc11.AccordionModule, typeof ɵngcc12.StickyContentModule, typeof ɵngcc13.SmoothscrollModule, typeof ɵngcc14.CharCounterModule, typeof ɵngcc15.ScrollSpyModule, typeof ɵngcc16.AutoFormatModule, typeof ɵngcc17.RangeModule, typeof ɵngcc18.AutoCompleterModule, typeof ɵngcc19.StepperModule, typeof ɵngcc20.MdbTreeModule]>;
    static ɵinj: ɵngcc0.ɵɵInjectorDef<MDBRootModulePro>;
}
export declare class MDBBootstrapModulePro {
    static forRoot(): ModuleWithProviders<MDBRootModulePro>;
    static ɵmod: ɵngcc0.ɵɵNgModuleDefWithMeta<MDBBootstrapModulePro, never, never, [typeof ɵngcc1.AnimatedCardsModule, typeof ɵngcc21.FileInputModule, typeof ɵngcc2.ChipsModule, typeof ɵngcc3.ProgressBars, typeof ɵngcc4.TabsModule, typeof ɵngcc5.SelectModule, typeof ɵngcc6.DatepickerModule, typeof ɵngcc7.TimePickerModule, typeof ɵngcc8.LightBoxModule, typeof ɵngcc9.SidenavModule, typeof ɵngcc10.ChartSimpleModule, typeof ɵngcc11.AccordionModule, typeof ɵngcc12.StickyContentModule, typeof ɵngcc13.SmoothscrollModule, typeof ɵngcc14.CharCounterModule, typeof ɵngcc15.ScrollSpyModule, typeof ɵngcc16.AutoFormatModule, typeof ɵngcc17.RangeModule, typeof ɵngcc18.AutoCompleterModule, typeof ɵngcc19.StepperModule, typeof ɵngcc20.MdbTreeModule]>;
    static ɵinj: ɵngcc0.ɵɵInjectorDef<MDBBootstrapModulePro>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLXByby5tb2R1bGUuZC50cyIsInNvdXJjZXMiOlsibWRiLXByby5tb2R1bGUuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVCQTs7c0JBRXNCLHFDQUFtQjs7O0FBQ3pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuZXhwb3J0IHsgTWRiVHJlZU1vZHVsZSwgTWRiVHJlZUNvbXBvbmVudCB9IGZyb20gJy4vdHJlZS12aWV3L2luZGV4JztcbmV4cG9ydCB7IE1kYlN0ZXBwZXJDb21wb25lbnQsIE1kYlN0ZXBDb21wb25lbnQsIFN0ZXBwZXJNb2R1bGUgfSBmcm9tICcuL3N0ZXBwZXIvaW5kZXgnO1xuZXhwb3J0IHsgTWRiQXV0b0NvbXBsZXRlckNvbXBvbmVudCwgTWRiT3B0aW9uQ29tcG9uZW50LCBNZGJBdXRvQ29tcGxldGVyRGlyZWN0aXZlLCBBdXRvQ29tcGxldGVyTW9kdWxlLCBNZGJBdXRvQ29tcGxldGVyT3B0aW9uRGlyZWN0aXZlLCB9IGZyb20gJy4vYXV0by1jb21wbGV0ZXIvaW5kZXgnO1xuZXhwb3J0IHsgUmFuZ2VNb2R1bGUsIE1kYlJhbmdlSW5wdXRDb21wb25lbnQgfSBmcm9tICcuL3JhbmdlL2luZGV4JztcbmV4cG9ydCB7IEF1dG9Gb3JtYXRNb2R1bGUsIE1kYkRhdGVGb3JtYXREaXJlY3RpdmUsIE1kYkNyZWRpdENhcmREaXJlY3RpdmUsIE1kYkN2dkRpcmVjdGl2ZSwgfSBmcm9tICcuL2F1dG8tZm9ybWF0L2luZGV4JztcbmV4cG9ydCB7IFNjcm9sbFNweU1vZHVsZSwgU2Nyb2xsU3B5RGlyZWN0aXZlLCBTY3JvbGxTcHlXaW5kb3dEaXJlY3RpdmUsIFNjcm9sbFNweUVsZW1lbnREaXJlY3RpdmUsIFNjcm9sbFNweUxpbmtEaXJlY3RpdmUsIFNjcm9sbFNweVNlcnZpY2UsIH0gZnJvbSAnLi9zY3JvbGwtc3B5L2luZGV4JztcbmV4cG9ydCB7IEFuaW1hdGVkQ2FyZHNNb2R1bGUsIENhcmRSb3RhdGluZ0NvbXBvbmVudCwgQ2FyZFJldmVhbENvbXBvbmVudCwgfSBmcm9tICcuL2FuaW1hdGVkLWNhcmRzL2luZGV4JztcbmV4cG9ydCB7IFByb2dyZXNzYmFyQ29tcG9uZW50LCBQcm9ncmVzc2JhckNvbmZpZ0NvbXBvbmVudCwgUHJvZ3Jlc3NiYXJNb2R1bGUsIFByb2dyZXNzQmFycywgUHJvZ3Jlc3NEaXJlY3RpdmUsIFByb2dyZXNzU3Bpbm5lckNvbXBvbmVudCwgQmFyQ29tcG9uZW50LCB9IGZyb20gJy4vcHJvZ3Jlc3NiYXJzL2luZGV4JztcbmV4cG9ydCB7IE1hdGVyaWFsQ2hpcHNDb21wb25lbnQsIENoaXBzTW9kdWxlIH0gZnJvbSAnLi9jaGlwcy9pbmRleCc7XG5leHBvcnQgeyBUYWJEaXJlY3RpdmUsIFRhYkhlYWRpbmdEaXJlY3RpdmUsIFRhYnNldENvbXBvbmVudCwgVGFic2V0Q29uZmlnLCBUYWJzTW9kdWxlLCBOZ1RyYW5zY2x1ZGVEaXJlY3RpdmUsIH0gZnJvbSAnLi90YWJzLXBpbGxzL2luZGV4JztcbmV4cG9ydCB7IE1EQlNwaW5uaW5nUHJlbG9hZGVyIH0gZnJvbSAnLi9wcmVsb2FkZXIvcHJlbG9hZGVyLnNlcnZpY2UnO1xuZXhwb3J0IHsgU2VsZWN0TW9kdWxlLCBEaWFjcml0aWNzLCBPcHRpb24sIE9wdGlvbkxpc3QsIElPcHRpb24sIFNFTEVDVF9WQUxVRV9BQ0NFU1NPUiwgU2VsZWN0Q29tcG9uZW50LCBTZWxlY3REcm9wZG93bkNvbXBvbmVudCwgfSBmcm9tICcuL21hdGVyaWFsLXNlbGVjdC9pbmRleCc7XG5leHBvcnQgeyBNREJEYXRlUGlja2VyQ29tcG9uZW50LCBEYXRlcGlja2VyTW9kdWxlLCBJTXlDYWxlbmRhckRheSwgSU15Q2FsZW5kYXJWaWV3Q2hhbmdlZCwgSU15RGF0ZSwgSU15RGF0ZU1vZGVsLCBJTXlEYXRlUmFuZ2UsIElNeURheUxhYmVscywgSU15SW5wdXRBdXRvRmlsbCwgSU15SW5wdXRGaWVsZENoYW5nZWQsIElNeUlucHV0Rm9jdXNCbHVyLCBJTXlMb2NhbGVzLCBJTXlNYXJrZWREYXRlLCBJTXlNYXJrZWREYXRlcywgSU15TW9udGgsIElNeU1vbnRoTGFiZWxzLCBJTXlPcHRpb25zLCBJTXlXZWVrLCBJTXlXZWVrZGF5LCBJbnB1dEF1dG9GaWxsRGlyZWN0aXZlLCBNWURQX1ZBTFVFX0FDQ0VTU09SLCBVdGlsU2VydmljZSwgTG9jYWxlU2VydmljZSwgRm9jdXNEaXJlY3RpdmUsIH0gZnJvbSAnLi9kYXRlLXBpY2tlci9pbmRleCc7XG5leHBvcnQgeyBUaW1lUGlja2VyTW9kdWxlLCBDbG9ja1BpY2tlckNvbXBvbmVudCB9IGZyb20gJy4vdGltZS1waWNrZXIvaW5kZXgnO1xuZXhwb3J0IHsgTGlnaHRCb3hNb2R1bGUsIEltYWdlTW9kYWxDb21wb25lbnQgfSBmcm9tICcuL2xpZ2h0Ym94L2luZGV4JztcbmV4cG9ydCB7IFNpZGVuYXZDb21wb25lbnQsIFNpZGVuYXZNb2R1bGUgfSBmcm9tICcuL3NpZGVuYXYvaW5kZXgnO1xuZXhwb3J0IHsgQ2hhcnRTaW1wbGVNb2R1bGUsIEVhc3lQaWVDaGFydENvbXBvbmVudCwgU2ltcGxlQ2hhcnRDb21wb25lbnQsIH0gZnJvbSAnLi9lYXN5LWNoYXJ0cy9pbmRleCc7XG5leHBvcnQgeyBTQkl0ZW1Db21wb25lbnQsIFNCSXRlbUJvZHlDb21wb25lbnQsIFNCSXRlbUhlYWRDb21wb25lbnQsIFNxdWVlemVCb3hDb21wb25lbnQsIEFjY29yZGlvbk1vZHVsZSwgfSBmcm9tICcuL2FjY29yZGlvbi9pbmRleCc7XG5leHBvcnQgeyBNZGJTdGlja3lEaXJlY3RpdmUsIFN0aWNreUNvbnRlbnRNb2R1bGUgfSBmcm9tICcuL3N0aWNreS1jb250ZW50L2luZGV4JztcbmV4cG9ydCB7IFNtb290aHNjcm9sbE1vZHVsZSwgUGFnZVNjcm9sbERpcmVjdGl2ZSwgUGFnZVNjcm9sbENvbmZpZywgUGFnZVNjcm9sbGluZ1ZpZXdzLCBQYWdlU2Nyb2xsSW5zdGFuY2UsIFBhZ2VTY3JvbGxTZXJ2aWNlLCBQYWdlU2Nyb2xsVGFyZ2V0LCBQYWdlU2Nyb2xsVXRpbFNlcnZpY2UsIEVhc2luZ0xvZ2ljLCB9IGZyb20gJy4vc21vb3Roc2Nyb2xsL2luZGV4JztcbmV4cG9ydCB7IENoYXJDb3VudGVyRGlyZWN0aXZlLCBDaGFyQ291bnRlck1vZHVsZSB9IGZyb20gJy4vaW5wdXRzL2luZGV4JztcbmV4cG9ydCB7IE1EQkZpbGVEcm9wRGlyZWN0aXZlLCBNREJGaWxlU2VsZWN0RGlyZWN0aXZlLCBGaWxlSW5wdXRNb2R1bGUsIE1EQlVwbG9hZGVyU2VydmljZSwgVXBsb2FkRmlsZSwgVXBsb2FkT3V0cHV0LCBVcGxvYWRJbnB1dCwgaHVtYW5pemVCeXRlcywgfSBmcm9tICcuL2ZpbGUtaW5wdXQvaW5kZXgnO1xuZXhwb3J0IGRlY2xhcmUgY2xhc3MgTURCUm9vdE1vZHVsZVBybyB7XG59XG5leHBvcnQgZGVjbGFyZSBjbGFzcyBNREJCb290c3RyYXBNb2R1bGVQcm8ge1xuICAgIHN0YXRpYyBmb3JSb290KCk6IE1vZHVsZVdpdGhQcm92aWRlcnM7XG59XG4iXX0=