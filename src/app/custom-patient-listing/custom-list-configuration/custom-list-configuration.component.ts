import { SecurityService } from 'src/app/core/security/security.service';
import { filter } from 'rxjs/operators';
import { CustomeListService } from './../../core/custome-list.service';
import { AddEditCustomListDto, ColumnDto } from 'src/app/model/custome-list.model';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpResError } from 'src/app/model/common/http-response-error';

@Component({
  selector: 'app-custom-list-configuration',
  templateUrl: './custom-list-configuration.component.html',
  styleUrls: ['./custom-list-configuration.component.scss']
})
export class CustomListConfigurationComponent implements OnInit {
  isAddListLoading = false;
  listOfColumns = new Array<ColumnDto>();
  // tempListOfColumns = new Array<ColumnDto>();
  columnsName = new Array<string>();
  facilityUserId = 0;
  addEditCustomListDto = new AddEditCustomListDto();
  CustomListDto = new Array<AddEditCustomListDto>();
  @ViewChild('customListModal') customListModal: ModalDirective;
  constructor(private customListService: CustomeListService, private toaster: ToastService,
    private securityService: SecurityService) { }

  ngOnInit() {
    this.facilityUserId = this.securityService.securityObject.id;
    this.getCustomListColums();
    this.GetCustomListsByFacilityUserId();
  }
  getCustomListColums() {
    // this.isLoadingPayersList = true;
    this.customListService.GetCustomListColums().subscribe(
      (res: ColumnDto[]) => {
        if (res.length > 0) {
          res.forEach(element => {
            element.check = false;
          });
          // this.tempListOfColumns = [...res];
          this.listOfColumns = res;
        }
      },
      (error: HttpResError) => {
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetCustomListsByFacilityUserId() {
    // this.isLoadingPayersList = true;
    this.customListService.GetCustomListsByFacilityUserId(this.facilityUserId).subscribe(
      (res: any) => {
        this.CustomListDto = res.customListsDto;
      },
      (error: HttpResError) => {
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  deActiveColumns() {
    this.listOfColumns.forEach(element => {
      element.check = false;
    });
  }
  getSelectedColumns(item: AddEditCustomListDto) {
    this.customListModal.show();
    this.resetModal();
    this.addEditCustomListDto = item;
   var columns = item.columnsList.split(',');
   columns.forEach(element => {
     this.listOfColumns.forEach(col => {
      if (col.name === element) {
        col.check = true;
        this.columnsName.push(col.name);
      }
     });
   });

  }
  selectColumns(column: ColumnDto) {
    column.check = !column.check;
    if (column.check) {
      this.columnsName.push(column.name);
    } else {
      this.columnsName = this.columnsName.filter(res => {
        return res !== column.name;
      });
    }
  }
  addEditCustomList() {
    this.isAddListLoading = true;
    this.addEditCustomListDto.columnsList = this.columnsName.join();
    this.addEditCustomListDto.facilityUserId = this.facilityUserId;
    this.customListService.AddEditCustomList(this.addEditCustomListDto).subscribe(
      (res) => {
        this.addEditCustomListDto = new AddEditCustomListDto();
        this.GetCustomListsByFacilityUserId();
        this.columnsName = [];
        this.isAddListLoading = false;
        this.customListModal.hide();
      },
      (error: HttpResError) => {
        this.isAddListLoading = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  resetModal() {
    this.addEditCustomListDto = new AddEditCustomListDto();
    this.columnsName = [];
    this.deActiveColumns();
  }

}
