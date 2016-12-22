/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { QueueComponent } from './queue.component';
import {TicketInfoService } from '../ticket-info.service'

describe('QueueComponent', () => {
  let component: QueueComponent;
  let fixture: ComponentFixture<QueueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QueueComponent ],
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
