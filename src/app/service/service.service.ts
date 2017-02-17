import { Injectable } from '@angular/core';
import { ServiceEntity } from '../entities/service.entity';
import 'rxjs/add/operator/map';
import { TranslateService } from 'ng2-translate';
import { Config } from '../config/config';

declare var MobileTicketAPI: any;

@Injectable()
export class ServiceService {

  private onCountDownCompleteCallback;
  private timerStart = 10 * 60 * 1000; //minutes
  private serviceRefreshLintervel = 15; //seconds
  private timerGap = 1000;
  private isSingleBranch;
  private countDownreTimersource;
  private serviceFecthTimerResource

  constructor(private config: Config, private translate: TranslateService) {
    try {
      this.timerStart = this.config.getConfig('service_screen_timeout') * 60 * 1000;
    } catch (error) {
      console.log(error.message + " error reading service_screen_timeout");
    }
  }

  private fetchServices(callback) {
    MobileTicketAPI.getServices(
      (serviceList: any) => {
        let serviceEntities = this.convertToServiceEntities(serviceList);
        callback(serviceEntities, false);
      },
      () => {
        callback(null, true);
      });
  }

  private intiCountDown() {
    let currenVal = this.timerStart;
    this.stopBranchRedirectionCountDown();
    this.countDownreTimersource = setInterval(() => {
      if (currenVal == 0) {
        clearInterval(this.countDownreTimersource);
        clearInterval(this.serviceFecthTimerResource);
        this.onCountDownCompleteCallback();
      }
      currenVal = currenVal - this.timerGap;;
    }, this.timerGap);
  }

  public stopServiceFetchTimer() {
    clearInterval(this.serviceFecthTimerResource);
  }

  public stopBranchRedirectionCountDown() {
    clearInterval(this.countDownreTimersource);
  }

  public convertToServiceEntities(serviceList): Array<ServiceEntity> {
    let entities: Array<ServiceEntity> = [];
    let serviceEntity: ServiceEntity;
    for (var i = 0; i < serviceList.length; i++) {
      serviceEntity = new ServiceEntity();
      serviceEntity.id = serviceList[i].serviceId;
      serviceEntity.name = serviceList[i].serviceName;
      serviceEntity.waitingTime = serviceList[i].waitingTimeInDefaultQueue;
      serviceEntity.customersWaiting = serviceList[i].customersWaitingInDefaultQueue.toString();
      serviceEntity.selected = false;
      entities.push(serviceEntity);
    }
    if (serviceList.length == 1) {
      entities[0].selected = true;
    }
    return entities;
  }

  public registerCountDownCompleteCallback(callback, singleBranch) {
    this.onCountDownCompleteCallback = callback;
    this.isSingleBranch = singleBranch;
  }

  public getServices(callback): void {
    this.stopServiceFetchTimer();
    this.fetchServices((serviceEntities, error) => {
      this.intiCountDown();
      callback(serviceEntities, error)
    });
    try {
      this.serviceRefreshLintervel = this.config.getConfig('service_fetch_interval');
    } catch (error) {
      console.log(error.message + " error reading service_fetch_interval");
    }

    this.serviceFecthTimerResource = setInterval(() => {
      this.fetchServices(callback);
    }, this.serviceRefreshLintervel * 1000);
  }
}
