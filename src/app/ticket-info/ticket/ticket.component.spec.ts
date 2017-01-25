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

  it(`Should return a string of length 20 characters if input is a string of more than 20 characters`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("123456789012345678901");
    expect(str.length).toEqual(20);
  }));

  it(`Should return true if 17th position on string in . when length of inout string longer than 20`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("1234567890123456789012345678901");
    expect(str[17]).toEqual(".");
  }));

  it(`Should return true if 18th position on string in . when length of inout string longer than 20`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("1234567890123456789012345678901");
    expect(str[18]).toEqual(".");
  }));

  it(`Should return true if 19th position on string in . when length of inout string longer than 20`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("1234567890123456789012345678901");
    expect(str[19]).toEqual(".");
  }));

});
