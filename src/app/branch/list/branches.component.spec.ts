/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { BranchesComponent } from './branches.component';
import { BranchEntity } from '../../entities/branch.entity';
import { BranchComponent } from '../list-item/branch.component';
import { Config } from '../../config/config';
import { Router } from '@angular/router';
import { BranchService } from '../branch.service'
import { QmRouterModule, RoutingComponents } from "../../router-module";
import { BranchServiceMok } from '../branch.service.mok'


describe('BranchesComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BranchesComponent, BranchComponent
      ],
      providers: [
        { provide: Router, useClass: QmRouterModule },
        { provide: BranchService, useClass: BranchServiceMok}
      ]
    });
  });

  it('Should create the Branches component', async(() => {
    let fixture = TestBed.createComponent(BranchesComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('Should be true if there are branches available', async(() => {
    let fixture = TestBed.createComponent(BranchesComponent);
    let branchComponent = fixture.debugElement.componentInstance;
    let value = branchComponent.isBranchesAvailable([{}, {}]);
    expect(value).toEqual(true);
  }));

  it('Should not be true if there are no branches', async(() => {
    let fixture = TestBed.createComponent(BranchesComponent);
    let branchComponent = fixture.debugElement.componentInstance;
    let value = branchComponent.isBranchesAvailable([]);
    expect(value).toEqual(false);
  }));

  it('Should not be true if there are no branches', async(() => {
    let fixture = TestBed.createComponent(BranchesComponent);
    let branchComponent = fixture.debugElement.componentInstance;
    let value = branchComponent.isBranchesAvailable([]);
    expect(value).toEqual(false);
  }));

  // the line corresponds to 'noBranchesAvailableLabel' is commented in qm.branches-component, so following test is commented

  /*it('Should show "Sorry, there are no available branches close by. <a>Try again</a> at a different location."', async(() => {
    let fixture = TestBed.createComponent(Branches);
    let branchComponent = fixture.debugElement.componentInstance;
    expect(branchComponent.noBranchesAvailableLabel).toEqual("Sorry, there are no available branches close by. <a>Try again</a> at a different location.");
  }));*/

});
