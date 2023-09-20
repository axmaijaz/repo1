import { OnInit } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class MdbDateFormatDirective implements OnInit {
    resultLength: number;
    separatorsNumber: number;
    separator: string;
    format: string[];
    onInput(event: any): void;
    ngOnInit(): void;
    setSeparatorsNumber(): void;
    setResultLength(): void;
    getFormattedDate(date: string): string;
    getDateParts(date: string): string[];
    getDigits(value: string): string;
    formatDateParts(datePart: any, index: number): any;
    getFormattedDay(value: string): string | undefined;
    getFormattedMonth(value: string): string | undefined;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbDateFormatDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<MdbDateFormatDirective, "[mdbDateFormat]", never, { "separator": "separator"; "format": "format"; }, {}, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLWRhdGUtZm9ybWF0LmRpcmVjdGl2ZS5kLnRzIiwic291cmNlcyI6WyJtZGItZGF0ZS1mb3JtYXQuZGlyZWN0aXZlLmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1kYkRhdGVGb3JtYXREaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHJlc3VsdExlbmd0aDogbnVtYmVyO1xuICAgIHNlcGFyYXRvcnNOdW1iZXI6IG51bWJlcjtcbiAgICBzZXBhcmF0b3I6IHN0cmluZztcbiAgICBmb3JtYXQ6IHN0cmluZ1tdO1xuICAgIG9uSW5wdXQoZXZlbnQ6IGFueSk6IHZvaWQ7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICBzZXRTZXBhcmF0b3JzTnVtYmVyKCk6IHZvaWQ7XG4gICAgc2V0UmVzdWx0TGVuZ3RoKCk6IHZvaWQ7XG4gICAgZ2V0Rm9ybWF0dGVkRGF0ZShkYXRlOiBzdHJpbmcpOiBzdHJpbmc7XG4gICAgZ2V0RGF0ZVBhcnRzKGRhdGU6IHN0cmluZyk6IHN0cmluZ1tdO1xuICAgIGdldERpZ2l0cyh2YWx1ZTogc3RyaW5nKTogc3RyaW5nO1xuICAgIGZvcm1hdERhdGVQYXJ0cyhkYXRlUGFydDogYW55LCBpbmRleDogbnVtYmVyKTogYW55O1xuICAgIGdldEZvcm1hdHRlZERheSh2YWx1ZTogc3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIGdldEZvcm1hdHRlZE1vbnRoKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG59XG4iXX0=