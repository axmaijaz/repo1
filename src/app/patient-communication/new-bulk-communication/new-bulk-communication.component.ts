import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SqueezeBoxComponent, ToastService } from 'ng-uikit-pro-standard';
import { DndDropEvent } from 'ngx-drag-drop';
import { BulkCommunicationService } from 'src/app/communication/bulk-communication.service';
import { PatientsService } from 'src/app/core/Patient/patients.service';
import { RingCentralService } from 'src/app/core/RingCentral/ring-central.service';
import { CommunicationService } from 'src/app/core/communication.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { EventBusService } from 'src/app/core/event-bus.service';
import { FacilityService } from 'src/app/core/facility/facility.service';
import { SecurityService } from 'src/app/core/security/security.service';
import { AddEditCommunicationTemplate, BulkCommTagData, BulkTagDataGroupDto, BulkTagSection, BulkTemplateDataGroupDto, CommunicationStateEnum, CommunicationTagListDto, FilterTagDataParam, NewBulkCommTemplateListDto, PatientCommTemplateGroup, PatientTagData, PostBulkCommDto, TagCategory, TagSection, TemplateGroupListDto } from 'src/app/model/PatientEngagement/bulk-communication.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import 'src/app/Extensions/arrayExtension'
import { ClonerService } from 'src/app/core/cloner.service';
import { CommunicationMethod } from 'src/app/model/PatientEngagement/communication.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { LazyModalDto, TwoCModulesEnum } from 'src/app/model/AppModels/app.model';
import moment from 'moment';
@Component({
  selector: 'app-new-bulk-communication',
  templateUrl: './new-bulk-communication.component.html',
  styleUrls: ['./new-bulk-communication.component.scss']
})
export class NewBulkCommunicationComponent implements OnInit {
  draggable = {
    // note that data is handled with JSON.stringify/JSON.parse
    // only set simple data or POJO's as methods will be lost
    data: "myDragData",
    effectAllowed: "all",
    disable: false,
    handle: false
  };

  // templatesList: TemplateGroupListDto[] = [];
  // bulkTagData: BulkCommTagData[] = [];
  bulkTagSections: BulkTagSection[] = [];
  bulkTemplateGroups: BulkTemplateDataGroupDto[] = [];
  bulkTemplateGroupsCopy: BulkTemplateDataGroupDto[] = [];
  gettingTemplates: boolean;
  facilityId: number;
  TagsList: CommunicationTagListDto[] = [];
  gettingTags: boolean;

  newBulkTemplatesList: NewBulkCommTemplateListDto[] = []
  postingCommunication: boolean;
  searchStr: string;
  filterTagParam = new FilterTagDataParam();
  CommunicationMethod = CommunicationMethod;
  TwoCModulesEnum = TwoCModulesEnum;
  CommunicationStateEnum = CommunicationStateEnum;
  filterCollapsed = false
  searchedPatients: PatientTagData[] = [];
  searchTemplateTerm: string;
  msgHeaderType: string;

  constructor(private toaster: ToastService, private commService: CommunicationService, private dataService: DataFilterService,
    private eventBus: EventBusService, private router: Router,private bulkCommunication: BulkCommunicationService,
    private cdr: ChangeDetectorRef, public rcService: RingCentralService, private cloner: ClonerService, private appUi: AppUiService,
    private securityService: SecurityService, private patientsService: PatientsService, private facilityService: FacilityService) { }

