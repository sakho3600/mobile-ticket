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
  private nmbrOfEnabledBranches: number;
  private loaderResource: string = "app/resources/loader.svg";

  @Output() startLoading = new EventEmitter<boolean>();
  @Output() onShowHideRequest = new EventEmitter<boolean>();

  constructor(private branchService: BranchService, private retryService: RetryService, public router: Router, private translate: TranslateService, private sort: SortPipe) {
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
    this.showBranchList = true;
    // this.startLoading.emit(true);
    branchService.getBranches((branchList: Array<BranchEntity>, error: boolean, isFullList: boolean) => {
      if (error) {
        this.networkError = true;
        this.onShowHideRequest.emit(true);
        this.showLoader = false;
        this.retryService.retry(() => {
          this.branchService.getBranches((branchList: Array<BranchEntity>, error: boolean,  isFullList: boolean) => {
            if (!error) {
              this.onBranchFetchSuccess(branchList, branchService, isFullList);
              this.retryService.abortRetry();
            }
          });
        });
      } else {
        this.onBranchFetchSuccess(branchList, branchService, isFullList);
      }
    });
  }

  private onBranchFetchSuccess(branchList, branchService, isFullList): void {
    this.networkError = false;
    this.onShowHideRequest.emit(false);
    if(isFullList == true){
      this.sort.transform(branchList, "name");
    }
    this.branches = branchList;
    let branchListCntr = 0;
    if (branchList.length > 0) {
      branchService.setBranchAddresses(this.branches, (updatedList: Array<BranchEntity>) => {
        branchListCntr++;
        if (branchListCntr === updatedList.length) {
          if (this.isBranchesAvailable(updatedList)) {
            this.showBranchList = true;
            if (this.nmbrOfEnabledBranches === 1) {
              for (let k = 0; k < updatedList.length; k++) {
                if (updatedList[k].enabled) {
                  MobileTicketAPI.setBranchSelection(updatedList[k]);
                  this.router.navigate(['services']);
                  break;
                }
              }

            }
          }
          else {
            this.showBranchList = false;
          }

          this.showLoader = false;
          this.startLoading.emit(false);
        }

      });
    }
    else {
      this.showBranchList = this.isBranchesAvailable([]);
      this.showLoader = false;
      this.startLoading.emit(false);
    }

  }

  public isBranchesAvailable(branchList) {
    let disableCntr = 0;
    let enbleCntr = 0;
    if (branchList.length === 0) {
      return false;
    }
    else {

      for (let i = 0; i < branchList.length; i++) {
        if (!branchList[i].enabled) {
          disableCntr++;
        }
        else {
          enbleCntr++;
        }
      }
      this.setEnableBranchCntr(enbleCntr);
      if (disableCntr === branchList.length) {
        return false;
      }
      return true;
    }

  }

  public setEnableBranchCntr(enbleCntr) {
    this.nmbrOfEnabledBranches = enbleCntr;
  }

  public reloadData() {
    this.loadData(this.branchService, this.retryService);
  }

}
