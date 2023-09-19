import { Component, OnInit, ViewChild } from "@angular/core";
import { LazyModalDto } from "src/app/model/AppModels/app.model";
import { AppUiService } from "src/app/core/app-ui.service";
import { ModalDirective } from "ng-uikit-pro-standard";

@Component({
  selector: "app-confirmation-modal",
  templateUrl: "./confirmation-modal.component.html",
  styleUrls: ["./confirmation-modal.component.scss"]
})
export class ConfirmationMOdalComponent implements OnInit {
  modalObj = new LazyModalDto();
  @ViewChild("lazyConfirmationModal") lazyConfirmationModal: ModalDirective;
  constructor(private appUi: AppUiService) {
    appUi.showConfirmationSubject.subscribe((res: LazyModalDto) => {
      this.modalObj = res;
      this.lazyConfirmationModal.show();
    });
  }

  ngOnInit() {}
  proceed() {
    this.lazyConfirmationModal.hide();
    const self = this;
    // this.modalObj.callBack(this.modalObj.data);
    const callFunc = this.modalObj.callBack.bind(this);
    const mydata = this.modalObj.data;
    callFunc(mydata);
  }
  reject() {
    this.lazyConfirmationModal.hide();
    if (this.modalObj.rejectCallBack) {
      const self = this;
      // this.modalObj.callBack(this.modalObj.data);
      const callFunc = this.modalObj.rejectCallBack.bind(this);
      const mydata = this.modalObj.data;
      callFunc(mydata);
    }
  }
}
