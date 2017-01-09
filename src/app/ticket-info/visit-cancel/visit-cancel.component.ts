import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-visit-cancel',
  templateUrl: './visit-cancel.component.html',
  styleUrls: ['./visit-cancel.component.css', '../../shared/css/common-styles.css']
})
export class VisitCancelComponent {

  @Input() isTicketEndedOrDeleted: boolean;
  public btnTitleLeaveLine: string;
  public btnTitleNewTicket: string;

  constructor(public router: Router, private translate: TranslateService) {
    this.translate.get('ticketInfo.btnTitleLeaveLine').subscribe((res: string) => {
      this.btnTitleLeaveLine = res;
    });
    this.translate.get('ticketInfo.btnTitleNewTicket').subscribe((res: string) => {
      this.btnTitleNewTicket = res;
    });
  }


  cancelVisit() {
    var confirmMsg = "";
    this.translate.get('ticketInfo.leaveVisitConfirmMsg').subscribe((res: string) => {
      confirmMsg = res;
    });
    var isConfirm = confirm(confirmMsg);
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
    return (this.isTicketEndedOrDeleted ? this.btnTitleNewTicket : this.btnTitleLeaveLine);
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
