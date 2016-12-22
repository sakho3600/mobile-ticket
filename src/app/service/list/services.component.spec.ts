/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ServicesComponent } from './services.component';
import { ServiceComponent } from '../list-item/service.component';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { QmRouterModule, RoutingComponents } from "../../router-module";
import { ServiceServiceMok } from '../service.service.mok'
import { SortPipe } from '../../util/sort.pipe'

describe('ServicesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ServicesComponent, ServiceComponent, SortPipe
      ],
      providers: [
        { provide: Router, useClass: QmRouterModule },
        { provide: ServiceService, useClass: ServiceServiceMok }
      ]
    });
  });

  it('Should create the ServicesComponent', async(() => {
    let fixture = TestBed.createComponent(ServicesComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

});