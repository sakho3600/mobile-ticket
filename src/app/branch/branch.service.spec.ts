/* tslint:disable:no-unused-variable */
import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { BranchService } from './branch.service';
import { PositionEntity } from '../entities/position.entity';
import { Config } from '../config/config';
import { TranslateService, TranslateModule, TranslateLoader, TranslateStaticLoader, TranslatePipe } from 'ng2-translate/ng2-translate';
import { Http, Response, ResponseOptions,  XHRBackend, HttpModule  } from '@angular/http';
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Injector }    from '@angular/core';

const mockBackendResponse = (connection: MockConnection, response: string) => {
    connection.mockRespond(new Response(new ResponseOptions({body: response})));
};

describe('BranchService', () => {
  let injector: Injector;
  let backend: any;
  let translate: TranslateService;
  let connection: MockConnection;
  beforeEach(async(() => {

    
  let MobileTicketAPI = {};

    TestBed.configureTestingModule({
      imports: [HttpModule,TranslateModule.forRoot({
            provide: TranslateLoader,
            useFactory: (http: Http) => new TranslateStaticLoader(http, './app/locale', '.json'),
            deps: [Http]
        })],
      declarations: [

      ],
      providers: [BranchService,
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

  afterEach(() => {
        this.injector = undefined;
        this.backend = undefined;
        this.translate = undefined;
        this.connection = undefined;
    });

  let branchListService


  beforeEach(() => {
    branchListService = new BranchService(null, null, translate, null)
  });

  it('Should create a PositionEntity', async(() => {
    let position = new PositionEntity(6.896114844252166, 79.8547870680015);
    expect(position).toBeTruthy();
  }));


  it('Should return a the distance between two GPS positions', async(() => {
    let branchPosition = new PositionEntity(6.896114844252166, 79.8547870680015);
    let currentPosition = new PositionEntity(6.8931276, 79.8576719);
    let distance = branchListService.getBranchDistance(branchPosition, currentPosition);
    let isDistancePass = false;
    if(distance == '460m' || distance == '503 yd'){
      isDistancePass = true;
    }
    expect(isDistancePass).toEqual(true);
  }));

  it('Should return a list of BranchEntities', async(() => {
    let branchList = [
      {
        "estimatedWaitTime": 0,
        "id": 2,
        "name": "Branch 2",
        "timeZone": "Asia/Colombo",
        "longitude": 79.8547870680015,
        "latitude": 6.896114844252166,
        "openTime": "00:00",
        "closeTime": "00:00",
        "branchOpen": false,
        "queuePassesClosingTime": false,
        "longitudeE6": 79854787,
        "latitudeE6": 6896114
      },
      {
        "estimatedWaitTime": 0,
        "id": 1,
        "name": "Branch 1",
        "timeZone": "Asia/Colombo",
        "longitude": 79.85959358655597,
        "latitude": 6.898159873720292,
        "openTime": "00:00",
        "closeTime": "00:00",
        "branchOpen": false,
        "queuePassesClosingTime": false,
        "longitudeE6": 79859593,
        "latitudeE6": 6898159
      }
    ];
    
    let currentPosition = new PositionEntity(6.8931276, 79.8576719);

    let branchEntites = branchListService.convertToBranchEntities(branchList, currentPosition);
    expect(branchEntites.length).toBeGreaterThan(1);
  }));

});

