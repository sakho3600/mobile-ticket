import { Injectable } from '@angular/core';
import { BranchEntity } from '../entities/branch.entity';
import { PositionEntity } from '../entities/position.entity';
import { GpsPositionCalculator } from '../util/gps-distance-calculator';
import { Config } from '../config/config';

import 'rxjs/add/operator/map';

@Injectable()
export class BranchServiceMok {
 getBranches(onBrancheListReceived): void {

 }

 public getSelectedBranch(){
    return "Branch1";
  }
}