  ngOnInit(): void {
    this.facilityId = +this.securityService.getClaim('FacilityId')?.claimValue || 0;
    this.InitFilterByPermission();
    this.GetAllTags();
    this.GetAllTemplates();
  }
  InitFilterByPermission() {
    const TelephonyCommunication = this.securityService.getClaim('TelephonyCommunication')?.claimValue;
    const ccmService = this.securityService.getClaim('ccmService')?.claimValue;
    const rpmService = this.securityService.getClaim('rpmService')?.claimValue;
    const bhiService = this.securityService.getClaim('bhiService')?.claimValue;
    if (!TelephonyCommunication) {
      this.filterTagParam.communicationMethod = CommunicationMethod.App
    }
    if (!ccmService) {
      this.filterTagParam.serviceModule = TwoCModulesEnum.RPM
    }
    if (!rpmService) {
      this.filterTagParam.serviceModule = TwoCModulesEnum.BHI
    }
    this.GetTagsData()
  }
  SearchPatients() {
    this.searchStr = this.searchStr.trim();
    this.searchedPatients = []
    if (!this.searchStr) {
      return;
    }
    const clonedSections = this.bulkTagSections.deepClone()
    let patients: PatientTagData[] = []
    this.bulkTagSections.forEach(section => {
      section.values.forEach(group => {
        group.values.forEach(tag => {
          patients.push(...tag.patients);
        })
      })
    })
    patients = patients.distinctBy('patientId')
    this.searchedPatients = patients.filter(patient =>
      (patient.firstName || '').toLowerCase().includes(this.searchStr) ||
      (patient.middleName || '').toLowerCase().includes(this.searchStr) ||
      (patient.lastName || '').toLowerCase().includes(this.searchStr) ||
      ((patient.firstName || '') + ' ' + (patient.middleName || '') + ' ' + (patient.lastName || '')).toLowerCase().includes(this.searchStr)
    );
  }
  AppendTemplate(template: TemplateGroupListDto, accordian: SqueezeBoxComponent) {
    const alreadyExist = this.newBulkTemplatesList.some(x => x.id == template.id)
    if (alreadyExist) {
      return
    }
    if (accordian) {
      accordian.items.forEach(acc => {
        acc.applyToggle(true)
      })
    }
    this.newBulkTemplatesList.forEach(element => {
      element.collapsed = true;
    });
    const nTemplate = new NewBulkCommTemplateListDto();
    nTemplate.id = template.id;
    nTemplate.title = template.title
    nTemplate.text = `${template.text}`
    nTemplate.collapsed = false;
    this.newBulkTemplatesList.push(nTemplate)
    this.cdr.detectChanges();
  }
  GetAllTemplates() {
    this.bulkTemplateGroups = [];
    this.bulkTemplateGroupsCopy = [];
    this.gettingTemplates = true;

    this.bulkCommunication.GetAllTemplates(this.facilityId).subscribe(
      (res: TemplateGroupListDto[]) => {
        this.gettingTemplates = false;

        if (res?.length) {
          // res = res.sortByNumber('patientsCount', true)
          res.forEach(x => {
            x.templateGroupName = PatientCommTemplateGroup[x.templateGroup]
          })
          const sectionCategories = res.groupByProp('templateGroupName')
          sectionCategories.forEach(group => {
            const newGroup = new BulkTemplateDataGroupDto();
            newGroup.Key = group.Key
            newGroup.collapsed = false
            newGroup.values = group.values;
            this.bulkTemplateGroups.push(newGroup)
            this.bulkTemplateGroupsCopy.push(newGroup)
          });
          // this.templatesList = res;

        }
      },
      (error: HttpResError) => {
        this.gettingTemplates = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  // ApplyTemplateHeader(template: NewBulkCommTemplateListDto, type: string) {

  //   template.headerType = type;
  //   if (template.headerType == 'none') {
  //     template.headerText = ''
  //   }
  //   if (template.headerType == 'short') {
  //     template.headerText = `From ${this.securityService.securityObject.fullName} \n`
  //   }
  //   if (template.headerType == 'long') {
  //     const fName = this.securityService.getClaim("FacilityName").claimValue;
  //     template.headerText = `From ${this.securityService.securityObject.fullName} from ${fName}\n`
  //   }
  // }
  searchTemplates() {
    if (!this.searchTemplateTerm) {
      this.bulkTemplateGroups = this.bulkTemplateGroupsCopy.deepClone()
      return;
    }
    let sourceData = this.bulkTemplateGroupsCopy.deepClone()

    const searchResults: BulkTemplateDataGroupDto[] = [];

    for (const group of sourceData) {
      const filteredValues = group.values.filter(
        (item) => item.title.toLowerCase().includes(this.searchTemplateTerm.toLowerCase())
      );

      if (filteredValues.length > 0) {
        const searchResultGroup: BulkTemplateDataGroupDto = {
          Key: group.Key,
          collapsed: group.collapsed,
          values: filteredValues,
        };
        searchResults.push(searchResultGroup);
      }
    }

    this.bulkTemplateGroups = searchResults.deepClone()
  }

  ApplyTemplateHeader(template: NewBulkCommTemplateListDto, type: string) {

    template.headerType = type;
    if (template.headerType == 'none') {
      template.headerText = ''
    }
    if (template.headerType == 'short') {
      template.headerText = `From: ${this.securityService.securityObject.fullName} \n`
    }
    if (template.headerType == 'long') {
      const fName = this.securityService.getClaim("FacilityName").claimValue;
      template.headerText = `From: ${this.securityService.securityObject.fullName} from ${fName}\n`
    }
  }
  ConfirmResetTagsDataParam() {
    if (!this.newBulkTemplatesList?.length) {
      this.ResetTagFilterData();
      return;
    }
    const modalDto = new LazyModalDto();
    modalDto.Title = "Reset Filters";
    modalDto.Text = "All templates will be removed. Are you sure to Reset Filters?";
    modalDto.callBack = this.ResetTagFilterData;
    modalDto.data = null;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  ResetTagFilterData = () => {
    this.filterTagParam = new FilterTagDataParam();
    this.searchStr = '';
    this.newBulkTemplatesList.forEach(template => {
      this.RemoveTemplate(template)
    });
    this.InitFilterByPermission();
  }
  ConfirmApplyTagsDataParam() {
    if (!this.newBulkTemplatesList?.length) {
      this.GetTagsData();
      return;
    }
    const modalDto = new LazyModalDto();
    modalDto.Title = "Apply filters";
    modalDto.Text = "All templates will be removed. Are you sure to Apply filters?";
    modalDto.callBack = this.GetTagsData;
    modalDto.data = null;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  GetTagsData = () => {
    this.bulkTagSections = [];
    this.gettingTags = true;
    this.filterTagParam.facilityId = this.facilityId;
    this.searchStr = '';
    if (this.newBulkTemplatesList?.length) {
      this.newBulkTemplatesList.forEach(template => {
        this.RemoveTemplate(template)
      });
    }
    this.bulkCommunication.GetTagsData(this.filterTagParam).subscribe(
      (res: BulkCommTagData[]) => {
        if (res?.length) {
          res = res.filter(x => x.patientsCount)
          res = res.sortByNumber('patientsCount', true)
          res.forEach(x => {
            x.tagCategoryName = TagCategory[x.tagCategory]
            x.tagSectionName = TagSection[x.tagSection]
            x.patientsCount = x.patients?.length || 0;
            x.patients.forEach(patient => {
              patient.onDobPreview = this.isWithin7Days(patient.dob);
              patient.onStatsuPreview = x.tagSection == TagSection.Others;
              patient.reviewNoteCopy = patient.reviewNote;
            })
          })
          const sections = res.groupByProp('tagSectionName')
          sections.forEach(section => {
            const newSection = new BulkTagSection();
            newSection.Key = section.Key;
            newSection.patients = [];
            newSection.collapsed = false;
            const sectionCategories = section.values.groupByProp('tagCategoryName')
            sectionCategories.forEach(group => {
              const newGroup = new BulkTagDataGroupDto();
              newGroup.Key = group.Key
              newGroup.collapsed = false
              newGroup.values = group.values
              newSection.values.push(newGroup)
            });
            this.bulkTagSections.push(newSection)
            this.FillSectionPatientsCount()
          });
          this.bulkTagSections = this.bulkTagSections.sortAlphabetically('Key')
          // this.bulkTagData = res;
        }
        this.gettingTags = false;
      },
      (error: HttpResError) => {
        this.gettingTags = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  isWithin7Days(dateToCheck: string) {
    const currentDate = moment().startOf('day'); // Current date, starting at midnight
    const previousDate = moment().subtract(3, 'days').startOf('day'); // 3 days ago, starting at midnight
    const nextDate = moment().add(3, 'days').endOf('day'); // 3 days from now, ending at 23:59:59

    const dateToCheckWithoutYear = moment(dateToCheck).format('MM-DD');

    return (
      moment().format('MM-DD') === dateToCheckWithoutYear || // Check if it's the current date
      moment(previousDate).format('MM-DD') <= dateToCheckWithoutYear && dateToCheckWithoutYear <= moment(nextDate).format('MM-DD')
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
  openConfirmModal() {
    const modalDto = new LazyModalDto();
    modalDto.Title = "Post Bulk Communication";
    modalDto.Text = "Are you sure to post bulk communication?";
    modalDto.callBack = this.SubmitBulkCommunicationData;
    // modalDto.data = data;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  SubmitBulkCommunicationData = () => {
    const templateData = this.newBulkTemplatesList.deepClone();
    templateData.forEach(template => {
      const BulkCommObj = new PostBulkCommDto()
      BulkCommObj.facilityId = this.facilityId;
      BulkCommObj.message =  `${template.headerText}${template.text}`;
      BulkCommObj.method = CommunicationMethod.Telephony;
      BulkCommObj.patientIds = template.patients.map(x => x.patientId);
      BulkCommObj.senderUserId = this.securityService.securityObject.appUserId;
      this.PostBulkMessage(BulkCommObj);
    });
    this.newBulkTemplatesList.forEach(template => {
      this.RemoveTemplate(template)
    });
    this.toaster.info(`Campaign Registered`, `All messages will be sent shortly `)
  }
  PostBulkMessage(objData: PostBulkCommDto) {
    this.postingCommunication = true;

    this.bulkCommunication.PostBulkMessage(objData).subscribe(
      (res: CommunicationTagListDto[]) => {
        this.postingCommunication = false;

      },
      (error: HttpResError) => {
        this.postingCommunication = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  EditPatientReviewNote = (patient: PatientTagData) => {
    this.bulkCommunication.EditPatientReviewNote(patient.patientId, patient.reviewNoteCopy).subscribe(
      (res: any) => {

      },
      (error: HttpResError) => {
        this.toaster.error(error.error, error.message);
      }
    );
  };

  onDragStart(event: DragEvent) {

    // console.log("drag started", JSON.stringify(event, null, 2));
  }

  onDragEnd(event: DragEvent) {

    // console.log("drag ended", JSON.stringify(event, null, 2));
  }

  onDraggableCopied(event: DragEvent) {

    // console.log("draggable copied", JSON.stringify(event, null, 2));
  }

  onDraggableLinked(event: DragEvent) {

    // console.log("draggable linked", JSON.stringify(event, null, 2));
  }

  onDraggableMoved(event: DragEvent) {

    // console.log("draggable moved", JSON.stringify(event, null, 2));
  }

  onDragCanceled(event: DragEvent) {

    // console.log("drag cancelled", JSON.stringify(event, null, 2));
  }

  onDragover(event: DragEvent) {
    // console.log("dragover", JSON.stringify(event, null, 2));
  }

  onDrop(event: DndDropEvent, template: NewBulkCommTemplateListDto) {
    // console.log("dropped", JSON.stringify(event, null, 2));
    if (!event.data) {
      return;
    }
    const selection = event.data as any;
    if(selection.patients) {
      this.AddPatientsToTemplate(selection.patients, template)
    }
    if (selection.patientId) {
      this.AddPatientsToTemplate([selection], template)
    }
    // this.AddTagToTemplate(selectedTag, template)

  }
  AddPatientsToTemplate(selectedPatients: PatientTagData[], template: NewBulkCommTemplateListDto) {
    let tagDataList: BulkCommTagData[] = []
    const clonedSections = this.bulkTagSections.deepClone()
    clonedSections.forEach(section => {
      section.values.forEach(group => {
        group.values.forEach(tag => {
          const tagPatients = tag.patients.filter(y => !y.selected && selectedPatients.some(p => p.patientId == y.patientId))
          if (tagPatients?.length) {
            const nTag = tag;
            nTag.patients = tagPatients;
            nTag.patientsCount = tagPatients.length
            tagDataList.push(nTag)
          }
        });
      });
    });
    tagDataList.forEach(tag => {
      this.AddTagToTemplate(tag, template)
    });
  }
  AddTagToTemplate(selectedTag: BulkCommTagData, template: NewBulkCommTemplateListDto) {
    const templatetag = template.tags.find(x => x.tagName == selectedTag.tagName);
    selectedTag.patients.filter(x => !x.selected)
    if (templatetag) {
      const ids = [...selectedTag.patients, ...templatetag.patients]
      templatetag.patients = ids.distinctBy('patientId')
    } else {
      template.tags.push(selectedTag)
    }
    template.tags.forEach(x => {
      x.patients = x.patients.filter(x => !x.selected)
      x.patientsCount = x.patients.length;
    })
    let patients = template.tags.reduce((acc: PatientTagData[], tag) => acc.concat(tag.patients), []);
    patients = patients.distinctBy('patientId')
    template.patientsCount = patients.length
    template.patients = patients;
    template.tags = template.tags.sortByNumber('patientsCount', true)
    template.previewCount = patients.filter(x => x.onStatsuPreview || x.onDobPreview || x.reviewNote).length;
    this.CalculatePatientTagData();
  }

  RemoveTemplate(template: NewBulkCommTemplateListDto) {
    this.newBulkTemplatesList = this.newBulkTemplatesList.filter(x => x.id != template.id)
    this.CalculatePatientTagData();
  }
  RemoveAllTagFromTemplate(template: NewBulkCommTemplateListDto) {
    template.tags = []
    template.patients = [];
    template.patientsCount = 0;
    template.previewCount = 0;
    this.CalculatePatientTagData();
  }
  RemoveTagFromTemplate(sTag: BulkCommTagData, template: NewBulkCommTemplateListDto) {
    const selectedTag = this.cloner.deepClone<BulkCommTagData>(sTag)
    template.tags.forEach(tag => {
      tag.patients = tag.patients.filter(y => {
        const deletePatient = selectedTag.patients.find(d => d.patientId == y.patientId)
        if (deletePatient) {
          return false;
        }
        return true;
      })
      tag.patientsCount = tag.patients.length
    });
    template.tags = template.tags.filter(tag => tag.patients?.length)
    let patients = template.tags.reduce((acc: PatientTagData[], tag) => acc.concat(tag.patients), []);
    patients = patients.distinctBy('patientId')
    template.patientsCount = patients.length
    template.patients = patients;
    template.tags = template.tags.sortByNumber('patientsCount', true)
    template.previewCount = patients.filter(x => x.onStatsuPreview || x.onDobPreview || x.reviewNote).length;
    this.CalculatePatientTagData();
  }
  RemovePatientFromTemplate(patient: PatientTagData, template: NewBulkCommTemplateListDto) {
    template.tags.forEach(tag => {
      tag.patients = tag.patients.filter(y => {
        const deletePatient = y.patientId == patient.patientId;
        if (deletePatient) {
          return false;
        }
        return true;
      })
      tag.patientsCount = tag.patients.length
    });
    template.tags = template.tags.filter(tag => tag.patients?.length)
    let patients = template.tags.reduce((acc: PatientTagData[], tag) => acc.concat(tag.patients), []);
    patients = patients.distinctBy('patientId')
    template.patientsCount = patients.length
    template.patients = patients;
    template.tags = template.tags.sortByNumber('patientsCount', true)
    template.previewCount = patients.filter(x => x.onStatsuPreview || x.onDobPreview || x.reviewNote).length;
    this.CalculatePatientTagData();
  }
  CalculatePatientTagData() {
    const allTemplatePatients = this.flattenTemplatePatients();
    this.bulkTagSections.forEach(section => {
      section.values.forEach(tagGroup => {
        tagGroup.values.forEach(tag => {
          tag.patients.forEach(x => {
            const patientSelected = allTemplatePatients.some(y => y.patientId == x.patientId)
            x.selected = patientSelected;
          })
          tag.patientsCount = tag.patients?.filter(x => !x.selected).length
        });
        tagGroup.values = tagGroup.values.sortByNumber('patientsCount', true)
      })
    });
    this.FillSectionPatientsCount()
    this.bulkTagSections = this.bulkTagSections.sortAlphabetically('Key')
  }
  // Function to calculate the total number of patients
  FillSectionPatientsCount() {

    const deepBulkSections = this.bulkTagSections.deepClone()
    deepBulkSections.forEach(section => {
      let patients: PatientTagData[] = [];
      section.patients = [];
      section.values.forEach((group) => {
        group.values.forEach((tag) => {
          tag.patients = tag.patients.filter(y => !y.selected)
          patients.push(...tag.patients);
        });
      });
      patients = patients.distinctBy('patientId')
      const rSection = this.bulkTagSections.find(x => x.Key == section.Key)
      if (rSection) {
        rSection.patients = [];
        rSection.patients = [...patients];
      }
    })
  }
  // Function to flatten the nested arrays
 flattenTemplatePatients(): PatientTagData[] {
  let patients: PatientTagData[] = [];

  this.newBulkTemplatesList.forEach((template) => {
    template.tags.forEach((tag) => {
      patients.push(...tag.patients);
    });
  });
  patients = patients.distinctBy('patientId')

  return patients;
}
  heightControl(item: BulkTagDataGroupDto){
    item.showAll = !item.showAll
  }

}
