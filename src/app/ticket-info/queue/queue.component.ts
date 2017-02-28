import { Component, OnInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { QueueEntity } from '../../entities/queue.entity';
import { TicketInfoService } from '../ticket-info.service';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { RetryService } from '../../shared/retry.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BranchEntity } from '../../entities/branch.entity';
import { TranslateService } from 'ng2-translate';
import { VisitState } from '../../util/visit.state';
import { Util } from '../../util/util';

declare var MobileTicketAPI: any;
declare var ga: Function;

@Component({
  selector: 'app-queue-container',
  templateUrl: './queue.component.html',
  styleUrls: ['./queue.component.css', './queue.component-rtl.css', '../../shared/css/common-styles.css']
})
export class QueueComponent implements OnInit, OnDestroy {

  public visitPosition: number;
  public prevWaitingVisits: number;
  public waitingVisits: number;
  public queueName: string;
  public branchId: number;
  public visitId: number;
  public queueId: number;
  public checksum: number;
  public upperBound: number;
  public lowerBound: number;
  public queueLength: Array<number> = [];
  public timer;
  public subscription: Subscription;
  public routerSubscription: Subscription;
  public prevVisitPosition: number;
  public prevUpperBound: number;
  public prevLowerBound: number;
  public queueHeading: string;
  public queueItems: Array<QueueEntity>;
  public isTicketEndedOrDeleted: boolean;
  public ticketEndHeading: string;
  public welcomeback: string;
  public isRtl: boolean;
  private showNetWorkError: boolean;
  private queueIdPrev: number = -1;
  private visitState: VisitState;
  public prevVisitState: string;

  @Output() onUrlAccessedTicket: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onTciketNmbrChange = new EventEmitter();
  @Output() onServiceNameUpdate: EventEmitter<string> = new EventEmitter<string>();
  @Output() onBranchUpdate = new EventEmitter();
  @Output() onUrlVisitLoading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onVisitNotFound: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onVisitStatusUpdate: EventEmitter<QueueEntity> = new EventEmitter<QueueEntity>();
  @Output() onNetworkErr: EventEmitter<boolean> = new EventEmitter<boolean>();
  public visitRecycleMsg: string;


  constructor(public ticketService: TicketInfoService, private retryService: RetryService,
    private activatedRoute: ActivatedRoute,
    public router: Router, private translate: TranslateService) {
    this.visitPosition = 0;
    this.isTicketEndedOrDeleted = false;
    this.visitState = new VisitState();
  }

  ngOnInit() {
    this.setRtlStyles();
    // subscribe to router event branchId=1&visitId=1&checksum=423434;
    this.routerSubscription = this.activatedRoute.queryParams.subscribe(
      (queryParams: any) => {
        let branchId = queryParams['branch'];
        let visitId = queryParams['visit'];
        let checksum = queryParams['checksum'];
        if (branchId && visitId && checksum) {
          this.onUrlVisitLoading.emit(true);
          this.ticketService.getBranchInformation(branchId, (success: boolean) => {
            if (!success) {
              this.onVisitNotFound.emit(true);
              this.router.navigate(['no_visit']);
            } else {
              // this.onBranchFetchSuccess(branch);
              MobileTicketAPI.setVisit(branchId, 0, visitId, checksum);
              this.ticketService.pollVisitStatus((queueInfo: QueueEntity) => {
                this.onUrlVisitLoading.emit(false);
                MobileTicketAPI.setServiceSelection({ name: MobileTicketAPI.getCurrentVisitStatus().currentServiceName });
                this.onUrlAccessedTicket.emit(true);
                this.onBranchUpdate.emit();
                this.onTciketNmbrChange.emit();
                this.onServiceNameUpdate.emit(MobileTicketAPI.getCurrentVisitStatus().currentServiceName);
                this.initPollTimer(this.visitPosition, this.ticketService);

                ga('send', {
                  hitType: 'event',
                  eventCategory: 'visit',
                  eventAction: 'open',
                  eventLabel: 'vist-open-url'
                });
              },
                (xhr, status, msg) => {
                  if (xhr.status === 404 || xhr.status === 401) {
                    MobileTicketAPI.resetAllVars();
                    this.onVisitNotFound.emit(true);
                    this.router.navigate(['no_visit']);
                  }
                }
              );
            }
          });
        }
        else {
          this.onUrlVisitLoading.emit(false);
          this.branchId = MobileTicketAPI.getCurrentVisit().branchId;
          this.visitId = MobileTicketAPI.getCurrentVisit().visitId;
          this.queueId = MobileTicketAPI.getCurrentVisit().queueId;
          this.checksum = MobileTicketAPI.getCurrentVisit().checksum;
          // MobileTicketAPI.setVisit(this.branchId, this.queueId, this.visitId);
          this.initPollTimer(this.visitPosition, this.ticketService);
        }
      });
  }

  public onVisitRecycled(isRecyled) {
    if(isRecyled) {
     this.translate.get('ticketInfo.visitRecycledMessage').subscribe((res: string) => {
        this.visitRecycleMsg = res;
      });
    }
    else {
      this.visitRecycleMsg = undefined;
    }
  }

  private onBranchFetchSuccess(branch) {
    MobileTicketAPI.setBranchSelection(branch);
  }

  private detectTransfer(currentQueueId: number) {
    return (this.queueIdPrev !== -1 && (this.queueIdPrev != currentQueueId));
  }

  public initPollTimer(visitPosition, ticketService: TicketInfoService) {
    if (visitPosition > 5) {
      this.timer = TimerObservable.create(0, 5000);
    }
    if (visitPosition <= 5) {
      this.timer = TimerObservable.create(0, 1000);
    }
    this.subscription = this.timer.subscribe(visitPosition => this.queuePoll(visitPosition, ticketService, false));

  }

  public queuePoll(visitPosition, ticketService: TicketInfoService, onRetry: boolean) {
    ticketService.pollVisitStatus((queueInfo: QueueEntity) => {
      this.doSubscribeForPolling();
      this.onQueuePollSuccess(queueInfo, ticketService);
      this.retryService.abortRetry();
      this.queueId = queueInfo.queueId;
      if (this.detectTransfer(this.queueId) == true) {
        MobileTicketAPI.setServiceSelection({ name: MobileTicketAPI.getCurrentVisitStatus().currentServiceName });
        this.onBranchUpdate.emit();
      }
      this.queueIdPrev = this.queueId;
    },
      (xhr, status, msg) => {
        this.doUnsubscribeForPolling();
        if (xhr === null) {
          let queueInfo: QueueEntity = new QueueEntity();
          queueInfo.status = '';
          queueInfo.visitPosition = null;
          this.isTicketEndedOrDeleted = true;
          this.onVisitStatusUpdate.emit(queueInfo);
        }
        else if (xhr.status != 404 && !onRetry) {
          this.showHideNetworkError(true);
          this.retryService.retry(() => {
            this.queuePoll(visitPosition, ticketService, true);
          })
        } else if (xhr.status == 404) {
          /**
           * this is to try if initial polling failed
           */
          let queueInfo: QueueEntity = new QueueEntity();
          queueInfo.status = '';
          queueInfo.visitPosition = null;
          this.isTicketEndedOrDeleted = true;
          var payload = xhr.responseJSON;
          if (payload !== undefined && 
          payload.message.includes("New visits are not available until visitsOnBranchCache is refreshed") == true) {
            queueInfo.status = "CACHED";
          }
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
    /**
     * get selected service name from getCurrentVisitStatus() object instead 
     * of getSelectedService()
     * because in multiple tab scenario, getSelectedService() returns the 
     * value of the local variable which is not correct.
     */
    this.onServiceNameUpdate.emit(MobileTicketAPI.getCurrentVisitStatus().currentServiceName);
    this.onVisitStatusUpdate.emit(queueInfo);
    this.prevVisitState = queueInfo.status;
    if (queueInfo.status === 'IN_QUEUE' || queueInfo.status === 'CALLED') {
      this.queueItems = ticketService.populateQueue(queueInfo, this.prevWaitingVisits,
        this.prevVisitPosition, this.prevUpperBound, this.prevLowerBound);
      this.updatePollTimer(this.visitPosition, ticketService);
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
    this.routerSubscription.unsubscribe();
  }

  public doUnsubscribeForPolling() {
    if (this.subscription !== undefined && this.subscription.closed === false) {
      this.subscription.unsubscribe();
    }
  }

  public doSubscribeForPolling() {
    if (this.subscription.closed === true) {
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
    this.onNetworkErr.emit(this.showNetWorkError);
  }
}
