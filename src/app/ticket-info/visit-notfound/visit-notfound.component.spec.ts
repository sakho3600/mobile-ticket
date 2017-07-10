/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { TranslateService, TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate/ng2-translate';
import { Http, Response, ResponseOptions,  XHRBackend, HttpModule  } from '@angular/http';
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Injector }    from '@angular/core';
import { VisitNotfoundComponent } from './visit-notfound.component';
import { Router } from '@angular/router';

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('VisitNotfoundComponent', () => {
  let component: VisitNotfoundComponent;
  let fixture: ComponentFixture<VisitNotfoundComponent>;
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
      declarations: [ VisitNotfoundComponent ],
      providers: [
        { provide: XHRBackend, useClass: MockBackend },
         TranslateService,
         Router]
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
    fixture = TestBed.createComponent(VisitNotfoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
        this.injector = undefined;
        this.backend = undefined;
        this.translate = undefined;
        this.connection = undefined;
    });
});
