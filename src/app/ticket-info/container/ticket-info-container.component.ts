import { Component, ViewChild, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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
  private _isAfterCalled: boolean;
  public isUrlVisitLoading: boolean;
  public visitCallMsgOne: string;
  public visitCallMsgThree: string;
  public visitRecycleMsg: string;
  public isCalled: boolean = false;
  public isVisitNotFound: boolean = false;
  private tmpBranchId: number;
  private tmpVisitId: number;
  public title1: string;
  public title2: string;

  @ViewChild('ticketNumberComponent') ticketNumberComponent;
  @ViewChild('queueComponent') queueComponent;
  @ViewChild('cancelVisitComponent') cancelVisitComponent;

  constructor(private ticketService: TicketInfoService, public router: Router, private translate: TranslateService,
    private config: Config, private activatedRoute: ActivatedRoute) {
    this.isTicketFlashed = false;
    this.isTicketEndedOrDeleted = false;
    this.isVisitCall = false;
    this.visitCallMsg = undefined;
    this.visitCallMsgOne = undefined;
    this.visitCallMsgThree = undefined;
    this.isSoundPlay = false;
    this._isAfterCalled = false;
    this.isVisitRecycled = false;
    this.isUrlVisitLoading = true;
    this.visitState = new VisitState();



    this.getSelectedBranch();

    /**
     * this is commented
     * Issue: once called and ended a ticket and next time issued a ticket
     * previosuly ticket called screen is shown for a while.
     */
    /**
    if (MobileTicketAPI.getCurrentVisitStatus() !== undefined) {
      this.onVisitStatusUpdate(MobileTicketAPI.getCurrentVisitStatus());
    }
    */
  }

  ngOnInit() {
    this.scrollPageToTop();
    this.loadNotificationSound();
    this.setRtlStyles();
    this.loadTranslations();
  }

  loadTranslations() {
    this.translate.get('ticketInfo.titleYourTurn').subscribe((res: string) => {
      this.title1 = res;
      this.translate.get('ticketInfo.ticketReady').subscribe((res: string) => {
        this.title2 = res;
      });
    });
  }

  get isAfterCalled(): boolean {
    return this._isAfterCalled;
  }


  loadNotificationSound() {
    var fileName = this.config.getConfig("notification_sound");
    this.notificaitonSound.src = "./app/resources/" + fileName;
    this.notificaitonSound.load();
    this.isSoundPlay = false;
  }

  scrollPageToTop() {
    window.scrollTo(0, 0);
  }

  onUrlAccessedTicket(isUrl: boolean) {
    this.isUrlAccessedTicket = isUrl;
  }

  onUrlVisitLoading(isLoading: boolean) {
    this.isUrlVisitLoading = isLoading;
  }

  onVisitNotFound(isNotFound) {
    this.isVisitNotFound = isNotFound;
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


  public setVisitCancelCalled(called) {
    this.isCalled = called;
  }

  public getVisitCancelCalled(): boolean {
    return this.isCalled;
  }

  isConfirmed(): boolean {
    return this.cancelVisitComponent.isConfirmed();

  }

  isVisitCanceledOnce(): boolean {
    return this.cancelVisitComponent.visitCancelled;
  }

  isVisitCanceledThroughLeaveLineBtn() {
    return this.cancelVisitComponent.visitCancelledViaBtn;
  }

  cancelVisit() {
    this.cancelVisitComponent.cancelVisitViaBrowserBack();
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

  public onTciketNmbrChange(event) {
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
      if (this.isSoundPlay === false) {
        this.playNotificationSound();
      }

      this.tmpBranchId = MobileTicketAPI.getSelectedBranch().id;
      this.tmpVisitId = MobileTicketAPI.getCurrentVisit().visitId;
    }
    else if (visitStatus.status === this.visitState.DELAYED) {
      this.prevVisitState = this.visitState.DELAYED;
      this.isVisitCall = false;
      this.isVisitRecycled = true;
      this.queueComponent.onVisitRecycled(true);
    }
    else if (visitStatus.status === this.visitState.IN_QUEUE) {
      this.isSoundPlay = false;
      this.prevVisitState = this.visitState.IN_QUEUE;
      this.isVisitCall = false;
      this.isVisitRecycled = false;
      this.queueComponent.onVisitRecycled(false);
    }
    else if (visitStatus.status === this.visitState.CACHED) {
      if (this.prevVisitState === this.visitState.CALLED) {
        this._isAfterCalled = true;
      }
      else {
        this._isAfterCalled = false;
      }

      if (!this.isUrlAccessedTicket) {
        MobileTicketAPI.deleteAllCookies();
      }
      MobileTicketAPI.resetAllVars();
      this.isTicketEndedOrDeleted = true;
      this.isVisitCall = false;
      MobileTicketAPI.resetCurrentVisitStatus();
      this.stopNotificationSound();
      this.openCustomerFeedback(this.tmpBranchId, this.tmpVisitId);
    }
    else if (visitStatus && visitStatus.visitPosition === null) {
      if (this.prevVisitState === this.visitState.CALLED) {
        this._isAfterCalled = true;
      }
      else {
        this._isAfterCalled = false;
      }

      if (!this.isUrlAccessedTicket) {
        MobileTicketAPI.deleteAllCookies();
      }
      MobileTicketAPI.resetAllVars();
      this.isTicketEndedOrDeleted = true;
      this.isVisitCall = false;
      MobileTicketAPI.resetCurrentVisitStatus();
      this.stopNotificationSound();
      this.openCustomerFeedback(this.tmpBranchId, this.tmpVisitId);
    }
  }

  onNetworkErr(isNetwrkErr: boolean) {
    this.isNetworkErr = isNetwrkErr;
  }

  openCustomerFeedback(branchId, visitId) {
    if (this.isTicketEndedOrDeleted == true && this.isAfterCalled) {
      let customerFeedBackUrl = this.config.getConfig('customer_feedback');
      if (customerFeedBackUrl && customerFeedBackUrl.length > 0) {
        customerFeedBackUrl = customerFeedBackUrl + "?" + "b=" + branchId + "&" + "v=" + visitId;
        window.location.href = customerFeedBackUrl;
      }
    }
  }

  updateVisitCallMsg(firstName: string, servicePointName: string) {
    if (firstName !== null && firstName !== '' && servicePointName !== '') {
      this.visitCallMsgOne = this.title1;
      this.visitCallMsg = firstName + ' ' + this.title2;
      this.visitCallMsgThree = servicePointName;
      if (this.ticketNumberComponent && !this.isTicketFlashed) {
        this.isTicketFlashed = true;
        this.ticketNumberComponent.startFlashing();
      }
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
    /**
     * if selected branch id is not equal to current ongoing
     * branch id in multiple tab scenario, 
     * reset vars to fetch branchId from cache
     */
    if (!this.isUrlAccessedTicket && MobileTicketAPI.getCurrentVisit()) {
      if (MobileTicketAPI.getCurrentVisit().branchId !== MobileTicketAPI.getSelectedBranch().id) {
        MobileTicketAPI.resetAllVars();
      }
    }
    if (MobileTicketAPI.getSelectedBranch() !== null) {
      this.branchEntity = MobileTicketAPI.getSelectedBranch();
    }
  }

  public onBranchUpdate(event) {
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
