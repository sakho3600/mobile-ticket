import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { QueueEntity } from '../../entities/queue.entity';
import { TicketInfoService } from '../ticket-info.service';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-queue-container',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css', '../../shared/css/common-styles.css']
})
export class QueueComponent implements OnInit {

  public visitPosition: number;
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
  public queueHeading: string;
  public queueItems: Array<QueueEntity>;
  public isTicketEndedOrDeleted: boolean;
  public ticketEndHeading: string;
  @Output() onVisitStatusUpdate:EventEmitter<QueueEntity> = new EventEmitter<QueueEntity>();


  constructor(private ticketService: TicketInfoService) {
    this.isTicketEndedOrDeleted = false;
    this.branchId = MobileTicketAPI.getSelectedBranch().id;
    this.visitId = MobileTicketAPI.getCurrentVisit().visitId;
    this.queueId = MobileTicketAPI.getCurrentVisit().queueId;
    MobileTicketAPI.setVisit(this.branchId, this.queueId, this.visitId);
    this.queueHeading = 'Your place in line:';
    this.ticketEndHeading = 'Thank you for visiting us! <br> Welcome back!';
    ticketService.getVisitStatus((queueInfo: QueueEntity) => {
      this.visitPosition = queueInfo.visitPosition;
      this.queueItems = ticketService.populateQueue(queueInfo);
      this.initPollTimer(this.visitPosition, ticketService);
    },
      (xhr, status, msg) => {
        if (msg === 'Not Found') {
          let queueInfo: QueueEntity = new QueueEntity();
          queueInfo.status = '';
          queueInfo.visitPosition = -1;
          this.isTicketEndedOrDeleted = true;
          this.onVisitStatusUpdate.emit(queueInfo);
          this.doUnsubscribeForPolling();
        }
      }
    );
  }

  ngOnInit() {
  }

  public initPollTimer(visitPosition, ticketService: TicketInfoService) {
    if (visitPosition > 5) {
      this.timer = TimerObservable.create(5000, 5000);
    }
    if (visitPosition <= 5) {
      this.timer = TimerObservable.create(1000, 1000);
    }
    this.subscription = this.timer.subscribe(visitPosition => this.queuePoll(visitPosition, ticketService));

  }

  public queuePoll(visitPosition, ticketService: TicketInfoService) {
    ticketService.pollVisitStatus((queueInfo: QueueEntity) => {
      this.prevVisitPosition = this.visitPosition;
      this.visitPosition = queueInfo.visitPosition;
      this.onVisitStatusUpdate.emit(queueInfo);
      if (this.visitPosition !== -1) {
        this.queueItems = ticketService.populateQueue(queueInfo);
        this.updatePollTimer(this.visitPosition, ticketService);
      }
      else if(queueInfo.status !== 'VISIT_CALL') {
        this.isTicketEndedOrDeleted = true;
        this.doUnsubscribeForPolling();
      }
    },
      (xhr, status, msg) => {
        if (msg === 'Not Found') {
          let queueInfo: QueueEntity = new QueueEntity();
          queueInfo.status = '';
          queueInfo.visitPosition = -1;
          this.isTicketEndedOrDeleted = true;
          this.onVisitStatusUpdate.emit(queueInfo);
          this.doUnsubscribeForPolling();
        }
      }
    );
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
      this.subscription = this.timer.subscribe(visitPosition => this.queuePoll(visitPosition, ticketService));
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
}
