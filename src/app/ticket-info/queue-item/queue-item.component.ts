import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { TicketInfoService } from '../ticket-info.service';
import { QueueEntity } from '../../entities/queue.entity';

@Component({
  selector: 'app-queue-item',
  templateUrl: './queue-item.component.html',
  styleUrls: ['./queue-item.component.css', '../../shared/css/common-styles.css']
})
export class QueueItemComponent {

    @Input() public queueName: string;
    @Input() public visitPosition: number;
    @Input() public waitingVisits: number;
    @Input() public index: number;
    @Input() public upper: number;
    @Input() public lower: number;
    @Input() public prevWaitingVisits: number;
    @Input() public prevVisitPosition: number;
    @Input() public prevUpperBound: number;
    @Input() public prevLowerBound: number;
    public queueEntity: QueueEntity;

    constructor(private ticketService: TicketInfoService) {
    }

    public hilightSelctedPosition(): boolean {
        if (this.index === this.visitPosition) {
            return true;
        }
        return false;
    }

    public animatePosition(): boolean {
        if (this.hilightSelctedPosition() && this.prevVisitPosition !== this.visitPosition) {
            return true;
        }
        else if (this.index === this.upper && this.upper > this.prevUpperBound) {
            return true;
        }
        return false;
    }

    public isEmptyQueueItem(): boolean{
        return !(this.index > 0);
    }

    public getQueueIndex(): any {
        if (this.hilightSelctedPosition()) {
            return this.index;
        }
        return this.trimIndex(this.index);
    }

    public trimIndex(index: number): any {
        if (index && index.toString().length > 3) {
            let a = index.toString().substr((index.toString().length - 2), (index.toString().length));
            return '.' + a;
        }
        return index;
    }

}
