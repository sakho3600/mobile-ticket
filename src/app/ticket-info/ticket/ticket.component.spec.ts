/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TicketComponent } from './ticket.component';
import { Router } from '@angular/router';
import { QmRouterModule, RoutingComponents } from "../../router-module";

describe('TicketComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TicketComponent
      ],
      providers: [
        { provide: Router, useClass: QmRouterModule },
      ]
    });
  });

  it(`Should return a string of length 30 characters if input is a string of more than 30 characters`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("1234567890123456789012345678901");
    expect(str.length).toEqual(30);
  }));

  it(`Should return true if 27th position on string in . when length of inout string longer than 31`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("1234567890123456789012345678901");
    expect(str[27]).toEqual(".");
  }));

  it(`Should return true if 28th position on string in . when length of inout string longer than 31`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("1234567890123456789012345678901");
    expect(str[28]).toEqual(".");
  }));

  it(`Should return true if 29th position on string in . when length of inout string longer than 31`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("1234567890123456789012345678901");
    expect(str[29]).toEqual(".");
  }));

});
