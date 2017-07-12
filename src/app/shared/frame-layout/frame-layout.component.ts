import { Component, OnInit } from '@angular/core';
import { Util } from './../../util/util'

@Component({
  selector: 'qm-frame-layout',
  templateUrl: './frame-layout.component.html',
  styleUrls: ['./frame-layout.component.css']
})

export class FrameLayoutComponent implements OnInit {
  public onBrowserNotSupport: string;
  private _isBrowserSupport = false;

  ngOnInit() {
    this.doesBrowserSupport();
  }

  get isBrowserSupport(): boolean { 
    return this._isBrowserSupport; 
  }

  public doesBrowserSupport() {
    let util = new Util()
    var agent
    if (typeof navigator !== 'undefined' && navigator) {
      agent = navigator.userAgent;
    }
    let browser = util.getDetectBrowser(agent)
    // this.isBrowserSupport = true;
    if(browser.name === 'chrome' || browser.name === 'safari' || browser.name === 'ios' || browser.name === 'opera') {
      this._isBrowserSupport = true;
    }
    else {
      this.onBrowserNotSupport = browser.name;
    }
  }
}
