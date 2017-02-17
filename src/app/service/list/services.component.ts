import { Component, AfterViewInit, Input, HostListener, Output, EventEmitter } from '@angular/core';
import { ServiceService } from '../service.service';
import { ServiceEntity } from '../../entities/service.entity';
import { RetryService } from '../../shared/retry.service';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-services',
  templateUrl: './services-tmpl.html',
  styleUrls: ['./services.css']
})
export class ServicesComponent implements AfterViewInit {
  public services: Array<ServiceEntity>;
  public showListShadow: boolean;
  @Output() onServiceListHeightUpdate: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onServiceSelection: EventEmitter<number> = new EventEmitter<number>();
  @Output() onShowHideServiceFetchError = new EventEmitter<boolean>();
  @Output() onServiceListLoaded = new EventEmitter<boolean>();

  constructor(private serviceService: ServiceService, private retryService: RetryService) {
    this.onShowHideServiceFetchError.emit(false);
    serviceService.getServices((serviceList: Array<ServiceEntity>, error: boolean) => {
      if (error) {
        this.onShowHideServiceFetchError.emit(true);
        retryService.retry(() => {
          serviceService.getServices((serviceList: Array<ServiceEntity>, error: boolean) => {
            if (!error) {
              this.onServicesReceived(serviceList, serviceService)
              retryService.abortRetry();
              this.onListLoaded();
            }
          });
        });
      } else {
        this.onServicesReceived(serviceList, serviceService);
        this.onListLoaded();
        
      }
    });
  }

  private onListLoaded() {
    this.onServiceListLoaded.emit(true);
    this.setSelectedService(MobileTicketAPI.getSelectedService());
  }

  private onServicesReceived(serviceList, serviceService): void {
    this.onShowHideServiceFetchError.emit(false);
    if (serviceList.length === 1) {
      this.onServiceSelection.emit(serviceList[0].id);
      MobileTicketAPI.setServiceSelection(serviceList[0]);
    }
    this.services = serviceList;
    this.initListShadow();
  }

  ngAfterViewInit() {
    window.addEventListener('orientationchange', this.setListShadow, true);
    window.addEventListener('resize', this.setListShadow, true);
    window.addEventListener('scroll', this.setListShadow, true);
  }

  setSelectedService(selectedService: ServiceEntity) {
    if (selectedService) {
      this.onServiceSelection.emit(selectedService.id);
      for (let i = 0; i < this.services.length; ++i) {
        if (selectedService.id === this.services[i].id) {
          this.services[i].selected = true;
        }
      }
    }
  }

  resetSelections(selectedService: ServiceEntity) {
    if (selectedService) {
      this.onServiceSelection.emit(selectedService.id);
      for (let i = 0; i < this.services.length; ++i) {
        if (selectedService.id !== this.services[i].id) {
          this.services[i].selected = false;
        }
      }
    }
    else {
      this.onServiceSelection.emit(undefined);
    }
  }

  setListShadow = () => {
    this.processListShadow();
  }

  initListShadow = () => {
    setTimeout(() => {
      this.processListShadow();
    }, 200);
  }

  processListShadow() {
    if ((document.getElementsByClassName('table-child-list')[0].clientHeight +
      document.getElementsByClassName('table-child-list')[0].scrollTop
      >= document.getElementsByClassName('table-child-list')[0].scrollHeight - 5)) {
      this.showListShadow = false;
    }
    else {
      this.showListShadow = true;
    }
    this.onServiceListHeightUpdate.emit(this.showListShadow);
  }

}
