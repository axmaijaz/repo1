import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceComponent } from './invoice/invoice.component';
import { MainLayoutComponent } from '../Main/main-layout/main-layout.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { CcmBillingComponent } from '../admin/ccm-billing/ccm-billing.component';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';
import { InvoiceReconciliationComponent } from '../admin/invoice-reconciliation/invoice-reconciliation.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: MainLayoutComponent,
  //   canActivate: [AuthGuard],
  //   data: { claimType: 'IsAuthenticated' },
  //   children: [
      { path: '', redirectTo: 'patients', pathMatch: 'full' },
      { path: 'invoices', component: InvoiceComponent },
      { path: 'InvoiceDetail/:id', component: CcmBillingComponent },
      { path: 'invoicePreview', component: InvoicePreviewComponent },
      { path: 'invoiceReconciliation/:id', component: InvoiceReconciliationComponent },

      // { path: 'billing', loadChildren: () => import('./billing-configration/billing-configration.module').then(m => m.ConfigrationModule) },
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {}
