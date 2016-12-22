import { Component, Injectable, Input } from '@angular/core';
import { Router } from '@angular/router';
import { QueueEntity } from '../../entities/queue.entity';
import { Util } from '../../util/util';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-ticket-info-container',
  templateUrl: './ticket-info-container-tmpl.html',
  styleUrls: ['./ticket-info-container.css', '../../shared/css/common-styles.css']
})
export class TicketInfoContainerComponent {
  public isTicketEndedOrDeleted: boolean;
  public isVisitCall: boolean;
  public visitCallMsg: string;

  constructor(public router: Router) {
    this.isTicketEndedOrDeleted = false;
    this.isVisitCall = false;
    this.visitCallMsg = undefined;

    this.onVisitStatusUpdate(MobileTicketAPI.getCurrentVisitStatus());
  }

   onVisitStatusUpdate(visitStatus : QueueEntity){
     this.updateBrowserTitle(visitStatus);
     if(visitStatus.status == "VISIT_CALL"){
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

   updateVisitCallMsg(firstName : string, servicePointName : String){
     this.visitCallMsg = "It's your turn! <br>" + firstName + " is ready to serve you <br> at " + servicePointName;
   }

   updateBrowserTitle(visitStatus : QueueEntity){
     var title = "Mobile Ticket";
     if(visitStatus.visitPosition === -1 && visitStatus.status == "VISIT_CALL"){
       title = "It's your turn";
     }
     else if(visitStatus.visitPosition > 0){
       let util = new Util();
       title = util.getNumberSufix(visitStatus.visitPosition) + " in line";
     }
     document.title = title;
   }
  /*
  ticketNmbr: any;
  constructor(private route: ActivatedRoute) {
    this.ticketNmbr = route.snapshot.params['id'];
  }
  **/

}
