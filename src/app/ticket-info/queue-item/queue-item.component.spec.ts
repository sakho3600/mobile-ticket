/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TicketInfoService } from '../ticket-info.service'
import { TicketInfoServiceMok } from '../ticket-info.service.mok'
import { QueueItemComponent } from './queue-item.component';
import { TranslateService, TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate/ng2-translate';
import { Http, Response, ResponseOptions,  XHRBackend, HttpModule  } from '@angular/http';
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Injector } from '@angular/core';

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('QueueItemComponent', () => {
  let component: QueueItemComponent;
  let fixture: ComponentFixture<QueueItemComponent>;
  let ticketInfoService;
  let injector: Injector;
  let backend: MockBackend;
  let translate: TranslateService;
  let connection: MockConnection;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule,TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, './app/locale', '.json'),
            deps: [Http]
        })],
      declarations: [QueueItemComponent],
      providers: [
        { provide: TicketInfoService, useClass: TicketInfoServiceMok },
        { provide: XHRBackend, useClass: MockBackend },
         TranslateService
      ]
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
    fixture = TestBed.createComponent(QueueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    ticketInfoService = new TicketInfoService();
  });

  afterEach(() => {
        this.injector = undefined;
        this.backend = undefined;
        this.translate = undefined;
        this.connection = undefined;
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

   it('Should return true if index = visitPosition', async(() => {
    let itemComponent = fixture.debugElement.componentInstance;
    itemComponent.index = 5;
    itemComponent.visitPosition = 5;
    let value = itemComponent.hilightSelctedPosition();
    expect(value).toEqual(true);
  }));

  it('Should return false if index != visitPosition', async(() => {
    let itemComponent = fixture.debugElement.componentInstance;
    itemComponent.index = 6;
    itemComponent.visitPosition = 5;
    let value = itemComponent.hilightSelctedPosition();
    expect(value).toEqual(false);
  }));

  it('Should return 7th if current position is 7 in the queue', async(() => {
    let itemComponent = fixture.debugElement.componentInstance;
    itemComponent.index = 7;
    itemComponent.visitPosition = 7;
    let value = itemComponent.getQueueIndex();
    expect(value).toEqual(7);
  }));


});
