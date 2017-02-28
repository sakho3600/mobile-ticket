import { Injectable } from '@angular/core';
import { VisitEntity } from '../entities/visit.entity';
import { QueueEntity } from '../entities/queue.entity';
import { BranchEntity } from '../entities/branch.entity';

declare var MobileTicketAPI: any;
var isVisitCacheUpdate = true;

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

  pollVisitStatus(success, err): any {
    if (isVisitCacheUpdate == true) {
      MobileTicketAPI.getVisitStatus(
        (queueObj: any) => {
          success(this.convertToQueueEntity(queueObj));
        },
        (xhr, status, msg) => {
          if (xhr !== null && xhr.status == 404) {
            var payload = xhr.responseJSON;
            if (payload != undefined &&
              payload.message.includes("New visits are not available until visitsOnBranchCache is refreshed") == true) {
              isVisitCacheUpdate = false;
              setTimeout(function () {
                MobileTicketAPI.getVisitStatus(
                  (queueObj: any) => {
                    isVisitCacheUpdate = true;
                    success(this.convertToQueueEntity(queueObj));
                  },
                  (xhr, status, msg) => {
                    isVisitCacheUpdate = true;
                    err(xhr, status, msg);
                  });
              }, payload.refreshRate * 1000);
            }
            else {
              err(xhr, status, msg);
            }
          }
          else {
            err(xhr, status, msg);
          }
        }
      );
    }
  }

  public isBranchFound(branchList, branchId) {
    let branchEntity: BranchEntity;
    for (let i = 0; i < branchList.length; i++) {
      if (branchList[i].id === +branchId) {
        branchEntity = new BranchEntity();
        branchEntity.id = branchList[i].id;
        branchEntity.name = branchList[i].name;
        MobileTicketAPI.setBranchSelection(branchEntity);
        return true;
      }
    }
    return false;

  }

/**
 * replace this function once #140741231 is done
 */
  public getBranchInformation(branchId, onBranchResponse): void {
    MobileTicketAPI.getBranchesNearBy(0, 0, 2147483647,
      (branchList: any) => {
        if (this.isBranchFound(branchList, branchId)) {
          onBranchResponse(true);
        }
        else {
          onBranchResponse(false);
        }
      },
      () => {
        onBranchResponse(false);
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
    let queueSize = upperBound;
    if (upperBound < 10) {
      upperBound = 10;
    }
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

      if (i <= queueSize)
        arrayQueueItem.index = i;

      entities.push(arrayQueueItem);
    }
    return entities;
  }

}
