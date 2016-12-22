import { Injectable } from '@angular/core';
import { VisitEntity } from '../entities/visit.entity';
import { QueueEntity } from '../entities/queue.entity';


@Injectable()
export class TicketInfoServiceMok {
  constructor() { }

  public convertToQueueEntity(queueObj): QueueEntity {
    return null;
  }
  getVisitStatus(success, err): any {

  }

  pollVisitStatus(success, err): any {

  }

  getQueueUpperBound(queueSize, queuePosition): number {
    return 0;
  }

  populateQueue(queueItem: QueueEntity): Array<QueueEntity> {
    return []
  }
}
