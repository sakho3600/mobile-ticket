/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TicketInfoService } from '../ticket-info.service'
import { TicketInfoServiceMok } from '../ticket-info.service.mok'
import { QueueItemComponent } from './queue-item.component';

describe('QueueItemComponent', () => {
  let component: QueueItemComponent;
  let fixture: ComponentFixture<QueueItemComponent>;
  let ticketInfoService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QueueItemComponent],
      providers: [
        { provide: TicketInfoService, useClass: TicketInfoServiceMok }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    ticketInfoService = new TicketInfoService();
  });

  it('Should create the QueueItemComponent', () => {
    expect(component).toBeTruthy();
  });

  it('Should trim numbers more than 3 digits', async(() => {
    let itemComponent = fixture.debugElement.componentInstance;
    let value = itemComponent.trimIndex(1234);
    expect(value).toMatch('.34');
  }));

   it('Should not trim numbers more than 3 digits', async(() => {
    let itemComponent = fixture.debugElement.componentInstance;
    let value = itemComponent.trimIndex(123);
    expect(value).toMatch('123');
  }));

  it('Should return ordinal suffix st for #1', async(() => {
    let itemComponent = fixture.debugElement.componentInstance;
    let value = itemComponent.ordinal_suffix_of(1);
    expect(value).toMatch('1st');
  }));

  it('Should return ordinal suffix nd for #2', async(() => {
    let itemComponent = fixture.debugElement.componentInstance;
    let value = itemComponent.ordinal_suffix_of(2);
    expect(value).toMatch('2nd');
  }));

  it('Should return ordinal suffix rd for #3', async(() => {
    let itemComponent = fixture.debugElement.componentInstance;
    let value = itemComponent.ordinal_suffix_of(3);
    expect(value).toMatch('3rd');
  }));


});
