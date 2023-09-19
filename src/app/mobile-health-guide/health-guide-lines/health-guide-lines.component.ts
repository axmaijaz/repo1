import { Component, OnInit, ViewChild } from "@angular/core";
import { ModalDirective, ToastService } from "ng-uikit-pro-standard";
import { HttpResError } from "src/app/model/common/http-response-error";
import { HealthGuideDto } from "src/app/model/rpm.model";
import { MobileHealthGuideService } from "../mobile-health-guide.service";

@Component({
  selector: "app-health-guide-lines",
  templateUrl: "./health-guide-lines.component.html",
  styleUrls: ["./health-guide-lines.component.scss"],
})
export class HealthGuideLinesComponent implements OnInit {
  @ViewChild("addEditHealthGuideModal") addEditHealthGuideModal: ModalDirective;

  healthGuideDto = new HealthGuideDto();
  healthGuideLinesList = new Array<HealthGuideDto>();
  selectedHealthGuide = new HealthGuideDto();
  isEditHealthGuide = false;
  isLoadingHealthGuides: boolean;
  temp: any;
  isAddingHealthGuide: boolean;
  constructor(
    private mobileHealthGuideService: MobileHealthGuideService,
    private toaster: ToastService
  ) {}

  ngOnInit(): void {
    this.GetHealthGuideLines();
  }
  GetHealthGuideLines() {
    this.isLoadingHealthGuides = true;
    this.mobileHealthGuideService.GetHealthGuideLines().subscribe(
      (res: any) => {
        this.healthGuideLinesList = res;
        this.temp = res;
        this.isLoadingHealthGuides = false;
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
        this.isLoadingHealthGuides = false;
      }
    );
  }
  AddEditHealthGuideLine() {
    this.isAddingHealthGuide = true;
    if (this.isEditHealthGuide) {
      this.healthGuideDto.id = this.selectedHealthGuide.id;
    }
    this.mobileHealthGuideService
      .AddHealthGuideLine(this.healthGuideDto)
      .subscribe(
        (res: any) => {
          this.isAddingHealthGuide = false;
          this.toaster.success("Health Guide Added Successfuly");
          this.addEditHealthGuideModal.hide();
          this.GetHealthGuideLines();
          this.healthGuideDto = new HealthGuideDto();
        },
        (err: HttpResError) => {
          this.toaster.error(err.error);
          this.isAddingHealthGuide = false;
        }
      );
  }
  DeleteHealthGuideLines(id) {
    this.mobileHealthGuideService.DeleteHealthGuideLines(id).subscribe(
      (res: any) => {
        this.toaster.success("Health Guide Deleted Successfuly");
        this.GetHealthGuideLines();
      },
      (err: HttpResError) => {
        this.toaster.error(err.error);
      }
    );
  }
  viewHealthGuideLink(url) {
    window.open(url, "_blank");
  }
  openEditHealthGuideModal(healthGuideDto) {
    this.isEditHealthGuide = true;
    this.selectedHealthGuide = healthGuideDto;
    this.healthGuideDto = Object.assign({}, healthGuideDto);
    this.addEditHealthGuideModal.show();
  }
  onCloseHealthGuideModal() {
    this.healthGuideDto = new HealthGuideDto();
    this.isEditHealthGuide = false;
  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.temp.filter(function (d) {
      return d.title.toLowerCase().indexOf(val) !== -1 || !val;
    });
    this.healthGuideLinesList = temp;
  }
}
