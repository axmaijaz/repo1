import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BulkCommunicationService } from './../../communication/bulk-communication.service';
import { Router } from '@angular/router';
import { ModalDirective, ToastService } from 'ng-uikit-pro-standard';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { RingCentralService } from 'src/app/core/RingCentral/ring-central.service';
import { CommunicationService } from 'src/app/core/communication.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { EventBusService } from 'src/app/core/event-bus.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { AddEditCommunicationTemplate, BulkTemplateDataGroupDto, CommunicationTagListDto, PatientCommTemplateGroup, TemplateGroupListDto } from 'src/app/model/PatientEngagement/bulk-communication.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { AppUiService } from 'src/app/core/app-ui.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { IntellisenseService } from 'src/app/core/Tools/intellisense.service';
import { SmartPhraseVariablesListDto } from 'src/app/model/Tools/intellisense.model';
import { enumToArray } from 'src/app/shared-functions/enumFunction';

@Component({
  selector: 'app-communication-templates',
  templateUrl: './communication-templates.component.html',
  styleUrls: ['./communication-templates.component.scss']
})
export class CommunicationTemplatesComponent implements OnInit {
  AddEditTemplateDto = new AddEditCommunicationTemplate()
  templatesList: AddEditCommunicationTemplate[] = [];
  gettingTemplates: boolean;
  facilityId: number;
  editingTemplate: boolean;
  TagsList: CommunicationTagListDto[] = [];
  gettingTags: boolean;
  tagName: string;
  editingTag: boolean;


  searchTemplateText: string;
  addingPhrases: boolean;
  gettingVariables: boolean;
  smartVariablesList: SmartPhraseVariablesListDto[] = [];

  templateGroupEnumList = enumToArray(PatientCommTemplateGroup);
  bulkTemplateGroups: BulkTemplateDataGroupDto[] = [];

  constructor(private toaster: ToastService, private commService: CommunicationService, private dataService: DataFilterService,
    private eventBus: EventBusService, private router: Router,private bulkCommunication: BulkCommunicationService,
    private cdr: ChangeDetectorRef, public rcService: RingCentralService,
    private appUi: AppUiService,
    private intellisenseService: IntellisenseService,
    private securityService: SecurityService, private patientsService: PatientsService, private facilityService: FacilityService) { }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId')?.claimValue || 0;
    this.GetAllTags()
    this.GetAllTemplates()
    this.GetSystemVariables()
  }
  GetAllTemplates() {
    this.templatesList = [];
    this.bulkTemplateGroups = [];
    this.gettingTemplates = true;

    this.bulkCommunication.GetAllTemplates(this.facilityId).subscribe(
      (res: TemplateGroupListDto[]) => {
        this.gettingTemplates = false;
        if (res?.length) {
          // res = res.sortByNumber('patientsCount', true)
          res.forEach(x => {
            x.templateGroupName = PatientCommTemplateGroup[x.templateGroup]
          })
          const result = res.groupByProp('templateGroupName')
          result.forEach(group => {
            const newGroup = new BulkTemplateDataGroupDto();
            newGroup.Key = group.Key
            newGroup.collapsed = false
            newGroup.values = group.values;
            this.bulkTemplateGroups.push(newGroup)
          });
          // this.templatesList = res;

        }
        // if (res?.length) {
        //   this.templatesList = res;

        // }
      },
      (error: HttpResError) => {
        this.gettingTemplates = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

  AddEditTemplate() {
    this.editingTemplate = true;

    this.bulkCommunication.AddEditTemplate(this.AddEditTemplateDto).subscribe(
      (res: AddEditCommunicationTemplate) => {
        this.editingTemplate = false;
        this.toaster.success('Template saved successfully');
        this.NewPhrase();
        this.GetAllTemplates();
      },
      (error: HttpResError) => {
        this.editingTemplate = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  GetAllTags() {
    this.TagsList = [];
    this.gettingTags = true;

    this.bulkCommunication.GetAllTags(this.facilityId).subscribe(
      (res: CommunicationTagListDto[]) => {
        this.gettingTags = false;
        if (res?.length) {
          this.TagsList = res;

        }
      },
      (error: HttpResError) => {
        this.gettingTags = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }

  AddPatientTags(modal: ModalDirective) {
    this.editingTag = true;

    this.bulkCommunication.AddPatientTags(this.facilityId, this.tagName).subscribe(
      (res: any) => {
        this.editingTag = false;
        this.tagName = ''
        this.GetAllTags()
        this.toaster.success('Tag added successfully')
        modal.hide();

      },
      (error: HttpResError) => {
        this.editingTag = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  FillSystemVariablesInTextArea(item: SmartPhraseVariablesListDto) {
    const appendText = `@${item.title}@ `;
    const txtarea = document.getElementById('TemplateTextEle') as HTMLTextAreaElement;
    const start = txtarea.selectionStart;
    const end = txtarea.selectionEnd;
    const sel = txtarea.value.substring(start, end);
    const finText = txtarea.value.substring(0, start) + appendText + txtarea.value.substring(end);
    txtarea.value = finText;
    txtarea.focus();
    txtarea.selectionEnd = end + appendText.length;
    this.AddEditTemplateDto.text = txtarea.value;
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
  openConfirmModal(data: AddEditCommunicationTemplate) {
    if (!this.AddEditTemplateDto.title && !this.AddEditTemplateDto.text) {
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
  callBack = (data: AddEditCommunicationTemplate) => {
    this.AssignEditDetails(data);
  };
  openDeleteConfirmModal(data: AddEditCommunicationTemplate) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Delete Phrase';
    modalDto.Text = 'Do you want to delete this phrase?';
    modalDto.callBack = this.deleteCallBack;
    modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  deleteCallBack = (data: AddEditCommunicationTemplate) => {
    this.bulkCommunication.DeleteTemplate(data.id).subscribe(
      (res: any) => {
        this.addingPhrases = false;
        this.toaster.success('Phrase deleted successfully');
        if (data.id === this.AddEditTemplateDto.id) {
          this.NewPhrase();
        }
        this.GetAllTemplates();
      },
      (error: HttpResError) => {
        this.addingPhrases = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  AssignEditDetails(item: AddEditCommunicationTemplate) {
    this.NewPhrase();
    this.AddEditTemplateDto.id = item.id;
    this.AddEditTemplateDto.title = item.title;
    this.AddEditTemplateDto.text = item.text;
    this.AddEditTemplateDto.templateGroup = item.templateGroup;
    // this.templateDto.userId = item.userId;
  }
  NewTemplateWarningCheck() {
    if (!this.AddEditTemplateDto.title && !this.AddEditTemplateDto.text) {
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
    this.AddEditTemplateDto = new AddEditCommunicationTemplate();
  }

}
