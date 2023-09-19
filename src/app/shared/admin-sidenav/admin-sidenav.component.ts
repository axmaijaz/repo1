import { AppUserAuth } from './../../model/security/app-user.auth';
import { AppDataService } from 'src/app/core/app-data.service';
import { id } from '@swimlane/ngx-datatable';
import { data } from 'jquery';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { SecurityService } from 'src/app/core/security/security.service';
import { UserType } from 'src/app/Enums/UserType.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CustomeListService } from 'src/app/core/custome-list.service';
import { AddEditCustomListDto } from 'src/app/model/custome-list.model';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { ToastService } from 'ng-uikit-pro-standard';
import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { LazyModalDto } from 'src/app/model/AppModels/app.model';
import { AppUiService } from 'src/app/core/app-ui.service';
import { DataFilterService } from 'src/app/core/data-filter.service';
import { ComplaintsService } from 'src/app/core/complaints.service';
import { ComplaintStatus } from 'src/app/Enums/complaints.enum';

@Component({
  selector: 'app-admin-sidenav',
  templateUrl: './admin-sidenav.component.html',
  styleUrls: ['./admin-sidenav.component.scss']
})
export class AdminSidenavComponent implements OnInit {
  isAppAdmin: boolean;
  complaintsCount: number;
  constructor(public securityService: SecurityService, private route: ActivatedRoute,private eventBus: EventBusService,
    private appDataService: AppDataService, private complaintsService: ComplaintsService,
    private router: Router,private customListService: CustomeListService, private toaster: ToastService, private appUi: AppUiService, private filterDataService: DataFilterService) {}
  @ViewChild('sidenav') public el: any;
  PatientId: number;
  showAnalyticLayout = false;
  showAddnoteButton = false;
  facilityUserId = 0;
  currentUrl: string;
  hasQueryParam: boolean;
  CustomListDto = new Array<AddEditCustomListDto>();
    public sidenavScrolls = {
      axis: 'y',
      theme: 'dark-3',
      scrollInertia: 0,
      scrollbarPosition: 'inside',
      scrollButtons: { enable: false },
      autoHideScrollbar: true,

    };
  // IsPatientLoginId: number;
  @HostListener('swiperight', ['$event']) public swipePrev(event: any) {
    this.el.show();
  }
  ngOnInit() {
    this.getComplaintsCount();
    if (this.securityService.securityObject.userType === UserType.Patient) {
      this.PatientId = this.securityService.securityObject.id;
    }
    if (this.securityService.securityObject.userType === UserType.FacilityUser) {
      this.facilityUserId = this.securityService.securityObject.id;
      this.GetCustomListsByFacilityUserId();
    }
    if (this.securityService.securityObject.userType === UserType.AppAdmin) {
      this.isAppAdmin = true;
    }
    this.getNavigationStatus();
    this.router.events.subscribe((event) => {
      this.getNavigationStatus();
    });
    this.eventBus.on(EventTypes.RefreshCustomList).subscribe((res) => {
     this.GetCustomListsByFacilityUserId();
      });
      this.complaintsService.refreshComplaintCount.subscribe((res: any) => {
        this.getComplaintsCount();
      })
  }

  EmitEventForCustomListModal(row: any) {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = EventTypes.CustomListModal;
    event.value = row;
    this.eventBus.emit(event);
  }
  EmitEventForRefreshCustomList() {
    // tslint:disable-next-line: prefer-const
    const event = new EmitEvent();
    event.name = EventTypes.RefreshCustomList;
    event.value = true;
    this.eventBus.emit(event);
  }
  // this.eventBus.on(EventTypes.CustomListModal).subscribe((res) => {
  //   // this.GetIsSyncFromAnnualWellness(this.annualWellnessID);
  //   this.awEncounterPTabDto.isSyncDisabled = res;
  // });

