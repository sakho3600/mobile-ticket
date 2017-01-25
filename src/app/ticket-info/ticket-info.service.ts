import { Injectable } from '@angular/core';
import { VisitEntity } from '../entities/visit.entity';
import { QueueEntity } from '../entities/queue.entity';

declare var MobileTicketAPI: any;

@Injectable()
export class TicketInfoService {
  constructor() { }

  public convertToQueueEntity(queueObj): QueueEntity {
    let queueEntity: QueueEntity;
    queueEntity = new QueueEntity();
    queueEntity.queueName = queueObj.queueName;
    queueEntity.status = queueObj.status;
    queueEntity.visitPosition = queueObj.visitPosition;
    queueEntity.waitingVisits = queueObj.waitingVisits;
    queueEntity.queueId = queueObj.queueId;
    return queueEntity;
  }
  getVisitStatus(success, err): any {
    MobileTicketAPI.getVisitStatus(
      (queueObj: any) => {
        success(this.convertToQueueEntity(queueObj));
      },
      (xhr, status, msg) => {
        err(xhr, status, msg);
      }
    );
  }

  pollVisitStatus(success, err): any {
    MobileTicketAPI.getVisitStatus(
      (queueObj: any) => {
        success(this.convertToQueueEntity(queueObj));
      },
      (xhr, status, msg) => {
        err(xhr, status, msg);
      }
    );
  }

  getBranchInformation(branchId, onBranchResponse): void {
    MobileTicketAPI.getBranchInformation(branchId, (branchInfo) => {
        onBranchResponse(branchInfo, false);
      }, () => {
        onBranchResponse(null, true);
      });
  }

  getQueueUpperBound(queueSize, queuePosition): number {
    if (queueSize <= 10) {
      return queueSize;
    }
    else if (queuePosition <= 10) {
      return 10;
    }
    else {
      let u = queueSize - queuePosition;
      if (u >= 10) {
        if (queuePosition % 10 === 0) {
          return queuePosition;
        }
        else {
          return (~~(queuePosition / 10) + 1) * 10;
        }
      }
      else {
        return queueSize;
      }
    }
  }

  getQueueLowerBound(queueSize, queuePosition, upper): number {
    if (queueSize <= 10 || queuePosition <= 10) {
      return 1;
    }
    else {
      return upper - 9;
    }
  }

  populateQueue(queueItem: QueueEntity, prevWaitingVisits: number, 
  prevVisitPosition: number, prevUpperBound: number, prevLowerBound: number): Array<QueueEntity> {
    let entities: Array<QueueEntity> = [];
    let arrayQueueItem: QueueEntity;
    let upperBound = this.getQueueUpperBound(queueItem.waitingVisits, queueItem.visitPosition);
    let lowerBound = this.getQueueLowerBound(queueItem.waitingVisits, queueItem.visitPosition, upperBound);
    for (let i = upperBound; i >= lowerBound; i -= 1) {
      arrayQueueItem = new QueueEntity();
      arrayQueueItem.queueName = queueItem.queueName;
      arrayQueueItem.status = queueItem.status;
      arrayQueueItem.visitPosition = queueItem.visitPosition;
      arrayQueueItem.waitingVisits = queueItem.waitingVisits;
      arrayQueueItem.upperBound = upperBound;
      arrayQueueItem.lowerBound = lowerBound;
      arrayQueueItem.prevWaitingVisits = prevWaitingVisits;
      arrayQueueItem.prevVisitPosition = prevVisitPosition;
      arrayQueueItem.prevUpperBound = prevUpperBound;
      arrayQueueItem.prevLowerBound = prevLowerBound;
      arrayQueueItem.index = i;

      entities.push(arrayQueueItem);
    }
    return entities;
  }

}
