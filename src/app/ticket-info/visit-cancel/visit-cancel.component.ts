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
  @Input() isUrlAccessedTicket: boolean;
    @Input() isAfterCalled: boolean;

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
      var isConfirm = confirm(confirmMsg);
      if (isConfirm == true) {
        MobileTicketAPI.cancelVisit(
          () => {
            this.router.navigate(['branches']);
          },
          (xhr, status, errorMsg) => {
          });
      }
      else {

      }
    });
  }

  getButtonTitle(): string {
    return (this.isTicketEndedOrDeleted ? this.btnTitleNewTicket : this.btnTitleLeaveLine);
  }

  showButton(): boolean {
    return (!this.isTicketEndedOrDeleted ? true : (this.isUrlAccessedTicket) ? false : true);
  }

  getNewTicket() {
    this.router.navigate(['branches']);
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
