/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TicketInfoService } from './ticket-info.service';

describe('TicketInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TicketInfoService]
    });
  });

  it('should return the upper bound as queue_size when queue_size is <= 10', inject([TicketInfoService], (service: TicketInfoService) => {
    let u = service.getQueueUpperBound(10, 8);
    expect(u).toEqual(10);
  }));

  it('should return the upper bound as 10 when queue_position is <= 10', inject([TicketInfoService], (service: TicketInfoService) => {
    let u = service.getQueueUpperBound(15, 8);
    expect(u).toEqual(10);
  }));

  it('should return the upper bound as 1 when queue_position && queue_size == 1', inject([TicketInfoService], (service: TicketInfoService) => {
    let u = service.getQueueUpperBound(1, 1);
    expect(u).toEqual(1);
  }));

  it('should return the upper bound as queue_size when queue_position == queue_size', inject([TicketInfoService], (service: TicketInfoService) => {
    let u = service.getQueueUpperBound(25, 25);
    expect(u).toEqual(25);
  }));

  it('should return the upper bound as 70 if queue_size = 93 && queue_position = 68', inject([TicketInfoService], (service: TicketInfoService) => {
    let u = service.getQueueUpperBound(93, 68);
    expect(u).toEqual(70);
  }));

  it('should return the upper bound as 120 if queue_size = 137 && queue_position = 120', inject([TicketInfoService], (service: TicketInfoService) => {
    let u = service.getQueueUpperBound(137, 120);
    expect(u).toEqual(120);
  }));

  it('should return the lower bound as 1 if queue_size || queue_position <= 10', inject([TicketInfoService], (service: TicketInfoService) => {
    let u = service.getQueueLowerBound(9, 3, 10);
    expect(u).toEqual(1);
  }));

   it('should return the lower bound as 74 if upper bound is 83 (upper bound - 9)', inject([TicketInfoService], (service: TicketInfoService) => {
    let u = service.getQueueLowerBound(121, 81, 83);
    expect(u).toEqual(74);
  }));

   it('should return the lower bound as 24 if upper bound is 33 (upper bound - 9)', inject([TicketInfoService], (service: TicketInfoService) => {
    let u = service.getQueueLowerBound(33, 33, 33);
    expect(u).toEqual(24);
  }));

});
