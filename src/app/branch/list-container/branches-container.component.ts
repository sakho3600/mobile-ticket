import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-branches-container',
  templateUrl: './branches-container-tmpl.html',
  styleUrls: ['./branches-container.css']
})
export class BranchesContainerComponent implements OnInit {
  private _isLoading = true;
  private _showNetWorkError = false;
  private _isBranchOpen = true;

  // AOT requires all private properties to be accessible via getters.
  get isLoading(): boolean { 
    return this._isLoading; 
  }

  get showNetWorkError(): boolean { 
    return this._showNetWorkError; 
  }

  get branchIsOpen(): boolean { 
    return this._isBranchOpen; 
  }

  ngOnInit() {
    this.scrollPageToTop();
  }

  startLoading(value: boolean) {
    this._isLoading = value;
  }

  isBranchOpen(value: boolean) {
    this._isBranchOpen = value;
  }

  showHideNetworkError(value: boolean) {
    this._showNetWorkError = value;
  }

  scrollPageToTop() {
    window.scrollTo(0, 0);
  }
}

