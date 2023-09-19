import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { AppAnnouncementService } from "src/app/core/app-announcement.service";
import { AppUiService } from "src/app/core/app-ui.service";
import {
  AddEditAnnouncement,
  ChangeAnnouncementStatus,
  LazyModalDto,
} from "src/app/model/AppModels/app.model";
import { HttpResError } from "src/app/model/common/http-response-error";

@Component({
  selector: "app-manage-app-announcement",
  templateUrl: "./manage-app-announcement.component.html",
  styleUrls: ["./manage-app-announcement.component.scss"],
})
export class ManageAppAnnouncementComponent implements OnInit {
  @ViewChild("addAnnouncementModal") addAnnouncementModal: ModalDirective;

  isLoading: any;
  announcementsList = [];
  addEditAnnouncement = new AddEditAnnouncement();
  changeAnnouncementStatusDto = new ChangeAnnouncementStatus();
  isAddingAnnouncement: boolean;
  isUpdatingAnnouncement: boolean;
  isDeletingAnnouncement: boolean;
  selectedAnnouncement = new AddEditAnnouncement();
  constructor(
    private appAnnouncementService: AppAnnouncementService,
    private toaster: ToastService,
    private appUi: AppUiService
  ) {}

  ngOnInit() {
    this.getAllAppAnnouncement();
  }
  getAllAppAnnouncement() {
    this.appAnnouncementService.getAllAppAnnouncement().subscribe(
      (res: any) => {
        this.announcementsList = res;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  resetAnnouncementModalForm() {
    this.addEditAnnouncement = new AddEditAnnouncement();
  }
  addAnnouncement() {
    this.isAddingAnnouncement = true;
    this.appAnnouncementService
      .CreateAppAnnouncement(this.addEditAnnouncement)
      .subscribe(
        (res: any) => {
          this.toaster.success("Announcement Created Successfully.");
          this.getAllAppAnnouncement();
          this.isAddingAnnouncement = false;
          this.addAnnouncementModal.hide();
        },
        (err: HttpResError) => {
          this.isAddingAnnouncement = false;
          this.toaster.error(err.error);
        }
      );
  }
  editAnnouncement() {
    this.isUpdatingAnnouncement = true;
    this.appAnnouncementService
      .EditAppAnnouncement(this.addEditAnnouncement)
      .subscribe(
        (res: any) => {
          this.toaster.success("Announcement Updated Successfully.");
          this.getAllAppAnnouncement();
          this.isUpdatingAnnouncement = false;
          this.addAnnouncementModal.hide();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
          this.isUpdatingAnnouncement = false;
        }
      );
  }
  changeActiveStatusOfAnnouncement(announcement) {
    if (announcement.isActiveState) {
      this.changeAnnouncementStatusDto.isActive = true;
    } else {
      this.changeAnnouncementStatusDto.isActive = false;
    }
    this.changeAnnouncementStatusDto.id = announcement.id;
    this.appAnnouncementService
      .ChangeActiveStatusOfAnnouncement(this.changeAnnouncementStatusDto)
      .subscribe(
        (res: any) => {
          if (this.changeAnnouncementStatusDto.isActive == false) {
            this.toaster.success("Announcement Deactivated");
            this.getAllAppAnnouncement();
          } else {
            this.toaster.success("Announcement Activated");
            this.getAllAppAnnouncement();
          }
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
        }
      );
  }
  openEditModal(row) {
    Object.assign(this.addEditAnnouncement, row);
    this.addAnnouncementModal.show();
  }
  deleteAnnouncement() {
    if(this.selectedAnnouncement.id){
      this.isDeletingAnnouncement = true;
      this.appAnnouncementService.DeleteAnnouncement(this.selectedAnnouncement.id).subscribe(
        (res: any) => {
          this.toaster.success("Announcement Deleted Successfully.");
          this.isDeletingAnnouncement = false;
          this.getAllAppAnnouncement();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
          this.isDeletingAnnouncement = false;
        }
      );
    }
  }
  openConfirmModal() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Announcement Delete Confirmation";
    modalDto.Text = 'Are you sure you want to delete announcement?';
    modalDto.callBack = this.callBack;
    // modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: any) => {
    this.deleteAnnouncement();
  }
}
