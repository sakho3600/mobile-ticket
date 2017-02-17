import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BranchesContainerComponent } from './branch/list-container/branches-container.component';
import { ServicesContainerComponent } from './service/list-container/services-container.component';
import { TicketInfoContainerComponent } from './ticket-info/container/ticket-info-container.component';
import { VisitNotfoundComponent } from './ticket-info/visit-notfound/visit-notfound.component';
import { VisitCancelLeavelineGuard } from './ticket-info/visit-cancel/visit-cancel.leaveline.guard';
import { AuthGuard } from './guard/index';

export const router: Routes = [
    { path: 'branches', component: BranchesContainerComponent, canActivate: [AuthGuard] },
    { path: 'services', component: ServicesContainerComponent, canActivate: [AuthGuard] },
    { path: 'no_visit', component: VisitNotfoundComponent },
    { path: 'ticket', component: TicketInfoContainerComponent, canActivate: [AuthGuard], canDeactivate: [VisitCancelLeavelineGuard]},
    { path: '**', component: TicketInfoContainerComponent, canActivate: [AuthGuard] }
];

@NgModule(
    {
        imports: [
            RouterModule.forRoot(router)
        ],
        exports: [
            RouterModule
        ]
    }

)

export class QmRouterModule { }
export const RoutingComponents = [BranchesContainerComponent, ServicesContainerComponent, TicketInfoContainerComponent];
