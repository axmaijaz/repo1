import { Component, OnInit } from '@angular/core';
import { ToastService } from 'ng-uikit-pro-standard';
import { OneUpService } from 'src/app/core/one-up.service';
import { ActivatedRoute } from '@angular/router';
import { HttpResError } from 'src/app/model/common/http-response-error';
import { SupportedSystemDto } from 'src/app/model/OneUp.model';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CcmDataService } from 'src/app/core/ccm-data.service';
import { State } from 'src/app/model/AppData.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-system-configuration',
  templateUrl: './system-configuration.component.html',
  styleUrls: ['./system-configuration.component.scss']
})
export class SystemConfigurationComponent implements OnInit {

  selectedSystemId: number;
  isLoading: boolean;
  systemsList = new Array<SupportedSystemDto>();
  connectedSystemsList = new Array<{
    id: number,
    patientId: number,
    systemCode: number,
    systemName: string,
    isConnected: boolean
  }>();
  searchWatch = new Subject<string>();
  States = new Array<State>();
  patientId: number;
  isSearching: boolean;
  stateCode: string;
  constructor(
    private toaster: ToastService,
    private location: Location,
    private ccmDataService: CcmDataService,
    private oneUpService: OneUpService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.patientId = +this.route.snapshot.paramMap.get('id');
    this.SearchObserver();
    this.CreateOneUpUser();
    // this.GetSupportedSystems();
    this.getStatesList();
    this.GetConnectedHealthSystemsByPatientId();
  }
  SearchObserver() {
    this.searchWatch.pipe(
      debounceTime(1000),
    ).subscribe(x => {
      if (x) {
        this.GetSupportedSystems(x);
      }
    });
  }
  SearchSupportedSystems(term: string) {
    this.isSearching = true;
    this.systemsList = [];
    this.oneUpService.SearchSupportedSystems(term).subscribe(
      (res: any) => {
        this.isSearching = false;
        this.systemsList = res;
        // this.systemsList.push(...res);
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
        this.isSearching = false;
      }
    );
  }
  GetSupportedSystems(term: string) {
    this.isSearching = true;
    this.systemsList = [];
    this.oneUpService.GetSupportedSystems(term, this.stateCode).subscribe(
      (res: any) => {
        this.isSearching = false;
        this.systemsList = res;
        // this.systemsListTemp = res;
        // if (this.systemsListTemp) {
        //   this.GetConnectedHealthSystemsByPatientId();
        // }
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
        this.isSearching = false;
      }
    );
  }
  CreateOneUpUser() {
    this.isLoading = true;
    this.oneUpService.CreateOneUpUser(this.patientId).subscribe(
      (res: any) => {
        // this.toaster.success('User Created');
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
        this.isLoading = false;
      }
    );
  }
  ConnectSystem() {
    this.isLoading = true;
    this.oneUpService.GetCode(this.patientId, this.selectedSystemId).subscribe(
      (res: any) => {
        if (res) {
          this.openWindow(res);
        }
        this.isLoading = false;
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
        this.isLoading = false;
      }
    );
  }
  getStatesList() {
    this.ccmDataService.getStates().subscribe((res: any) => {
      this.States = res;
    }, (error: HttpResError) => {
      this.toaster.error('error loading States');
    });
  }
  openWindow(url: string) {
    const win = window.open( url, 'Snopzer', 'left=20,top=20,width=500,height=500,toolbar=1,resizable=0' );
    win.addEventListener('beforeunload', eve => {
      this.GetConnectedHealthSystemsByPatientId();
      // this.checkIfDeviceConsentTaken();
    });
  }
  navigateBack() {
    this.location.back();
  }
  GetConnectedHealthSystemsByPatientId() {
    this.isLoading = true;
    this.connectedSystemsList = new Array<{
      id: number,
      patientId: number,
      systemCode: number,
      systemName: string,
      isConnected: boolean
    }>();
    this.oneUpService.GetConnectedHealthSystemsByPatientId(this.patientId).subscribe(
      (res: Array<any>) => {
        this.isLoading = false;
        if (res) {
          this.connectedSystemsList = res;
          // res.forEach(element => {
          //   const sys = this.systemsListTemp.find(x => x.id === +element);
          //   if (sys) {
          //     this.connectedSystemsList.push(sys);
          //   }
          // });
        }
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
        this.isLoading = false;
      }
    );
  }
  addSystem() {
    const obj = {
      patientId: this.patientId,
      systemCode: this.selectedSystemId.toString()
    };
    this.oneUpService.AddPatientSystemCode(obj).subscribe(
      (res: Array<number>) => {
        this.isLoading = false;
        this.GetConnectedHealthSystemsByPatientId();
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
        this.isLoading = false;
      }
    );
  }
  RemoveSystem() {
    const obj = {
      patientId: this.patientId,
      systemCode: this.selectedSystemId.toString()
    };
    this.oneUpService.RemovePatientSystemCode(obj).subscribe(
      (res: Array<number>) => {
        this.isLoading = false;
        this.GetConnectedHealthSystemsByPatientId();
      },
      (error: HttpResError) => {
        this.toaster.error(error.message, error.error);
        this.isLoading = false;
      }
    );
  }
}
