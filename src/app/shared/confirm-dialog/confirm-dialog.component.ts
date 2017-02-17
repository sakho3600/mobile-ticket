import {OnInit, Component} from '@angular/core';

import {ConfirmDialogService} from "./confirm-dialog.service";
import {TranslateService} from "ng2-translate/index";

const KEY_ESC = 27;
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
const KEYS = {37: 1, 38: 1, 39: 1, 40: 1};

@Component({
  selector: 'confirm-dialog',
  templateUrl: 'confirm-dialog.component.html',
  styleUrls: ['confirm-dialog.component.css', 'confirm-dialog.component-rtl.css']
})
export class ConfirmDialogComponent implements OnInit {

  private _defaults = {
    title: 'Confirmation',
    message: 'Do you want to cancel your changes?',
    cancelText: 'Cancel',
    okText: 'OK'
  };
  title:string;
  message:string;
  okText:string;
  cancelText:string;
  isRtl:boolean;

  private _confirmElement:any;
  private _cancelButton:any;
  private _okButton:any;
  private _isActive:boolean;
  private _isClosing:boolean;

  constructor(confirmDialogService:ConfirmDialogService, private translate:TranslateService) {
    confirmDialogService.activate = this.activate.bind(this);
    this._setDefaultFromLang();
  }

  _setRtlStyles() {
    if (document.dir == "rtl") {
      this.isRtl = true;
    } else {
      this.isRtl = false;
    }
  }

  _setDefaultFromLang() {
    this.translate.get('dialog.confirm.title').subscribe((res:string) => {
      this._defaults.title = res;
    });

    this.translate.get('dialog.confirm.ok').subscribe((res:string) => {
      this._defaults.okText = res;
    });

    this.translate.get('dialog.confirm.cancel').subscribe((res:string) => {
      this._defaults.cancelText = res;
    });
  }

  _setLabels(message = this._defaults.message, title = this._defaults.title, okText = this._defaults.okText, cancelText = this._defaults.cancelText) {
    this.title = title;
    this.message = message;
    this.okText = okText;
    this.cancelText = cancelText;
  }

  activate(message = this._defaults.message, title = this._defaults.title, okText = this._defaults.okText, cancelText = this._defaults.cancelText) {
    if (this._isActive) {
      return;
    }

    this._isActive = true;
    this.disableScroll();
    this._setLabels(message, title, okText, cancelText);
    let promise = new Promise<boolean>(resolve => {
      this._show(resolve);
    });
    return promise;
  }

  private _show(resolve:(boolean) => any) {
    document.onkeyup = null;

    let negativeOnClick = (e:any) => resolve(false);
    let positiveOnClick = (e:any) => resolve(true);

    if (!this._confirmElement || !this._cancelButton || !this._okButton) return;

    this._confirmElement.style.opacity = 0;
    this._confirmElement.style.zIndex = 9999;

    this._cancelButton.onclick = ((e:any) => {
      e.preventDefault();
      if (!negativeOnClick(e)) this._hideDialog();
    })

    this._okButton.onclick = ((e:any) => {
      e.preventDefault();
      if (!positiveOnClick(e)) this._hideDialog()
    });

    this._confirmElement.onclick = () => {
      this._hideDialog();
      return negativeOnClick(null);
    };

    document.onkeyup = (e:any) => {
      if (e.which == KEY_ESC) {
        this._hideDialog();
        return negativeOnClick(null);
      }
    };

    this._confirmElement.style.opacity = 1;
  }

  private _hideDialog() {
    if (this._isClosing) {
      return;
    }

    this._isClosing = true;
    document.onkeyup = null;
    this._confirmElement.style.opacity = 0;

    window.setTimeout(() => {
      this._confirmElement.style.zIndex = -1;
      this._isActive = false;
      this._isClosing = false;
      this.enableScroll();
    }, 400);
  }

  ngOnInit():any {
    this._confirmElement = document.getElementById('confirmationModal');
    this._cancelButton = document.getElementById('cancelBtn');
    this._okButton = document.getElementById('okBtn');
    this._setRtlStyles();
  }

  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault)
      e.preventDefault();
    e.returnValue = false;
  }

  preventDefaultForScrollKeys(e) {
    if (KEYS[e.keyCode]) {
      this.preventDefault(e);
      return false;
    }
  }

  disableScroll() {
    if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', this.preventDefault, false);
    window.onwheel = this.preventDefault; // modern standard
    window.onmousewheel = document.onmousewheel = this.preventDefault; // older browsers, IE
    window.ontouchmove = this.preventDefault; // mobile
    document.onkeydown = this.preventDefaultForScrollKeys;
  }

  enableScroll() {
    if (window.removeEventListener)
      window.removeEventListener('DOMMouseScroll', this.preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
  }
}
