import { EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class MdbTreeComponent implements OnInit {
    private _cdRef;
    checked: EventEmitter<{}>;
    checkedKeys: EventEmitter<{}>;
    nodesChanged: EventEmitter<{}>;
    nodes: any;
    textField: string;
    childrenField: string;
    checkboxesField: string;
    expandAll: boolean;
    checkboxes: boolean;
    toggleOnTitleClick: boolean;
    private _expandAll;
    checkedValues: string[];
    toggle: any;
    constructor(_cdRef: ChangeDetectorRef);
    ngOnInit(): void;
    toggleExpandAll(): void;
    expandAllNodes(): void;
    closeAllNodes(): void;
    private _expandAllChildren;
    private _closeAllChildren;
    private _setInitialCheckedKeys;
    private _hasInitialCheckedKeysChildren;
    toggleByNode(i: string): void;
    private _childrenToggleByNode;
    onKeydownCheckbox(e: KeyboardEvent, node: any, i: string): void;
    onKeydown(e: KeyboardEvent, i: string): void;
    checkNodes(node: any): void;
    private _checkChildNodes;
    updateNodesCheckedValues(node: any, idx: string): void;
    private _updateChildNodesCheckedValues;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<MdbTreeComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<MdbTreeComponent, "mdb-tree", never, { "checkboxes": "checkboxes"; "toggleOnTitleClick": "toggleOnTitleClick"; "expandAll": "expandAll"; "nodes": "nodes"; "textField": "textField"; "childrenField": "childrenField"; "checkboxesField": "checkboxesField"; }, { "checked": "checked"; "checkedKeys": "checkedKeys"; "nodesChanged": "nodesChanged"; }, never, never>;
}

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS12aWV3LmNvbXBvbmVudC5kLnRzIiwic291cmNlcyI6WyJ0cmVlLXZpZXcuY29tcG9uZW50LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQ0EiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIsIE9uSW5pdCwgQ2hhbmdlRGV0ZWN0b3JSZWYgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmV4cG9ydCBkZWNsYXJlIGNsYXNzIE1kYlRyZWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHByaXZhdGUgX2NkUmVmO1xuICAgIGNoZWNrZWQ6IEV2ZW50RW1pdHRlcjx7fT47XG4gICAgY2hlY2tlZEtleXM6IEV2ZW50RW1pdHRlcjx7fT47XG4gICAgbm9kZXNDaGFuZ2VkOiBFdmVudEVtaXR0ZXI8e30+O1xuICAgIG5vZGVzOiBhbnk7XG4gICAgdGV4dEZpZWxkOiBzdHJpbmc7XG4gICAgY2hpbGRyZW5GaWVsZDogc3RyaW5nO1xuICAgIGNoZWNrYm94ZXNGaWVsZDogc3RyaW5nO1xuICAgIGV4cGFuZEFsbDogYm9vbGVhbjtcbiAgICBjaGVja2JveGVzOiBib29sZWFuO1xuICAgIHRvZ2dsZU9uVGl0bGVDbGljazogYm9vbGVhbjtcbiAgICBwcml2YXRlIF9leHBhbmRBbGw7XG4gICAgY2hlY2tlZFZhbHVlczogc3RyaW5nW107XG4gICAgdG9nZ2xlOiBhbnk7XG4gICAgY29uc3RydWN0b3IoX2NkUmVmOiBDaGFuZ2VEZXRlY3RvclJlZik7XG4gICAgbmdPbkluaXQoKTogdm9pZDtcbiAgICB0b2dnbGVFeHBhbmRBbGwoKTogdm9pZDtcbiAgICBleHBhbmRBbGxOb2RlcygpOiB2b2lkO1xuICAgIGNsb3NlQWxsTm9kZXMoKTogdm9pZDtcbiAgICBwcml2YXRlIF9leHBhbmRBbGxDaGlsZHJlbjtcbiAgICBwcml2YXRlIF9jbG9zZUFsbENoaWxkcmVuO1xuICAgIHByaXZhdGUgX3NldEluaXRpYWxDaGVja2VkS2V5cztcbiAgICBwcml2YXRlIF9oYXNJbml0aWFsQ2hlY2tlZEtleXNDaGlsZHJlbjtcbiAgICB0b2dnbGVCeU5vZGUoaTogc3RyaW5nKTogdm9pZDtcbiAgICBwcml2YXRlIF9jaGlsZHJlblRvZ2dsZUJ5Tm9kZTtcbiAgICBvbktleWRvd25DaGVja2JveChlOiBLZXlib2FyZEV2ZW50LCBub2RlOiBhbnksIGk6IHN0cmluZyk6IHZvaWQ7XG4gICAgb25LZXlkb3duKGU6IEtleWJvYXJkRXZlbnQsIGk6IHN0cmluZyk6IHZvaWQ7XG4gICAgY2hlY2tOb2Rlcyhub2RlOiBhbnkpOiB2b2lkO1xuICAgIHByaXZhdGUgX2NoZWNrQ2hpbGROb2RlcztcbiAgICB1cGRhdGVOb2Rlc0NoZWNrZWRWYWx1ZXMobm9kZTogYW55LCBpZHg6IHN0cmluZyk6IHZvaWQ7XG4gICAgcHJpdmF0ZSBfdXBkYXRlQ2hpbGROb2Rlc0NoZWNrZWRWYWx1ZXM7XG59XG4iXX0=