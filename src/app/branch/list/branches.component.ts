import { Component } from '@angular/core';
import { BranchService } from '../branch.service';
import { BranchEntity } from '../../entities/branch.entity';
import { Router } from '@angular/router';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-branches',
  templateUrl: './branches-tmpl.html',
  styleUrls: ['./branches.css', '../../shared/css/common-styles.css']
})
export class BranchesComponent {
  public branches: Array<BranchEntity>;
  public showBranchList: boolean = false;
  constructor(private branchService: BranchService, public router: Router) {
    this.loadData(branchService);
    document.title = "Mobile Ticket";
  }

  public loadData(branchService: BranchService) {
    branchService.getBranches((branchList: Array<BranchEntity>) => {
      if (branchList.length === 1) {
        MobileTicketAPI.setBranchSelection(branchList[0]);
        this.router.navigate(['services']);
      }
      this.branches = branchList;
      branchService.setBranchAddresses(this.branches);
      this.showBranchList = this.isBranchesAvailable(this.branches);
    });
  }

  public isBranchesAvailable(branchList) {
    return branchList.length === 0 ? false : true;
  }

  public reloadData() {
    this.loadData(this.branchService);
  }
}
