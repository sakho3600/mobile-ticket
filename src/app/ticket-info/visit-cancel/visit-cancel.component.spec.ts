/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { VisitCancelComponent } from './visit-cancel.component';
import { Router } from '@angular/router';
import { QmRouterModule, RoutingComponents } from "../../router-module";
import { TranslateService, TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate/ng2-translate';
import { Http, Response, ResponseOptions,  XHRBackend, HttpModule  } from '@angular/http';
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Injector }    from '@angular/core';

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('VisitCancelComponent', () => {
  let component: VisitCancelComponent;
  let fixture: ComponentFixture<VisitCancelComponent>;
  let injector: Injector;
  let backend: any;
  let translate: TranslateService;
  let connection: MockConnection;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule,TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, './app/locale', '.json'),
            deps: [Http]
        })],
      declarations: [ VisitCancelComponent ],
      providers: [ {provide: Router, useClass: QmRouterModule},
      { provide: XHRBackend, useClass: MockBackend },
         TranslateService]
    })
    .compileComponents();
      injector = getTestBed();
      backend = injector.get(XHRBackend);
      translate = injector.get(TranslateService);
      // sets the connection when someone tries to access the backend with an xhr request
      backend.connections.subscribe((c: MockConnection) => connection = c);
      translate.use('en');
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
        this.injector = undefined;
        this.backend = undefined;
        this.translate = undefined;
        this.connection = undefined;
    });

  it('should create VisitCancelComponent', () => {
    expect(component).toBeTruthy();
  });

 it('Should return "Get new Ticket" if ticket is ended or deleted', async(() => {
    mockBackendResponse(connection, '{"ticketInfo": {"btnTitleNewTicket": "Get new ticket"}}');
    let itemComponent = fixture.debugElement.componentInstance;
    itemComponent.isTicketEndedOrDeleted = true;
    let value = itemComponent.getButtonTitle();
    expect(value).toEqual('Get new ticket');
  }));

  it('Should return "Leave the line" if ticket is not ended or deleted', async(() => {
    mockBackendResponse(connection, '{"ticketInfo": {"btnTitleLeaveLine": "Leave the line"}}');
    let itemComponent = fixture.debugElement.componentInstance;
    itemComponent.isTicketEndedOrDeleted = false;
    let value = itemComponent.getButtonTitle();
    expect(value).toEqual('Leave the line');
  }));

});
