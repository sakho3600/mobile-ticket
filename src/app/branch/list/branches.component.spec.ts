/* tslint:disable:no-unused-variable */

import { TestBed, getTestBed, async, ComponentFixture } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { Injector }    from '@angular/core';
import { BranchesComponent } from './branches.component';
import { BranchEntity } from '../../entities/branch.entity';
import { BranchComponent } from '../list-item/branch.component';
import { Config } from '../../config/config';
import { Router } from '@angular/router';
import { BranchService } from '../branch.service'
import { QmRouterModule, RoutingComponents } from "../../router-module";
import { BranchServiceMok } from '../branch.service.mok'
import { RetryService } from '../../shared/retry.service';
import { TranslateService, TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate/ng2-translate';
import { Http, Response, ResponseOptions,  XHRBackend, HttpModule  } from '@angular/http';
import { SortPipe } from '../../util/sort.pipe';
import { MockBackend, MockConnection } from "@angular/http/testing";

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('BranchesComponent', () => {
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
        BranchesComponent, BranchComponent
      ],
      providers: [
        { provide: Router, useClass: QmRouterModule },
        { provide: BranchService, useClass: BranchServiceMok},
        { provide: XHRBackend, useClass: MockBackend },
        RetryService,
        SortPipe,
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

  it('Should create the Branches component', async(() => {
    let fixture = TestBed.createComponent(BranchesComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('Should be true if there are branches available', async(() => {
    let fixture = TestBed.createComponent(BranchesComponent);
    let branchComponent = fixture.debugElement.componentInstance;
    let branch1 = new BranchEntity();
    branch1.enabled = true;
    let branch2 = new BranchEntity();
    branch1.enabled = true;
    let value = branchComponent.isBranchesAvailable([branch1, branch2]);
    expect(value).toEqual(true);
  }));

  it('Should not be true if there are no branches', async(() => {
    let fixture = TestBed.createComponent(BranchesComponent);
    let branchComponent = fixture.debugElement.componentInstance;
    let value = branchComponent.isBranchesAvailable([]);
    expect(value).toEqual(false);
  }));

  it('Should not be true if there are no branches', async(() => {
    let fixture = TestBed.createComponent(BranchesComponent);
    let branchComponent = fixture.debugElement.componentInstance;
    let value = branchComponent.isBranchesAvailable([]);
    expect(value).toEqual(false);
  }));

  it('Should be true if loading text is Loading...', async(() => {
    mockBackendResponse(connection, '{"branch": {"loading": "Loading..."}}');
    let fixture = TestBed.createComponent(BranchesComponent);
    let de = fixture.debugElement.query(By.css('#branchLoading'));
    let el = de.nativeElement;
    fixture.detectChanges();
    expect(el.textContent).toEqual('Loading...');
  }));

  // the line corresponds to 'noBranchesAvailableLabel' is commented in qm.branches-component, so following test is commented

  /*it('Should show "Sorry, there are no available branches close by. <a>Try again</a> at a different location."', async(() => {
    let fixture = TestBed.createComponent(Branches);
    let branchComponent = fixture.debugElement.componentInstance;
    expect(branchComponent.noBranchesAvailableLabel).toEqual("Sorry, there are no available branches close by. <a>Try again</a> at a different location.");
  }));*/

});
