/* tslint:disable:no-unused-variable */

import { TestBed, getTestBed, async, ComponentFixture } from '@angular/core/testing';
import { ServicesComponent } from './services.component';
import { ServiceComponent } from '../list-item/service.component';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { QmRouterModule, RoutingComponents } from "../../router-module";
import { ServiceServiceMok } from '../service.service.mok';
import { SortPipe } from '../../util/sort.pipe';
import { TranslateService, TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate/ng2-translate';
import { Http, Response, ResponseOptions,  XHRBackend, HttpModule  } from '@angular/http';
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Injector }    from '@angular/core';
import { RetryService } from '../../shared/retry.service';

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('ServicesComponent', () => {
   let fixture: ComponentFixture<ServicesComponent>;
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
        ServicesComponent, ServiceComponent, SortPipe
      ],
      providers: [
        { provide: Router, useClass: QmRouterModule },
        { provide: ServiceService, useClass: ServiceServiceMok },
        { provide: XHRBackend, useClass: MockBackend },
        TranslateService,
        RetryService
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

  it('Should create the ServicesComponent', async(() => {
    fixture = TestBed.createComponent(ServicesComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});
