import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ServiceEntity } from '../../entities/service.entity';
import { TicketEntity } from '../../entities/ticket.entity';

declare var MobileTicketAPI: any;

@Component({
  selector: 'app-service',
  templateUrl: './service-tmpl.html',
  styleUrls: ['./service.css', '../../shared/css/common-styles.css']

})
export class ServiceComponent {
  @Input() name: string
  @Input() entity: ServiceEntity
  @Input() selected: boolean
  @Input() customersWaiting: string
  @Output() onSelection = new EventEmitter();

  constructor() {

   }

  onSelectService(service) {
    service.selected = !service.selected;
    if (service.selected) {
      this.onSelection.emit(service);
      MobileTicketAPI.setServiceSelection(service);
    } else {
      MobileTicketAPI.setServiceSelection(undefined);
    }
  }
}
