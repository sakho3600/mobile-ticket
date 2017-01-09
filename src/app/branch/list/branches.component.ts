import { Component, Output, EventEmitter } from '@angular/core';
import { BranchService } from '../branch.service';
import { BranchEntity } from '../../entities/branch.entity';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { RetryService } from '../../shared/retry.service';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-branches',
  templateUrl: './branches-tmpl.html',
  styleUrls: ['./branches.css', '../../shared/css/common-styles.css']
})
export class BranchesComponent {
  public branches: Array<BranchEntity>;
  public showBranchList: boolean = false;
  private showLoader: boolean = false;
  private networkError = false;
  public loadingText: string = "Loading...";
  private loaderResource: string = "app/resources/loader.svg";

  @Output() startLoading = new EventEmitter<boolean>();
  @Output() onShowHideRequest = new EventEmitter<boolean>();

  constructor(private branchService: BranchService, private retryService: RetryService, public router: Router, private translate : TranslateService) {
    this.loadData(branchService, retryService);
    this.translate.get('branch.defaultTitle').subscribe((res: string) => {
      document.title = res;
    });
  }

  public loadData(branchService: BranchService, retryService: RetryService) {
    this.networkError = false;
    this.onShowHideRequest.emit(false);
    this.showLoader = true;
    this.startLoading.emit(true);    
    branchService.getBranches((branchList: Array<BranchEntity>, error: boolean) => {
      if (error) {
        this.networkError = true;
        this.onShowHideRequest.emit(true);
        this.showLoader = false;
        this.retryService.retry(() => {
          this.branchService.getBranches((branchList: Array<BranchEntity>, error: boolean) => {
            if (!error) {
              this.onBranchFetchSuccess(branchList, branchService);
              this.retryService.abortRetry();
            }
          });
        });
      } else {
        this.onBranchFetchSuccess(branchList, branchService);
      }
    });
  }

  private onBranchFetchSuccess(branchList, branchService): void {
    this.networkError = false;
    this.onShowHideRequest.emit(false);
    if (branchList.length === 1) {
      MobileTicketAPI.setBranchSelection(branchList[0]);
      this.router.navigate(['services']);
    }
    this.branches = branchList;
    branchService.setBranchAddresses(this.branches);
    this.showBranchList = this.isBranchesAvailable(this.branches);
    this.showLoader = false;
    this.startLoading.emit(false);
  }

  public isBranchesAvailable(branchList) {
    return branchList.length === 0 ? false : true;
  }

  public reloadData() {
    this.loadData(this.branchService, this.retryService);
  }

}
