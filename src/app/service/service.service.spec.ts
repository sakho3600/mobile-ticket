/* tslint:disable:no-unused-variable */
import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceService } from './service.service';
import { ServiceEntity } from '../entities/service.entity';



describe('ServiceService', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        
      ],
      providers: [

      ]
    })
      .compileComponents();
  }));

  let serviceListService

  beforeEach(() => {
    serviceListService = new ServiceService();
  });


 it('Should return a list of ServiceEntities', async(() => {
    let serviceList = [
      {
        "waitingTime":0,
        "estimatedWaitTime": 0,
        "id": 2,
        "name": "Service 2"        
      },
      {
        "waitingTime":0,
        "estimatedWaitTime": 0,
        "id": 1,
        "name": "Branch 1"
      }
    ];
    
    let serviceEntities = serviceListService.convertToServiceEntities(serviceList);
    expect(serviceEntities.length).toBeGreaterThan(1);
  }));

});

