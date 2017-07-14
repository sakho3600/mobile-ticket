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
  let backend: any;
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

  it(`Should return a string in a single line without triming if input is a string of less than 11 characters`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("ABCDEFGHI JKLMN");
    expect(str).toEqual("ABCDEFGHI<br>JKLMN");
  }));

  it(`Should return a string in two lines without triming if input is a string of more than 11 characters but less than 22 charaters`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("ABCDEF GHIJKLMN");
    expect(str).toEqual("ABCDEF<br>GHIJKLMN");
  }));

  it(`Should return a string in two lines with triming if input is a string of more than 22 characters`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("ABCDE ABCDEFGHIJKLMNOPQRS");
    expect(str).toEqual("ABCDE<br>ABCDEFGHIJK");
  }));

  it(`Should return a string in two lines without triming if input is a string of less than 22 characters without space or dash`, async(() => {
    let fixture = TestBed.createComponent(TicketComponent);
    let component = fixture.debugElement.componentInstance;
    let str = component.trimServiceString("ABCDEFGHIJKLMN");
    expect(str).toEqual("ABCDEFGHIJK<br>LMN");
  }));

});
