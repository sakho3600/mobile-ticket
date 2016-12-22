/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { BranchService } from './branch.service';
import { PositionEntity } from '../entities/position.entity';
import { Config } from '../config/config';

describe('BranchService', () => {

  beforeEach(async(() => {

    
  let MobileTicketAPI = {};

    TestBed.configureTestingModule({
      declarations: [

      ],
      providers: [BranchService]
    })
      .compileComponents();
  }));

  let branchListService


  beforeEach(() => {
    branchListService = new BranchService(null);
  });

  it('Should create a PositionEntity', async(() => {
    let position = new PositionEntity(6.896114844252166, 79.8547870680015);
    expect(position).toBeTruthy();
  }));


  it('Should return a the distance between two GPS positions', async(() => {
    let branchPosition = new PositionEntity(6.896114844252166, 79.8547870680015);
    let currentPosition = new PositionEntity(6.8931276, 79.8576719);
    let distance = branchListService.getBranchDistance(branchPosition, currentPosition);
    expect(distance).toEqual('460m');
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

