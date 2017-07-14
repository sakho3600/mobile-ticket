import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-branch-notfound',
  templateUrl: './branch-notfound.component.html',
  styleUrls: ['./branch-notfound.component.css', '../../shared/css/common-styles.css']
})
export class BranchNotfoundComponent implements OnInit {

  constructor(public router: Router, private translate: TranslateService) { 

  }

  ngOnInit() {
  }

  public reloadData() {
    this.router.navigate(['branches']);
  }


}
