/* tslint:disable:no-unused-variable */
import { TestBed, async } from '@angular/core/testing';
import { ServicesContainerComponent } from './services-container.component';
import { ServicesComponent } from '../list/services.component';
import { BranchService } from '../../branch/branch.service';
import { ServiceService } from '../service.service';
import { ServiceComponent } from '../list-item/service.component';
import { Router } from '@angular/router';
import { QmRouterModule, RoutingComponents } from "../../router-module";
import { BranchServiceMok } from '../../branch/branch.service.mok'
import { ServiceServiceMok } from '../service.service.mok'
import { SortPipe } from '../../util/sort.pipe'


describe('ServicesContainer', () => {
  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        ServicesContainerComponent,
        ServicesComponent,
        ServiceComponent,
        SortPipe
      ],
      providers: [
        { provide: Router, useClass: QmRouterModule },
        { provide: BranchService, useClass: BranchServiceMok },
        { provide: ServiceService, useClass: ServiceServiceMok }
      ]
    });
  });


  it('Should create the ServicesContainer', async(() => {
    let fixture = TestBed.createComponent(ServicesContainerComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});