  GetCustomListsByFacilityUserId() {
    // this.isLoadingPayersList = true;
    this.customListService.GetCustomListsByFacilityUserId(this.facilityUserId).subscribe(
      (res: any) => {
        this.CustomListDto = res.customListsDto;
        this.appDataService.CustomListDto = res.customListsDto;
      },
      (error: HttpResError) => {
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  openConfirmModal(id: number) {
    const modalDto = new LazyModalDto();
    modalDto.Title = 'Custom List';
    modalDto.Text = `Are you sure to delete Custom List`;
    modalDto.callBack = this.callBack;
    modalDto.data = id;
    this.appUi.openLazyConfrimModal(modalDto);
  }
  callBack = (id: number) => {
    this.DeleteCustomList(id);
  }
  DeleteCustomList(id: number) {
    // this.isLoadingPayersList = true;
    this.customListService.DeleteCustomList(id).subscribe(
      (res: any) => {
        this.EmitEventForRefreshCustomList();
        if (window.location.href.includes('customList') && window.location.href.includes(id.toString()) ) {
          this.router.navigateByUrl('/home/page');
        }
        // this.GetCustomListsByFacilityUserId();
        // this.toaster.success("deleted");

      },
      (error: HttpResError) => {
        // this.isLoadingPayersList = false;
        this.toaster.error(error.error, error.message);
      }
    );
  }
  async GotoSameRoute(route: string) {
    // const isDone = await this.router.navigateByUrl(route);
    // if (isDone) {
    // }
    let skipState = true;
    if (route === '/home/page') {
      skipState = false;
    }
    this.router.navigateByUrl('/', { skipLocationChange: skipState })
      .then((value) => {
        // this.router.navigateByUrl(notify.linkUrl);
        this.router.navigate([route]);
        // this.router.navigateByUrl(`/rpm/PatientRpm/${notify.entityId}`);
      });
  }
  getNavigationStatus() {
    const cRoute = this.router.url.split('?');
    // if (cRoute && cRoute.length) {
    //   this.currentUrl = cRoute[0];
    //   if(this.filterDataService.filterData.route == this.currentUrl){
    //     this.hasQueryParam = true;
    //   }else {
    //     this.hasQueryParam = false;
    //   }
    //   // if (cRoute[1]) {
    //   //   this.hasQueryParam = true;
    //   // } else {
    //   //   this.hasQueryParam = false;
    //   // }
    // }
    if (
      this.route.snapshot.children &&
      this.route.snapshot.children.length > 0 &&
      this.route.snapshot.children[0].firstChild
    ) {
      this.showAnalyticLayout = this.route.snapshot.children[0].firstChild.data[
        'showAnalyticLayout'
      ];
      this.showAddnoteButton = this.showAnalyticLayout;
    } else {
      // this.PatientId = 0;
      this.showAnalyticLayout = false;
      this.showAddnoteButton = false;
    }
  }
  OPenHangFire() {
    this.securityService.GetHangFireToken().subscribe((resp: AppUserAuth) => {
      const appTOken = resp.bearerToken;
      const baseUrl = localStorage.getItem('switchLocal') ? environment.localBaseUrl :  environment.baseUrl;
      const data_url = baseUrl.replace('api/', 'hangfire') + `?access_token=${appTOken}`;
      window.open(data_url, '_blank');
    } , (error: HttpResError) => {
      // this.isLoadingPayersList = false;
      this.toaster.error(error.error, error.message);
    });
  }
  getComplaintsCount(){
    var facilityId
    if(this.securityService.securityObject.userType == UserType.AppAdmin){
      facilityId = 0;
    }else{
      facilityId = +this.securityService.getClaim("FacilityId").claimValue
    }
    this.complaintsService.getAllComplaintsByStatus(ComplaintStatus.Open, facilityId).subscribe((res: any) =>{
      this.complaintsCount = res;
    }, (err: HttpResError) => {
      this.toaster.error(err.error);
    })
  }
}
