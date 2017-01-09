/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { BranchesContainerComponent } from '../list-container/branches-container.component';
import { BranchesComponent } from '../list/branches.component';
import { BranchComponent } from '../list-item/branch.component';
import { BranchService } from '../branch.service';
import { Router } from '@angular/router';
import { QmRouterModule, RoutingComponents } from "../../router-module";
import { BranchServiceMok } from '../branch.service.mok';
import { ConnectivityMessageComponent} from '../../shared/connectivity-message/connectivity-message.component';
import { RetryService } from '../../shared/retry.service';

describe('BranchesContainer', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        ConnectivityMessageComponent,
        BranchesContainerComponent,
        BranchesComponent,
        BranchComponent
      ],
      providers: [
         { provide: Router, useClass: QmRouterModule },
         { provide: BranchService, useClass: BranchServiceMok},
         RetryService
      ],

    });
  });

  it('Should create the BranchesContainer', async(() => {
    let fixture = TestBed.createComponent(BranchesContainerComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`Should show 'Welcome To Qmatic' `, async(() => {
    let fixture = TestBed.createComponent(BranchesContainerComponent);
    let component = fixture.debugElement.componentInstance;
    expect(component.subHeadingOne).toEqual('Welcome to Qmatic!');
  }));

  it(`Should show 'Do you want to get in line for one of our services? Start by selecting location.'`, async(() => {
    let fixture = TestBed.createComponent(BranchesContainerComponent);
    let component = fixture.debugElement.componentInstance;
    expect(component.subHeadingTwo).toEqual('Do you want to get in line for one of our services? Start by selecting location.');
  }));

});
