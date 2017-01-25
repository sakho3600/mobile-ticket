import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { QueueEntity } from '../../entities/queue.entity';
import { Util } from '../../util/util';
import { BranchEntity } from '../../entities/branch.entity';
import { TranslateService } from 'ng2-translate';
import { Config } from '../../config/config';
import { TicketInfoService } from '../ticket-info.service';
import { VisitState } from '../../util/visit.state';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-ticket-info-container',
  templateUrl: './ticket-info-container-tmpl.html',
  styleUrls: ['./ticket-info-container.css', './ticket-info-container-rtl.css', '../../shared/css/common-styles.css']
})
export class TicketInfoContainerComponent implements OnInit, OnDestroy {
  public branchEntity: BranchEntity;
  public isTicketFlashed: boolean;
  public isTicketEndedOrDeleted: boolean;
  public isVisitCall: boolean;
  public isVisitRecycled: boolean;
  public visitCallMsg: string;
  public isRtl: boolean;
  public isNetworkErr: boolean;
  private notificaitonSound = new Audio();
  private visitState: VisitState;
  public isUrlAccessedTicket: boolean;
  private isSoundPlay: boolean;
  private isTicketEndPage: boolean;
  public prevVisitState: string;
  private isAfterCalled: boolean;
  @ViewChild('ticketNumberComponent') ticketNumberComponent;

  constructor(private ticketService: TicketInfoService, public router: Router, private translate: TranslateService,
    private config: Config, private activatedRoute: ActivatedRoute) {
    this.isTicketFlashed = false;
    this.isTicketEndedOrDeleted = false;
    this.isVisitCall = false;
    this.visitCallMsg = undefined;
    this.isSoundPlay = false;
    this.isAfterCalled = true;
    this.isVisitRecycled = false;
    this.visitState = new VisitState();

    this.getSelectedBranch();

    if (MobileTicketAPI.getCurrentVisitStatus() !== undefined) {
      this.onVisitStatusUpdate(MobileTicketAPI.getCurrentVisitStatus());
    }
  }

  ngOnInit() {
    this.loadNotificationSound();
    this.setRtlStyles();
  }

  loadNotificationSound() {
    var fileName = this.config.getConfig("notification_sound");
    this.notificaitonSound.src = "./app/resources/" + fileName;
    this.notificaitonSound.load();
  }

  onUrlAccessedTicket(isUrl: boolean) {
    this.isUrlAccessedTicket = isUrl;
  }

  playNotificationSound() {
    this.isSoundPlay = true;
    this.notificaitonSound.play();
  }

  stopNotificationSound() {
    this.notificaitonSound.pause();
  }

  ngOnDestroy() {
  }

  public onServiceNameUpdate(serviceName) {
    let serviceNme = undefined;
    if (serviceName === null) {
      serviceNme = 'null';
    }
    else {
      serviceNme = serviceName;
    }
    this.ticketNumberComponent.onServiceNameUpdate(serviceNme);
  }

  public onTciketNmbrChange() {
    this.ticketNumberComponent.onTicketIdChange();
  }

  onVisitStatusUpdate(visitStatus: QueueEntity) {
    this.isVisitRecycled = false;
    this.updateBrowserTitle(visitStatus);
    if (visitStatus.status && visitStatus.status === this.visitState.CALLED) {
      this.prevVisitState = visitStatus.status;
      var currentEvent = MobileTicketAPI.getCurrentVisitStatus();
      var firstName = currentEvent.firstName;
      var servicePoint = currentEvent.servicePointName;
      this.updateVisitCallMsg(firstName, servicePoint);
      this.isVisitCall = true;
      if (this.isSoundPlay == false) {
        this.playNotificationSound();
      }
    }
    else if (visitStatus.status == this.visitState.DELAYED) {
      this.translate.get('ticketInfo.visitRecycledMessage').subscribe((res: string) => {
        this.visitCallMsg = res;
      });
      this.isVisitRecycled = true;
    }
    else if (visitStatus.status == this.visitState.IN_QUEUE) {
      this.isVisitCall = false;
    }
    else if (visitStatus && visitStatus.visitPosition === null) {
      if (this.prevVisitState === 'CALLED') {
        this.isAfterCalled = true;
      }
      else {
        this.isAfterCalled = false;
      }

      this.isTicketEndedOrDeleted = true;
      this.isVisitCall = false;
      MobileTicketAPI.resetCurrentVisitStatus();
      this.stopNotificationSound();
    }
  }

  onNetworkErr(isNetwrkErr: boolean) {
    this.isNetworkErr = isNetwrkErr;
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
    if (visitStatus.visitPosition === null && visitStatus.status == "CALLED") {
      this.translate.get('ticketInfo.titleYourTurn').subscribe((res: string) => {
        title = res;
      });
    }
    else if (visitStatus.visitPosition > 0) {
      this.translate.get('ticketInfo.titleInLine').subscribe((res: string) => {
        title = res + ' ' + visitStatus.visitPosition;
      });

    }
    document.title = title;
  }

  public getSelectedBranch() {
    if (MobileTicketAPI.getSelectedBranch() !== null) {
      this.branchEntity = MobileTicketAPI.getSelectedBranch();
    }
  }

  public onBranchUpdate() {
    this.getSelectedBranch();
  }

  setRtlStyles() {
    if (document.dir == "rtl") {
      this.isRtl = true;
    } else {
      this.isRtl = false;
    }
  }

  applyTicketEndStyles() {
    this.isTicketEndPage = true;
  }
}
