import { Component, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BranchService } from '../branch.service';
import { BranchEntity } from '../../entities/branch.entity';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { RetryService } from '../../shared/retry.service';
import { SortPipe } from '../../util/sort.pipe';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-branches',
  templateUrl: './branches-tmpl.html',
  styleUrls: ['./branches.css', '../../shared/css/common-styles.css']
})
export class BranchesComponent implements AfterViewInit {
  public branches: Array<BranchEntity>;
  public showBranchList: boolean = true;
  private showLoader: boolean = true;
  private networkError = false;
  public loadingText: string = "Loading...";
  private loaderResource: string = "app/resources/loader.svg";

  @Output() startLoading = new EventEmitter<boolean>();
  @Output() onShowHideRequest = new EventEmitter<boolean>();

  constructor(private branchService: BranchService, private retryService: RetryService, public router: Router, private translate: TranslateService, private sort : SortPipe) {
    this.translate.get('branch.defaultTitle').subscribe((res: string) => {
      document.title = res;
    });
  }

  ngAfterViewInit() {
    this.loadData(this.branchService, this.retryService);
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
    this.sort.transform(branchList, "name");
    this.branches = branchList;
    if(branchList.length > 0){
      branchService.setBranchAddresses(this.branches, (updatedList: Array<BranchEntity>) => {
      if (updatedList.length === 1 && updatedList[0].enabled) {
        MobileTicketAPI.setBranchSelection(branchList[0]);
        this.router.navigate(['services']);
      }
      this.showBranchList = this.isBranchesAvailable(updatedList);
      this.showLoader = false;
      this.startLoading.emit(false);
    });
    }
    else{
      this.showBranchList = this.isBranchesAvailable([]);
      this.showLoader = false;
      this.startLoading.emit(false);
    }

  }

  public isBranchesAvailable(branchList) {
    if (branchList.length === 0) {
      return false;
    }
    else {
      let disableCntr = 0;
      for (let i = 0; i < branchList.length; i++) {
        if (!branchList[i].enabled) {
          disableCntr++;
        }
      }
      if (disableCntr === branchList.length) {
        return false;
      }
      return true;
    }

  }

  public reloadData() {
    this.loadData(this.branchService, this.retryService);
  }

}
