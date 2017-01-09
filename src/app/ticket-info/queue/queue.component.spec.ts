/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { QueueComponent } from './queue.component';
import {TicketInfoService } from '../ticket-info.service';
import { QueueItemComponent } from '../queue-item/Queue-item.component';

describe('QueueComponent', () => {
  let component: QueueComponent;
  let fixture: ComponentFixture<QueueComponent>;

  beforeEach(async(() => {
    let MobileTicketAPI = {};
    TestBed.configureTestingModule({
      declarations: [ QueueComponent, QueueItemComponent ],
      providers : [TicketInfoService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueueComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });
  // it('should create QueueComponent', () => {
  //   expect(component).toBeTruthy();
  // });
});
