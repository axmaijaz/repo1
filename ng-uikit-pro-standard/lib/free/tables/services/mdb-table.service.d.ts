import { Observable } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class MdbTableService {
    private _dataSource;
    private _dataSourceChanged;
    constructor();
    addRow(newRow: any): void;
    addRowAfter(index: number, row: any): void;
    removeRow(index: number): void;
    rowRemoved(): Observable<boolean>;
    removeLastRow(): void;
    getDataSource(): any;
    setDataSource(data: any): void;
    dataSourceChange(): Observable<any>;
    filterLocalDataBy(searchKey: any): any;
    searchLocalDataBy(searchKey: any): any;
    searchDataObservable(searchKey: any): Observable<any>;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbTableService, never>;
    static ɵprov: ɵngcc0.ɵɵInjectableDef<MdbTableService>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWRiLXRhYmxlLnNlcnZpY2UuZC50cyIsInNvdXJjZXMiOlsibWRiLXRhYmxlLnNlcnZpY2UuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFlQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1kYlRhYmxlU2VydmljZSB7XG4gICAgcHJpdmF0ZSBfZGF0YVNvdXJjZTtcbiAgICBwcml2YXRlIF9kYXRhU291cmNlQ2hhbmdlZDtcbiAgICBjb25zdHJ1Y3RvcigpO1xuICAgIGFkZFJvdyhuZXdSb3c6IGFueSk6IHZvaWQ7XG4gICAgYWRkUm93QWZ0ZXIoaW5kZXg6IG51bWJlciwgcm93OiBhbnkpOiB2b2lkO1xuICAgIHJlbW92ZVJvdyhpbmRleDogbnVtYmVyKTogdm9pZDtcbiAgICByb3dSZW1vdmVkKCk6IE9ic2VydmFibGU8Ym9vbGVhbj47XG4gICAgcmVtb3ZlTGFzdFJvdygpOiB2b2lkO1xuICAgIGdldERhdGFTb3VyY2UoKTogYW55O1xuICAgIHNldERhdGFTb3VyY2UoZGF0YTogYW55KTogdm9pZDtcbiAgICBkYXRhU291cmNlQ2hhbmdlKCk6IE9ic2VydmFibGU8YW55PjtcbiAgICBmaWx0ZXJMb2NhbERhdGFCeShzZWFyY2hLZXk6IGFueSk6IGFueTtcbiAgICBzZWFyY2hMb2NhbERhdGFCeShzZWFyY2hLZXk6IGFueSk6IGFueTtcbiAgICBzZWFyY2hEYXRhT2JzZXJ2YWJsZShzZWFyY2hLZXk6IGFueSk6IE9ic2VydmFibGU8YW55Pjtcbn1cbiJdfQ==