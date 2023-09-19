import { EmitEvent, EventBusService, EventTypes } from 'src/app/core/event-bus.service';
import { AppUiService } from './../core/app-ui.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng-uikit-pro-standard';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-global-iframe',
  templateUrl: './global-iframe.component.html',
  styleUrls: ['./global-iframe.component.scss']
})
export class GlobalIframeComponent implements OnInit {
  @ViewChild('globalIframeModal') globalIframeModal: ModalDirective;
  iframeSrc = '';
  constructor(private eventBus: EventBusService, private sanatizer: DomSanitizer,) { }

  ngOnInit(): void {
    this.eventBus.on(EventTypes.TriggerGlobalIframe).subscribe((data: string) => {
      this.iframeSrc = '';
      this.iframeSrc = this.sanatizer.bypassSecurityTrustResourceUrl(data) as string;
      this.globalIframeModal.show();
    });
  }
  GlobalIframeClosed() {
    const emitObj = new EmitEvent();
    emitObj.name = EventTypes.GlobalIframeClosed;
    emitObj.value = {url: this.iframeSrc};
    this.eventBus.emit(emitObj);
  }

}
