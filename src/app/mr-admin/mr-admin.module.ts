import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageMrComponent } from './manage-mr/manage-mr.component';
import { MrAdminRoutingModule } from './mr-admin-routing.module';

@NgModule({
  declarations: [ManageMrComponent],
  imports: [
    CommonModule,
    MrAdminRoutingModule,

  ]
})
export class MrAdminModule { }
