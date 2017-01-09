import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QueueEntity } from '../../entities/queue.entity';
import { Util } from '../../util/util';
import {BranchEntity} from '../../entities/branch.entity';
import { TranslateService } from 'ng2-translate';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-ticket-info-container',
  templateUrl: './ticket-info-container-tmpl.html',
  styleUrls: ['./ticket-info-container.css', './ticket-info-container-rtl.css', '../../shared/css/common-styles.css']
})
export class TicketInfoContainerComponent implements OnInit {
  public branchEntity:BranchEntity;
  public isTicketFlashed: boolean;
  public isTicketEndedOrDeleted: boolean;
  public isVisitCall: boolean;
  public visitCallMsg: string;
  public isRtl: boolean;
  @ViewChild('ticketNumberComponent') ticketNumberComponent;

  constructor(public router: Router, private translate: TranslateService) {
    this.isTicketFlashed = false;
    this.isTicketEndedOrDeleted = false;
    this.isVisitCall = false;
    this.visitCallMsg = undefined;

    this.getSelectedBranch();

    this.onVisitStatusUpdate(MobileTicketAPI.getCurrentVisitStatus());
  }

  ngOnInit() {
    this.setRtlStyles();
  }

  onVisitStatusUpdate(visitStatus: QueueEntity) {
    this.updateBrowserTitle(visitStatus);
    if (visitStatus.status == "VISIT_CALL" || visitStatus.status === 'VISIT_CONFIRM'
      || visitStatus.status === 'ADD_DELIVERED_SERVICE' || visitStatus.status === 'SET_OUTCOME') {
      var currentEvent = MobileTicketAPI.getCurrentVisitEvent();
      var firstName = currentEvent.parameterMap.firstName;
      var servicePoint = currentEvent.parameterMap.servicePointName;
      this.updateVisitCallMsg(firstName, servicePoint);
      this.isVisitCall = true;
    }
    else if (visitStatus.visitPosition === -1) {
      this.isTicketEndedOrDeleted = true;
      this.isVisitCall = false;
    }
  }

  updateVisitCallMsg(firstName: string, servicePointName: String) {

    this.translate.get('ticketInfo.titleYourTurn').subscribe((res: string) => {
      var title1 = res;
      this.translate.get('ticketInfo.ticketReady').subscribe((res: string) => {
        var title2 = res;
        this.visitCallMsg = title1 + " <br>" + firstName + " " + title2 + " " + servicePointName;
      });
    });
    if (this.ticketNumberComponent && !this.isTicketFlashed) {
      this.isTicketFlashed = true;
      this.ticketNumberComponent.startFlashing();
    }
  }

  updateBrowserTitle(visitStatus: QueueEntity) {
    var title = "";
    this.translate.get('ticketInfo.defaultTitle').subscribe((res: string) => {
      title = res;
    });
    if (visitStatus.visitPosition === -1 && visitStatus.status == "VISIT_CALL") {
      this.translate.get('ticketInfo.titleYourTurn').subscribe((res: string) => {
        title = res;
      });
    }
    else if (visitStatus.visitPosition > 0) {
      let util = new Util();
      this.translate.get('ticketInfo.titleInLine').subscribe((res: string) => {
        title = util.getNumberSufix(visitStatus.visitPosition) + " " + res;
      });

    }
    document.title = title;
  }

  public getSelectedBranch() {
    this.branchEntity = MobileTicketAPI.getSelectedBranch();
  }

  setRtlStyles(){
    if(document.dir == "rtl"){
      this.isRtl = true;
    }else{
      this.isRtl = false;
    }
  }
}
