import { AppUiService } from './../../core/app-ui.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { IntellisenseService } from './../../core/Tools/intellisense.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from 'ng-uikit-pro-standard';
import { EventBusService } from 'src/app/core/event-bus.service';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { UserType } from 'src/app/Enums/UserType.enum';
import { AddEditSmartPhraseDto, SmartPhraseListDto, SmartPhraseVariablesListDto } from 'src/app/model/Tools/intellisense.model';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';

@Component({
  selector: 'app-admin-intellisense',
  templateUrl: './admin-intellisense.component.html',
  styleUrls: ['./admin-intellisense.component.scss']
})
export class AdminIntellisenseComponent implements OnInit {
  facilityUserId: number;
  smartPhrasesList: SmartPhraseListDto[] = [];
  smartVariablesList: SmartPhraseVariablesListDto[] = [];
  addEditSmartPhraseDto = new AddEditSmartPhraseDto();
  gettingVariables: boolean;
  gettingPhrases: boolean;
  addingPhrases: boolean;
  searchPhraseText: string;

  constructor(private toaster: ToastService,
    private router: Router,
    private securityService: SecurityService,
    private route: ActivatedRoute,
    private eventBus: EventBusService,
    private appUi: AppUiService,
    private intellisenseService: IntellisenseService
    ) { }

  ngOnInit(): void {
    this.facilityUserId = this.securityService.securityObject.id;
    if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      this.facilityUserId = 0;
    }
    this.GetSmartPhrases();
    this.GetSystemVariables();
  }
  GetSystemVariables() {
    // this.isLoadingPayersList = true;
    this.gettingVariables = true;
    this.intellisenseService.GetSystemVariables().subscribe(
      (res: SmartPhraseVariablesListDto[]) => {
        this.gettingVariables = false;
        this.smartVariablesList = res;
      },
      (error: HttpResError) => {
        this.gettingVariables = false;
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetSmartPhrases() {
    this.gettingPhrases = true;
    this.intellisenseService.GetSmartPhrases(this.facilityUserId).subscribe(
      (res: SmartPhraseListDto[]) => {
        this.gettingPhrases = false;
        this.smartPhrasesList = res.sort((a,b) => 0 - (a.title > b.title ? -1 : 1));
      },
      (error: HttpResError) => {
        this.gettingPhrases = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openConfirmModal(data: SmartPhraseListDto) {
    if (!this.addEditSmartPhraseDto.title && !this.addEditSmartPhraseDto.text) {
      this.AssignEditDetails(data);
      return;
    }
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Edit Phrase';
    modalDto.Text = 'There could be unsaved changes , Do you want to proceed ?';
    modalDto.callBack = this.callBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (data: SmartPhraseListDto) => {
    this.AssignEditDetails(data);
  };
  openDeleteConfirmModal(data: SmartPhraseListDto) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Delete Phrase';
    modalDto.Text = 'Do you want to delete this phrase?';
    modalDto.callBack = this.deleteCallBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  deleteCallBack = (data: SmartPhraseListDto) => {
    this.intellisenseService.DeleteSmartPhrase(data.id).subscribe(
      (res: any) => {
        this.addingPhrases = false;
        this.toaster.success('Phrase deleted successfully');
        if (data.id === this.addEditSmartPhraseDto.id) {
          this.NewPhrase();
        }
        this.GetSmartPhrases();
      },
      (error: HttpResError) => {
        this.addingPhrases = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AssignEditDetails(item: SmartPhraseListDto) {
    this.NewPhrase();
    this.addEditSmartPhraseDto.id = item.id;
    this.addEditSmartPhraseDto.title = item.title;
    this.addEditSmartPhraseDto.text = item.text;
    this.addEditSmartPhraseDto.userId = item.userId;
  }
  NewPhraseWarningCheck() {
    if (!this.addEditSmartPhraseDto.title && !this.addEditSmartPhraseDto.text) {
      this.NewPhrase();
      return;
    }
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Edit Phrase';
    modalDto.Text = 'There could be unsaved changes , Do you want to proceed ?';
    modalDto.callBack = this.NewPhrase;
    modalDto.data = null;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  NewPhrase = () => {
    this.addEditSmartPhraseDto = new AddEditSmartPhraseDto();
  }
  AddEditSmartPhrase() {
    this.addingPhrases = true;
    if (!this.addEditSmartPhraseDto.id) {
      this.addEditSmartPhraseDto.userId = this.facilityUserId;
    }
    this.intellisenseService.AddEditSmartPhrase(this.addEditSmartPhraseDto).subscribe(
      (res: any) => {
        this.addingPhrases = false;
        this.toaster.success('Phrase saved successfully');
        this.NewPhrase();
        this.GetSmartPhrases();
      },
      (error: HttpResError) => {
        this.addingPhrases = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  FillSystemVariablesInTextArea(item: SmartPhraseVariablesListDto) {
    const appendText = `@${item.title}@ `;
    const txtarea = document.getElementById('phraseTextEle') as HTMLTextAreaElement;
    const start = txtarea.selectionStart;
    const end = txtarea.selectionEnd;
    const sel = txtarea.value.substring(start, end);
    const finText = txtarea.value.substring(0, start) + appendText + txtarea.value.substring(end);
    txtarea.value = finText;
    txtarea.focus();
    txtarea.selectionEnd = end + appendText.length;
    this.addEditSmartPhraseDto.text = txtarea.value;
  }

}
