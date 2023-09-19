import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success-page',
  templateUrl: './success-page.component.html',
  styleUrls: ['./success-page.component.scss']
})
export class SuccessPageComponent implements OnInit {
  displayMessage = 'Your email address has been confirmed';
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const displ = this.route.snapshot.queryParams['message'];
    if (displ) {
      this.displayMessage = displ;
    }
    const sendmess = window.parent ? true : false;
    const data = {
      type: 'refreshEob'
    };
    if (sendmess) {
      window.parent.postMessage(data, '*');
      window.postMessage(data, '*');
    }
  }

  closeWindow() {
    self.close();
    // window.close();
  }
}
