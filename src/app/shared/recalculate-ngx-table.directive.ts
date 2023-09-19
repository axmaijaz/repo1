import { Directive, Output, EventEmitter, AfterContentChecked } from '@angular/core';
import { AppUiService } from '../core/app-ui.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Directive({
  selector: '[appRecalculateNgxTable]'
})
export class RecalculateNgxTableDirective implements AfterContentChecked {

  private latestWidth: number;
  constructor(private table: DatatableComponent, private appui: AppUiService) {
    this.appui.showSideNav.asObservable().subscribe((res: boolean) => {
      this.table.recalculate();
      this.table.recalculateColumns();
      window.dispatchEvent(new Event('resize'));
    });
  }
  ngAfterContentChecked() {

    if (this.table && this.table.element?.clientWidth !== this.latestWidth) {
      this.latestWidth = this.table.element?.clientWidth;
      this.table.recalculate();
      this.table.recalculateColumns();
      window.dispatchEvent(new Event('resize'));
    }
  }
  // @Output() public appRecalculateNgxTable  = new EventEmitter();
  // constructor(private appui: AppUiService) {
  //   this.appui.showSideNav.asObservable().subscribe((res: boolean) => {
  //       this.appRecalculateNgxTable.emit();
  //   });
  // }

}
