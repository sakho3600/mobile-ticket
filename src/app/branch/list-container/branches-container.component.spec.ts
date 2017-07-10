/* tslint:disable:no-unused-variable */

import { TestBed, getTestBed, async, ComponentFixture } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { Injector }    from '@angular/core';
import { BranchesContainerComponent } from '../list-container/branches-container.component';
import { BranchesComponent } from '../list/branches.component';
import { BranchComponent } from '../list-item/branch.component';
import { BranchService } from '../branch.service';
import { Router } from '@angular/router';
import { QmRouterModule, RoutingComponents } from "../../router-module";
import { BranchServiceMok } from '../branch.service.mok';
import { ConnectivityMessageComponent} from '../../shared/connectivity-message/connectivity-message.component';
import { RetryService } from '../../shared/retry.service';
import { TranslateService, TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate/ng2-translate';
import { Http, Response, ResponseOptions,  XHRBackend, HttpModule  } from '@angular/http';
import { SortPipe } from '../../util/sort.pipe';
import { MockBackend, MockConnection } from "@angular/http/testing";

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('BranchesContainer', () => {
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
        ConnectivityMessageComponent,
        BranchesContainerComponent,
        BranchesComponent,
        BranchComponent
      ],
      providers: [
         { provide: Router, useClass: QmRouterModule },
         { provide: BranchService, useClass: BranchServiceMok },
         { provide: XHRBackend, useClass: MockBackend },
         RetryService,
         SortPipe,
         TranslateService
      ],
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

  it('Should create the BranchesContainer', async(() => {
    let fixture = TestBed.createComponent(BranchesContainerComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`Should show 'Welcome To Qmatic' `, async(() => {
    mockBackendResponse(connection, '{"branch": {"subHeadingOne": "Welcome to Qmatic!"}}');
    let fixture = TestBed.createComponent(BranchesContainerComponent);
    let de = fixture.debugElement.query(By.css('#branchSubHeadingOne'));
    let el = de.nativeElement;
    fixture.detectChanges();
    expect(el.textContent).toEqual('Welcome to Qmatic!');
  }));

  it(`Should show 'Do you want to get in line for one of our services? Start by selecting location.'`, async(() => {
    mockBackendResponse(connection, '{"branch": {"subHeadingTwo": "Do you want to get in line for one of our services? Start by selecting location."}}');
    let fixture = TestBed.createComponent(BranchesContainerComponent);
    let de = fixture.debugElement.query(By.css('#branchSubHeadingTwo'));
    let el = de.nativeElement;
    fixture.detectChanges();
    expect(el.textContent).toEqual('Do you want to get in line for one of our services? Start by selecting location.');
  }));

});
