import { Directive, TemplateRef, ViewContainerRef, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Directive({
// tslint:disable-next-line: directive-selector
  selector: '[isDevelopment]'
})
export class IsDevelopmentDirective {
  @Input() set isDevelopment(claimType: any) {
    if (!environment.production) {
      // Add template to DOM
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // Remove template from DOM
      this.viewContainer.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

}

