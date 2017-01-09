import { Component } from '@angular/core';


@Component({
  selector: 'app-branches-container',
  templateUrl: './branches-container-tmpl.html',
  styleUrls: ['./branches-container.css', '../../shared/css/common-styles.css']
})
export class BranchesContainerComponent {
  private isLoading = true;
  private showNetWorkError = false;

  startLoading(value: boolean){
    this.isLoading = value;
  }

  showHideNetworkError(value: boolean){
    this.showNetWorkError = value;
  }
}

