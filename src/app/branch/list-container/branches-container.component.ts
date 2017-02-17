import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-branches-container',
  templateUrl: './branches-container-tmpl.html',
  styleUrls: ['./branches-container.css']
})
export class BranchesContainerComponent implements OnInit {
  private isLoading = true;
  private showNetWorkError = false;

  ngOnInit() {
    this.scrollPageToTop();
  }

  startLoading(value: boolean) {
    this.isLoading = value;
  }

  showHideNetworkError(value: boolean) {
    this.showNetWorkError = value;
  }

  scrollPageToTop() {
    window.scrollTo(0, 0);
  }
}

