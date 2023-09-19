import { NgModuleFactory, Type } from '@angular/core';

export const lazyWidgets: { path: string, loadChildren: () => Promise<NgModuleFactory<any> | Type<any>> }[] = [
  // { path: 'admin', loadChildren: './admin/admin.module#AdminModule' }
  {
    path: 'lazyVideo',
    // loadChildren: './lazy/lazy-video/lazy-video.module#LazyVideoModule'
    loadChildren: () => import('./lazy/lazy-video/lazy-video.module').then(m => m.LazyVideoModule)
  },
  {
    path: 'lazyConsentModal',
    // loadChildren: './lazy/lazy-video/lazy-video.module#LazyVideoModule'
    loadChildren: () => import('./lazy/lazy-consent-modal/lazy-consent-modal.module').then(m => m.LazyConsentModalModule)
  },
  {
    path: 'lazyConfirm',
    // loadChildren: './lazy/lazy-video/lazy-video.module#LazyVideoModule'
    loadChildren: () => import('./lazy/lazy-confirmation/lazy-confirmation.module').then(m => m.LazyConfirmationModule)
  },
  {
    path: 'lazyLoginWarning',
    loadChildren: () => import('./lazy/lazy-app-modals/lazy-app-modals.module').then(m => m.LazyAppModalsModule)
  },
  {
    path: 'home',
    // loadChildren: './lazy/lazy-video/lazy-video.module#LazyVideoModule'
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'admin',
    // loadChildren: './lazy/lazy-video/lazy-video.module#LazyVideoModule'
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    path: 'patentTask',
    // loadChildren: './lazy/lazy-video/lazy-video.module#LazyVideoModule'
    loadChildren: () => import('./patient-Task-modal/patient-task.module').then(m => m.PatientTaskModule)
  }
  // E:\premier solution project\CCM.WebClient\CCM.WebClient\src\app\lazy\patient-Task-modal\patient-task.module.ts
];

export function lazyArrayToObj() {
  const result = {};
  for (const w of lazyWidgets) {
    result[w.path] = w.loadChildren;
  }
  return result;
}
