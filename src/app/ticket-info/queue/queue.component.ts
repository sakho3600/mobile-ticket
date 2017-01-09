import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { QueueEntity } from '../../entities/queue.entity';
import { TicketInfoService } from '../ticket-info.service';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { RetryService } from '../../shared/retry.service';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-queue-container',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css', './queue.component-rtl.css', '../../shared/css/common-styles.css']
})
export class QueueComponent implements OnInit {

  public visitPosition: number;
  public prevWaitingVisits: number;
  public waitingVisits: number;
  public queueName: string;
  public branchId: number;
  public visitId: number;
  public queueId: number;
  public upperBound: number;
  public lowerBound: number;
  public queueLength: Array<number> = [];
  public timer;
  public subscription: Subscription;
  public prevVisitPosition: number;
  public prevUpperBound: number;
  public prevLowerBound: number;
  public queueHeading: string;
  public queueItems: Array<QueueEntity>;
  public isTicketEndedOrDeleted: boolean;
  public ticketEndHeading: string;
  public isRtl: boolean;
  private showNetWorkError: boolean;

  @Output() onVisitStatusUpdate: EventEmitter<QueueEntity> = new EventEmitter<QueueEntity>();


  constructor(private ticketService: TicketInfoService, private retryService: RetryService) {
    this.visitPosition = 0;
    this.isTicketEndedOrDeleted = false;
    this.branchId = MobileTicketAPI.getSelectedBranch().id;
    this.visitId = MobileTicketAPI.getCurrentVisit().visitId;
    this.queueId = MobileTicketAPI.getCurrentVisit().queueId;
    MobileTicketAPI.setVisit(this.branchId, this.queueId, this.visitId);
    this.initPollTimer(this.visitPosition, ticketService);
  }

  ngOnInit() {
    this.setRtlStyles();
  }

  public initPollTimer(visitPosition, ticketService: TicketInfoService) {
    if (visitPosition > 5) {
      this.timer = TimerObservable.create(5000, 5000);
    }
    if (visitPosition <= 5) {
      this.timer = TimerObservable.create(1000, 1000);
    }
    this.subscription = this.timer.subscribe(visitPosition => this.queuePoll(visitPosition, ticketService, false));

  }

  public queuePoll(visitPosition, ticketService: TicketInfoService, onRetry : boolean) {    
    ticketService.pollVisitStatus((queueInfo: QueueEntity) => {
      this.doSubscribeForPolling();
      this.onQueuePollSuccess(queueInfo, ticketService);
      this.retryService.abortRetry();
    },
      (xhr, status, msg) => {
        this.doUnsubscribeForPolling();
        if (xhr.status != 404 && !onRetry) {
          this.showHideNetworkError(true);
          this.retryService.retry(() => {
            this.queuePoll(visitPosition, ticketService, true);
          })
        } else if(xhr.status == 404){
          let queueInfo: QueueEntity = new QueueEntity();
          queueInfo.status = '';
          queueInfo.visitPosition = -1;
          this.isTicketEndedOrDeleted = true;
          this.onVisitStatusUpdate.emit(queueInfo);
        }
      }
    );
  }

  private onQueuePollSuccess(queueInfo: QueueEntity, ticketService: TicketInfoService): void {
    this.showHideNetworkError(false);
    this.prevWaitingVisits = this.waitingVisits;
    this.prevVisitPosition = this.visitPosition;
    this.visitPosition = queueInfo.visitPosition;
    this.waitingVisits = queueInfo.waitingVisits;
    this.prevUpperBound = ticketService.getQueueUpperBound(this.prevWaitingVisits, this.prevVisitPosition);
    this.prevLowerBound = ticketService.getQueueLowerBound(this.prevWaitingVisits, this.prevVisitPosition, this.prevUpperBound);

    this.onVisitStatusUpdate.emit(queueInfo);
    if (this.visitPosition !== -1) {
      this.queueItems = ticketService.populateQueue(queueInfo, this.prevWaitingVisits,
        this.prevVisitPosition, this.prevUpperBound, this.prevLowerBound);
      this.updatePollTimer(this.visitPosition, ticketService);
    }
    else if (queueInfo.status !== 'VISIT_CALL' && queueInfo.status !==
      'VISIT_CONFIRM'
      && queueInfo.status !== 'ADD_DELIVERED_SERVICE' && queueInfo.status !==

      'SET_OUTCOME') {
      this.isTicketEndedOrDeleted = true;
      this.doUnsubscribeForPolling();
    }

  }

  public updatePollTimer(visitPosition: number, ticketService: TicketInfoService) {
    if ((this.prevVisitPosition > 5 && this.visitPosition <= 5) ||
      (this.prevVisitPosition <= 5 && this.visitPosition > 5)) {
      this.doUnsubscribeForPolling();

      if (visitPosition > 5) {
        this.timer = TimerObservable.create(5000, 5000);
      }
      if (visitPosition <= 5) {
        this.timer = TimerObservable.create(1000, 1000);
      }
      this.doSubscribeForPolling();
    }
  }

  ngOnDestroy() {
    this.doUnsubscribeForPolling();
  }

  public doUnsubscribeForPolling() {
    if (this.subscription !== undefined && this.subscription.closed === false) {
      this.subscription.unsubscribe();
    }
  }

  public doSubscribeForPolling(){
    if (this.subscription !== undefined && this.subscription.closed === false) {
      this.subscription = this.timer.subscribe(visitPosition => this.queuePoll(visitPosition, this.ticketService, false));
    }
  }

  setRtlStyles() {
    if (document.dir == "rtl") {
      this.isRtl = true;
    } else {
      this.isRtl = false;
    }
  }

  showHideNetworkError(value: boolean) {
    this.showNetWorkError = value;
  }
}
