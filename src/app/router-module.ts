import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BranchesContainerComponent } from './branch/list-container/branches-container.component';
import { ServicesContainerComponent } from './service/list-container/services-container.component';
import { TicketInfoContainerComponent } from './ticket-info/container/ticket-info-container.component';
import { AuthGuard } from './guard/index';

export const router: Routes = [
    { path: 'branches', component: BranchesContainerComponent },
    { path: 'services', component: ServicesContainerComponent },
    { path: 'ticket', component: TicketInfoContainerComponent, canActivate: [AuthGuard]},
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
