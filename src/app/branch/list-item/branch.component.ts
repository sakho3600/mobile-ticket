import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BranchEntity } from '../../entities/branch.entity';

declare var MobileTicketAPI: any;

@Component({
  selector: 'branch',
  templateUrl: './branch-tmpl.html',
  styleUrls: ['./branch.css', '../../shared/css/common-styles.css']
})

export class BranchComponent {

  @Input() public name: string
  @Input() public entity: BranchEntity
  @Input() public address: string
  @Input() public distance: string

  constructor(public router: Router) {
  }

  selectBranch(branch) {
    MobileTicketAPI.setBranchSelection(branch);
    this.router.navigate(['services']);
  }
}
