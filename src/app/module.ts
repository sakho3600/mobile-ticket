import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { BranchesComponent } from './branch/list/branches.component';
import { BranchesContainerComponent } from './branch/list-container/branches-container.component';
import { BranchComponent } from './branch/list-item/branch.component';
import { BranchService } from './branch/branch.service';

import { ServicesComponent } from './service/list/services.component';
import { ServicesContainerComponent } from './service/list-container/services-container.component';
import { ServiceComponent } from './service/list-item/service.component';
import { ServiceService } from './service/service.service';

import { FrameLayoutComponent } from './shared/frame-layout/frame-layout.component';
import { TicketInfoContainerComponent } from './ticket-info/container/ticket-info-container.component';
import { TicketInfoService } from './ticket-info/ticket-info.service';

import {RootComponent} from './shared/root.component';

import { QmRouterModule, RoutingComponents } from "./router-module";
import { TicketComponent } from './ticket-info/ticket/ticket.component';
import { QueueComponent } from './ticket-info/queue/queue.component';
import { VisitCancelComponent } from './ticket-info/visit-cancel/visit-cancel.component';
import { AuthGuard } from './guard/auth.guard';
import { QueueItemComponent } from './ticket-info/queue-item/queue-item.component';
import { SortPipe } from './util/sort.pipe';
import { Config } from './config/config';

declare var MobileTicketAPI: any;

@NgModule({
  declarations: [
    BranchesComponent, BranchComponent, ServicesComponent, ServiceComponent, RootComponent, RoutingComponents, FrameLayoutComponent, TicketComponent, QueueComponent, VisitCancelComponent, QueueItemComponent,SortPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    QmRouterModule
  ],
  providers: [BranchService, ServiceService, TicketInfoService, AuthGuard,
  Config,
        { provide: APP_INITIALIZER, useFactory: (config: Config) => () => config.load(), deps: [Config], multi: true }
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [RootComponent]
})
export class AppModule {
  constructor() {
    MobileTicketAPI.init();
  }
}
