import {BrowserModule} from '@angular/platform-browser';
import {NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule, Http} from '@angular/http';
import {Router} from '@angular/router';
import {BranchesComponent} from './branch/list/branches.component';
import {BranchesContainerComponent} from './branch/list-container/branches-container.component';
import {BranchComponent} from './branch/list-item/branch.component';
import {BranchService} from './branch/branch.service';
import {ServicesComponent} from './service/list/services.component';
import {ServicesContainerComponent} from './service/list-container/services-container.component';
import {ServiceComponent} from './service/list-item/service.component';
import {ServiceService} from './service/service.service';


import {FrameLayoutComponent} from './shared/frame-layout/frame-layout.component';
import {NotSupportComponent} from './shared/not-support/not-support.component';
import {TicketInfoContainerComponent} from './ticket-info/container/ticket-info-container.component';
import {TicketInfoService} from './ticket-info/ticket-info.service';

import {RootComponent} from './shared/root.component';

import {QmRouterModule, RoutingComponents} from "./router-module";
import {TicketComponent} from './ticket-info/ticket/ticket.component';
import {QueueComponent} from './ticket-info/queue/queue.component';
import {VisitCancelComponent} from './ticket-info/visit-cancel/visit-cancel.component';
import {AuthGuard} from './guard/auth.guard';
import {QueueItemComponent} from './ticket-info/queue-item/queue-item.component';
import {SortPipe} from './util/sort.pipe';
import {Config} from './config/config';
import {Locale} from './locale/locale';
import {LocationService} from './util/location';
import {TranslateModule, TranslateStaticLoader, TranslateLoader} from 'ng2-translate';

import {ConnectivityMessageComponent} from './shared/connectivity-message/connectivity-message.component';

import  {RetryService} from './shared/retry.service';
import {VisitNotfoundComponent} from './ticket-info/visit-notfound/visit-notfound.component';
import {VisitCancelLeavelineGuard} from './ticket-info/visit-cancel/visit-cancel.leaveline.guard';
import {ConfirmDialogComponent} from "./shared/confirm-dialog/confirm-dialog.component";
import {ConfirmDialogService} from "./shared/confirm-dialog/confirm-dialog.service";
import {AlertDialogComponent} from "./shared/alert-dialog/alert-dialog.component";
import {AlertDialogService} from "./shared/alert-dialog/alert-dialog.service";


declare var MobileTicketAPI:any;


@NgModule({
  declarations: [
    BranchesComponent, BranchComponent, ServicesComponent, ServiceComponent,
    RootComponent, RoutingComponents, FrameLayoutComponent, TicketComponent, NotSupportComponent,
    QueueComponent, VisitCancelComponent, QueueItemComponent, SortPipe,
    ConnectivityMessageComponent, VisitNotfoundComponent, ConfirmDialogComponent, AlertDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    QmRouterModule,
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (http:Http) => new TranslateStaticLoader(http, './app/locale', '.json'),
      deps: [Http]
    })
  ],
  providers: [BranchService, ServiceService, TicketInfoService, AuthGuard, ConfirmDialogService, AlertDialogService,
    VisitCancelLeavelineGuard, RetryService, Locale, LocationService, SortPipe,
    Config,
    {provide: APP_INITIALIZER, useFactory: (config:Config) => () => config.load(), deps: [Config], multi: true}
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [RootComponent]
})

export class AppModule {
  constructor() {
    MobileTicketAPI.init();
    this.setTouchDeviceTag();
  }

  isTouchDevice() {
    return (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
  };

  setTouchDeviceTag() {
    if (this.isTouchDevice()) {
      document.getElementsByTagName("body")[0].className = "touch";
    } else {
      document.getElementsByTagName("body")[0].className = "no-touch";
    }
  }
}
