/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TranslateService, TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate/ng2-translate';
import { Http, Response, ResponseOptions,  XHRBackend, HttpModule  } from '@angular/http';
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Injector }    from '@angular/core';
import { TicketComponent } from './ticket.component';
import { Router } from '@angular/router';
import { QmRouterModule, RoutingComponents } from "../../router-module";

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('TicketComponent', () => {
  let injector: Injector;
  let backend: MockBackend;
  let translate: TranslateService;
  let connection: MockConnection;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule,TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, './app/locale', '.json'),
            deps: [Http]
        })],
      declarations: [
        TicketComponent
      ],
      providers: [
        { provide: Router, useClass: QmRouterModule },
        { provide: XHRBackend, useClass: MockBackend },
         TranslateService
      ]
    });
      injector = getTestBed();
      backend = injector.get(XHRBackend);
      translate = injector.get(TranslateService);
      // sets the connection when someone tries to access the backend with an xhr request
      backend.connections.subscribe((c: MockConnection) => connection = c);
      translate.use('en');
  });

  afterEach(() => {
        this.injector = undefined;
        this.backend = undefined;
        this.translate = undefined;
        this.connection = undefined;
    });

  it(`Should return a string of length 30 characters if input is a string of more than 20 characters`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("1234567890123456789012345678901");
    expect(str.length).toEqual(30);
  }));

  it(`Should return true if 27th position on string in . when length of inout string longer than 20`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("1234567890123456789012345678901");
    expect(str[27]).toEqual(".");
  }));

  it(`Should return true if 28th position on string in . when length of inout string longer than 20`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("1234567890123456789012345678901");
    expect(str[28]).toEqual(".");
  }));

  it(`Should return true if 29th position on string in . when length of inout string longer than 20`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("1234567890123456789012345678901");
    expect(str[29]).toEqual(".");
  }));

});
