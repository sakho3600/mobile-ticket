import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qm-frame-layout',
  templateUrl: './frame-layout.component.html',
  styleUrls: ['./frame-layout.component.css']
})

export class FrameLayoutComponent implements OnInit {
  public onBrowserNotSupport: string;
  private isBrowserSupport = false;

  ngOnInit() {
    this.doesBrowserSupport();
  }

  public doesBrowserSupport() {
    let browser = require('detect-browser');
    // this.isBrowserSupport = true;
    if(browser.name === 'chrome' || browser.name === 'safari' || browser.name === 'ios' || browser.name === 'opera') {
      this.isBrowserSupport = true;
    }
    else {
      this.onBrowserNotSupport = browser.name;
    }
  }
}
