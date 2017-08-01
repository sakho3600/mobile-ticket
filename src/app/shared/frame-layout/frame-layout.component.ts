import { Component, OnInit } from '@angular/core';
import { Util } from './../../util/util';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'qm-frame-layout',
  templateUrl: './frame-layout.component.html',
  styleUrls: ['./frame-layout.component.css']
})

export class FrameLayoutComponent implements OnInit {
  public onBrowserNotSupport: string;
  private _isBrowserSupport = false;
  private thisBrowser;

  constructor(private translate: TranslateService) {

  }

  ngOnInit() {
    this.loadTranslations();
    this.doesBrowserSupport();
  }

  loadTranslations() {
    this.translate.get('support.this_browser').subscribe((res: string) => {
      this.thisBrowser = res;
    });
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
    try {
      let browser = util.getDetectBrowser(agent)
      // this.isBrowserSupport = true;
      if (browser.name === 'chrome' || browser.name === 'safari' || browser.name === 'ios' || browser.name === 'opera') {
        this._isBrowserSupport = true;
      }
      else if (browser.name !== '' && browser.name) {
        this.onBrowserNotSupport = browser.name;
      }
      else {
        this.onBrowserNotSupport = this.thisBrowser;
      }
    }
    catch (e) {
      this.onBrowserNotSupport = this.thisBrowser;
    }


  }
}
