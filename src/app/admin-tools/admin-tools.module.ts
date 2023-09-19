import { SharedPipesModule } from './../shared-pipes/shared-pipes.module';
import { FormsModule } from '@angular/forms';
import { AdminIntellisenseComponent } from './admin-intellisense/admin-intellisense.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminToolsRoutingModule } from './admin-tools-routing.module';
import { ManageAppAnnouncementComponent } from './manage-app-announcement/manage-app-announcement.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [AdminIntellisenseComponent, ManageAppAnnouncementComponent],
  imports: [
    CommonModule,
    SharedPipesModule,
    FormsModule,
    AdminToolsRoutingModule,
    SharedModule
  ]
})
export class AdminToolsModule { }
