import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-visit-cancel',
  templateUrl: './visit-cancel.component.html',
  styleUrls: ['./visit-cancel.component.css', '../../shared/css/common-styles.css']
})
export class VisitCancelComponent {

  @Input() isTicketEndedOrDeleted: boolean;
  public btnTitleLeaveLine: string;
  public btnTitleNewTckt: string;

  constructor(public router: Router) {
    this.btnTitleLeaveLine = 'Leave the line';
    this.btnTitleNewTckt = 'Get new Ticket';
  }


  cancelVisit() {
    var isConfirm = confirm('Would you like to leave the line');
    if(isConfirm == true){
      MobileTicketAPI.cancelVisit(
      () => {
        this.router.navigate(['branches']);
      },
      () => {

      });
    }
    else{

    }
    
  }

  getButtonTitle(): string {
    return (this.isTicketEndedOrDeleted ? this.btnTitleNewTckt : this.btnTitleLeaveLine);
  }

  getNewTicket() {
        this.router.navigate(['services']);
  }

  onButtonClick() {
    if (!this.isTicketEndedOrDeleted) {
      this.cancelVisit();
    }
    else {
      this.getNewTicket();
    }
  }

}
