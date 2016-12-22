import { Component, Input } from '@angular/core';
import { BranchEntity } from '../../entities/branch.entity';
import { ServiceEntity } from '../../entities/service.entity';
import { TicketEntity } from '../../entities/ticket.entity';


declare var MobileTicketAPI: any;

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css', '../../shared/css/common-styles.css']
})
export class TicketComponent {
  public branchEntity: BranchEntity;
  public serviceEntity: ServiceEntity;
  public ticketEntity: TicketEntity;
  @Input() isTicketEndedOrDeleted: boolean;
  public ticketRemovedHeading: string;


  caption = 'This is your ticket number';
  constructor() {
    this.ticketRemovedHeading = 'Your ticket has been removed';
    this.getSelectedBranch();
    this.getSelectedService();
    this.getTicketInfo();
  }

  //MOVE ALL MobileTicketAPI calls to service class otherwise using things this way
  //makes unit test writing impossible

  public getSelectedBranch() {
    this.branchEntity = MobileTicketAPI.getSelectedBranch();
  }

  public getSelectedService() {
    this.serviceEntity = MobileTicketAPI.getSelectedService();
  }

  public getTicketInfo() {
    this.ticketEntity = MobileTicketAPI.getCurrentVisit();
  }

}
