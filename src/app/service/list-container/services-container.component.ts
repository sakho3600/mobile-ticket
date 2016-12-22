import { Component } from '@angular/core';
import { BranchService } from '../../branch/branch.service';
import { Router } from '@angular/router';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-services-container',
  templateUrl: './services-container-tmpl.html',
  styleUrls: ['./services-container.css', '../../shared/css/common-styles.css']
})

export class ServicesContainerComponent {
  public subHeadingOne = "Welcome to Qmatic";
  public subHeadingTwo;

  constructor(private branchService: BranchService, public router: Router){
    document.title = "Mobile Ticket";
    this.subHeadingTwo = "Please select a service at Qmatic " + branchService.getSelectedBranch() + ":";
  }

  onTakeTicket(){
    MobileTicketAPI.createVisit(
      (visitInfo) => {
        this.router.navigate(['ticket']);
      },
      (xhr, status, errorMessage) => {

      }
    );
  }
}
