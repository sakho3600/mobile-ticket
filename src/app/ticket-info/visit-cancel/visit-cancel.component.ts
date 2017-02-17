import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
import { Util } from '../../util/util';
import { PlatformLocation } from '@angular/common';
import { ConfirmDialogService } from "../../shared/confirm-dialog/confirm-dialog.service";
import { AlertDialogService } from "../../shared/alert-dialog/alert-dialog.service";

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-visit-cancel',
  templateUrl: './visit-cancel.component.html',
  styleUrls: ['./visit-cancel.component.css', '../../shared/css/common-styles.css']
})
export class VisitCancelComponent {

  @Input() isTicketEndedOrDeleted: boolean;
  @Input() isUrlAccessedTicket: boolean;

  public btnTitleLeaveLine: string;
  public btnTitleNewTicket: string;
  public confirmMsg: string;
  public currentHash;
  public visitCancelled: boolean = false;
  public visitCancelledViaBtn: boolean = false;

  constructor(location: PlatformLocation, public router: Router, private translate: TranslateService, private confirmDialogService: ConfirmDialogService, private alertDialogService: AlertDialogService) {
    this.translate.get('ticketInfo.btnTitleLeaveLine').subscribe((res: string) => {
      this.btnTitleLeaveLine = res;
    });
    this.translate.get('ticketInfo.btnTitleNewTicket').subscribe((res: string) => {
      this.btnTitleNewTicket = res;
    });
    this.translate.get('ticketInfo.leaveVisitConfirmMsg').subscribe((res: string) => {
      this.confirmMsg = res;
    });
  }

  public cancelVisitViaBrowserBack() {
    let util = new Util();
    MobileTicketAPI.cancelVisit(
      () => {
        if (!this.isUrlAccessedTicket) {
          MobileTicketAPI.deleteAllCookies();
        }
        MobileTicketAPI.resetAllVars();
        this.router.navigate(['**']);
      },
      (xhr, status, errorMsg) => {
        if (util.getStatusErrorCode(xhr && xhr.getAllResponseHeaders()) === "11000") {
          this.translate.get('ticketInfo.visitAppRemoved').subscribe((res: string) => {
            this.alertDialogService.activate(res);
          });
        }
      });
  }

  // isConfirmed(): boolean {
    // this.confirmDialogService.activate(this.confirmMsg).then(res => {
    //   if (res === true) {
    //     this.visitCancelled = true;
    //     return true;
    //   }
    //   else {
    //     this.visitCancelled = false;
    //     return false;
    //   }
    // });
    // return;
    // if (confirm(this.confirmMsg)) {
    //   this.visitCancelled = true;
    //   return true;
    // }
    // else {
    //   this.visitCancelled = false;
    //   return false;
    // }

  // }


  cancelVisit() {
    let util = new Util();
    this.confirmDialogService.activate(this.confirmMsg).then(res => {
      if (res === true) {
        // Confirm Success Callback
        console.log("User clicked ok");
        this.visitCancelled = true;
        this.visitCancelledViaBtn = true;
        MobileTicketAPI.cancelVisit(
          () => {
            if (!this.isUrlAccessedTicket) {
              MobileTicketAPI.deleteAllCookies();
            }
            MobileTicketAPI.resetAllVars();
            this.router.navigate(['branches']);
          },
          (xhr, status, errorMsg) => {
            if (util.getStatusErrorCode(xhr && xhr.getAllResponseHeaders()) === "11000") {
              this.translate.get('ticketInfo.visitAppRemoved').subscribe((res: string) => {
                this.alertDialogService.activate(res);
              });
            }
          });
      }
      else {
        // Confirm fail Callback
        console.log("User clicked cancel");
        this.visitCancelledViaBtn = false;
        this.visitCancelled = false;
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
