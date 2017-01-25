import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-visit-notfound',
  templateUrl: './visit-notfound.component.html',
  styleUrls: ['./visit-notfound.component.css', '../../shared/css/common-styles.css']
})
export class VisitNotfoundComponent implements OnInit {

  constructor(public router: Router, private translate: TranslateService) { 

  }

  ngOnInit() {
  }

  public reloadData() {
    this.router.navigate(['branches']);
  }


}
