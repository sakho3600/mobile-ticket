import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BranchEntity } from '../../entities/branch.entity';

declare var MobileTicketAPI: any;

@Component({
  selector: 'branch',
  templateUrl: './branch-tmpl.html',
  styleUrls: ['./branch.css', './branch-rtl.css']
})

export class BranchComponent implements OnInit {

  @Input() public name: string
  @Input() public entity: BranchEntity
  @Input() public address: string
  @Input() public distance: string
  public isRtl: boolean;

  constructor(public router: Router) {
  }

  ngOnInit() {
    this.setRtlStyles();    
  }

  selectBranch(branch) {
    MobileTicketAPI.setBranchSelection(branch);
    this.router.navigate(['services']);
  }

  setRtlStyles(){
    if(document.dir == "rtl"){
      this.isRtl = true;
    }else{
      this.isRtl = false;
    }
  }
}
