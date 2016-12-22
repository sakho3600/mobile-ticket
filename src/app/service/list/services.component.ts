import { Component, Input, HostListener } from '@angular/core';
import { ServiceService } from '../service.service';
import { ServiceEntity } from '../../entities/service.entity';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-services',
  templateUrl: './services-tmpl.html',
  styleUrls: ['./services.css', '../../shared/css/common-styles.css']
})
export class ServicesComponent {
  public services: Array<ServiceEntity>;
  constructor(private serviceService: ServiceService) {
    serviceService.getServices((serviceList: Array<ServiceEntity>) => {
      if (serviceList.length == 1) {
        MobileTicketAPI.setServiceSelection(serviceList[0]);
      }
      this.services = serviceList;
      serviceService.setServiceInformation(this.services);
    });
  }

  resetSelections(selectedService: ServiceEntity) {
    for (let i = 0; i < this.services.length; ++i) {
      if (selectedService.id != this.services[i].id) {
        this.services[i].selected = false;
      }
    }
  }
}
