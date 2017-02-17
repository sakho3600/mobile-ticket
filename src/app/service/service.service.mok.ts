import { Injectable } from '@angular/core';
import { ServiceEntity } from '../entities/service.entity';
import 'rxjs/add/operator/map';

@Injectable()
export class ServiceServiceMok {
  constructor() { }

  public convertToServiceEntities(serviceList): Array<ServiceEntity> {
    return [];
  }
  

  public getServices(callback): void {
    callback([]);
  }

}
